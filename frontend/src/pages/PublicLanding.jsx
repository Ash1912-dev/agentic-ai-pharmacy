import { useNavigate } from "react-router-dom";
import { Pill, MessageSquare, Zap, Shield } from "lucide-react";

const PublicLanding = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-950 flex flex-col relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500 rounded-full mix-blend-screen filter blur-3xl opacity-15 animate-pulse"></div>
        <div className="absolute -bottom-20 right-1/3 w-96 h-96 bg-teal-500 rounded-full mix-blend-screen filter blur-3xl opacity-15 animate-pulse" style={{ animationDelay: "2s" }}></div>
        <div className="absolute top-1/2 -right-20 w-80 h-80 bg-cyan-600 rounded-full mix-blend-screen filter blur-3xl opacity-10 animate-pulse" style={{ animationDelay: "4s" }}></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-12 max-w-4xl">
          {/* Logo/Icon */}
          <div className="flex flex-col items-center justify-center gap-4 mb-8 px-4">
            <div className="p-4 bg-emerald-500/20 rounded-2xl backdrop-blur-md border border-emerald-400/40">
              <Pill className="w-10 h-10 text-emerald-400" />
            </div>
            <h1 className="text-5xl sm:text-6xl font-black bg-gradient-to-r from-emerald-300 via-teal-300 to-cyan-300 bg-clip-text text-transparent drop-shadow-lg leading-tight pb-2">
              Agentic AI<br />Pharmacy
            </h1>
          </div>

          {/* Tagline */}
          <p className="text-xl sm:text-2xl text-emerald-200 mb-3 font-light">
            Your intelligent medicine companion
          </p>
          <p className="text-teal-200/80 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
            Order medicines effortlessly using AI. Search, upload prescriptions, or chat like WhatsApp—all with safety-first intelligence.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12 w-full max-w-5xl">
          <div className="group relative p-4 rounded-lg bg-emerald-500/10 backdrop-blur-md border border-emerald-400/30 hover:border-emerald-300/60 transition-all duration-300 hover:bg-emerald-500/20">
            <MessageSquare className="w-6 h-6 text-emerald-400 mb-2" />
            <p className="text-sm text-emerald-200">Chat like WhatsApp</p>
          </div>
          <div className="group relative p-4 rounded-lg bg-teal-500/10 backdrop-blur-md border border-teal-400/30 hover:border-teal-300/60 transition-all duration-300 hover:bg-teal-500/20">
            <Shield className="w-6 h-6 text-teal-400 mb-2" />
            <p className="text-sm text-teal-200">Prescription safe</p>
          </div>
          <div className="group relative p-4 rounded-lg bg-cyan-500/10 backdrop-blur-md border border-cyan-400/30 hover:border-cyan-300/60 transition-all duration-300 hover:bg-cyan-500/20">
            <Zap className="w-6 h-6 text-cyan-400 mb-2" />
            <p className="text-sm text-cyan-200">AI-powered refills</p>
          </div>
          <div className="group relative p-4 rounded-lg bg-emerald-500/10 backdrop-blur-md border border-emerald-400/30 hover:border-emerald-300/60 transition-all duration-300 hover:bg-emerald-500/20">
            <Pill className="w-6 h-6 text-emerald-400 mb-2" />
            <p className="text-sm text-emerald-200">Smart ordering</p>
          </div>
        </div>

        {/* Action Cards */}
        <div className="grid md:grid-cols-2 gap-6 w-full max-w-2xl">
          {/* Login Card */}
          <div className="group relative p-8 rounded-2xl bg-gradient-to-br from-blue-600/40 to-blue-700/40 backdrop-blur-xl border border-blue-400/50 hover:border-blue-300/80 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/20 cursor-pointer overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            <div className="relative z-10">
              <div className="inline-block p-3 bg-blue-500/30 rounded-lg mb-4 group-hover:bg-blue-500/50 transition-all duration-300">
                <Pill className="w-6 h-6 text-blue-300" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Welcome Back
              </h2>
              <p className="text-blue-200 mb-6 text-sm">
                Login to continue ordering medicines with AI assistance.
              </p>
              <button
                onClick={() => navigate("/login")}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-blue-500/50"
              >
                Login
              </button>
            </div>
          </div>

          {/* Signup Card */}
          <div className="group relative p-8 rounded-2xl bg-gradient-to-br from-cyan-600/40 to-purple-600/40 backdrop-blur-xl border border-cyan-400/50 hover:border-cyan-300/80 transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/20 cursor-pointer overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            <div className="relative z-10">
              <div className="inline-block p-3 bg-cyan-500/30 rounded-lg mb-4 group-hover:bg-cyan-500/50 transition-all duration-300">
                <Zap className="w-6 h-6 text-cyan-300" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Get Started
              </h2>
              <p className="text-cyan-200 mb-6 text-sm">
                Create an account and experience AI-powered medicine ordering.
              </p>
              <button
                onClick={() => navigate("/signup")}
                className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-cyan-500/50"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>

        {/* Trust Badge */}
        <div className="mt-12 text-center">
          <p className="text-slate-400 text-sm flex items-center justify-center gap-2">
            <Shield className="w-4 h-4 text-green-400" />
            Prescription-verified | AI-powered | 24/7 Available
          </p>
        </div>
      </div>
    </div>
  );
};

export default PublicLanding;