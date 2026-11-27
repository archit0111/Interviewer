"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Footer from "@/components/footer/page";
import Navbar from "@/components/navbar/page";

/* ---------- Mock data: replace with your API (GET /sessions, /stats) ---------- */
const USER = { name: "Archit", streak: 6, weeklyGoal: 5, doneThisWeek: 3, readiness: 72 };
const TREND = [48, 55, 52, 61, 66, 63, 71, 78];
const SKILLS = [
  { name: "React", score: 82 },
  { name: "Node.js", score: 74 },
  { name: "JavaScript", score: 68 },
  { name: "MongoDB", score: 55 },
  { name: "System design", score: 38 },
];
const SESSIONS = [
  { skill: "React", mins: 15, score: 78, when: "Today" },
  { skill: "Node.js", mins: 30, score: 71, when: "Yesterday" },
  { skill: "System design", mins: 5, score: 38, when: "2 days ago" },
  { skill: "MongoDB", mins: 15, score: 55, when: "4 days ago" },
];
const DAYS = ["M", "T", "W", "T", "F", "S", "S"];
const DONE_DAYS = [true, true, false, true, false, false, false];
const DURATIONS = [5, 15, 30, 60];

/* Score bands: warm-to-cool, never red (avoids failure/avoidance cues) */
function band(s: number) {
  if (s > 70)
    return {
      label: "Strong", bar: "bg-teal-500", hex: "#14B8A6", hexLight: "#2DD4BF",
      chip: "bg-teal-50 text-teal-800 dark:bg-teal-400/15 dark:text-teal-200"
    };
  if (s > 40)
    return {
      label: "Getting there", bar: "bg-[#3B5BDB]", hex: "#3B5BDB", hexLight: "#7C93F5",
      chip: "bg-indigo-50 text-[#2F49B8] dark:bg-indigo-400/15 dark:text-indigo-200"
    };
  return {
    label: "Room to grow", bar: "bg-amber-400", hex: "#F59E0B", hexLight: "#FFB020",
    chip: "bg-amber-50 text-amber-800 dark:bg-amber-400/15 dark:text-amber-200"
  };
}

const card =
  "rounded-2xl border border-[#E3E6F5] bg-white p-5 shadow-sm dark:border-white/10 dark:bg-blue-00";
const muted = "text-blue-950";

/* ---------- Small components ---------- */
function Ring({ value, color, size = 132 }: { value: number; color: string; size?: number }) {
  const r = 54, c = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} viewBox="0 0 132 132" role="img" aria-label={`Readiness ${value} percent`}>
      <circle cx="66" cy="66" r={r} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="12" />
      <circle cx="66" cy="66" r={r} fill="none" stroke={color} strokeWidth="12" strokeLinecap="round"
        strokeDasharray={`${(value / 100) * c} ${c}`} transform="rotate(-90 66 66)" />
      <text x="66" y="68" textAnchor="middle" className="fill-white text-[30px] font-semibold">{value}</text>
      <text x="66" y="88" textAnchor="middle" className="fill-slate-300 text-[11px]">of 100</text>
    </svg>
  );
}



function Trend({ data }: { data: number[] }) {
  const W = 600, H = 210, padX = 14, top = 16, bottom = 190;
  const x = (i: number) => padX + (i * (W - padX * 2)) / (data.length - 1);
  const y = (v: number) => bottom - (v / 100) * (bottom - top);
  const line = data.map((v, i) => `${i ? "L" : "M"}${x(i)} ${y(v)}`).join(" ");
  const area = `${line} L${x(data.length - 1)} ${bottom} L${x(0)} ${bottom} Z`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img"
      aria-label={`Score trend rising from ${data[0]} to ${data[data.length - 1]}`}>
      {[25, 50, 75].map((g) => (
        <g key={g}>
          <line x1={padX} x2={W - padX} y1={y(g)} y2={y(g)} stroke="currentColor" className="text-blue-950/10" strokeDasharray="4 6" />
          <text x={W - padX} y={y(g) - 5} textAnchor="end" className="fill-slate-400 text-[11px]">{g}</text>
        </g>
      ))}
      <path d={area} fill="#3B5BDB" opacity="0.12" />
      <path d={line} fill="none" stroke="#3B5BDB" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
      {data.map((v, i) => (
        <circle key={i} cx={x(i)} cy={y(v)} r={i === data.length - 1 ? 7 : 3.5}
          fill={i === data.length - 1 ? "#FFB020" : "#3B5BDB"} stroke="white" strokeWidth="2" />
      ))}
    </svg>
  );
}

/* ---------- Page ---------- */
export default function Dashboard() {
  const [duration, setDuration] = useState(15);
  const b = band(USER.readiness);
  const left = USER.weeklyGoal - USER.doneThisWeek;
  const weakest = [...SKILLS].sort((a, c) => a.score - c.score)[0];
  const strongest = [...SKILLS].sort((a, c) => c.score - a.score)[0];
  const [greeting, setGreeting] = useState("Hi");


  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      setGreeting("Good Morning");
    } else if (hour >= 12 && hour < 17) {
      setGreeting("Good Afternoon");
    } else if (hour >= 17 && hour < 21) {
      setGreeting("Good Evening");
    } else {
      setGreeting("Good Evening");
    }
  }, []);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#F6F7FB]">
        <div className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:px-6">

          <section className="w-full h-auto flex items-center justify-center mt-5">
            <div className="p-4">
              <div>
                <div className="place-self-center">
                  <img src="/oratoai-logo.png" alt="oratoai-logo"
                    className="w-24 h-24 lg:w-28 lg:h-28" />
                </div>
                <div className="mb-1 place-self-center">
                  <p className="text-2xl font-bold lg:3xl text-blue-950">orato<span className="text-orange-500">ai</span></p>
                </div>
                <div className="place-self-center mt-[-6] text-slate-400 text-sm font-semibold">
                  Speak it. Score it. Own it.
                </div>
              </div>
            </div>
          </section>

          <div className="flex justify-center items-center mb-10">
            <Link href={'/interviewroom'} className="p-3 bg-amber-400 rounded-2xl px-4 hover:bg-green-500/85 focus:bg-green-500">
              <span className="font-semibold text-black/95">Appear for Interview</span>
            </Link>
          </div>

          <section className="rounded-3xl bg-blue-100 p-6 sm:p-8">
            <div className="relative flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
              <div className="max-w-xl">
                {/* <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm">
                  <span aria-hidden>🔥</span> {USER.streak}-day streak. Keep it going today
                </span> */}
                <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl text-blue-950">
                  {greeting}, {USER.name}. Confidence is a skill. Practice it.
                </h1>
                <p className="mt-3 text-slate-500">
                  Knowing the answer is half the job. Saying it well is the other half.
                </p>
                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <Link href={'/'} className="p-3 bg-white/60 hover:bg-slate-400/40  rounded-2xl px-4">
                    <span className="font-semibold text-black/95">Review last session</span>
                  </Link>
                </div>
              </div>
            </div>
          </section>

          <section className="grid grid-cols-2 gap-4 lg:grid-cols-4" aria-label="Your stats">
            <div className="rounded-2xl border border-[#E3E6F5] bg-blue-100 p-5 shadow-sm ">
              <p className={"text-sm text-blue-950"}>Session Completed</p>
              <p className="mt-2 text-3xl font-semibold tracking-tight text-blue-950">N/A</p>
            </div>
            <div className="rounded-2xl border border-[#E3E6F5] bg-blue-100 p-5 shadow-sm ">
              <p className={"text-sm text-blue-950"}>Average Score</p>
              <p className="mt-2 text-3xl font-semibold tracking-tight text-blue-950">N/A</p>
            </div>
            <div className="rounded-2xl border border-[#E3E6F5] bg-blue-100 p-5 shadow-sm">
              <p className={"text-sm text-blue-950"}>Minutes practiced</p>
              <p className="mt-2 text-3xl font-semibold tracking-tight text-blue-950">N/A</p>
            </div>
            <div className="rounded-2xl border border-[#E3E6F5] bg-blue-100 p-5 shadow-sm ">
              <p className={"text-sm text-blue-950"}>Best Answers</p>
              <p className="mt-2 text-3xl font-semibold tracking-tight text-blue-950">N/A</p>
            </div>
          </section>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
              <section className={card}>
                <div className="flex items-baseline justify-between">
                  <h2 className="text-lg font-semibold text-blue-950">Your progress</h2>
                  <span className={`text-sm ${muted}`}>Last 8 sessions</span>
                </div>
                <div className="mt-3 text-[#14173F]"><Trend data={TREND} /></div>
              </section>
            </div>
          </div>

         
        </div>
      </main>
      <Footer />
    </>
  );
}
