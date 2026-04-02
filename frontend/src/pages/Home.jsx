import {
  MessageCircle,
  Upload,
  Search,
  Zap,
  Shield,
  Clock,
  CheckCircle,
  Pill,
  ArrowRight,
  Sparkles,
  Bell,
  Package,
  MessageSquare,
} from "lucide-react";

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
              Order medicines effortlessly with AI chat, WhatsApp support, prescription OCR, reminders, and refill alerts.
            </p>
          </div>
        </div>

        {/* Primary Actions */}
        <section className="mb-20">
          <h2 className="text-2xl font-bold text-white mb-8">Quick Actions</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Chat - Featured */}
            <div 
              onClick={() => onNavigate("/chat")}
              className="md:col-span-1 lg:col-span-2 group relative p-8 rounded-2xl bg-gradient-to-br from-teal-600/40 via-cyan-600/30 to-blue-600/20 backdrop-blur-xl border border-teal-400/60 hover:border-teal-300 transition-all duration-300 hover:shadow-2xl hover:shadow-teal-500/30 cursor-pointer overflow-hidden min-h-72"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-teal-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute -top-40 -right-40 w-80 h-80 bg-teal-500 rounded-full mix-blend-screen filter blur-3xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
              
              <div className="relative z-10 h-full flex flex-col justify-between">
                <div>
                  <div className="inline-block p-4 bg-gradient-to-br from-teal-400/40 to-cyan-400/30 rounded-xl mb-4 group-hover:scale-110 transition-transform duration-300 border border-teal-300/50">
                    <MessageCircle className="w-10 h-10 text-teal-200" />
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-3">AI Chat Assistant</h3>
                  <p className="text-teal-100/90 text-base leading-relaxed">
                    Chat naturally with our intelligent pharmacist. Ask about medicines, get personalized recommendations, place orders instantly.
                  </p>
                </div>
                
                <div className="mt-8 inline-flex items-center gap-3 text-teal-200 font-semibold group-hover:gap-4 transition-all bg-teal-500/20 px-4 py-2 rounded-lg border border-teal-400/50 w-fit">
                  Start Chat Now
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>

            {/* Search Medicines */}
            <div 
              onClick={() => onNavigate("/medicines")}
              className="group relative p-8 rounded-2xl bg-gradient-to-br from-emerald-600/40 to-green-600/20 backdrop-blur-xl border border-emerald-400/60 hover:border-emerald-300 transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/30 cursor-pointer overflow-hidden min-h-72"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-emerald-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-500 rounded-full mix-blend-screen filter blur-3xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
              
              <div className="relative z-10 h-full flex flex-col justify-between">
                <div>
                  <div className="inline-block p-4 bg-gradient-to-br from-emerald-400/40 to-green-400/30 rounded-xl mb-4 group-hover:scale-110 transition-transform duration-300 border border-emerald-300/50">
                    <Search className="w-10 h-10 text-emerald-200" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">Browse Medicines</h3>
                  <p className="text-emerald-100/90 text-base">
                    Search our complete catalog, check real-time prices, stock status, and detailed medicine information.
                  </p>
                </div>
                <div className="mt-8 inline-flex items-center gap-3 text-emerald-200 font-semibold group-hover:gap-4 transition-all bg-emerald-500/20 px-4 py-2 rounded-lg border border-emerald-400/50 w-fit">
                  Explore Catalog
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>

            {/* Upload Prescription */}
            <div 
              onClick={() => onNavigate("/upload-prescription")}
              className="group relative p-8 rounded-2xl bg-gradient-to-br from-cyan-600/40 to-blue-600/20 backdrop-blur-xl border border-cyan-400/60 hover:border-cyan-300 transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/30 cursor-pointer overflow-hidden min-h-72"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-cyan-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-screen filter blur-3xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
              
              <div className="relative z-10 h-full flex flex-col justify-between">
                <div>
                  <div className="inline-block p-4 bg-gradient-to-br from-cyan-400/40 to-blue-400/30 rounded-xl mb-4 group-hover:scale-110 transition-transform duration-300 border border-cyan-300/50">
                    <Upload className="w-10 h-10 text-cyan-200" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">Upload Prescription</h3>
                  <p className="text-cyan-100/90 text-base">
                    Scan your Rx with our AI. Instant medicine extraction and inventory matching for quick ordering.
                  </p>
                </div>
                <div className="mt-8 inline-flex items-center gap-3 text-cyan-200 font-semibold group-hover:gap-4 transition-all bg-cyan-500/20 px-4 py-2 rounded-lg border border-cyan-400/50 w-fit">
                  Upload Now
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Platform Features */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-white mb-12 text-center">Why Choose Us</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="group p-8 rounded-2xl bg-gradient-to-br from-emerald-600/30 to-emerald-600/10 border border-emerald-400/50 hover:border-emerald-300/80 transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/20 hover:-translate-y-2 cursor-pointer overflow-hidden min-h-72 flex flex-col justify-between">
              <div className="absolute inset-0 bg-gradient-to-tr from-emerald-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-emerald-500 rounded-full mix-blend-screen filter blur-2xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
              
              <div className="relative z-10">
                <div className="p-4 bg-gradient-to-br from-emerald-400/40 to-green-400/20 rounded-xl mb-4 w-fit group-hover:scale-110 transition-transform border border-emerald-300/50">
                  <Shield className="w-8 h-8 text-emerald-200" />
                </div>
                <h3 className="font-bold text-white mb-3 text-lg">Safety Verified</h3>
                <p className="text-emerald-100/80 leading-relaxed">All medicines verified against prescriptions with pharmacist review.</p>
              </div>
            </div>

            <div className="group p-8 rounded-2xl bg-gradient-to-br from-teal-600/30 to-teal-600/10 border border-teal-400/50 hover:border-teal-300/80 transition-all duration-300 hover:shadow-2xl hover:shadow-teal-500/20 hover:-translate-y-2 cursor-pointer overflow-hidden min-h-72 flex flex-col justify-between">
              <div className="absolute inset-0 bg-gradient-to-tr from-teal-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-teal-500 rounded-full mix-blend-screen filter blur-2xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
              
              <div className="relative z-10">
                <div className="p-4 bg-gradient-to-br from-teal-400/40 to-cyan-400/20 rounded-xl mb-4 w-fit group-hover:scale-110 transition-transform border border-teal-300/50">
                  <Zap className="w-8 h-8 text-teal-200" />
                </div>
                <h3 className="font-bold text-white mb-3 text-lg">Smart Refills</h3>
                <p className="text-teal-100/80 leading-relaxed">AI predicts refill times and sends alerts automatically.</p>
              </div>
            </div>

            <div className="group p-8 rounded-2xl bg-gradient-to-br from-cyan-600/30 to-cyan-600/10 border border-cyan-400/50 hover:border-cyan-300/80 transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/20 hover:-translate-y-2 cursor-pointer overflow-hidden min-h-72 flex flex-col justify-between">
              <div className="absolute inset-0 bg-gradient-to-tr from-cyan-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="absolute -top-20 -left-20 w-40 h-40 bg-cyan-500 rounded-full mix-blend-screen filter blur-2xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
              
              <div className="relative z-10">
                <div className="p-4 bg-gradient-to-br from-cyan-400/40 to-blue-400/20 rounded-xl mb-4 w-fit group-hover:scale-110 transition-transform border border-cyan-300/50">
                  <Clock className="w-8 h-8 text-cyan-200" />
                </div>
                <h3 className="font-bold text-white mb-3 text-lg">Instant Delivery</h3>
                <p className="text-cyan-100/80 leading-relaxed">Orders processed instantly with fast delivery to your home.</p>
              </div>
            </div>

            <div className="group p-8 rounded-2xl bg-gradient-to-br from-blue-600/30 to-blue-600/10 border border-blue-400/50 hover:border-blue-300/80 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/20 hover:-translate-y-2 cursor-pointer overflow-hidden min-h-72 flex flex-col justify-between">
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-blue-500 rounded-full mix-blend-screen filter blur-2xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
              
              <div className="relative z-10">
                <div className="p-4 bg-gradient-to-br from-blue-400/40 to-indigo-400/20 rounded-xl mb-4 w-fit group-hover:scale-110 transition-transform border border-blue-300/50">
                  <MessageSquare className="w-8 h-8 text-blue-200" />
                </div>
                <h3 className="font-bold text-white mb-3 text-lg">WhatsApp Support</h3>
                <p className="text-blue-100/80 leading-relaxed">24/7 medicine assistance through WhatsApp conversations.</p>
              </div>
            </div>

            <div className="group p-8 rounded-2xl bg-gradient-to-br from-purple-600/30 to-purple-600/10 border border-purple-400/50 hover:border-purple-300/80 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/20 hover:-translate-y-2 cursor-pointer overflow-hidden min-h-72 flex flex-col justify-between">
              <div className="absolute inset-0 bg-gradient-to-tr from-purple-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-purple-500 rounded-full mix-blend-screen filter blur-2xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
              
              <div className="relative z-10">
                <div className="p-4 bg-gradient-to-br from-purple-400/40 to-pink-400/20 rounded-xl mb-4 w-fit group-hover:scale-110 transition-transform border border-purple-300/50">
                  <Bell className="w-8 h-8 text-purple-200" />
                </div>
                <h3 className="font-bold text-white mb-3 text-lg">Daily Reminders</h3>
                <p className="text-purple-100/80 leading-relaxed">Customizable medicine reminders with pause and resume options.</p>
              </div>
            </div>

            <div className="group p-8 rounded-2xl bg-gradient-to-br from-pink-600/30 to-pink-600/10 border border-pink-400/50 hover:border-pink-300/80 transition-all duration-300 hover:shadow-2xl hover:shadow-pink-500/20 hover:-translate-y-2 cursor-pointer overflow-hidden min-h-72 flex flex-col justify-between">
              <div className="absolute inset-0 bg-gradient-to-tr from-pink-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-pink-500 rounded-full mix-blend-screen filter blur-2xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
              
              <div className="relative z-10">
                <div className="p-4 bg-gradient-to-br from-pink-400/40 to-rose-400/20 rounded-xl mb-4 w-fit group-hover:scale-110 transition-transform border border-pink-300/50">
                  <Package className="w-8 h-8 text-pink-200" />
                </div>
                <h3 className="font-bold text-white mb-3 text-lg">Order Tracking</h3>
                <p className="text-pink-100/80 leading-relaxed">Real-time tracking of current and past orders with live updates.</p>
              </div>
            </div>

            <div className="group p-8 rounded-2xl bg-gradient-to-br from-orange-600/30 to-orange-600/10 border border-orange-400/50 hover:border-orange-300/80 transition-all duration-300 hover:shadow-2xl hover:shadow-orange-500/20 hover:-translate-y-2 cursor-pointer overflow-hidden min-h-72 flex flex-col justify-between">
              <div className="absolute inset-0 bg-gradient-to-tr from-orange-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="absolute -top-20 -left-20 w-40 h-40 bg-orange-500 rounded-full mix-blend-screen filter blur-2xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
              
              <div className="relative z-10">
                <div className="p-4 bg-gradient-to-br from-orange-400/40 to-amber-400/20 rounded-xl mb-4 w-fit group-hover:scale-110 transition-transform border border-orange-300/50">
                  <Upload className="w-8 h-8 text-orange-200" />
                </div>
                <h3 className="font-bold text-white mb-3 text-lg">Rx Upload + AI</h3>
                <p className="text-orange-100/80 leading-relaxed">Convert prescriptions to medicine lists with instant AI extraction.</p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-white mb-4 text-center">How It Works</h2>
          <p className="text-center text-teal-200/80 mb-12 max-w-2xl mx-auto">Complete your medicine order in just 4 simple steps</p>
          
          <div className="relative">
            {/* Connection Line - Enhanced */}
            <div className="hidden lg:block absolute top-1/3 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500/0 via-emerald-400/60 to-emerald-500/0 transform -translate-y-1/2"></div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { step: 1, title: "Choose", desc: "Select medicines or upload prescription", icon: Pill, color: "emerald" },
                { step: 2, title: "Confirm", desc: "AI verifies details via smart chat", icon: CheckCircle, color: "teal" },
                { step: 3, title: "Order", desc: "Instantly placed & processed", icon: Zap, color: "cyan" },
                { step: 4, title: "Deliver", desc: "Fast shipping to your location", icon: ArrowRight, color: "blue" }
              ].map(({ step, title, desc, icon: Icon, color }) => {
                const colorMap = {
                  emerald: { bg: "from-emerald-600/30 to-emerald-600/10", border: "border-emerald-400/50", hover: "hover:border-emerald-300/80 hover:shadow-emerald-500/20", circle: "from-emerald-500 to-green-500", icon: "text-emerald-200", glow: "bg-emerald-500" },
                  teal: { bg: "from-teal-600/30 to-teal-600/10", border: "border-teal-400/50", hover: "hover:border-teal-300/80 hover:shadow-teal-500/20", circle: "from-teal-500 to-cyan-500", icon: "text-teal-200", glow: "bg-teal-500" },
                  cyan: { bg: "from-cyan-600/30 to-cyan-600/10", border: "border-cyan-400/50", hover: "hover:border-cyan-300/80 hover:shadow-cyan-500/20", circle: "from-cyan-500 to-blue-500", icon: "text-cyan-200", glow: "bg-cyan-500" },
                  blue: { bg: "from-blue-600/30 to-blue-600/10", border: "border-blue-400/50", hover: "hover:border-blue-300/80 hover:shadow-blue-500/20", circle: "from-blue-500 to-indigo-500", icon: "text-blue-200", glow: "bg-blue-500" }
                };
                const colors = colorMap[color];
                
                return (
                  <div key={step} className="relative group">
                    {/* Connector - show on large, between cards */}
                    {step < 4 && <div className="hidden lg:block absolute -right-3 top-1/3 w-6 h-1 bg-gradient-to-r from-transparent to-emerald-400/60 transform -translate-y-1/2 z-20"></div>}
                    
                    <div className={`relative p-8 rounded-2xl bg-gradient-to-br ${colors.bg} ${colors.border} backdrop-blur-xl border hover:shadow-2xl ${colors.hover} transition-all duration-300 hover:-translate-y-2 cursor-pointer overflow-hidden min-h-72 flex flex-col justify-between group`}>
                      <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      
                      {/* Animated glow blob */}
                      <div className={`absolute -top-20 -right-20 w-40 h-40 ${colors.glow} rounded-full mix-blend-screen filter blur-2xl opacity-20 group-hover:opacity-30 transition-opacity`}></div>
                      
                      <div className="relative z-10">
                        {/* Step Number Circle */}
                        <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${colors.circle} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
                          <span className="font-bold text-white text-2xl">{step}</span>
                        </div>
                        
                        <h3 className="font-bold text-white mb-3 text-2xl">{title}</h3>
                        <p className="text-white/80 leading-relaxed">{desc}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA Section - Enhanced */}
        <section className="relative p-12 rounded-3xl bg-gradient-to-r from-emerald-600/40 via-teal-600/40 to-cyan-600/40 backdrop-blur-xl border border-emerald-400/60 overflow-hidden group">
          {/* Animated background elements */}
          <div className="absolute inset-0">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500 rounded-full mix-blend-screen filter blur-3xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-screen filter blur-3xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
          </div>
          
          <div className="relative z-10 text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/20 rounded-full border border-emerald-400/50 mb-6 backdrop-blur">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span className="text-sm text-emerald-300 font-medium">Get Started Now</span>
            </div>
            
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6 leading-tight">
              Ready to manage your medicines better?
            </h2>
            <p className="text-lg text-emerald-100/90 mb-8 leading-relaxed">
              Start with AI-powered chat, upload prescriptions, set reminders, and enjoy seamless medicine delivery. Your AI pharmacist is waiting.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => onNavigate("/chat")}
                className="group/btn inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-600 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-xl hover:shadow-2xl hover:shadow-emerald-500/50"
              >
                <MessageCircle className="w-6 h-6 group-hover/btn:animate-bounce" />
                Start Chat Now
                <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
              </button>
              
              <button
                onClick={() => onNavigate("/medicines")}
                className="inline-flex items-center gap-3 px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl border border-white/30 hover:border-white/60 backdrop-blur transition-all duration-300 transform hover:scale-105 active:scale-95"
              >
                <Search className="w-6 h-6" />
                Browse Catalog
              </button>
            </div>
            
            <div className="mt-8 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-center gap-8 items-center text-emerald-100/80 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
                <span>100% Medicine Safety</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-teal-400" />
                <span>Fast Delivery</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-cyan-400" />
                <span>Expert Support 24/7</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;