import { Lightbulb } from "lucide-react";
import { motion } from "motion/react";
import { AnalysisInsights } from "../types";

interface Props {
  insights: AnalysisInsights;
  suggestions: string[];
}

export default function InsightSection({ insights, suggestions }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pb-20">
      {/* Missing Skills */}
      <motion.div
        whileHover={{ y: -2 }}
        className="col-span-12 md:col-span-5 p-6 bg-white rounded-xl shadow-sm border border-slate-200"
      >
        <h3 className="font-bold text-slate-800 mb-4 tracking-tight">Missing Critical Skills</h3>
        <div className="flex flex-wrap gap-2">
          {insights.weaknesses.map((w, i) => (
            <span key={i} className="px-3 py-1.5 bg-rose-50 border border-rose-100 text-rose-700 text-[10px] font-bold rounded-lg uppercase tracking-wider italic">
               {w}
            </span>
          ))}
          {insights.weaknesses.length === 0 && (
            <span className="text-[11px] text-slate-400">Competitive match! No critical gaps identified.</span>
          )}
        </div>
        <div className="mt-6 pt-4 border-t border-slate-100">
          <p className="text-[11px] text-slate-500 leading-relaxed italic">
            <strong className="text-slate-700">Audit Note:</strong> These technologies were flagged as deficient relative to current industry benchmarks for the target seniority level.
          </p>
        </div>
      </motion.div>

      {/* AI Recommendations */}
      <motion.div
        whileHover={{ y: -2 }}
        className="col-span-12 md:col-span-7 bg-slate-900 rounded-xl shadow-lg p-6 border border-slate-800"
      >
        <h3 className="font-bold text-white mb-4 flex items-center gap-2 tracking-tight">
          <div className="p-1 bg-blue-600 rounded">
            <Lightbulb className="w-3 h-3 text-white" />
          </div>
          AI-Driven Recommendations
        </h3>
        <div className="space-y-4">
          {suggestions.map((s, i) => (
            <div key={i} className="flex gap-4 group">
              <span className="text-blue-500 font-mono text-sm opacity-50 group-hover:opacity-100 transition-opacity">
                0{i + 1}.
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                {s}
              </p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
