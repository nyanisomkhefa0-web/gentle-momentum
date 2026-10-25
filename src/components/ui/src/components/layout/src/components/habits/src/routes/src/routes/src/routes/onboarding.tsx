import React, { useState } from 'react';

interface HabitCardProps {
  id: string;
  name: string;
  streak: number;
  daysTarget: number;
  completedDays: number;
  category: string;
}

export const HabitCard: React.FC<HabitCardProps> = ({
  name,
  streak: initialStreak,
  daysTarget,
  completedDays: initialCompleted,
  category,
}) => {
  const [completed, setCompleted] = useState(false);
  const [streak, setStreak] = useState(initialStreak);

  const handleCheckIn = () => {
    if (!completed) {
      setCompleted(true);
      setStreak(prev => prev + 1);
    } else {
      setCompleted(false);
      setStreak(prev => Math.max(0, prev - 1));
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl max-w-sm w-full transition-all hover:border-indigo-500/50">
      <div className="flex justify-between items-start mb-4">
        <div>
          <span className="text-xs font-semibold tracking-wider text-indigo-400 uppercase bg-indigo-500/10 px-2.5 py-1 rounded-full">
            {category}
          </span>
          <h3 className="text-xl font-bold text-white mt-2 tracking-tight">{name}</h3>
        </div>
        
        {/* Streak Counter */}
        <div className="flex items-center space-x-1.5 bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/20">
          <span className="text-xl">🔥</span>
          <span className="text-sm font-bold text-amber-400">{streak} day streak</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2 mb-6">
        <div className="flex justify-between text-xs font-medium text-slate-400">
          <span>Weekly Progress</span>
          <span>{completed ? initialCompleted + 1 : initialCompleted} / {daysTarget} days</span>
        </div>
        <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
          <div 
            className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full transition-all duration-500"
            style={{ width: `${((completed ? initialCompleted + 1 : initialCompleted) / daysTarget) * 100}%` }}
          />
        </div>
      </div>

      {/* Action Button */}
      <button
        onClick={handleCheckIn}
        className={`w-full py-3 px-4 rounded-xl font-semibold tracking-wide transition-all duration-200 transform active:scale-[0.98] ${
          completed
            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30'
            : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-600/20'
        }`}
      >
        {completed ? (
          <span className="flex items-center justify-center space-x-2">
            <span>✓</span> <span>Completed Today</span>
          </span>
        ) : (
          'Mark as Done Today'
        )}
      </button>
    </div>
  );
};
