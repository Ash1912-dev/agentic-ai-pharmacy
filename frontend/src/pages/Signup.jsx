import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Pill, ArrowRight, AlertCircle, Loader, CheckCircle } from "lucide-react";

const Signup = ({ onSignup = () => { } }) => {
  const navigate = useNavigate();
  const errorRef = useRef(null);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    gender: "",
    dob: "",
    address: {
      street: "",
      city: "",
      state: "",
      zip: "",
      country: "",
    },
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Scroll to error notification when error is set
  useEffect(() => {
    if (error && errorRef.current) {
      errorRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [error]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      // Flatten address for the API if needed, or send as is depending on backend
      // Backend expects address object, so we send form directly but remove confirmPassword
      const payload = { ...form };
      delete payload.confirmPassword;

      await onSignup(payload);
      setSuccess(true);
      setTimeout(() => {
        navigate("/login");
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

  const handleAddressChange = (field, value) => {
    setForm({
      ...form,
      address: { ...form.address, [field]: value },
    });
    setError("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-950 flex flex-col items-center justify-center px-4 relative overflow-hidden py-10">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500 rounded-full mix-blend-screen filter blur-3xl opacity-15 animate-pulse"></div>
        <div className="absolute -bottom-20 right-1/3 w-96 h-96 bg-teal-500 rounded-full mix-blend-screen filter blur-3xl opacity-15 animate-pulse" style={{ animationDelay: "2s" }}></div>
        <div className="absolute top-1/2 -right-20 w-80 h-80 bg-cyan-600 rounded-full mix-blend-screen filter blur-3xl opacity-10 animate-pulse" style={{ animationDelay: "4s" }}></div>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-2xl">
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
          <div className="relative p-8 rounded-2xl bg-gradient-to-br from-emerald-600/30 to-teal-600/30 backdrop-blur-xl border border-emerald-400/40 overflow-hidden max-w-md mx-auto">
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
                <div ref={errorRef} className="mb-4 p-4 bg-red-500/20 border border-red-400/50 rounded-lg flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-red-300 text-sm">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Full Name */}
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-emerald-200 text-sm font-medium mb-2">Full Name *</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="John Doe"
                    required
                    className="w-full bg-white/10 border border-emerald-400/30 text-white placeholder-emerald-300/50 rounded-lg px-4 py-3 focus:outline-none focus:border-emerald-300/80 focus:ring-2 focus:ring-emerald-400/20 transition-all duration-300"
                  />
                </div>

                {/* Phone */}
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-emerald-200 text-sm font-medium mb-2">Phone Number *</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="+91 98765 43210"
                    required
                    className="w-full bg-white/10 border border-emerald-400/30 text-white placeholder-emerald-300/50 rounded-lg px-4 py-3 focus:outline-none focus:border-emerald-300/80 focus:ring-2 focus:ring-emerald-400/20 transition-all duration-300"
                  />
                </div>

                {/* Email */}
                <div className="col-span-2">
                  <label className="block text-emerald-200 text-sm font-medium mb-2">Email (Optional)</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="john@example.com"
                    className="w-full bg-white/10 border border-emerald-400/30 text-white placeholder-emerald-300/50 rounded-lg px-4 py-3 focus:outline-none focus:border-emerald-300/80 focus:ring-2 focus:ring-emerald-400/20 transition-all duration-300"
                  />
                </div>

                {/* Password */}
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-emerald-200 text-sm font-medium mb-2">Password *</label>
                  <input
                    type="password"
                    value={form.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full bg-white/10 border border-emerald-400/30 text-white placeholder-emerald-300/50 rounded-lg px-4 py-3 focus:outline-none focus:border-emerald-300/80 focus:ring-2 focus:ring-emerald-400/20 transition-all duration-300"
                  />
                </div>

                {/* Confirm Password */}
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-emerald-200 text-sm font-medium mb-2">Confirm Password *</label>
                  <input
                    type="password"
                    value={form.confirmPassword}
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full bg-white/10 border border-emerald-400/30 text-white placeholder-emerald-300/50 rounded-lg px-4 py-3 focus:outline-none focus:border-emerald-300/80 focus:ring-2 focus:ring-emerald-400/20 transition-all duration-300"
                  />
                </div>

                {/* Gender & DOB */}
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-emerald-200 text-sm font-medium mb-2">Gender</label>
                  <select
                    value={form.gender}
                    onChange={(e) => handleInputChange("gender", e.target.value)}
                    className="w-full bg-white/10 border border-emerald-400/30 text-white placeholder-emerald-300/50 rounded-lg px-4 py-3 focus:outline-none focus:border-emerald-300/80 focus:ring-2 focus:ring-emerald-400/20 transition-all duration-300"
                  >
                    <option value="" className="text-slate-900">Select Gender</option>
                    <option value="MALE" className="text-slate-900">Male</option>
                    <option value="FEMALE" className="text-slate-900">Female</option>
                    <option value="OTHER" className="text-slate-900">Other</option>
                  </select>
                </div>

                <div className="col-span-2 md:col-span-1">
                  <label className="block text-emerald-200 text-sm font-medium mb-2">Date of Birth</label>
                  <input
                    type="date"
                    value={form.dob}
                    onChange={(e) => handleInputChange("dob", e.target.value)}
                    className="w-full bg-white/10 border border-emerald-400/30 text-white placeholder-emerald-300/50 rounded-lg px-4 py-3 focus:outline-none focus:border-emerald-300/80 focus:ring-2 focus:ring-emerald-400/20 transition-all duration-300"
                  />
                </div>

                {/* Address Section */}
                <div className="col-span-2 mt-2">
                  <h3 className="text-emerald-300 font-semibold mb-3 border-b border-emerald-500/30 pb-1">Address Details</h3>
                </div>

                <div className="col-span-2">
                  <label className="block text-emerald-200 text-sm font-medium mb-2">Street Address</label>
                  <input
                    type="text"
                    value={form.address.street}
                    onChange={(e) => handleAddressChange("street", e.target.value)}
                    placeholder="123 Main St"
                    className="w-full bg-white/10 border border-emerald-400/30 text-white placeholder-emerald-300/50 rounded-lg px-4 py-3 focus:outline-none focus:border-emerald-300/80 focus:ring-2 focus:ring-emerald-400/20 transition-all duration-300"
                  />
                </div>

                <div className="col-span-1">
                  <label className="block text-emerald-200 text-sm font-medium mb-2">City</label>
                  <input
                    type="text"
                    value={form.address.city}
                    onChange={(e) => handleAddressChange("city", e.target.value)}
                    placeholder="New York"
                    className="w-full bg-white/10 border border-emerald-400/30 text-white placeholder-emerald-300/50 rounded-lg px-4 py-3 focus:outline-none focus:border-emerald-300/80 focus:ring-2 focus:ring-emerald-400/20 transition-all duration-300"
                  />
                </div>

                <div className="col-span-1">
                  <label className="block text-emerald-200 text-sm font-medium mb-2">State</label>
                  <input
                    type="text"
                    value={form.address.state}
                    onChange={(e) => handleAddressChange("state", e.target.value)}
                    placeholder="NY"
                    className="w-full bg-white/10 border border-emerald-400/30 text-white placeholder-emerald-300/50 rounded-lg px-4 py-3 focus:outline-none focus:border-emerald-300/80 focus:ring-2 focus:ring-emerald-400/20 transition-all duration-300"
                  />
                </div>

                <div className="col-span-1">
                  <label className="block text-emerald-200 text-sm font-medium mb-2">ZIP Code</label>
                  <input
                    type="text"
                    value={form.address.zip}
                    onChange={(e) => handleAddressChange("zip", e.target.value)}
                    placeholder="10001"
                    className="w-full bg-white/10 border border-emerald-400/30 text-white placeholder-emerald-300/50 rounded-lg px-4 py-3 focus:outline-none focus:border-emerald-300/80 focus:ring-2 focus:ring-emerald-400/20 transition-all duration-300"
                  />
                </div>

                <div className="col-span-1">
                  <label className="block text-emerald-200 text-sm font-medium mb-2">Country</label>
                  <input
                    type="text"
                    value={form.address.country}
                    onChange={(e) => handleAddressChange("country", e.target.value)}
                    placeholder="USA"
                    className="w-full bg-white/10 border border-emerald-400/30 text-white placeholder-emerald-300/50 rounded-lg px-4 py-3 focus:outline-none focus:border-emerald-300/80 focus:ring-2 focus:ring-emerald-400/20 transition-all duration-300"
                  />
                </div>

                {/* Signup Button */}
                <div className="col-span-2 mt-4">
                  <button
                    type="submit"
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
                </div>
              </form>

              {/* Login Link */}
              <p className="text-sm text-center text-emerald-200/70 mt-6">
                Already have an account?{" "}
                <button
                  onClick={() => navigate("/login")}
                  className="text-emerald-300 hover:text-emerald-200 font-semibold underline transition-colors duration-200 bg-none border-none cursor-pointer p-0"
                >
                  Login here
                </button>
              </p>
            </div>
          </div>
        )}

        {/* Footer Trust Badge */}
        <div className="mt-8 text-center pb-8">
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