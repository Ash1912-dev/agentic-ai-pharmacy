// ========================================
// frontend/src/pages/Profile.jsx
// ========================================

import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { User, Phone, Mail, Calendar, LogOut, Shield, Edit3, MapPin } from "lucide-react";
import { useState } from "react";

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  if (!user) return null;

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await logout();
    navigate("/");
  };

  const joinDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
    : "N/A";

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gradient-to-b from-slate-950 via-emerald-950/50 to-slate-950 px-4 py-12">
      {/* Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500 rounded-full mix-blend-screen filter blur-3xl opacity-10 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500 rounded-full mix-blend-screen filter blur-3xl opacity-10 animate-pulse" style={{ animationDelay: "2s" }}></div>
      </div>

      <div className="relative z-10 max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/20 rounded-full border border-emerald-400/50 mb-4 backdrop-blur">
            <User className="w-4 h-4 text-emerald-400" />
            <span className="text-sm text-emerald-300 font-medium">Account Settings</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-emerald-300 via-teal-300 to-cyan-300 bg-clip-text text-transparent">
            My Profile
          </h1>
          <p className="text-emerald-200/80">
            Manage your account information and preferences
          </p>
        </div>

        {/* Profile Avatar */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-3xl font-bold text-white">
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </span>
          </div>
          <h2 className="text-2xl font-bold text-white">{user?.name || "User"}</h2>
          <p className="text-emerald-200/60 mt-2">{user?.phone || "No phone number"}</p>
        </div>

        {/* Profile Info Cards */}
        <div className="space-y-4 mb-8">
          {/* Name */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-600/20 to-teal-600/20 backdrop-blur-xl border border-emerald-400/40">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-emerald-500/30 rounded-lg">
                  <User className="w-6 h-6 text-emerald-300" />
                </div>
                <div>
                  <p className="text-emerald-200/60 text-sm">Full Name</p>
                  <p className="text-lg font-bold text-white">{user?.name}</p>
                </div>
              </div>
              <Edit3 className="w-5 h-5 text-emerald-400/50" />
            </div>
          </div>

          {/* Email */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-600/20 to-teal-600/20 backdrop-blur-xl border border-emerald-400/40">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-500/30 rounded-lg">
                <Mail className="w-6 h-6 text-emerald-300" />
              </div>
              <div>
                <p className="text-emerald-200/60 text-sm">Email Address</p>
                <p className="text-lg font-bold text-white">{user?.email || "N/A"}</p>
              </div>
            </div>
          </div>

          {/* Phone */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-600/20 to-teal-600/20 backdrop-blur-xl border border-emerald-400/40">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-emerald-500/30 rounded-lg">
                  <Phone className="w-6 h-6 text-emerald-300" />
                </div>
                <div>
                  <p className="text-emerald-200/60 text-sm">Phone Number</p>
                  <p className="text-lg font-bold text-white">{user?.phone}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Gender & DOB */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-600/20 to-teal-600/20 backdrop-blur-xl border border-emerald-400/40">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-emerald-500/30 rounded-lg">
                  <User className="w-6 h-6 text-emerald-300" />
                </div>
                <div>
                  <p className="text-emerald-200/60 text-sm">Gender</p>
                  <p className="text-lg font-bold text-white capitalize">{user?.gender?.toLowerCase() || "N/A"}</p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-600/20 to-teal-600/20 backdrop-blur-xl border border-emerald-400/40">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-emerald-500/30 rounded-lg">
                  <Calendar className="w-6 h-6 text-emerald-300" />
                </div>
                <div>
                  <p className="text-emerald-200/60 text-sm">Date of Birth</p>
                  <p className="text-lg font-bold text-white">
                    {user?.dob
                      ? new Date(user.dob).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
                      : "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-600/20 to-teal-600/20 backdrop-blur-xl border border-emerald-400/40">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-500/30 rounded-lg">
                <MapPin className="w-6 h-6 text-emerald-300" />
              </div>
              <div className="flex-1">
                <p className="text-emerald-200/60 text-sm">Address</p>
                {user?.address ? (
                  <p className="text-lg font-bold text-white leading-relaxed">
                    {user.address.street && <span className="block">{user.address.street}</span>}
                    <span>
                      {[user.address.city, user.address.state, user.address.zip].filter(Boolean).join(", ")}
                    </span>
                    {user.address.country && <span className="block">{user.address.country}</span>}
                    {!user.address.street && !user.address.city && "No address details available"}
                  </p>
                ) : (
                  <p className="text-lg font-bold text-white">N/A</p>
                )}
              </div>
            </div>
          </div>

          {/* Member Since */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-600/20 to-teal-600/20 backdrop-blur-xl border border-emerald-400/40">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-500/30 rounded-lg">
                <Calendar className="w-6 h-6 text-emerald-300" />
              </div>
              <div>
                <p className="text-emerald-200/60 text-sm">Member Since</p>
                <p className="text-lg font-bold text-white">{joinDate}</p>
              </div>
            </div>
          </div>

          {/* Account Status */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-600/20 to-teal-600/20 backdrop-blur-xl border border-emerald-400/40">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-emerald-500/30 rounded-lg">
                  <Shield className="w-6 h-6 text-emerald-300" />
                </div>
                <div>
                  <p className="text-emerald-200/60 text-sm">Account Status</p>
                  <p className="text-lg font-bold text-white flex items-center gap-2">
                    <span className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></span>
                    Active
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={() => navigate("/orders")}
            className="w-full px-6 py-4 bg-emerald-500/20 hover:bg-emerald-500/40 border border-emerald-400/40 text-emerald-300 font-semibold rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
          >
            <User className="w-5 h-5" />
            View My Orders
          </button>

          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full px-6 py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg hover:shadow-red-500/50"
          >
            <LogOut className="w-5 h-5" />
            {isLoggingOut ? "Logging out..." : "Logout"}
          </button>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-emerald-400/20 text-center text-emerald-200/60 text-sm">
          <p>Need help? Contact support@agentiapharmacy.com</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;