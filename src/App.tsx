/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroInspiration } from './components/HeroInspiration';
import { TaskWorkspace } from './components/TaskWorkspace';
import { InsightsDashboard } from './components/InsightsDashboard';
import { QuoteArchiveModal } from './components/QuoteArchiveModal';
import { ProfileSettingsModal } from './components/ProfileSettingsModal';
import { StreakModal } from './components/StreakModal';
import { FocusTimerBar } from './components/FocusTimerBar';
import { SmartReminderToast } from './components/SmartReminderToast';
import { OfflineIndicator } from './components/OfflineIndicator';
import { ExamWorkspace } from './components/ExamWorkspace';
import { FlashGenieStudio } from './components/FlashGenieStudio';
import { AppVersionModal, AppEdition, APP_VERSION_INFO } from './components/AppVersionModal';
import { Smartphone, Monitor, Sun, GraduationCap, Sparkles, BookOpen, User } from 'lucide-react';

import {
  Task, PrioritySlot, TimeTaskType, TaskCategory, ThemeId, StreakState,
  UserProfile, UserMood, ExamDefinition, UserExamPlan, FlashCard,
  FlashGenieDeck, FlashGenieStats, SpacedRepetitionRating
} from './types';
import { getDailyQuote, getDayOfYearWithWakeUp, QUOTES_CMS, Quote } from './data/quotes';
import { THEMES } from './utils/themes';
import { storage, getTodayDateString } from './utils/storage';
import { getCurrentTimeHHMM } from './utils/time';
import {
  loadAllExams, saveCustomExam, deleteCustomExam,
  loadUserExamPlan, saveUserExamPlan
} from './data/exams';
import {
  loadFlashCards, saveFlashCards, loadFlashDecks, saveFlashDecks,
  loadFlashStats, saveFlashStats
} from './data/flashgenie_decks';
import { fireTaskConfetti, playSuccessChime } from './utils/feedback';

export default function App() {
  const [tasks, setTasks] = useState<Task[]>(() => storage.loadTasks());
  const [streak, setStreak] = useState<StreakState>(() => storage.loadStreak());
  const [user, setUser] = useState<UserProfile>(() => storage.loadProfile());
  const [themeId, setThemeId] = useState<ThemeId>(() => storage.loadTheme());

  // App Version Edition (v2.5 Full Suite vs Separate Websites: v1.0, exam_only, flashgenie_only) & Mobile App Shell Mode
  const [appEdition, setAppEdition] = useState<AppEdition>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const portal = params.get('portal');
      if (portal === 'auraday') return 'v1.0';
      if (portal === 'exam') return 'exam_only';
      if (portal === 'flashgenie') return 'flashgenie_only';
      if (portal === 'suite') return 'v2.5';
    }
    const saved = localStorage.getItem('auraday_app_edition');
    return (saved === 'v1.0' || saved === 'v2.5' || saved === 'exam_only' || saved === 'flashgenie_only')
      ? (saved as AppEdition)
      : 'v2.5';
  });
  const [isMobileAppShell, setIsMobileAppShell] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('mode') === 'app') return true;
      if (params.get('mode') === 'website') return false;
    }
    return localStorage.getItem('auraday_mobile_shell') === 'true';
  });

  // Main View Mode: Morning Focus (AuraDay) vs Exam Coach vs FlashGenie
  const [currentView, setCurrentView] = useState<'morning' | 'exam_coach' | 'flashgenie'>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const portal = params.get('portal');
      if (portal === 'exam') return 'exam_coach';
      if (portal === 'flashgenie') return 'flashgenie';
      if (portal === 'auraday') return 'morning';
    }
    const saved = localStorage.getItem('auraday_app_edition');
    if (saved === 'exam_only') return 'exam_coach';
    if (saved === 'flashgenie_only') return 'flashgenie';
    return 'morning';
  });

  // Examination Database & Plan State
  const [exams, setExams] = useState<ExamDefinition[]>(() => loadAllExams());
  const [userExamPlan, setUserExamPlan] = useState<UserExamPlan>(() => loadUserExamPlan());

  // FlashGenie State
  const [flashCards, setFlashCards] = useState<FlashCard[]>(() => loadFlashCards());
  const [flashDecks, setFlashDecks] = useState<FlashGenieDeck[]>(() => loadFlashDecks());
  const [flashStats, setFlashStats] = useState<FlashGenieStats>(() => loadFlashStats());

  // Toast for added study topic
  const [studyTopicAddedToast, setStudyTopicAddedToast] = useState<string | null>(null);

  // Wake-Up Time Trigger calculation
  const wakeUpStatus = getDayOfYearWithWakeUp(new Date(), user.wakeUpTime || '06:30');
  const [forceRevealed, setForceRevealed] = useState<boolean>(false);
  const effectiveDayOfYear = (!wakeUpStatus.isUnlocked && !forceRevealed)
    ? wakeUpStatus.dayOfYear
    : getDayOfYearWithWakeUp(new Date(), '00:00').dayOfYear;

  const [selectedDayOfYear, setSelectedDayOfYear] = useState<number>(effectiveDayOfYear);
  const [activeModal, setActiveModal] = useState<'archive' | 'profile' | 'streak' | 'version' | null>(null);
  const [archiveFilterFavorites, setArchiveFilterFavorites] = useState(false);

  // Active Focus Timer Task (Pomodoro)
  const [activeFocusTask, setActiveFocusTask] = useState<Task | null>(null);

  // Morning Roll-over Notification Banner state
  const [pendingRollOver, setPendingRollOver] = useState<{ completedCount: number; unfinishedCount: number } | null>(null);

  const currentTheme = THEMES[themeId] || THEMES.dark;
  const currentQuote = getDailyQuote(selectedDayOfYear, user.currentMood);
  const isViewingTodayQuote = selectedDayOfYear === effectiveDayOfYear;

  // Persist tasks on change and update streak completion history
  useEffect(() => {
    storage.saveTasks(tasks);

    // Update today's history in streak
    const today = getTodayDateString();
    const completedTasks = tasks.filter(t => t.completed).length;
    const priorityCompleted = tasks.filter(t => t.isPriority && t.completed).length;
    const totalTasks = tasks.length;

    setStreak(prev => {
      const updatedHistory = {
        ...prev.completionHistory,
        [today]: {
          total: totalTasks,
          completed: completedTasks,
          priorityCompleted
        }
      };

      // Check if user completed top priorities today to maintain/increment streak
      let currentStreak = prev.currentStreak;
      const allPrioritiesDefined = tasks.filter(t => t.isPriority).length > 0;
      const allPrioritiesDone = allPrioritiesDefined && tasks.filter(t => t.isPriority).every(t => t.completed);

      if (allPrioritiesDone && prev.lastActiveDate !== today) {
        currentStreak = prev.currentStreak + 1;
      }

      const updatedStreak: StreakState = {
        ...prev,
        currentStreak: Math.max(1, currentStreak),
        longestStreak: Math.max(prev.longestStreak, currentStreak),
        lastActiveDate: today,
        completionHistory: updatedHistory
      };

      storage.saveStreak(updatedStreak);
      return updatedStreak;
    });
  }, [tasks]);

  // Persist user exam plan
  useEffect(() => {
    saveUserExamPlan(userExamPlan);
  }, [userExamPlan]);

  // Persist flashcards & stats
  useEffect(() => {
    saveFlashCards(flashCards);
  }, [flashCards]);

  useEffect(() => {
    saveFlashDecks(flashDecks);
  }, [flashDecks]);

  useEffect(() => {
    saveFlashStats(flashStats);
  }, [flashStats]);

  // Persist profile
  useEffect(() => {
    storage.saveProfile(user);
  }, [user]);

  // Persist theme
  useEffect(() => {
    storage.saveTheme(themeId);
  }, [themeId]);

  // Persist app edition & mobile shell mode
  useEffect(() => {
    localStorage.setItem('auraday_app_edition', appEdition);
    if (appEdition === 'v1.0' && currentView !== 'morning') {
      setCurrentView('morning');
    } else if (appEdition === 'exam_only' && currentView !== 'exam_coach') {
      setCurrentView('exam_coach');
    } else if (appEdition === 'flashgenie_only' && currentView !== 'flashgenie') {
      setCurrentView('flashgenie');
    }
  }, [appEdition, currentView]);

  useEffect(() => {
    localStorage.setItem('auraday_mobile_shell', String(isMobileAppShell));
  }, [isMobileAppShell]);

  // Automatic Morning Roll-Over / Archive Check when day shifts past Wake-Up Time
  useEffect(() => {
    const today = getTodayDateString();
    if (user.autoRollOverEnabled && user.lastRolledOverDate !== today && wakeUpStatus.isUnlocked) {
      const completedCount = tasks.filter(t => t.completed && t.category !== 'habit').length;
      const unfinishedCount = tasks.filter(t => !t.completed && t.category !== 'habit').length;

      if (completedCount > 0 || unfinishedCount > 0) {
        setPendingRollOver({ completedCount, unfinishedCount });
      }

      // Reset daily habits for today: uncheck them, maintain/increment streak if done yesterday
      setTasks(prev => prev.map(t => {
        if (t.category === 'habit' || t.isRoutineHabit) {
          return {
            ...t,
            completed: false,
            completedAt: undefined,
            habitStreak: t.completed ? (t.habitStreak || 1) + 1 : (t.habitStreak || 1)
          };
        }
        return t;
      }));

      setUser(prev => ({
        ...prev,
        lastRolledOverDate: today
      }));
    }
  }, [user.autoRollOverEnabled, user.lastRolledOverDate, wakeUpStatus.isUnlocked]);

  // Scheduled Reminder Ping Watcher (checks every 30s)
  useEffect(() => {
    if (!user.reminderEnabled || !('Notification' in window) || Notification.permission !== 'granted') return;

    const checkReminder = () => {
      const nowStr = getCurrentTimeHHMM();
      const lastPingedKey = `auraday_pinged_${getTodayDateString()}`;
      const alreadyPinged = localStorage.getItem(lastPingedKey);

      if (nowStr === user.reminderTime && !alreadyPinged) {
        localStorage.setItem(lastPingedKey, 'true');
        new Notification('☀️ AuraDay Morning Inspiration', {
          body: `Good morning! Time for your daily focus. "${currentQuote.quote.slice(0, 70)}..." — ${currentQuote.author}`,
          icon: '/pwa-192x192.png',
        });
      }
    };

    const interval = setInterval(checkReminder, 30000);
    return () => clearInterval(interval);
  }, [user.reminderEnabled, user.reminderTime, currentQuote]);

  // Task Handlers
  const handleToggleTask = (taskId: string) => {
    setTasks(prev =>
      prev.map(task => {
        if (task.id === taskId) {
          const willComplete = !task.completed;
          return {
            ...task,
            completed: willComplete,
            completedAt: willComplete ? new Date().toISOString() : undefined,
            habitStreak: (task.category === 'habit' || task.isRoutineHabit) && willComplete
              ? (task.habitStreak || 1) + 1
              : task.habitStreak
          };
        }
        return task;
      })
    );
  };

  const handleAddTask = (
    text: string,
    isPriority: boolean,
    slot?: PrioritySlot,
    timeType: TimeTaskType = 'duration',
    timeData?: {
      startTime?: string;
      endTime?: string;
      durationMinutes?: number;
      deadlineTime?: string;
      category?: TaskCategory;
      isRoutineHabit?: boolean;
    }
  ) => {
    const category: TaskCategory = timeData?.category || (isPriority ? 'priority' : timeData?.isRoutineHabit ? 'habit' : 'normal');

    const newTask: Task = {
      id: `task-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      text,
      completed: false,
      category,
      isPriority,
      prioritySlot: slot,
      order: tasks.length,
      createdAt: new Date().toISOString(),
      isRoutineHabit: timeData?.isRoutineHabit || category === 'habit',
      habitStreak: category === 'habit' ? 1 : undefined,
      timeType,
      startTime: timeData?.startTime,
      endTime: timeData?.endTime,
      durationMinutes: timeData?.durationMinutes || 25,
      deadlineTime: timeData?.deadlineTime,
      elapsedSeconds: 0,
      pomodoroSessionsCompleted: 0,
    };

    setTasks(prev => {
      if (isPriority && slot) {
        const filtered = prev.filter(t => !(t.isPriority && t.prioritySlot === slot));
        return [...filtered, newTask];
      }
      return [...prev, newTask];
    });
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
    if (activeFocusTask?.id === taskId) {
      setActiveFocusTask(null);
    }
  };

  const handleUpdateTaskText = (taskId: string, newText: string) => {
    setTasks(prev =>
      prev.map(t => (t.id === taskId ? { ...t, text: newText } : t))
    );
  };

  const handleRescheduleTask = (taskId: string, newTime: string) => {
    setTasks(prev =>
      prev.map(t => {
        if (t.id === taskId) {
          if (t.timeType === 'deadline') {
            return { ...t, deadlineTime: newTime };
          }
          const [h, m] = newTime.split(':').map(Number);
          const endH = Math.floor((h * 60 + m + (t.durationMinutes || 45)) / 60) % 24;
          const endM = (h * 60 + m + (t.durationMinutes || 45)) % 60;
          return {
            ...t,
            startTime: newTime,
            endTime: `${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`,
          };
        }
        return t;
      })
    );
  };

  const handleAssignTaskTime = (taskId: string, startTime: string, endTime: string) => {
    setTasks(prev =>
      prev.map(t => {
        if (t.id === taskId) {
          return {
            ...t,
            timeType: 'fixed',
            startTime,
            endTime,
          };
        }
        return t;
      })
    );
  };

  const handleResetTasks = (mode: 'all' | 'keep_uncompleted') => {
    if (mode === 'all') {
      setTasks([]);
      setActiveFocusTask(null);
    } else {
      setTasks(prev => prev.filter(t => !t.completed));
    }
  };

  const handleReorderTasks = (newTasks: Task[]) => {
    const reordered = newTasks.map((t, idx) => ({ ...t, order: idx }));
    setTasks(reordered);
  };

  const handleAutoArrangeChronological = () => {
    setTasks(prev => {
      const sorted = [...prev].sort((a, b) => {
        const getMinutesScore = (t: Task) => {
          if (t.timeType === 'fixed' && t.startTime) {
            const [h, m] = t.startTime.split(':').map(Number);
            return h * 60 + m;
          }
          if (t.timeType === 'deadline' && t.deadlineTime) {
            const [h, m] = t.deadlineTime.split(':').map(Number);
            return h * 60 + m + 5;
          }
          if (t.isPriority) return 1000 + (t.prioritySlot || 0);
          return 2000;
        };
        return getMinutesScore(a) - getMinutesScore(b);
      });
      return sorted.map((t, idx) => ({ ...t, order: idx }));
    });
  };

  const handleResolveRollOver = (mode: 'carry_over' | 'fresh_slate') => {
    if (mode === 'carry_over') {
      setTasks(prev => prev.filter(t => !t.completed || t.category === 'habit' || t.isRoutineHabit));
    } else {
      setTasks(prev => prev.filter(t => t.category === 'habit' || t.isRoutineHabit).map(h => ({
        ...h,
        completed: false
      })));
    }
    setPendingRollOver(null);
  };

  // Cross-Module: Add Exam Topic as a Task into today's task workspace
  const handleAddTopicAsDailyTask = (topicName: string, baselineHours: number) => {
    const durationMinutes = Math.min(120, Math.round(baselineHours * 60));
    handleAddTask(`Study Topic: ${topicName}`, false, undefined, 'duration', {
      durationMinutes,
      category: 'normal'
    });
    setStudyTopicAddedToast(`Added "${topicName}" (${durationMinutes}m focus) to Today's Workspace!`);
    setCurrentView('morning');
    fireTaskConfetti(0.5, 0.5);
    setTimeout(() => setStudyTopicAddedToast(null), 4000);
  };

  // Custom Exam Handlers
  const handleSaveCustomExam = (exam: ExamDefinition) => {
    const updated = saveCustomExam(exam);
    setExams(updated);
  };

  const handleDeleteCustomExam = (examId: string) => {
    const updated = deleteCustomExam(examId);
    setExams(updated);
    if (userExamPlan.examId === examId) {
      setUserExamPlan(prev => ({ ...prev, examId: updated[0]?.id || 'exam-neet-med' }));
    }
  };

  // FlashGenie Card & Rating Handlers
  const handleSaveFlashCard = (card: FlashCard) => {
    setFlashCards(prev => {
      const idx = prev.findIndex(c => c.id === card.id);
      if (idx >= 0) {
        return prev.map(c => c.id === card.id ? card : c);
      }
      return [card, ...prev];
    });
  };

  const handleDeleteFlashCard = (cardId: string) => {
    setFlashCards(prev => prev.filter(c => c.id !== cardId));
  };

  const handleUpdateCardRating = (cardId: string, rating: SpacedRepetitionRating) => {
    setFlashCards(prev => prev.map(c => {
      if (c.id === cardId) {
        const interval = rating === 'easy' ? 7 : rating === 'okay' ? 3 : 1;
        const status = rating === 'easy' ? 'mastered' : 'learning';
        return {
          ...c,
          intervalDays: interval,
          masteryStatus: status,
          reviewCount: c.reviewCount + 1,
          lastReviewedDate: getTodayDateString()
        };
      }
      return c;
    }));

    setFlashStats(prev => ({
      ...prev,
      cardsReviewedToday: prev.cardsReviewedToday + 1,
      totalMastered: rating === 'easy' ? prev.totalMastered + 1 : prev.totalMastered,
      masteredThisWeek: rating === 'easy' ? prev.masteredThisWeek + 1 : prev.masteredThisWeek
    }));
  };

  const handleCreateDeck = (deck: FlashGenieDeck) => {
    setFlashDecks(prev => [...prev, deck]);
  };

  // Quote Handlers
  const handlePreviousQuote = () => {
    setSelectedDayOfYear(prev => (prev > 1 ? prev - 1 : 365));
  };

  const handleNextQuote = () => {
    setSelectedDayOfYear(prev => (prev < 365 ? prev + 1 : 1));
  };

  const handleTodayQuote = () => {
    setSelectedDayOfYear(effectiveDayOfYear);
  };

  const handleToggleFavorite = (quoteId: number) => {
    setUser(prev => {
      const isFav = prev.favoriteQuoteIds.includes(quoteId);
      const updatedFavorites = isFav
        ? prev.favoriteQuoteIds.filter(id => id !== quoteId)
        : [...prev.favoriteQuoteIds, quoteId];
      return {
        ...prev,
        favoriteQuoteIds: updatedFavorites
      };
    });
  };

  const handleSaveIntention = (intention: string) => {
    setUser(prev => ({
      ...prev,
      morningIntention: intention,
      intentionDate: getTodayDateString()
    }));
  };

  const handleSelectMood = (mood: UserMood) => {
    setUser(prev => ({
      ...prev,
      currentMood: mood
    }));
  };

  const handleClearMood = () => {
    setUser(prev => ({
      ...prev,
      currentMood: undefined
    }));
  };

  const handleToggleSpotlightFocus = () => {
    setUser(prev => ({
      ...prev,
      spotlightFocusMode: !prev.spotlightFocusMode
    }));
  };

  const favoriteQuotesList = QUOTES_CMS.filter(q =>
    user.favoriteQuoteIds.includes(q.id)
  );

  return (
    <div
      className={`min-h-screen ${
        isMobileAppShell ? 'bg-slate-950 py-0 sm:py-6 px-0 sm:px-4 flex justify-center items-start' : ''
      }`}
    >
      <div
        className={`min-h-screen ${currentTheme.pageBackground} transition-all duration-500 flex flex-col pb-24 w-full ${
          isMobileAppShell
            ? 'max-w-[460px] sm:min-h-[860px] sm:rounded-[38px] sm:border-[6px] sm:border-slate-800 shadow-2xl overflow-x-hidden relative'
            : ''
        }`}
      >
        {/* Separate Websites & App Mode Quick-Switcher Strip */}
        {!isMobileAppShell && (
          <div className="bg-slate-950/90 border-b border-slate-800/80 px-3 sm:px-6 py-2 text-[11px] font-semibold text-slate-300">
            <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center flex-wrap gap-1.5">
                <span className="text-slate-400 uppercase tracking-wider text-[10px] font-bold mr-1">
                  Separate Websites:
                </span>
                <button
                  onClick={() => {
                    setAppEdition('v1.0');
                    setCurrentView('morning');
                  }}
                  className={`px-2.5 py-1 rounded-lg transition flex items-center gap-1 ${
                    appEdition === 'v1.0'
                      ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                      : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
                  }`}
                >
                  <span>☀️</span>
                  <span>1. AuraDay Website (Original v1.0)</span>
                </button>

                <button
                  onClick={() => {
                    setAppEdition('exam_only');
                    setCurrentView('exam_coach');
                  }}
                  className={`px-2.5 py-1 rounded-lg transition flex items-center gap-1 ${
                    appEdition === 'exam_only'
                      ? 'bg-sky-500 text-slate-950 font-bold shadow-sm'
                      : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
                  }`}
                >
                  <span>🎓</span>
                  <span>2. Exam Coach Website (Separate)</span>
                </button>

                <button
                  onClick={() => {
                    setAppEdition('flashgenie_only');
                    setCurrentView('flashgenie');
                  }}
                  className={`px-2.5 py-1 rounded-lg transition flex items-center gap-1 ${
                    appEdition === 'flashgenie_only'
                      ? 'bg-rose-500 text-white font-bold shadow-sm'
                      : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
                  }`}
                >
                  <span>🧞‍♂️</span>
                  <span>3. FlashGenie Website (Separate)</span>
                </button>

                <button
                  onClick={() => {
                    setAppEdition('v2.5');
                    setCurrentView('morning');
                  }}
                  className={`px-2.5 py-1 rounded-lg transition flex items-center gap-1 ${
                    appEdition === 'v2.5'
                      ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                      : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
                  }`}
                >
                  <span>✨</span>
                  <span>All-in-One v2.5</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsMobileAppShell(true)}
                  className="px-2.5 py-1 rounded-lg bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 hover:bg-indigo-500 hover:text-white transition flex items-center gap-1"
                >
                  <Smartphone className="w-3 h-3" />
                  <span>Mobile App Mode</span>
                </button>
                <button
                  onClick={() => setActiveModal('version')}
                  className="px-2.5 py-1 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-300 hover:bg-amber-500 hover:text-slate-950 transition"
                >
                  🔗 Get Separate Links
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Mobile App Status Bar Strip (Visible in Mobile App Version Mode) */}
        {isMobileAppShell && (
          <div className="bg-black/40 backdrop-blur-md px-5 py-2 flex items-center justify-between text-[11px] font-semibold border-b border-inherit/20">
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold">{getCurrentTimeHHMM()}</span>
              <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 font-mono text-[10px]">
                {appEdition === 'v2.5' ? 'AuraDay App v2.5' : 'AuraDay Classic v1.0'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsMobileAppShell(false)}
                className="text-[10px] px-2 py-0.5 rounded-md bg-sky-500/20 text-sky-300 hover:bg-sky-500 hover:text-slate-950 transition font-bold flex items-center gap-1"
                title="Switch to Widescreen Web Layout"
              >
                <Monitor className="w-3 h-3" />
                <span>Web View</span>
              </button>
              <button
                onClick={() => setActiveModal('version')}
                className="text-[10px] px-2 py-0.5 rounded-md bg-white/10 hover:bg-white/20 transition"
              >
                v{APP_VERSION_INFO.version}
              </button>
            </div>
          </div>
        )}

        {/* Top Navigation */}
        <Navbar
          themeId={themeId}
          onSelectTheme={setThemeId}
          streak={streak}
          user={user}
          currentView={currentView}
          onSelectView={setCurrentView}
          appEdition={appEdition}
          isMobileAppShell={isMobileAppShell}
          onOpenAppVersion={() => setActiveModal('version')}
          onOpenArchive={() => {
            setArchiveFilterFavorites(false);
            setActiveModal('archive');
          }}
          onOpenInsights={() => {
            setCurrentView('morning');
            setTimeout(() => {
              const el = document.getElementById('insights-section');
              if (el) {
                el.scrollIntoView({ behavior: 'smooth' });
              }
            }, 100);
          }}
          onOpenProfile={() => setActiveModal('profile')}
          onOpenStreakModal={() => setActiveModal('streak')}
        />

        {/* Cross-Module Study Task Banner */}
        {studyTopicAddedToast && (
          <div className="max-w-4xl mx-auto px-4 mt-3 w-full animate-in slide-in-from-top-2">
            <div className="p-3 rounded-2xl bg-amber-500 text-slate-950 font-bold text-xs flex items-center justify-between shadow-lg">
              <span>✨ {studyTopicAddedToast}</span>
              <button
                onClick={() => setStudyTopicAddedToast(null)}
                className="text-slate-950 hover:opacity-80 px-2 py-0.5"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Main Content Sections */}
        <main className="flex-1">
          {/* VIEW 1: MORNING FOCUS (Existing untouched Core AuraDay experience) */}
          {currentView === 'morning' && (
            <>
              {/* SECTION 1: The Welcome & Inspiration Section (Hero Section) */}
              <HeroInspiration
                quote={currentQuote}
                dayOfYear={selectedDayOfYear}
                theme={currentTheme}
                isFavorited={user.favoriteQuoteIds.includes(currentQuote.id)}
                onToggleFavorite={handleToggleFavorite}
                onPreviousQuote={handlePreviousQuote}
                onNextQuote={handleNextQuote}
                onTodayQuote={handleTodayQuote}
                isToday={isViewingTodayQuote}
                morningIntention={user.morningIntention}
                onSaveIntention={handleSaveIntention}
                streakCount={streak.currentStreak}
                onOpenStreakModal={() => setActiveModal('streak')}
                wakeUpTime={user.wakeUpTime || '06:30'}
                reminderTime={user.reminderTime || '07:15'}
                isBeforeWakeUp={!wakeUpStatus.isUnlocked && !forceRevealed}
                onOpenWakeUpSettings={() => setActiveModal('profile')}
                onForceRevealNow={() => {
                  setForceRevealed(true);
                  setSelectedDayOfYear(getDayOfYearWithWakeUp(new Date(), '00:00').dayOfYear);
                }}
                currentMood={user.currentMood}
                onSelectMood={handleSelectMood}
                onClearMood={handleClearMood}
              />

              {/* SECTION 2: The Core Task Workspace (Quick Input, Top 3 Priorities, Habits, Drag & Drop) */}
              <TaskWorkspace
                tasks={tasks}
                theme={currentTheme}
                soundEnabled={user.soundEnabled}
                confettiEnabled={user.confettiEnabled}
                hapticEnabled={user.hapticEnabled}
                spotlightFocusMode={user.spotlightFocusMode}
                onToggleSpotlightFocus={handleToggleSpotlightFocus}
                activeFocusTaskId={activeFocusTask?.id}
                onStartTimer={(task) => setActiveFocusTask(task)}
                onToggleTask={handleToggleTask}
                onAddTask={handleAddTask}
                onDeleteTask={handleDeleteTask}
                onUpdateTaskText={handleUpdateTaskText}
                onRescheduleTask={handleRescheduleTask}
                onResetTasks={handleResetTasks}
                onAssignTaskTime={handleAssignTaskTime}
                onReorderTasks={handleReorderTasks}
                onAutoArrangeChronological={handleAutoArrangeChronological}
                pendingRollOver={pendingRollOver}
                onResolveRollOver={handleResolveRollOver}
                onDismissRollOver={() => setPendingRollOver(null)}
                wakeUpTime={user.wakeUpTime || '06:30'}
              />

              {/* SECTION 3: A Quick-Insights Dashboard & 7-Day Completion */}
              <div id="insights-section">
                <InsightsDashboard
                  streak={streak}
                  theme={currentTheme}
                  user={user}
                  favoriteQuotes={favoriteQuotesList}
                  onOpenArchive={(filterFavs) => {
                    setArchiveFilterFavorites(!!filterFavs);
                    setActiveModal('archive');
                  }}
                  onOpenStreakModal={() => setActiveModal('streak')}
                />
              </div>
            </>
          )}

          {/* VIEW 2: THE EXAMINATION DATABASE & PACE COACH (GPT 5.6 TERRA) */}
          {currentView === 'exam_coach' && (appEdition === 'v2.5' || appEdition === 'exam_only') && (
            <ExamWorkspace
              exams={exams}
              userPlan={userExamPlan}
              theme={currentTheme}
              onUpdatePlan={setUserExamPlan}
              onSaveCustomExam={handleSaveCustomExam}
              onDeleteCustomExam={handleDeleteCustomExam}
              onAddTopicAsDailyTask={handleAddTopicAsDailyTask}
              onClose={() => {
                if (appEdition === 'exam_only') {
                  setAppEdition('v2.5');
                }
                setCurrentView('morning');
              }}
            />
          )}

          {/* VIEW 3: FLASHGENIE (AI VISUAL FLASHCARD GENERATOR & SPACED REPETITION) */}
          {currentView === 'flashgenie' && (appEdition === 'v2.5' || appEdition === 'flashgenie_only') && (
            <FlashGenieStudio
              cards={flashCards}
              decks={flashDecks}
              stats={flashStats}
              theme={currentTheme}
              onSaveCard={handleSaveFlashCard}
              onDeleteCard={handleDeleteFlashCard}
              onUpdateCardRating={handleUpdateCardRating}
              onCreateDeck={handleCreateDeck}
              onClose={() => {
                if (appEdition === 'flashgenie_only') {
                  setAppEdition('v2.5');
                }
                setCurrentView('morning');
              }}
            />
          )}
        </main>

        {/* Native App Bottom Tab Navigation Bar (Shown in Mobile App Version Mode or small screens) */}
        <nav
          className={`${
            isMobileAppShell ? 'sticky bottom-0 flex' : 'flex sm:hidden fixed bottom-0 left-0 right-0'
          } z-40 bg-slate-950/90 backdrop-blur-xl border-t border-slate-800 px-2 py-2 items-center justify-around text-[11px] font-semibold text-slate-400`}
        >
          <button
            onClick={() => setCurrentView('morning')}
            className={`flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition ${
              currentView === 'morning' ? 'text-amber-400 font-bold' : 'hover:text-slate-200'
            }`}
          >
            <Sun className="w-4 h-4" />
            <span>Morning</span>
          </button>

          {appEdition === 'v2.5' && (
            <>
              <button
                onClick={() => setCurrentView('exam_coach')}
                className={`flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition ${
                  currentView === 'exam_coach' ? 'text-sky-400 font-bold' : 'hover:text-slate-200'
                }`}
              >
                <GraduationCap className="w-4 h-4" />
                <span>Exam Coach</span>
              </button>

              <button
                onClick={() => setCurrentView('flashgenie')}
                className={`flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition ${
                  currentView === 'flashgenie' ? 'text-rose-400 font-bold' : 'hover:text-slate-200'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>FlashGenie</span>
              </button>
            </>
          )}

          <button
            onClick={() => {
              setArchiveFilterFavorites(false);
              setActiveModal('archive');
            }}
            className="flex flex-col items-center gap-1 px-3 py-1 rounded-xl hover:text-slate-200 transition"
          >
            <BookOpen className="w-4 h-4" />
            <span>Quotes</span>
          </button>

          <button
            onClick={() => setActiveModal('version')}
            className="flex flex-col items-center gap-1 px-3 py-1 rounded-xl text-emerald-400 hover:text-emerald-300 transition"
          >
            <Smartphone className="w-4 h-4" />
            <span>{appEdition}</span>
          </button>
        </nav>

        {/* Floating Pomodoro Focus Timer Bar */}
        {activeFocusTask && (
          <FocusTimerBar
            activeTask={activeFocusTask}
            workMinutes={user.pomodoroWorkMinutes || 25}
            breakMinutes={user.pomodoroBreakMinutes || 5}
            soundEnabled={user.soundEnabled}
            confettiEnabled={user.confettiEnabled}
            theme={currentTheme}
            onClose={() => setActiveFocusTask(null)}
            onCompleteTask={(taskId) => {
              handleToggleTask(taskId);
              setActiveFocusTask(null);
            }}
          />
        )}

        {/* Smart Reminders Toast (approaching tasks & overdue alerts with proximity push notifications) */}
        <SmartReminderToast
          tasks={tasks}
          onStartTimer={(task) => setActiveFocusTask(task)}
          onRescheduleTask={handleRescheduleTask}
        />

        {/* Modals */}
        <QuoteArchiveModal
          isOpen={activeModal === 'archive'}
          onClose={() => setActiveModal(null)}
          favoriteIds={user.favoriteQuoteIds}
          onToggleFavorite={handleToggleFavorite}
          onSelectAsCurrentQuote={(q) => setSelectedDayOfYear(q.id)}
          initialFilterFavorites={archiveFilterFavorites}
        />

        <ProfileSettingsModal
          isOpen={activeModal === 'profile'}
          onClose={() => setActiveModal(null)}
          user={user}
          onUpdateUser={setUser}
        />

        <StreakModal
          isOpen={activeModal === 'streak'}
          onClose={() => setActiveModal(null)}
          streak={streak}
        />

        <AppVersionModal
          isOpen={activeModal === 'version'}
          onClose={() => setActiveModal(null)}
          appEdition={appEdition}
          onChangeEdition={setAppEdition}
          isMobileAppShell={isMobileAppShell}
          onToggleMobileAppShell={setIsMobileAppShell}
          onSelectView={setCurrentView}
        />

        {/* Offline Connectivity Toast (PWA Requirement) */}
        <OfflineIndicator />

        {/* Aesthetic Footer */}
        <footer className="py-8 border-t border-inherit/30 text-center text-xs opacity-60">
          <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-amber-500">AuraDay</span>
              <span>· Morning Focus &amp; Exam Mastery</span>
              <button
                onClick={() => setActiveModal('version')}
                className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-mono text-[10px] font-bold hover:bg-amber-500 hover:text-slate-950 transition"
              >
                {appEdition === 'v2.5' ? 'v2.5.0' : 'v1.0.0'}
              </button>
            </div>
            <div className="flex items-center flex-wrap justify-center gap-4 text-[11px]">
              <span>Day {effectiveDayOfYear} of 365</span>
              <button
                onClick={() => setActiveModal('version')}
                className="hover:underline font-semibold text-sky-400"
              >
                App Version ({isMobileAppShell ? 'Mobile Frame' : 'Web Mode'})
              </button>
              <button
                onClick={() => {
                  setArchiveFilterFavorites(false);
                  setActiveModal('archive');
                }}
                className="hover:underline"
              >
                Quote Archive
              </button>
              {appEdition === 'v2.5' && (
                <>
                  <button
                    onClick={() => setCurrentView('exam_coach')}
                    className="hover:underline"
                  >
                    Exam Coach
                  </button>
                  <button
                    onClick={() => setCurrentView('flashgenie')}
                    className="hover:underline"
                  >
                    FlashGenie
                  </button>
                </>
              )}
              <button
                onClick={() => setActiveModal('profile')}
                className="hover:underline"
              >
                Settings
              </button>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
