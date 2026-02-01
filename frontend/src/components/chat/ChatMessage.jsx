import { CheckCircle, AlertCircle } from "lucide-react";

const ChatMessage = ({ message }) => {
  const isUser = message.sender === "user";

  // Order confirmation card
  if (message.type === "order") {
    return (
      <div className="flex justify-center">
        <div className="w-full max-w-md p-5 bg-gradient-to-r from-emerald-500/30 to-teal-500/30 border border-emerald-400/50 rounded-2xl shadow-lg backdrop-blur-md">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-6 h-6 text-emerald-400 flex-shrink-0 mt-1 animate-bounce" />
            <div>
              <h4 className="font-semibold text-emerald-300 mb-2">
                ✅ Order Placed Successfully
              </h4>
              <p className="text-emerald-200/80 text-sm whitespace-pre-line leading-relaxed">
                {message.text}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error message
  if (message.type === "error") {
    return (
      <div className="flex justify-center">
        <div className="w-full max-w-md p-5 bg-gradient-to-r from-red-500/30 to-red-600/20 border border-red-400/50 rounded-2xl shadow-lg backdrop-blur-md">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
            <p className="text-red-300 text-sm whitespace-pre-line leading-relaxed">
              {message.text}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Regular message
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-md px-5 py-3 rounded-2xl text-sm whitespace-pre-line leading-relaxed backdrop-blur-md transition-all duration-300 ${
          isUser
            ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-br-none shadow-lg hover:shadow-emerald-500/50"
            : "bg-emerald-500/20 text-emerald-100 rounded-bl-none border border-emerald-400/40 hover:border-emerald-300/60 shadow-lg"
        }`}
      >
        {message.text}
      </div>
    </div>
  );
};

export default ChatMessage;
