"use client";

import { useRef, useState, type FormEvent } from "react";
import { m } from "framer-motion";
import { ArrowRight, Building2, Check, GraduationCap, Info, RotateCcw, SlidersHorizontal, Sparkles } from "lucide-react";
import { cutoffRecords, estimateRank, findMatchingCutoffs, formatRank, validateScore, type Category, type CollegePreference } from "@/lib/cutoffs";

const states = ["Andaman and Nicobar Islands", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chandigarh", "Chhattisgarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jammu and Kashmir", "Jharkhand", "Karnataka", "Kerala", "Ladakh", "Lakshadweep", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Puducherry", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"];
const preferences: { value: CollegePreference; label: string }[] = [
  { value: "All", label: "Government + Aided + Central + Deemed" },
  ...["Government", "Central", "Aided", "Deemed", "Private"].map((value) => ({ value: value as CollegePreference, label: value })),
];
type SubmittedProfile = { score: number; rank: number; round: number; category: Category; pwbd: string; domicile: string; gender: string; preference: CollegePreference };

export function Predictor() {
  const [score, setScore] = useState("");
  const [round, setRound] = useState(1);
  const [category, setCategory] = useState("");
  const [pwbd, setPwbd] = useState("");
  const [domicile, setDomicile] = useState("");
  const [gender, setGender] = useState("");
  const [preference, setPreference] = useState<CollegePreference>("All");
  const [submitted, setSubmitted] = useState<SubmittedProfile | null>(null);
  const [error, setError] = useState("");
  const resultsRef = useRef<HTMLElement>(null);
  const matches = submitted ? findMatchingCutoffs(submitted.rank, submitted.domicile, submitted.preference, submitted.round, submitted.category, submitted.pwbd === "Yes", submitted.gender) : [];
  const changed = submitted && (submitted.score !== Number(score) || submitted.round !== round || submitted.category !== category || submitted.pwbd !== pwbd || submitted.domicile !== domicile || submitted.gender !== gender || submitted.preference !== preference);

  function submit(event: FormEvent) {
    event.preventDefault();
    const numericScore = Number(score);
    if (score.trim() === "" || !validateScore(numericScore)) return setError("Enter a whole-number NEET score from 0 to 720.");
    if (!category || !pwbd || !domicile || !gender) return setError("Complete all required profile fields.");
    setError("");
    setSubmitted({ score: numericScore, rank: estimateRank(numericScore), round, category: category as Category, pwbd, domicile, gender, preference });
    requestAnimationFrame(() => {
      resultsRef.current?.focus({ preventScroll: true });
      resultsRef.current?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth", block: "start" });
    });
  }

  function reset() {
    setScore(""); setRound(1); setCategory(""); setPwbd(""); setDomicile(""); setGender(""); setPreference("All"); setSubmitted(null); setError("");
  }

  return <div className="grid items-start gap-7 lg:grid-cols-[360px_1fr]">
    <aside className="space-y-5 lg:sticky lg:top-24">
      <form onSubmit={submit} className="glass rounded-2xl p-6">
        <div className="mb-6 flex items-center gap-3"><span className="rounded-xl bg-indigo-50 p-2.5 text-indigo-600"><SlidersHorizontal size={22} /></span><div><h2 className="text-base font-semibold">Your NEET profile</h2><p className="mt-1 text-xs text-slate-500">Score is the primary matching input.</p></div></div>
        <label htmlFor="neet-score" className="mb-2 block text-xs font-semibold">NEET Score *</label>
        <input id="neet-score" type="number" inputMode="numeric" min={0} max={720} step={1} required value={score} onChange={(event) => setScore(event.target.value)} placeholder="e.g. 487" className="field" />
        <label htmlFor="round" className="mt-4 mb-2 block text-xs font-semibold">Counselling Round *</label>
        <select id="round" value={round} onChange={(event) => setRound(Number(event.target.value))} className="field"><option value={1}>Round 1</option><option value={3} disabled>Round 3 - data coming next</option></select>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <Field label="Category *" id="category" value={category} onChange={setCategory} options={["General", "OBC", "EWS", "SC", "ST"]} placeholder="Select category" />
          <Field label="PwBD Status *" id="pwbd" value={pwbd} onChange={setPwbd} options={["No", "Yes"]} placeholder="Select status" />
          <Field label="Domicile State *" id="domicile" value={domicile} onChange={setDomicile} options={states} placeholder="Select state" />
          <Field label="Gender *" id="gender" value={gender} onChange={setGender} options={["Female", "Male", "Other"]} placeholder="Select gender" />
        </div>
        <label htmlFor="preference" className="mt-4 mb-2 block text-xs font-semibold">College Preference</label>
        <select id="preference" value={preference} onChange={(event) => setPreference(event.target.value as CollegePreference)} className="field">{preferences.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select>
        {error && <p role="alert" className="mt-3 text-xs text-red-700">{error}</p>}
        <m.button whileTap={{ scale: .98 }} type="submit" className="primary-button mt-6 w-full">Compare With Cutoffs<ArrowRight size={17} /></m.button>
        <p className="mt-3 flex items-center justify-center gap-1.5 text-[10px] text-slate-500"><Check size={12} className="text-teal-600" />No account needed. No details uploaded.</p>
      </form>
      <div className="flex gap-2.5 rounded-xl border border-indigo-100 bg-indigo-50/60 p-4"><Info size={16} className="mt-0.5 shrink-0 text-indigo-500" /><p className="text-xs leading-6 text-slate-600">Round 1 results use the candidate category and PwBD status recorded in the PDF. Domicile and college preference set the order; gender applies only to seats explicitly marked female-only.</p></div>
    </aside>
    <section ref={resultsRef} tabIndex={-1} aria-labelledby="results-heading" className="min-w-0 scroll-mt-24 focus:outline-none">
      {!submitted ? <div className="glass flex min-h-[560px] flex-col items-center justify-center rounded-2xl p-7 text-center"><div className="relative mb-8 flex size-28 items-center justify-center rounded-full border border-indigo-100 bg-indigo-50"><GraduationCap size={54} strokeWidth={1.2} className="text-indigo-500" /><span className="absolute -right-1 bottom-1 rounded-xl border-4 border-white bg-teal-100 p-2 text-teal-700"><Sparkles size={18} /></span></div><span className="mb-3 text-xs font-medium text-teal-700">ROUND 1 CUTOFF DATA</span><h2 id="results-heading" className="text-2xl font-semibold tracking-tight">See how your profile compares.</h2><p className="mt-4 max-w-md text-sm leading-7 text-slate-500">Compare your profile with {cutoffRecords.length} opening-and-closing rank records derived from 3,415 Round 1 allotments across 160 institutes.</p></div> : <>
        <div className="mb-5"><div className="flex flex-wrap items-center justify-between gap-2"><h2 id="results-heading" className="text-2xl font-semibold tracking-tight">Round {submitted.round} cutoffs near estimated AIR {formatRank(submitted.rank)}</h2><span className="rounded-full border border-teal-100 bg-teal-50 px-3 py-1 text-[10px] font-semibold text-teal-700">2025 ROUND {submitted.round}</span></div><p className="mt-2 text-xs leading-6 text-slate-500">Score {submitted.score} maps to a conservative AIR estimate. Home-state and {submitted.preference === "All" ? "all supported college types" : submitted.preference.toLowerCase()} records are prioritised.</p><p className="mt-1 text-[11px] text-slate-500">Profile: {submitted.category} · PwBD {submitted.pwbd} · {submitted.gender} · {submitted.domicile}</p>{changed && <p role="status" className="mt-3 rounded-lg bg-amber-50 p-3 text-xs text-amber-800">Your inputs have changed. Select Compare With Cutoffs to update these results.</p>}</div>
        <div className="mb-4 flex items-center justify-between gap-3"><p role="status" aria-live="polite" className="text-xs text-slate-500">Showing {matches.length} of {cutoffRecords.length} published rows</p><button type="button" onClick={reset} className="flex items-center gap-1 text-[11px] font-medium text-indigo-600"><RotateCcw size={12} />Reset</button></div>
        <div className="space-y-4">{matches.map((record) => <article key={record.id} className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_4px_20px_-12px_#33415520] sm:p-6"><div className="flex items-start gap-3"><div className="hidden size-11 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-600 sm:flex"><Building2 size={22} strokeWidth={1.5} /></div><div className="min-w-0 flex-1"><h3 className="max-w-[520px] text-[15px] leading-6 font-semibold">{record.name}</h3><p className="mt-1.5 text-[11px] text-slate-500">{record.period} · {record.quota}</p></div></div><div className="mt-5 grid grid-cols-2 gap-4 rounded-xl bg-slate-50 p-4 sm:grid-cols-3">{[["Course", record.course], ["State", record.state], ["College type", record.kind], ["Category", `${record.category}${record.pwbd ? " PwBD" : ""}`], ["Opening rank", formatRank(record.openingRank)], ["Closing rank", formatRank(record.closingRank)]].map(([label, detail]) => <div key={label}><p className="text-[10px] text-slate-500">{label}</p><p className="mt-1.5 text-xs font-semibold">{detail}</p></div>)}</div></article>)}</div>
        {matches.length === 0 && <div className="rounded-2xl border border-dashed border-slate-300 p-10 text-center"><SlidersHorizontal className="mx-auto mb-4 text-slate-400" /><h3 className="font-semibold">No Round 1 cutoff rows match</h3><p className="mt-2 text-sm text-slate-500">Try another score or profile selection.</p><button type="button" onClick={reset} className="mt-5 text-sm font-semibold text-indigo-600">Reset comparison</button></div>}
        <details className="mt-5 rounded-xl border border-slate-200 p-4 text-xs leading-6 text-slate-500"><summary className="cursor-pointer font-medium text-slate-700">About this cutoff data</summary><p className="mt-2">Opening and closing ranks are calculated from the 3,415 allotments in the supplied 2025 AYUSH UG Round 1 PDF, grouped by institute, course, quota, candidate category and PwBD status. Verify final choices against official counselling documents.</p></details>
      </>}
    </section>
  </div>;
}

function Field({ label, id, value, onChange, options, placeholder }: { label: string; id: string; value: string; onChange: (value: string) => void; options: string[]; placeholder: string }) {
  return <div><label htmlFor={id} className="mb-2 block text-xs font-semibold">{label}</label><select id={id} required value={value} onChange={(event) => onChange(event.target.value)} className="field"><option value="">{placeholder}</option>{options.map((option) => <option key={option} value={option}>{option}</option>)}</select></div>;
}
