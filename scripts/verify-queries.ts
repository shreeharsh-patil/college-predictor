import { findMatchingCutoffs, formatRank } from "../lib/cutoffs";

console.log("--- SEARCH VERIFICATIONS ---");
const queries = ["AIIA Goa", "North Goa Ayurveda", "BAMS Goa", "Homeopathy Bhopal", "DY Patil Pune"];
for (const q of queries) {
  const res = findMatchingCutoffs(40000, "Delhi", "All", "ALL", "General", false, "Male", { searchQuery: q });
  console.log(`Query: "${q}" -> ${res.length} matches. Top: "${res[0]?.name}" (${res[0]?.course}, status: ${res[0]?.matchStatus}, round: ${res[0]?.evaluatedRound})`);
}

console.log("\n--- AIR PREDICTION VERIFICATIONS ---");
const ranks = [30000, 38000, 50000, 100000, 500000, 1000000, 1300000];
for (const r of ranks) {
  const res = findMatchingCutoffs(r, "Delhi", "Government", "ALL", "General", false, "Male");
  const safeCount = res.filter((x) => x.matchStatus === "SAFE").length;
  const goodCount = res.filter((x) => x.matchStatus === "GOOD CHANCE").length;
  const compCount = res.filter((x) => x.matchStatus === "COMPETITIVE").length;
  const reachCount = res.filter((x) => x.matchStatus === "REACH").length;
  console.log(
    `AIR ${formatRank(r)}: Total ${res.length} matches (Safe: ${safeCount}, Good: ${goodCount}, Comp: ${compCount}, Reach: ${reachCount}). Top: "${res[0]?.name}" (${res[0]?.course}, close: ${formatRank(res[0]?.closingRank)}, status: ${res[0]?.matchStatus})`
  );
}
