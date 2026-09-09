import round1Data from "../data/round1-cutoffs.json";
import round3Data from "../data/round3-cutoffs.json";

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

export const cutoffRecords = [...round1Data, ...round3Data] as CutoffRecord[];

export function validateRank(value: number) {
  return Number.isFinite(value) && Number.isInteger(value) && value >= 1 && value <= 3000000;
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
