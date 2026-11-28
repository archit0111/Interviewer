export type EnglishLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
export type ToneQuality = "average" | "better" | "best";

export interface IResult {
    question: string,
    answer: string,
    skillCartegory:string,
    skillScore: number;
    englishScore: number;
    englishLevel: EnglishLevel;
    confidencePercentage: number;
    tone: ToneQuality;
    improvedAnswer: string;
}