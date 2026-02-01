const MedicinesTable = ({ medicines, onToggle }) => {
  return (
    <table className="w-full border bg-white">
      <thead>
        <tr className="bg-gray-100 text-left">
          <th className="p-2 border">Name</th>
          <th className="p-2 border">Unit</th>
          <th className="p-2 border">Prescription</th>
          <th className="p-2 border">Status</th>
          <th className="p-2 border">Action</th>
        </tr>
      </thead>

      <tbody>
        {medicines.map((m) => (
          <tr key={m._id}>
            <td className="p-2 border">{m.name}</td>
            <td className="p-2 border">{m.unit}</td>
            <td className="p-2 border">
              {m.prescriptionRequired ? "Yes" : "No"}
            </td>
            <td className="p-2 border">
              {m.isActive ? "Active" : "Disabled"}
            </td>
            <td className="p-2 border">
              <button
                onClick={() => onToggle(m._id)}
                className="px-3 py-1 bg-blue-500 text-white rounded"
              >
                Toggle
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default MedicinesTable;
