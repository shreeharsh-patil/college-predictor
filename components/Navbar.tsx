"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ArrowUpRight, LogOut } from "lucide-react";
import { useState } from "react";
import dynamic from "next/dynamic";
import { useAuth } from "./Providers";

const AuthModal = dynamic(() => import("./AuthModal").then((module) => module.AuthModal), { ssr: false });

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const { profile, logout } = useAuth();
  const pathname = usePathname();
  return <>
    <header className="top-0 z-40 border-b border-slate-200/70 bg-white/90 sticky backdrop-blur-xl">
      <div className="gap-4 page-shell h-19 justify-between flex items-center">
        <Link href="/" aria-label="Exam Intel home" className="gap-2.5 flex items-center"><Image src="/images/exam-intel-logo.png" alt="" width={36} height={36} className="size-9 shrink-0 rounded-lg object-contain" priority /><span className="leading-tight"><span className="text-[15px] font-bold text-slate-800 block tracking-tight sm:text-lg">Exam <span className="text-indigo-600">Intel</span></span><span className="text-[9px] font-medium text-slate-500 block tracking-wide sm:text-[10px]">College Predictor</span></span></Link>
        <nav aria-label="Main navigation" className="gap-8 text-[13px] font-medium text-slate-600 hidden items-center md:flex"><Link href="/" className={pathname === "/" ? "text-indigo-600" : "hover:text-indigo-600"}>College predictor</Link><Link href="/#how-it-works" className="hover:text-indigo-600">How it works</Link><Link href="/#faqs" className="hover:text-indigo-600">FAQs</Link></nav>
        {profile ? <button onClick={() => { void logout().catch(() => setError("Sign out failed. Please try again.")); }} aria-label={`Sign out ${profile.name}`} className="gap-2 px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-medium flex items-center"><span className="max-w-28 truncate">{profile.name}</span><LogOut size={15} /></button> : <button onClick={() => setOpen(true)} className="gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 text-[13px] font-semibold text-white flex items-center whitespace-nowrap transition hover:bg-indigo-700">Sign In<ArrowUpRight size={16} /></button>}
      </div>
      {error && <p role="alert" className="pb-2 page-shell text-sm text-red-700">{error}</p>}
    </header>
    {open && <AuthModal open={open} onClose={() => setOpen(false)} />}
  </>;
}
