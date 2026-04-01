import { useNavigate } from "react-router-dom";
import {
  Pill,
  MessageSquare,
  Zap,
  Shield,
  Upload,
  Package,
  Bell,
  ArrowRight,
  Check,
  Menu,
  X,
  Search,
} from "lucide-react";
import { useState } from "react";

const PublicLanding = () => {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const featureCards = [
    {
      title: "WhatsApp Ordering",
      desc: "Order medicines from WhatsApp chat with AI-guided steps and quick confirmations.",
      icon: MessageSquare,
      tone: "emerald",
    },
    {
      title: "Prescription OCR",
      desc: "Upload your prescription and extract medicine names automatically.",
      icon: Upload,
      tone: "teal",
    },
    {
      title: "Medicine Search",
      desc: "Find medicines, check pricing, and verify availability in seconds.",
      icon: Search,
      tone: "cyan",
    },
    {
      title: "Daily Reminders",
      desc: "Set intake reminders and keep your courses on schedule without effort.",
      icon: Bell,
      tone: "emerald",
    },
    {
      title: "Smart Refills",
      desc: "Get refill alerts before stock runs out to avoid missing doses.",
      icon: Zap,
      tone: "teal",
    },
    {
      title: "Order Tracking",
      desc: "Track each order status from placement to doorstep delivery.",
      icon: Package,
      tone: "cyan",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-950 flex flex-col relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500 rounded-full mix-blend-screen filter blur-3xl opacity-15 animate-pulse"></div>
        <div className="absolute -bottom-20 right-1/3 w-96 h-96 bg-teal-500 rounded-full mix-blend-screen filter blur-3xl opacity-15 animate-pulse" style={{ animationDelay: "2s" }}></div>
        <div className="absolute top-1/2 -right-20 w-80 h-80 bg-cyan-600 rounded-full mix-blend-screen filter blur-3xl opacity-10 animate-pulse" style={{ animationDelay: "4s" }}></div>
      </div>

      <div className="relative z-10">
        {/* Public Navbar */}
        <nav className="sticky top-0 z-30 border-b border-emerald-400/20 bg-slate-950/80 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => navigate("/")}
                className="inline-flex items-center gap-3 text-emerald-200 hover:text-white transition-colors"
              >
                <span className="p-2 rounded-lg bg-emerald-500/20 border border-emerald-400/40">
                  <Pill className="w-5 h-5 text-emerald-300" />
                </span>
                <span className="font-bold tracking-wide">Agentic AI Pharmacy</span>
              </button>

              <div className="hidden md:flex items-center gap-2">
                <button
                  onClick={() => navigate("/login")}
                  className="px-4 py-2 text-sm font-semibold rounded-lg text-emerald-100 hover:bg-emerald-500/15 transition-colors"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate("/signup")}
                  className="px-4 py-2 text-sm font-semibold rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-600 hover:to-teal-600 transition-all"
                >
                  Sign Up
                </button>
              </div>

              <button
                onClick={() => setMobileOpen((prev) => !prev)}
                className="md:hidden p-2 rounded-lg border border-emerald-400/30 text-emerald-200"
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>

            {mobileOpen && (
              <div className="md:hidden mt-3 pt-3 border-t border-emerald-400/20 flex gap-2">
                <button
                  onClick={() => navigate("/login")}
                  className="flex-1 px-4 py-2 text-sm font-semibold rounded-lg text-emerald-100 border border-emerald-400/30"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate("/signup")}
                  className="flex-1 px-4 py-2 text-sm font-semibold rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 text-white"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </nav>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          {/* Hero Section */}
          <div className="text-center mb-12 max-w-4xl mx-auto">
            <div className="flex flex-col items-center justify-center gap-4 mb-6 px-4">
              <div className="p-4 bg-emerald-500/20 rounded-2xl backdrop-blur-md border border-emerald-400/40">
                <Pill className="w-10 h-10 text-emerald-400" />
              </div>
              <h1 className="text-5xl sm:text-6xl font-black bg-gradient-to-r from-emerald-300 via-teal-300 to-cyan-300 bg-clip-text text-transparent drop-shadow-lg leading-tight pb-2">
                Agentic AI Pharmacy
              </h1>
            </div>

            <p className="text-xl sm:text-2xl text-emerald-200 mb-3 font-light">
              Your intelligent medicine companion
            </p>
            <p className="text-teal-200/80 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
              AI chat, WhatsApp service, medicine discovery, prescription scanning, reminders, and smarter refills in one place.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => navigate("/signup")}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold hover:from-emerald-600 hover:to-teal-600 transition-all"
              >
                Start Free
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => navigate("/login")}
                className="w-full sm:w-auto px-7 py-3 rounded-lg border border-emerald-400/40 text-emerald-100 hover:bg-emerald-500/15 transition-colors font-semibold"
              >
                I already have an account
              </button>
            </div>
          </div>

          {/* Features Grid */}
          <section className="mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-8">Everything You Need</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {featureCards.map(({ title, desc, icon: Icon, tone }) => (
                <div
                  key={title}
                  className={`h-full p-6 rounded-2xl border backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                    tone === "emerald"
                      ? "bg-emerald-500/10 border-emerald-400/30 hover:border-emerald-300/60"
                      : tone === "teal"
                      ? "bg-teal-500/10 border-teal-400/30 hover:border-teal-300/60"
                      : "bg-cyan-500/10 border-cyan-400/30 hover:border-cyan-300/60"
                  }`}
                >
                  <div className="h-full flex flex-col">
                    <Icon
                      className={`w-6 h-6 mb-3 ${
                        tone === "emerald"
                          ? "text-emerald-300"
                          : tone === "teal"
                          ? "text-teal-300"
                          : "text-cyan-300"
                      }`}
                    />
                    <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
                    <p className="text-sm text-emerald-100/80 leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-12">
            <div className="p-6 sm:p-8 rounded-2xl border border-emerald-400/30 bg-gradient-to-r from-emerald-700/20 to-cyan-700/20 backdrop-blur-xl">
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 text-center">Why people choose this platform</h3>
              <div className="grid md:grid-cols-2 gap-3 text-left">
                {[
                  "Chat-first ordering with AI pharmacist",
                  "WhatsApp reminders and service continuity",
                  "Prescription-safe medicine verification",
                  "Quick delivery-ready order processing",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-emerald-100">
                    <Check className="w-4 h-4 text-emerald-300 flex-shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Action Cards */}
          <div className="grid md:grid-cols-2 gap-6 w-full max-w-3xl mx-auto">
            <div className="group relative p-8 rounded-2xl bg-gradient-to-br from-blue-600/40 to-blue-700/40 backdrop-blur-xl border border-blue-400/50 hover:border-blue-300/80 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/20 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10 h-full flex flex-col">
                <div className="inline-block p-3 bg-blue-500/30 rounded-lg mb-4 group-hover:bg-blue-500/50 transition-all duration-300 w-fit">
                  <Pill className="w-6 h-6 text-blue-300" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Welcome Back</h2>
                <p className="text-blue-200 mb-6 text-sm flex-1">
                  Login to continue your medicine orders, reminders, and WhatsApp-linked support.
                </p>
                <button
                  onClick={() => navigate("/login")}
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300"
                >
                  Login
                </button>
              </div>
            </div>

            <div className="group relative p-8 rounded-2xl bg-gradient-to-br from-cyan-600/40 to-teal-600/40 backdrop-blur-xl border border-cyan-400/50 hover:border-cyan-300/80 transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/20 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10 h-full flex flex-col">
                <div className="inline-block p-3 bg-cyan-500/30 rounded-lg mb-4 group-hover:bg-cyan-500/50 transition-all duration-300 w-fit">
                  <Zap className="w-6 h-6 text-cyan-300" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Create Account</h2>
                <p className="text-cyan-200 mb-6 text-sm flex-1">
                  Sign up to activate AI assistance, reminders, refills, and order tracking instantly.
                </p>
                <button
                  onClick={() => navigate("/signup")}
                  className="w-full bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300"
                >
                  Sign Up
                </button>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <p className="text-slate-300/80 text-sm flex items-center justify-center gap-2">
              <Shield className="w-4 h-4 text-emerald-400" />
              Prescription-verified | AI-powered | WhatsApp-enabled | 24/7 Available
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicLanding;