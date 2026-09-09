"use client";

import Link from "next/link";
import Image from "next/image";
import { m } from "framer-motion";
import { ArrowUpRight, Atom, CalendarClock, LockKeyhole, Stethoscope } from "lucide-react";

export function ExamCards() {
  return <div className="mt-4 grid gap-5 md:grid-cols-2">
    <button disabled className="relative order-2 min-h-[270px] cursor-not-allowed overflow-hidden rounded-2xl border border-slate-300 bg-white p-7 text-left opacity-50 grayscale md:order-1 sm:p-8" aria-label="JEE (Engineering), 2026 session completed 2027 session coming soon">
      <Atom aria-hidden="true" size={180} strokeWidth={.6} className="absolute top-12 -right-5 rotate-12 text-slate-300" />
      <div className="relative"><div className="mb-7 flex items-center justify-between"><span className="flex size-11 items-center justify-center rounded-xl border border-slate-200 bg-slate-100"><Atom size={25} strokeWidth={1.5} /></span><span className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[10px] font-semibold"><LockKeyhole size={11} />COMING SOON</span></div><h3 className="text-[27px] font-semibold tracking-tight">JEE <span className="text-xl font-normal">(Engineering)</span></h3><p className="mt-2 text-[13px]">For the minds that build tomorrow.</p><div className="mt-7 flex max-w-80 items-center gap-2 text-xs leading-5"><CalendarClock size={16} className="shrink-0" /><span>2026 session completed 2027 session coming soon</span></div></div>
    </button>
    <m.div whileHover={{ scale: 1.05 }} whileTap={{ scale: .99 }} className="relative order-1 rounded-2xl shadow-[0_15px_40px_-15px_#4f46e570] md:order-2">
      <Link href="/predictor" className="group relative block h-full min-h-[270px] overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-800 via-indigo-700 to-teal-700 p-7 text-white sm:p-8">
        <Image src="/images/neet-science.webp" alt="" fill preload sizes="(max-width: 768px) 100vw, 560px" className="object-cover object-right opacity-60 transition duration-500 group-hover:opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#30237b] via-[#30237b]/85 to-transparent" />
        <div className="relative"><div className="mb-7 flex items-center justify-between"><span className="flex size-11 items-center justify-center rounded-xl border border-white/20 bg-white/10 backdrop-blur"><Stethoscope size={24} strokeWidth={1.5} /></span><span className="flex items-center gap-1.5 rounded-full border border-teal-200/25 bg-teal-100/15 px-3 py-1 text-[10px] font-semibold tracking-wide text-teal-100"><span className="size-1.5 rounded-full bg-teal-300" />READY TO EXPLORE</span></div><h3 className="text-[27px] font-semibold tracking-tight">NEET <span className="text-xl font-normal">(Medical)</span></h3><p className="mt-2 text-[13px] text-indigo-100">Compare 2025 AYUSH Round 1 and 3 cutoffs</p><div className="mt-7 flex items-center justify-between"><span className="text-[13px] font-semibold">Compare cutoffs <ArrowUpRight size={16} className="ml-1 inline transition group-hover:translate-x-1 group-hover:-translate-y-1" /></span><span className="text-[11px] text-indigo-100">Your future in care starts here</span></div></div>
      </Link>
    </m.div>
  </div>;
}
