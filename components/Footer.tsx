import { Compass, ArrowUpRight } from "lucide-react";
import Link from "next/link";

const socialLinks = [
  { label: "Instagram", href: "https://www.instagram.com/examintel?igsh=MXIwaGlnODdsejM0Zg==" },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/exam-intel/" },
  { label: "WhatsApp", href: "https://whatsapp.com/channel/0029Vb6y0qlBqbr8lNBzqV0Q" },
  { label: "Telegram", href: "https://t.me/ExamIntel" },
];

export function Footer() {
  return <footer className="border-t border-slate-200/80 bg-white py-8"><div className="page-shell text-xs text-slate-500"><div className="flex flex-col justify-between gap-6 border-b border-slate-200 pb-7 sm:flex-row sm:items-start"><div><div className="flex items-center gap-2"><Compass size={18} className="text-indigo-600" /><span>Exam Intel <span className="mx-2 text-slate-300">/</span> Your future, a little clearer.</span></div><p className="mt-3 text-slate-400">Stay updated on our platform.</p></div><div><p className="font-semibold text-slate-700">Follow Exam Intel on all platforms</p><div className="mt-3 flex max-w-lg flex-wrap gap-x-5 gap-y-3">{socialLinks.map(({ label, href }) => <a key={label} href={href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 transition hover:text-indigo-600">{label}<ArrowUpRight size={13} /></a>)}</div></div></div><div className="flex flex-col justify-between gap-4 pt-6 sm:flex-row sm:items-center"><span>Made by Anurag Soroya</span><Link href="/#faqs" className="flex items-center gap-1 hover:text-indigo-600">Need a little clarity?<ArrowUpRight size={13} /></Link></div></div></footer>;
}
