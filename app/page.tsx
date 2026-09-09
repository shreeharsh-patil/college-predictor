import { ExamCards } from "@/components/ExamCards";
import { ArrowRight, BadgeCheck, ChartNoAxesCombined, ChevronDown, Fingerprint, ListFilter, MapPin, Sparkles } from "lucide-react";

const faqs = [
  {
    question: "What is Exam Intel?",
    answer: [
      "Exam Intel is a student-focused platform providing the latest exam notifications, counselling updates, important dates, results, cutoffs and other academic updates in one place.",
      "We started our journey in May 2024 on Telegram, with a simple goal — to make important exam and admission updates easier for students to find, understand and access. Since then, Exam Intel has grown into a dedicated platform for timely educational updates.",
    ],
  },
  {
    question: "Which exams does Exam Intel cover?",
    answer: [
      "Exam Intel has been covering JEE-related updates since 2024. From 2026, we expanded our coverage to include counselling updates, including important admission and counselling-related information across India.",
    ],
  },
  {
    question: "Are the updates verified?",
    answer: [
      "We aim to provide information sourced from official notifications and authorities. For important decisions, students are always advised to cross-check critical details with the respective official website.",
    ],
  },
  {
    question: "Where can I find the latest exam notifications?",
    answer: [
      "The latest notifications, announcements and important updates are regularly shared in the Latest Updates section of our Telegram channel.",
    ],
  },
  {
    question: "Can I find previous-year cutoffs on Exam Intel?",
    answer: [
      "Yes. Wherever reliable data is available, we provide previous-year cutoffs and admission-related information for reference and comparison. This information is currently available through our Telegram channel.",
    ],
  },
  {
    question: "How can I find information about a specific exam?",
    answer: [
      "You can use the Search option in our Telegram channel to find updates related to a specific exam or category, including notifications, important dates, results, cutoffs and other relevant information.",
    ],
  },
  {
    question: "How frequently is Exam Intel updated?",
    answer: [
      "We regularly share updates whenever new official notifications, schedules, results, counselling updates or other important announcements are released.",
      "Note: While we strive to cover all important updates, we cannot guarantee 100% coverage of every notification or development.",
    ],
  },
  {
    question: "What if I find an incorrect or outdated update?",
    answer: [
      "Since our journey began in 2024, we have maintained a strong focus on accuracy and reliability. To the best of our knowledge, we have had only one incorrect update since 2024.",
      "However, if you notice any incorrect, outdated or missing information, please inform us through the Contact Us section or directly on our Telegram channel. We will review the information and make corrections wherever required.",
    ],
  },
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
    <section aria-labelledby="counselling-heading" className="page-shell pb-16 sm:pb-20">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_#33415540] sm:p-9">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold tracking-[.14em] text-indigo-600">NEET UG COUNSELLING</p>
          <h2 id="counselling-heading" className="mt-3 text-3xl font-semibold tracking-[-.04em]">MCC &amp; state counselling, in one place</h2>
          <p className="mt-4 text-sm leading-7 text-slate-600">After your NEET UG result, seats are allotted through national and state counselling routes. Exam Intel helps you understand both, so you can weigh All India Quota and home-state options together.</p>
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          <article className="rounded-2xl border border-indigo-100 bg-indigo-50/50 p-6 sm:p-7">
            <div className="flex size-11 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-sm"><BadgeCheck size={22} /></div>
            <p className="mt-6 text-[11px] font-semibold tracking-[.12em] text-indigo-600">NATIONAL COUNSELLING ROUNDS</p>
            <h3 className="mt-2 text-xl font-semibold tracking-tight">MCC (All India Quota)</h3>
            <p className="mt-3 text-sm leading-7 text-slate-600">MCC conducts counselling for 15% All India Quota MBBS and BDS seats, along with seats in participating central institutes, universities and deemed universities. Allotment depends on eligibility, NEET rank, category, the published seat matrix and your choice filling.</p>
            <div className="mt-5 flex flex-wrap gap-2">{["MBBS", "BDS", "AIQ", "Participating institutions"].map((item) => <span key={item} className="rounded-full border border-indigo-100 bg-white px-3 py-1.5 text-[11px] font-medium text-indigo-700">{item}</span>)}</div>
            <p className="mt-5 border-t border-indigo-100 pt-4 text-xs leading-6 text-slate-500">AYUSH All India Quota counselling is conducted separately by AACCC.</p>
          </article>
          <article className="rounded-2xl border border-teal-100 bg-[#eef7f6] p-6 sm:p-7">
            <div className="flex size-11 items-center justify-center rounded-xl bg-white text-teal-700 shadow-sm"><MapPin size={22} /></div>
            <p className="mt-6 text-[11px] font-semibold tracking-[.12em] text-teal-700">HOME-STATE &amp; STATE-QUOTA SEATS</p>
            <h3 className="mt-2 text-xl font-semibold tracking-tight">State counselling</h3>
            <p className="mt-3 text-sm leading-7 text-slate-600">Each state or UT runs its own NEET counselling for state-quota and other participating seats. Exam Intel brings the major state pathways together so you can understand home-state options alongside national counselling.</p>
            <div className="mt-5 flex flex-wrap gap-2">{["State NEET counselling", "Home-state", "State quota", "Major states"].map((item) => <span key={item} className="rounded-full border border-teal-100 bg-white px-3 py-1.5 text-[11px] font-medium text-teal-800">{item}</span>)}</div>
          </article>
        </div>
        <div className="mt-5 flex gap-3 rounded-2xl border border-amber-100 bg-amber-50 p-5"><ChartNoAxesCombined size={19} className="mt-0.5 shrink-0 text-amber-700" /><p className="text-xs leading-6 text-amber-900">This preview currently uses illustrative sample closing ranks and is meant as guidance. Final allotments depend on each year&apos;s official seat matrix, counselling rounds, eligibility rules, choice filling and category movement — use the results as a starting point, not a guarantee.</p></div>
      </div>
    </section>
    <section id="faqs" className="page-shell grid gap-8 pb-20 md:grid-cols-[.75fr_1.25fr]"><div><h2 className="text-3xl font-semibold tracking-[-.04em]">Frequently Asked Questions</h2><p className="mt-3 text-sm text-slate-500">Everything you need to know about Exam Intel.</p></div><div>{faqs.map(({ question, answer }) => <details key={question} className="group border-b border-slate-200 py-5 first:pt-0"><summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-medium [&::-webkit-details-marker]:hidden">{question}<ChevronDown size={17} className="shrink-0 text-slate-400 transition group-open:rotate-180" /></summary><div className="mt-4 space-y-3 pr-6 text-sm leading-7 text-slate-600">{answer.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div></details>)}</div></section>
  </main>;
}
