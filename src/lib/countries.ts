/**
 * Full ISO 3166-1 alpha-2 country list for the phone-number picker.
 *
 *   iso  – ISO 3166-1 alpha-2 code (used for the emoji flag mapping)
 *   name – English display name (translated client-side when available)
 *   dial – international dial prefix WITHOUT the leading +. For NANP
 *          territories we include the country-code + area-code prefix
 *          (e.g. "1242" for the Bahamas) so the picker can distinguish them.
 *   min/max – inclusive bounds for the national-number digit count. For
 *          territories where we don't have a curated range we fall back to
 *          a permissive 4–15 window (E.164 permits at most 15 digits total).
 *
 * India is pinned at the top by product decision; consumers should sort the
 * rest alphabetically (by translated name) at render time.
 */
export type Country = {
  iso: string;
  name: string;
  dial: string;
  min: number;
  max: number;
};

export const COUNTRIES: readonly Country[] = [
  // Pinned default.
  { iso: "IN", name: "India", dial: "91", min: 10, max: 10 },

  // A
  { iso: "AD", name: "Andorra", dial: "376", min: 6, max: 9 },
  { iso: "AE", name: "United Arab Emirates", dial: "971", min: 8, max: 9 },
  { iso: "AF", name: "Afghanistan", dial: "93", min: 9, max: 9 },
  { iso: "AG", name: "Antigua and Barbuda", dial: "1268", min: 7, max: 7 },
  { iso: "AI", name: "Anguilla", dial: "1264", min: 7, max: 7 },
  { iso: "AL", name: "Albania", dial: "355", min: 7, max: 9 },
  { iso: "AM", name: "Armenia", dial: "374", min: 8, max: 8 },
  { iso: "AO", name: "Angola", dial: "244", min: 9, max: 9 },
  { iso: "AQ", name: "Antarctica", dial: "672", min: 6, max: 7 },
  { iso: "AR", name: "Argentina", dial: "54", min: 10, max: 11 },
  { iso: "AS", name: "American Samoa", dial: "1684", min: 7, max: 7 },
  { iso: "AT", name: "Austria", dial: "43", min: 4, max: 13 },
  { iso: "AU", name: "Australia", dial: "61", min: 9, max: 9 },
  { iso: "AW", name: "Aruba", dial: "297", min: 7, max: 7 },
  { iso: "AX", name: "Åland Islands", dial: "358", min: 5, max: 12 },
  { iso: "AZ", name: "Azerbaijan", dial: "994", min: 9, max: 9 },

  // B
  { iso: "BA", name: "Bosnia and Herzegovina", dial: "387", min: 8, max: 9 },
  { iso: "BB", name: "Barbados", dial: "1246", min: 7, max: 7 },
  { iso: "BD", name: "Bangladesh", dial: "880", min: 10, max: 10 },
  { iso: "BE", name: "Belgium", dial: "32", min: 8, max: 9 },
  { iso: "BF", name: "Burkina Faso", dial: "226", min: 8, max: 8 },
  { iso: "BG", name: "Bulgaria", dial: "359", min: 8, max: 9 },
  { iso: "BH", name: "Bahrain", dial: "973", min: 8, max: 8 },
  { iso: "BI", name: "Burundi", dial: "257", min: 8, max: 8 },
  { iso: "BJ", name: "Benin", dial: "229", min: 8, max: 8 },
  { iso: "BL", name: "Saint Barthélemy", dial: "590", min: 9, max: 9 },
  { iso: "BM", name: "Bermuda", dial: "1441", min: 7, max: 7 },
  { iso: "BN", name: "Brunei", dial: "673", min: 7, max: 7 },
  { iso: "BO", name: "Bolivia", dial: "591", min: 8, max: 8 },
  { iso: "BQ", name: "Caribbean Netherlands", dial: "599", min: 7, max: 7 },
  { iso: "BR", name: "Brazil", dial: "55", min: 10, max: 11 },
  { iso: "BS", name: "Bahamas", dial: "1242", min: 7, max: 7 },
  { iso: "BT", name: "Bhutan", dial: "975", min: 7, max: 8 },
  { iso: "BW", name: "Botswana", dial: "267", min: 7, max: 8 },
  { iso: "BY", name: "Belarus", dial: "375", min: 9, max: 9 },
  { iso: "BZ", name: "Belize", dial: "501", min: 7, max: 7 },

  // C
  { iso: "CA", name: "Canada", dial: "1", min: 10, max: 10 },
  { iso: "CC", name: "Cocos (Keeling) Islands", dial: "61", min: 9, max: 9 },
  { iso: "CD", name: "DR Congo", dial: "243", min: 9, max: 9 },
  { iso: "CF", name: "Central African Republic", dial: "236", min: 8, max: 8 },
  { iso: "CG", name: "Republic of the Congo", dial: "242", min: 9, max: 9 },
  { iso: "CH", name: "Switzerland", dial: "41", min: 9, max: 9 },
  { iso: "CI", name: "Côte d'Ivoire", dial: "225", min: 8, max: 10 },
  { iso: "CK", name: "Cook Islands", dial: "682", min: 5, max: 5 },
  { iso: "CL", name: "Chile", dial: "56", min: 9, max: 9 },
  { iso: "CM", name: "Cameroon", dial: "237", min: 8, max: 9 },
  { iso: "CN", name: "China", dial: "86", min: 11, max: 11 },
  { iso: "CO", name: "Colombia", dial: "57", min: 10, max: 10 },
  { iso: "CR", name: "Costa Rica", dial: "506", min: 8, max: 8 },
  { iso: "CU", name: "Cuba", dial: "53", min: 6, max: 8 },
  { iso: "CV", name: "Cape Verde", dial: "238", min: 7, max: 7 },
  { iso: "CW", name: "Curaçao", dial: "599", min: 7, max: 8 },
  { iso: "CX", name: "Christmas Island", dial: "61", min: 9, max: 9 },
  { iso: "CY", name: "Cyprus", dial: "357", min: 8, max: 8 },
  { iso: "CZ", name: "Czechia", dial: "420", min: 9, max: 9 },

  // D
  { iso: "DE", name: "Germany", dial: "49", min: 6, max: 13 },
  { iso: "DJ", name: "Djibouti", dial: "253", min: 8, max: 8 },
  { iso: "DK", name: "Denmark", dial: "45", min: 8, max: 8 },
  { iso: "DM", name: "Dominica", dial: "1767", min: 7, max: 7 },
  { iso: "DO", name: "Dominican Republic", dial: "1809", min: 7, max: 7 },
  { iso: "DZ", name: "Algeria", dial: "213", min: 8, max: 9 },

  // E
  { iso: "EC", name: "Ecuador", dial: "593", min: 8, max: 9 },
  { iso: "EE", name: "Estonia", dial: "372", min: 7, max: 10 },
  { iso: "EG", name: "Egypt", dial: "20", min: 9, max: 10 },
  { iso: "EH", name: "Western Sahara", dial: "212", min: 9, max: 9 },
  { iso: "ER", name: "Eritrea", dial: "291", min: 7, max: 7 },
  { iso: "ES", name: "Spain", dial: "34", min: 9, max: 9 },
  { iso: "ET", name: "Ethiopia", dial: "251", min: 9, max: 9 },

  // F
  { iso: "FI", name: "Finland", dial: "358", min: 5, max: 12 },
  { iso: "FJ", name: "Fiji", dial: "679", min: 7, max: 7 },
  { iso: "FK", name: "Falkland Islands", dial: "500", min: 5, max: 5 },
  { iso: "FM", name: "Micronesia", dial: "691", min: 7, max: 7 },
  { iso: "FO", name: "Faroe Islands", dial: "298", min: 6, max: 6 },
  { iso: "FR", name: "France", dial: "33", min: 9, max: 9 },

  // G
  { iso: "GA", name: "Gabon", dial: "241", min: 7, max: 8 },
  { iso: "GB", name: "United Kingdom", dial: "44", min: 7, max: 10 },
  { iso: "GD", name: "Grenada", dial: "1473", min: 7, max: 7 },
  { iso: "GE", name: "Georgia", dial: "995", min: 9, max: 9 },
  { iso: "GF", name: "French Guiana", dial: "594", min: 9, max: 9 },
  { iso: "GG", name: "Guernsey", dial: "44", min: 10, max: 10 },
  { iso: "GH", name: "Ghana", dial: "233", min: 9, max: 9 },
  { iso: "GI", name: "Gibraltar", dial: "350", min: 8, max: 8 },
  { iso: "GL", name: "Greenland", dial: "299", min: 6, max: 6 },
  { iso: "GM", name: "Gambia", dial: "220", min: 7, max: 7 },
  { iso: "GN", name: "Guinea", dial: "224", min: 8, max: 9 },
  { iso: "GP", name: "Guadeloupe", dial: "590", min: 9, max: 9 },
  { iso: "GQ", name: "Equatorial Guinea", dial: "240", min: 9, max: 9 },
  { iso: "GR", name: "Greece", dial: "30", min: 10, max: 10 },
  { iso: "GT", name: "Guatemala", dial: "502", min: 8, max: 8 },
  { iso: "GU", name: "Guam", dial: "1671", min: 7, max: 7 },
  { iso: "GW", name: "Guinea-Bissau", dial: "245", min: 7, max: 7 },
  { iso: "GY", name: "Guyana", dial: "592", min: 7, max: 7 },

  // H
  { iso: "HK", name: "Hong Kong", dial: "852", min: 8, max: 8 },
  { iso: "HN", name: "Honduras", dial: "504", min: 8, max: 8 },
  { iso: "HR", name: "Croatia", dial: "385", min: 8, max: 9 },
  { iso: "HT", name: "Haiti", dial: "509", min: 8, max: 8 },
  { iso: "HU", name: "Hungary", dial: "36", min: 8, max: 9 },

  // I
  { iso: "ID", name: "Indonesia", dial: "62", min: 9, max: 12 },
  { iso: "IE", name: "Ireland", dial: "353", min: 7, max: 11 },
  { iso: "IL", name: "Israel", dial: "972", min: 8, max: 9 },
  { iso: "IM", name: "Isle of Man", dial: "44", min: 10, max: 10 },
  { iso: "IO", name: "British Indian Ocean Territory", dial: "246", min: 7, max: 7 },
  { iso: "IQ", name: "Iraq", dial: "964", min: 9, max: 10 },
  { iso: "IR", name: "Iran", dial: "98", min: 10, max: 10 },
  { iso: "IS", name: "Iceland", dial: "354", min: 7, max: 9 },
  { iso: "IT", name: "Italy", dial: "39", min: 6, max: 11 },

  // J
  { iso: "JE", name: "Jersey", dial: "44", min: 10, max: 10 },
  { iso: "JM", name: "Jamaica", dial: "1876", min: 7, max: 7 },
  { iso: "JO", name: "Jordan", dial: "962", min: 8, max: 9 },
  { iso: "JP", name: "Japan", dial: "81", min: 10, max: 10 },

  // K
  { iso: "KE", name: "Kenya", dial: "254", min: 9, max: 10 },
  { iso: "KG", name: "Kyrgyzstan", dial: "996", min: 9, max: 9 },
  { iso: "KH", name: "Cambodia", dial: "855", min: 8, max: 9 },
  { iso: "KI", name: "Kiribati", dial: "686", min: 5, max: 8 },
  { iso: "KM", name: "Comoros", dial: "269", min: 7, max: 7 },
  { iso: "KN", name: "Saint Kitts and Nevis", dial: "1869", min: 7, max: 7 },
  { iso: "KP", name: "North Korea", dial: "850", min: 6, max: 13 },
  { iso: "KR", name: "South Korea", dial: "82", min: 9, max: 10 },
  { iso: "KW", name: "Kuwait", dial: "965", min: 8, max: 8 },
  { iso: "KY", name: "Cayman Islands", dial: "1345", min: 7, max: 7 },
  { iso: "KZ", name: "Kazakhstan", dial: "7", min: 10, max: 10 },

  // L
  { iso: "LA", name: "Laos", dial: "856", min: 8, max: 10 },
  { iso: "LB", name: "Lebanon", dial: "961", min: 7, max: 8 },
  { iso: "LC", name: "Saint Lucia", dial: "1758", min: 7, max: 7 },
  { iso: "LI", name: "Liechtenstein", dial: "423", min: 7, max: 9 },
  { iso: "LK", name: "Sri Lanka", dial: "94", min: 9, max: 9 },
  { iso: "LR", name: "Liberia", dial: "231", min: 7, max: 9 },
  { iso: "LS", name: "Lesotho", dial: "266", min: 8, max: 8 },
  { iso: "LT", name: "Lithuania", dial: "370", min: 8, max: 8 },
  { iso: "LU", name: "Luxembourg", dial: "352", min: 4, max: 11 },
  { iso: "LV", name: "Latvia", dial: "371", min: 8, max: 8 },
  { iso: "LY", name: "Libya", dial: "218", min: 8, max: 10 },

  // M
  { iso: "MA", name: "Morocco", dial: "212", min: 9, max: 9 },
  { iso: "MC", name: "Monaco", dial: "377", min: 8, max: 9 },
  { iso: "MD", name: "Moldova", dial: "373", min: 8, max: 8 },
  { iso: "ME", name: "Montenegro", dial: "382", min: 8, max: 9 },
  { iso: "MF", name: "Saint Martin", dial: "590", min: 9, max: 9 },
  { iso: "MG", name: "Madagascar", dial: "261", min: 9, max: 9 },
  { iso: "MH", name: "Marshall Islands", dial: "692", min: 7, max: 7 },
  { iso: "MK", name: "North Macedonia", dial: "389", min: 8, max: 8 },
  { iso: "ML", name: "Mali", dial: "223", min: 8, max: 8 },
  { iso: "MM", name: "Myanmar", dial: "95", min: 7, max: 10 },
  { iso: "MN", name: "Mongolia", dial: "976", min: 8, max: 8 },
  { iso: "MO", name: "Macao", dial: "853", min: 8, max: 8 },
  { iso: "MP", name: "Northern Mariana Islands", dial: "1670", min: 7, max: 7 },
  { iso: "MQ", name: "Martinique", dial: "596", min: 9, max: 9 },
  { iso: "MR", name: "Mauritania", dial: "222", min: 8, max: 8 },
  { iso: "MS", name: "Montserrat", dial: "1664", min: 7, max: 7 },
  { iso: "MT", name: "Malta", dial: "356", min: 8, max: 8 },
  { iso: "MU", name: "Mauritius", dial: "230", min: 7, max: 8 },
  { iso: "MV", name: "Maldives", dial: "960", min: 7, max: 7 },
  { iso: "MW", name: "Malawi", dial: "265", min: 7, max: 9 },
  { iso: "MX", name: "Mexico", dial: "52", min: 10, max: 10 },
  { iso: "MY", name: "Malaysia", dial: "60", min: 9, max: 10 },
  { iso: "MZ", name: "Mozambique", dial: "258", min: 8, max: 9 },

  // N
  { iso: "NA", name: "Namibia", dial: "264", min: 7, max: 10 },
  { iso: "NC", name: "New Caledonia", dial: "687", min: 6, max: 6 },
  { iso: "NE", name: "Niger", dial: "227", min: 8, max: 8 },
  { iso: "NF", name: "Norfolk Island", dial: "672", min: 6, max: 6 },
  { iso: "NG", name: "Nigeria", dial: "234", min: 10, max: 10 },
  { iso: "NI", name: "Nicaragua", dial: "505", min: 8, max: 8 },
  { iso: "NL", name: "Netherlands", dial: "31", min: 9, max: 9 },
  { iso: "NO", name: "Norway", dial: "47", min: 8, max: 8 },
  { iso: "NP", name: "Nepal", dial: "977", min: 9, max: 10 },
  { iso: "NR", name: "Nauru", dial: "674", min: 7, max: 7 },
  { iso: "NU", name: "Niue", dial: "683", min: 4, max: 4 },
  { iso: "NZ", name: "New Zealand", dial: "64", min: 8, max: 10 },

  // O
  { iso: "OM", name: "Oman", dial: "968", min: 8, max: 8 },

  // P
  { iso: "PA", name: "Panama", dial: "507", min: 7, max: 8 },
  { iso: "PE", name: "Peru", dial: "51", min: 8, max: 11 },
  { iso: "PF", name: "French Polynesia", dial: "689", min: 6, max: 8 },
  { iso: "PG", name: "Papua New Guinea", dial: "675", min: 7, max: 8 },
  { iso: "PH", name: "Philippines", dial: "63", min: 10, max: 10 },
  { iso: "PK", name: "Pakistan", dial: "92", min: 10, max: 10 },
  { iso: "PL", name: "Poland", dial: "48", min: 9, max: 9 },
  { iso: "PM", name: "Saint Pierre and Miquelon", dial: "508", min: 6, max: 6 },
  { iso: "PN", name: "Pitcairn Islands", dial: "64", min: 8, max: 10 },
  { iso: "PR", name: "Puerto Rico", dial: "1787", min: 7, max: 7 },
  { iso: "PS", name: "Palestine", dial: "970", min: 8, max: 9 },
  { iso: "PT", name: "Portugal", dial: "351", min: 9, max: 9 },
  { iso: "PW", name: "Palau", dial: "680", min: 7, max: 7 },
  { iso: "PY", name: "Paraguay", dial: "595", min: 9, max: 9 },

  // Q
  { iso: "QA", name: "Qatar", dial: "974", min: 8, max: 8 },

  // R
  { iso: "RE", name: "Réunion", dial: "262", min: 9, max: 9 },
  { iso: "RO", name: "Romania", dial: "40", min: 9, max: 9 },
  { iso: "RS", name: "Serbia", dial: "381", min: 8, max: 9 },
  { iso: "RU", name: "Russia", dial: "7", min: 10, max: 10 },
  { iso: "RW", name: "Rwanda", dial: "250", min: 9, max: 9 },

  // S
  { iso: "SA", name: "Saudi Arabia", dial: "966", min: 9, max: 9 },
  { iso: "SB", name: "Solomon Islands", dial: "677", min: 5, max: 7 },
  { iso: "SC", name: "Seychelles", dial: "248", min: 7, max: 7 },
  { iso: "SD", name: "Sudan", dial: "249", min: 9, max: 9 },
  { iso: "SE", name: "Sweden", dial: "46", min: 7, max: 13 },
  { iso: "SG", name: "Singapore", dial: "65", min: 8, max: 8 },
  { iso: "SH", name: "Saint Helena", dial: "290", min: 4, max: 4 },
  { iso: "SI", name: "Slovenia", dial: "386", min: 8, max: 8 },
  { iso: "SJ", name: "Svalbard and Jan Mayen", dial: "47", min: 8, max: 8 },
  { iso: "SK", name: "Slovakia", dial: "421", min: 9, max: 9 },
  { iso: "SL", name: "Sierra Leone", dial: "232", min: 8, max: 8 },
  { iso: "SM", name: "San Marino", dial: "378", min: 6, max: 10 },
  { iso: "SN", name: "Senegal", dial: "221", min: 9, max: 9 },
  { iso: "SO", name: "Somalia", dial: "252", min: 7, max: 9 },
  { iso: "SR", name: "Suriname", dial: "597", min: 6, max: 7 },
  { iso: "SS", name: "South Sudan", dial: "211", min: 9, max: 9 },
  { iso: "ST", name: "São Tomé and Príncipe", dial: "239", min: 7, max: 7 },
  { iso: "SV", name: "El Salvador", dial: "503", min: 8, max: 8 },
  { iso: "SX", name: "Sint Maarten", dial: "1721", min: 7, max: 7 },
  { iso: "SY", name: "Syria", dial: "963", min: 8, max: 9 },
  { iso: "SZ", name: "Eswatini", dial: "268", min: 7, max: 8 },

  // T
  { iso: "TC", name: "Turks and Caicos Islands", dial: "1649", min: 7, max: 7 },
  { iso: "TD", name: "Chad", dial: "235", min: 8, max: 8 },
  { iso: "TG", name: "Togo", dial: "228", min: 8, max: 8 },
  { iso: "TH", name: "Thailand", dial: "66", min: 8, max: 9 },
  { iso: "TJ", name: "Tajikistan", dial: "992", min: 9, max: 9 },
  { iso: "TK", name: "Tokelau", dial: "690", min: 4, max: 4 },
  { iso: "TL", name: "Timor-Leste", dial: "670", min: 7, max: 8 },
  { iso: "TM", name: "Turkmenistan", dial: "993", min: 8, max: 8 },
  { iso: "TN", name: "Tunisia", dial: "216", min: 8, max: 8 },
  { iso: "TO", name: "Tonga", dial: "676", min: 5, max: 7 },
  { iso: "TR", name: "Turkey", dial: "90", min: 10, max: 10 },
  { iso: "TT", name: "Trinidad and Tobago", dial: "1868", min: 7, max: 7 },
  { iso: "TV", name: "Tuvalu", dial: "688", min: 5, max: 6 },
  { iso: "TW", name: "Taiwan", dial: "886", min: 9, max: 9 },
  { iso: "TZ", name: "Tanzania", dial: "255", min: 9, max: 9 },

  // U
  { iso: "UA", name: "Ukraine", dial: "380", min: 9, max: 9 },
  { iso: "UG", name: "Uganda", dial: "256", min: 9, max: 9 },
  { iso: "US", name: "United States", dial: "1", min: 10, max: 10 },
  { iso: "UY", name: "Uruguay", dial: "598", min: 8, max: 8 },
  { iso: "UZ", name: "Uzbekistan", dial: "998", min: 9, max: 9 },

  // V
  { iso: "VA", name: "Vatican City", dial: "379", min: 8, max: 11 },
  { iso: "VC", name: "Saint Vincent and the Grenadines", dial: "1784", min: 7, max: 7 },
  { iso: "VE", name: "Venezuela", dial: "58", min: 10, max: 10 },
  { iso: "VG", name: "British Virgin Islands", dial: "1284", min: 7, max: 7 },
  { iso: "VI", name: "U.S. Virgin Islands", dial: "1340", min: 7, max: 7 },
  { iso: "VN", name: "Vietnam", dial: "84", min: 9, max: 10 },
  { iso: "VU", name: "Vanuatu", dial: "678", min: 5, max: 7 },

  // W
  { iso: "WF", name: "Wallis and Futuna", dial: "681", min: 6, max: 6 },
  { iso: "WS", name: "Samoa", dial: "685", min: 5, max: 7 },

  // X
  { iso: "XK", name: "Kosovo", dial: "383", min: 8, max: 9 },

  // Y
  { iso: "YE", name: "Yemen", dial: "967", min: 7, max: 9 },
  { iso: "YT", name: "Mayotte", dial: "262", min: 9, max: 9 },

  // Z
  { iso: "ZA", name: "South Africa", dial: "27", min: 9, max: 9 },
  { iso: "ZM", name: "Zambia", dial: "260", min: 9, max: 9 },
  { iso: "ZW", name: "Zimbabwe", dial: "263", min: 5, max: 10 },
];

export function flagFor(iso: string): string {
  const code = iso.toUpperCase();
  if (!/^[A-Z]{2}$/.test(code)) return "";
  return String.fromCodePoint(...[...code].map((c) => 127397 + c.charCodeAt(0)));
}

export function findCountry(iso: string): Country | undefined {
  return COUNTRIES.find((c) => c.iso === iso);
}

export const DEFAULT_COUNTRY_ISO = "IN";
