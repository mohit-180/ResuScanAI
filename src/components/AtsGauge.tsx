import { motion } from "motion/react";

interface Props {
  score: number;
}

export default function AtsGauge({ score }: Props) {
  const getColor = (s: number) => {
    if (s >= 80) return "text-emerald-500";
    if (s >= 60) return "text-amber-500";
    return "text-rose-500";
  };

  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center p-2 text-center">
      <div className="relative w-32 h-32 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="64"
            cy="64"
            r="58"
            stroke="currentColor"
            strokeWidth="10"
            fill="transparent"
            className="text-slate-100"
          />
          <motion.circle
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            cx="64"
            cy="64"
            r="58"
            stroke="currentColor"
            strokeWidth="10"
            fill="transparent"
            strokeDasharray={circumference}
            className={`${getColor(score)} transition-colors duration-1000`}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <span className="text-3xl font-bold text-slate-900 leading-none">{score}</span>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight block mt-1">ATS Score</span>
          </motion.div>
        </div>
      </div>
      <p className="mt-4 text-sm font-medium text-slate-600">
        {score >= 80 ? "Highly Recommended" : score >= 60 ? "Moderate Match" : "Low Alignment"}
      </p>
      <div className={`mt-2 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full ${
        score >= 80 ? "bg-emerald-50 text-emerald-600" : 
        score >= 60 ? "bg-amber-50 text-amber-600" : 
        "bg-rose-50 text-rose-600"
      }`}>
        {score >= 80 ? "Top 5% Candidate" : score >= 60 ? "Quality Talent" : "Needs Review"}
      </div>
    </div>
  );
}
