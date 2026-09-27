import React, { useState } from 'react';
import { Clock, Plus, Check, Play, AlertCircle, ChevronRight, Calendar, Sparkles } from 'lucide-react';
import { Task, ThemeConfig } from '../types';
import { formatTime12Hour, getCurrentTimeHHMM, timeStringToMinutes, isTaskCurrentFocus, isTaskOverdue } from '../utils/time';

interface DailyTimelineProps {
  tasks: Task[];
  theme: ThemeConfig;
  onSelectTaskForTimer: (task: Task) => void;
  onToggleTask: (taskId: string) => void;
  onAssignTaskTime: (taskId: string, startTime: string, endTime: string) => void;
  onQuickCreateFixedTask: (text: string, startTime: string) => void;
}

export const DailyTimeline: React.FC<DailyTimelineProps> = ({
  tasks,
  theme,
  onSelectTaskForTimer,
  onToggleTask,
  onAssignTaskTime,
  onQuickCreateFixedTask,
}) => {
  const [selectedSlotHour, setSelectedSlotHour] = useState<number | null>(null);
  const [newAppointmentTitle, setNewAppointmentTitle] = useState('');
  const [selectedTaskToAssign, setSelectedTaskToAssign] = useState<string>('');

  const currentTimeStr = getCurrentTimeHHMM();
  const currentMinutes = timeStringToMinutes(currentTimeStr);

  // Hourly slots: from 6:00 AM (06:00) to 10:00 PM (22:00)
  const hours = Array.from({ length: 17 }, (_, i) => i + 6); // 6 to 22

  // Unscheduled tasks that can be mapped to timeline
  const unassignedTasks = tasks.filter(t => !t.completed && (!t.startTime || t.timeType !== 'fixed'));

  // Calculate current time line percentage across the 6:00 to 22:00 timeline (16 hours total = 960 mins)
  const startDayMinutes = 6 * 60; // 360
  const endDayMinutes = 22 * 60;  // 1320
  const totalDaySpan = endDayMinutes - startDayMinutes;
  const currentProgress = Math.max(0, Math.min(100, ((currentMinutes - startDayMinutes) / totalDaySpan) * 100));

  const handleCreateAppointment = (hour: number) => {
    const startTime = `${String(hour).padStart(2, '0')}:00`;
    if (selectedTaskToAssign) {
      const endHour = hour + 1;
      const endTime = `${String(endHour).padStart(2, '0')}:00`;
      onAssignTaskTime(selectedTaskToAssign, startTime, endTime);
      setSelectedTaskToAssign('');
      setSelectedSlotHour(null);
    } else if (newAppointmentTitle.trim()) {
      onQuickCreateFixedTask(newAppointmentTitle.trim(), startTime);
      setNewAppointmentTitle('');
      setSelectedSlotHour(null);
    }
  };

  return (
    <div className={`rounded-3xl p-5 sm:p-7 border transition-all ${theme.cardBackground}`}>
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base sm:text-lg font-bold">Daily Time-Blocking Schedule</h3>
            <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-500 border border-amber-500/20">
              6:00 AM – 10:00 PM
            </span>
          </div>
          <p className="text-xs opacity-60 mt-0.5">
            Map your Top 3 Priorities and appointments into protected focus blocks throughout your day.
          </p>
        </div>

        {/* Current Time Badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-inherit bg-black/10 text-xs font-semibold">
          <Clock className="w-3.5 h-3.5 text-amber-400" />
          <span>Now: {formatTime12Hour(currentTimeStr)}</span>
        </div>
      </div>

      {/* Hourly Timeline Grid */}
      <div className="relative border-t border-slate-700/40 pt-2 space-y-1">
        
        {/* Real-time Indicator Line if current time is within 6am - 10pm */}
        {currentMinutes >= startDayMinutes && currentMinutes <= endDayMinutes && (
          <div
            className="absolute left-0 right-0 z-20 pointer-events-none flex items-center"
            style={{
              top: `${Math.round(((currentMinutes - startDayMinutes) / (17 * 60)) * 100)}%`,
            }}
          >
            <div className="w-3 h-3 rounded-full bg-amber-500 -ml-1.5 shadow-md shadow-amber-500/50" />
            <div className="flex-1 h-[2px] bg-amber-500 shadow-sm" />
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-500 text-slate-950 ml-1">
              Current Time
            </span>
          </div>
        )}

        {hours.map((hour) => {
          const hourStartStr = `${String(hour).padStart(2, '0')}:00`;
          const hourEndStr = `${String(hour + 1).padStart(2, '0')}:00`;
          const isSlotCurrent = currentMinutes >= hour * 60 && currentMinutes < (hour + 1) * 60;

          // Find tasks that start in this hour or span across it
          const matchingTasks = tasks.filter((t) => {
            if (t.timeType === 'fixed' && t.startTime) {
              const startH = parseInt(t.startTime.split(':')[0], 10);
              return startH === hour;
            }
            return false;
          });

          const isSlotOpen = selectedSlotHour === hour;

          return (
            <div
              key={hour}
              className={`group relative rounded-xl border p-2.5 transition-all ${
                isSlotCurrent
                  ? 'border-amber-500/50 bg-amber-500/5 ring-1 ring-amber-500/20'
                  : 'border-transparent hover:border-slate-700/40 hover:bg-slate-500/5'
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Hour Label */}
                <div className="w-16 flex-shrink-0 text-right">
                  <span
                    className={`text-xs font-mono font-semibold ${
                      isSlotCurrent ? 'text-amber-400 font-bold' : 'opacity-60'
                    }`}
                  >
                    {formatTime12Hour(hourStartStr)}
                  </span>
                </div>

                {/* Slot Content */}
                <div className="flex-1 min-w-0">
                  {matchingTasks.length > 0 ? (
                    <div className="space-y-2">
                      {matchingTasks.map((t) => {
                        const isFocus = isTaskCurrentFocus(t);
                        const { isOverdue } = isTaskOverdue(t);

                        return (
                          <div
                            key={t.id}
                            className={`flex items-center justify-between p-2.5 rounded-xl border transition-all ${
                              t.completed
                                ? 'bg-emerald-950/20 border-emerald-800/40 opacity-60 text-emerald-200'
                                : isFocus
                                ? 'bg-amber-500/20 border-amber-500 text-slate-100 shadow-md shadow-amber-500/20 ring-1 ring-amber-500'
                                : isOverdue
                                ? 'bg-rose-950/20 border-rose-800/40 text-rose-200'
                                : 'bg-slate-800/70 border-slate-700/70 text-slate-100'
                            }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0 flex-1">
                              <button
                                onClick={() => onToggleTask(t.id)}
                                className={`w-5 h-5 rounded-md border flex items-center justify-center flex-shrink-0 transition ${
                                  t.completed
                                    ? 'bg-emerald-500 border-emerald-500 text-slate-950'
                                    : 'border-slate-400 hover:border-amber-400'
                                }`}
                              >
                                {t.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                              </button>

                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                  {t.isPriority && (
                                    <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                                      Priority #{t.prioritySlot}
                                    </span>
                                  )}
                                  <span className="text-[11px] font-mono opacity-60">
                                    {formatTime12Hour(t.startTime)} – {formatTime12Hour(t.endTime)}
                                  </span>
                                  {isFocus && (
                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 animate-pulse">
                                      ⚡ CURRENT FOCUS
                                    </span>
                                  )}
                                </div>
                                <p className={`text-xs sm:text-sm font-medium truncate mt-0.5 ${t.completed ? 'line-through' : ''}`}>
                                  {t.text}
                                </p>
                              </div>
                            </div>

                            {/* Start Timer Play Button */}
                            {!t.completed && (
                              <button
                                onClick={() => onSelectTaskForTimer(t)}
                                className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-slate-950 transition active:scale-95 ml-2"
                                title="Start Focus Timer for this Block"
                              >
                                <Play className="w-3 h-3 fill-current" />
                                <span>Focus</span>
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : isSlotOpen ? (
                    /* Inline Slot Scheduling Form */
                    <div className="p-3 rounded-xl border border-amber-500/40 bg-slate-900/90 space-y-3">
                      <div className="flex items-center justify-between text-xs font-semibold text-amber-400">
                        <span>Schedule at {formatTime12Hour(hourStartStr)}</span>
                        <button
                          onClick={() => setSelectedSlotHour(null)}
                          className="text-slate-400 hover:text-white"
                        >
                          Cancel
                        </button>
                      </div>

                      {/* Map existing unscheduled task */}
                      {unassignedTasks.length > 0 && (
                        <div>
                          <label className="block text-[11px] opacity-70 mb-1">
                            Assign an existing priority or task:
                          </label>
                          <select
                            value={selectedTaskToAssign}
                            onChange={(e) => setSelectedTaskToAssign(e.target.value)}
                            className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-700 bg-slate-800 text-slate-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
                          >
                            <option value="">-- Choose task to map to this hour --</option>
                            {unassignedTasks.map((t) => (
                              <option key={t.id} value={t.id}>
                                {t.isPriority ? `[Priority #${t.prioritySlot}] ` : ''}{t.text}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}

                      {/* Or create a new fixed timestamp appointment */}
                      <div>
                        <label className="block text-[11px] opacity-70 mb-1">
                          Or create a new fixed appointment:
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Design review meeting, deep work block..."
                          value={newAppointmentTitle}
                          onChange={(e) => setNewAppointmentTitle(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleCreateAppointment(hour)}
                          className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-700 bg-slate-800 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                        />
                      </div>

                      <div className="flex justify-end">
                        <button
                          onClick={() => handleCreateAppointment(hour)}
                          className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition active:scale-95"
                        >
                          Lock in {formatTime12Hour(hourStartStr)}
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Empty hour slot */
                    <button
                      onClick={() => {
                        setSelectedSlotHour(hour);
                        setNewAppointmentTitle('');
                        setSelectedTaskToAssign('');
                      }}
                      className="w-full text-left py-1 text-xs opacity-30 hover:opacity-100 hover:text-amber-400 flex items-center justify-between transition group-hover:opacity-60"
                    >
                      <span>+ Click to time-block this hour</span>
                      <Plus className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
