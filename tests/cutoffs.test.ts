import test from "node:test";
import assert from "node:assert/strict";
import fs from "fs";
import {
  cutoffRecords,
  findMatchingCutoffs,
  validateRank,
  extractState,
  normalizeQuota,
  normalizeCourse,
  normalizeCategory,
  getReachThreshold,
  isWithinReach,
  classifyMatch,
  getRoundTrends,
} from "../lib/cutoffs";

test("contains the aggregated Round 1, Round 3, and SVR-I cutoff records", () => {
  assert.equal(cutoffRecords.length, 1487);
  assert.equal(cutoffRecords.filter((record) => record.round === 1).length, 729);
  assert.equal(cutoffRecords.filter((record) => record.round === 3).length, 509);
  assert.equal(cutoffRecords.filter((record) => record.round === "SVR1").length, 249);
  assert.ok(
    cutoffRecords.every(
      (record) => record.openingRank > 0 && record.closingRank >= record.openingRank
    )
  );
});

test("validates All India Ranks", () => {
  for (const value of [0, -1, 3000001, 1.5, NaN, Infinity]) {
    assert.equal(validateRank(value), false);
  }
  assert.equal(validateRank(1), true);
  assert.equal(validateRank(3000000), true);
});

test("Round 1 still works and sorts matching cutoffs by home state, preference and rank fit", () => {
  const matches = findMatchingCutoffs(
    30000,
    "Haryana",
    "Government",
    1,
    "General",
    false,
    "Male",
    { includeReach: false }
  );
  assert.ok(matches.length > 0);
  assert.ok(
    matches.every(
      (record) =>
        (record.round === 1 || record.round === "R1") &&
        record.category === "General" &&
        !record.pwbd &&
        record.closingRank >= 30000
    )
  );
  assert.equal(matches[0].state, "Haryana");
  assert.equal(matches[0].kind, "Government");
  assert.equal(
    findMatchingCutoffs(3000000, "Delhi", "All", 1, "General", false, "Male", {
      includeReach: false,
    }).length,
    0
  );
});

test("selects Round 3 independently", () => {
  const matches = findMatchingCutoffs(
    30000,
    "Goa",
    "Central",
    3,
    "General",
    false,
    "Male",
    { includeReach: false }
  );
  assert.ok(matches.length > 0);
  assert.ok(matches.every((record) => record.round === 3 || record.round === "R3"));
  assert.equal(matches[0].state, "Goa");
});

test("SVR-I works and SVR-I data is loaded", () => {
  const svrRecords = cutoffRecords.filter((r) => r.round === "SVR1");
  assert.equal(svrRecords.length, 249);
  assert.ok(svrRecords.every((r) => r.period === "2025 SVR-I"));
  assert.ok(svrRecords.every((r) => r.openingRank > 0 && r.closingRank >= r.openingRank));
});

type RawAllotmentItem = {
  sno: number;
  rank: number;
  rawInstitute: string;
  canonicalName: string;
  course: string;
  normalizedQuota: string;
  candidateCategory: string;
  allottedCategory: string;
  state: string;
};

test("SVR-I raw allotment data integrity matches official PDF", () => {
  const rawPath = "data/svr1-allotments.json";
  assert.ok(fs.existsSync(rawPath), "data/svr1-allotments.json must exist");
  const rawAllotments = JSON.parse(fs.readFileSync(rawPath, "utf-8")) as RawAllotmentItem[];

  // Exactly 417 allotments
  assert.equal(rawAllotments.length, 417);

  // Serial numbers 1 to 417 present with no duplicates
  const snos = new Set(rawAllotments.map((r) => r.sno));
  assert.equal(snos.size, 417);
  for (let i = 1; i <= 417; i++) {
    assert.ok(snos.has(i), `SNo ${i} must be present`);
  }

  // Ranks positive integers
  assert.ok(rawAllotments.every((r) => Number.isInteger(r.rank) && r.rank > 0));

  // First AIR = 26664, Last AIR = 1313005
  assert.equal(rawAllotments[0].rank, 26664);
  assert.equal(rawAllotments[416].rank, 1313005);

  // Every row has institute, course, quota, candidate category, allotted category
  for (const r of rawAllotments) {
    assert.ok(r.canonicalName && r.canonicalName.length > 0);
    assert.ok(r.course && ["BAMS", "BHMS", "BUMS", "BSMS", "B.Pharm"].includes(r.course));
    assert.ok(r.normalizedQuota && r.normalizedQuota.length > 0);
    assert.ok(r.candidateCategory && ["General", "OBC", "EWS", "SC", "ST"].includes(r.candidateCategory));
    assert.ok(r.allottedCategory && r.allottedCategory.length > 0);
    assert.ok(r.state && r.state.length > 0);
  }
});

test("All India Institute of Ayurveda, North Goa ground truth verification in SVR-I", () => {
  const rawAllotments = JSON.parse(fs.readFileSync("data/svr1-allotments.json", "utf-8")) as RawAllotmentItem[];
  const goaRaw = rawAllotments.filter((r) => r.rawInstitute.includes("North Goa"));

  // Verify the official 5 allotments
  assert.equal(goaRaw.length, 5);

  // AIR 33,972 Open seat OBC candidate
  const r33972 = goaRaw.find((r) => r.rank === 33972);
  assert.ok(r33972);
  assert.equal(r33972.allottedCategory, "Open");
  assert.equal(r33972.candidateCategory, "OBC");

  // AIR 37,467 Open seat EWS candidate
  const r37467 = goaRaw.find((r) => r.rank === 37467);
  assert.ok(r37467);
  assert.equal(r37467.allottedCategory, "Open");
  assert.equal(r37467.candidateCategory, "EWS");

  // AIR 38,583 Open seat General candidate
  const r38583 = goaRaw.find((r) => r.rank === 38583);
  assert.ok(r38583);
  assert.equal(r38583.allottedCategory, "Open");
  assert.equal(r38583.candidateCategory, "General");

  // AIR 38,718 OBC seat OBC candidate
  const r38718 = goaRaw.find((r) => r.rank === 38718);
  assert.ok(r38718);
  assert.equal(r38718.allottedCategory, "OBC");
  assert.equal(r38718.candidateCategory, "OBC");

  // AIR 38,741 OBC seat OBC candidate
  const r38741 = goaRaw.find((r) => r.rank === 38741);
  assert.ok(r38741);
  assert.equal(r38741.allottedCategory, "OBC");
  assert.equal(r38741.candidateCategory, "OBC");

  // Verify cutoffs generated for North Goa in SVR-1
  const goaCutoffs = cutoffRecords.filter(
    (r) => r.round === "SVR1" && r.name.includes("North Goa")
  );
  assert.equal(goaCutoffs.length, 4);

  const obcOpenCutoff = goaCutoffs.find((c) => c.category === "OBC" && c.allottedCategory === "Open");
  assert.ok(obcOpenCutoff);
  assert.equal(obcOpenCutoff.openingRank, 33972);
  assert.equal(obcOpenCutoff.closingRank, 33972);

  const ewsOpenCutoff = goaCutoffs.find((c) => c.category === "EWS" && c.allottedCategory === "Open");
  assert.ok(ewsOpenCutoff);
  assert.equal(ewsOpenCutoff.openingRank, 37467);
  assert.equal(ewsOpenCutoff.closingRank, 37467);

  const genOpenCutoff = goaCutoffs.find((c) => c.category === "General" && c.allottedCategory === "Open");
  assert.ok(genOpenCutoff);
  assert.equal(genOpenCutoff.openingRank, 38583);
  assert.equal(genOpenCutoff.closingRank, 38583);

  const obcReservedCutoff = goaCutoffs.find((c) => c.category === "OBC" && c.allottedCategory === "OBC");
  assert.ok(obcReservedCutoff);
  assert.equal(obcReservedCutoff.openingRank, 38718);
  assert.equal(obcReservedCutoff.closingRank, 38741);
  assert.equal(obcReservedCutoff.allotmentCount, 2);
});

test("quota normalization and college kind mapping", () => {
  const central = normalizeQuota("Central Universites / National Institutions");
  assert.equal(central.normalizedQuota, "Central Universities / National Institutions");
  assert.equal(central.kind, "Central");

  const govt = normalizeQuota("All India Quota Government");
  assert.equal(govt.kind, "Government");

  const aided = normalizeQuota("All India Quota Govt Aided");
  assert.equal(aided.kind, "Aided");

  const mmAided = normalizeQuota("Muslim Minority Quota(Govt Aided)");
  assert.equal(mmAided.kind, "Aided");

  const privateKind = normalizeQuota("Self Finance");
  assert.equal(privateKind.kind, "Private");

  const deemed = normalizeQuota("Management/Paid Seats Quota");
  assert.equal(deemed.kind, "Deemed");
});

test("course and category normalization", () => {
  assert.equal(normalizeCourse("Bachelor of Ayurvedic Medicine and Surgery"), "BAMS");
  assert.equal(normalizeCourse("Bachelor of Homoeopathic Medicine and Surgery"), "BHMS");
  assert.equal(normalizeCourse("Bachelor of Unani Medicine and Surgery"), "BUMS");
  assert.equal(normalizeCourse("Bachelor of Siddha Medicine and Surgery"), "BSMS");
  assert.equal(normalizeCourse("B.Pharm"), "B.Pharm");

  assert.equal(normalizeCategory("General"), "General");
  assert.equal(normalizeCategory("OBC-NCL"), "OBC");
  assert.equal(normalizeCategory("EWS"), "EWS");
  assert.equal(normalizeCategory("SC"), "SC");
  assert.equal(normalizeCategory("ST"), "ST");
});

test("state extraction from institute addresses", () => {
  assert.equal(
    extractState("All India Institute of Ayurveda, North Goa, Goa-403513,Dhargal Village"),
    "Goa"
  );
  assert.equal(
    extractState("National Institute of Ayurveda, Jaipur, Rajasthan, 302002"),
    "Rajasthan"
  );
  assert.equal(
    extractState("Government Homeopathic medical college & hospital, Main Bazar Kathua-184152"),
    "Jammu and Kashmir"
  );
  assert.equal(
    extractState("Ch. Brahm Prakash Ayurved Charak Sansthan, Najafgarh, New Delhi, 110073"),
    "Delhi"
  );
});

test("college type filtering and prioritization", () => {
  // Prioritize Central
  const centralMatches = findMatchingCutoffs(35000, "Goa", "Central", 1, "General", false, "Male", {
    includeReach: false,
  });
  assert.ok(centralMatches.length > 0);
  assert.equal(centralMatches[0].kind, "Central");

  // Strict kind filter
  const strictGovt = findMatchingCutoffs(35000, "Gujarat", "All", 1, "General", false, "Male", {
    kindFilter: "Government",
    includeReach: false,
  });
  assert.ok(strictGovt.every((r) => r.kind === "Government"));
});

test("search normalization, case-insensitivity, and alias matching", () => {
  // AIIA Goa
  const aiia = findMatchingCutoffs(40000, "Goa", "All", "ALL", "General", false, "Male", {
    searchQuery: "AIIA Goa",
  });
  assert.ok(aiia.length > 0);
  assert.ok(aiia[0].name.includes("North Goa"));

  // Case-insensitive & partial name
  const northGoa = findMatchingCutoffs(40000, "Goa", "All", "ALL", "General", false, "Male", {
    searchQuery: "all india ayurveda goa",
  });
  assert.ok(northGoa.length > 0);
  assert.ok(northGoa[0].name.includes("North Goa"));

  // DY Patil Pune
  const dyPatil = findMatchingCutoffs(300000, "Maharashtra", "All", "ALL", "General", false, "Male", {
    searchQuery: "dy patil pune",
  });
  assert.ok(dyPatil.length > 0);
  assert.ok(dyPatil[0].name.includes("D. Y. Patil"));
});

test("spelling equivalence in search (Homoeopathy vs Homeopathy, Govt vs Government)", () => {
  const res1 = findMatchingCutoffs(100000, "Madhya Pradesh", "All", 1, "General", false, "Male", {
    searchQuery: "homeopathy bhopal",
  });
  const res2 = findMatchingCutoffs(100000, "Madhya Pradesh", "All", 1, "General", false, "Male", {
    searchQuery: "homoeopathy bhopal",
  });
  assert.ok(res1.length > 0);
  assert.equal(res1.length, res2.length);
  assert.equal(res1[0].name, res2[0].name);

  const resGovt1 = findMatchingCutoffs(50000, "Rajasthan", "All", 1, "General", false, "Male", {
    searchQuery: "govt ayurved jaipur",
  });
  const resGovt2 = findMatchingCutoffs(50000, "Rajasthan", "All", 1, "General", false, "Male", {
    searchQuery: "government ayurved jaipur",
  });
  assert.ok(resGovt1.length > 0);
  assert.equal(resGovt1[0].name, resGovt2[0].name);
});

test("near-cutoff Reach behavior and scaling threshold", () => {
  // Example: closing rank 47,000, user rank 50,000 (miss = 3,000 ranks)
  assert.ok(isWithinReach(50000, 47000));
  const classification = classifyMatch(50000, 40000, 47000, "Round 1");
  assert.equal(classification.status, "REACH");
  assert.equal(classification.rankGap, -3000);
  assert.ok(classification.explanation.includes("3,000 ranks beyond"));

  // Impossible far-away result: user rank 500,000 vs closing 47,000
  assert.equal(isWithinReach(500000, 47000), false);

  // Scaling threshold check
  assert.equal(getReachThreshold(30000), 3600);
  assert.equal(getReachThreshold(100000), 12000);
  assert.equal(getReachThreshold(1000000), 100000);
});

test("round trend aggregation across R1, R3, and SVR-I", () => {
  const goaRecord = cutoffRecords.find(
    (r) => r.round === "SVR1" && r.name.includes("North Goa") && r.category === "General"
  )!;
  const trends = getRoundTrends(goaRecord);
  assert.ok(trends.R1 !== undefined, "R1 should be defined for North Goa General");
  assert.ok(trends.R3 !== undefined, "R3 should be defined for North Goa General");
  assert.ok(trends.SVR1 !== undefined, "SVR-I should be defined for North Goa General");

  assert.equal(trends.R1, 42946);
  assert.equal(trends.R3, 40070);
  assert.equal(trends.SVR1, 38583);
});

test("duplicate suppression in Best Available Across Rounds mode (ALL)", () => {
  const allMatches = findMatchingCutoffs(38000, "Goa", "Central", "ALL", "General", false, "Male", {
    searchQuery: "AIIA Goa",
  });
  // There should only be 1 card for North Goa BAMS Central General Open seat
  const goaMatches = allMatches.filter((m) => m.name.includes("North Goa") && m.course === "BAMS");
  assert.equal(goaMatches.length, 1);
  // It should show round trends
  assert.ok(goaMatches[0].roundTrends.R1);
  assert.ok(goaMatches[0].roundTrends.SVR1);
});
