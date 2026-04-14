const APP_TIMEZONE = process.env.APP_TIMEZONE || "Asia/Kolkata";

const getZonedParts = (date = new Date(), timeZone = APP_TIMEZONE) => {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).formatToParts(date);

  return parts.reduce((acc, part) => {
    if (part.type !== "literal") {
      acc[part.type] = part.value;
    }
    return acc;
  }, {});
};

const getTimeHHMMInTimezone = (date = new Date(), timeZone = APP_TIMEZONE) => {
  const { hour = "00", minute = "00" } = getZonedParts(date, timeZone);
  const hh = String(hour).padStart(2, "0");
  const mm = String(minute).padStart(2, "0");
  return `${hh}:${mm}`;
};

const getDateKeyInTimezone = (date = new Date(), timeZone = APP_TIMEZONE) => {
  const { year = "0000", month = "00", day = "00" } = getZonedParts(
    date,
    timeZone
  );
  const yyyy = String(year);
  const mm = String(month).padStart(2, "0");
  const dd = String(day).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

module.exports = {
  APP_TIMEZONE,
  getTimeHHMMInTimezone,
  getDateKeyInTimezone,
};
