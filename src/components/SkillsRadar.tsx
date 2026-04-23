import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import { SkillsByCategory } from '../types';

interface Props {
  skills: SkillsByCategory;
}

export default function SkillsRadar({ skills }: Props) {
  const data = [
    { subject: 'Languages', A: skills.languages.length * 10, fullMark: 100 },
    { subject: 'Frontend', A: skills.frontend.length * 10, fullMark: 100 },
    { subject: 'Backend', A: skills.backend.length * 10, fullMark: 100 },
    { subject: 'Databases', A: skills.databases.length * 10, fullMark: 100 },
    { subject: 'DevOps', A: skills.devops.length * 10, fullMark: 100 },
    { subject: 'Cloud', A: skills.cloud.length * 10, fullMark: 100 },
    { subject: 'Arch', A: skills.architecture.length * 10, fullMark: 100 },
  ];

  return (
    <div className="p-8 h-full flex flex-col items-center">
      <h3 className="font-bold text-slate-800 self-start mb-6 tracking-tight">Domain Skill Distribution</h3>
      <div className="flex-1 w-full h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
            <PolarGrid stroke="#cbd5e1" strokeWidth={0.5} />
            <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10, fontWeight: '700' }} />
            <Radar
              name="Skills"
              dataKey="A"
              stroke="#2563eb"
              strokeWidth={1.5}
              fill="#3b82f6"
              fillOpacity={0.1}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
