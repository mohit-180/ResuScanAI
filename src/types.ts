export interface SkillsByCategory {
  languages: string[];
  frontend: string[];
  backend: string[];
  databases: string[];
  devops: string[];
  cloud: string[];
  architecture: string[];
}

export interface AnalysisInsights {
  strengths: string[];
  weaknesses: string[];
  hiringRecommendation: string;
  confidenceScore: number;
}

export interface ResumeAnalysis {
  atsScore: number;
  skills: SkillsByCategory;
  allSkills: string[];
  missingSkills: string[];
  suggestions: string[];
  insights: AnalysisInsights;
}

export interface HistoryItem {
  id: string;
  timestamp: string;
  role: string;
  analysis: ResumeAnalysis;
}
