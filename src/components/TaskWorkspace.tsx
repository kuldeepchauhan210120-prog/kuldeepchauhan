import React, { useState } from 'react';
import {
  Check, Plus, Trash2, ChevronDown, ChevronUp, RotateCcw, Sparkles,
  CheckCircle2, Clock, Calendar, ArrowRight, Play, AlertCircle, Timer,
  Hourglass, Flame, Eye, EyeOff, LayoutGrid, CalendarRange,
  GripVertical, Repeat, ArrowUpDown, Bell, SunMedium, SlidersHorizontal
} from 'lucide-react';
import { Task, PrioritySlot, TimeTaskType, TaskCategory, ThemeConfig } from '../types';
import { fireTaskConfetti, fireMajorMilestoneCelebration, playSuccessChime, triggerHapticFeedback } from '../utils/feedback';
import {
  formatTime12Hour, getCurrentTimeHHMM, timeStringToMinutes,
  isTaskCurrentFocus, isTaskOverdue, getDeadlineToNowLabel,
  calculateRescheduledTime
} from '../utils/time';
import { DailyTimeline } from './DailyTimeline';

interface TaskWorkspaceProps {
  tasks: Task[];
  theme: ThemeConfig;
  soundEnabled: boolean;
  confettiEnabled: boolean;
  hapticEnabled?: boolean;
  spotlightFocusMode: boolean;
  onToggleSpotlightFocus: () => void;
  activeFocusTaskId?: string;
  onStartTimer: (task: Task) => void;
  onToggleTask: (taskId: string) => void;
  onAddTask: (
    text: string,
    isPriority: boolean,
    slot?: PrioritySlot,
    timeType?: TimeTaskType,
    timeData?: {
      startTime?: string;
      endTime?: string;
      durationMinutes?: number;
      deadlineTime?: string;
      category?: TaskCategory;
      isRoutineHabit?: boolean;
    }
  ) => void;
  onDeleteTask: (taskId: string) => void;
  onUpdateTaskText: (taskId: string, newText: string) => void;
  onRescheduleTask: (taskId: string, newTime: string) => void;
  onResetTasks: (mode: 'all' | 'keep_uncompleted') => void;
  onAssignTaskTime: (taskId: string, startTime: string, endTime: string) => void;
  onReorderTasks?: (tasks: Task[]) => void;
  onAutoArrangeChronological?: () => void;
  pendingRollOver?: { completedCount: number; unfinishedCount: number } | null;
  onResolveRollOver?: (mode: 'carry_over' | 'fresh_slate') => void;
  onDismissRollOver?: () => void;
  wakeUpTime?: string;
}

export const TaskWorkspace: React.FC<TaskWorkspaceProps> = ({
  tasks,
  theme,
  soundEnabled,
  confettiEnabled,
  hapticEnabled = true,
  spotlightFocusMode,
  onToggleSpotlightFocus,
  activeFocusTaskId,
  onStartTimer,
  onToggleTask,
  onAddTask,
  onDeleteTask,
  onUpdateTaskText,
  onRescheduleTask,
  onResetTasks,
  onAssignTaskTime,
  onReorderTasks,
  onAutoArrangeChronological,
  pendingRollOver,
  onResolveRollOver,
  onDismissRollOver,
  wakeUpTime = '06:30',
}) => {
  const [workspaceView, setWorkspaceView] = useState<'list' | 'timeline'>('list');
  const [showSecondary, setShowSecondary] = useState(true);
  const [showHabits, setShowHabits] = useState(true);
  const [showResetModal, setShowResetModal] = useState(false);
  const [filterMode, setFilterMode] = useState<'all' | 'active' | 'completed'>('all');

  // Quick Task Input State (The Prominent Header Input)
  const [quickText, setQuickText] = useState('');
  const [quickCategory, setQuickCategory] = useState<TaskCategory>('priority');
  const [quickTimeType, setQuickTimeType] = useState<TimeTaskType>('duration');
  const [quickDuration, setQuickDuration] = useState<number>(25);
  const [quickStartTime, setQuickStartTime] = useState<string>('10:00');
  const [quickDeadlineTime, setQuickDeadlineTime] = useState<string>('17:00');
  const [showQuickTimeOptions, setShowQuickTimeOptions] = useState(false);

  // Drag-and-Drop state
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [dragOverTaskId, setDragOverTaskId] = useState<string | null>(null);

  // Slot creation state (when clicking empty priority card)
  const [activeSlotEditing, setActiveSlotEditing] = useState<PrioritySlot | null>(null);
  const [slotInputs, setSlotInputs] = useState<Record<PrioritySlot, string>>({ 1: '', 2: '', 3: '' });
  const [slotTimeType, setSlotTimeType] = useState<TimeTaskType>('duration');
  const [slotDuration, setSlotDuration] = useState<number>(45);
  const [slotStartTime, setSlotStartTime] = useState<string>('09:30');
  const [slotEndTime, setSlotEndTime] = useState<string>('10:30');
  const [slotDeadline, setSlotDeadline] = useState<string>('17:00');

  // Inline task text edit
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editingTaskText, setEditingTaskText] = useState('');

  // Reschedule menu popover
  const [reschedulingTaskId, setReschedulingTaskId] = useState<string | null>(null);

  // Duration Presets
  const DURATION_PRESETS = [15, 25, 45, 60, 90];

  // Priority tasks (slots 1, 2, 3)
  const priority1 = tasks.find(t => t.isPriority && t.prioritySlot === 1);
  const priority2 = tasks.find(t => t.isPriority && t.prioritySlot === 2);
  const priority3 = tasks.find(t => t.isPriority && t.prioritySlot === 3);

  const priorityTasks = [
    { slot: 1 as PrioritySlot, label: 'Priority #1', tag: 'Primary Focus', task: priority1 },
    { slot: 2 as PrioritySlot, label: 'Priority #2', tag: 'Key Objective', task: priority2 },
    { slot: 3 as PrioritySlot, label: 'Priority #3', tag: 'Crucial Momentum', task: priority3 }
  ];

  // Routine Habits
  const habitTasks = tasks.filter(t => t.category === 'habit' || t.isRoutineHabit);

  // Secondary Tasks (normal tasks that are neither priority nor routine habits)
  const secondaryTasks = tasks.filter(t => !t.isPriority && t.category !== 'habit' && !t.isRoutineHabit);

  const completedPrioritiesCount = priorityTasks.filter(p => p.task?.completed).length;
  const totalDefinedPriorities = priorityTasks.filter(p => p.task).length;
  const allPrioritiesDone = totalDefinedPriorities > 0 && completedPrioritiesCount === totalDefinedPriorities;

  // Checkbox Click with haptic, sound, and visual confetti
  const handleCheckboxClick = (e: React.MouseEvent, task: Task) => {
    e.stopPropagation();
    const willBeCompleted = !task.completed;

    if (willBeCompleted) {
      if (hapticEnabled) {
        triggerHapticFeedback([15, 35, 20]);
      }

      if (confettiEnabled) {
        const rect = (e.target as HTMLElement).getBoundingClientRect();
        const x = (rect.left + rect.width / 2) / window.innerWidth;
        const y = (rect.top + rect.height / 2) / window.innerHeight;
        fireTaskConfetti(x, y);
      }

      if (task.isPriority && completedPrioritiesCount === totalDefinedPriorities - 1) {
        if (confettiEnabled) {
          setTimeout(() => fireMajorMilestoneCelebration(), 250);
        }
        if (soundEnabled) {
          playSuccessChime(true);
        }
      } else {
        if (soundEnabled) {
          playSuccessChime(false);
        }
      }
    }

    onToggleTask(task.id);
  };

  // Quick Task Input Submit Handler
  const handleQuickAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = quickText.trim();
    if (!text) return;

    const timeData = {
      startTime: quickTimeType === 'fixed' ? quickStartTime : undefined,
      endTime: quickTimeType === 'fixed' ? `${String(parseInt(quickStartTime.split(':')[0], 10) + 1).padStart(2, '0')}:${quickStartTime.split(':')[1]}` : undefined,
      durationMinutes: quickTimeType === 'duration' ? quickDuration : undefined,
      deadlineTime: quickTimeType === 'deadline' ? quickDeadlineTime : undefined,
      category: quickCategory,
      isRoutineHabit: quickCategory === 'habit',
    };

    if (quickCategory === 'priority') {
      // Find the first open priority slot (1, 2, or 3)
      let targetSlot: PrioritySlot = 1;
      if (!priority1) targetSlot = 1;
      else if (!priority2) targetSlot = 2;
      else if (!priority3) targetSlot = 3;
      else targetSlot = 1; // replaces or appends to slot 1

      onAddTask(text, true, targetSlot, quickTimeType, timeData);
    } else {
      onAddTask(text, false, undefined, quickTimeType, timeData);
    }

    setQuickText('');
    setShowQuickTimeOptions(false);
  };

  const handleSaveSlot = (slot: PrioritySlot) => {
    const text = slotInputs[slot].trim();
    if (text) {
      const timeData = {
        startTime: slotTimeType === 'fixed' ? slotStartTime : undefined,
        endTime: slotTimeType === 'fixed' ? slotEndTime : undefined,
        durationMinutes: slotTimeType === 'duration' ? slotDuration : undefined,
        deadlineTime: slotTimeType === 'deadline' ? slotDeadline : undefined,
        category: 'priority' as TaskCategory,
      };

      onAddTask(text, true, slot, slotTimeType, timeData);
      setSlotInputs(prev => ({ ...prev, [slot]: '' }));
    }
    setActiveSlotEditing(null);
  };

  const handleStartEdit = (task: Task) => {
    setEditingTaskId(task.id);
    setEditingTaskText(task.text);
  };

  const handleSaveEdit = (taskId: string) => {
    if (editingTaskText.trim()) {
      onUpdateTaskText(taskId, editingTaskText.trim());
    }
    setEditingTaskId(null);
  };

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    setDraggedTaskId(taskId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', taskId);
  };

  const handleDragOver = (e: React.DragEvent, taskId: string) => {
    e.preventDefault();
    if (draggedTaskId && draggedTaskId !== taskId) {
      setDragOverTaskId(taskId);
    }
  };

  const handleDragLeave = () => {
    setDragOverTaskId(null);
  };

  const handleDrop = (e: React.DragEvent, targetTaskId: string) => {
    e.preventDefault();
    setDragOverTaskId(null);
    if (!draggedTaskId || draggedTaskId === targetTaskId || !onReorderTasks) {
      setDraggedTaskId(null);
      return;
    }

    const draggedIdx = tasks.findIndex(t => t.id === draggedTaskId);
    const targetIdx = tasks.findIndex(t => t.id === targetTaskId);

    if (draggedIdx === -1 || targetIdx === -1) {
      setDraggedTaskId(null);
      return;
    }

    const newTasks = [...tasks];
    const [movedItem] = newTasks.splice(draggedIdx, 1);
    newTasks.splice(targetIdx, 0, movedItem);

    onReorderTasks(newTasks);
    setDraggedTaskId(null);
  };

  const filteredSecondaryTasks = secondaryTasks.filter(t => {
    if (filterMode === 'active') return !t.completed;
    if (filterMode === 'completed') return t.completed;
    return true;
  });

  return (
    <section className="py-6 sm:py-10 max-w-4xl mx-auto px-4 sm:px-6">

      {/* Automatic Morning Roll-Over / Archive Banner */}
      {pendingRollOver && onResolveRollOver && (
        <div className="mb-6 p-4 rounded-2xl border border-amber-500/40 bg-amber-950/20 text-slate-100 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in slide-in-from-top-3 duration-300">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center flex-shrink-0 mt-0.5">
              <SunMedium className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                  Morning Reset at {formatTime12Hour(wakeUpTime)}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-semibold">
                  New Day Board
                </span>
              </div>
              <p className="text-sm text-slate-200 mt-1 leading-snug">
                Yesterday’s <strong>{pendingRollOver.completedCount} completed tasks</strong> were logged to your weekly insights. You have <strong>{pendingRollOver.unfinishedCount} unfinished tasks</strong>.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={() => onResolveRollOver('carry_over')}
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-amber-500 text-slate-950 hover:bg-amber-400 transition active:scale-95 shadow-sm"
            >
              Carry Over to Today
            </button>
            <button
              onClick={() => onResolveRollOver('fresh_slate')}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold border border-inherit/40 hover:border-rose-400 hover:text-rose-300 transition"
            >
              Clean Slate
            </button>
            {onDismissRollOver && (
              <button
                onClick={onDismissRollOver}
                className="text-xs opacity-60 hover:opacity-100 px-2 py-1"
              >
                Dismiss
              </button>
            )}
          </div>
        </div>
      )}

      {/* QUICK TASK INPUT: Prominent Fast-Capture Bar */}
      <div className={`mb-8 p-4 sm:p-5 rounded-3xl border transition-all duration-300 ${theme.cardBackground} shadow-lg`}
        style={{ boxShadow: `0 12px 30px -10px ${theme.glowColor}` }}
      >
        <form onSubmit={handleQuickAddSubmit} className="space-y-3">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            {/* Primary Text Field */}
            <div className="relative flex-1">
              <input
                type="text"
                value={quickText}
                onChange={(e) => setQuickText(e.target.value)}
                placeholder="What needs to happen today? (e.g. Finish client proposal, 15 min walk...)"
                className="w-full px-4 py-3 text-sm sm:text-base rounded-2xl border bg-black/10 focus:outline-none focus:ring-2 focus:ring-amber-500/50 border-inherit placeholder:opacity-50"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!quickText.trim()}
              className={`px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition active:scale-95 shadow-md ${
                quickText.trim()
                  ? 'bg-amber-500 text-slate-950 hover:bg-amber-400 shadow-amber-500/20'
                  : 'bg-slate-500/20 opacity-50 cursor-not-allowed text-inherit'
              }`}
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Add to Day</span>
            </button>
          </div>

          {/* Smart Categorization & Time Modality Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            {/* Smart Categorization Pills */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              <span className="text-[11px] font-semibold uppercase tracking-wider opacity-60 mr-1 hidden sm:inline">
                Category:
              </span>
              <button
                type="button"
                onClick={() => setQuickCategory('priority')}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-xl font-semibold border transition active:scale-95 ${
                  quickCategory === 'priority'
                    ? 'bg-amber-500/20 border-amber-500 text-amber-400'
                    : 'border-inherit/40 opacity-70 hover:opacity-100 hover:bg-slate-500/10'
                }`}
              >
                <Flame className="w-3.5 h-3.5 fill-current" />
                <span>Top 3 Priority</span>
              </button>

              <button
                type="button"
                onClick={() => setQuickCategory('normal')}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-xl font-semibold border transition active:scale-95 ${
                  quickCategory === 'normal'
                    ? 'bg-slate-500/30 border-slate-400 text-inherit font-bold'
                    : 'border-inherit/40 opacity-70 hover:opacity-100 hover:bg-slate-500/10'
                }`}
              >
                <span>Normal Task</span>
              </button>

              <button
                type="button"
                onClick={() => setQuickCategory('habit')}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-xl font-semibold border transition active:scale-95 ${
                  quickCategory === 'habit'
                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                    : 'border-inherit/40 opacity-70 hover:opacity-100 hover:bg-slate-500/10'
                }`}
              >
                <Repeat className="w-3.5 h-3.5" />
                <span>Routine Habit</span>
              </button>
            </div>

            {/* Quick Time Modality Switcher */}
            <div className="flex items-center gap-1.5 text-xs">
              <button
                type="button"
                onClick={() => setShowQuickTimeOptions(!showQuickTimeOptions)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[11px] font-semibold transition ${
                  showQuickTimeOptions || quickTimeType !== 'duration'
                    ? 'bg-amber-500/15 border-amber-500 text-amber-400'
                    : 'border-inherit/40 opacity-75 hover:opacity-100'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>
                  {quickTimeType === 'duration' && `⏱️ ${quickDuration}m Focus`}
                  {quickTimeType === 'fixed' && `🕒 ${formatTime12Hour(quickStartTime)}`}
                  {quickTimeType === 'deadline' && `⏳ Due ${formatTime12Hour(quickDeadlineTime)}`}
                </span>
                <ChevronDown className="w-3 h-3 opacity-60" />
              </button>
            </div>
          </div>

          {/* Time Options Drawer if expanded */}
          {showQuickTimeOptions && (
            <div className="pt-2 border-t border-inherit/30 flex flex-wrap items-center gap-3 text-xs animate-in fade-in duration-200">
              <div className="flex items-center gap-2">
                <span className="opacity-70 font-medium">Time Type:</span>
                <div className="flex items-center p-1 rounded-xl bg-black/20 border border-inherit/40">
                  <button
                    type="button"
                    onClick={() => setQuickTimeType('duration')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                      quickTimeType === 'duration' ? 'bg-amber-500 text-slate-950 font-bold' : 'opacity-70'
                    }`}
                  >
                    Duration
                  </button>
                  <button
                    type="button"
                    onClick={() => setQuickTimeType('fixed')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                      quickTimeType === 'fixed' ? 'bg-sky-500 text-slate-950 font-bold' : 'opacity-70'
                    }`}
                  >
                    Fixed Time
                  </button>
                  <button
                    type="button"
                    onClick={() => setQuickTimeType('deadline')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                      quickTimeType === 'deadline' ? 'bg-rose-500 text-white font-bold' : 'opacity-70'
                    }`}
                  >
                    Deadline
                  </button>
                </div>
              </div>

              {quickTimeType === 'duration' && (
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="opacity-60 text-[11px]">Presets:</span>
                  {DURATION_PRESETS.map(m => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setQuickDuration(m)}
                      className={`px-2 py-0.5 rounded-lg text-xs font-medium ${
                        quickDuration === m ? 'bg-amber-500/30 text-amber-400 border border-amber-500/50' : 'bg-black/10 opacity-70'
                      }`}
                    >
                      {m}m
                    </button>
                  ))}
                </div>
              )}

              {quickTimeType === 'fixed' && (
                <div className="flex items-center gap-2">
                  <span className="opacity-60 text-[11px]">Appointment:</span>
                  <input
                    type="time"
                    value={quickStartTime}
                    onChange={(e) => setQuickStartTime(e.target.value)}
                    className="px-2 py-1 rounded-lg border border-inherit bg-black/20 text-xs font-bold"
                  />
                </div>
              )}

              {quickTimeType === 'deadline' && (
                <div className="flex items-center gap-2">
                  <span className="opacity-60 text-[11px]">Cutoff:</span>
                  <input
                    type="time"
                    value={quickDeadlineTime}
                    onChange={(e) => setQuickDeadlineTime(e.target.value)}
                    className="px-2 py-1 rounded-lg border border-inherit bg-black/20 text-xs font-bold text-amber-400"
                  />
                </div>
              )}
            </div>
          )}
        </form>
      </div>

      {/* Workspace Header, Views & Global Action Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Today’s Focus &amp; Time Workspace</h2>
          <p className="text-xs sm:text-sm opacity-70 mt-0.5">
            Lock in your Top 3 Priorities, habits, time blocks, and pomodoro timers.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* List vs Timeline View Switcher */}
          <div className="flex items-center p-1 rounded-xl bg-slate-500/10 border border-inherit text-xs font-semibold">
            <button
              onClick={() => setWorkspaceView('list')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition ${
                workspaceView === 'list'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'opacity-70 hover:opacity-100'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Priority List</span>
            </button>
            <button
              onClick={() => setWorkspaceView('timeline')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition ${
                workspaceView === 'timeline'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'opacity-70 hover:opacity-100'
              }`}
            >
              <CalendarRange className="w-3.5 h-3.5" />
              <span>Schedule Timeline</span>
            </button>
          </div>

          {/* Auto-Arrange Chronologically */}
          {onAutoArrangeChronological && (
            <button
              onClick={onAutoArrangeChronological}
              title="Auto-arrange tasks chronologically by scheduled time"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium border border-inherit/50 hover:border-amber-500/50 hover:bg-amber-500/10 transition"
            >
              <ArrowUpDown className="w-3.5 h-3.5 text-amber-500" />
              <span className="hidden sm:inline">Sort Chrono</span>
            </button>
          )}

          {/* Spotlight Mode Toggle */}
          <button
            onClick={onToggleSpotlightFocus}
            title={spotlightFocusMode ? 'Spotlight Mode Active: Dims non-focus tasks' : 'Turn on Spotlight Focus Mode'}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium border transition ${
              spotlightFocusMode
                ? 'bg-amber-500/20 border-amber-500 text-amber-400 font-bold'
                : 'border-inherit opacity-70 hover:opacity-100'
            }`}
          >
            {spotlightFocusMode ? <Eye className="w-3.5 h-3.5 text-amber-400" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">Spotlight</span>
          </button>

          {/* Clear All / Reset for Tomorrow */}
          <button
            onClick={() => setShowResetModal(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium border border-inherit opacity-75 hover:opacity-100 hover:border-rose-500/50 hover:text-rose-400 transition"
            title="Reset workspace for tomorrow morning"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset Slate</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: TIMELINE VIEW */}
      {workspaceView === 'timeline' ? (
        <DailyTimeline
          tasks={tasks}
          theme={theme}
          onSelectTaskForTimer={onStartTimer}
          onToggleTask={onToggleTask}
          onAssignTaskTime={onAssignTaskTime}
          onQuickCreateFixedTask={(text, startTime) => {
            const endHour = parseInt(startTime.split(':')[0], 10) + 1;
            onAddTask(text, false, undefined, 'fixed', {
              startTime,
              endTime: `${String(endHour).padStart(2, '0')}:00`
            });
          }}
        />
      ) : (
        /* VIEW 2: LIST VIEW (Top 3 Priorities, Routine Habits & Secondary Tasks) */
        <>
          {/* SECTION 2A: The Top 3 Priorities List */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold tracking-wide uppercase opacity-75">
                  The Top 3 Priorities
                </h3>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-500">
                  {completedPrioritiesCount}/{totalDefinedPriorities} Completed
                </span>
              </div>
              {allPrioritiesDone && (
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-500/15 px-3 py-1 rounded-full animate-bounce">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>All Top Priorities Done! 🔥</span>
                </div>
              )}
            </div>

            {/* 3 Dedicated Priority Cards with Drag-and-Drop */}
            <div className="grid grid-cols-1 gap-3.5">
              {priorityTasks.map(({ slot, label, tag, task }) => {
                const isEditing = activeSlotEditing === slot;
                const isEditingThisTask = editingTaskId === task?.id;
                const isFocus = task ? isTaskCurrentFocus(task) || activeFocusTaskId === task.id : false;
                const overdue = task ? isTaskOverdue(task) : { isOverdue: false, overdueMinutes: 0 };
                const deadlineInfo = task?.timeType === 'deadline' && task.deadlineTime
                  ? getDeadlineToNowLabel(task.deadlineTime)
                  : null;

                // Spotlight opacity check
                const isDimmed = spotlightFocusMode && task && !task.completed && !isFocus;
                const isDragOver = task && dragOverTaskId === task.id;

                return (
                  <div
                    key={slot}
                    draggable={!!task && !isEditingThisTask}
                    onDragStart={(e) => task && handleDragStart(e, task.id)}
                    onDragOver={(e) => task && handleDragOver(e, task.id)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => task && handleDrop(e, task.id)}
                    className={`relative rounded-2xl p-4 sm:p-5 transition-all duration-300 border ${
                      task?.completed
                        ? 'bg-emerald-950/20 border-emerald-800/40 text-emerald-200'
                        : isFocus
                        ? 'bg-amber-500/10 border-amber-500 ring-2 ring-amber-500/30 shadow-lg shadow-amber-500/10'
                        : overdue.isOverdue
                        ? 'bg-rose-950/20 border-rose-800/40 text-rose-200'
                        : theme.cardBackground
                    } ${task ? 'hover:border-amber-500/40' : 'border-dashed border-inherit/40'} ${
                      isDimmed ? 'opacity-35 hover:opacity-100' : 'opacity-100'
                    } ${isDragOver ? 'border-amber-400 ring-2 ring-amber-400/40 scale-[1.01]' : ''}`}
                  >
                    {task ? (
                      /* Defined Priority Task */
                      <div>
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-2.5 sm:gap-3.5 flex-1 min-w-0">
                            
                            {/* Drag Handle */}
                            <div
                              className="mt-1 opacity-30 hover:opacity-80 cursor-grab active:cursor-grabbing flex-shrink-0"
                              title="Drag to reorder priority"
                            >
                              <GripVertical className="w-4 h-4" />
                            </div>

                            {/* Interactive Checkbox */}
                            <button
                              onClick={(e) => handleCheckboxClick(e, task)}
                              className={`mt-0.5 flex-shrink-0 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                                task.completed
                                  ? 'bg-emerald-500 border-emerald-500 text-slate-950 shadow-sm shadow-emerald-500/30 animate-check-pop'
                                  : 'border-slate-400/60 hover:border-amber-500 hover:scale-110 active:scale-95'
                              }`}
                              title={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
                            >
                              {task.completed && <Check className="w-4 h-4 stroke-[3]" />}
                            </button>

                            {/* Task Content & Time Modalities */}
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-500">
                                  {label}
                                </span>
                                <span aria-hidden="true" className="opacity-30">·</span>
                                <span className="text-[11px] opacity-60 font-medium">
                                  {tag}
                                </span>

                                {/* Current Focus Highlight Tag */}
                                {isFocus && !task.completed && (
                                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 animate-pulse">
                                    ⚡ CURRENT FOCUS
                                  </span>
                                )}

                                {/* Time Modality 1: Fixed Timestamp */}
                                {task.timeType === 'fixed' && task.startTime && (
                                  <span className="text-[11px] font-semibold flex items-center gap-1 px-2 py-0.5 rounded-md bg-sky-500/15 text-sky-400 border border-sky-500/20">
                                    <Clock className="w-3 h-3" />
                                    {formatTime12Hour(task.startTime)}
                                    {task.endTime ? ` – ${formatTime12Hour(task.endTime)}` : ''}
                                  </span>
                                )}

                                {/* Time Modality 2: Duration Focus Block */}
                                {task.timeType === 'duration' && (
                                  <span className="text-[11px] font-semibold flex items-center gap-1 px-2 py-0.5 rounded-md bg-purple-500/15 text-purple-400 border border-purple-500/20">
                                    <Timer className="w-3 h-3" />
                                    {task.durationMinutes || 25} min focus block
                                  </span>
                                )}

                                {/* Time Modality 3: Deadline-Driven */}
                                {task.timeType === 'deadline' && task.deadlineTime && deadlineInfo && (
                                  <span
                                    className={`text-[11px] font-semibold flex items-center gap-1 px-2 py-0.5 rounded-md border ${
                                      deadlineInfo.isOverdue
                                        ? 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                                        : deadlineInfo.isUrgent
                                        ? 'bg-amber-500/20 text-amber-400 border-amber-500/30 animate-pulse'
                                        : 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20'
                                    }`}
                                  >
                                    <Hourglass className="w-3 h-3" />
                                    {deadlineInfo.label} (Cutoff: {formatTime12Hour(task.deadlineTime)})
                                  </span>
                                )}

                                {/* Overdue Alert Flag */}
                                {overdue.isOverdue && !task.completed && (
                                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30">
                                    Overdue by {overdue.overdueMinutes}m
                                  </span>
                                )}
                              </div>

                              {/* Task Text or Edit Form */}
                              {isEditingThisTask ? (
                                <div className="flex items-center gap-2 mt-1">
                                  <input
                                    type="text"
                                    value={editingTaskText}
                                    onChange={(e) => setEditingTaskText(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit(task.id)}
                                    className="flex-1 px-3 py-1.5 text-sm rounded-lg border bg-black/20 focus:outline-none focus:ring-1 focus:ring-amber-500"
                                    autoFocus
                                  />
                                  <button
                                    onClick={() => handleSaveEdit(task.id)}
                                    className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-amber-500 text-slate-950"
                                  >
                                    Save
                                  </button>
                                  <button
                                    onClick={() => setEditingTaskId(null)}
                                    className="px-2 py-1.5 text-xs opacity-60 hover:opacity-100"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              ) : (
                                <p
                                  onClick={() => handleStartEdit(task)}
                                  className={`text-sm sm:text-base font-medium leading-snug cursor-text transition-all ${
                                    task.completed
                                      ? 'line-through opacity-60 text-emerald-300'
                                      : 'opacity-95 hover:text-amber-300'
                                  }`}
                                >
                                  {task.text}
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Action Buttons: Timer, Reschedule, Delete */}
                          <div className="flex items-center gap-1.5">
                            {/* Focus Timer Play Button */}
                            {!task.completed && (
                              <button
                                onClick={() => onStartTimer(task)}
                                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold transition active:scale-95 shadow-sm ${
                                  isFocus
                                    ? 'bg-amber-500 text-slate-950 ring-2 ring-amber-400/50'
                                    : 'bg-amber-500/20 hover:bg-amber-500 hover:text-slate-950 text-amber-400'
                                }`}
                                title="Start Focus Timer"
                              >
                                <Play className="w-3.5 h-3.5 fill-current" />
                                <span className="hidden sm:inline">Timer</span>
                              </button>
                            )}

                            {/* Reschedule Button if Overdue */}
                            {overdue.isOverdue && !task.completed && (
                              <div className="relative">
                                <button
                                  onClick={() => setReschedulingTaskId(reschedulingTaskId === task.id ? null : task.id)}
                                  className="p-1.5 rounded-lg text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 text-xs font-semibold transition"
                                  title="Reschedule task"
                                >
                                  <RotateCcw className="w-3.5 h-3.5" />
                                </button>

                                {reschedulingTaskId === task.id && (
                                  <div className="absolute right-0 mt-1 w-44 p-1.5 rounded-xl bg-slate-900 border border-slate-700 shadow-2xl z-30 space-y-1 text-xs">
                                    <button
                                      onClick={() => {
                                        const res = calculateRescheduledTime(getCurrentTimeHHMM(), '+30m');
                                        if (res.startTime) onRescheduleTask(task.id, res.startTime);
                                        setReschedulingTaskId(null);
                                      }}
                                      className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-800 text-slate-200"
                                    >
                                      +30 mins
                                    </button>
                                    <button
                                      onClick={() => {
                                        const res = calculateRescheduledTime(getCurrentTimeHHMM(), '+1h');
                                        if (res.startTime) onRescheduleTask(task.id, res.startTime);
                                        setReschedulingTaskId(null);
                                      }}
                                      className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-800 text-slate-200"
                                    >
                                      +1 hour
                                    </button>
                                    <button
                                      onClick={() => {
                                        const res = calculateRescheduledTime(getCurrentTimeHHMM(), 'afternoon');
                                        if (res.startTime) onRescheduleTask(task.id, res.startTime);
                                        setReschedulingTaskId(null);
                                      }}
                                      className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-800 text-slate-200"
                                    >
                                      This afternoon (2:00 PM)
                                    </button>
                                  </div>
                                )}
                              </div>
                            )}

                            {/* Clear Slot / Delete */}
                            <button
                              onClick={() => onDeleteTask(task.id)}
                              className="p-1.5 rounded-lg opacity-40 hover:opacity-100 hover:text-rose-400 hover:bg-rose-500/10 transition"
                              title="Clear slot"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : isEditing ? (
                      /* Time-Task Creation Form for Slot */
                      <div className="space-y-4">
                        <div className="flex items-center justify-between border-b border-inherit/40 pb-2">
                          <span className="text-xs font-bold text-amber-500">
                            Defining {label} ({tag})
                          </span>
                          <button
                            onClick={() => setActiveSlotEditing(null)}
                            className="text-xs opacity-60 hover:opacity-100"
                          >
                            Cancel
                          </button>
                        </div>

                        {/* Title input */}
                        <div>
                          <input
                            type="text"
                            placeholder="What is your most important outcome for this slot?"
                            value={slotInputs[slot]}
                            onChange={(e) => setSlotInputs({ ...slotInputs, [slot]: e.target.value })}
                            onKeyDown={(e) => e.key === 'Enter' && handleSaveSlot(slot)}
                            className="w-full px-3.5 py-2 text-sm rounded-xl border bg-black/10 focus:outline-none focus:ring-2 focus:ring-amber-500/50 border-inherit"
                            autoFocus
                          />
                        </div>

                        {/* The Three Types of Time-Tasks Selector */}
                        <div className="space-y-2">
                          <span className="text-[11px] font-semibold uppercase tracking-wider opacity-70 block">
                            Select Time Category:
                          </span>
                          <div className="grid grid-cols-3 gap-2">
                            <button
                              type="button"
                              onClick={() => setSlotTimeType('duration')}
                              className={`p-2.5 rounded-xl border text-left transition ${
                                slotTimeType === 'duration'
                                  ? 'border-purple-500 bg-purple-500/15 text-purple-300 font-semibold'
                                  : 'border-inherit/40 opacity-70 hover:opacity-100'
                              }`}
                            >
                              <div className="flex items-center gap-1.5 text-xs font-bold mb-0.5">
                                <Timer className="w-3.5 h-3.5" />
                                <span>Duration Block</span>
                              </div>
                              <span className="text-[10px] opacity-70 block">Focus timer interval</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => setSlotTimeType('fixed')}
                              className={`p-2.5 rounded-xl border text-left transition ${
                                slotTimeType === 'fixed'
                                  ? 'border-sky-500 bg-sky-500/15 text-sky-300 font-semibold'
                                  : 'border-inherit/40 opacity-70 hover:opacity-100'
                              }`}
                            >
                              <div className="flex items-center gap-1.5 text-xs font-bold mb-0.5">
                                <Clock className="w-3.5 h-3.5" />
                                <span>Time-Stamp</span>
                              </div>
                              <span className="text-[10px] opacity-70 block">Fixed appointment</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => setSlotTimeType('deadline')}
                              className={`p-2.5 rounded-xl border text-left transition ${
                                slotTimeType === 'deadline'
                                  ? 'border-amber-500 bg-amber-500/15 text-amber-300 font-semibold'
                                  : 'border-inherit/40 opacity-70 hover:opacity-100'
                              }`}
                            >
                              <div className="flex items-center gap-1.5 text-xs font-bold mb-0.5">
                                <Hourglass className="w-3.5 h-3.5" />
                                <span>Deadline</span>
                              </div>
                              <span className="text-[10px] opacity-70 block">Complete before cutoff</span>
                            </button>
                          </div>
                        </div>

                        {/* Category Specific Inputs */}
                        {slotTimeType === 'duration' && (
                          <div className="space-y-1.5">
                            <span className="text-[11px] opacity-70 block">Duration Estimator:</span>
                            <div className="flex items-center gap-1.5 flex-wrap">
                              {DURATION_PRESETS.map((mins) => (
                                <button
                                  key={mins}
                                  type="button"
                                  onClick={() => setSlotDuration(mins)}
                                  className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
                                    slotDuration === mins
                                      ? 'bg-purple-500 text-white font-bold'
                                      : 'bg-black/10 hover:bg-black/20 opacity-70 hover:opacity-100'
                                  }`}
                                >
                                  {mins} mins
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {slotTimeType === 'fixed' && (
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[11px] opacity-70 mb-1">Start Time:</label>
                              <input
                                type="time"
                                value={slotStartTime}
                                onChange={(e) => setSlotStartTime(e.target.value)}
                                className="w-full px-3 py-1.5 text-xs rounded-xl border border-inherit bg-black/10 text-slate-100 font-bold"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] opacity-70 mb-1">End Time:</label>
                              <input
                                type="time"
                                value={slotEndTime}
                                onChange={(e) => setSlotEndTime(e.target.value)}
                                className="w-full px-3 py-1.5 text-xs rounded-xl border border-inherit bg-black/10 text-slate-100 font-bold"
                              />
                            </div>
                          </div>
                        )}

                        {slotTimeType === 'deadline' && (
                          <div>
                            <label className="block text-[11px] opacity-70 mb-1">Must be completed by:</label>
                            <input
                              type="time"
                              value={slotDeadline}
                              onChange={(e) => setSlotDeadline(e.target.value)}
                              className="px-3 py-1.5 text-xs rounded-xl border border-inherit bg-black/10 text-amber-400 font-bold"
                            />
                          </div>
                        )}

                        <div className="flex justify-end pt-2">
                          <button
                            type="button"
                            onClick={() => handleSaveSlot(slot)}
                            className="px-5 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition active:scale-95 shadow-md shadow-amber-500/20"
                          >
                            Lock in Priority #{slot}
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* Empty Slot Prompt */
                      <button
                        onClick={() => {
                          setActiveSlotEditing(slot);
                          setSlotInputs(prev => ({ ...prev, [slot]: '' }));
                        }}
                        className="w-full flex items-center justify-between py-2 text-left group"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-lg border border-dashed border-inherit flex items-center justify-center text-xs font-bold opacity-60 group-hover:border-amber-500 group-hover:text-amber-500">
                            {slot}
                          </span>
                          <div>
                            <span className="text-sm font-medium opacity-60 group-hover:opacity-100 group-hover:text-amber-400 transition">
                              Set {label} ({tag})
                            </span>
                            <p className="text-[11px] opacity-40">Choose duration, appointment time, or deadline</p>
                          </div>
                        </div>
                        <Plus className="w-4 h-4 opacity-40 group-hover:opacity-100 group-hover:text-amber-400 transition" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* SECTION 2B: Routine Habits (Recurring Daily Habits) */}
          {habitTasks.length > 0 && (
            <div className={`mb-8 rounded-2xl p-5 border transition-all ${theme.cardBackground}`}>
              <div
                onClick={() => setShowHabits(!showHabits)}
                className="flex items-center justify-between cursor-pointer select-none group"
              >
                <div className="flex items-center gap-2.5">
                  <Repeat className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-sm font-semibold tracking-wide uppercase opacity-85 group-hover:opacity-100 transition">
                    Routine Daily Habits
                  </h3>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400">
                    {habitTasks.filter(t => t.completed).length}/{habitTasks.length} Completed
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs opacity-60 group-hover:opacity-100 transition">
                    {showHabits ? 'Collapse' : 'Expand'}
                  </span>
                  {showHabits ? (
                    <ChevronUp className="w-4 h-4 opacity-60 group-hover:opacity-100" />
                  ) : (
                    <ChevronDown className="w-4 h-4 opacity-60 group-hover:opacity-100" />
                  )}
                </div>
              </div>

              {showHabits && (
                <div className="mt-4 pt-4 border-t border-inherit/30 space-y-2.5">
                  {habitTasks.map(task => (
                    <div
                      key={task.id}
                      draggable={true}
                      onDragStart={(e) => handleDragStart(e, task.id)}
                      onDragOver={(e) => handleDragOver(e, task.id)}
                      onDragLeave={handleDragLeave}
                      onDrop={(e) => handleDrop(e, task.id)}
                      className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                        task.completed
                          ? 'bg-emerald-950/20 border-emerald-800/40 text-emerald-300'
                          : 'bg-black/10 border-inherit hover:border-emerald-500/40'
                      }`}
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="opacity-30 hover:opacity-80 cursor-grab flex-shrink-0">
                          <GripVertical className="w-3.5 h-3.5" />
                        </div>

                        <button
                          onClick={(e) => handleCheckboxClick(e, task)}
                          className={`flex-shrink-0 w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                            task.completed
                              ? 'bg-emerald-500 border-emerald-500 text-slate-950 shadow-sm animate-check-pop'
                              : 'border-slate-400/60 hover:border-emerald-500 active:scale-90'
                          }`}
                        >
                          {task.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </button>

                        <div className="min-w-0 flex-1">
                          <span className={`text-xs sm:text-sm block font-medium truncate ${
                            task.completed ? 'line-through opacity-60' : 'opacity-95'
                          }`}>
                            {task.text}
                          </span>
                        </div>

                        {/* Habit Streak Badge */}
                        <div className="flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/20">
                          <Flame className="w-3 h-3 fill-current" />
                          <span>{task.habitStreak || 1}d streak</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 ml-2">
                        {!task.completed && (
                          <button
                            onClick={() => onStartTimer(task)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 transition"
                            title="Start Habit Focus Timer"
                          >
                            <Play className="w-3.5 h-3.5 fill-current" />
                          </button>
                        )}
                        <button
                          onClick={() => onDeleteTask(task.id)}
                          className="p-1.5 rounded-md opacity-30 hover:opacity-100 hover:text-rose-400 transition"
                          title="Delete habit"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* SECTION 2C: Secondary Task List (Collapsible) */}
          <div className={`rounded-2xl p-5 border transition-all ${theme.cardBackground}`}>
            <div
              onClick={() => setShowSecondary(!showSecondary)}
              className="flex items-center justify-between cursor-pointer select-none group"
            >
              <div className="flex items-center gap-2.5">
                <h3 className="text-sm font-semibold tracking-wide uppercase opacity-75 group-hover:opacity-100 transition">
                  Secondary Tasks &amp; Flexible Items
                </h3>
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-500/15 opacity-70">
                  {secondaryTasks.filter(t => t.completed).length}/{secondaryTasks.length}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs opacity-60 group-hover:opacity-100 transition">
                  {showSecondary ? 'Collapse' : 'Expand'}
                </span>
                {showSecondary ? (
                  <ChevronUp className="w-4 h-4 opacity-60 group-hover:opacity-100" />
                ) : (
                  <ChevronDown className="w-4 h-4 opacity-60 group-hover:opacity-100" />
                )}
              </div>
            </div>

            {showSecondary && (
              <div className="mt-4 pt-4 border-t border-inherit/40 space-y-3">
                {/* Secondary Task List */}
                {filteredSecondaryTasks.length === 0 ? (
                  <p className="text-xs opacity-50 py-3 text-center italic">
                    {secondaryTasks.length === 0
                      ? 'No secondary tasks added. Keep your morning clear for the Top 3!'
                      : 'No tasks match current filter.'}
                  </p>
                ) : (
                  <div className="space-y-2 mt-2">
                    {filteredSecondaryTasks.map((task) => (
                      <div
                        key={task.id}
                        draggable={true}
                        onDragStart={(e) => handleDragStart(e, task.id)}
                        onDragOver={(e) => handleDragOver(e, task.id)}
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => handleDrop(e, task.id)}
                        className={`flex items-center justify-between p-2.5 rounded-xl border transition-all ${
                          task.completed
                            ? 'bg-emerald-950/15 border-emerald-800/30 text-emerald-300'
                            : 'bg-black/5 border-inherit hover:border-slate-500/40'
                        } ${dragOverTaskId === task.id ? 'border-amber-400 ring-1 ring-amber-400' : ''}`}
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="opacity-30 hover:opacity-80 cursor-grab flex-shrink-0">
                            <GripVertical className="w-3.5 h-3.5" />
                          </div>

                          <button
                            onClick={(e) => handleCheckboxClick(e, task)}
                            className={`flex-shrink-0 w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                              task.completed
                                ? 'bg-emerald-500 border-emerald-500 text-slate-950 shadow-sm animate-check-pop'
                                : 'border-slate-400/60 hover:border-amber-500 active:scale-90'
                            }`}
                          >
                            {task.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          </button>

                          <div className="min-w-0 flex-1">
                            <span
                              className={`text-xs sm:text-sm truncate block ${
                                task.completed ? 'line-through opacity-60' : 'opacity-90'
                              }`}
                            >
                              {task.text}
                            </span>
                            {task.durationMinutes && (
                              <span className="text-[10px] opacity-60">
                                {task.durationMinutes} min block
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 ml-2">
                          {/* Start timer button on secondary task */}
                          {!task.completed && (
                            <button
                              onClick={() => onStartTimer(task)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-amber-500/10 transition"
                              title="Start Focus Timer for this task"
                            >
                              <Play className="w-3.5 h-3.5 fill-current" />
                            </button>
                          )}

                          <button
                            onClick={() => onDeleteTask(task.id)}
                            className="p-1.5 rounded-md opacity-30 hover:opacity-100 hover:text-rose-400 transition ml-1"
                            title="Delete task"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      )}

      {/* Reset Confirmation Modal */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 p-6 text-slate-100 shadow-2xl">
            <h3 className="text-lg font-bold">Prepare Workspace for Tomorrow</h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
              How would you like to clear your desk? You can wipe the slate completely clean for a fresh morning or carry forward unfinished tasks.
            </p>

            <div className="mt-5 space-y-2.5">
              <button
                onClick={() => {
                  onResetTasks('all');
                  setShowResetModal(false);
                }}
                className="w-full flex items-center justify-between p-3.5 rounded-xl border border-slate-700 hover:border-rose-500/60 hover:bg-rose-500/10 text-left transition group"
              >
                <div>
                  <span className="text-xs sm:text-sm font-semibold group-hover:text-rose-400 block">
                    Clean Slate (Wipe All Tasks)
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Clear all priorities &amp; secondary tasks for a 100% fresh start.
                  </span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-rose-400" />
              </button>

              <button
                onClick={() => {
                  onResetTasks('keep_uncompleted');
                  setShowResetModal(false);
                }}
                className="w-full flex items-center justify-between p-3.5 rounded-xl border border-slate-700 hover:border-amber-500/60 hover:bg-amber-500/10 text-left transition group"
              >
                <div>
                  <span className="text-xs sm:text-sm font-semibold group-hover:text-amber-400 block">
                    Roll Forward (Keep Incomplete Tasks)
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Archive completed tasks, keep unfinished items on your list.
                  </span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-400" />
              </button>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowResetModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </section>
  );
};
