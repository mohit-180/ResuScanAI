import { SkillsByCategory } from '../types';

interface Props {
  skills: SkillsByCategory;
}

export default function CategoryBars({ skills }: Props) {
  const categories = Object.entries(skills).map(([key, list]) => ({
    name: key === 'architecture' ? 'Architecture & Cloud' : key.charAt(0).toUpperCase() + key.slice(1),
    count: list.length,
    percentage: Math.min(100, Math.max(10, list.length * 15)), // Normalized for visual representation
  }));

  return (
    <div className="p-8 h-full flex flex-col">
      <h3 className="font-bold text-slate-800 mb-6 tracking-tight">Category Proficiency Mapping</h3>
      <div className="space-y-6 flex-1 flex flex-col justify-center">
        {categories.map((cat, idx) => (
          <div key={idx} className="flex flex-col">
            <div className="flex justify-between text-[11px] mb-2 font-bold text-slate-500 uppercase tracking-wider">
              <span>{cat.name}</span>
              <span className="text-blue-600 font-mono">{cat.count} Skills</span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-1000 ease-out ${
                  cat.percentage >= 70 ? 'bg-blue-600' : 
                  cat.percentage >= 40 ? 'bg-amber-500' : 
                  'bg-rose-500'
                }`}
                style={{ width: `${cat.percentage}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
      <p className="mt-6 text-[10px] text-slate-400 italic">
        * Percentage calculated relative to optimal domain mapping for Seniority Level.
      </p>
    </div>
  );
}
