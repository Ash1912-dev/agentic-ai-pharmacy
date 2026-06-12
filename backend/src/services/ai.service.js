const Groq = require("groq-sdk");
const User = require("../models/User.model");
const Order = require("../models/Order.model");
const UserMedicineCourse = require("../models/UserMedicineCourse.model");
const DailyIntakeReminder = require("../models/DailyIntakeReminder.model");
const Medicine = require("../models/Medicine.model");
const Inventory = require("../models/Inventory.model");
const { createOrder } = require("./order.service");

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || "placeholder_key" });

const SYSTEM_PROMPT = `
You are RxAssist, a professional AI Pharmacist assistant embedded in a licensed pharmacy platform. You assist customers with medication queries, order guidance, and health information.

---

### IDENTITY & ROLE

You are a knowledgeable, empathetic pharmacist. You speak clearly, avoid unnecessary jargon, and always prioritize patient safety. You are NOT a doctor — you are a pharmacist. You dispense information, not diagnoses.

---

### CONVERSATION RULES (Anti-Hallucination)

1. NEVER fabricate drug names, dosages, or interactions. If you are not certain, say so explicitly.
2. ONLY recommend medicines that exist in the pharmacy's live inventory (provided via the \`get_medicines\` tool). Do not suggest medications outside this list.
3. ALWAYS ground medication advice in the user's provided history (retrieved via \`get_user_history\` tool). Do not assume prior conditions or allergies that are not in the history.
4. If asked about a drug interaction, use the \`check_drug_interaction\` tool. Never guess interactions from training data alone.
5. If the user's question requires a doctor's prescription or diagnosis, clearly say: "This requires a consultation with a licensed doctor. I can help you once you have a prescription."
6. NEVER invent order IDs, prescription statuses, or inventory numbers. Always fetch live data.
7. If you cannot find something in the tools or database, respond: "I don't have that information right now. Please speak with our in-store pharmacist."

---

### MEMORY & HISTORY

At the start of every conversation:
- Retrieve the user's full medical and order history via \`get_user_history\`.
- Load all active medication courses and current reminders.
- Reference this history naturally throughout the conversation ("I can see you're currently on Metformin — are you asking about this medication?").

Within a session, maintain full message history in the \`messages[]\` array passed to the model. Never truncate or discard prior turns.

---

### TOOL CALL PATTERN

- Always call the relevant tool FIRST, then synthesize the response.
- If a tool returns no results, say so honestly. Never fill the gap with assumed data.

---

### SAFETY DISCLAIMERS (Always apply)

- For any prescription medication: "Please ensure you have a valid prescription before purchasing."
- For dosage queries: "Dosage guidance is general. Always follow your doctor's prescription."
- For symptom-based queries: "I can suggest over-the-counter options, but please consult a doctor for diagnosis."
- For emergencies: "If this is a medical emergency, please call emergency services immediately."

---

### WHATSAPP FLOW AWARENESS

When a conversation is initiated from WhatsApp (indicated by source: "whatsapp" in the context):
- Keep responses under 300 characters unless the user asks for detail.
- Use numbered lists for multi-step instructions.
- Always end with a clear call to action: "Reply 1 to confirm" / "Reply ORDER to place this order."

---

### TONE & FORMAT

- Warm, professional, and concise.
- Use plain language. No medical Latin unless the user uses it first.
- Format responses in short paragraphs or bullet points — never walls of text.
- For order confirmations, always repeat: medicine name, quantity, price, and estimated delivery.
`;

const TOOLS_DEFINITIONS = [
  {
    type: "function",
    function: {
      name: "get_medicines",
      description: "Retrieve the live inventory of medicines (returns name, category, price, stock, requiresPrescription).",
      parameters: {
        type: "object",
        properties: {}
      }
    }
  },
  {
    type: "function",
    function: {
      name: "get_user_history",
      description: "Retrieve the user's profile, recent orders, active medicine courses, and intake reminders.",
      parameters: {
        type: "object",
        properties: {
          userId: {
            type: "string",
            description: "The ID of the user."
          }
        }
      }
    }
  },
  {
    type: "function",
    function: {
      name: "check_drug_interaction",
      description: "Check if two medicines have a known interaction. Never guess interactions from training data alone.",
      parameters: {
        type: "object",
        properties: {
          med1: {
            type: "string",
            description: "First medicine name"
          },
          med2: {
            type: "string",
            description: "Second medicine name"
          }
        },
        required: ["med1", "med2"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "create_order",
      description: "Create an order for a medicine.",
      parameters: {
        type: "object",
        properties: {
          userId: {
            type: "string",
            description: "The ID of the user placing the order."
          },
          medicineId: {
            type: "string",
            description: "The ID of the medicine to order."
          },
          quantity: {
            type: "integer",
            description: "The quantity of medicine to order."
          }
        },
        required: ["medicineId", "quantity"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "create_reminder",
      description: "Create a daily intake reminder for a medicine.",
      parameters: {
        type: "object",
        properties: {
          userId: {
            type: "string",
            description: "The ID of the user."
          },
          medicineId: {
            type: "string",
            description: "The ID of the medicine to create a reminder for."
          },
          times: {
            type: "array",
            items: {
              type: "string"
            },
            description: "Array of daily times in 24h format (e.g. ['09:00', '21:00'])"
          },
          days: {
            type: "integer",
            description: "Duration in days for the reminder."
          }
        },
        required: ["medicineId", "times", "days"]
      }
    }
  }
];

const DRUG_INTERACTIONS = [
  {
    meds: ["aspirin", "warfarin"],
    severity: "High",
    description: "Combining aspirin and warfarin increases the risk of serious bleeding (gastrointestinal bleeding, bruising, etc.)."
  },
  {
    meds: ["ibuprofen", "aspirin"],
    severity: "Moderate",
    description: "Ibuprofen can interfere with the cardioprotective effect of low-dose aspirin and increase the risk of gastrointestinal ulcers and bleeding."
  },
  {
    meds: ["sildenafil", "nitroglycerin"],
    severity: "Severe / Critical",
    description: "Co-administration of sildenafil and nitroglycerin or other nitrates can cause a severe, potentially life-threatening drop in blood pressure (hypotension)."
  },
  {
    meds: ["simvastatin", "amlodipine"],
    severity: "Moderate",
    description: "Amlodipine increases the concentration of simvastatin in the blood, which can elevate the risk of muscle pain, tenderness, or weakness (myopathy/rhabdomyolysis). Limit simvastatin dose to 20mg daily."
  },
  {
    meds: ["lisinopril", "potassium"],
    severity: "Moderate",
    description: "Taking lisinopril (an ACE inhibitor) with potassium supplements can lead to hyperkalemia (high potassium levels in the blood), which affects heart rhythm."
  },
  {
    meds: ["metformin", "contrast"],
    severity: "High",
    description: "Iodinated contrast dye can cause temporary kidney dysfunction, which increases metformin levels and the risk of lactic acidosis. Metformin should be temporarily suspended before or at the time of the procedure."
  },
  {
    meds: ["spironolactone", "lisinopril"],
    severity: "High",
    description: "Combining spironolactone and lisinopril increases the risk of severe hyperkalemia. Close monitoring of serum potassium is essential."
  }
];

// In-memory session store
const sessionStore = new Map();

async function execute_get_medicines() {
  const medicines = await Medicine.find({ isActive: true }).sort({ name: 1 });
  const medicinesWithStock = await Promise.all(
    medicines.map(async (med) => {
      const inventory = await Inventory.findOne({ medicine: med._id });
      const stock = inventory ? Number(inventory.stock || 0) : 0;
      return {
        id: med._id.toString(),
        name: med.name,
        brand: med.brand,
        category: med.category,
        price: med.price,
        stock,
        requiresPrescription: med.requiresPrescription
      };
    })
  );
  return JSON.stringify(medicinesWithStock);
}

async function execute_get_user_history(userId) {
  try {
    const [user, recentOrders, activeCourses, activeReminders] = await Promise.all([
      User.findById(userId).lean(),
      Order.find({ user: userId })
        .sort({ createdAt: -1 })
        .limit(10)
        .populate("medicine", "name brand price category requiresPrescription")
        .lean(),
      UserMedicineCourse.find({ user: userId, remainingQuantity: { $gt: 0 } })
        .populate("medicine", "name brand")
        .lean(),
      DailyIntakeReminder.find({ user: userId, enabled: true })
        .populate("medicine", "name")
        .lean(),
    ]);

    return JSON.stringify({
      userId,
      name: user?.name,
      phone: user?.phone,
      gender: user?.gender,
      recentOrders: recentOrders.map((o) => ({
        id: o._id.toString(),
        medicine: o.medicine?.name,
        medicineId: o.medicine?._id?.toString(),
        quantity: o.quantity,
        status: o.status,
        date: o.createdAt,
      })),
      activeCourses: activeCourses.map((c) => ({
        medicine: c.medicine?.name,
        medicineId: c.medicine?._id?.toString(),
        remaining: c.remainingQuantity,
        total: c.totalQuantity,
      })),
      activeReminders: activeReminders.map((r) => ({
        id: r._id.toString(),
        medicine: r.medicine?.name,
        medicineId: r.medicine?._id?.toString(),
        times: r.times,
        endDate: r.endDate,
        enabled: r.enabled
      })),
    });
  } catch (err) {
    console.error("⚠️ Failed to get user history:", err.message);
    return JSON.stringify({ error: err.message });
  }
}

function execute_check_drug_interaction(med1, med2) {
  const m1 = String(med1 || "").toLowerCase().trim();
  const m2 = String(med2 || "").toLowerCase().trim();

  const match = DRUG_INTERACTIONS.find(item => {
    const hasMed1 = item.meds.some(m => m1.includes(m) || m.includes(m1));
    const hasMed2 = item.meds.some(m => m2.includes(m) || m.includes(m2));
    return hasMed1 && hasMed2;
  });

  if (match) {
    return JSON.stringify({
      interactionFound: true,
      severity: match.severity,
      description: match.description
    });
  } else {
    return JSON.stringify({
      interactionFound: false,
      message: "No severe interactions found in our database for these two medications. Always consult a doctor for official guidance."
    });
  }
}

async function execute_create_order(userId, medicineId, quantity) {
  try {
    const result = await createOrder({ userId, medicineId, quantity: Number(quantity) });
    return JSON.stringify({
      success: true,
      message: result.message,
      orderId: result.order?._id?.toString(),
      status: result.order?.status,
      isFulfilled: result.order?.isFulfilled
    });
  } catch (err) {
    return JSON.stringify({
      success: false,
      error: err.message
    });
  }
}

async function execute_create_reminder(userId, medicineId, times, days) {
  try {
    if (!userId || !medicineId || !times || !days) {
      return JSON.stringify({
        success: false,
        error: "Missing required fields: userId, medicineId, times, days"
      });
    }

    const endDate = new Date();
    endDate.setDate(endDate.getDate() + Number(days));

    const reminder = await DailyIntakeReminder.create({
      user: userId,
      medicine: medicineId,
      times,
      endDate,
    });

    return JSON.stringify({
      success: true,
      message: "Daily intake reminder created successfully.",
      reminderId: reminder._id.toString(),
      times: reminder.times,
      endDate: reminder.endDate
    });
  } catch (err) {
    return JSON.stringify({
      success: false,
      error: err.message
    });
  }
}

/**
 * Main pharmacist chat function with Groq function/tool calling.
 * Maintains session history.
 */
async function pharmacistChat({ userId, sessionId, message, userContext = {}, source = "web" }) {
  if (!process.env.GROQ_API_KEY || process.env.GROQ_API_KEY === "your_groq_api_key") {
    throw new Error("GROQ_API_KEY is missing or empty. Please configure a valid Groq API key in your backend .env file.");
  }

  if (!sessionStore.has(sessionId)) {
    sessionStore.set(sessionId, []);
  }

  const history = sessionStore.get(sessionId);

  // Append new user message
  history.push({ role: "user", content: message });

  // Build system prompt with source awareness
  const systemContent = source === "whatsapp"
    ? SYSTEM_PROMPT + "\n\n[ACTIVE MODE: WhatsApp — keep responses under 300 chars, use numbered lists, end with clear CTA]"
    : SYSTEM_PROMPT;

  let loopCount = 0;
  const maxLoops = 5;
  let done = false;
  let reply = "";

  while (!done && loopCount < maxLoops) {
    loopCount++;

    const response = await groq.chat.completions.create({
      model: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemContent },
        ...history
      ],
      tools: TOOLS_DEFINITIONS,
      tool_choice: "auto",
      temperature: 0.2,
      max_tokens: 1024,
      top_p: 0.85,
    });

    const choice = response.choices[0];
    const assistantMessage = choice.message;

    if (assistantMessage.tool_calls && assistantMessage.tool_calls.length > 0) {
      // Append the assistant's message with tool calls to history
      history.push(assistantMessage);

      // Execute each tool call
      for (const toolCall of assistantMessage.tool_calls) {
        const functionName = toolCall.function.name;
        let functionArgs = {};
        try {
          functionArgs = JSON.parse(toolCall.function.arguments || "{}");
        } catch (e) {
          console.error("Failed to parse tool args:", toolCall.function.arguments);
        }

        console.log(`🤖 RxAssist executing tool: ${functionName}`, functionArgs);

        let result = "";
        try {
          if (functionName === "get_medicines") {
            result = await execute_get_medicines();
          } else if (functionName === "get_user_history") {
            const uid = functionArgs.userId || userId;
            result = await execute_get_user_history(uid);
          } else if (functionName === "check_drug_interaction") {
            result = execute_check_drug_interaction(functionArgs.med1, functionArgs.med2);
          } else if (functionName === "create_order") {
            const uid = functionArgs.userId || userId;
            result = await execute_create_order(uid, functionArgs.medicineId, functionArgs.quantity);
          } else if (functionName === "create_reminder") {
            const uid = functionArgs.userId || userId;
            result = await execute_create_reminder(uid, functionArgs.medicineId, functionArgs.times, functionArgs.days);
          } else {
            result = JSON.stringify({ error: `Tool ${functionName} not found.` });
          }
        } catch (error) {
          console.error(`Error in tool execution (${functionName}):`, error);
          result = JSON.stringify({ error: error.message || error.toString() });
        }

        // Append tool result to history
        history.push({
          role: "tool",
          tool_call_id: toolCall.id,
          name: functionName,
          content: result
        });
      }
    } else {
      reply = assistantMessage.content || "";
      history.push(assistantMessage);
      done = true;
    }
  }

  // Cap history at 40 messages to avoid context window blowup
  if (history.length > 40) {
    history.splice(0, history.length - 40);
  }

  return reply;
}

function clearSession(sessionId) {
  sessionStore.delete(sessionId);
}

module.exports = { pharmacistChat, clearSession, SYSTEM_PROMPT };
