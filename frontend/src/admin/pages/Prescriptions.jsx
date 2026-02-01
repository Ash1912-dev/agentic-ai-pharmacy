import { useEffect, useState } from "react";
import AdminLayout from "../components/layout/AdminLayout";
import {
  fetchPrescriptions,
  verifyPrescription,
  rejectPrescription,
} from "../api/adminPrescription.api";

const Prescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchPrescriptions();
      setPrescriptions(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const getStatusBadge = (status) => {
    if (status === "VERIFIED")
      return "bg-green-100 text-green-700";
    if (status === "REJECTED")
      return "bg-red-100 text-red-700";
    return "bg-yellow-100 text-yellow-700";
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Prescriptions</h1>
        <span className="text-sm text-gray-500">
          Total: {prescriptions.length}
        </span>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading prescriptions…</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full bg-white border rounded shadow-sm">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="p-3 border">User</th>
                <th className="p-3 border">Detected Medicines</th>
                <th className="p-3 border">Prescription</th>
                <th className="p-3 border">Status</th>
                <th className="p-3 border">Action</th>
              </tr>
            </thead>

            <tbody>
              {prescriptions.map((p) => (
                <tr key={p._id} className="hover:bg-gray-50">
                  {/* USER */}
                  <td className="p-3 border">
                    <div className="font-medium">
                      {p.user?.name || "—"}
                    </div>
                    <div className="text-sm text-gray-500">
                      {p.user?.phone || ""}
                    </div>
                  </td>

                  {/* DETECTED MEDICINES */}
                  <td className="p-3 border">
                    {p.detectedMedicines?.length > 0 ? (
                      <ul className="list-disc ml-4 text-sm">
                        {p.detectedMedicines.map((m, idx) => (
                          <li key={idx}>
                            <strong>{m.name}</strong>
                            {m.dosage && ` — ${m.dosage}`}
                            {m.frequency && ` (${m.frequency})`}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <span className="text-gray-400 text-sm">
                        Not detected
                      </span>
                    )}
                  </td>

                  {/* FILE */}
                  <td className="p-3 border">
                    <a
                      href={p.imageUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 underline"
                    >
                      View
                    </a>
                  </td>

                  {/* STATUS */}
                  <td className="p-3 border">
                    <span
                      className={`px-2 py-1 rounded text-sm font-semibold ${getStatusBadge(
                        p.status
                      )}`}
                    >
                      {p.status}
                    </span>
                  </td>

                  {/* ACTIONS */}
                  <td className="p-3 border">
                    {p.status === "PENDING" ? (
                      <>
                        <button
                          onClick={() =>
                            verifyPrescription(p._id).then(loadData)
                          }
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 mr-2 rounded"
                        >
                          Verify
                        </button>
                        <button
                          onClick={() =>
                            rejectPrescription(p._id).then(loadData)
                          }
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                        >
                          Reject
                        </button>
                      </>
                    ) : (
                      <span className="text-gray-400 text-sm">
                        No actions
                      </span>
                    )}
                  </td>
                </tr>
              ))}

              {prescriptions.length === 0 && (
                <tr>
                  <td
                    colSpan="5"
                    className="p-4 text-center text-gray-500"
                  >
                    No prescriptions uploaded yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
};

export default Prescriptions;
