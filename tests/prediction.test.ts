import test from "node:test";
import assert from "node:assert/strict";
import { filterMatches, getDemoRank, predict, validateValue, type Profile } from "../lib/prediction";
const profile: Profile = { mode: "rank", value: 12000, category: "General", state: "Gujarat" };

test("rejects invalid scores and ranks, accepts endpoints", () => {
  for (const value of [-1, 721, NaN, Infinity, 10.5]) assert.equal(validateValue("score", value), false);
  for (const value of [0, -1, 3000001, 1.5]) assert.equal(validateValue("rank", value), false);
  assert.equal(validateValue("score", 0), true);
  assert.equal(validateValue("score", 720), true);
  assert.equal(validateValue("rank", 1), true);
});
test("better scores yield better synthetic ranks with finite endpoints", () => {
  assert.equal(getDemoRank({ ...profile, mode: "score", value: 720 }), 1);
  assert.equal(getDemoRank({ ...profile, mode: "score", value: 0 }), 2500001);
  assert.ok(getDemoRank({ ...profile, mode: "score", value: 650 }) < getDemoRank({ ...profile, mode: "score", value: 600 }));
});
test("chance boundaries include high, medium and low correctly", () => {
  assert.equal(predict({ ...profile, state: "Delhi", value: 1104 })[0].chance, "High");
  assert.equal(predict({ ...profile, state: "Delhi", value: 1105 })[0].chance, "Medium");
  assert.equal(predict({ ...profile, state: "Delhi", value: 1588 })[0].chance, "Low");
});
test("category and domicile update sample thresholds", () => {
  assert.equal(predict({ ...profile, state: "Rajasthan" })[2].adjustedClosingRank, 12000);
  assert.equal(predict(profile)[2].adjustedClosingRank, 13800);
  assert.equal(predict({ ...profile, category: "SC" })[2].adjustedClosingRank, 24840);
});
test("ownership and budget filters compose including empty results", () => {
  const matches = predict(profile);
  assert.equal(filterMatches(matches, "All", 2000000).length, 6);
  assert.equal(filterMatches(matches, "Private", 400000).length, 1);
  assert.equal(filterMatches(matches, "Government", 85000).length, 4);
  assert.equal(filterMatches(matches, "All", 0).length, 0);
});
