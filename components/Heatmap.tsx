import React from 'react';
import { HEATMAP_DATA } from '../constants';

const Heatmap: React.FC = () => {
  const getLevelColor = (level: number) => {
    switch (level) {
      case 1: return 'bg-emerald-900';
      case 2: return 'bg-emerald-700';
      case 3: return 'bg-emerald-500';
      case 4: return 'bg-emerald-400';
      default: return 'bg-zinc-800';
    }
  };

  return (
    <div className="w-full overflow-x-auto pb-2">
      <div className="flex gap-1 min-w-max">
         {/* Simple visualization: 52 columns of 7 days. simplified logic for demo */}
        {Array.from({ length: 52 }).map((_, weekIndex) => (
          <div key={weekIndex} className="flex flex-col gap-1">
            {Array.from({ length: 7 }).map((_, dayIndex) => {
              const dataIndex = weekIndex * 7 + dayIndex;
              const level = HEATMAP_DATA[dataIndex]?.level || 0;
              return (
                <div
                  key={dayIndex}
                  className={`w-3 h-3 rounded-sm ${getLevelColor(level)} transition-colors duration-200 hover:border hover:border-white/50 cursor-pointer`}
                  title={`Productivity Level: ${level}`}
                />
              );
            })}
          </div>
        ))}
      </div>
      <div className="flex justify-end items-center gap-2 mt-2 text-xs text-muted">
        <span>Less</span>
        <div className="w-3 h-3 bg-zinc-800 rounded-sm"></div>
        <div className="w-3 h-3 bg-emerald-900 rounded-sm"></div>
        <div className="w-3 h-3 bg-emerald-700 rounded-sm"></div>
        <div className="w-3 h-3 bg-emerald-500 rounded-sm"></div>
        <div className="w-3 h-3 bg-emerald-400 rounded-sm"></div>
        <span>More</span>
      </div>
    </div>
  );
};

export default Heatmap;