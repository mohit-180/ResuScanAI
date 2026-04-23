import { useState, useEffect, MouseEvent } from "react";
import { 
  Sparkles, 
  ChevronLeft, 
  AlertCircle, 
  CheckCircle,
  LayoutDashboard,
  BrainCircuit,
  Search,
  History,
  Trash2,
  Clock
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { GoogleGenAI, Type } from "@google/genai";
import ResumeForm from "./components/ResumeForm";
import AtsGauge from "./components/AtsGauge";
import SkillsRadar from "./components/SkillsRadar";
import CategoryBars from "./components/CategoryBars";
import InsightSection from "./components/InsightSection";
import { ResumeAnalysis, HistoryItem } from "./types";

// Initialize Gemini directly on the frontend
// In AI Studio, the GEMINI_API_KEY is automatically injected into the process.env
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY || "";
const genAI = new GoogleGenAI({ apiKey });

export default function App() {
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [activeTab, setActiveTab] = useState<'scanner' | 'history'>('scanner');

  // Load history on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem("resuScan_history");
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  // Save history whenever it changes
  useEffect(() => {
    localStorage.setItem("resuScan_history", JSON.stringify(history));
  }, [history]);

  /**
   * handleAnalyze
   * Uses Gemini AI directly from the frontend to analyze the resume text.
   */
  const handleAnalyze = async (resumeText: string, targetRole: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const model = "gemini-3-flash-preview";
      
      const prompt = `
        Analyze the following resume text. 
        ${targetRole ? `The analysis should be tailored for the target role: ${targetRole}.` : "The analysis should be for a standard high-quality technical role."}
        
        Provide a detailed ATS-style analysis in strict JSON format.
        
        Required JSON structure:
        {
          "atsScore": number (0-100),
          "skills": {
            "languages": string[],
            "frontend": string[],
            "backend": string[],
            "databases": string[],
            "devops": string[],
            "cloud": string[],
            "architecture": string[]
          },
          "allSkills": string[],
          "missingSkills": string[],
          "suggestions": string[],
          "insights": {
            "strengths": string[],
            "weaknesses": string[],
            "hiringRecommendation": string,
            "confidenceScore": number (0-100)
          }
        }

        Resume Text:
        "${resumeText}"
      `;

      const response = await genAI.models.generateContent({
        model,
        contents: [{ parts: [{ text: prompt }] }],
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            required: ["atsScore", "skills", "allSkills", "missingSkills", "suggestions", "insights"],
            properties: {
              atsScore: { type: Type.NUMBER },
              allSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
              missingSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
              suggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
              skills: {
                type: Type.OBJECT,
                required: ["languages", "frontend", "backend", "databases", "devops", "cloud", "architecture"],
                properties: {
                  languages: { type: Type.ARRAY, items: { type: Type.STRING } },
                  frontend: { type: Type.ARRAY, items: { type: Type.STRING } },
                  backend: { type: Type.ARRAY, items: { type: Type.STRING } },
                  databases: { type: Type.ARRAY, items: { type: Type.STRING } },
                  devops: { type: Type.ARRAY, items: { type: Type.STRING } },
                  cloud: { type: Type.ARRAY, items: { type: Type.STRING } },
                  architecture: { type: Type.ARRAY, items: { type: Type.STRING } },
                }
              },
              insights: {
                type: Type.OBJECT,
                required: ["strengths", "weaknesses", "hiringRecommendation", "confidenceScore"],
                properties: {
                  strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
                  weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
                  hiringRecommendation: { type: Type.STRING },
                  confidenceScore: { type: Type.NUMBER }
                }
              }
            }
          }
        }
      });

      const text = response.text || "{}";
      const data = JSON.parse(text) as ResumeAnalysis;
      setAnalysis(data);

      // Save to history
      const newHistoryItem: HistoryItem = {
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        role: targetRole || "General Technical Role",
        analysis: data
      };
      setHistory(prev => [newHistoryItem, ...prev]);

    } catch (err: any) {
      console.error("AI Analysis error:", err);
      setError(err.message || "Analysis failed. Please check your text and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteHistoryItem = (id: string, e: MouseEvent) => {
    e.stopPropagation();
    setHistory(prev => prev.filter(item => item.id !== id));
  };

  const loadFromHistory = (item: HistoryItem) => {
    setAnalysis(item.analysis);
    setActiveTab('scanner');
  };

  const reset = () => {
    setAnalysis(null);
    setError(null);
    setActiveTab('scanner');
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC] font-sans text-slate-900 overflow-hidden">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-slate-900 flex flex-col shrink-0 hidden md:flex">
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-white font-bold tracking-tight text-lg">ResuScan AI</span>
        </div>
        
        <nav className="flex-1 px-4 space-y-1">
          <div className="p-2 text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-4">Main Menu</div>
          <button 
            onClick={reset}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${activeTab === 'scanner' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            <LayoutDashboard className="w-4 h-4" />
            Scanner
          </button>
          <button 
            onClick={() => setActiveTab('history')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${activeTab === 'history' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            <History className="w-4 h-4" />
            History
          </button>
        </nav>

        <div className="mt-auto p-4">
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-2">API CREDITS</div>
            <div className="h-1.5 w-full bg-slate-700 rounded-full mb-2">
              <div className="h-full w-4/5 bg-blue-500 rounded-full"></div>
            </div>
            <div className="text-[10px] text-slate-300">120 / 150 requests remaining</div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 h-full overflow-y-auto">
        {/* Top Bar */}
        <header className="h-16 bg-white border-bottom border-slate-200 flex items-center justify-between px-8 shrink-0 sticky top-0 z-50">
          <div>
            <h1 className="text-lg font-bold text-slate-900">
              {activeTab === 'history' ? "Analysis History" : (analysis ? "Analysis Report" : "Resume Analyzer Dashboard")}
            </h1>
            <p className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold">
              {activeTab === 'history' ? "Past Audits" : (analysis ? "Detailed Intelligence" : "System Ready")}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {analysis && activeTab === 'scanner' && (
              <>
                <button onClick={() => window.print()} className="px-3 py-1.5 border border-slate-200 text-xs font-bold uppercase tracking-wider rounded-md hover:bg-slate-50 transition-colors">
                  Export
                </button>
                <button 
                  onClick={reset}
                  className="px-3 py-1.5 bg-slate-900 text-white text-xs font-bold uppercase tracking-wider rounded-md shadow-sm hover:bg-slate-800 transition-colors"
                >
                  New Scan
                </button>
              </>
            )}
          </div>
        </header>

        <div className="p-8">
          <AnimatePresence mode="wait">
            {activeTab === 'history' ? (
              <motion.div
                key="history"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="max-w-4xl mx-auto"
              >
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Audit Archive</h2>
                    <p className="text-sm text-slate-500">View and reload your previous candidate evaluations.</p>
                  </div>
                  {history.length > 0 && (
                    <button 
                      onClick={() => {
                        if (confirm("Clear all history?")) {
                          setHistory([]);
                        }
                      }}
                      className="flex items-center gap-2 text-xs font-bold text-rose-600 uppercase tracking-widest hover:text-rose-700"
                    >
                      <Trash2 className="w-4 h-4" />
                      Clear Archive
                    </button>
                  )}
                </div>

                {history.length === 0 ? (
                  <div className="text-center py-20 bg-white rounded-xl border border-dashed border-slate-200">
                    <History className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                    <h3 className="text-slate-900 font-bold">No history found</h3>
                    <p className="text-slate-400 text-sm">Completed analyses will appear here automatically.</p>
                    <button 
                      onClick={reset}
                      className="mt-6 px-6 py-2 bg-blue-600 text-white text-xs font-bold uppercase tracking-widest rounded-lg"
                    >
                      Run First Audit
                    </button>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {history.map((item) => (
                      <motion.div
                        key={item.id}
                        whileHover={{ y: -2 }}
                        onClick={() => loadFromHistory(item)}
                        className="p-5 bg-white rounded-xl border border-slate-200 flex items-center justify-between group cursor-pointer shadow-sm hover:shadow-md transition-all"
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                            item.analysis.atsScore >= 80 ? 'bg-emerald-50 text-emerald-600' :
                            item.analysis.atsScore >= 60 ? 'bg-amber-50 text-amber-600' :
                            'bg-rose-50 text-rose-600'
                          }`}>
                            <span className="text-lg font-bold">{item.analysis.atsScore}</span>
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-800 text-sm group-hover:text-blue-600 transition-colors">
                              {item.role}
                            </h4>
                            <div className="flex items-center gap-3 mt-1">
                              <span className="flex items-center gap-1 text-[10px] text-slate-400 font-medium lowercase">
                                <Clock className="w-3 h-3" />
                                {new Date(item.timestamp).toLocaleDateString()} at {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                              <span className="text-[10px] px-1.5 py-0.5 bg-slate-50 text-slate-400 font-bold uppercase border border-slate-100 rounded">
                                {item.analysis.allSkills.length} SKILLS
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                           <div className="hidden md:block text-right">
                              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Recommendation</div>
                              <div className="text-xs text-slate-600 font-medium truncate max-w-[150px]">
                                {item.analysis.insights.hiringRecommendation}
                              </div>
                           </div>
                           <button 
                             onClick={(e) => deleteHistoryItem(item.id, e)}
                             className="p-2 text-slate-300 hover:text-rose-600 transition-colors"
                           >
                             <Trash2 className="w-4 h-4" />
                           </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            ) : !analysis ? (
              <motion.div
                key="analyzer"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="max-w-4xl mx-auto"
              >
                <div className="mb-8">
                  <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-2">
                    Professional Resume Intelligence
                  </h2>
                  <p className="text-slate-500 max-w-2xl">
                    Get deep architectural analysis of your technical profile. Optimized for Modern Engineering roles.
                  </p>
                </div>

                {error && (
                  <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-xl flex items-center gap-3 text-rose-700 text-sm">
                    <AlertCircle className="w-5 h-5" />
                    {error}
                  </div>
                )}

                <ResumeForm onAnalyze={handleAnalyze} isLoading={isLoading} />
              </motion.div>
            ) : (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-12 gap-6"
              >
                {/* Row 1: Key Metrics */}
                <div className="col-span-12 lg:col-span-3 bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col items-center justify-center">
                  <AtsGauge score={analysis.atsScore} />
                </div>

                <div className="col-span-12 lg:col-span-9 bg-white rounded-xl shadow-sm border border-slate-200 p-6 relative overflow-hidden">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="font-bold text-slate-800 text-lg tracking-tight">Executive Intelligence Summary</h3>
                      <p className="text-xs text-slate-400">AI-driven candidate profile evaluation</p>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Confidence</span>
                      <span className="text-xl font-bold text-blue-600">{analysis.insights.confidenceScore}%</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Core Verdict</h4>
                      <p className="text-sm text-slate-700 leading-relaxed italic border-l-2 border-blue-500 pl-4 py-1">
                        "{analysis.insights.hiringRecommendation}"
                      </p>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Talent Assets</h4>
                        <div className="flex flex-wrap gap-1.5">
                          {analysis.allSkills.slice(0, 8).map((s, i) => (
                            <span key={i} className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-bold rounded uppercase">
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Row 2: Charts */}
                <div className="col-span-12 lg:col-span-5 bg-white rounded-xl shadow-sm border border-slate-200">
                  <SkillsRadar skills={analysis.skills} />
                </div>

                <div className="col-span-12 lg:col-span-7 bg-white rounded-xl shadow-sm border border-slate-200">
                  <CategoryBars skills={analysis.skills} />
                </div>

                {/* Row 3: Insights Full Width */}
                <div className="col-span-12">
                  <InsightSection insights={analysis.insights} suggestions={analysis.suggestions} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

