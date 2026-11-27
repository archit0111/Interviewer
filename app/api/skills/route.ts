import {NextResponse} from "next/server";
import connectDB from "@/lib/db";
import Skill from "@/model/skill";

export async function GET(){
    try{
        await connectDB();

        const skills =await Skill.find({})
        .sort({order:1,label:1}).lean();
        return NextResponse.json(skills,{status:200});
    }catch(e){
        console.error("GET /api/skills error:", e);
        return NextResponse.json({error:"Failed to fetch skills from the database."},{status:500});
    }
}
