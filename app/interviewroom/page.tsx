"use client"
import Footer from "@/components/footer/page";
import Navbar from "@/components/navbar/page";
import { ISkill } from "@/types/skill";
import { IQuestion } from "@/types/question";
import { ForwardIcon, Mic } from "lucide-react";
import { useSpeechToText } from "@/hooks/useSpeechToText";
import { useEffect, useState } from "react";
import { IResult } from "@/types/results";
import { IEvaluation } from "@/types/interviewResult";

const DURATIONS = [
    { min: 5, label: "Quick check", questions: "3 to 5 " },
    { min: 10, label: "Warm-up", questions: "5 to 10 " },
    { min: 15, label: "Standard", questions: "10 to 15 " },
    { min: 30, label: "Full round", questions: "15 to 25 " },
];


export default function Interviewroom() {
    const [phase, setPhase] = useState("setup");
    const [skills, setSkills] = useState<ISkill[]>([]);
    const [duration, setDuration] = useState(5);
    const [quesCount, setQuesCount] = useState(-1);
    const [selected, setSelected] = useState<string[]>([]);
    const [starting, setStarting] = useState(false);
    const [questions, setQuestions] = useState<IQuestion[]>([]);
    const [currentQuestion, setCurrentQuestion] = useState<IQuestion>();
    const [errorMsg, setErrorMsg] = useState<string>("");
    const [results, setResults] = useState<IResult[]>([]);
    const { transcript, interim, listening, error, start, stop, reset } = useSpeechToText("en-IN");
    const [totalTimeLeft, setTotalTimeLeft] = useState(5 * 60);
    const [evaluating,setEvaluating]=useState(false);
    const [allEvaluated, setAllEvaluated] = useState(false);
    const [overallEvaluation, setOverallEvaluation] = useState<IEvaluation>();


    //for fetching skills

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

    //to select the skills

    const handleSelect = (slug: string) => {
        setSelected((prev) =>
            prev.includes(slug)
                ? prev.filter((item) => item !== slug)
                : [...prev, slug])
    };

    useEffect(()=>{
        
    if(!error){
        setErrorMsg(error);
    }
    },[error]);


    //runs when user clicks on start interview

    const handleStartInterview = async () => {
        setPhase("starting");
        setStarting(true);
        try {
            const res = await fetch('/api/interview/start', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ skills: selected, duration })
            });
            const data = await res.json();
            console.log("API Response Data:", data);
            if (!res.ok) {
                console.error("Failed to fetch questions:", res.status, data);
                return
            }
            setQuestions(data.questions);
            setCurrentQuestion(data.questions[0]);
            setDuration(data.duration);
            setPhase("started");
            intitializeInterview();
        } catch (e) {
            setPhase("setup");
            console.error("Error :", e);
        } finally {
            setStarting(false);
        }
    }

    //For Starting the interview

    const intitializeInterview = () => {
        setQuesCount(0);
        setTotalTimeLeft(duration * 60);
        const totalTime = setInterval(() => {
            setTotalTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(totalTime);
                    handleSubmit(); //submit interview becuse time is over
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const formatTime = (secs: number) => {
        const min = Math.floor(secs / 60);
        const sec = secs % 60;
        return `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`
    }

    //for submittion of current question and to evaluate it

    useEffect(() => {
        const nextQuestion = async () => {

            //for next Question

            if (quesCount > questions.length) {
                return
            } else {
                setCurrentQuestion(questions[quesCount]);
            }
            
            if (!questions || quesCount === 0 || !transcript) return;
            
            reset();
            
            //for evaluation of current answer
            try {
                setEvaluating(true);
                const res = await fetch('/api/interview/evaluateAnswer', {
                    "method": "POST",
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ question: currentQuestion?.question, answer: transcript })
                });
                const data = await res.json();
                if (!res.ok) {
                    console.error("Error occered in evaluating the question!", data.error);
                    return
                }
                setEvaluating(false);
                setResults((prev) => [...prev, data.result]);
            } catch (e) {
                console.error("Error in evaluation", e);
            }
        };
        nextQuestion();
    }, [quesCount]);


    //handle Interview Submittion

    const handleSubmit = async () => {
        alert("submitted")
        setQuesCount((prev) => prev + 1);
        setPhase("done");
        setAllEvaluated(true);
        stop();
    }

    //for overall evaluation of Interview

    useEffect(()=>{
        if(!allEvaluated || evaluating){
            return
        }
        const evaluateInterview = async () => {
        try {
            const res = await fetch('/api/interview/evaluateInterview', {
                "method": "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ results })
            });
            const data = await res.json();
            if (!res.ok) {
                console.error("Error occered in evaluating the Interview!", data.error);
                return
            }
            setOverallEvaluation(data.overallResult);
        } catch (e) {
            console.error("Error in evaluation", e);
        }
    };
    evaluateInterview();
    },[allEvaluated,evaluating]);

    //for saving transcription

    const saveAns = () => {
        stop();
        console.log("Answer text to store:", transcript);
    }


    return (
        <>
            {phase !== "started" ? <Navbar /> : null}
            <div className="mt-20 min-h-screen">
                <section className={`${phase !== "setup" ? "hidden" : "grid"} m-4 lg:m-8 p-1`}>
                    <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl mb-1 text-blue-950">Set up your interview</h1>
                    <div className="mb-10">
                        <p className="mb-2 font-semibold text-sm text-slate-400">1. Pick up skills and how long you want to practice. Questions come one at a time, and you answer out loud.</p>
                        {skills.length === 0 ?
                            <div className="flex items-center justify-center w-full px-4 py-10 pt-10 sm:px-6 bg-blue-100 rounded-2xl mt-5">
                                <div className="font-bold text-blue-950 flex items-center gap-1"><div className="rounded-full border-4 border-blue-950 border-t-transparent animate-spin w-6 h-6"></div>Loading...</div>
                            </div>
                            : <div className="w-full max-h-fit justify-items-center px-4 py-10 sm:px-6 bg-blue-100 rounded-2xl grid grid-cols-1 sm:grid-cols-2 gap-4  lg:grid-cols-3 mt-5">
                                {skills.length === 0 ? "s" : skills.map((skill) => (
                                    <div key={skill._id}
                                        onClick={() => handleSelect(skill.slug)}
                                        className="bg-white/85 w-full items-center rounded-2xl hover:border-2 p-2 py-4 border-white focus:border-green-400 focus:border-2 border-2 justify-between shadow-blue-300 shadow-lg hover:shadow-xl max-w-80 hover:border-slate-300 sm:flex">
                                        <p className="text-blue-950 font-semibold lg:text-2xl text-xl">
                                            <span className="pr-1">{skill.icon}</span>{skill.label}</p>
                                        {!selected.includes(skill.slug) ? <button className="max-h-8 sm:px-2 font-semibold text-slate-400 bg-slate-200 text-sm rounded-2xl hover:bg-green-200 mx-4 
                                        justify-self-center flex sm:block mt-4 sm:mt-0 py-1 px-4 w-full sm:w-auto place-content-center hover:shadow-xl/40 border-slate-200 hover:border-green-400 hover:border-2 border-2 hover:shadow-green-300">Select</button> :
                                            <button className="max-h-8 sm:px-2 font-semibold text-slate-400 text-sm rounded-2xl bg-green-200  mx-4 justify-self-center flex sm:block mt-4 sm:mt-0 py-1 px-4 w-full sm:w-auto place-content-center hover:shadow-xl/40 border-green-400 border-2 hover:shadow-green-300">Selected</button>}
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
                        <button type="button" disabled={selected.length === 0}
                            onClick={handleStartInterview}
                            className="rounded-xl bg-amber-400 px-8 py-3 font-semibold text-[#14173F] transition hover:bg-amber-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B5BDB] disabled:cursor-not-allowed disabled:opacity-50">
                            {starting ? "Preparing your questions…" : "Start interview"}
                        </button>
                    </div>
                </section>



                {/* Interview section */}

                {phase === "starting" ? <div className="flex justify-center bg-blue-100 m-10 rounded-3xl h-50 items-center">
                    <div className="font-bold text-blue-950 flex items-center gap-1"><div className="rounded-full border-4 border-blue-950 border-t-transparent animate-spin w-6 h-6"></div>Loading...</div>
                </div> : null}
                {phase === "started" ? errorMsg !== "" ? <div className="flex justify-center text-red-500 border-2 bg-red-300/65 border-red-500/45 m-10 rounded-3xl h-50 items-center">
                    <div className="font-bold lg:text-lg  rounded-2xl min-h-[75%] min-w-[80%] justify-center bg-white/50 flex items-center gap-1">{errorMsg}</div>
                </div> : null : null}
                <section className={`${phase !== "started" ? "hidden" : "grid"} m-4 mt-[-40] lg:m-8 p-1`}>
                    <div className="bg-blue-100 flex justify-between px-4 rounded-2xl h-17 items-center">
                        <div className="flex justify-between items-center">
                            <div>
                                <img src="/oratoai-logo.png" alt="oratoai-logo"
                                    className="w-12 h-12 lg:w-14 lg:h-14" />
                            </div>
                            <div className="mb-1">
                                <p className="text-xl font-bold lg:2xl text-blue-950">orato<span className="text-orange-500">ai</span></p>
                                <p className="font-semibold text-slate-500 mt-[-7] text-sm">Interview Room</p>
                            </div>
                        </div>
                        <div className={`${totalTimeLeft < 45 ? "bg-red-400/85 border-red-300 text-red-800" : "bg-white/95 border-slate-300 "} rounded-xl px-2 py-2 opacity-50 hover:opacity-85 border-2`}>
                            Time Left : <span>{formatTime(totalTimeLeft)}</span>
                        </div>
                    </div>
                    <div className="relative overflow-hidden">
                        <div
                            aria-hidden="true"
                            className="pointer-events-none z-50 select-none absolute inset-0 flex items-center justify-center opacity-8"
                        >
                            <img
                                src="/oratoai-logo.png"
                                alt=""
                                className="w-[60%] h-[60%] object-contain"
                            />
                        </div>
                        <div className="bg-blue-100 px-4 mt-10 py-4 rounded-2xl">
                            <div className="p-2 m-1 flex mb-15">
                                <p className="text-lg w-full">
                                    <span className="pr-1 font-semibold">
                                        Q{quesCount + 1}.
                                    </span>
                                    {currentQuestion?.question}</p>
                            </div>

                            {/**transcript section */}

                            <div>
                                {!error ? <p className="min-h-24 rounded-xl border-2 bg-white/35 border-slate-300 p-4">
                                    {transcript}
                                    <span className="text-gray-400">{transcript || interim ? interim : "Take a deep Breath then start telling answer.."}</span>
                                </p> :
                                    <p className="min-h-12 text-red-500 rounded-xl border-2 bg-red-400/25 border-red-300 p-4">
                                        {error}
                                    </p>}
                            </div>
                            <div className="flex gap-[5%] items-center sm:gap-[50%] justify-center py-4">
                                <div>
                                    <button
                                        onClick={listening ? () => saveAns() : start}
                                        className={`${listening ? "shadow-lg animate-pulse" : ""} justify-center flex items-center hover:shadow-lg shadow-blue-950/50 gap-1 px-3 lg:px-5 lg:p-4 text-blue-950/95 bg-white/95 border-2 border-blue-950/75 hover:border-2 hover:border-blue-950 rounded-xl p-2`}>
                                        <Mic size={20} className={listening ? "text-blue-950 animate-pulse" : ""} />
                                        <span className="lg:text-lg text-sm font-semibold">{listening ? "Listening..." : "Start telling answer"}</span>
                                    </button>
                                </div>
                                <div>
                                    {quesCount !== questions?.length ? <button
                                        onClick={() => setQuesCount(prev => prev + 1)}
                                        className="flex items-center gap-1 px-3 text-white hover:shadow-lg lg:px-5 lg:p-4 bg-blue-800 border-2 border-blue-800 hover:border-2 hover:border-blue-950 hover:shadow-blue-950 rounded-xl  p-2">
                                        <ForwardIcon />
                                        <span className="lg:text-lg text-sm font-semibold">Next Question</span>
                                    </button> :
                                        <button
                                            onClick={handleSubmit}
                                            className="flex items-center gap-1 px-3 text-white hover:shadow-lg lg:px-5 lg:p-4 bg-blue-800 border-2 border-blue-800 hover:border-2 hover:border-blue-950 hover:shadow-blue-950 rounded-xl  p-2">
                                            <span className="lg:text-lg text-sm font-semibold">Submit</span>
                                        </button>}
                                </div>
                            </div>
                            {/* <div className="flex justify-end gap-1 text-sm px-2 font-semibold text-slate-500">
                                <p>Time on this question:</p>
                                <div>{currentQuestion?.expectedSeconds}<span className="pl-0.5">sec</span></div>
                            </div> */}
                        </div>
                        <div>
                        </div>
                    </div>
                </section>

                {/**After Submittion of Interview */}
                <section className={`${phase !== "done" ? "hidden" : "grid"} m-4 mt-10 lg:m-8 p-1`}>
                    <h1 className="font-bold text-blue-950 text-xl sm:text-2xl mb-5">
                        Results
                    </h1>

                    <div className="h-max w-full bg-blue-100 rounded-2xl p-4 ">
                        <div className="min-h-24 rounded-xl border-2 bg-white/65 border-slate-300 p-4">

                        {results.length===0?
                        <div className="flex justify-center">You not given any answers...</div>
                        :null}
                            {results.map((item, index) => (
                                <div key={index} className="border border-blue-950 p-4 rounded mb-4">
                                    <h3 className="font-bold">Ques: {item.question}</h3>
                                    <p className="font-light mb-2"><span className="font-bold">Ans:</span> {item.answer}</p>
                                    <p><span className="font-semibold">Skill ({item.skillCartegory}):</span> {item.skillScore}/5</p>
                                    <p><span className="font-semibold">English ({item.englishLevel}):</span> {item.englishScore}/5</p>
                                    <p><span className="font-semibold">Confidence:</span> {item.confidencePercentage}%</p>
                                    <p><span className="font-semibold">Tone:</span> {item.tone}</p>
                                    <p><span className="font-semibold">Better Answer:</span> {item.improvedAnswer}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    {phase === "done" ? <div>
                        <h1 className="font-bold text-blue-950 text-xl sm:text-2xl mt-10 ">
                            Overall Performance
                        </h1>
                        {!overallEvaluation ?
                            <div className="h-max w-full bg-blue-100 rounded-2xl p-4 mt-5">
                                <div className="min-h-24 flex justify-center items-center gap-2 rounded-xl border-2 bg-white/65 border-slate-300 p-4">
                                    <div className="rounded-full border-4 border-blue-950 border-t-transparent animate-spin w-6 h-6"></div>Evaluating Results...
                                </div>
                            </div>
                            : null}
                        {overallEvaluation?<div className="h-max w-full bg-blue-100 rounded-2xl p-4 mt-5">
                            <div className="min-h-24 rounded-xl border-2 bg-white/65 border-slate-300 p-4">
                                <div className="border border-blue-950 p-4 rounded mb-4">
                                    <p className="font-light mb-2"><span className="font-bold">performanceLevel:</span> {overallEvaluation.performanceLevel}</p>
                                    <p><span className="font-semibold">English ({overallEvaluation.englishLevel}):</span> {overallEvaluation.englishScore}/5</p>
                                    <p><span className="font-semibold">Confidence:</span> {overallEvaluation.confidencePercentage}%</p>
                                    <p><span className="font-semibold">Tone:</span> {overallEvaluation.tone}</p>
                                    <p><span className="font-semibold">Feedback:</span> {overallEvaluation.feedback}</p>
                                </div>
                            </div>
                        </div>:null}
                    </div> : null}
                </section>

            </div>
            <Footer />
        </>
    )
}