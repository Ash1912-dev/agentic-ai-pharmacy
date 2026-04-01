// ========================================
// frontend/src/pages/UploadPrescription.jsx
// ========================================

import { useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Upload, FileText, Loader, CheckCircle, AlertCircle } from "lucide-react";

const UploadPrescription = () => {
  const { user } = useAuth();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [medicines, setMedicines] = useState([]);
  const [detectedMedicines, setDetectedMedicines] = useState([]);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const navigate = useNavigate();

  const handleUpload = async () => {
    if (!file || !user?._id) {
      alert("Please select a file");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axiosInstance.post(
        "/api/prescriptions/upload",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setMedicines(res.data.medicines || []);
      setDetectedMedicines(res.data.detectedMedicines || []);
      setUploadSuccess(true);
    } catch (err) {
      console.error("Prescription upload failed", err);
      alert(err?.response?.data?.message || "Failed to scan prescription. Please try again.");
      setMedicines([]);
      setDetectedMedicines([]);
    } finally {
      setLoading(false);
    }
  };

  const proceedToChat = () => {
    const context = `I uploaded a prescription with these medicines: ${medicines.join(
      ", "
    )}. Please review and help me order these medicines.`;

    navigate("/chat", {
      state: { context },
    });
  };

  const matchedCount = detectedMedicines.filter((m) => m.inInventory).length;

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gradient-to-b from-slate-950 via-emerald-950/50 to-slate-950 px-4 py-12">
      {/* Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500 rounded-full mix-blend-screen filter blur-3xl opacity-10 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500 rounded-full mix-blend-screen filter blur-3xl opacity-10 animate-pulse" style={{ animationDelay: "2s" }}></div>
      </div>

      <div className="relative z-10 max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/20 rounded-full border border-emerald-400/50 mb-4 backdrop-blur">
            <Upload className="w-4 h-4 text-emerald-400" />
            <span className="text-sm text-emerald-300 font-medium">Upload Prescription</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-emerald-300 via-teal-300 to-cyan-300 bg-clip-text text-transparent">
            Upload Your Rx
          </h1>
          <p className="text-emerald-200/80">
            Scan your prescription and we'll extract medicines instantly with AI
          </p>
        </div>

        {/* Upload Area */}
        <div className="p-8 rounded-2xl bg-gradient-to-br from-emerald-600/20 to-teal-600/20 backdrop-blur-xl border border-emerald-400/40 mb-8 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/5 to-transparent"></div>

          <div className="relative z-10">
            <label className="block">
              <div className="p-8 border-2 border-dashed border-emerald-400/40 rounded-xl hover:border-emerald-300/60 transition-colors cursor-pointer group">
                <div className="flex flex-col items-center gap-3">
                  <div className="p-4 bg-emerald-500/30 group-hover:bg-emerald-500/50 rounded-lg transition-all">
                    <Upload className="w-8 h-8 text-emerald-300" />
                  </div>
                  <div className="text-center">
                    <p className="text-white font-semibold">
                      {file ? file.name : "Click to upload prescription"}
                    </p>
                    <p className="text-emerald-200/60 text-sm mt-1">
                      JPG, PNG, or PDF • Max 10MB
                    </p>
                  </div>
                </div>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={(e) => {
                    setFile(e.target.files[0]);
                    setMedicines([]);
                    setDetectedMedicines([]);
                    setUploadSuccess(false);
                  }}
                  className="hidden"
                />
              </div>
            </label>

            <button
              onClick={handleUpload}
              disabled={loading || !file}
              className="w-full mt-6 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-emerald-500/50"
            >
              {loading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Scanning...
                </>
              ) : (
                <>
                  <FileText className="w-5 h-5" />
                  Scan Prescription
                </>
              )}
            </button>
          </div>
        </div>

        {/* Results */}
        {medicines.length > 0 && (
          <div className="space-y-6">
            {uploadSuccess && (
              <div className="p-4 bg-emerald-500/20 border border-emerald-400/50 rounded-xl flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-emerald-300 font-semibold">Prescription scanned successfully!</p>
                  <p className="text-emerald-200/60 text-sm mt-1">
                    Found {medicines.length} medicine(s), {matchedCount} matched in your inventory.
                  </p>
                </div>
              </div>
            )}

            <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-600/20 to-teal-600/20 backdrop-blur-xl border border-emerald-400/40">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-400" />
                Detected Medicines
              </h3>

              <div className="space-y-2 mb-6">
                {(detectedMedicines.length ? detectedMedicines : medicines.map((name) => ({ name }))).map((medicine, idx) => (
                  <div
                    key={idx}
                    className={`p-3 border rounded-lg flex items-start gap-3 ${
                      medicine.inInventory
                        ? "bg-emerald-500/10 border-emerald-400/30"
                        : "bg-red-500/10 border-red-400/30"
                    }`}
                  >
                    <CheckCircle
                      className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                        medicine.inInventory ? "text-emerald-400" : "text-red-400"
                      }`}
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-emerald-100 font-medium">{medicine.name}</span>
                        <span
                          className={`text-xs px-2 py-1 rounded-md border ${
                            medicine.inInventory
                              ? "text-emerald-300 border-emerald-400/40"
                              : "text-red-300 border-red-400/40"
                          }`}
                        >
                          {medicine.inInventory ? "In Inventory" : "Not in Inventory"}
                        </span>
                      </div>

                      <div className="mt-2 text-xs text-emerald-200/80 grid sm:grid-cols-3 gap-2">
                        <span>Qty: {medicine.availableQuantity ?? 0}</span>
                        <span>Price: {medicine.price != null ? `₹${medicine.price}` : "N/A"}</span>
                        <span>
                          {medicine.requiresPrescription ? "Rx Required" : "No Rx"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={proceedToChat}
                className="w-full px-6 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-emerald-500/50"
              >
                Proceed to AI Chat
              </button>
            </div>
          </div>
        )}

        {/* Info Box */}
        {!uploadSuccess && medicines.length === 0 && (
          <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-400/30">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-emerald-300 font-semibold mb-2">Tips for best results:</h4>
                <ul className="space-y-1 text-sm text-emerald-200/70">
                  <li>✓ Make sure prescription is clear and legible</li>
                  <li>✓ Include medicine names and dosages</li>
                  <li>✓ JPG or PNG format works best</li>
                  <li>✓ AI will extract medicines automatically</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadPrescription;
