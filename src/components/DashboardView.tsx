import React, { useState } from 'react';
import { HabitCard } from './HabitCard';

export default function DashboardView() {
  // Sample initial layout mock data array matching production structures
  const [habits, setHabits] = useState([
    { id: '1', name: 'Morning Meditation', streak: 4, daysTarget: 5, completedDays: 2, category: 'Mindfulness' },
    { id: '2', name: 'Weight Training', streak: 12, daysTarget: 4, completedDays: 3, category: 'Health' },
    { id: '3', name: 'Read Technical Books', streak: 0, daysTarget: 7, completedDays: 0, category: 'Productivity' }
  ]);

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans">
      {/* Top Application Header bar block */}
      <nav className="border-b border-slate-900 bg-slate-900/40 backdrop-blur-md sticky top-0 z-50 px-6 py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="h-9 w-9 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center font-bold text-lg shadow-lg shadow-indigo-500/20">
              G
            </div>
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              Gentle Momentum
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-xs font-semibold px-3 py-1 bg-slate-800 rounded-full border border-slate-700 text-slate-300">
              ⚡ Live Workspace
            </span>
          </div>
        </div>
      </nav>

      {/* Main Metric Banner Section */}
      <main className="max-w-6xl mx-auto p-6 md:p-8 space-y-8">
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950/20 to-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-1">
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">Welcome Back, Builder</h2>
            <p className="text-sm text-slate-400">Consistency turns tiny efforts into massive achievements.</p>
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            <div className="flex-1 md:flex-initial bg-slate-900/60 border border-slate-800 px-5 py-3 rounded-2xl">
              <div className="text-xs text-slate-500 font-semibold uppercase">Total Streaks</div>
              <div className="text-2xl font-bold text-amber-400">16 Days 🔥</div>
            </div>
            <div className="flex-1 md:flex-initial bg-slate-900/60 border border-slate-800 px-5 py-3 rounded-2xl">
              <div className="text-xs text-slate-500 font-semibold uppercase">Completion Rate</div>
              <div className="text-2xl font-bold text-emerald-400">72% 📈</div>
            </div>
          </div>
        </div>

        {/* Dynamic Habit Grid Workspace */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-300 tracking-tight">Active Core Habits</h3>
            <button className="text-xs font-bold text-indigo-400 hover:text-indigo-300 transition px-3 py-1.5 rounded-lg hover:bg-indigo-500/5 border border-transparent hover:border-indigo-500/20">
              + Custom Habit
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {habits.map((habit) => (
              <HabitCard
                key={habit.id}
                id={habit.id}
                name={habit.name}
                streak={habit.streak}
                daysTarget={habit.daysTarget}
                completedDays={habit.completedDays}
                category={habit.category}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
