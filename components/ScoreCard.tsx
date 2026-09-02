import React from 'react';
import { RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis } from 'recharts';

interface ScoreCardProps {
  score: number;
  label: string;
  color: string;
}

const ScoreCard: React.FC<ScoreCardProps> = ({ score, label, color }) => {
  const data = [{ name: label, value: score, fill: color }];

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 transition-colors">
      <div className="h-32 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart 
            innerRadius="70%" 
            outerRadius="100%" 
            barSize={10} 
            data={data} 
            startAngle={90} 
            endAngle={-270}
          >
            <PolarAngleAxis
              type="number"
              domain={[0, 100]}
              angleAxisId={0}
              tick={false}
            />
            <RadialBar
              background={{ fill: '#f1f5f9' }}
              dataKey="value"
              cornerRadius={10}
            />
          </RadialBarChart>
        </ResponsiveContainer>
      </div>
      <div className="absolute mt-[-3rem]">
        <span className="text-2xl font-bold text-slate-800 dark:text-white">{score}</span>
      </div>
      <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-2">{label}</p>
    </div>
  );
};

export default ScoreCard;