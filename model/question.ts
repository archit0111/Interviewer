import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
    skills:{type:String, required:true, lowercase:true, trim:true},
    SkillLable:String,
    category:{type:String, enum:["technical","behavioral"], default:"technical"},
    difficulty:{type:String, enum:["easy","medium","hard"], default:"medium"},
    type:{type:String, enum:["concept", "scenario", "tricky", "coding", "design", "debugging", "behavioral"], default:"concept"},
    question:{Type:String, required:true, trim:true},
    idealAnswer:{type:String, required:true, trim:true},
    keywords:[String],
    followUp:String,
    expectedSeconds: { type: Number },
    tags: [String],
    active: { type: Boolean, default: true },
    source: { type: String, default: "manual" }
},{timestamps:true});

const Question = mongoose.model("Question",questionSchema);

export default Question