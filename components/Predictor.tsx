"use client";

import { useMemo, useRef, useState, type FormEvent } from "react";
import { m } from "framer-motion";
import {
  AlertTriangle,
  ArrowRight,
  Building2,
  Check,
  GraduationCap,
  Info,
  RotateCcw,
  Search,
  SlidersHorizontal,
  Sparkles,
  TrendingUp,
  X,
} from "lucide-react";
import {
  cutoffRecords,
  findMatchingCutoffs,
  formatRank,
  formatRound,
  normalizeInstituteName,
  STATES,
  validateRank,
  type Category,
  type CollegePreference,
  type MatchStatus,
  type RoundSelection,
} from "@/lib/cutoffs";

const preferences: { value: CollegePreference; label: string }[] = [
  { value: "All", label: "All Types (Government First)" },
  ...["Government", "Central", "Aided", "Deemed", "Private"].map((value) => ({
    value: value as CollegePreference,
    label: value,
  })),
];

const roundOptions: { value: RoundSelection; label: string }[] = [
  { value: "R1", label: "Round 1" },
  { value: "R2", label: "Round 2" },
  { value: "R3", label: "Round 3" },
  { value: "SVR1", label: "Stray Vacancy Round I (SVR-I)" },
  { value: "SVR2", label: "Stray Vacancy Round II (SVR-II)" },
];

type SubmittedProfile = {
  rank: number;
  round: RoundSelection;
  category: Category;
  pwbd: string;
  domicile: string;
  gender: string;
  preference: CollegePreference;
};

export function Predictor() {
  const [rank, setRank] = useState("");
  const [round, setRound] = useState<RoundSelection>("R1");
  const [category, setCategory] = useState("");
  const [pwbd, setPwbd] = useState("");
  const [domicile, setDomicile] = useState("");
  const [gender, setGender] = useState("");
  const [preference, setPreference] = useState<CollegePreference>("All");
  const [submitted, setSubmitted] = useState<SubmittedProfile | null>(null);
  const [error, setError] = useState("");

  // Result filters
  const [searchQuery, setSearchQuery] = useState("");
  const [activeRound, setActiveRound] = useState<RoundSelection>("R1");
  const [courseFilter, setCourseFilter] = useState("All");
  const [kindFilter, setKindFilter] = useState<CollegePreference>("All");
  const [matchStatusFilter, setMatchStatusFilter] = useState<
    MatchStatus | "All"
  >("All");
  const [stateFilter, setStateFilter] = useState("All");
  const [quotaFilter, setQuotaFilter] = useState("All");

  const resultsRef = useRef<HTMLElement>(null);

  // Dynamic filter choices from dataset
  const availableCourses = useMemo(() => {
    return Array.from(new Set(cutoffRecords.map((r) => r.course))).sort();
  }, []);

  const availableQuotas = useMemo(() => {
    return Array.from(new Set(cutoffRecords.map((r) => r.quota))).sort();
  }, []);

  // Compute matches
  const matches = useMemo(() => {
    if (!submitted) return [];
    return findMatchingCutoffs(
      submitted.rank,
      submitted.domicile,
      submitted.preference,
      activeRound,
      submitted.category,
      submitted.pwbd === "Yes",
      submitted.gender,
      {
        searchQuery,
        courseFilter,
        kindFilter,
        matchStatusFilter,
        stateFilter,
        quotaFilter,
        includeReach: true,
      },
    );
  }, [
    submitted,
    activeRound,
    searchQuery,
    courseFilter,
    kindFilter,
    matchStatusFilter,
    stateFilter,
    quotaFilter,
  ]);

  const hasActiveFilters =
    searchQuery.trim() !== "" ||
    activeRound !== (submitted?.round ?? "R1") ||
    courseFilter !== "All" ||
    kindFilter !== "All" ||
    matchStatusFilter !== "All" ||
    stateFilter !== "All" ||
    quotaFilter !== "All";

  const changed =
    submitted &&
    (submitted.rank !== Number(rank) ||
      submitted.round !== round ||
      submitted.category !== category ||
      submitted.pwbd !== pwbd ||
      submitted.domicile !== domicile ||
      submitted.gender !== gender ||
      submitted.preference !== preference);

  function submit(event: FormEvent) {
    event.preventDefault();
    const numericRank = Number(rank);
    if (rank.trim() === "" || !validateRank(numericRank)) {
      return setError("Enter a whole-number AIR from 1 to 30,00,000.");
    }
    if (!category || !pwbd || !domicile || !gender) {
      return setError("Complete all required profile fields.");
    }
    setError("");
    setSubmitted({
      rank: numericRank,
      round,
      category: category as Category,
      pwbd,
      domicile,
      gender,
      preference,
    });
    setActiveRound(round);

    requestAnimationFrame(() => {
      resultsRef.current?.focus({ preventScroll: true });
      resultsRef.current?.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "instant"
          : "smooth",
        block: "start",
      });
    });
  }

  function resetAll() {
    setRank("");
    setRound("R1");
    setCategory("");
    setPwbd("");
    setDomicile("");
    setGender("");
    setPreference("All");
    setSubmitted(null);
    setError("");
    clearFilters();
  }

  function clearFilters() {
    setSearchQuery("");
    if (submitted) setActiveRound(submitted.round);
    setCourseFilter("All");
    setKindFilter("All");
    setMatchStatusFilter("All");
    setStateFilter("All");
    setQuotaFilter("All");
  }

  return (
    <div className="grid gap-7 items-start lg:grid-cols-[360px_1fr]">
      <aside className="space-y-5 lg:sticky lg:top-24">
        <form onSubmit={submit} className="p-6 rounded-2xl shadow-sm glass">
          <div className="mb-6 gap-3 flex items-center">
            <span className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600">
              <SlidersHorizontal size={22} />
            </span>
            <div>
              <h2 className="text-base font-semibold">Your NEET profile</h2>
              <p className="mt-1 text-xs text-slate-500">
                AIR is the primary matching input.
              </p>
            </div>
          </div>

          <label
            htmlFor="air-rank"
            className="mb-2 text-xs font-semibold block"
          >
            All India Rank (AIR) *
          </label>
          <input
            id="air-rank"
            type="number"
            inputMode="numeric"
            min={1}
            max={3000000}
            step={1}
            required
            value={rank}
            onChange={(event) => setRank(event.target.value)}
            placeholder="e.g. 38500"
            className="field"
          />

          <label
            htmlFor="round"
            className="mt-4 mb-2 text-xs font-semibold block"
          >
            Counselling Round *
          </label>
          <select
            id="round"
            value={round}
            onChange={(event) => setRound(event.target.value as RoundSelection)}
            className="field"
          >
            {roundOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          <div className="grid grid-cols-2 mt-4 gap-3">
            <Field
              label="Category *"
              id="category"
              value={category}
              onChange={setCategory}
              options={["General", "OBC", "EWS", "SC", "ST"]}
              placeholder="Select category"
            />
            <Field
              label="PwBD Status *"
              id="pwbd"
              value={pwbd}
              onChange={setPwbd}
              options={["No", "Yes"]}
              placeholder="Select status"
            />
            <Field
              label="Domicile State *"
              id="domicile"
              value={domicile}
              onChange={setDomicile}
              options={STATES}
              placeholder="Select state"
            />
            <Field
              label="Gender *"
              id="gender"
              value={gender}
              onChange={setGender}
              options={["Female", "Male", "Other"]}
              placeholder="Select gender"
            />
          </div>

          <label
            htmlFor="preference"
            className="mt-4 mb-2 text-xs font-semibold block"
          >
            Prioritize College Type
          </label>
          <select
            id="preference"
            value={preference}
            onChange={(event) =>
              setPreference(event.target.value as CollegePreference)
            }
            className="field"
          >
            {preferences.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>

          {error && (
            <p role="alert" className="mt-3 text-xs font-medium text-red-700">
              {error}
            </p>
          )}

          <m.button
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="mt-6 w-full primary-button"
          >
            Compare With Cutoffs
            <ArrowRight size={17} />
          </m.button>
          <p className="mt-3 gap-1.5 justify-center text-[10px] text-slate-500 flex items-center">
            <Check size={12} className="text-teal-600" />
            No account needed. No details uploaded.
          </p>
        </form>

        <div className="gap-2.5 p-4 rounded-xl border border-indigo-100 bg-indigo-50/60 flex">
          <Info size={16} className="mt-0.5 text-indigo-500 shrink-0" />
          <p className="text-xs text-slate-600 leading-6">
            Results match your candidate category, PwBD status and selected
            round cutoffs. Domicile and college prioritization adjust order;
            gender applies only to seats explicitly designated female-only.
          </p>
        </div>
      </aside>

      <section
        ref={resultsRef}
        tabIndex={-1}
        aria-labelledby="results-heading"
        className="min-w-0 scroll-mt-24 focus:outline-none"
      >
        {!submitted ? (
          <div className="flex-col p-7 min-h-140 justify-center rounded-2xl text-center shadow-sm glass flex items-center">
            <div className="mb-8 justify-center rounded-full border border-indigo-100 bg-indigo-50 relative flex size-28 items-center">
              <GraduationCap
                size={54}
                strokeWidth={1.2}
                className="text-indigo-500"
              />
              <span className="p-2 bottom-1 rounded-xl border-4 border-white bg-teal-100 text-teal-700 absolute -right-1">
                <Sparkles size={18} />
              </span>
            </div>
            <span className="mb-3 text-xs font-semibold text-teal-700 tracking-wider uppercase">
              AACCC 2025 OFFICIAL ALLOTMENTS
            </span>
            <h2
              id="results-heading"
              className="text-2xl font-semibold text-slate-900 tracking-tight"
            >
              See how your profile compares.
            </h2>
            <p className="mt-4 max-w-md text-sm text-slate-500 leading-7">
              Compare your NEET AIR across official 2025 counselling rounds with{" "}
              {cutoffRecords.length}
              opening and closing rank records.
            </p>
          </div>
        ) : (
          <>
            {/* Header section */}
            <div className="mb-5">
              <div className="flex-wrap gap-2 justify-between flex items-center">
                <h2
                  id="results-heading"
                  className="text-2xl font-semibold text-slate-900 tracking-tight"
                >
                  {activeRound === "ALL"
                    ? "Best cutoff matches"
                    : `${formatRound(activeRound)} cutoffs`}{" "}
                  near AIR {formatRank(submitted.rank)}
                </h2>
                <span className="px-3 py-1 rounded-full border border-teal-200 bg-teal-50 text-[11px] font-semibold text-teal-800">
                  {activeRound === "ALL"
                    ? "ALL 2025 ROUNDS"
                    : `2025 ${formatRound(activeRound).toUpperCase()}`}
                </span>
              </div>
              <p className="mt-2 text-xs text-slate-500 leading-6">
                Home-state ({submitted.domicile}) and{" "}
                {submitted.preference === "All"
                  ? "all college types"
                  : submitted.preference.toLowerCase()}{" "}
                are prioritized. Historical status indicates rank compatibility.
              </p>
              <p className="mt-1 text-[11px] text-slate-500">
                Profile: {submitted.category} · PwBD {submitted.pwbd} ·{" "}
                {submitted.gender} · {submitted.domicile}
              </p>
              {changed && (
                <p
                  role="status"
                  className="mt-3 p-3 rounded-lg bg-amber-50 text-xs text-amber-800 border border-amber-200"
                >
                  Your inputs have changed. Select Compare With Cutoffs to
                  update these results.
                </p>
              )}
            </div>

            {/* Stray Vacancy Round Warning Banner */}
            {(activeRound === "SVR1" ||
              activeRound === "SVR2" ||
              submitted.round === "SVR1" ||
              submitted.round === "SVR2") && (
              <div className="mb-5 gap-3 p-4 rounded-xl border border-amber-200 bg-amber-50/80 text-xs text-amber-900 shadow-sm flex items-start leading-5">
                <AlertTriangle
                  size={17}
                  className="mt-0.5 text-amber-600 shrink-0"
                />
                <p>
                  Stray Vacancy Round cutoffs can be more volatile because they
                  depend on seats remaining vacant after earlier rounds. Use
                  these results as historical guidance, not a guaranteed cutoff.
                </p>
              </div>
            )}

            {/* Search Box */}
            <div className="mb-4">
              <div className="relative">
                <Search
                  size={16}
                  className="top-1/2 text-slate-400 absolute left-3.5 -translate-y-1/2"
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search college, course, state or quota..."
                  className="py-2.5 w-full rounded-xl border border-slate-200 bg-white text-xs text-slate-800 shadow-sm pr-10 pl-10 transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="p-1 top-1/2 rounded-full text-slate-400 absolute right-3 -translate-y-1/2 hover:bg-slate-100 hover:text-slate-600"
                    aria-label="Clear search"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>

            {/* Composable Filters Bar */}
            <div className="mb-5 p-3.5 rounded-xl border border-slate-200/80 bg-white shadow-sm">
              <div className="flex-wrap gap-2 text-xs flex items-center">
                {/* Round filter */}
                <select
                  value={activeRound}
                  onChange={(e) =>
                    setActiveRound(e.target.value as RoundSelection)
                  }
                  className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 font-medium text-slate-700 text-xs focus:outline-none focus:border-indigo-500"
                  aria-label="Filter by Round"
                >
                  <option value="R1">Round 1</option>
                  <option value="R2">Round 2</option>
                  <option value="R3">Round 3</option>
                  <option value="SVR1">SVR-I</option>
                  <option value="SVR2">SVR-II</option>
                </select>

                {/* Course filter */}
                <select
                  value={courseFilter}
                  onChange={(e) => setCourseFilter(e.target.value)}
                  className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 font-medium text-slate-700 text-xs focus:outline-none focus:border-indigo-500"
                  aria-label="Filter by Course"
                >
                  <option value="All">All Courses</option>
                  {availableCourses.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>

                {/* College type filter */}
                <select
                  value={kindFilter}
                  onChange={(e) =>
                    setKindFilter(e.target.value as CollegePreference)
                  }
                  className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 font-medium text-slate-700 text-xs focus:outline-none focus:border-indigo-500"
                  aria-label="Filter by College Type"
                >
                  <option value="All">All College Types</option>
                  <option value="Government">Government</option>
                  <option value="Central">Central</option>
                  <option value="Aided">Aided</option>
                  <option value="Deemed">Deemed</option>
                  <option value="Private">Private</option>
                </select>

                {/* Match Status filter */}
                <select
                  value={matchStatusFilter}
                  onChange={(e) =>
                    setMatchStatusFilter(e.target.value as MatchStatus | "All")
                  }
                  className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 font-medium text-slate-700 text-xs focus:outline-none focus:border-indigo-500"
                  aria-label="Filter by Match Status"
                >
                  <option value="All">All Match Levels</option>
                  <option value="SAFE">Safe</option>
                  <option value="GOOD CHANCE">Good Chance</option>
                  <option value="COMPETITIVE">Competitive</option>
                  <option value="REACH">Reach</option>
                </select>

                {/* State filter */}
                <select
                  value={stateFilter}
                  onChange={(e) => setStateFilter(e.target.value)}
                  className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 font-medium text-slate-700 text-xs focus:outline-none focus:border-indigo-500"
                  aria-label="Filter by State"
                >
                  <option value="All">All States</option>
                  {STATES.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>

                {/* Quota filter */}
                <select
                  value={quotaFilter}
                  onChange={(e) => setQuotaFilter(e.target.value)}
                  className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 font-medium text-slate-700 text-xs focus:outline-none focus:border-indigo-500"
                  aria-label="Filter by Quota"
                >
                  <option value="All">All Quotas</option>
                  {availableQuotas.map((q) => (
                    <option key={q} value={q}>
                      {q}
                    </option>
                  ))}
                </select>

                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 text-[11px] font-medium text-slate-600 ml-auto flex items-center hover:bg-slate-200 transition"
                  >
                    <X size={12} />
                    Clear filters
                  </button>
                )}
              </div>
            </div>

            {/* Results count & reset */}
            <div className="mb-4 gap-3 justify-between flex items-center">
              <p
                role="status"
                aria-live="polite"
                className="text-xs text-slate-500"
              >
                Showing {matches.length} matching{" "}
                {activeRound === "ALL" ? "all-round" : formatRound(activeRound)}{" "}
                records
              </p>
              <button
                type="button"
                onClick={resetAll}
                className="gap-1 text-[11px] font-medium text-indigo-600 flex items-center hover:text-indigo-800 transition"
              >
                <RotateCcw size={12} />
                Reset profile
              </button>
            </div>

            {/* Results List */}
            <div className="space-y-4">
              {matches.map((record) => {
                const roundBadgeText = `2025 ${formatRound(record.evaluatedRound)}`;

                const statusColor =
                  record.matchStatus === "SAFE"
                    ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                    : record.matchStatus === "GOOD CHANCE"
                      ? "border-teal-200 bg-teal-50 text-teal-800"
                      : record.matchStatus === "COMPETITIVE"
                        ? "border-amber-200 bg-amber-50 text-amber-900"
                        : "border-indigo-200 bg-indigo-50 text-indigo-800";

                const isReach = record.matchStatus === "REACH";
                const marginFormatted = formatRank(Math.abs(record.rankGap));

                return (
                  <article
                    key={`${record.id}-${record.evaluatedRound}`}
                    className="p-5 rounded-2xl border border-slate-200/80 bg-white shadow-[0_4px_20px_-12px_#33415520] transition sm:p-6"
                  >
                    {/* Top Row: College Name & Badges */}
                    <div className="flex-wrap gap-3 justify-between flex items-start">
                      <div className="flex-1 gap-3 min-w-0 flex items-start">
                        <div className="justify-center rounded-xl bg-teal-50 text-teal-600 hidden size-11 shrink-0 items-center sm:flex">
                          <Building2 size={22} strokeWidth={1.5} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex-wrap gap-2 mb-1 flex items-center">
                            <span className="px-2 py-0.5 rounded-md border border-slate-200 bg-slate-50 text-[10px] font-semibold text-slate-700">
                              {record.course}
                            </span>
                            <span className="px-2 py-0.5 rounded-md border border-slate-200 bg-slate-50 text-[10px] font-medium text-slate-600">
                              {record.kind}
                            </span>
                            <span className="px-2 py-0.5 rounded-md border border-slate-200 bg-slate-50 text-[10px] font-medium text-slate-600">
                              {record.state}
                            </span>
                            <span className="px-2 py-0.5 rounded-md border border-slate-200 bg-slate-100 text-[10px] font-medium text-slate-600">
                              {roundBadgeText}
                            </span>
                          </div>
                          <h3 className="text-[15px] font-semibold text-slate-900 leading-6">
                            {record.normalizedName ||
                              normalizeInstituteName(record.name)}
                          </h3>
                          <p className="mt-1 text-[11px] text-slate-500">
                            {record.quota}
                            {record.allotmentCount
                              ? ` · ${record.allotmentCount} ${formatRound(record.evaluatedRound)} allotment(s)`
                              : ""}
                          </p>
                        </div>
                      </div>

                      {/* Historical Match Badge */}
                      <div className="flex-col gap-1 flex items-end">
                        <span
                          className={`rounded-full border px-3 py-1 text-[11px] font-bold tracking-wide uppercase ${statusColor}`}
                        >
                          {record.matchStatus}
                        </span>
                        <span className="text-[11px] font-medium text-slate-500">
                          {isReach
                            ? `Margin: -${marginFormatted} ranks`
                            : `Margin: +${marginFormatted} ranks`}
                        </span>
                      </div>
                    </div>

                    {/* Ranks & Profile Grid */}
                    <div className="grid grid-cols-2 mt-5 gap-3 p-4 rounded-xl bg-slate-50 sm:grid-cols-4">
                      <div>
                        <p className="text-[10px] font-semibold text-slate-400 uppercase">
                          Opening Rank
                        </p>
                        <p className="mt-1 text-xs font-semibold text-slate-800">
                          {formatRank(record.openingRank)}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] font-semibold text-slate-400 uppercase">
                          Closing Rank
                        </p>
                        <p className="mt-1 text-xs font-semibold text-slate-800">
                          {formatRank(record.closingRank)}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] font-semibold text-slate-400 uppercase">
                          Your AIR
                        </p>
                        <p className="mt-1 text-xs font-semibold text-indigo-600">
                          {formatRank(submitted.rank)}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] font-semibold text-slate-400 uppercase">
                          Seat Category
                        </p>
                        <p className="mt-1 text-xs font-semibold text-slate-800">
                          {record.seatCategories?.join(", ") ||
                            record.allottedCategory ||
                            record.category}
                          {record.pwbd ? " PwBD" : ""}
                        </p>
                      </div>
                    </div>

                    {/* Historical Match Explanation */}
                    <p className="mt-3 text-xs text-slate-600 leading-5">
                      {record.matchExplanation}
                    </p>

                    {/* Multi-Round Trend Tracker */}
                    {record.roundTrends &&
                      (record.roundTrends.R1 ||
                        record.roundTrends.R2 ||
                        record.roundTrends.R3 ||
                        record.roundTrends.SVR1 ||
                        record.roundTrends.SVR2) && (
                        <div className="flex-wrap mt-4 gap-3 pt-3 border-t border-slate-100 text-[11px] flex items-center">
                          <span className="gap-1 font-medium text-slate-500 flex items-center">
                            <TrendingUp size={13} className="text-indigo-500" />
                            Multi-Round Closing Trends:
                          </span>
                          <div className="flex-wrap gap-2 flex items-center">
                            {(["R1", "R2", "R3", "SVR1", "SVR2"] as const).map(
                              (roundKey) => {
                                const trendRank = record.roundTrends[roundKey];
                                if (trendRank === undefined) return null;
                                const label = roundKey.startsWith("SVR")
                                  ? `SVR-${roundKey.at(-1)}`
                                  : roundKey;
                                return (
                                  <span
                                    key={roundKey}
                                    className={`rounded-md px-2 py-0.5 font-medium ${record.evaluatedRound === roundKey ? "bg-indigo-100 font-semibold text-indigo-800" : "bg-slate-100 text-slate-600"}`}
                                  >
                                    {label}: {formatRank(trendRank)}
                                  </span>
                                );
                              },
                            )}
                          </div>
                        </div>
                      )}
                  </article>
                );
              })}
            </div>

            {/* Empty State */}
            {matches.length === 0 && (
              <div className="p-10 rounded-2xl border border-dashed border-slate-300 text-center">
                <SlidersHorizontal className="mb-4 mx-auto text-slate-400" />
                <h3 className="font-semibold text-slate-800">
                  No matching cutoff rows found
                </h3>
                <p className="mt-2 text-sm text-slate-500">
                  Try adjusting your search query, selecting another round, or
                  resetting filters.
                </p>
                <div className="mt-5 gap-3 justify-center flex">
                  {hasActiveFilters && (
                    <button
                      type="button"
                      onClick={clearFilters}
                      className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                    >
                      Clear search & filters
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={resetAll}
                    className="text-xs font-semibold text-slate-600 hover:text-slate-800"
                  >
                    Reset comparison
                  </button>
                </div>
              </div>
            )}

            {/* Data Source & Attribution */}
            <details className="mt-6 p-4 rounded-xl border border-slate-200 bg-white text-xs text-slate-500 shadow-sm leading-6">
              <summary className="font-medium text-slate-700 cursor-pointer">
                About this cutoff data
              </summary>
              <p className="mt-2">
                Opening and closing ranks are compiled from the official 2025
                AACCC UG allotment documents across Round 1, Round 2, Round 3,
                Stray Vacancy Round I (SVR-I), and Stray Vacancy Round II
                (SVR-II). The imported Round 2 document contains 1,956
                allotments and the SVR-II document contains 122 allotments.
              </p>
              <p className="mt-2">
                Official SVR-I Reference:{" "}
                <a
                  href="https://cdnbbsr.s3waas.gov.in/s3653ac11ca60b3e021a8c609c7198acfc/uploads/2025/11/202511081701832043.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-indigo-600 hover:underline"
                >
                  Provisional AYUSH UG Allotment - 2025 SVR-I PDF
                </a>
              </p>
              <p className="mt-1 text-[11px] text-slate-400">
                Always verify final choices, quotas, and state reservation rules
                against official counselling brochures.
              </p>
            </details>
          </>
        )}
      </section>
    </div>
  );
}

function Field({
  label,
  id,
  value,
  onChange,
  options,
  placeholder,
}: {
  label: string;
  id: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 text-xs font-semibold block">
        {label}
      </label>
      <select
        id={id}
        required
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="field"
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}
