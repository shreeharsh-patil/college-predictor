import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";
import { Predictor } from "@/components/Predictor";
export const metadata: Metadata = { title: "NEET College Predictor | Exam Intel" };

export default function PredictorPage() {
  return <main id="main" className="hero-wash min-h-[80dvh] pb-16"><div className="page-shell pt-8"><Link href="/" className="inline-flex items-center gap-2 text-xs text-slate-500 hover:text-indigo-600"><ArrowLeft size={14} />Back to explore</Link><div className="my-8 sm:mb-10"><div className="mb-3 flex items-center gap-1.5 text-xs font-semibold text-teal-700"><Sparkles size={14} />NEET COLLEGE PREDICTOR</div><h1 className="text-3xl font-semibold tracking-[-.045em] sm:text-4xl">Big dreams. Real possibilities.</h1><p className="mt-3 text-sm leading-6 text-slate-500">Explore your next chapter in medicine, one college at a time.</p></div><Predictor /></div></main>;
}
