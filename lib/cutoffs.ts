import round1Data from "../data/round1-cutoffs.json";

export type Course = "BAMS" | "BHMS" | "BSMS" | "BUMS" | "B.Pharm";
export type CollegeKind = "Government" | "Central" | "Aided" | "Deemed" | "Private";
export type CollegePreference = "All" | CollegeKind;
export type Category = "General" | "OBC" | "EWS" | "SC" | "ST";

export type CutoffRecord = {
  id: string;
  name: string;
  course: Course;
  openingRank: number;
  closingRank: number;
  period: string;
  round: number;
  category: Category;
  pwbd: boolean;
  seatCategories: string[];
  quota: string;
  state: string;
  kind: CollegeKind;
  femaleOnly: boolean;
};

export const cutoffRecords = round1Data as CutoffRecord[];

const scoreRankBands = [
  [672, 10], [650, 100], [630, 500], [616, 1000], [571, 5000], [542, 10000],
  [528, 20000], [515, 30000], [496, 50000], [465, 100000], [424, 200000], [0, 3000000],
] as const;

export function validateScore(value: number) {
  return Number.isFinite(value) && Number.isInteger(value) && value >= 0 && value <= 720;
}

export function estimateRank(score: number) {
  if (!validateScore(score)) throw new RangeError("NEET score must be a whole number from 0 to 720.");
  return scoreRankBands.find(([minimum]) => score >= minimum)![1];
}

export function findMatchingCutoffs(rank: number, state: string, preference: CollegePreference, round: number, category: Category, pwbd: boolean, gender: string) {
  return cutoffRecords
    .filter((record) => record.round === round && record.category === category && record.pwbd === pwbd && record.closingRank >= rank && !(record.femaleOnly && gender !== "Female"))
    .sort((a, b) =>
      Number(b.state === state) - Number(a.state === state)
      || (preference === "All" ? 0 : Number(b.kind === preference) - Number(a.kind === preference))
      || Math.abs(a.closingRank - rank) - Math.abs(b.closingRank - rank)
      || a.name.localeCompare(b.name));
}

export const formatRank = (rank: number) => new Intl.NumberFormat("en-IN").format(rank);
