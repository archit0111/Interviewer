export interface IResult {
  question: string;
  answer: string;

  skillCartegory: string; 
  skillScore: number;
  skillReasoning: string; 

  englishScore: number;
  englishLevel: string;
  englishReasoning: string;

  confidencePercentage: number;
  confidenceReasoning: string;
  tone: string;
  toneReasoning: string;

  strengths: string[];
  improvements: string[];
  summary: string;
}