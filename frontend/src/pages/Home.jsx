import { MessageCircle, Upload, Search, Zap, Shield, Clock, CheckCircle, Pill, ArrowRight, Sparkles } from "lucide-react";

const Home = ({ onNavigate = () => {} }) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-emerald-950/50 to-slate-950">
      {/* Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-emerald-500 rounded-full mix-blend-screen filter blur-3xl opacity-10 animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-teal-500 rounded-full mix-blend-screen filter blur-3xl opacity-10 animate-pulse" style={{ animationDelay: "2s" }}></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/20 rounded-full border border-emerald-400/50 mb-4 backdrop-blur">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span className="text-sm text-emerald-300 font-medium">Welcome back!</span>
            </div>
            <h1 className="text-5xl sm:text-6xl font-black mb-4 bg-gradient-to-r from-emerald-300 via-teal-300 to-cyan-300 bg-clip-text text-transparent">
              Your AI Pharmacy<br />Assistant
            </h1>
            <p className="text-lg text-emerald-200/80 max-w-2xl mx-auto">
              Order medicines effortlessly. Search, upload prescriptions, or chat naturally—our AI handles everything.
            </p>
          </div>
        </div>

        {/* Primary Actions - Featured Card */}
        <section className="mb-16">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Chat - Featured/Hero */}
            <div 
              onClick={() => onNavigate("/chat")}
              className="lg:row-span-2 group relative p-8 rounded-2xl bg-gradient-to-br from-teal-600/30 to-cyan-600/30 backdrop-blur-xl border border-teal-400/50 hover:border-teal-300/80 transition-all duration-300 hover:shadow-2xl hover:shadow-teal-500/20 cursor-pointer overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-teal-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="relative z-10 h-full flex flex-col justify-between">
                <div>
                  <div className="inline-block p-4 bg-teal-500/30 rounded-xl mb-4 group-hover:bg-teal-500/50 transition-all">
                    <MessageCircle className="w-8 h-8 text-teal-300" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Chat with AI</h3>
                  <p className="text-teal-200/80 text-sm leading-relaxed">
                    Just type what you need. Our AI assistant understands natural language, suggests medicines, and handles your orders automatically.
                  </p>
                </div>
                
                <div className="mt-8 flex items-center gap-2 text-teal-300 font-semibold group-hover:gap-3 transition-all">
                  Start Chat
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>

            {/* Search Medicines */}
            <div 
              onClick={() => onNavigate("/medicines")}
              className="group relative p-6 rounded-2xl bg-gradient-to-br from-emerald-600/30 to-emerald-600/20 backdrop-blur-xl border border-emerald-400/50 hover:border-emerald-300/80 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/20 cursor-pointer overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="relative z-10">
                <div className="inline-block p-3 bg-emerald-500/30 rounded-lg mb-3 group-hover:bg-emerald-500/50 transition-all">
                  <Search className="w-6 h-6 text-emerald-300" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Search Medicines</h3>
                <p className="text-emerald-200/70 text-sm mb-4">
                  Browse our catalog, check prices and availability instantly.
                </p>
                <div className="flex items-center gap-2 text-emerald-300 font-medium group-hover:gap-3 transition-all text-sm">
                  Explore
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>

            {/* Upload Prescription */}
            <div 
              onClick={() => onNavigate("/upload-prescription")}
              className="group relative p-6 rounded-2xl bg-gradient-to-br from-cyan-600/30 to-cyan-600/20 backdrop-blur-xl border border-cyan-400/50 hover:border-cyan-300/80 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/20 cursor-pointer overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="relative z-10">
                <div className="inline-block p-3 bg-cyan-500/30 rounded-lg mb-3 group-hover:bg-cyan-500/50 transition-all">
                  <Upload className="w-6 h-6 text-cyan-300" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Upload Rx</h3>
                <p className="text-cyan-200/70 text-sm mb-4">
                  Scan your prescription & AI extracts medicines instantly.
                </p>
                <div className="flex items-center gap-2 text-cyan-300 font-medium group-hover:gap-3 transition-all text-sm">
                  Upload
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">Why choose us?</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl bg-emerald-500/10 border border-emerald-400/30 hover:border-emerald-300/60 transition-all">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-emerald-500/30 rounded-lg flex-shrink-0">
                  <Shield className="w-6 h-6 text-emerald-300" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-2">Prescription Safe</h3>
                  <p className="text-emerald-200/70 text-sm">All medicines verified against prescriptions. Safety always comes first.</p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-xl bg-teal-500/10 border border-teal-400/30 hover:border-teal-300/60 transition-all">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-teal-500/30 rounded-lg flex-shrink-0">
                  <Zap className="w-6 h-6 text-teal-300" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-2">Smart Refills</h3>
                  <p className="text-teal-200/70 text-sm">AI predicts when you're running out and alerts you automatically.</p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-xl bg-cyan-500/10 border border-cyan-400/30 hover:border-cyan-300/60 transition-all">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-cyan-500/30 rounded-lg flex-shrink-0">
                  <Clock className="w-6 h-6 text-cyan-300" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-2">Fast Delivery</h3>
                  <p className="text-cyan-200/70 text-sm">Orders confirmed instantly with quick delivery to your doorstep.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">How it works</h2>
          
          <div className="relative">
            {/* Connection Line */}
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500/50 via-teal-500/50 to-cyan-500/50 transform -translate-y-1/2"></div>

            <div className="grid md:grid-cols-4 gap-6">
              {[
                { step: 1, title: "Choose", desc: "Select medicines or upload prescription", icon: Pill },
                { step: 2, title: "Confirm", desc: "AI verifies details via smart chat", icon: CheckCircle },
                { step: 3, title: "Order", desc: "Instantly placed & processed", icon: Zap },
                { step: 4, title: "Deliver", desc: "Fast shipping to your location", icon: ArrowRight }
              ].map(({ step, title, desc, icon: Icon }) => (
                <div key={step} className="relative">
                  <div className="p-6 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-400/40 backdrop-blur">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center">
                        <span className="font-bold text-white text-lg">{step}</span>
                      </div>
                      <Icon className="w-6 h-6 text-emerald-300 hidden sm:block" />
                    </div>
                    <h3 className="font-semibold text-white mb-1">{title}</h3>
                    <p className="text-emerald-200/70 text-sm">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative p-8 rounded-2xl bg-gradient-to-r from-emerald-600/30 to-teal-600/30 border border-emerald-400/50 backdrop-blur-xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/5 to-transparent"></div>
          
          <div className="relative z-10 text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to get started?</h2>
            <p className="text-emerald-200/80 mb-6">
              Start chatting with our AI assistant now. No prescriptions needed to browse.
            </p>
            <button
              onClick={() => onNavigate("/chat")}
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-emerald-500/50"
            >
              <MessageCircle className="w-5 h-5" />
              Start Chat Now
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;