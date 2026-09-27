import { Quote } from '../data/quotes';

export type PrioritySlot = 1 | 2 | 3;

export type TimeTaskType = 'fixed' | 'duration' | 'deadline';

export type TaskCategory = 'priority' | 'normal' | 'habit';

export type UserMood = 'calm' | 'energetic' | 'overwhelmed' | 'ambitious' | 'reflective';

export interface Task {
  id: string;
  text: string;
  completed: boolean;
  completedAt?: string;
  category: TaskCategory; // 'priority' (Top 3) | 'normal' | 'habit' (Routine habit)
  isPriority: boolean;
  prioritySlot?: PrioritySlot;
  order: number; // for drag-and-drop reordering
  createdAt: string;

  // Routine Habit specific
  isRoutineHabit?: boolean;
  habitStreak?: number; // consecutive days completed
  
  // Time-Task Modalities
  timeType: TimeTaskType;
  
  // Fixed appointments (Time-Stamps)
  startTime?: string; // e.g. "09:00", "14:30"
  endTime?: string;   // e.g. "10:00", "15:30"
  
  // Duration-Based (Focus Blocks)
  durationMinutes?: number; // e.g. 25, 45, 60
  elapsedSeconds?: number;
  
  // Deadline-Driven (Due By)
  deadlineTime?: string; // e.g. "17:00"
  
  // Pomodoro sessions completed
  pomodoroSessionsCompleted?: number;

  dueTime?: string; // backward compatibility
  note?: string;
}

export type ThemeId = 'dark' | 'light' | 'sunrise' | 'lavender' | 'nordic' | 'paper';

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  subtitle: string;
  isDark: boolean;
  pageBackground: string;
  cardBackground: string;
  elevatedCardBackground: string;
  borderClass: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  accentColor: string;
  accentBg: string;
  accentText: string;
  glowColor: string;
}

export interface DayProgress {
  date: string; // YYYY-MM-DD
  dayLabel: string; // Mon, Tue, etc.
  totalTasks: number;
  completedTasks: number;
  priorityCompleted: number;
  percentage: number;
}

export interface StreakState {
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string;
  completionHistory: Record<string, { total: number; completed: number; priorityCompleted: number }>;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  provider: 'google' | 'apple' | 'guest';
  wakeUpTime: string; // e.g., "06:30" - Day begins and Thought reveals
  reminderTime: string; // e.g., "07:15" - Custom reminder ping
  reminderEnabled: boolean;
  pomodoroWorkMinutes: number; // default 25
  pomodoroBreakMinutes: number; // default 5
  spotlightFocusMode: boolean; // Dims non-active tasks to eliminate distraction
  currentMood?: UserMood;
  autoRollOverEnabled: boolean; // Automatic roll-over of unfinished tasks at wake-up
  lastRolledOverDate?: string;
  soundEnabled: boolean;
  confettiEnabled: boolean;
  hapticEnabled: boolean;
  favoriteQuoteIds: number[];
  morningIntention: string;
  intentionDate: string;
}

export type { Quote };

// ==========================================
// EXAMINATION DATABASE & PACE CALIBRATION TYPES
// ==========================================

export type TopicDifficulty = 'Easy' | 'Medium' | 'Hard';

export interface ExamTopic {
  id: string;
  name: string;
  difficulty: TopicDifficulty;
  baselineHours: number; // e.g. Easy: 2.5h, Medium: 5h, Hard: 8h
  highYield?: boolean;
  notes?: string;
}

export interface ExamUnit {
  id: string;
  name: string;
  weightagePercentage?: number;
  topics: ExamTopic[];
}

export interface ExamSubject {
  id: string;
  name: string;
  color?: string;
  units: ExamUnit[];
}

export interface ExamBlueprint {
  totalSubjects: number;
  totalMarks: number;
  passingMarks?: number;
  durationMinutes: number;
  questionFormats: string[]; // e.g. ["MCQ (Single Answer)", "Numerical", "Case-Based"]
  markingScheme: string; // e.g. "+4 for correct, -1 for wrong"
}

export interface ExamDefinition {
  id: string;
  title: string;
  shortName: string;
  category: 'Medical' | 'Engineering' | 'Civil Services' | 'Aptitude & College' | 'Law & Commerce' | 'Custom';
  description: string;
  blueprint: ExamBlueprint;
  subjects: ExamSubject[];
  isCustom?: boolean;
}

export interface UserExamPlan {
  examId: string;
  targetExamDate: string; // YYYY-MM-DD
  dailyStudyHours: number; // e.g. 2, 4, 6
  bufferPercentage: number; // e.g. 0.18 (18%)
  completedTopicIds: string[];
  lastCalculatedAt?: string;
}

export interface PaceCalculationResult {
  examTitle: string;
  totalTopics: number;
  completedTopics: number;
  remainingTopics: number;
  totalBaselineHours: number;
  completedHours: number;
  remainingHours: number;
  dailyStudyHours: number;
  rawDaysNeeded: number;
  bufferPercentage: number;
  bufferDays: number;
  totalDaysNeeded: number;
  targetExamDate: string;
  availableDays: number;
  projectedCompletionDate: string;
  feasibilityStatus: 'comfortable' | 'tight' | 'impossible';
  feasibilityMessage: string;
  requiredDailyHoursForTarget: number;
  dailyTopicsTarget: number;
  strategicAdvice: string[];
}

export interface CoachChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  calculationSummary?: PaceCalculationResult;
  suggestedPrompts?: string[];
}

// ==========================================
// FLASHGENIE AI FLASHCARD GENERATOR & SPACED REPETITION
// ==========================================

export type FlashcardMastery = 'new' | 'learning' | 'mastered';
export type SpacedRepetitionRating = 'easy' | 'okay' | 'hard';

export interface FlashCard {
  id: string;
  topic: string; // 1-3 words
  subject: string;
  frontQuestion: string; // max 12 words
  backAnswer: string; // max 30 words, grade-5 reading level
  analogy: string; // single line
  mnemonic: string; // single line
  emojiChain: string; // 3-5 emojis
  imagePrompt: string; // DALL-E / Stable Diffusion cartoon infographic prompt
  difficultyLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  tags: string[];
  deckId: string;
  deckName: string;
  masteryStatus: FlashcardMastery;
  intervalDays: number; // 1 (hard), 3 (okay), 7 (easy)
  nextReviewDate: string; // YYYY-MM-DD
  lastReviewedDate?: string;
  reviewCount: number;
  createdAt: string;
  sourceImageUrl?: string;
}

export interface FlashGenieDeck {
  id: string;
  name: string;
  icon: string;
  subject: string;
  color: string;
  description: string;
}

export interface FlashGenieStats {
  streakDays: number;
  totalMastered: number;
  masteredThisWeek: number;
  cardsReviewedToday: number;
  lastReviewDate: string;
}


