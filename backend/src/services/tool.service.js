const axios = require("axios");
const { createOrder } = require("./order.service"); // ✅ direct service call

const API_BASE = "http://localhost:5000/api";

const tools = {
  // 🔍 Medicine search (OK to use HTTP)
  searchMedicine: async (query) => {
    const res = await axios.get(`${API_BASE}/medicines/search`, {
      params: { q: query },
    });
    return res.data;
  },

  // 📦 Inventory check (OK to use HTTP)
  checkInventory: async (medicineId, quantity) => {
    const res = await axios.post(`${API_BASE}/inventory/check`, {
      medicineId,
      quantity,
    });
    return res.data;
  },

  // 🛒 Order creation (🔥 MUST be direct service call)
  createOrder: async ({ userId, medicineId, quantity }) => {
    return await createOrder({ userId, medicineId, quantity });
  },
};

module.exports = { tools };
