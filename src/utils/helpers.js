import { format } from "date-fns";
import { toZonedTime, format as formatTz } from "date-fns-tz";
import _ from "lodash";

import {
  CP,
  AIR_EXPRESS,
  AIREXPRESS,
  ASAP_HOT_SHOT,
  ASAPHOTSHOT,
  GST_RATE,
  OVERNIGHT_EXPRESS,
  OVERNIGHTEXPRESS,
  ROAD_EXPRESS,
  ROADEXPRESS,
  STATE_TZ,
  TECHNOLOGY_EXPRESS,
  TECHNOLOGYEXPRESS,
} from "./constant";

import { DateTime } from "luxon";
import Holidays from "date-holidays";

export const formatDate = (
  mysqlDateTime,
  formatStyle = "dd/MM/yyyy h:mm a"
) => {
  if (!mysqlDateTime) {
    console.error("Invalid date: mysqlDateTime is null or undefined");
    return ""; // Return an empty string or fallback value
  }

  const date = new Date(mysqlDateTime);

  // Check if the date is valid
  if (isNaN(date.getTime())) {
    console.error("Invalid date format:", mysqlDateTime);
    return ""; // Return an empty string or handle the error appropriately
  }

  // Format the valid date into British format using date-fns
  return format(date, formatStyle);
};

export const formatDateWithTimezone = (
  mysqlDateTime,
  formatStyle = "dd/MM/yyyy h:mm a",
  timezone = "Australia/Brisbane"
) => {
  if (!mysqlDateTime) {
    console.error("Invalid date: mysqlDateTime is null or undefined");
    return ""; // Return an empty string or fallback value
  }

  const zonedDate = toZonedTime(mysqlDateTime, timezone);

  return formatTz(zonedDate, formatStyle, { timezone });
};

export const validateEmail = (email) => {
  if (!_.isString(email)) return false;

  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const formatCollectionDate = (date, courierName) => {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const hh = String(date.getHours()).padStart(2, "0");
  const min = String(date.getMinutes()).padStart(2, "0");
  const ss = String(date.getSeconds()).padStart(2, "0");

  if (courierName === CP) {
    return `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`;
  }
  return `${yyyy}-${mm}-${dd}T${hh}:${min}:${ss}`;
};

export const getPackage = (packages = []) => {
  if (!Array.isArray(packages) || packages.length === 0) {
    return { freight_package: [], totalQty: 0, totalKgs: 0, totalVolume: 0 };
  }

  const result = packages.reduce(
    (pre, curr) => {
      const qty = Number(curr.quantity) || 0;
      const kgs = Number(curr.weight) || 0;
      const volume =
        (Number(curr.length) || 0) *
        (Number(curr.width) || 0) *
        (Number(curr.height) || 0);

      return {
        freight_package: [...pre.freight_package, curr],
        totalQty: pre.totalQty + qty,
        totalKgs: pre.totalKgs + kgs * qty,
        totalVolume: pre.totalVolume + volume,
      };
    },
    { freight_package: [], totalQty: 0, totalKgs: 0, totalVolume: 0 }
  );

  result.totalKgs = parseFloat(result.totalKgs.toFixed(2));

  return result;
};

export const getServiceQuote = (quotes) => {
  return quotes.reduce((pre, curr) => {
    switch (curr.service_type) {
      case ROADEXPRESS:
        pre[ROAD_EXPRESS] = curr;
        return pre;
      case OVERNIGHTEXPRESS:
        pre[OVERNIGHT_EXPRESS] = curr;
        return pre;
      case AIREXPRESS:
        pre[AIR_EXPRESS] = curr;
        return pre;
      case ASAPHOTSHOT:
        pre[ASAP_HOT_SHOT] = curr;
        return pre;
      case TECHNOLOGYEXPRESS:
        pre[TECHNOLOGY_EXPRESS] = curr;
        return pre;
      default:
        return pre;
    }
  }, {});
};

export const getPricingRow = (id, title, data) => ({
  id,
  service_type: title || data?.type || data?.service_type || "",
  service_name: data?.name || data?.service_name || "",
  service_quote: Number(data?.quote || data?.service_quote) || 0,
  service_user_price: data?.user_price || data?.service_user_price || 0,
  service_gst_price: data?.gst_price || data?.service_gst_price || 0,
  service_code: data?.code || data?.service_code || "",
  service_quote_id: data?.service_quote_id || data?.id || "",
  service_estimated_delivery_datetime:
    data?.estimated_delivery_datetime ||
    data?.service_estimated_delivery_datetime ||
    "",
});

export const transformObjectToArray = (obj) => {
  return Object.keys(obj).map((key) => obj[key]);
};

export const getSelectedService = (data) => ({
  service_name: data?.service_name || "",
  service_type: data?.service_type || "",
  service_quote: data?.service_quote || 0,
  service_user_price: data?.service_user_price || 0,
  service_gst_price: data?.service_gst_price || 0,
  service_code: data?.service_code || "",
  service_quote_id: data?.freight_service_quote_id || "",
  service_quote_details: data?.service_quote_details || "",
  service_estimated_delivery_datetime:
    data?.service_estimated_delivery_datetime || "",
});

export const validatePhoneNumber = (number) => /^[0-9+\s]+$/.test(number);

export const validateCollectionTime = (current, standard) => {
  const currentDate = new Date(`1970-01-01T${current}`);
  const standardDate = new Date(`1970-01-01T${standard}`);
  return currentDate <= standardDate;
};

export const getTime = (current_time) => {
  if (current_time.indexOf("T") > 0) {
    const [date, time] = current_time.split("T");
    return time;
  }
  const [date, time] = current_time.split(" ");

  return time;
};

export const formatToAUDate = (current_time, hidetime = false) => {
  const [date, time] = current_time.split(" ");
  if (current_time.indexOf("T") > 0) {
    const [date, time] = current_time.split("T");
  }

  const [year, month, day] = date.split("-");

  if (hidetime) {
    return `${day}/${month}/${year}`;
  }
  return `${day}/${month}/${year} ${time}`;
};

export const isEmptyObject = (obj) => {
  return obj && Object.keys(obj).length === 0 && obj.constructor === Object;
};

export const isToday = (date) => {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

export const includeGSTPrice = (amount) => {
  return amount * (1 + GST_RATE / 100);
};

export const calculateGST = (amount) => {
  return amount * (GST_RATE / 100);
};

export const isTrade = (user) =>
  Array.isArray(user?.roles) &&
  user.roles.some(
    (r) => (r?.name ?? r)?.toString().trim().toLowerCase() === "trade"
  );

export const isEcommerce = (user) =>
  Array.isArray(user?.roles) &&
  user.roles.some(
    (r) => (r?.name ?? r)?.toString().trim().toLowerCase() === "ecommerce"
  );

export const addMinutes = (date, mins) =>
  new Date(date.getTime() + mins * 60000);

export const mergeDateAndTime = (date, time) => {
  if (!time) return null;
  const d = new Date(date);
  d.setHours(time.getHours(), time.getMinutes(), 0, 0);
  return d;
};

export const clamp = (date, min, max) =>
  new Date(Math.min(Math.max(date, min), max));

export const adjustDateForCutoff = (
  selected,
  dropoffState,
  cutoffHHmm = "14:30"
) => {
  const tz = STATE_TZ[dropoffState ?? ""] || "Australia/Brisbane";

  const nowTz = DateTime.now().setZone(tz);
  const [h, m] = cutoffHHmm.split(":").map(Number);
  const cutoff = nowTz.set({ hour: h, minute: m, second: 0, millisecond: 0 });

  const selTz = DateTime.fromJSDate(selected).setZone(tz, {
    keepLocalTime: true,
  });

  if (selTz.hasSame(nowTz, "day") && nowTz >= cutoff) {
    let d = nowTz.plus({ days: 1 }).startOf("day"); // next day
    // Weekend skip (Luxon: Mon=1 … Sun=7)
    if (d.weekday === 6) d = d.plus({ days: 2 }); // Sat -> Mon
    if (d.weekday === 7) d = d.plus({ days: 1 }); // Sun -> Mon
    return d.toJSDate();
  }

  return selected;
};

export const startOfDay = (d) => {
  const x = new Date(d);
  x.setHours(7, 0, 0, 0);
  return x;
};

export const endOfDayQtr = (d) => {
  const x = new Date(d);
  x.setHours(19, 0, 0, 0);
  return x;
};

export const isAfterCutoff = (dateWithTime, cutoffHHmm = "14:30", tz) => {
  const [h, m] = cutoffHHmm.split(":").map(Number);
  const dt = DateTime.fromJSDate(dateWithTime).setZone(tz);
  const cutoff = dt.set({ hour: h, minute: m, second: 0, millisecond: 0 });
  return dt > cutoff;
};

export const isAfterCutoffNow = (h = 14, m = 30) => {
  const now = new Date();
  const hh = now.getHours(),
    mm = now.getMinutes();
  return hh > h || (hh === h && mm >= m);
};

export const isAfterCutoffNowTime = (h = 14, m = 30) => {
  const now = new Date();
  const hh = now.getHours(),
    mm = now.getMinutes();
  return hh > h || (hh === h && mm >= m);
};

export const isWeekend = (jsDate, tz) => {
  const d = DateTime.fromJSDate(jsDate).setZone(tz);
  return d.weekday === 6 || d.weekday === 7; // Sat/Sun
};

// holidaysByState: a Set of 'YYYY-MM-DD' strings for that state (inject from API/config)
export const isHoliday = (jsDate, tz, holidaysByState) => {
  if (!holidaysByState) return false;
  const d = DateTime.fromJSDate(jsDate).setZone(tz).toISODate(); // 'YYYY-MM-DD'
  return holidaysByState.has(d);
};

export const nextBusinessDate = (jsDate, tz, holidaysByState) => {
  let d = DateTime.fromJSDate(jsDate).setZone(tz).startOf("day");
  while (
    d.weekday === 6 ||
    d.weekday === 7 ||
    (holidaysByState && holidaysByState.has(d.toISODate()))
  ) {
    d = d.plus({ days: 1 });
  }
  return d.toJSDate();
};

export const getNextBusinessDate = (now, tz, holidaysByState) => {
  now.setDate(now.getDate() + 1);
  let d = DateTime.fromJSDate(now).setZone(tz).startOf("day");
  while (
    d.weekday === 6 ||
    d.weekday === 7 ||
    (holidaysByState && holidaysByState.has(d.toISODate()))
  ) {
    d = d.plus({ days: 1 });
  }
  return d.toJSDate();
};

export const isSameDay = (a, b) =>
  a &&
  b &&
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

export const addDays = (d, n) => {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
};

export const isEarlyDay = (a, b) => {
  if (!(a instanceof Date) || isNaN(a) || !(b instanceof Date) || isNaN(b))
    return false;
  const da = new Date(a.getFullYear(), a.getMonth(), a.getDate());
  const db = new Date(b.getFullYear(), b.getMonth(), b.getDate());
  return da.getTime() < db.getTime();
};

export const isSameOrEarlyDay = (a, b) => isEarlyDay(a, b) || isSameDay(a, b);
export const isLaterDay = (a, b) => isEarlyDay(b, a);

export const buildHolidaysSetAU = (pickupState, years = []) => {
  const state = (pickupState || "").toUpperCase();
  const tz = STATE_TZ[state].trim() || "Australia/Brisbane";

  const now = new Date();
  const defaultYears = [now.getFullYear(), now.getFullYear() + 1];
  const targetYears = years.length ? years : defaultYears;

  const hd = new Holidays("AU", state);
  const dates = [];

  for (const y of targetYears) {
    for (const h of hd.getHolidays(y)) {
      const iso = DateTime.fromISO(h.date.replace(" ", "T"))
        .setZone(tz)
        .toISODate();
      if (iso) dates.push(iso);
    }
  }

  return new Set(dates);
};

export const validateField = (condition, field, message, errors) => {
  if (condition) {
    errors[field] = message;
  } else {
    delete errors[field];
  }
};

export const getAustralianStateFromTimezone = () => {
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const timezoneToState = {
    "Australia/Sydney": "NSW",
    "Australia/Melbourne": "VIC",
    "Australia/Brisbane": "QLD",
    "Australia/Adelaide": "SA",
    "Australia/Perth": "WA",
    "Australia/Hobart": "TAS",
    "Australia/Darwin": "NT",
    "Australia/Broken_Hill": "NSW", // far west NSW
    "Australia/Lord_Howe": "NSW", // Lord Howe Island
    "Australia/Eucla": "WA", // southeastern WA
  };

  return timezoneToState[tz] || "";
};
