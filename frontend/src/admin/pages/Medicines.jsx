import { useEffect, useState } from "react";
import AdminLayout from "../components/layout/AdminLayout";
import {
  fetchMedicines,
  createMedicine,
  toggleMedicine,
  updateMedicine,
} from "../api/adminMedicine.api";

const Medicines = () => {
  const [medicines, setMedicines] = useState([]);

  // form state
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [requiresPrescription, setRequiresPrescription] = useState(false);
  const [typicalDurationDays, setTypicalDurationDays] = useState("");

  // edit state
  const [editId, setEditId] = useState(null);

  const loadMedicines = async () => {
    const data = await fetchMedicines();
    setMedicines(data);
  };

  useEffect(() => {
    loadMedicines();
  }, []);

  const resetForm = () => {
    setName("");
    setBrand("");
    setCategory("");
    setPrice("");
    setRequiresPrescription(false);
    setTypicalDurationDays("");
    setEditId(null);
  };

  const handleSubmit = async () => {
    if (!name || !brand || !price) {
      alert("Name, Brand and Price are required");
      return;
    }

    const payload = {
      name,
      brand,
      category,
      price,
      requiresPrescription,
      typicalDurationDays:
        typicalDurationDays !== ""
          ? Number(typicalDurationDays)
          : undefined,
    };

    if (editId) {
      // EDIT
      await updateMedicine(editId, payload);
    } else {
      // CREATE
      await createMedicine(payload);
    }

    resetForm();
    loadMedicines();
  };

  const handleEdit = (m) => {
    setEditId(m._id);
    setName(m.name);
    setBrand(m.brand || "");
    setCategory(m.category || "");
    setPrice(m.price);
    setRequiresPrescription(m.requiresPrescription);
    setTypicalDurationDays(m.typicalDurationDays || "");
  };

  const handleToggle = async (id) => {
    await toggleMedicine(id);
    loadMedicines();
  };

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-4">Medicines</h1>

      {/* CREATE / EDIT FORM */}
      <div className="grid grid-cols-6 gap-2 mb-6">
        <input
          className="border px-2 py-1"
          placeholder="Medicine name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="border px-2 py-1"
          placeholder="Brand"
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
        />

        <input
          className="border px-2 py-1"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />

        <input
          type="number"
          className="border px-2 py-1"
          placeholder="Price (₹)"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        <input
          type="number"
          className="border px-2 py-1"
          placeholder="Duration (days)"
          value={typicalDurationDays}
          onChange={(e) => setTypicalDurationDays(e.target.value)}
        />

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={requiresPrescription}
            onChange={(e) => setRequiresPrescription(e.target.checked)}
          />
          Rx Required
        </label>

        <button
          onClick={handleSubmit}
          className={`col-span-6 text-white py-2 rounded ${
            editId ? "bg-blue-600" : "bg-green-600"
          }`}
        >
          {editId ? "Update Medicine" : "Add Medicine"}
        </button>

        {editId && (
          <button
            onClick={resetForm}
            className="col-span-6 bg-gray-400 text-white py-2 rounded"
          >
            Cancel Edit
          </button>
        )}
      </div>

      {/* TABLE */}
      <table className="w-full bg-white border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Brand</th>
            <th className="p-2 border">Category</th>
            <th className="p-2 border">Price (₹)</th>
            <th className="p-2 border">Prescription</th>
            <th className="p-2 border">Status</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {medicines.map((m) => (
            <tr key={m._id}>
              <td className="p-2 border">{m.name}</td>
              <td className="p-2 border">{m.brand}</td>
              <td className="p-2 border">{m.category || "-"}</td>
              <td className="p-2 border">₹{m.price}</td>
              <td className="p-2 border">
                {m.requiresPrescription ? "Yes" : "No"}
              </td>
              <td className="p-2 border">
                {m.isActive ? "Active" : "Disabled"}
              </td>
              <td className="p-2 border space-x-2">
                <button
                  onClick={() => handleEdit(m)}
                  className="px-3 py-1 bg-blue-600 text-white rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleToggle(m._id)}
                  className={`px-3 py-1 rounded text-white ${
                    m.isActive ? "bg-red-600" : "bg-green-600"
                  }`}
                >
                  {m.isActive ? "Disable" : "Activate"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </AdminLayout>
  );
};

export default Medicines;
