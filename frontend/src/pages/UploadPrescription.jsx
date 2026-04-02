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
  const [imageUrl, setImageUrl] = useState(null);
  const [ocrText, setOcrText] = useState(null);
  const [activeTab, setActiveTab] = useState("medicines"); // medicines or ocr
  const [prescriptionId, setPrescriptionId] = useState(null);
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
      setImageUrl(res.data.imageUrl || null);
      setOcrText(res.data.ocrText || null);
      setPrescriptionId(res.data.prescriptionId || null);
      setUploadSuccess(true);
      setActiveTab("medicines");
    } catch (err) {
      console.error("Prescription upload failed", err);
      alert(err?.response?.data?.message || "Failed to scan prescription. Please try again.");
      setMedicines([]);
      setDetectedMedicines([]);
      setImageUrl(null);
      setOcrText(null);
    } finally {
      setLoading(false);
    }
  };

  const proceedToChat = () => {
    const medicinesList = detectedMedicines
      .map((m) => `${m.name}${m.dosage ? ` (${m.dosage})` : ""}`)
      .join(", ");
    
    const context = `I uploaded a prescription (ID: ${prescriptionId}) with these medicines: ${medicinesList}. Please help me order these medicines and ensure they're available.`;

    navigate("/chat", {
      state: { context, prescriptionId },
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
        {uploadSuccess && medicines.length >= 0 && (
          <div className="space-y-6">
            {/* Success Message */}
            <div className="p-4 bg-emerald-500/20 border border-emerald-400/50 rounded-xl flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-emerald-300 font-semibold">Prescription scanned successfully!</p>
                <p className="text-emerald-200/60 text-sm mt-1">
                  Found {medicines.length} medicine(s), {matchedCount} matched in your inventory.
                </p>
              </div>
            </div>

            {/* Prescription Image */}
            {imageUrl && (
              <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-600/20 to-teal-600/20 backdrop-blur-xl border border-emerald-400/40">
                <h3 className="text-lg font-bold text-white mb-4">📸 Prescription Image</h3>
                <img
                  src={imageUrl}
                  alt="Prescription"
                  className="w-full max-h-96 object-cover rounded-lg border border-emerald-400/30"
                />
              </div>
            )}

            {/* Tabs */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-600/20 to-teal-600/20 backdrop-blur-xl border border-emerald-400/40">
              {/* Tab Buttons */}
              <div className="flex gap-2 mb-6 border-b border-emerald-400/30">
                <button
                  onClick={() => setActiveTab("medicines")}
                  className={`px-4 py-2 font-semibold border-b-2 transition-all ${
                    activeTab === "medicines"
                      ? "border-emerald-400 text-emerald-300"
                      : "border-transparent text-emerald-200/60 hover:text-emerald-200"
                  }`}
                >
                  💊 Extracted Medicines ({medicines.length})
                </button>
                {ocrText && (
                  <button
                    onClick={() => setActiveTab("ocr")}
                    className={`px-4 py-2 font-semibold border-b-2 transition-all ${
                      activeTab === "ocr"
                        ? "border-emerald-400 text-emerald-300"
                        : "border-transparent text-emerald-200/60 hover:text-emerald-200"
                    }`}
                  >
                    📝 OCR Text
                  </button>
                )}
              </div>

              {/* Medicines Tab */}
              {activeTab === "medicines" && (
                <div className="space-y-3">
                  {medicines.length === 0 ? (
                    <p className="text-emerald-200/60 text-center py-8">No medicines could be extracted from the prescription.</p>
                  ) : (
                    detectedMedicines.map((medicine, idx) => (
                      <div
                        key={idx}
                        className={`p-4 border rounded-lg ${
                          medicine.inInventory
                            ? "bg-emerald-500/10 border-emerald-400/40"
                            : "bg-amber-500/10 border-amber-400/40"
                        }`}
                      >
                        {/* Medicine Name & Status */}
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <div className="flex-1">
                            <h4 className="text-emerald-100 font-bold text-lg">{medicine.name}</h4>
                            {medicine.dosage && (
                              <p className="text-emerald-200/70 text-sm mt-1">💊 Dosage: {medicine.dosage}</p>
                            )}
                          </div>
                          <span
                            className={`text-xs px-3 py-1 rounded-full font-semibold border flex-shrink-0 ${
                              medicine.inInventory
                                ? "bg-emerald-500/20 text-emerald-300 border-emerald-400/50"
                                : "bg-amber-500/20 text-amber-300 border-amber-400/50"
                            }`}
                          >
                            {medicine.inInventory ? "✓ In Stock" : "⚠ Not in Stock"}
                          </span>
                        </div>

                        {/* Prescription Details */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-3 pt-3 border-t border-emerald-400/20">
                          {medicine.frequency && (
                            <div>
                              <span className="text-emerald-200/60 text-xs">Frequency</span>
                              <p className="text-emerald-100 font-medium text-sm">{medicine.frequency}</p>
                            </div>
                          )}
                          {medicine.duration && (
                            <div>
                              <span className="text-emerald-200/60 text-xs">Duration</span>
                              <p className="text-emerald-100 font-medium text-sm">{medicine.duration}</p>
                            </div>
                          )}
                          {medicine.requiresPrescription && (
                            <div>
                              <span className="text-emerald-200/60 text-xs">Type</span>
                              <p className="text-emerald-100 font-medium text-sm">Rx Required</p>
                            </div>
                          )}
                        </div>

                        {/* Inventory & Price */}
                        {medicine.inInventory && (
                          <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-emerald-400/20">
                            <div>
                              <span className="text-emerald-200/60 text-xs">Available Stock</span>
                              <p className="text-emerald-100 font-semibold text-sm">{medicine.availableQuantity} units</p>
                            </div>
                            {medicine.price != null && (
                              <div>
                                <span className="text-emerald-200/60 text-xs">Price</span>
                                <p className="text-emerald-100 font-semibold text-sm">₹{medicine.price}</p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* OCR Text Tab */}
              {activeTab === "ocr" && ocrText && (
                <div className="bg-slate-900/50 p-4 rounded-lg border border-emerald-400/20 max-h-96 overflow-y-auto">
                  <p className="text-emerald-100 text-sm font-mono leading-relaxed whitespace-pre-wrap break-words">
                    {ocrText}
                  </p>
                </div>
              )}
            </div>

            {/* Proceed to Chat Button */}
            <button
              onClick={proceedToChat}
              className="w-full px-6 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold text-lg rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-emerald-500/50 flex items-center justify-center gap-2"
            >
              💬 Proceed to AI Chat for Ordering
            </button>
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
