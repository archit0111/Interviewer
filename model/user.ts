import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, select: false },
    authProvider: { type: String, enum: ["local", "google"], default: "local" },
    avatarUrl: String,
    role: { type: String, enum: ["user", "admin"], default: "user" },
    stats: {
      sessionsCompleted: { type: Number, default: 0 },
      totalMinutes: { type: Number, default: 0 },
      averageScore: { type: Number, default: 0 },
      currentStreak: { type: Number, default: 0 },
      longestStreak: { type: Number, default: 0 },
      lastPracticeDate: Date,
    }
})

const User = mongoose.model("user", userSchema);

export default User;

// targetRole: { type: String, trim: true },
//     experienceLevel: { type: String, enum: ["fresher", "junior", "mid", "senior"], default: "fresher" },
//     preferredSkills: [String]