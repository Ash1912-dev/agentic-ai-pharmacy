import { useState } from "react";
import { Pill, ArrowRight, AlertCircle, Loader, CheckCircle } from "lucide-react";

const Signup = ({ onNavigate = () => {}, onSignup = () => {} }) => {
  const [form, setForm] = useState({ name: "", phone: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await onSignup(form);
      setSuccess(true);
      setTimeout(() => {
        onNavigate("/login");
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setForm({ ...form, [field]: value });
    setError("");
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
          <p className="text-teal-200/80">Join thousands of happy customers</p>
        </div>

        {/* Success State */}
        {success ? (
          <div className="relative p-8 rounded-2xl bg-gradient-to-br from-emerald-600/30 to-teal-600/30 backdrop-blur-xl border border-emerald-400/40 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/5 to-transparent pointer-events-none"></div>
            <div className="relative z-10 text-center">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-emerald-500/30 rounded-full">
                  <CheckCircle className="w-12 h-12 text-emerald-300 animate-bounce" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-emerald-300 mb-2">Welcome!</h3>
              <p className="text-emerald-200/80 mb-4">Your account has been created successfully</p>
              <p className="text-teal-200/60 text-sm">Redirecting to login...</p>
            </div>
          </div>
        ) : (
          /* Signup Card */
          <div className="relative p-8 rounded-2xl bg-gradient-to-br from-emerald-600/20 to-teal-600/20 backdrop-blur-xl border border-emerald-400/40 hover:border-emerald-300/60 transition-all duration-300 overflow-hidden">
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/5 to-transparent pointer-events-none"></div>

            <div className="relative z-10">
              <h2 className="text-2xl font-bold text-white mb-2">Create Account</h2>
              <p className="text-emerald-200/70 mb-6">Get started with AI-powered medicine ordering</p>

              {/* Error Message */}
              {error && (
                <div className="mb-4 p-4 bg-red-500/20 border border-red-400/50 rounded-lg flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-red-300 text-sm">{error}</p>
                </div>
              )}

              {/* Full Name Input */}
              <div className="mb-4">
                <label className="block text-emerald-200 text-sm font-medium mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="John Doe"
                  required
                  className="w-full bg-white/10 border border-emerald-400/30 text-white placeholder-emerald-300/50 rounded-lg px-4 py-3 focus:outline-none focus:border-emerald-300/80 focus:ring-2 focus:ring-emerald-400/20 transition-all duration-300"
                />
              </div>

              {/* Phone Input */}
              <div className="mb-6">
                <label className="block text-emerald-200 text-sm font-medium mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="+91 98765 43210"
                  required
                  className="w-full bg-white/10 border border-emerald-400/30 text-white placeholder-emerald-300/50 rounded-lg px-4 py-3 focus:outline-none focus:border-emerald-300/80 focus:ring-2 focus:ring-emerald-400/20 transition-all duration-300"
                />
              </div>

              {/* Terms & Conditions */}
              <div className="mb-6 text-emerald-200/60 text-xs">
                By signing up, you agree to our{" "}
                <button className="text-emerald-300 hover:text-emerald-200 underline transition-colors">
                  Terms of Service
                </button>{" "}
                and{" "}
                <button className="text-emerald-300 hover:text-emerald-200 underline transition-colors">
                  Privacy Policy
                </button>
              </div>

              {/* Signup Button */}
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2 shadow-lg hover:shadow-teal-500/50"
              >
                {loading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    Create Account
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>

              {/* Login Link */}
              <p className="text-sm text-center text-emerald-200/70 mt-6">
                Already have an account?{" "}
                <button
                  onClick={() => onNavigate("/login")}
                  className="text-emerald-300 hover:text-emerald-200 font-semibold underline transition-colors duration-200 bg-none border-none cursor-pointer p-0"
                >
                  Login here
                </button>
              </p>
            </div>
          </div>
        )}

        {/* Footer Trust Badge */}
        <div className="mt-8 text-center">
          <p className="text-emerald-200/60 text-xs flex items-center justify-center gap-2">
            <Pill className="w-3 h-3" />
            Secure • HIPAA Compliant • Verified Pharmacy
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;