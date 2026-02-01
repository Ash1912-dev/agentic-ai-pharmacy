import { useState } from "react";
import { Pill, ArrowRight, AlertCircle, Loader } from "lucide-react";

const Login = ({ onNavigate = () => {}, onLogin = () => {} }) => {
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await onLogin({ phone });
      onNavigate("/home");
    } catch (err) {
      if (err.response?.status === 404) {
        setError("User not found. Please sign up first.");
      } else {
        setError(err.message || "Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    setLoading(true);
    window.location.href =
      `${import.meta.env.VITE_API_BASE_URL}/api/auth/google`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-950 flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500 rounded-full mix-blend-screen filter blur-3xl opacity-15 animate-pulse"></div>
        <div className="absolute -bottom-20 right-1/3 w-96 h-96 bg-teal-500 rounded-full mix-blend-screen filter blur-3xl opacity-15 animate-pulse" style={{ animationDelay: "2s" }}></div>
        <div className="absolute top-1/2 -right-20 w-80 h-80 bg-cyan-600 rounded-full mix-blend-screen filter blur-3xl opacity-10 animate-pulse" style={{ animationDelay: "4s" }}></div>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="p-3 bg-emerald-500/20 rounded-xl backdrop-blur-md border border-emerald-400/40">
              <Pill className="w-6 h-6 text-emerald-400" />
            </div>
            <h1 className="text-2xl font-bold text-emerald-300">Agentic Pharmacy</h1>
          </div>
          <p className="text-teal-200/80">Welcome back to your pharmacy</p>
        </div>

        {/* Login Card */}
        <div className="relative p-8 rounded-2xl bg-gradient-to-br from-emerald-600/20 to-teal-600/20 backdrop-blur-xl border border-emerald-400/40 hover:border-emerald-300/60 transition-all duration-300 overflow-hidden">
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/5 to-transparent pointer-events-none"></div>

          <div className="relative z-10">
            <h2 className="text-2xl font-bold text-white mb-2">Login</h2>
            <p className="text-emerald-200/70 mb-6">Sign in with your phone number</p>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-4 bg-red-500/20 border border-red-400/50 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-red-300 text-sm">{error}</p>
              </div>
            )}

            {/* Phone Input */}
            <div className="mb-4">
              <label className="block text-emerald-200 text-sm font-medium mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                required
                className="w-full bg-white/10 border border-emerald-400/30 text-white placeholder-emerald-300/50 rounded-lg px-4 py-3 focus:outline-none focus:border-emerald-300/80 focus:ring-2 focus:ring-emerald-400/20 transition-all duration-300"
              />
            </div>

            {/* Login Button */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2 shadow-lg hover:shadow-emerald-500/50"
            >
              {loading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>

            {/* Divider */}
            <div className="my-6 flex items-center gap-3">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent to-emerald-400/30"></div>
              <span className="text-emerald-300/60 text-xs uppercase tracking-wide">or</span>
              <div className="flex-1 h-px bg-gradient-to-l from-transparent to-emerald-400/30"></div>
            </div>

            {/* Google Login Button */}
            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full bg-white/10 border border-emerald-400/30 hover:border-emerald-300/60 text-emerald-200 font-semibold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 hover:bg-white/15 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#34A853"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#4285F4"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>

            {/* Sign Up Link */}
            <p className="text-sm text-center text-emerald-200/70 mt-6">
              New to Agentic Pharmacy?{" "}
              <button
                onClick={() => onNavigate("/signup")}
                className="text-emerald-300 hover:text-emerald-200 font-semibold underline transition-colors duration-200 bg-none border-none cursor-pointer p-0"
              >
                Create account
              </button>
            </p>
          </div>
        </div>

        {/* Footer Trust Badge */}
        <div className="mt-8 text-center">
          <p className="text-emerald-200/60 text-xs flex items-center justify-center gap-2">
            <Pill className="w-3 h-3" />
            Secure • Privacy First • AI Powered
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;