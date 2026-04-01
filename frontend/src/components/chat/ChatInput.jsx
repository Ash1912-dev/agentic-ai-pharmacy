import { useState } from "react";
import { Send, Loader } from "lucide-react";

const ChatInput = ({ onSend, disabled, placeholder }) => {
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim() || disabled) return;
    onSend(input);
    setInput("");
  };

  return (
    <div className="flex gap-3 items-end">
      <input
        className="flex-1 bg-emerald-500/10 border border-emerald-400/40 rounded-2xl px-5 py-3 text-sm text-white placeholder-emerald-300/50 focus:outline-none focus:border-emerald-300/80 focus:ring-2 focus:ring-emerald-400/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        placeholder={placeholder || (disabled ? "AI is processing..." : "Type your message... (or press Enter)")}
        value={input}
        disabled={disabled}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), handleSend())}
      />
      <button
        onClick={handleSend}
        disabled={disabled || !input.trim()}
        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold rounded-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-emerald-500/50"
      >
        {disabled ? (
          <Loader className="w-4 h-4 animate-spin" />
        ) : (
          <Send className="w-4 h-4" />
        )}
        <span className="hidden sm:inline">Send</span>
      </button>
    </div>
  );
};

export default ChatInput;