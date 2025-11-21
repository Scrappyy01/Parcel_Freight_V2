// Use Next.js environment variable (NEXT_PUBLIC_ prefix for client-side access)
export const baseUrl = process.env.NEXT_PUBLIC_API_URL || process.env.REACT_APP_API_URL;

export const FEDEX = "Fed Ex";
export const CP = "Couriers Please";

export const ROADEXPRESS = "road express";
export const OVERNIGHTEXPRESS = "overnight express";
export const AIREXPRESS = "air express";
export const ASAPHOTSHOT = "asap hot shot";
export const ASAPHOTSHOT_BIG = "ASAP Hot Shot";
export const TECHNOLOGYEXPRESS = "technology express";

export const ROAD_EXPRESS = "road_express";
export const OVERNIGHT_EXPRESS = "overnight_express";
export const AIR_EXPRESS = "air_express";
export const ASAP_HOT_SHOT = "asap_hot_shot";
export const TECHNOLOGY_EXPRESS = "technology_express";

export const AU_STATE = ["NSW", "VIC", "QLD", "SA", "WA", "TAS", "NT", "ACT"];
export const FEDEX_PACKAGE_CODE = {
  CR: "Crate",
  DR: "Drum",
  RO: "Roll",
  BX: "Box",
  EN: "Evelope",
  SA: "Satchel",
  PA: "Pallet",
  BG: "Bag",
  CT: "Carton",
  PC: "Piece",
};
export const FEDEX_PACAGE_CODE_NAME = [
  "Crate",
  "Drum",
  "Roll",
  "Box",
  "Evelope",
  "Satchel",
  "Pallet",
  "Bag",
  "Carton",
  "Piece",
];
export const MONTHS = {
  1: "January",
  2: "February",
  3: "March",
  4: "April",
  5: "May",
  6: "June",
  7: "July",
  8: "August",
  9: "September",
  10: "October",
  11: "November",
  12: "December",
};

export const DIGIT_MONTHS = {
  "01": "01",
  "02": "02",
  "03": "03",
  "04": "04",
  "05": "05",
  "06": "06",
  "07": "07",
  "08": "08",
  "09": "09",
  10: "10",
  11: "11",
  12: "12",
};
export const YEARS = [
  2025, 2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033, 2034, 2035,
];
export const DIGIT_YEARS = [25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35];
export const MONTHS_NUMBER = [
  "01",
  "02",
  "03",
  "04",
  "05",
  "06",
  "07",
  "08",
  "09",
  "10",
  "11",
  "12",
];

export const OAUTH_METHOD_GOOGLE = "Google OAuth";
export const OAUTH_METHOD_FACEBOOK = "Facebook OAuth";
export const OAUTH_METHOD_INSTAGRAM = "Instagram OAuth";
export const OAUTH_METHOD_MICROSOFT = "Microsoft OAuth";

export const COURIES_PLEASE_STATUS_PICKUP = "pickup";
export const COURIES_PLEASE_STATUS_DROP = "drop";
export const COURIES_PLEASE_STATUS_DEPOT = "depot";
export const COURIES_PLEASE_STATUS_HANDOVER = "handover";
export const COURIES_PLEASE_STATUS_TRANSHIP = "tranship";
export const COURIES_PLEASE_STATUS_DECONSOLIDATE = "deconsolidate";
export const COURIES_PLEASE_STATUS_TRANSFER = "transfer";
export const COURIES_PLEASE_STATUS_ACCEPTED = "accepted";
export const COURIES_PLEASE_STATUS_TRANSIT = "transit";
export const COURIES_PLEASE_STATUS_REDELIVERY = "redelivery";
export const COURIES_PLEASE_STATUS_CONSOLIDATE = "consolidate";
export const COURIES_PLEASE_STATUS_REDIRECTED = "redirected";
export const COURIES_PLEASE_STATUS_DELIVERY = "delivery";
export const COURIES_PLEASE_STATUS_SCAN = "scan";
export const COURIES_PLEASE_STATUS_DELIVERED = "delivered";

export const ROLES = ["admin", "staff", "trade", "user", "ecommerce"];

export const R_NUMBER = "0123456789";
export const R_UPPERCASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
export const R_LOWERCASE = "abcdefghijklmnopqrstuvwxyz";
export const R_SPECIALCHARS = "!@#$%^&*()_+-=[]{},.";

export const GST_RATE = 1.1;
export const QUANTITY_LIMITATION = 99;
export const WEIGHT_LIMITATION = 1000;
export const LENGTH_LIMITATION = 240;
export const WIDTH_LIMITATION = 180;
export const HEIGHT_LIMITATION = 180;

export const STATE_TZ = {
  VIC: "Australia/Melbourne",
  Victoria: "Australia/Melbourne",
  NSW: "Australia/Sydney",
  "New South Wales": "Australia/Sydney",
  ACT: "Australia/Sydney",
  QLD: "Australia/Brisbane",
  Queensland: "Australia/Brisbane",
  SA: "Australia/Adelaide",
  "South Australia": "Australia/Adelaide",
  NT: "Australia/Darwin",
  "Northern Territory": "Australia/Darwin",
  WA: "Australia/Perth",
  "Western Australia": "Australia/Perth",
  TAS: "Australia/Hobart",
  Tasmania: "Australia/Hobart",
};
