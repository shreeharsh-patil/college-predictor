import fs from "fs";
import path from "path";
import crypto from "crypto";
// pdf-parse is an optional, local import utility rather than app runtime code.
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { PDFParse } = require("pdf-parse") as {
  PDFParse: new (options: { data: Buffer }) => { getText: () => Promise<{ text: string }> };
};
import round1Data from "../data/round1-cutoffs.json";
import round3Data from "../data/round3-cutoffs.json";

export type RawAllotment = {
  sno: number;
  rank: number;
  allottedQuota: string;
  normalizedQuota: string;
  kind: "Government" | "Central" | "Aided" | "Deemed" | "Private";
  rawInstitute: string;
  canonicalName: string;
  state: string;
  rawCourse: string;
  course: "BAMS" | "BHMS" | "BUMS" | "BSMS" | "B.Pharm";
  allottedCategory: string;
  candidateCategory: "General" | "OBC" | "EWS" | "SC" | "ST";
  pwbd: boolean;
  femaleOnly: boolean;
  remarks: string;
};

export type Svr1CutoffGroup = {
  id: string;
  name: string;
  course: "BAMS" | "BHMS" | "BUMS" | "BSMS" | "B.Pharm";
  openingRank: number;
  closingRank: number;
  allotmentCount: number;
  ranks: number[];
  period: string;
  round: "SVR1";
  category: "General" | "OBC" | "EWS" | "SC" | "ST";
  pwbd: boolean;
  seatCategories: string[];
  allottedCategory: string;
  quota: string;
  state: string;
  kind: "Government" | "Central" | "Aided" | "Deemed" | "Private";
  femaleOnly: boolean;
};

export const SVR1_METADATA = {
  year: 2025,
  counselling: "AACCC UG",
  round: "SVR1",
  title: "Provisional Ayurveda/ Siddha/ Unani / Homoeopathy UG Counselling Seats Allotment - 2025 Stray Vacancy Round (SVR-I)",
  sourceUrl: "https://cdnbbsr.s3waas.gov.in/s3653ac11ca60b3e021a8c609c7198acfc/uploads/2025/11/202511081701832043.pdf",
  publishedDate: "2025-11-07",
};

const KNOWN_QUOTAS = [
  "Central Universites / National Institutions",
  "Central Universities / National Institutions",
  "All India Quota Govt Aided",
  "All India Quota Government",
  "Management/Paid Seats Quota",
  "Muslim Minority Quota(Govt Aided)",
  "Jain Minority Quota(Govt Aided)",
  "Muslim Minority Quota",
  "Jain Minority Quota",
  "Linguistic Minority",
  "Non-Resident Indian",
  "Self Finance",
];

const KNOWN_COURSES: Record<string, "BAMS" | "BHMS" | "BUMS" | "BSMS" | "B.Pharm"> = {
  "Bachelor of Ayurvedic Medicine and Surgery": "BAMS",
  "Bachelor of Homoeopathic Medicine and Surgery": "BHMS",
  "Bachelor of Unani Medicine and Surgery": "BUMS",
  "Bachelor of Siddha Medicine and Surgery": "BSMS",
  "B.Pharm": "B.Pharm",
};

const STATES = [
  "Andaman and Nicobar Islands", "Andhra Pradesh", "Arunachal Pradesh", "Assam",
  "Bihar", "Chandigarh", "Chhattisgarh", "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jammu and Kashmir",
  "Jharkhand", "Karnataka", "Kerala", "Ladakh", "Lakshadweep", "Madhya Pradesh",
  "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha",
  "Puducherry", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana",
  "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
];

export function extractState(institute: string): string {
  if (/Kathua/i.test(institute)) return "Jammu and Kashmir";
  if (/New Delhi|Delhi/i.test(institute)) return "Delhi";
  if (/Puducherry|Pondicherry/i.test(institute)) return "Puducherry";
  if (/Chandigarh/i.test(institute)) return "Chandigarh";

  let foundState = "";
  let latestPos = -1;
  for (const state of STATES) {
    const reg = new RegExp(`\\b${state.replace(/\s+/g, "\\s+")}\\b`, "gi");
    let match: RegExpExecArray | null;
    while ((match = reg.exec(institute)) !== null) {
      if (match.index > latestPos) {
        latestPos = match.index;
        foundState = state;
      }
    }
  }
  return foundState;
}

export function normalizeQuota(quotaStr: string): { normalizedQuota: string; kind: "Government" | "Central" | "Aided" | "Deemed" | "Private" } {
  if (quotaStr.includes("Central")) {
    return { normalizedQuota: "Central Universities / National Institutions", kind: "Central" };
  }
  if (quotaStr.includes("Govt Aided") || quotaStr === "All India Quota Govt Aided" || quotaStr === "Muslim Minority Quota(Govt Aided)") {
    return {
      normalizedQuota: quotaStr === "Muslim Minority Quota(Govt Aided)" ? "Muslim Minority Quota (Govt Aided)" : quotaStr,
      kind: "Aided",
    };
  }
  if (quotaStr === "All India Quota Government") {
    return { normalizedQuota: quotaStr, kind: "Government" };
  }
  if (quotaStr === "Self Finance") {
    return { normalizedQuota: "Self Finance", kind: "Private" };
  }
  return { normalizedQuota: quotaStr, kind: "Deemed" };
}

export function parseTail(tail: string) {
  const isPwbd = tail.includes("PwD") || tail.includes("PwBD");
  const words = tail.replace(/\s+Allotted$/, "").trim().split(/\s+/);
  const allottedCat = words[0];
  const candCat = words[1];
  return {
    allottedCategory: allottedCat,
    candidateCategory: candCat as "General" | "OBC" | "EWS" | "SC" | "ST",
    pwbd: isPwbd,
    remarks: "Allotted",
  };
}

const existingNames = Array.from(new Set([...round1Data, ...round3Data].map((x: { name: string }) => x.name)));

export function getCanonicalName(rawInst: string): string {
  if (existingNames.includes(rawInst)) return rawInst;
  const found = existingNames.find(ex => rawInst.startsWith(ex) || ex.startsWith(rawInst));
  if (found) return found;
  return rawInst;
}

export async function parseSvr1Pdf(pdfPath: string): Promise<{ rawAllotments: RawAllotment[]; cutoffs: Svr1CutoffGroup[] }> {
  const buffer = fs.readFileSync(pdfPath);
  const parser = new PDFParse({ data: buffer });
  const result = await parser.getText();
  const text = result.text;

  const cleanedText = text
    .replace(/Page No\.\s+\d+\s+\d{2}-\d{2}-\d{4}\s+\d{2}:\d{2}:\d{2}\s+[AP]M/g, "")
    .replace(/-- \d+ of \d+ --/g, "")
    .replace(/Provisional Ayurveda\/ Siddha\/ Unani \/ Homoeopathy UG Counselling Seats Allotment\s*-2025 Stray Vacancy Round \(SVR-I\)/g, "")
    .replace(/SNo\s+Rank\s+Allotted Quota\s+Allotted Institute\s+Course\s+Alloted\s*Category\s*Candidate\s*Category\s*Remarks/g, "");

  const regex = /(?:^|\n)\s*(\d{1,3})\s+(\d{4,7})\s+/g;
  const matches: { sno: number; rank: number; start: number; end: number }[] = [];
  let m: RegExpExecArray | null;
  while ((m = regex.exec(cleanedText)) !== null) {
    matches.push({ sno: parseInt(m[1], 10), rank: parseInt(m[2], 10), start: m.index, end: regex.lastIndex });
  }

  if (matches.length !== 417) {
    throw new Error(`Expected exactly 417 rows, but found ${matches.length}`);
  }

  const rawAllotments: RawAllotment[] = [];
  for (let i = 0; i < matches.length; i++) {
    const cur = matches[i];
    const nextStart = i + 1 < matches.length ? matches[i + 1].start : cleanedText.length;
    const raw = cleanedText.slice(cur.end, nextStart).replace(/\s+/g, " ").trim();

    const rawQuota = KNOWN_QUOTAS.find(q => raw.startsWith(q));
    if (!rawQuota) {
      throw new Error(`Row ${cur.sno}: Quota could not be parsed from: ${raw}`);
    }

    const afterQuota = raw.slice(rawQuota.length).trim();
    let courseIdx = -1;
    let matchedCourseRaw = "";
    for (const c of Object.keys(KNOWN_COURSES)) {
      const idx = afterQuota.lastIndexOf(c);
      if (idx !== -1 && idx > courseIdx) {
        courseIdx = idx;
        matchedCourseRaw = c;
      }
    }

    if (!matchedCourseRaw || courseIdx === -1) {
      throw new Error(`Row ${cur.sno}: Course could not be parsed from: ${afterQuota}`);
    }

    const rawInstitute = afterQuota.slice(0, courseIdx).trim();
    const tail = afterQuota.slice(courseIdx + matchedCourseRaw.length).trim();
    const { allottedCategory, candidateCategory, pwbd, remarks } = parseTail(tail);
    const { normalizedQuota, kind } = normalizeQuota(rawQuota);
    const state = extractState(rawInstitute);
    const course = KNOWN_COURSES[matchedCourseRaw];
    const canonicalName = getCanonicalName(rawInstitute);
    const femaleOnly = rawInstitute.includes("(Female Seat only )");

    if (!rawInstitute) throw new Error(`Row ${cur.sno}: Missing institute`);
    if (!course) throw new Error(`Row ${cur.sno}: Missing course`);
    if (!normalizedQuota) throw new Error(`Row ${cur.sno}: Missing quota`);
    if (!candidateCategory) throw new Error(`Row ${cur.sno}: Missing candidate category`);
    if (!allottedCategory) throw new Error(`Row ${cur.sno}: Missing allotted category`);
    if (!state) throw new Error(`Row ${cur.sno}: Missing state for institute: ${rawInstitute}`);

    rawAllotments.push({
      sno: cur.sno,
      rank: cur.rank,
      allottedQuota: rawQuota,
      normalizedQuota,
      kind,
      rawInstitute,
      canonicalName,
      state,
      rawCourse: matchedCourseRaw,
      course,
      allottedCategory,
      candidateCategory,
      pwbd,
      femaleOnly,
      remarks,
    });
  }

  // Group into cutoffs
  const groupMap = new Map<string, {
    canonicalName: string;
    course: "BAMS" | "BHMS" | "BUMS" | "BSMS" | "B.Pharm";
    quota: string;
    kind: "Government" | "Central" | "Aided" | "Deemed" | "Private";
    state: string;
    category: "General" | "OBC" | "EWS" | "SC" | "ST";
    pwbd: boolean;
    allottedCategory: string;
    femaleOnly: boolean;
    ranks: number[];
  }>();

  for (const item of rawAllotments) {
    const key = `${item.canonicalName}||${item.course}||${item.normalizedQuota}||${item.candidateCategory}||${item.pwbd}||${item.allottedCategory}`;
    if (!groupMap.has(key)) {
      groupMap.set(key, {
        canonicalName: item.canonicalName,
        course: item.course,
        quota: item.normalizedQuota,
        kind: item.kind,
        state: item.state,
        category: item.candidateCategory,
        pwbd: item.pwbd,
        allottedCategory: item.allottedCategory,
        femaleOnly: item.femaleOnly,
        ranks: [],
      });
    }
    groupMap.get(key)!.ranks.push(item.rank);
  }

  const cutoffs: Svr1CutoffGroup[] = [];
  for (const [key, g] of groupMap.entries()) {
    const sortedRanks = [...g.ranks].sort((a, b) => a - b);
    const openingRank = sortedRanks[0];
    const closingRank = sortedRanks[sortedRanks.length - 1];
    const hash = crypto.createHash("sha256").update(key).digest("hex").slice(0, 10);
    const id = `svr1-${hash}`;

    if (openingRank > closingRank) {
      throw new Error(`Cutoff ${id} invalid: opening ${openingRank} > closing ${closingRank}`);
    }

    cutoffs.push({
      id,
      name: g.canonicalName,
      course: g.course,
      openingRank,
      closingRank,
      allotmentCount: g.ranks.length,
      ranks: sortedRanks,
      period: "2025 SVR-I",
      round: "SVR1",
      category: g.category,
      pwbd: g.pwbd,
      seatCategories: [g.allottedCategory],
      allottedCategory: g.allottedCategory,
      quota: g.quota,
      state: g.state,
      kind: g.kind,
      femaleOnly: g.femaleOnly,
    });
  }

  // Sort cutoffs deterministically by course, name, category, openingRank
  cutoffs.sort((a, b) =>
    a.name.localeCompare(b.name) ||
    a.course.localeCompare(b.course) ||
    a.category.localeCompare(b.category) ||
    a.openingRank - b.openingRank
  );

  return { rawAllotments, cutoffs };
}

async function main() {
  const pdfPath = path.resolve("data/svr1-source.pdf");
  console.log(`Starting SVR-I data import from ${pdfPath}...`);
  const { rawAllotments, cutoffs } = await parseSvr1Pdf(pdfPath);

  // Validation rules:
  // 1. exactly 417 raw allotment rows parsed
  if (rawAllotments.length !== 417) throw new Error(`Validation failed: Expected 417 rows, got ${rawAllotments.length}`);

  // 2. serial numbers 1..417 present with no duplicates
  const snos = new Set<number>();
  for (const item of rawAllotments) {
    if (snos.has(item.sno)) throw new Error(`Validation failed: Duplicate sno ${item.sno}`);
    snos.add(item.sno);
  }
  for (let i = 1; i <= 417; i++) {
    if (!snos.has(i)) throw new Error(`Validation failed: Missing sno ${i}`);
  }

  // 3. rank is positive integer
  for (const item of rawAllotments) {
    if (!Number.isInteger(item.rank) || item.rank <= 0) {
      throw new Error(`Validation failed: Invalid rank ${item.rank} at sno ${item.sno}`);
    }
  }

  // 4. first observed rank = 26664
  if (rawAllotments[0].rank !== 26664) {
    throw new Error(`Validation failed: First rank expected 26664, got ${rawAllotments[0].rank}`);
  }

  // 5. last/final listed AIR = 1313005
  if (rawAllotments[416].rank !== 1313005) {
    throw new Error(`Validation failed: Last rank expected 1313005, got ${rawAllotments[416].rank}`);
  }

  // 6. every generated cutoff has openingRank <= closingRank
  for (const c of cutoffs) {
    if (c.openingRank > c.closingRank) {
      throw new Error(`Validation failed: Cutoff ${c.id} openingRank ${c.openingRank} > closingRank ${c.closingRank}`);
    }
  }

  // Save generated JSON
  const outputPath = path.resolve("data/svr1-cutoffs.json");
  fs.writeFileSync(outputPath, JSON.stringify(cutoffs, null, 2), "utf-8");
  console.log(`Generated and wrote ${cutoffs.length} cutoff records to ${outputPath}`);

  // Save raw allotments metadata for reference/validation
  const rawOutputPath = path.resolve("data/svr1-allotments.json");
  fs.writeFileSync(rawOutputPath, JSON.stringify(rawAllotments, null, 2), "utf-8");

  // Print requested import statistics
  const uniqueInstitutes = new Set(rawAllotments.map(r => r.canonicalName)).size;
  const bamsCount = rawAllotments.filter(r => r.course === "BAMS").length;
  const bhmsCount = rawAllotments.filter(r => r.course === "BHMS").length;
  const bumsCount = rawAllotments.filter(r => r.course === "BUMS").length;
  const bsmsCount = rawAllotments.filter(r => r.course === "BSMS").length;
  const minAir = Math.min(...rawAllotments.map(r => r.rank));
  const maxAir = Math.max(...rawAllotments.map(r => r.rank));

  console.log("\n========================================");
  console.log("SVR-I IMPORT SUMMARY");
  console.log("========================================");
  console.log(`SVR-I raw allotments: ${rawAllotments.length}`);
  console.log(`Unique institutes: ${uniqueInstitutes}`);
  console.log(`BAMS: ${bamsCount}`);
  console.log(`BHMS: ${bhmsCount}`);
  console.log(`BUMS: ${bumsCount}`);
  console.log(`BSMS: ${bsmsCount}`);
  console.log(`Generated cutoff groups: ${cutoffs.length}`);
  console.log(`Min AIR: ${new Intl.NumberFormat("en-IN").format(minAir)}`);
  console.log(`Max AIR: ${new Intl.NumberFormat("en-IN").format(maxAir)}`);
  console.log("========================================\n");
}

if (process.argv[1] && process.argv[1].includes("import-svr1")) {
  main().catch((err) => {
    console.error("Import failed:", err);
    process.exit(1);
  });
}
