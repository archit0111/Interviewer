export type EnglishLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
export type ToneQuality = "average" | "better" | "best";

export interface SkillScoreItem {
  skill: string;
  score: number;
}

// 1. Interface for your final mapped object
export interface IEvaluation {
  skillScores: SkillScoreItem[];

  englishScore: number;
  englishLevel: EnglishLevel | string;

  confidencePercentage: number;
  tone: ToneQuality | string;

  overallScore: number;
  performanceLevel: string;

  strengths: string[];
  improvements: string[];
  feedback: string;
  nextStep: string;
}