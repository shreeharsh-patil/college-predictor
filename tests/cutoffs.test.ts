import test from "node:test";
import assert from "node:assert/strict";
import { cutoffRecords, findMatchingCutoffs, validateRank } from "../lib/cutoffs";

test("contains the aggregated Round 1 and Round 3 cutoff records", () => {
  assert.equal(cutoffRecords.length, 1238);
  assert.equal(cutoffRecords.filter((record) => record.round === 1).length, 729);
  assert.equal(cutoffRecords.filter((record) => record.round === 3).length, 509);
  assert.ok(cutoffRecords.every((record) => record.openingRank > 0 && record.closingRank >= record.openingRank));
});

test("validates All India Ranks", () => {
  for (const value of [0, -1, 3000001, 1.5, NaN, Infinity]) assert.equal(validateRank(value), false);
  assert.equal(validateRank(1), true);
  assert.equal(validateRank(3000000), true);
});

test("sorts matching cutoffs by home state, preference and rank fit", () => {
  const matches = findMatchingCutoffs(30000, "Haryana", "Government", 1, "General", false, "Male");
  assert.ok(matches.length > 0);
  assert.ok(matches.every((record) => record.round === 1 && record.category === "General" && !record.pwbd && record.closingRank >= 30000));
  assert.equal(matches[0].state, "Haryana");
  assert.equal(matches[0].kind, "Government");
  assert.equal(findMatchingCutoffs(3000000, "Delhi", "All", 1, "General", false, "Male").length, 0);
});

test("selects Round 3 independently", () => {
  const matches = findMatchingCutoffs(30000, "Goa", "Central", 3, "General", false, "Male");
  assert.ok(matches.length > 0);
  assert.ok(matches.every((record) => record.round === 3));
  assert.equal(matches[0].state, "Goa");
});
