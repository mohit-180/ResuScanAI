import { useState, FormEvent } from "react";
import { FileText, Send, Loader2 } from "lucide-react";
import { motion } from "motion/react";

interface Props {
  onAnalyze: (text: string, role: string) => void;
  isLoading: boolean;
}

export default function ResumeForm({ onAnalyze, isLoading }: Props) {
  const [text, setText] = useState("");
  const [role, setRole] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onAnalyze(text, role);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"
    >
      <div className="p-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-blue-50 rounded-lg">
            <FileText className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800 tracking-tight">Source Data Entry</h2>
            <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest">Input technical profile for audit</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-1">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                Target Objective
              </label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="Senior Engineer..."
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-hidden text-sm font-medium"
              />
            </div>

            <div className="md:col-span-3">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                Document Content (Resume Text)
              </label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                required
                rows={12}
                placeholder="Paste the technical content of the CV here..."
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-hidden resize-none font-sans text-sm leading-relaxed"
              />
            </div>
          </div>

          <div className="flex items-center justify-end pt-4 border-t border-slate-100">
            <button
              type="submit"
              disabled={isLoading || !text.trim()}
              className="px-8 py-3 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white font-bold uppercase tracking-widest text-[11px] rounded-lg flex items-center justify-center gap-3 transition-all shadow-lg active:scale-95"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
                  Processing Intelligence...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 text-blue-400" />
                  Initiate Analysis Audit
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}
