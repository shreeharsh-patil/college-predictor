import { Compass, ArrowUpRight } from "lucide-react";
import Link from "next/link";
export function Footer() {
  return <footer className="border-t border-slate-200/80 bg-white py-7"><div className="page-shell flex flex-col justify-between gap-5 text-xs text-slate-500 sm:flex-row sm:items-center"><div className="flex items-center gap-2"><Compass size={18} className="text-indigo-600" /><span>Exam Intel College Predictor <span className="mx-2 text-slate-300">/</span> Your future, a little clearer.</span></div><div className="flex items-center gap-6"><span>Made by Anurag Soroya</span><Link href="/#faqs" className="flex items-center gap-1 hover:text-indigo-600">Need a little clarity?<ArrowUpRight size={13} /></Link></div></div></footer>;
}
