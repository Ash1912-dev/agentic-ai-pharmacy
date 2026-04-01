
// ========================================
// frontend/src/pages/Medicines.jsx
// ========================================

import { useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import { Search, Pill, ShoppingCart, MessageCircle, Loader } from "lucide-react";

const Medicines = () => {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [medicines, setMedicines] = useState([]);
  const navigate = useNavigate();

  const fetchMedicines = async (searchQuery = "") => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/api/medicines/search", {
        params: {
          q: searchQuery,
          _ts: Date.now(),
        },
      });
      setMedicines(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Search failed", err);
      setMedicines([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    await fetchMedicines(query.trim());
  };

  useEffect(() => {
    fetchMedicines();
  }, []);

  const askAI = (medicine) => {
    navigate("/chat", {
      state: {
        context: `Tell me about ${medicine.name}, price ₹${medicine.price}. Is it in stock?`,
      },
    });
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gradient-to-b from-slate-950 via-emerald-950/50 to-slate-950 px-4 py-12">
      {/* Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500 rounded-full mix-blend-screen filter blur-3xl opacity-10 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500 rounded-full mix-blend-screen filter blur-3xl opacity-10 animate-pulse" style={{ animationDelay: "2s" }}></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/20 rounded-full border border-emerald-400/50 mb-4 backdrop-blur">
            <Pill className="w-4 h-4 text-emerald-400" />
            <span className="text-sm text-emerald-300 font-medium">Browse Medicines</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-emerald-300 via-teal-300 to-cyan-300 bg-clip-text text-transparent">
            Find Your Medicine
          </h1>
          <p className="text-emerald-200/80 max-w-2xl mx-auto">
            Search our comprehensive pharmacy database. Instant availability check & AI assistance.
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mb-12">
          <div className="flex gap-3 max-w-2xl mx-auto">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-emerald-400 pointer-events-none" />
              <input
                className="w-full bg-emerald-500/10 border border-emerald-400/40 text-white placeholder-emerald-300/50 rounded-xl pl-12 pr-4 py-4 focus:outline-none focus:border-emerald-300/80 focus:ring-2 focus:ring-emerald-400/20 transition-all duration-300"
                placeholder="Search medicine name, dosage..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-50 flex items-center gap-2 shadow-lg hover:shadow-emerald-500/50"
            >
              {loading ? (
                <Loader className="w-5 h-5 animate-spin" />
              ) : (
                <Search className="w-5 h-5" />
              )}
              <span className="hidden sm:inline">Search</span>
            </button>
          </div>
        </form>

        {/* Results */}
        {loading && (
          <div className="flex justify-center py-12">
            <div className="text-center">
              <Loader className="w-8 h-8 animate-spin text-emerald-400 mx-auto mb-3" />
              <p className="text-emerald-300">Searching medicines...</p>
            </div>
          </div>
        )}

        {!loading && medicines.length === 0 && (
          <div className="text-center py-12 px-4 bg-emerald-500/10 border border-emerald-400/30 rounded-2xl">
            <Pill className="w-12 h-12 text-emerald-400/50 mx-auto mb-3" />
            <p className="text-emerald-300 font-medium">No medicines found</p>
            <p className="text-emerald-200/60 text-sm mt-1">
              {query ? "Try searching with different keywords" : "No medicines are available yet"}
            </p>
          </div>
        )}

        {/* Medicine Grid */}
        {medicines.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {medicines.map((med) => (
              <div
                key={med._id}
                className="group relative p-6 rounded-2xl bg-gradient-to-br from-emerald-600/20 to-teal-600/20 backdrop-blur-xl border border-emerald-400/40 hover:border-emerald-300/80 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/20 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                <div className="relative z-10">
                  {/* Medicine Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-white mb-1 group-hover:text-emerald-300 transition-colors">
                        {med.name}
                      </h3>
                      <p className="text-emerald-200/60 text-sm">{med.description}</p>
                    </div>
                    <div className="p-3 bg-emerald-500/30 rounded-lg group-hover:bg-emerald-500/50 transition-all">
                      <Pill className="w-5 h-5 text-emerald-300" />
                    </div>
                  </div>

                  {/* Details */}
                  <div className="space-y-3 mb-4 pb-4 border-b border-emerald-400/20">
                    {med.strength && (
                      <div className="flex justify-between text-sm">
                        <span className="text-emerald-200/60">Strength</span>
                        <span className="text-emerald-300 font-medium">{med.strength}</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-emerald-200/60">Price</span>
                      <span className="text-emerald-300 font-bold text-lg">₹{med.price}</span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-emerald-200/60">Available Qty</span>
                      <span className="text-emerald-300 font-semibold">
                        {Number.isFinite(med.availableQuantity) ? med.availableQuantity : 0}
                      </span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-emerald-200/60">Status</span>
                      <span
                        className={`font-semibold ${
                          med.inStock
                            ? "text-emerald-400"
                            : "text-red-400"
                        }`}
                      >
                        {med.inStock ? "✓ In Stock" : "✗ Out of Stock"}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-2">
                    <button
                      onClick={() => askAI(med)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 hover:from-emerald-500/40 hover:to-teal-500/40 text-emerald-300 font-semibold rounded-lg border border-emerald-400/40 transition-all duration-300 group/btn"
                    >
                      <MessageCircle className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                      Ask AI
                    </button>
                    
                    {med.inStock && (
                      <button
                        onClick={() => askAI(med)}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        Order Now
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Medicines;