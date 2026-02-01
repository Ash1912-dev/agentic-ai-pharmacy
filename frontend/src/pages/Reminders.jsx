import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";
import { useAuth } from "../context/AuthContext";
import { Bell, Pill, Clock, Edit2, Pause, Play } from "lucide-react";

const Reminders = () => {
  const { user } = useAuth();
  const location = useLocation();
  const medicine = location.state?.medicine;

  const [reminder, setReminder] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [times, setTimes] = useState([]);
  const [days, setDays] = useState(30);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  // Auto-hide success message
  useEffect(() => {
    if (success) {
      const t = setTimeout(() => setSuccess(""), 3000);
      return () => clearTimeout(t);
    }
  }, [success]);

  // Fetch existing reminder
  useEffect(() => {
    if (!medicine) return;

    const fetchReminder = async () => {
      try {
        const res = await axiosInstance.get(
          `/api/daily-reminder/user/${medicine._id}`
        );
        setReminder(res.data || null);
      } catch {
        setReminder(null);
      }
    };

    fetchReminder();
  }, [medicine, user]);

  if (!medicine) {
    return (
      <div className="w-full px-4 py-8">
        <div className="max-w-md mx-auto text-center">
          <Bell className="w-12 h-12 text-emerald-400/50 mx-auto mb-4" />
          <p className="text-emerald-200">Please select a medicine from Orders to manage reminders.</p>
        </div>
      </div>
    );
  }

  const handleCreate = async () => {
    if (!times.length || !days) {
      alert("Please set time and days");
      return;
    }

    try {
      setLoading(true);

      await axiosInstance.post("/api/daily-reminder/create", {
        userId: user._id,
        medicineId: medicine._id,
        times,
        days,
      });

      setSuccess("✅ Reminder set successfully");
      window.location.reload();
    } catch {
      alert("Failed to set reminder");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);

      await axiosInstance.put(
        `/api/daily-reminder/update/${reminder._id}`,
        { times, days }
      );

      setSuccess("✅ Reminder updated");
      setEditMode(false);
      window.location.reload();
    } catch {
      alert("Failed to update reminder");
    } finally {
      setLoading(false);
    }
  };

  const toggleReminder = async () => {
    try {
      await axiosInstance.put(
        `/api/daily-reminder/toggle/${reminder._id}`
      );
      window.location.reload();
    } catch {
      alert("Failed to toggle reminder");
    }
  };

  return (
    <div className="w-full px-4 py-8">
      <div className="max-w-md mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-white">Daily Intake Reminder</h1>

        {success && (
          <div className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/50 p-4 rounded-lg flex items-center gap-3">
            <Bell className="w-5 h-5 flex-shrink-0" />
            <p>{success}</p>
          </div>
        )}

        {/* EXISTING REMINDER */}
        {reminder && !editMode && (
          <div className="bg-emerald-500/10 border border-emerald-400/40 p-6 rounded-lg space-y-4">
            <div className="flex items-center gap-3 pb-4 border-b border-emerald-400/20">
              <div className="p-3 bg-emerald-500/30 rounded-lg">
                <Pill className="w-5 h-5 text-emerald-300" />
              </div>
              <div>
                <p className="text-emerald-200/60 text-sm">Medicine</p>
                <p className="text-white font-semibold">{medicine.name}</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-emerald-400" />
                <div>
                  <p className="text-emerald-200/60 text-sm">Reminder Time</p>
                  <p className="text-emerald-300 font-semibold">{reminder.times.join(", ")}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-emerald-400" />
                <div>
                  <p className="text-emerald-200/60 text-sm">Status</p>
                  <p className={`font-semibold ${reminder.enabled ? "text-emerald-300" : "text-yellow-300"}`}>
                    {reminder.enabled ? "✓ Enabled" : "⏸ Paused"}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={() => setEditMode(true)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-emerald-500/20 hover:bg-emerald-500/40 text-emerald-300 font-semibold rounded-lg border border-emerald-400/40 transition-all duration-300"
              >
                <Edit2 className="w-4 h-4" />
                Edit
              </button>

              <button
                onClick={toggleReminder}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-yellow-500/20 hover:bg-yellow-500/40 text-yellow-300 font-semibold rounded-lg border border-yellow-400/40 transition-all duration-300"
              >
                {reminder.enabled ? (
                  <>
                    <Pause className="w-4 h-4" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    Resume
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* CREATE / EDIT FORM */}
        {(!reminder || editMode) && (
          <div className="bg-emerald-500/10 border border-emerald-400/40 p-6 rounded-lg space-y-5">
            <h2 className="text-lg font-semibold text-white">
              {editMode ? "Edit Reminder" : "Create New Reminder"}
            </h2>

            <div>
              <label className="block text-emerald-200 text-sm font-medium mb-2">
                <Clock className="w-4 h-4 inline mr-2" />
                Daily Time
              </label>
              <input
                type="time"
                onChange={(e) => setTimes([e.target.value])}
                defaultValue={times[0] || ""}
                className="w-full bg-emerald-500/10 border border-emerald-400/40 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-emerald-300/80 focus:ring-2 focus:ring-emerald-400/20 transition-all duration-300 placeholder-emerald-300/50"
              />
            </div>

            <div>
              <label className="block text-emerald-200 text-sm font-medium mb-2">
                <Bell className="w-4 h-4 inline mr-2" />
                Duration (days)
              </label>
              <input
                type="number"
                value={days}
                onChange={(e) => setDays(e.target.value)}
                className="w-full bg-emerald-500/10 border border-emerald-400/40 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-emerald-300/80 focus:ring-2 focus:ring-emerald-400/20 transition-all duration-300"
              />
            </div>

            <button
              onClick={editMode ? handleUpdate : handleCreate}
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95"
            >
              {loading
                ? "Saving..."
                : editMode
                ? "Update Reminder"
                : "Set Reminder"}
            </button>

            {editMode && (
              <button
                onClick={() => setEditMode(false)}
                className="w-full bg-emerald-500/20 hover:bg-emerald-500/40 text-emerald-300 font-semibold px-6 py-3 rounded-lg border border-emerald-400/40 transition-all duration-300"
              >
                Cancel
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Reminders;