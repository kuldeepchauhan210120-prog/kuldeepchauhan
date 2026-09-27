import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Plus, CheckCircle, Coffee, Sparkles, X, Minimize2, Maximize2, Volume2, VolumeX } from 'lucide-react';
import { Task, ThemeConfig } from '../types';
import { playSuccessChime, fireTaskConfetti } from '../utils/feedback';

interface FocusTimerBarProps {
  activeTask: Task | null;
  workMinutes: number;
  breakMinutes: number;
  soundEnabled: boolean;
  confettiEnabled: boolean;
  theme: ThemeConfig;
  onClose: () => void;
  onCompleteTask: (taskId: string) => void;
}

export const FocusTimerBar: React.FC<FocusTimerBarProps> = ({
  activeTask,
  workMinutes = 25,
  breakMinutes = 5,
  soundEnabled = true,
  confettiEnabled = true,
  theme,
  onClose,
  onCompleteTask,
}) => {
  const [mode, setMode] = useState<'work' | 'break'>('work');
  // Default to task's durationMinutes if set, else workMinutes
  const initialSeconds = ((mode === 'work' ? (activeTask?.durationMinutes || workMinutes) : breakMinutes)) * 60;
  
  const [secondsRemaining, setSecondsRemaining] = useState<number>(initialSeconds);
  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const [cyclesCompleted, setCyclesCompleted] = useState<number>(0);

  // When activeTask changes, reset timer
  useEffect(() => {
    if (activeTask) {
      setMode('work');
      const secs = (activeTask.durationMinutes || workMinutes) * 60;
      setSecondsRemaining(secs);
      setIsRunning(true);
    }
  }, [activeTask?.id, activeTask?.durationMinutes, workMinutes]);

  // Timer interval countdown
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          // Play sound
          if (soundEnabled) {
            playSuccessChime(true);
          }
          if (confettiEnabled) {
            fireTaskConfetti(0.5, 0.3);
          }

          if (mode === 'work') {
            setCyclesCompleted((c) => c + 1);
            setMode('break');
            return breakMinutes * 60;
          } else {
            setMode('work');
            return (activeTask?.durationMinutes || workMinutes) * 60;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, mode, breakMinutes, workMinutes, activeTask, soundEnabled, confettiEnabled]);

  // Update document/browser title dynamically!
  useEffect(() => {
    const mins = Math.floor(secondsRemaining / 60);
    const secs = secondsRemaining % 60;
    const timeStr = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    const taskTitle = activeTask ? activeTask.text.slice(0, 20) + (activeTask.text.length > 20 ? '...' : '') : 'Focus';

    if (isRunning) {
      document.title = `[${timeStr}] ${mode === 'work' ? '🎯' : '☕'} ${taskTitle} | AuraDay`;
    } else {
      document.title = `[Paused] AuraDay - Morning Focus`;
    }

    return () => {
      document.title = 'AuraDay - Morning Focus & Daily Inspiration';
    };
  }, [secondsRemaining, isRunning, mode, activeTask]);

  if (!activeTask) return null;

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const totalDuration = (mode === 'work' ? (activeTask.durationMinutes || workMinutes) : breakMinutes) * 60;
  const progressPct = Math.min(100, Math.max(0, ((totalDuration - secondsRemaining) / totalDuration) * 100));

  const handleAddFiveMinutes = () => {
    setSecondsRemaining((prev) => prev + 300);
  };

  const handleReset = () => {
    setIsRunning(false);
    setSecondsRemaining(totalDuration);
  };

  const handleCompleteAndClose = () => {
    if (confettiEnabled) {
      fireTaskConfetti();
    }
    if (soundEnabled) {
      playSuccessChime(true);
    }
    onCompleteTask(activeTask.id);
    onClose();
  };

  if (isMinimized) {
    return (
      <div className="fixed bottom-5 right-5 z-50 flex items-center gap-3 px-4 py-2.5 rounded-full shadow-2xl border border-amber-500/40 bg-slate-900/95 text-white backdrop-blur-xl animate-in slide-in-from-bottom-3 duration-200">
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
        <span className="text-xs font-mono font-bold text-amber-400">{formattedTime}</span>
        <span className="text-xs text-slate-300 truncate max-w-[140px]">{activeTask.text}</span>
        <button
          onClick={() => setIsRunning(!isRunning)}
          className="p-1 rounded-full hover:bg-slate-800 text-amber-400"
        >
          {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
        </button>
        <button
          onClick={() => setIsMinimized(false)}
          className="p-1 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white"
        >
          <Maximize2 className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 p-3 sm:p-4 animate-in slide-in-from-bottom-4 duration-300">
      <div className="max-w-3xl mx-auto rounded-2xl sm:rounded-3xl border border-amber-500/40 bg-slate-950/95 text-slate-100 shadow-2xl backdrop-blur-2xl p-4 sm:p-5">
        
        {/* Progress bar line */}
        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mb-3">
          <div
            style={{ width: `${progressPct}%` }}
            className={`h-full transition-all duration-300 ${
              mode === 'work' ? 'bg-gradient-to-r from-amber-500 to-emerald-400' : 'bg-sky-400'
            }`}
          />
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Task Info & Mode */}
          <div className="flex items-center gap-3 min-w-0 w-full sm:w-auto">
            <div
              className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                mode === 'work' ? 'bg-amber-500/20 text-amber-400' : 'bg-sky-500/20 text-sky-400'
              }`}
            >
              {mode === 'work' ? <Sparkles className="w-5 h-5" /> : <Coffee className="w-5 h-5" />}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    mode === 'work'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                  }`}
                >
                  {mode === 'work' ? 'Pomodoro Focus Block' : 'Restorative Break'}
                </span>
                {cyclesCompleted > 0 && (
                  <span className="text-[11px] text-emerald-400 font-semibold">
                    ✓ {cyclesCompleted} session{cyclesCompleted > 1 ? 's' : ''} done
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm font-semibold truncate text-slate-200 mt-0.5">
                {activeTask.text}
              </p>
            </div>
          </div>

          {/* Big Time Display & Controls */}
          <div className="flex items-center gap-2 sm:gap-4">
            
            {/* Time */}
            <div className="text-2xl sm:text-3xl font-mono font-black text-amber-400 tracking-tight">
              {formattedTime}
            </div>

            {/* Play/Pause Button */}
            <button
              onClick={() => setIsRunning(!isRunning)}
              className="p-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition active:scale-95 shadow-md shadow-amber-500/20"
              title={isRunning ? 'Pause Timer' : 'Resume Timer'}
            >
              {isRunning ? <Pause className="w-4 h-4 stroke-[3]" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
            </button>

            {/* +5 Mins */}
            <button
              onClick={handleAddFiveMinutes}
              className="px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              title="Add 5 Minutes"
            >
              +5m
            </button>

            {/* Reset */}
            <button
              onClick={handleReset}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
              title="Reset Session"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Complete Task */}
            <button
              onClick={handleCompleteAndClose}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition active:scale-95 shadow-md shadow-emerald-600/20"
              title="Mark Task Finished"
            >
              <CheckCircle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Done</span>
            </button>

            {/* Minimize */}
            <button
              onClick={() => setIsMinimized(true)}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
              title="Minimize to Pill"
            >
              <Minimize2 className="w-4 h-4" />
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition"
              title="Exit Focus Mode"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
