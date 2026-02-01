import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Pill, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // If not logged in, do not show navbar
  if (!user) return null;

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const navLinks = [
    { label: "Home", href: "/home" },
    { label: "Medicines", href: "/medicines" },
    { label: "Upload Rx", href: "/upload-prescription" },
    { label: "Chat", href: "/chat", highlight: true },
    { label: "Orders", href: "/orders" },
    { label: "Profile", href: "/profile" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-slate-900/95 to-emerald-900/95 backdrop-blur-md border-b border-emerald-400/20 shadow-lg">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          {/* Brand */}
          <button
            onClick={() => navigate("/home")}
            className="flex items-center gap-2 font-bold text-lg text-emerald-300 hover:text-emerald-200 transition-colors"
          >
            <div className="p-2 bg-emerald-500/30 rounded-lg">
              <Pill className="w-5 h-5" />
            </div>
            <span className="hidden sm:inline">Agentic Pharmacy</span>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => navigate(link.href)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  link.highlight
                    ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:shadow-lg hover:shadow-emerald-500/50"
                    : "text-emerald-200 hover:text-white hover:bg-emerald-500/20"
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {/* User Info */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-emerald-500/10 rounded-lg border border-emerald-400/20">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center text-white font-semibold text-sm">
                {user?.name?.charAt(0).toUpperCase() || "U"}
              </div>
              <span className="text-sm text-emerald-200 hidden lg:inline">{user?.name || "User"}</span>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-300 border border-red-500/30 hover:border-red-400/50"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-emerald-500/20 transition-colors"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-emerald-300" />
              ) : (
                <Menu className="w-6 h-6 text-emerald-300" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-2 border-t border-emerald-400/20 pt-4">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => {
                  navigate(link.href);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  link.highlight
                    ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white"
                    : "text-emerald-200 hover:text-white hover:bg-emerald-500/20"
                }`}
              >
                {link.label}
              </button>
            ))}
            <button
              onClick={() => {
                handleLogout();
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-4 py-2 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;