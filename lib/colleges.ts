export type Category = "General" | "OBC" | "SC" | "ST" | "EWS";
export type College = { id: number; name: string; state: string; city: string; course: "MBBS" | "BDS" | "BAMS"; type: "Government" | "Private"; fees: number; closingRank: number };

// Real institution names; ALL numbers are fabricated demo data, not official cutoffs.
export const colleges: College[] = [
  { id: 1, name: "Maulana Azad Medical College", state: "Delhi", city: "New Delhi", course: "MBBS", type: "Government", fees: 4500, closingRank: 1200 },
  { id: 2, name: "SMS Medical College", state: "Rajasthan", city: "Jaipur", course: "MBBS", type: "Government", fees: 45000, closingRank: 6500 },
  { id: 3, name: "B. J. Medical College", state: "Gujarat", city: "Ahmedabad", course: "MBBS", type: "Government", fees: 25000, closingRank: 12000 },
  { id: 4, name: "Government Dental College & Hospital", state: "Maharashtra", city: "Mumbai", course: "BDS", type: "Government", fees: 85000, closingRank: 42000 },
  { id: 5, name: "Kasturba Medical College", state: "Karnataka", city: "Manipal", course: "MBBS", type: "Private", fees: 1750000, closingRank: 60000 },
  { id: 6, name: "JSS Ayurveda Medical College", state: "Karnataka", city: "Mysuru", course: "BAMS", type: "Private", fees: 350000, closingRank: 140000 },
];
export const categories: Category[] = ["General", "OBC", "SC", "ST", "EWS"];
export const states = ["Andaman and Nicobar Islands", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chandigarh", "Chhattisgarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jammu and Kashmir", "Jharkhand", "Karnataka", "Kerala", "Ladakh", "Lakshadweep", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Puducherry", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"];

export const formatNumber = (number: number) => new Intl.NumberFormat("en-IN").format(number);
export const formatFees = (fees: number) => fees >= 100000 ? `₹${Number((fees / 100000).toFixed(2))} lakh` : `₹${formatNumber(fees)}`;
