import { ExamCards } from "@/components/ExamCards";
import { ArrowRight, BadgeCheck, ChartNoAxesCombined, ChevronDown, Fingerprint, ListFilter, MapPin, Sparkles } from "lucide-react";

const faqs = [
  { question: "How does the college predictor work?", answer: "Enter a NEET score or All India Rank, your category, and domicile. This demo compares your profile with six sample college records and groups matches into High, Medium, and Low admission chances. You can then filter by ownership and annual fees." },
  { question: "Are these official admission predictions?", answer: "No. College names are real, but all fees, closing ranks, score conversions, and category or domicile adjustments are illustrative. They are not official cutoffs or admission guarantees. Check the relevant counselling authority and college before making decisions." },
  { question: "Can I explore colleges without signing in?", answer: "Yes. The full demo predictor is free to explore without an account. Google and phone authentication are available when Firebase is configured; otherwise the sign-in modal provides a clearly labeled local demo." },
  { question: "When will the JEE predictor be available?", answer: "2026 session completed 2027 session coming soon. The JEE card is currently disabled. You can explore the active NEET predictor for MBBS, BDS, and AYUSH courses." },
];

export default function Home() {
  return <main id="main">
    <section className="hero-wash border-b border-slate-200/60 pb-12 pt-10 sm:pb-12">
      <div className="page-shell">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white/80 px-3.5 py-1.5 text-[11px] font-semibold tracking-wide text-indigo-700"><Sparkles size={13} /> A LITTLE CLARITY. A BIG NEXT CHAPTER.</div>
          <h1 className="text-[38px] leading-[1.13] font-semibold tracking-[-.055em] text-[#202447] sm:text-[58px]">Your dream college.<br /><span className="text-indigo-600">Let’s find your way there.</span></h1>
          <p className="mx-auto mt-5 max-w-lg text-[15px] leading-7 text-slate-500">Turn your hard work into possibilities. Explore the colleges<br className="hidden sm:block" /> that could be your next chapter.</p>
        </div>
        <div className="mt-8 flex items-center justify-between gap-3"><h2 className="text-sm font-semibold">Start with your exam</h2><span className="text-xs text-slate-500">One step closer to what’s next<ArrowRight className="ml-2 inline" size={13} /></span></div>
        <ExamCards />
        <div className="mt-7 flex flex-wrap justify-center gap-x-8 gap-y-3 text-xs text-slate-500"><span className="flex items-center gap-2"><BadgeCheck size={16} className="text-teal-600" /> No sign-up needed to explore</span><span className="flex items-center gap-2"><Fingerprint size={16} className="text-teal-600" /> Your details stay in your browser</span><span className="flex items-center gap-2"><ChartNoAxesCombined size={16} className="text-teal-600" /> Transparent, illustrative predictions</span></div>
      </div>
    </section>
    <section id="how-it-works" className="page-shell py-16 sm:py-20">
      <div className="text-center"><h2 className="text-3xl font-semibold tracking-[-.04em]">Less guesswork. More direction.</h2><p className="mt-3 text-sm text-slate-500">From your exam result to your possibilities, in three simple steps.</p></div>
      <div className="mt-11 grid gap-8 md:grid-cols-3 md:gap-12">
        {[{ icon: Fingerprint, title: "Tell us a little about you", text: "Add your score or rank, category, and home state. That’s all you need." }, { icon: ChartNoAxesCombined, title: "See where you stand", text: "Discover college matches with easy-to-understand admission chance indicators." }, { icon: ListFilter, title: "Find your kind of college", text: "Explore courses and narrow your options by college type and your budget." }].map(({ icon: Icon, title, text }, index) => <div key={title} className="relative"><div className="mb-5 flex items-center gap-4"><span className="flex size-12 items-center justify-center rounded-2xl border border-indigo-100 bg-indigo-50 text-indigo-600"><Icon size={23} strokeWidth={1.6} /></span><span className="text-xs font-medium text-slate-400">0{index + 1}</span>{index < 2 && <span className="hidden h-px flex-1 border-t border-dashed border-slate-200 md:block" />}</div><h3 className="text-[15px] font-semibold">{title}</h3><p className="mt-2 max-w-xs text-[13px] leading-6 text-slate-500">{text}</p></div>)}
      </div>
    </section>
    <section className="page-shell pb-16"><div className="flex flex-col items-start justify-between gap-6 rounded-2xl border border-teal-100 bg-[#eef7f6] p-7 sm:flex-row sm:items-center sm:p-9"><div className="flex gap-4"><div className="hidden size-12 shrink-0 items-center justify-center rounded-full bg-white text-teal-700 sm:flex"><MapPin size={23} /></div><div><h2 className="text-xl font-semibold tracking-tight">A starting point for a big decision.</h2><p className="mt-2 max-w-2xl text-[13px] leading-6 text-slate-600">Explore freely, then verify. This preview uses sample data; official counselling cutoffs and college fees may differ.</p></div></div><a href="#faqs" className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-teal-800">Understand your results<ArrowRight size={16} /></a></div></section>
    <section id="faqs" className="page-shell grid gap-8 pb-20 md:grid-cols-[.75fr_1.25fr]"><div><h2 className="text-3xl font-semibold tracking-[-.04em]">A little more clarity.</h2><p className="mt-3 text-sm text-slate-500">Good questions. Straightforward answers.</p></div><div>{faqs.map(({ question, answer }) => <details key={question} className="group border-b border-slate-200 py-5 first:pt-0"><summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-medium [&::-webkit-details-marker]:hidden">{question}<ChevronDown size={17} className="shrink-0 text-slate-400 transition group-open:rotate-180" /></summary><p className="mt-4 pr-6 text-sm leading-7 text-slate-600">{answer}</p></details>)}</div></section>
  </main>;
}
