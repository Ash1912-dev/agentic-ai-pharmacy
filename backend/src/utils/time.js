const APP_TIMEZONE = process.env.APP_TIMEZONE || "Asia/Kolkata";
const DEFAULT_OFFSET_BY_TIMEZONE = {
  "Asia/Kolkata": 330,
};

const parsedOffset = Number(process.env.APP_TIMEZONE_OFFSET_MINUTES);
const APP_TIMEZONE_OFFSET_MINUTES = Number.isFinite(parsedOffset)
  ? parsedOffset
  : DEFAULT_OFFSET_BY_TIMEZONE[APP_TIMEZONE] ?? 0;

// Convert to app-local wall clock via explicit UTC offset.
const getShiftedUtcDate = (
  date = new Date(),
  offsetMinutes = APP_TIMEZONE_OFFSET_MINUTES
) => new Date(date.getTime() + offsetMinutes * 60 * 1000);

const getTimeHHMMInTimezone = (date = new Date()) => {
  const shifted = getShiftedUtcDate(date);
  const hh = String(shifted.getUTCHours()).padStart(2, "0");
  const mm = String(shifted.getUTCMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
};

const getDateKeyInTimezone = (date = new Date()) => {
  const shifted = getShiftedUtcDate(date);
  const yyyy = String(shifted.getUTCFullYear());
  const mm = String(shifted.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(shifted.getUTCDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

const getUtcOffsetLabel = (offsetMinutes = APP_TIMEZONE_OFFSET_MINUTES) => {
  const sign = offsetMinutes >= 0 ? "+" : "-";
  const absolute = Math.abs(offsetMinutes);
  const hh = String(Math.floor(absolute / 60)).padStart(2, "0");
  const mm = String(absolute % 60).padStart(2, "0");
  return `UTC${sign}${hh}:${mm}`;
};

module.exports = {
  APP_TIMEZONE,
  APP_TIMEZONE_OFFSET_MINUTES,
  getTimeHHMMInTimezone,
  getDateKeyInTimezone,
  getUtcOffsetLabel,
};
