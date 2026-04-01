import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import { sendMessageToAgent } from "../../api/agent.api";
import { useAuth } from "../../context/AuthContext";
import axiosInstance from "../../api/axiosInstance";
import { MessageCircle, Loader, AlertTriangle, ShoppingCart } from "lucide-react";

const ChatWindow = () => {
  const { user } = useAuth();
  const location = useLocation();
  const bottomRef = useRef(null);

  const isAiChatEnabled =
    String(import.meta.env.VITE_AI_CHAT_ENABLED ?? "true").toLowerCase() === "true";

  const [isTyping, setIsTyping] = useState(false);
  const [isOrderingFallback, setIsOrderingFallback] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "agent",
      text: isAiChatEnabled
        ? "👋 Hey! I'm your AI Pharmacy Assistant.\n\n" +
          "Here's what I can do:\n" +
          "🔍 Search & order medicines instantly\n" +
          "📋 Extract medicines from prescriptions\n" +
          "💊 Suggest refills & manage inventory\n" +
          "💬 Answer any pharmacy questions\n\n" +
          "What can I help you with today?"
        : "🛑 AI chat is paused for this deployment to control usage.\n\n" +
          "✅ You can still place a quick Paracetamol order below.\n" +
          "✅ Your order will appear in Orders tab.\n" +
          "✅ You can still set intake reminders as usual.",
      timestamp: new Date(),
    },
  ]);

  const placeParacetamolOrder = async (quantity = 10) => {
    setIsOrderingFallback(true);

    try {
      const searchRes = await axiosInstance.get("/api/medicines/search", {
        params: { q: "paracetamol" },
      });

      const medicines = Array.isArray(searchRes.data) ? searchRes.data : [];
      const selectedMedicine = medicines.find((med) => med.inStock) || medicines[0];

      if (!selectedMedicine?._id) {
        setMessages((prev) => [
          ...prev,
          {
            sender: "agent",
            text: "Paracetamol is currently unavailable. Please check Medicines tab.",
            timestamp: new Date(),
            type: "error",
          },
        ]);
        return;
      }

      const orderRes = await axiosInstance.post("/api/orders/create", {
        medicineId: selectedMedicine._id,
        quantity,
      });

      localStorage.setItem("aiPausedMode", "true");

      setMessages((prev) => [
        ...prev,
        {
          sender: "agent",
          text:
            orderRes.data?.message ||
            `Paracetamol order placed successfully (Qty: ${quantity}). You can view it in Orders tab and set reminders.`,
          timestamp: new Date(),
          type: "order",
        },
      ]);
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        "Failed to place fallback order. Please try from Medicines tab.";

      setMessages((prev) => [
        ...prev,
        {
          sender: "agent",
          text: `⚠️ ${message}`,
          timestamp: new Date(),
          type: "error",
        },
      ]);
    } finally {
      setIsOrderingFallback(false);
    }
  };

  const handleUserMessage = async (text) => {
    if (!isAiChatEnabled) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "user",
          text,
          timestamp: new Date(),
        },
        {
          sender: "agent",
          text:
            "AI usage is paused for this deployment. Use the quick Paracetamol order button below, then check Orders tab for status and reminder setup.",
          timestamp: new Date(),
        },
      ]);
      return;
    }

    const userMessage = { 
      sender: "user", 
      text,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    try {
      // Send message to agent
      const res = await sendMessageToAgent(text);
      
      // FIX: Access reply correctly from response
      const reply = res.reply || res.data?.reply || "No response";

      const isOrderSuccess =
        reply.toLowerCase().includes("order confirmed") ||
        reply.toLowerCase().includes("order placed successfully");

      const agentMessage = {
        sender: "agent",
        text: reply,
        timestamp: new Date(),
        ...(isOrderSuccess && { type: "order" }),
      };

      setMessages((prev) => [...prev, agentMessage]);
    } catch (err) {
      console.error("Chat error:", err);
      setMessages((prev) => [
        ...prev,
        {
          sender: "agent",
          text: "⚠️ Something went wrong. Please try again.",
          timestamp: new Date(),
          type: "error",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  // Auto-start chat from OCR context
  useEffect(() => {
    if (isAiChatEnabled && location.state?.context && user?._id) {
      handleUserMessage(location.state.context);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isAiChatEnabled]);

  // Auto-scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-slate-950 to-emerald-950/30 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500 rounded-full mix-blend-screen filter blur-3xl opacity-10 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500 rounded-full mix-blend-screen filter blur-3xl opacity-10 animate-pulse" style={{ animationDelay: "2s" }}></div>
      </div>

      {/* Header */}
      <div className="relative z-10 border-b border-emerald-400/20 bg-slate-900/50 backdrop-blur-md px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-500/30 rounded-lg">
            <MessageCircle className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">AI Pharmacy Assistant</h2>
            <p className="text-xs text-emerald-200/60">
              {isAiChatEnabled
                ? "Always available • Smart & Fast"
                : "AI paused mode • Quick manual ordering available"}
            </p>
          </div>
        </div>
      </div>

      {!isAiChatEnabled && (
        <div className="relative z-10 mx-6 mt-4 p-4 rounded-xl border border-yellow-400/40 bg-yellow-500/10">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-300 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm text-yellow-100 mb-3">
                AI chat is paused on this hosted demo. You can still place a hardcoded Paracetamol order and continue with reminders from Orders.
              </p>
              <button
                onClick={() => placeParacetamolOrder(10)}
                disabled={isOrderingFallback}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold disabled:opacity-60"
              >
                {isOrderingFallback ? (
                  <Loader className="w-4 h-4 animate-spin" />
                ) : (
                  <ShoppingCart className="w-4 h-4" />
                )}
                Order Paracetamol (10)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Messages Container */}
      <div className="relative z-10 flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg, idx) => (
          <ChatMessage key={idx} message={msg} />
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="flex items-center gap-2 px-4 py-3 bg-emerald-500/20 border border-emerald-400/30 rounded-2xl rounded-bl-none backdrop-blur">
              <Loader className="w-4 h-4 text-emerald-400 animate-spin" />
              <span className="text-sm text-emerald-300">AI is thinking...</span>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input Area */}
      <div className="relative z-10 border-t border-emerald-400/20 bg-slate-900/50 backdrop-blur-md p-4">
        <ChatInput
          onSend={handleUserMessage}
          disabled={isTyping || !isAiChatEnabled}
          placeholder={
            !isAiChatEnabled
              ? "AI chat is paused for this hosted demo"
              : undefined
          }
        />
      </div>
    </div>
  );
};

export default ChatWindow;
