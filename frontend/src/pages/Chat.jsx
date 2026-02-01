import { useState } from "react";
import ChatWindow from "../components/chat/ChatWindow";
import { MessageCircle, Phone, HelpCircle } from "lucide-react";

const Chat = () => {
  const [showInfo, setShowInfo] = useState(false);

  return (
    <div className="h-[calc(100vh-64px)] bg-gradient-to-b from-slate-950 to-emerald-950/30 flex flex-col relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500 rounded-full mix-blend-screen filter blur-3xl opacity-10 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500 rounded-full mix-blend-screen filter blur-3xl opacity-10 animate-pulse" style={{ animationDelay: "2s" }}></div>
      </div>

      {/* Quick Actions Bar */}
      <div className="relative z-10 border-b border-emerald-400/20 bg-slate-900/50 backdrop-blur-md px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm text-emerald-200">AI Pharmacist Online</span>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowInfo(!showInfo)}
              className="p-2 hover:bg-emerald-500/20 rounded-lg transition-colors text-emerald-300 hover:text-emerald-200"
              title="Help"
            >
              <HelpCircle className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Info Banner */}
        {showInfo && (
          <div className="mt-3 p-4 bg-emerald-500/20 border border-emerald-400/40 rounded-lg text-sm text-emerald-200 animate-in fade-in slide-in-from-top">
            <h4 className="font-semibold mb-2 text-emerald-300">💡 How to use:</h4>
            <ul className="space-y-1 text-xs">
              <li>✓ Describe your symptoms or the medicine you need</li>
              <li>✓ Ask about availability, prices, or side effects</li>
              <li>✓ Get AI-powered recommendations from real inventory</li>
              <li>✓ Place orders directly in chat</li>
            </ul>
          </div>
        )}
      </div>

      {/* Chat Window Container */}
      <div className="relative z-10 flex-1 overflow-hidden">
        <ChatWindow />
      </div>

      {/* Footer Info */}
      <div className="relative z-10 border-t border-emerald-400/20 bg-slate-900/50 backdrop-blur-md px-6 py-2">
        <p className="text-xs text-emerald-200/60 text-center">
          Your AI pharmacist is here 24/7 • Verified & Safe • HIPAA Compliant
        </p>
      </div>
    </div>
  );
};

export default Chat;