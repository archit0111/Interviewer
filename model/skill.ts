import mongoose from "mongoose";

const skillSchema = new mongoose.Schema({
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    label: { type: String, required: true, trim: true },
    icon: { type: String, default: "💡" },
    group: { type: String, default: "General" },
    order: { type: Number, default: 100 },
    description: { type: String, trim: true }
},{timestamps:true});

const Skill = mongoose.model("skill", skillSchema,"skills");

export default Skill;