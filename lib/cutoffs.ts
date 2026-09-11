import round1Data from "../data/round1-cutoffs.json";
import round2Data from "../data/round2-cutoffs.json";
import round3Data from "../data/round3-cutoffs.json";
import svr1Data from "../data/svr1-cutoffs.json";
import svr2Data from "../data/svr2-cutoffs.json";

export type Course = "BAMS" | "BHMS" | "BSMS" | "BUMS" | "B.Pharm";
export type CollegeKind = "Government" | "Central" | "Aided" | "Deemed" | "Private";
export type CollegePreference = "All" | CollegeKind;
export type Category = "General" | "OBC" | "EWS" | "SC" | "ST";
export type CounsellingRound = "R1" | "R2" | "R3" | "SVR1" | "SVR2";
export type RoundSelection = "ALL" | CounsellingRound | number;
export type MatchStatus = "SAFE" | "GOOD CHANCE" | "COMPETITIVE" | "REACH";

export type CutoffRecord = {
  id: string;
  name: string;
  course: Course;
  openingRank: number;
  closingRank: number;
  period: string;
  round: CounsellingRound | number;
  category: Category;
  pwbd: boolean;
  seatCategories: string[];
  allottedCategory?: string;
  allotmentCount?: number;
  ranks?: number[];
  quota: string;
  state: string;
  kind: CollegeKind;
  femaleOnly: boolean;
};

export type RoundTrends = {
  R1?: number;
  R2?: number;
  R3?: number;
  SVR1?: number;
  SVR2?: number;
};

export type PredictionMatch = CutoffRecord & {
  rankGap: number;
  openingGap: number;
  matchStatus: MatchStatus;
  matchExplanation: string;
  searchScore: number;
  admissionScore: number;
  normalizedName: string;
  roundTrends: RoundTrends;
  evaluatedRound: CounsellingRound;
};

export type PredictionFilterOptions = {
  searchQuery?: string;
  courseFilter?: string;
  kindFilter?: CollegePreference;
  quotaFilter?: string;
  stateFilter?: string;
  matchStatusFilter?: MatchStatus | "All";
  includeReach?: boolean;
};

export const DATA_SOURCES_METADATA = [
  {
    year: 2025,
    counselling: "AACCC UG",
    round: "R1" as CounsellingRound,
    title: "AACCC UG Counselling Round 1 Allotment Data",
    sourceUrl: "https://aaccc.gov.in",
    publishedDate: "2025-09-15",
  },
  {
    year: 2025,
    counselling: "AACCC UG",
    round: "R2" as CounsellingRound,
    title: "AACCC UG Counselling Round 2 Allotment Data",
    sourceUrl: "https://aaccc.gov.in",
    publishedDate: "2025-09-23",
  },
  {
    year: 2025,
    counselling: "AACCC UG",
    round: "R3" as CounsellingRound,
    title: "AACCC UG Counselling Round 3 Allotment Data",
    sourceUrl: "https://aaccc.gov.in",
    publishedDate: "2025-10-20",
  },
  {
    year: 2025,
    counselling: "AACCC UG",
    round: "SVR1" as CounsellingRound,
    title: "Provisional Ayurveda/ Siddha/ Unani / Homoeopathy UG Counselling Seats Allotment - 2025 Stray Vacancy Round (SVR-I)",
    sourceUrl: "https://cdnbbsr.s3waas.gov.in/s3653ac11ca60b3e021a8c609c7198acfc/uploads/2025/11/202511081701832043.pdf",
    publishedDate: "2025-11-07",
  },
  {
    year: 2025,
    counselling: "AACCC UG",
    round: "SVR2" as CounsellingRound,
    title: "Ayurveda/ Siddha/ Unani / Homoeopathy UG Counselling Seats Allotment - 2025 Stray Round II",
    sourceUrl: "https://aaccc.gov.in",
    publishedDate: "2025-11-20",
  },
];

export const cutoffRecords = [
  ...(round1Data as CutoffRecord[]),
  ...(round2Data as CutoffRecord[]),
  ...(round3Data as CutoffRecord[]),
  ...(svr1Data as CutoffRecord[]),
  ...(svr2Data as CutoffRecord[]),
];

export const STATES = [
  "Andaman and Nicobar Islands", "Andhra Pradesh", "Arunachal Pradesh", "Assam",
  "Bihar", "Chandigarh", "Chhattisgarh", "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jammu and Kashmir",
  "Jharkhand", "Karnataka", "Kerala", "Ladakh", "Lakshadweep", "Madhya Pradesh",
  "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha",
  "Puducherry", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana",
  "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
];

export function validateRank(value: number): boolean {
  return Number.isFinite(value) && Number.isInteger(value) && value >= 1 && value <= 3000000;
}

export const formatRank = (rank: number): string => new Intl.NumberFormat("en-IN").format(rank);

export function normalizeRound(round: CounsellingRound | number | string): CounsellingRound {
  if (round === 1 || round === "1" || round === "R1") return "R1";
  if (round === 2 || round === "2" || round === "R2") return "R2";
  if (round === 3 || round === "3" || round === "R3") return "R3";
  if (round === "SVR2") return "SVR2";
  return "SVR1";
}

export function formatRound(round: CounsellingRound | number | string): string {
  const norm = normalizeRound(round);
  switch (norm) {
    case "R1": return "Round 1";
    case "R2": return "Round 2";
    case "R3": return "Round 3";
    case "SVR1": return "Stray Vacancy Round I";
    case "SVR2": return "Stray Vacancy Round II";
  }
}

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

export function normalizeQuota(quotaStr: string): { normalizedQuota: string; kind: CollegeKind } {
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

export function normalizeCourse(course: string): Course {
  if (course.includes("Ayurved")) return "BAMS";
  if (course.includes("Homoeopath") || course.includes("Homeopath")) return "BHMS";
  if (course.includes("Unani")) return "BUMS";
  if (course.includes("Siddha")) return "BSMS";
  if (course.includes("Pharm")) return "B.Pharm";
  return (course as Course);
}

export function normalizeCategory(category: string): Category {
  const upper = category.toUpperCase();
  if (upper.includes("OBC") || upper.includes("BC")) return "OBC";
  if (upper.includes("EWS") || upper.includes("EW")) return "EWS";
  if (upper.includes("ST")) return "ST";
  if (upper.includes("SC")) return "SC";
  return "General";
}

export function normalizeInstituteName(name: string): string {
  let cleaned = name
    .replace(/\s+/g, " ")
    .replace(/[\r\n\t]+/g, " ")
    .replace(/,\s*,+/g, ",")
    .replace(/,\s*[A-Za-z\s-]*\d{5,6}.*$/, "")
    .trim();

  const parts = cleaned.split(",").map(p => p.trim()).filter(Boolean);
  const uniqueParts: string[] = [];
  for (const part of parts) {
    if (!uniqueParts.some(u => u.toLowerCase() === part.toLowerCase())) {
      uniqueParts.push(part);
    }
  }

  cleaned = uniqueParts.join(", ");
  return cleaned.replace(/[,.-]+$/, "").trim();
}

// Known common acronyms and aliases for AYUSH institutions
const COLLEGE_ALIASES: Record<string, string[]> = {
  "All India Institute of Ayurveda": ["AIIA", "All India Ayurveda", "AIIA Goa", "North Goa Ayurveda", "Dhargal"],
  "National Institute of Ayurveda": ["NIA", "National Ayurveda Jaipur"],
  "Institute of Teaching and Research in Ayurveda": ["ITRA", "ITRAP", "Jamnagar Ayurveda"],
  "NORTH EASTERN INSTITUTE OF AYURVEDA": ["NEIAH", "NEIAH Homoeopathy", "Shillong"],
  "Bharati Vidyapeeth": ["BVDU", "BVDDU", "Bharati Vidyapeeth Pune"],
  "Dr. D. Y. Patil": ["DY Patil", "DYP", "Patil Pune", "Pimpri"],
  "Padamshri Dr. DY Patil": ["DY Patil", "DYP", "Patil Navi Mumbai", "Nerul"],
  "Faculty of Ayurveda Institute Of Medical Science Banaras Hindu University": ["BHU", "Banaras", "BHU Varanasi"],
  "Ch. Brahm Prakash Ayurved Charak Sansthan": ["CBPACS", "Ch Brahm Prakash", "Najafgarh"],
  "Government Akhandananda": ["Akhandanand", "Ahmedabad Ayurveda", "Gandhinagar"],
};

export function normalizeSearchText(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\bhomeopath(y|ic)?\b/g, "homoeopath")
    .replace(/\bhomoeopath(y|ic)?\b/g, "homoeopath")
    .replace(/\bayurved(a|ic)?\b/g, "ayurved")
    .replace(/\bgov(t|t\.|ernment)?\b/g, "government")
    .replace(/\buniv(ersity)?\b/g, "university")
    .replace(/\s+/g, " ")
    .trim();
}

function levenshteinDistance(a: string, b: string): number {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;
  const matrix = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0));
  for (let i = 0; i <= a.length; i++) matrix[i][0] = i;
  for (let j = 0; j <= b.length; j++) matrix[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }
  return matrix[a.length][b.length];
}

// Seat key for tracking multi-round trends
export function getSeatTrendKey(record: { name: string; course: string; quota: string; category: string; pwbd: boolean }): string {
  const normName = normalizeInstituteName(record.name).toLowerCase();
  const normQuota = record.quota.replace("Universites", "Universities").toLowerCase();
  return `${normName}||${record.course}||${normQuota}||${record.category}||${record.pwbd}`;
}

// Precomputed round trends map across the imported counselling rounds.
const roundTrendsCache: Map<string, RoundTrends> = (() => {
  const map = new Map<string, RoundTrends>();
  for (const record of cutoffRecords) {
    const key = getSeatTrendKey(record);
    if (!map.has(key)) map.set(key, {});
    const entry = map.get(key)!;
    const r = normalizeRound(record.round);
    if (r === "R1") {
      entry.R1 = entry.R1 ? Math.max(entry.R1, record.closingRank) : record.closingRank;
    } else if (r === "R2") {
      entry.R2 = entry.R2 ? Math.max(entry.R2, record.closingRank) : record.closingRank;
    } else if (r === "R3") {
      entry.R3 = entry.R3 ? Math.max(entry.R3, record.closingRank) : record.closingRank;
    } else if (r === "SVR1") {
      entry.SVR1 = entry.SVR1 ? Math.max(entry.SVR1, record.closingRank) : record.closingRank;
    } else if (r === "SVR2") {
      entry.SVR2 = entry.SVR2 ? Math.max(entry.SVR2, record.closingRank) : record.closingRank;
    }
  }
  return map;
})();

export function getRoundTrends(record: CutoffRecord): RoundTrends {
  return roundTrendsCache.get(getSeatTrendKey(record)) || {
    [normalizeRound(record.round)]: record.closingRank,
  };
}

export function getReachThreshold(closingRank: number): number {
  return Math.min(100000, Math.max(3000, Math.round(closingRank * 0.12)));
}

export function isWithinReach(userRank: number, closingRank: number): boolean {
  if (userRank <= closingRank) return true;
  return (userRank - closingRank) <= getReachThreshold(closingRank);
}

export function classifyMatch(
  userRank: number,
  openingRank: number,
  closingRank: number,
  roundLabel: string
): {
  status: MatchStatus;
  rankGap: number;
  openingGap: number;
  explanation: string;
} {
  const rankGap = closingRank - userRank;
  const openingGap = userRank - openingRank;

  if (rankGap >= 0) {
    if (userRank < openingRank || rankGap >= Math.max(2500, Math.round(closingRank * 0.15))) {
      return {
        status: "SAFE",
        rankGap,
        openingGap,
        explanation: `Your AIR is ${formatRank(rankGap)} ranks inside the historical ${roundLabel} closing rank.`,
      };
    }
    if (userRank >= openingRank && rankGap >= Math.max(1000, Math.round(closingRank * 0.05))) {
      return {
        status: "GOOD CHANCE",
        rankGap,
        openingGap,
        explanation: `Your AIR is ${formatRank(rankGap)} ranks inside the historical ${roundLabel} closing rank (range: ${formatRank(openingRank)}–${formatRank(closingRank)}).`,
      };
    }
    return {
      status: "COMPETITIVE",
      rankGap,
      openingGap,
      explanation: `Your AIR is ${formatRank(rankGap)} ranks inside the historical ${roundLabel} closing rank.`,
    };
  } else {
    const miss = userRank - closingRank;
    return {
      status: "REACH",
      rankGap,
      openingGap,
      explanation: `Your AIR is ${formatRank(miss)} ranks beyond the historical closing rank — Reach.`,
    };
  }
}

// Precomputed search index items
type IndexedRecord = {
  record: CutoffRecord;
  normalizedName: string;
  fullSearchText: string;
  tokenList: string[];
  tokenSet: Set<string>;
};

const indexedCutoffRecords: IndexedRecord[] = cutoffRecords.map((record) => {
  const normalizedName = normalizeInstituteName(record.name);
  const normName = normalizeSearchText(record.name);
  const normCleanName = normalizeSearchText(normalizedName);
  const normState = normalizeSearchText(record.state);
  const normCourse = normalizeSearchText(record.course);
  const normQuota = normalizeSearchText(record.quota);
  const normKind = normalizeSearchText(record.kind);

  const extraAliases: string[] = [];
  for (const [key, aliases] of Object.entries(COLLEGE_ALIASES)) {
    if (record.name.toLowerCase().includes(key.toLowerCase()) || normalizedName.toLowerCase().includes(key.toLowerCase())) {
      extraAliases.push(...aliases);
    }
  }
  const normAliases = extraAliases.map(normalizeSearchText).join(" ");

  const fullSearchText = `${normName} ${normCleanName} ${normState} ${normCourse} ${normQuota} ${normKind} ${normAliases}`;
  const tokens = fullSearchText.split(" ").filter((t) => t.length > 0);

  return {
    record,
    normalizedName,
    fullSearchText,
    tokenList: tokens,
    tokenSet: new Set(tokens),
  };
});

export function scoreSearchMatch(item: IndexedRecord, queryTokens: string[], normQuery: string): number {
  if (queryTokens.length === 0) return 0;
  let totalScore = 0;

  if (item.fullSearchText.includes(normQuery)) {
    totalScore += 60;
  }

  for (const qToken of queryTokens) {
    let tokenMatched = false;
    let maxTokenScore = 0;

    if (item.tokenSet.has(qToken)) {
      maxTokenScore = Math.max(maxTokenScore, 30);
      tokenMatched = true;
    } else {
      for (const rToken of item.tokenList) {
        if (rToken.startsWith(qToken)) {
          maxTokenScore = Math.max(maxTokenScore, 20);
          tokenMatched = true;
          break;
        }
        if (qToken.length >= 4 && rToken.length >= 4) {
          const dist = levenshteinDistance(qToken, rToken);
          if (dist === 1) {
            maxTokenScore = Math.max(maxTokenScore, 15);
            tokenMatched = true;
            break;
          }
        }
      }
    }

    if (tokenMatched) {
      totalScore += maxTokenScore;
    } else {
      return 0; // all tokens must match in some form
    }
  }

  return totalScore;
}

export function findMatchingCutoffs(
  rank: number,
  state: string,
  preference: CollegePreference,
  round: RoundSelection,
  category: Category,
  pwbd: boolean,
  gender: string,
  options?: PredictionFilterOptions
): PredictionMatch[] {
  const normRound = round === "ALL" ? "ALL" : normalizeRound(round);
  const normQuery = options?.searchQuery ? normalizeSearchText(options.searchQuery) : "";
  const queryTokens = normQuery ? normQuery.split(" ").filter((t) => t.length > 0) : [];
  const includeReach = options?.includeReach ?? true;

  // Filter candidates
  const candidateRecords = indexedCutoffRecords.filter(({ record }) => {
    // Round filter
    if (normRound !== "ALL") {
      if (normalizeRound(record.round) !== normRound) return false;
    }

    // Category and PwBD
    if (record.category !== category) return false;
    if (record.pwbd !== pwbd) return false;

    // Gender check
    if (record.femaleOnly && gender !== "Female") return false;

    // Explicit filter options
    if (options?.courseFilter && options.courseFilter !== "All" && record.course !== options.courseFilter) {
      return false;
    }
    if (options?.kindFilter && options.kindFilter !== "All" && record.kind !== options.kindFilter) {
      return false;
    }
    if (options?.stateFilter && options.stateFilter !== "All" && record.state !== options.stateFilter) {
      return false;
    }
    if (options?.quotaFilter && options.quotaFilter !== "All" && record.quota !== options.quotaFilter) {
      return false;
    }

    // Cutoff and Reach filter
    if (!includeReach && record.closingRank < rank) return false;
    if (!isWithinReach(rank, record.closingRank)) return false;

    return true;
  });

  // Calculate scores and classification
  const matches: PredictionMatch[] = [];
  for (const item of candidateRecords) {
    const record = item.record;
    const searchScore = queryTokens.length > 0 ? scoreSearchMatch(item, queryTokens, normQuery) : 0;
    if (queryTokens.length > 0 && searchScore === 0) continue;

    const roundLabel = formatRound(record.round);
    const classification = classifyMatch(rank, record.openingRank, record.closingRank, roundLabel);

    if (options?.matchStatusFilter && options.matchStatusFilter !== "All") {
      if (classification.status !== options.matchStatusFilter) continue;
    }

    const isPreferredKind = preference === "All" || record.kind === preference;
    const isHomeState = record.state === state;
    const insideRange = rank >= record.openingRank && rank <= record.closingRank;

    let admissionScore = 0;
    if (classification.status === "SAFE") admissionScore += 5000;
    else if (classification.status === "GOOD CHANCE") admissionScore += 4000;
    else if (classification.status === "COMPETITIVE") admissionScore += 3000;
    else if (classification.status === "REACH") admissionScore += 1000;

    if (insideRange) admissionScore += 600;
    if (isPreferredKind) admissionScore += 300;
    if (isHomeState) admissionScore += 200;

    matches.push({
      ...record,
      rankGap: classification.rankGap,
      openingGap: classification.openingGap,
      matchStatus: classification.status,
      matchExplanation: classification.explanation,
      searchScore,
      admissionScore,
      normalizedName: item.normalizedName,
      roundTrends: getRoundTrends(record),
      evaluatedRound: normalizeRound(record.round),
    });
  }

  // If "ALL" (Best available across rounds) is selected, deduplicate by unique seat
  let finalMatches = matches;
  if (normRound === "ALL") {
    const bestBySeat = new Map<string, PredictionMatch>();
    for (const match of matches) {
      const key = getSeatTrendKey(match);
      const existing = bestBySeat.get(key);
      if (!existing) {
        bestBySeat.set(key, match);
      } else {
        // Pick the match with better admission score or closer rank
        if (match.admissionScore > existing.admissionScore ||
           (match.admissionScore === existing.admissionScore && match.closingRank > existing.closingRank)) {
          bestBySeat.set(key, match);
        }
      }
    }
    finalMatches = Array.from(bestBySeat.values());
  }

  // Sort matches
  finalMatches.sort((a, b) => {
    // If text query is active, high search score strongly influences order
    if (queryTokens.length > 0 && Math.abs(b.searchScore - a.searchScore) >= 15) {
      return b.searchScore - a.searchScore;
    }

    // Reach matches always go after safe/good chance/competitive
    const aIsReach = a.matchStatus === "REACH" ? 1 : 0;
    const bIsReach = b.matchStatus === "REACH" ? 1 : 0;
    if (aIsReach !== bIsReach) return aIsReach - bIsReach;

    // Home state prioritization among eligible matches
    const homeStateDiff = Number(b.state === state) - Number(a.state === state);
    if (homeStateDiff !== 0) return homeStateDiff;

    // Preferred college kind prioritization
    const kindDiff = preference === "All" ? 0 : Number(b.kind === preference) - Number(a.kind === preference);
    if (kindDiff !== 0) return kindDiff;

    // Rank fit and admission score
    return (
      b.admissionScore - a.admissionScore ||
      Math.abs(a.closingRank - rank) - Math.abs(b.closingRank - rank) ||
      a.name.localeCompare(b.name)
    );
  });

  return finalMatches;
}
