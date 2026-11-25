"use client"
import Navbar from "@/components/navbar/page";
import { SkillType } from "@/types/skill";
import { useEffect, useState } from "react";

const DURATIONS = [
    { min: 5, label: "Quick check", questions: "3 to 5 " },
    { min: 10, label: "Warm-up", questions: "3 to 5 " },
    { min: 15, label: "Standard", questions: "10 to 15 " },
    { min: 30, label: "Full round", questions: "15 to 25 " },
];

const duration = 5


export default function Interviewroom() {
    const [phase, setPhase] = useState("setup");
    const [skills, setSkills] = useState<SkillType[]>([]);
    const [duration, setDuration] = useState(5);
    const [selected, setSelected] = useState<SkillType[]>([]);
    const [starting, setStarting] = useState(false);

    useEffect(() => {
        const fetchSkills = async () => {
            try {
                const res = await fetch('/api/skills');
                const data = await res.json();
                setSkills(data);
            } catch (e) {
                console.error('Error fetching Skills:', e);
            }
        }
        fetchSkills();
    }, []);


    const handleStartInterview = async () => {
        setPhase("starting")
    }

    return (
        <>
            <Navbar />
            <div className="mt-20">
                <section className={`${phase !== "setup" ? "hidden" : "grid"} m-4 lg:m-8 p-1`}>
                    <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl mb-1 text-blue-950">Set up your interview</h1>
                    <div className="mb-10">
                        <p className="mb-2 font-semibold text-sm text-slate-400">1. Pick up skills and how long you want to practice. Questions come one at a time, and you answer out loud.</p>
                        {skills.length === 0 ?
                            <div className="flex items-center justify-center w-full px-4 py-10 pt-10 sm:px-6 bg-blue-100 rounded-2xl mt-5">
                                Loading...
                            </div>
                            : <div className="w-full max-h-fit justify-items-center px-4 py-10 sm:px-6 bg-blue-100 rounded-2xl grid grid-cols-1 sm:grid-cols-2 gap-4  lg:grid-cols-3 mt-5">
                                {skills.length === 0 ? "s" : skills.map((skill) => (
                                    <div key={skill._id}
                                        className="bg-white/85 w-full items-center rounded-2xl hover:border-2 p-2 py-4 border-white focus:border-green-400 focus:border-2 border-2 justify-between shadow-blue-300 shadow-lg hover:shadow-xl max-w-80 hover:border-slate-300 sm:flex">
                                        <p className="text-blue-950 font-semibold lg:text-2xl text-xl"><span className="pr-1">{skill.icon}</span>{skill.label}</p>
                                        <button className="max-h-8 sm:px-2 font-semibold text-slate-400 bg-slate-200 text-sm rounded-2xl hover:bg-green-200 focus:bg-green-400 focus:text-white mx-4 justify-self-center flex sm:block mt-4 sm:mt-0 py-1 px-4 w-full sm:w-auto place-content-center hover:shadow-xl/40 border-slate-200 hover:border-green-400 hover:border-2 border-2 hover:shadow-green-300">Select</button>
                                    </div>
                                ))}
                            </div>}
                    </div>
                    <div>
                        <p className="mb-2 font-semibold text-sm text-slate-400">2. Choose your time</p>
                        <div className="bg-blue-100 px-4 py-10 rounded-2xl mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4" role="radiogroup" aria-label="Interview length">
                            {DURATIONS.map((d) => (
                                <button key={d.min} type="button" role="radio" onClick={() => setDuration(d.min)}
                                    className={`rounded-2xl border p-4 text-left transition ${duration === d.min ? "border-orange-500 bg-orange-500 text-white" : `border-white bg-white hover:border-orange-500`
                                        }`}>
                                    <span className="block text-2xl font-semibold">{d.min} min</span>
                                    <span className={`${duration === d.min ? "" : "text-slate-400"} text-sm font-semibold`}>{d.questions}question</span>
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="mt-10 justify-center flex">
                        <button type="button" disabled={selected.length !== 0}
                        onClick={handleStartInterview}
                            className="rounded-xl bg-amber-400 px-8 py-3 font-semibold text-[#14173F] transition hover:bg-amber-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B5BDB] disabled:cursor-not-allowed disabled:opacity-50">
                            {starting ? "Preparing your questions…" : "Start interview"}
                        </button>
                    </div>
                </section>

            </div>
        </>
    )
}