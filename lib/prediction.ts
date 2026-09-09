import { colleges, type Category, type College } from "./colleges";

export type Profile = { mode: "rank" | "score"; value: number; category: Category; state: string };
export type Match = College & { chance: "High" | "Medium" | "Low"; adjustedClosingRank: number };

export function validateValue(mode: Profile["mode"], value: number) {
  const max = mode === "score" ? 720 : 3000000;
  const min = mode === "score" ? 0 : 1;
  return Number.isFinite(value) && Number.isInteger(value) && value >= min && value <= max;
}

// Deliberately synthetic: this is not a calibrated score-to-rank conversion.
export function getDemoRank(profile: Profile) {
  if (!validateValue(profile.mode, profile.value)) throw new Error("Invalid score or rank");
  return profile.mode === "rank" ? profile.value : Math.max(1, Math.round(1 + 2500000 * ((720 - profile.value) / 720) ** 3));
}

export function predict(profile: Profile): Match[] {
  const rank = getDemoRank(profile);
  const multipliers: Record<Category, number> = { General: 1, OBC: 1.2, SC: 1.8, ST: 2.2, EWS: 1.15 };
  return colleges.map((college) => {
    const adjustedClosingRank = Math.round(college.closingRank * multipliers[profile.category] * (college.state === profile.state ? 1.15 : 1));
    const chance = rank <= adjustedClosingRank * .8 ? "High" : rank <= adjustedClosingRank * 1.15 ? "Medium" : "Low";
    return { ...college, adjustedClosingRank, chance };
  });
}

export function filterMatches(matches: Match[], type: string, maxFees: number) {
  return matches.filter((college) => (type === "All" || college.type === type) && college.fees <= maxFees);
}
