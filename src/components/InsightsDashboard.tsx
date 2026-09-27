import React from 'react';
import { Flame, Trophy, CheckCircle, TrendingUp, Heart, BookOpen, Calendar, ArrowRight, Sparkles } from 'lucide-react';
import { StreakState, ThemeConfig, UserProfile } from '../types';
import { Quote } from '../data/quotes';

interface InsightsDashboardProps {
  streak: StreakState;
  theme: ThemeConfig;
  user: UserProfile;
  favoriteQuotes: Quote[];
  onOpenArchive: (filterFavorites?: boolean) => void;
  onOpenStreakModal: () => void;
}

export const InsightsDashboard: React.FC<InsightsDashboardProps> = ({
  streak,
  theme,
  user,
  favoriteQuotes,
  onOpenArchive,
  onOpenStreakModal,
}) => {
  // Generate the last 7 days metrics
  const last7Days = [];
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  let totalTasksLast7 = 0;
  let totalCompletedLast7 = 0;

  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const dayLabel = daysOfWeek[d.getDay()];
    const isToday = i === 0;

    const data = streak.completionHistory[dateStr] || { total: 0, completed: 0, priorityCompleted: 0 };
    const pct = data.total > 0 ? Math.round((data.completed / data.total) * 100) : 0;

    totalTasksLast7 += data.total;
    totalCompletedLast7 += data.completed;

    last7Days.push({
      date: dateStr,
      dayLabel,
      isToday,
      total: data.total,
      completed: data.completed,
      percentage: pct,
    });
  }

  const weeklyAverage = totalTasksLast7 > 0
    ? Math.round((totalCompletedLast7 / totalTasksLast7) * 100)
    : 85;

  return (
    <section className="py-8 sm:py-12 border-t border-inherit/40 transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Section Heading */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Long-Term Insights</h2>
            <p className="text-xs sm:text-sm opacity-70 mt-0.5">
              Review your consistency, task completion velocity, and collected wisdom.
            </p>
          </div>

          <button
            onClick={onOpenStreakModal}
            className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/30 hover:bg-amber-500/20 transition"
          >
            <Flame className="w-4 h-4 fill-amber-500" />
            <span>Streak Details</span>
          </button>
        </div>

        {/* Top 3 Metric Tiles */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mb-8">
          {/* Current Streak */}
          <div className={`rounded-2xl p-4 sm:p-5 border ${theme.cardBackground}`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider opacity-60">Daily Streak</span>
              <Flame className="w-5 h-5 text-amber-500 fill-amber-500" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold tracking-tight">{streak.currentStreak}</span>
              <span className="text-xs opacity-70">consecutive days</span>
            </div>
            <p className="text-[11px] opacity-60 mt-1.5">
              Personal best: {streak.longestStreak} days
            </p>
          </div>

          {/* 7-Day Completion Rate */}
          <div className={`rounded-2xl p-4 sm:p-5 border ${theme.cardBackground}`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider opacity-60">7-Day Completion</span>
              <TrendingUp className="w-5 h-5 text-emerald-500" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold tracking-tight">{weeklyAverage}%</span>
              <span className="text-xs opacity-70">average rate</span>
            </div>
            <p className="text-[11px] opacity-60 mt-1.5">
              {totalCompletedLast7} of {totalTasksLast7} tasks closed
            </p>
          </div>

          {/* Favorited Wisdom */}
          <div className={`rounded-2xl p-4 sm:p-5 border ${theme.cardBackground}`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider opacity-60">Favorited Thoughts</span>
              <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold tracking-tight">{user.favoriteQuoteIds.length}</span>
              <span className="text-xs opacity-70">saved quotes</span>
            </div>
            <button
              onClick={() => onOpenArchive(true)}
              className="text-[11px] text-amber-500 hover:text-amber-400 font-medium mt-1.5 flex items-center gap-1"
            >
              <span>View favorites</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* SECTION 3A: Weekly Progress Bar Chart */}
        <div className={`rounded-2xl p-6 border mb-8 ${theme.cardBackground}`}>
          <div className="flex flex-wrap items-center justify-between gap-2 mb-6">
            <div>
              <h3 className="text-base font-bold">Weekly Task Completion (Last 7 Days)</h3>
              <p className="text-xs opacity-60">Daily percentage of committed priorities completed</p>
            </div>
            <div className="flex items-center gap-3 text-xs opacity-70">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-amber-500 inline-block" />
                <span>Today</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-emerald-500/80 inline-block" />
                <span>Past Days</span>
              </span>
            </div>
          </div>

          {/* Bar Chart Visualization */}
          <div className="grid grid-cols-7 gap-2 sm:gap-4 items-end h-44 pt-6 px-1">
            {last7Days.map((day) => {
              const heightPct = Math.max(day.percentage, 8); // minimum visual stub

              return (
                <div key={day.date} className="flex flex-col items-center h-full justify-end group">
                  {/* Percentage tooltip / label */}
                  <span className="text-[11px] font-semibold opacity-70 group-hover:opacity-100 mb-1.5 transition">
                    {day.total > 0 ? `${day.percentage}%` : '—'}
                  </span>

                  {/* Vertical bar container */}
                  <div className="w-full max-w-[42px] bg-slate-500/10 rounded-xl h-28 relative flex items-end p-1 overflow-hidden">
                    <div
                      style={{ height: `${heightPct}%` }}
                      className={`w-full rounded-lg transition-all duration-500 ${
                        day.isToday
                          ? 'bg-amber-500 shadow-md shadow-amber-500/30'
                          : day.percentage >= 80
                          ? 'bg-emerald-500'
                          : day.percentage >= 50
                          ? 'bg-emerald-600/70'
                          : 'bg-slate-500/40'
                      }`}
                    />
                  </div>

                  {/* Day label */}
                  <span
                    className={`mt-2 text-xs font-medium ${
                      day.isToday ? 'font-bold text-amber-500' : 'opacity-60'
                    }`}
                  >
                    {day.dayLabel}
                  </span>
                  <span className="text-[10px] opacity-40">
                    {day.completed}/{day.total}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* SECTION 3B: The "Quote Archive" Hub */}
        <div className={`rounded-2xl p-6 border ${theme.cardBackground}`}>
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sky-500/15 text-sky-400 flex items-center justify-center">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold">The 365 Quote Archive</h3>
                <p className="text-xs opacity-60">Revisit past daily thoughts and explore your favorited reflections</p>
              </div>
            </div>

            <button
              onClick={() => onOpenArchive(false)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition active:scale-95 shadow-sm"
            >
              <span>Explore All 365 Quotes</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Quick teaser of favorited quotes */}
          {favoriteQuotes.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 pt-4 border-t border-inherit/40">
              {favoriteQuotes.slice(0, 2).map((fq) => (
                <div
                  key={fq.id}
                  onClick={() => onOpenArchive(true)}
                  className="p-3.5 rounded-xl border border-inherit/60 hover:border-amber-500/50 bg-black/5 cursor-pointer transition text-left group"
                >
                  <div className="flex items-center justify-between text-[11px] opacity-60 mb-1.5">
                    <span>Day {fq.id}</span>
                    <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                  </div>
                  <p className="font-serif-quote text-xs sm:text-sm line-clamp-2 italic group-hover:text-amber-300 transition">
                    “{fq.quote}”
                  </p>
                  <span className="text-[11px] font-semibold opacity-75 mt-2 block">
                    — {fq.author}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs opacity-50 pt-2 italic">
              Tap the heart icon on any daily quote to build your personal treasury of inspiration.
            </p>
          )}
        </div>

      </div>
    </section>
  );
};
