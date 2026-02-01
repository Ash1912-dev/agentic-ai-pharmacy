import { useEffect, useState } from "react";
import AdminLayout from "../components/layout/AdminLayout";
import {
  fetchInventory,
  addStock,
  setInventoryStock,
} from "../api/adminInventory.api";
import { fetchMedicines } from "../api/adminMedicine.api";


const Inventory = () => {
  const [items, setItems] = useState([]);
  const [medicines, setMedicines] = useState([]);

  // edit (overwrite)
  const [editing, setEditing] = useState(null);
  const [stock, setStock] = useState("");

  // add-stock
  const [selectedMedicine, setSelectedMedicine] = useState("");
  const [addQuantity, setAddQuantity] = useState("");

  const loadInventory = async () => {
    setItems(await fetchInventory());
  };

  const loadMedicines = async () => {
  const all = await fetchMedicines();
  setMedicines(all.filter((m) => m.isActive));
};


  useEffect(() => {
    loadInventory();
    loadMedicines();
  }, []);

  const handleAddStock = async () => {
    if (!selectedMedicine || addQuantity <= 0) {
      alert("Select medicine and enter valid quantity");
      return;
    }

    await addStock({
      medicineId: selectedMedicine,
      stock: Number(addQuantity),
    });

    setSelectedMedicine("");
    setAddQuantity("");
    loadInventory();
  };

  const saveStock = async () => {
    if (stock === "" || Number(stock) < 0) {
      alert("Invalid stock value");
      return;
    }

    await setInventoryStock({
      medicineId: editing.medicine._id,
      stock: Number(stock),
      reason: "Manual correction",
    });

    setEditing(null);
    setStock("");
    loadInventory();
  };

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-4">Inventory Management</h1>

      {/* ADD STOCK */}
      <div className="mb-6 border rounded p-4 bg-gray-50">
        <h2 className="font-semibold mb-3">Add Stock</h2>

        <div className="flex gap-3 items-center">
          <select
            className="border px-3 py-2 rounded"
            value={selectedMedicine}
            onChange={(e) => setSelectedMedicine(e.target.value)}
          >
            <option value="">Select Medicine</option>
            {medicines.map((m) => (
              <option key={m._id} value={m._id}>
                {m.name} ({m.brand})
              </option>
            ))}
          </select>

          <input
            type="number"
            min="1"
            placeholder="Quantity"
            className="border px-3 py-2 rounded w-32"
            value={addQuantity}
            onChange={(e) => setAddQuantity(e.target.value)}
          />

          <button
            onClick={handleAddStock}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Add Stock
          </button>
        </div>

        <p className="text-sm text-gray-500 mt-2">
          Stock will be created if not already present.
        </p>
      </div>

      {/* INVENTORY TABLE */}
      <table className="w-full bg-white border rounded">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 border">Medicine</th>
            <th className="p-3 border">Brand</th>
            <th className="p-3 border">Price</th>
            <th className="p-3 border">Stock</th>
            <th className="p-3 border">Action</th>
          </tr>
        </thead>
        <tbody>
          {items.map((i) => (
            <tr key={i._id}>
              <td className="p-3 border">{i.medicine.name}</td>
              <td className="p-3 border">{i.medicine.brand}</td>
              <td className="p-3 border">₹{i.medicine.price}</td>
              <td className="p-3 border">{i.stock}</td>
              <td className="p-3 border">
                <button
                  onClick={() => {
                    setEditing(i);
                    setStock(i.stock);
                  }}
                  className="bg-blue-600 text-white px-3 py-1 rounded"
                >
                  Edit Stock
                </button>
              </td>
            </tr>
          ))}

          {items.length === 0 && (
            <tr>
              <td colSpan="5" className="p-4 text-center text-gray-500">
                No inventory records yet
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* EDIT STOCK */}
      {editing && (
        <div className="mt-6 border rounded p-5 bg-gray-50">
          <h2 className="font-semibold mb-2">
            Edit Stock – {editing.medicine.name}
          </h2>

          <div className="flex gap-3 items-center">
            <input
              type="number"
              min="0"
              className="border px-3 py-2 rounded w-32"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
            />

            <button
              onClick={saveStock}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Save
            </button>

            <button
              onClick={() => setEditing(null)}
              className="bg-gray-400 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default Inventory;
