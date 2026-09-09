import test from "node:test";
import assert from "node:assert/strict";
import { cutoffRecords, estimateRank, findMatchingCutoffs, validateScore } from "../lib/cutoffs";

test("contains the aggregated Round 1 cutoff records", () => {
  assert.equal(cutoffRecords.length, 729);
  assert.ok(cutoffRecords.every((record) => record.round === 1));
  assert.ok(cutoffRecords.every((record) => record.openingRank > 0 && record.closingRank >= record.openingRank));
});

test("validates scores and estimates a conservative AIR band", () => {
  for (const value of [-1, 721, 1.5, NaN, Infinity]) assert.equal(validateScore(value), false);
  assert.equal(validateScore(0), true);
  assert.equal(validateScore(720), true);
  assert.equal(estimateRank(720), 10);
  assert.equal(estimateRank(650), 100);
  assert.equal(estimateRank(424), 200000);
});

test("sorts matching cutoffs by home state, preference and rank fit", () => {
  const matches = findMatchingCutoffs(30000, "Haryana", "Government", 1, "General", false, "Male");
  assert.ok(matches.length > 0);
  assert.ok(matches.every((record) => record.round === 1 && record.category === "General" && !record.pwbd && record.closingRank >= 30000));
  assert.equal(matches[0].state, "Haryana");
  assert.equal(matches[0].kind, "Government");
  assert.equal(findMatchingCutoffs(3000000, "Delhi", "All", 1, "General", false, "Male").length, 0);
});
