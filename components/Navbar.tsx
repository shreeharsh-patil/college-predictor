"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, ArrowUpRight, LogOut } from "lucide-react";
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
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/90 backdrop-blur-xl">
      <div className="page-shell flex h-[76px] items-center justify-between gap-4">
        <Link href="/" aria-label="Exam Intel home" className="flex items-center gap-2.5"><span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white"><Compass size={24} strokeWidth={1.8} /></span><span className="leading-tight"><span className="block text-[15px] font-bold tracking-tight text-slate-800 sm:text-lg">Exam <span className="text-indigo-600">Intel</span></span><span className="block text-[9px] font-medium tracking-wide text-slate-500 sm:text-[10px]">College Predictor</span></span></Link>
        <nav aria-label="Main navigation" className="hidden items-center gap-8 text-[13px] font-medium text-slate-600 md:flex"><Link href="/" className={pathname === "/" ? "text-indigo-600" : "hover:text-indigo-600"}>College predictor</Link><Link href="/#how-it-works" className="hover:text-indigo-600">How it works</Link><Link href="/#faqs" className="hover:text-indigo-600">FAQs</Link></nav>
        {profile ? <button onClick={() => { void logout().catch(() => setError("Sign out failed. Please try again.")); }} aria-label={`Sign out ${profile.name}`} className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 text-xs font-medium"><span className="max-w-28 truncate">{profile.name}</span><LogOut size={15} /></button> : <button onClick={() => setOpen(true)} className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-[13px] font-semibold whitespace-nowrap text-white transition hover:bg-indigo-700">Sign In<ArrowUpRight size={16} /></button>}
      </div>
      {error && <p role="alert" className="page-shell pb-2 text-sm text-red-700">{error}</p>}
    </header>
    {open && <AuthModal open={open} onClose={() => setOpen(false)} />}
  </>;
}
