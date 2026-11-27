import mongoose from "mongoose";

export interface IQuestion {
  _id: mongoose.Types.ObjectId | string;
  skill: string;
  SkillLable?: string; // Note: matches the exact spelling in your schema
  category: 'technical' | 'behavioral';
  difficulty: 'easy' | 'medium' | 'hard';
  type: 'concept' | 'scenario' | 'tricky' | 'coding' | 'design' | 'debugging' | 'behavioral';
  question: string;
  idealAnswer: string;
  keywords: string[];
  followUp?: string;
  expectedSeconds?: number;
  tags: string[];
  active: boolean;
  source: string;
  createdAt?: Date;
  updatedAt?: Date;
}