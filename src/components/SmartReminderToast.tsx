import React, { useState, useEffect } from 'react';
import { Bell, Sparkles, Clock, Play, ArrowRight, X, AlertTriangle, RotateCcw } from 'lucide-react';
import { Task } from '../types';
import { getCurrentTimeHHMM, timeStringToMinutes, formatTime12Hour } from '../utils/time';

interface SmartReminderToastProps {
  tasks: Task[];
  onStartTimer: (task: Task) => void;
  onRescheduleTask: (taskId: string, newStartTime: string) => void;
}

export const SmartReminderToast: React.FC<SmartReminderToastProps> = ({
  tasks,
  onStartTimer,
  onRescheduleTask,
}) => {
  const [approachingTask, setApproachingTask] = useState<{ task: Task; minutesLeft: number } | null>(null);
  const [overdueTask, setOverdueTask] = useState<{ task: Task; overdueMins: number } | null>(null);
  const [dismissedTaskIds, setDismissedTaskIds] = useState<string[]>([]);
  const [showRescheduleMenu, setShowRescheduleMenu] = useState(false);

  // Micro-motivation bursts tailored for upcoming focus sessions
  const MOTIVATION_BURSTS = [
    "Deep breaths, you've got this!",
    "Clear your desk, protect your momentum.",
    "One deliberate step forward makes the entire day.",
    "Breathe in calm, breathe out distraction.",
    "Turn off notifications and enter flow state.",
  ];

  const [notifiedTaskIds, setNotifiedTaskIds] = useState<string[]>([]);

  useEffect(() => {
    const checkSchedule = () => {
      const current = timeStringToMinutes(getCurrentTimeHHMM());

      // 1. Check for approaching tasks (within next 15 minutes)
      let foundApproaching: { task: Task; minutesLeft: number } | null = null;
      let foundOverdue: { task: Task; overdueMins: number } | null = null;

      for (const t of tasks) {
        if (t.completed || dismissedTaskIds.includes(t.id)) continue;

        // Fixed tasks
        if (t.timeType === 'fixed' && t.startTime) {
          const start = timeStringToMinutes(t.startTime);
          const diff = start - current;
          if (diff > 0 && diff <= 15) {
            foundApproaching = { task: t, minutesLeft: diff };

            // Trigger local browser push notification for proximity alert (5 - 10 mins before)
            if (diff <= 10 && !notifiedTaskIds.includes(t.id)) {
              if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
                try {
                  new Notification(`⏰ Upcoming Focus Session: ${t.text}`, {
                    body: `Starting in ${diff} minutes (${formatTime12Hour(t.startTime)}). Deep breaths, you've got this!`,
                    icon: '/pwa-192x192.png',
                    tag: `proximity-${t.id}`
                  });
                } catch {
                  // ignore
                }
              }
              setNotifiedTaskIds(prev => [...prev, t.id]);
            }
            break;
          }
          // Overdue fixed task
          const end = t.endTime ? timeStringToMinutes(t.endTime) : start + (t.durationMinutes || 45);
          if (current > end && current - end <= 180) {
            foundOverdue = { task: t, overdueMins: current - end };
          }
        }

        // Deadline tasks
        if (t.timeType === 'deadline' && t.deadlineTime) {
          const deadline = timeStringToMinutes(t.deadlineTime);
          const diff = deadline - current;
          if (diff > 0 && diff <= 15) {
            foundApproaching = { task: t, minutesLeft: diff };

            if (diff <= 10 && !notifiedTaskIds.includes(t.id)) {
              if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
                try {
                  new Notification(`⏳ Deadline Approaching: ${t.text}`, {
                    body: `Cutoff in ${diff} minutes (${formatTime12Hour(t.deadlineTime)}). Final sprint!`,
                    icon: '/pwa-192x192.png',
                    tag: `proximity-${t.id}`
                  });
                } catch {
                  // ignore
                }
              }
              setNotifiedTaskIds(prev => [...prev, t.id]);
            }
            break;
          }
          if (diff < 0 && Math.abs(diff) <= 180) {
            foundOverdue = { task: t, overdueMins: Math.abs(diff) };
          }
        }
      }

      setApproachingTask(foundApproaching);
      if (!foundApproaching) {
        setOverdueTask(foundOverdue);
      }
    };

    checkSchedule();
    const interval = setInterval(checkSchedule, 20000); // Check every 20 seconds
    return () => clearInterval(interval);
  }, [tasks, dismissedTaskIds, notifiedTaskIds]);

  if (!approachingTask && !overdueTask) return null;

  const currentBurst = MOTIVATION_BURSTS[Math.floor(Date.now() / (1000 * 60 * 5)) % MOTIVATION_BURSTS.length];

  if (approachingTask) {
    const { task, minutesLeft } = approachingTask;

    return (
      <div className="fixed top-20 right-4 z-50 max-w-sm w-full p-4 rounded-2xl bg-slate-900/95 border border-amber-500/50 text-slate-100 shadow-2xl backdrop-blur-xl animate-in slide-in-from-top-3 duration-300">
        <div className="flex items-start justify-between gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center flex-shrink-0 animate-bounce">
            <Bell className="w-4 h-4" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Up Next in {minutesLeft} minute{minutesLeft > 1 ? 's' : ''}</span>
            </div>

            <p className="text-sm font-semibold truncate text-slate-100 mt-0.5">
              {task.text}
            </p>

            <p className="text-xs text-slate-400 italic mt-1">
              “{currentBurst}”
            </p>

            <div className="mt-3 flex items-center gap-2">
              <button
                onClick={() => {
                  onStartTimer(task);
                  setDismissedTaskIds((prev) => [...prev, task.id]);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition active:scale-95 shadow-sm"
              >
                <Play className="w-3 h-3 fill-current" />
                <span>Begin Focus Now</span>
              </button>

              <button
                onClick={() => setDismissedTaskIds((prev) => [...prev, task.id])}
                className="px-2.5 py-1.5 rounded-xl text-xs opacity-60 hover:opacity-100 text-slate-400 transition"
              >
                Dismiss
              </button>
            </div>
          </div>

          <button
            onClick={() => setDismissedTaskIds((prev) => [...prev, task.id])}
            className="p-1 rounded-lg text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  if (overdueTask) {
    const { task, overdueMins } = overdueTask;

    return (
      <div className="fixed top-20 right-4 z-50 max-w-sm w-full p-4 rounded-2xl bg-slate-900/95 border border-rose-500/50 text-slate-100 shadow-2xl backdrop-blur-xl animate-in slide-in-from-top-3 duration-300">
        <div className="flex items-start justify-between gap-3">
          <div className="w-9 h-9 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-4 h-4" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 text-xs font-bold text-rose-400">
              <span>Task Overdue by {overdueMins}m</span>
            </div>

            <p className="text-sm font-semibold truncate text-slate-100 mt-0.5">
              {task.text}
            </p>

            <p className="text-xs text-slate-400 mt-1">
              Time passed without completion. Would you like to reschedule?
            </p>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <button
                onClick={() => setShowRescheduleMenu(!showRescheduleMenu)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-amber-400 border border-amber-500/30 transition"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reschedule (+30m, +1h)</span>
              </button>

              <button
                onClick={() => setDismissedTaskIds((prev) => [...prev, task.id])}
                className="px-2 py-1.5 rounded-xl text-xs opacity-60 hover:opacity-100 text-slate-400 transition"
              >
                Dismiss
              </button>
            </div>

            {showRescheduleMenu && (
              <div className="mt-2 p-2 rounded-xl bg-slate-950 border border-slate-800 space-y-1 text-xs">
                <button
                  onClick={() => {
                    const currentMins = timeStringToMinutes(getCurrentTimeHHMM());
                    const newH = Math.floor((currentMins + 30) / 60);
                    const newM = (currentMins + 30) % 60;
                    onRescheduleTask(task.id, `${String(newH).padStart(2, '0')}:${String(newM).padStart(2, '0')}`);
                    setShowRescheduleMenu(false);
                    setDismissedTaskIds((prev) => [...prev, task.id]);
                  }}
                  className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-slate-800 text-slate-300"
                >
                  +30 minutes from now
                </button>
                <button
                  onClick={() => {
                    const currentMins = timeStringToMinutes(getCurrentTimeHHMM());
                    const newH = Math.floor((currentMins + 60) / 60);
                    const newM = (currentMins + 60) % 60;
                    onRescheduleTask(task.id, `${String(newH).padStart(2, '0')}:${String(newM).padStart(2, '0')}`);
                    setShowRescheduleMenu(false);
                    setDismissedTaskIds((prev) => [...prev, task.id]);
                  }}
                  className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-slate-800 text-slate-300"
                >
                  +1 hour from now
                </button>
                <button
                  onClick={() => {
                    onRescheduleTask(task.id, '14:00');
                    setShowRescheduleMenu(false);
                    setDismissedTaskIds((prev) => [...prev, task.id]);
                  }}
                  className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-slate-800 text-slate-300"
                >
                  This afternoon (2:00 PM)
                </button>
              </div>
            )}
          </div>

          <button
            onClick={() => setDismissedTaskIds((prev) => [...prev, task.id])}
            className="p-1 rounded-lg text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return null;
};
