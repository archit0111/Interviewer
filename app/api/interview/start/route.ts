import Question from "@/model/question";
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";

export async function POST(req: NextRequest, res: NextResponse) {
    function shuffleArray<T>(array: T[]): T[] {
        const shuffled = [...array]; // Create a copy so original arrays stay untouched
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }
    
    try {
        connectDB();
        const body = await req.json();
        const { skills, duration } = body;
        if (!skills || !duration) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }
        const minutes = Number(duration);

        const cleanSkills: string[] = Array.isArray(skills) ? [...new Set<string>(skills.map((s) => String(s).toLowerCase().trim()))] : [];

        if (cleanSkills.length === 0) {
            return NextResponse.json({ error: "Choose atleast one skill" }, { status: 400 });
        }

        if (!Number.isInteger(minutes) || minutes < 5 || minutes > 60) {
            return NextResponse.json({ error: "Duration must be an integer between 5 and 60 minutes" }, { status: 400 });
        }

        const result = await Question.aggregate([
            {
                $match: {
                    active: true,
                    $or: [
                        { skill: { $in: cleanSkills }, category: "technical" },
                        { category: "behavioral" }
                    ]
                }
            },
            {
                $facet: {
                    easy: [{ $match: { category: "technical", difficulty: "easy" } }, { $sample: { size: (minutes - Math.round(Number(duration) / 3)) } }],
                    medium: [{ $match: { category: "technical", difficulty: "medium" } }, { $sample: { size: (minutes - 3) } }],
                    hard: [{ $match: { category: "technical", difficulty: "hard" } }, { $sample: { size: (minutes - 3) } }],
                    behavioral: [{ $match: { category: "technical" } }, { $sample: { size: (minutes - 4) } }]
                }
            }
        ]);

        const { easy, medium, hard, behavioral } = result[0];

        const questionList = [...easy, ...shuffleArray([medium, ...hard, ...behavioral])];

        return NextResponse.json({ questions: questionList, duration: minutes }, { status: 200 });

    } catch (e) {
        console.error("POST /api/interview/start error:", e);
        return NextResponse.json({ error: "Internal Sever Error" }, { status: 500 });
    }
}

