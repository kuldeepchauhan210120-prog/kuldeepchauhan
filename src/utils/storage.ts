import { Task, StreakState, UserProfile, ThemeId } from '../types';

const STORAGE_KEYS = {
  TASKS: 'auraday_tasks_v1',
  STREAK: 'auraday_streak_v1',
  PROFILE: 'auraday_profile_v1',
  THEME: 'auraday_theme_v1',
  DATE: 'auraday_last_date_v1',
};

export function getTodayDateString(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getFormattedToday(): string {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  }).format(new Date());
}

const DEFAULT_TASKS: Task[] = [
  {
    id: 'p-1',
    text: 'Client Architecture Review: Sync on production scaling',
    completed: false,
    category: 'priority',
    isPriority: true,
    prioritySlot: 1,
    order: 0,
    createdAt: new Date().toISOString(),
    timeType: 'fixed',
    startTime: '09:30',
    endTime: '10:30',
    dueTime: '09:30 AM',
    note: 'Fixed Appointment on Daily Timeline'
  },
  {
    id: 'p-2',
    text: 'Deep work focus block: Draft core executive summary',
    completed: false,
    category: 'priority',
    isPriority: true,
    prioritySlot: 2,
    order: 1,
    createdAt: new Date().toISOString(),
    timeType: 'duration',
    durationMinutes: 45,
    elapsedSeconds: 0,
    pomodoroSessionsCompleted: 0,
    dueTime: '45 mins',
    note: 'Duration-based focus block with built-in timer'
  },
  {
    id: 'p-3',
    text: 'Financial forecast & quarterly sign-off by close of day',
    completed: false,
    category: 'priority',
    isPriority: true,
    prioritySlot: 3,
    order: 2,
    createdAt: new Date().toISOString(),
    timeType: 'deadline',
    deadlineTime: '17:00',
    dueTime: 'Due by 5:00 PM',
    note: 'Deadline-driven countdown'
  },
  {
    id: 'h-1',
    text: 'Daily reading: 15 pages of philosophy or deep craft',
    completed: false,
    category: 'habit',
    isPriority: false,
    isRoutineHabit: true,
    habitStreak: 12,
    order: 3,
    createdAt: new Date().toISOString(),
    timeType: 'duration',
    durationMinutes: 15,
    note: 'Daily recurring habit'
  },
  {
    id: 's-1',
    text: 'Triage team inbox & batch responses (15 min sprint)',
    completed: true,
    completedAt: new Date(Date.now() - 3600000).toISOString(),
    category: 'normal',
    isPriority: false,
    order: 4,
    createdAt: new Date().toISOString(),
    timeType: 'duration',
    durationMinutes: 15,
    elapsedSeconds: 900
  },
  {
    id: 's-2',
    text: 'Daily engineering standup and blocker check',
    completed: true,
    completedAt: new Date(Date.now() - 3600000 * 3).toISOString(),
    category: 'normal',
    isPriority: false,
    order: 5,
    createdAt: new Date().toISOString(),
    timeType: 'fixed',
    startTime: '11:00',
    endTime: '11:30'
  }
];

export function getInitialStreak(): StreakState {
  const today = getTodayDateString();
  const history: Record<string, { total: number; completed: number; priorityCompleted: number }> = {};
  
  // Seed past 7 days with realistic completion numbers for the dashboard
  for (let i = 6; i >= 1; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const total = 4 + (i % 2);
    const completed = total - (i === 3 ? 1 : 0);
    history[dateStr] = {
      total,
      completed,
      priorityCompleted: 3
    };
  }

  // Today initial
  history[today] = {
    total: 6,
    completed: 2,
    priorityCompleted: 0
  };

  return {
    currentStreak: 5,
    longestStreak: 14,
    lastActiveDate: today,
    completionHistory: history
  };
}

const DEFAULT_PROFILE: UserProfile = {
  id: 'usr-1',
  name: 'Alex Rivera',
  email: 'alex.rivera@example.com',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
  provider: 'guest',
  wakeUpTime: '06:30',
  reminderTime: '07:15',
  reminderEnabled: true,
  pomodoroWorkMinutes: 25,
  pomodoroBreakMinutes: 5,
  spotlightFocusMode: false,
  currentMood: 'calm',
  autoRollOverEnabled: true,
  lastRolledOverDate: getTodayDateString(),
  soundEnabled: true,
  confettiEnabled: true,
  hapticEnabled: true,
  favoriteQuoteIds: [1, 3, 8, 14],
  morningIntention: 'Bring calm, unhurried precision to every conversation.',
  intentionDate: getTodayDateString()
};

export const storage = {
  loadTasks(): Task[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TASKS);
      if (data) {
        const parsed: Task[] = JSON.parse(data);
        return parsed.map((t, idx) => ({
          ...t,
          category: t.category || (t.isPriority ? 'priority' : t.isRoutineHabit ? 'habit' : 'normal'),
          order: typeof t.order === 'number' ? t.order : idx,
          isRoutineHabit: t.category === 'habit' || t.isRoutineHabit,
          habitStreak: t.habitStreak || (t.category === 'habit' ? 1 : undefined),
          timeType: t.timeType || (t.startTime ? 'fixed' : t.deadlineTime ? 'deadline' : 'duration'),
          durationMinutes: t.durationMinutes || 25
        }));
      }
    } catch {
      // ignore
    }
    return DEFAULT_TASKS;
  },

  saveTasks(tasks: Task[]) {
    try {
      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
    } catch {
      // ignore
    }
  },

  loadStreak(): StreakState {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.STREAK);
      if (data) return JSON.parse(data);
    } catch {
      // ignore
    }
    return getInitialStreak();
  },

  saveStreak(streak: StreakState) {
    try {
      localStorage.setItem(STORAGE_KEYS.STREAK, JSON.stringify(streak));
    } catch {
      // ignore
    }
  },

  loadProfile(): UserProfile {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PROFILE);
      if (data) {
        return {
          ...DEFAULT_PROFILE,
          ...JSON.parse(data)
        };
      }
    } catch {
      // ignore
    }
    return DEFAULT_PROFILE;
  },


  saveProfile(profile: UserProfile) {
    try {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
    } catch {
      // ignore
    }
  },


  loadTheme(): ThemeId {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.THEME);
      if (data && ['dark', 'light', 'sunrise', 'lavender', 'nordic', 'paper'].includes(data)) {
        return data as ThemeId;
      }
    } catch {
      // ignore
    }
    return 'dark';
  },

  saveTheme(theme: ThemeId) {
    try {
      localStorage.setItem(STORAGE_KEYS.THEME, theme);
    } catch {
      // ignore
    }
  }
};
