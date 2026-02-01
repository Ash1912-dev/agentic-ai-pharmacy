const RefillReminder = require("../models/RefillReminder.model");

const predictRefillDate = (orderDate, quantity) => {
  const daysPerTablet = 1; // simple assumption
  const days = quantity * daysPerTablet;

  const refillDate = new Date(orderDate);
  refillDate.setDate(refillDate.getDate() + days);

  return refillDate;
};

module.exports = { predictRefillDate };
