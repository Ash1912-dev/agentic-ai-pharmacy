const { generateAIResponse } = require("../services/ai.service");
const { tools } = require("../services/tool.service");
const { pharmacistSystemPrompt } = require("../agents/pharmacist.agent");
const langfuse = require("../config/langfuse");

const agentMessage = async (req, res) => {
  const { userId, message } = req.body;

  if (!userId || !message) {
    return res.status(400).json({
      message: "userId and message are required",
    });
  }

  // ✅ Create trace
  const trace = await langfuse.trace({
    name: "pharmacist-agent",
    userId,
    input: message,
  });

  try {
    // 1️⃣ Build prompt
    const prompt = `
${pharmacistSystemPrompt}

User message:
"${message}"

Respond in JSON only:
{
  "medicine": "",
  "quantity": number | null,
  "needsClarification": boolean,
  "clarificationQuestion": ""
}
`;

    // 2️⃣ AI intent extraction span
    const aiSpan = await langfuse.span({
      traceId: trace.id,
      name: "ai-intent-extraction",
      input: prompt,
    });

    let text = await generateAIResponse(prompt);
    text = text.replace(/```json|```/g, "").trim();

    await langfuse.span({
      traceId: trace.id,
      parentSpanId: aiSpan.id,
      name: "ai-output",
      output: text,
    });

    const intent = JSON.parse(text);

    // 3️⃣ Clarification
    if (intent.needsClarification) {
      await langfuse.trace({
        id: trace.id,
        output: "Clarification requested",
      });

      return res.json({
        reply: intent.clarificationQuestion,
      });
    }

    if (!intent.medicine || !intent.quantity) {
      await langfuse.trace({
        id: trace.id,
        output: "Missing medicine or quantity",
      });

      return res.json({
        reply: "Please tell me the medicine name and quantity clearly.",
      });
    }

    // 4️⃣ Search medicine
    const searchSpan = await langfuse.span({
      traceId: trace.id,
      name: "search-medicine",
      input: intent.medicine,
    });

    const medicines = await tools.searchMedicine(intent.medicine);

    await langfuse.span({
      traceId: trace.id,
      parentSpanId: searchSpan.id,
      name: "search-result",
      output: medicines,
    });

    if (!medicines.length) {
      await langfuse.trace({
        id: trace.id,
        output: "Medicine not found",
      });

      return res.json({
        reply: "I couldn’t find that medicine. Please check the name.",
      });
    }

    const medicine = medicines[0];

    // 5️⃣ Inventory check
    const inventorySpan = await langfuse.span({
      traceId: trace.id,
      name: "check-inventory",
      input: {
        medicineId: medicine._id,
        quantity: intent.quantity,
      },
    });

    const inventory = await tools.checkInventory(
      medicine._id,
      intent.quantity
    );

    await langfuse.span({
      traceId: trace.id,
      parentSpanId: inventorySpan.id,
      name: "inventory-result",
      output: inventory,
    });

    if (!inventory.available) {
      await langfuse.trace({
        id: trace.id,
        output: "Out of stock",
      });

      return res.json({
        reply: "Sorry, this medicine is currently out of stock.",
      });
    }

    // 6️⃣ Create order
    const orderSpan = await langfuse.span({
      traceId: trace.id,
      name: "create-order",
      input: {
        userId,
        medicineId: medicine._id,
        quantity: intent.quantity,
      },
    });

    const orderResult = await tools.createOrder({
      userId,
      medicineId: medicine._id,
      quantity: intent.quantity,
    });

    await langfuse.span({
      traceId: trace.id,
      parentSpanId: orderSpan.id,
      name: "order-result",
      output: orderResult,
    });

    // ✅ Final trace update
    await langfuse.trace({
      id: trace.id,
      output: "Order placed successfully",
    });

    return res.json({
      reply: orderResult.message,
    });

  } catch (error) {
    console.error("🔥 AGENT ERROR FULL:", error);

    await langfuse.trace({
      id: trace.id,
      error: error.message || error.toString(),
    });

    return res.status(500).json({
      message: "Agent failed",
      error: error.message || error.toString(),
    });
  }
};

module.exports = { agentMessage };
