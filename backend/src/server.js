require("dotenv").config();
require("./cron/refillReminder.cron");
require("./cron/dailyIntake.cron");

const app = require("./app");
const connectDB = require("./config/db");

const PORT = process.env.PORT || 5000;

connectDB();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});