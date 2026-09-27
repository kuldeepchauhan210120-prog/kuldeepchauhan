import React from 'react';
import { X, Flame, Trophy, Calendar, CheckCircle2, Award, Zap } from 'lucide-react';
import { StreakState } from '../types';

interface StreakModalProps {
  isOpen: boolean;
  onClose: () => void;
  streak: StreakState;
}

export const StreakModal: React.FC<StreakModalProps> = ({
  isOpen,
  onClose,
  streak,
}) => {
  if (!isOpen) return null;

  // Generate 14-day calendar grid
  const recentDays = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const dayNum = d.getDate();
    const data = streak.completionHistory[dateStr];
    const isCompleted = data && data.completed > 0;
    const isToday = i === 0;

    recentDays.push({
      dateStr,
      dayNum,
      isCompleted,
      isToday,
      total: data?.total || 0,
      completed: data?.completed || 0,
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-3xl bg-slate-900 border border-slate-800 text-slate-100 shadow-2xl overflow-hidden p-6 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-500 flex items-center justify-center">
              <Flame className="w-6 h-6 fill-amber-500" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Daily Streak Momentum</h2>
              <p className="text-xs text-slate-400">Consistency compounds exponentially</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Big Counter Stat */}
        <div className="text-center p-6 rounded-2xl border border-amber-500/30 bg-gradient-to-b from-amber-500/10 to-transparent">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-500/20 text-amber-400 mb-3 animate-pulse">
            <Flame className="w-10 h-10 fill-amber-500 text-amber-500" />
          </div>
          <div className="text-5xl font-black tracking-tight text-white mb-1">
            {streak.currentStreak}
          </div>
          <p className="text-xs font-semibold uppercase tracking-wider text-amber-400">
            Day Streak Active
          </p>
          <p className="text-xs text-slate-400 mt-2 max-w-xs mx-auto">
            You've locked in your top priorities for {streak.currentStreak} consecutive days.
          </p>
        </div>

        {/* Milestone Comparison */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/60">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>Personal Best</span>
            </div>
            <div className="text-xl font-bold text-slate-100">
              {streak.longestStreak} Days
            </div>
          </div>

          <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/60">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
              <Zap className="w-3.5 h-3.5 text-emerald-400" />
              <span>Next Milestone</span>
            </div>
            <div className="text-xl font-bold text-slate-100">
              {streak.currentStreak < 7 ? '7 Days' : streak.currentStreak < 14 ? '14 Days' : '30 Days'}
            </div>
          </div>
        </div>

        {/* Recent 14-day history dots */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
            Last 14 Days Activity
          </h4>
          <div className="grid grid-cols-7 gap-2 text-center">
            {recentDays.map((d) => (
              <div
                key={d.dateStr}
                title={`${d.dateStr}: ${d.completed}/${d.total} tasks completed`}
                className={`py-2 rounded-xl flex flex-col items-center justify-center transition border ${
                  d.isToday
                    ? 'border-amber-500 bg-amber-500/15'
                    : d.isCompleted
                    ? 'border-emerald-500/40 bg-emerald-500/20 text-emerald-300'
                    : 'border-slate-800 bg-slate-950/40 text-slate-500'
                }`}
              >
                <span className="text-[10px] font-mono">{d.dayNum}</span>
                <span className="text-xs mt-0.5">
                  {d.isCompleted ? '✓' : '·'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Close */}
        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
        >
          Keep the Momentum Going
        </button>

      </div>
    </div>
  );
};
