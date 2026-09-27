import React, { useState } from 'react';
import {
  GraduationCap, Calendar, Clock, BookOpen, CheckCircle2, AlertTriangle,
  Flame, Plus, Trash2, ArrowRight, Sparkles, Send, Bot, User,
  Sliders, ChevronRight, ChevronDown, Check, HelpCircle, ShieldAlert,
  Percent, Layers, ListOrdered, Award, Zap, Info
} from 'lucide-react';
import {
  ExamDefinition, UserExamPlan, PaceCalculationResult, CoachChatMessage,
  ExamSubject, ExamUnit, ExamTopic, TopicDifficulty, ThemeConfig, Task
} from '../types';
import { calculateExamPace } from '../data/exams';
import { fireTaskConfetti, playSuccessChime, triggerHapticFeedback } from '../utils/feedback';

interface ExamWorkspaceProps {
  exams: ExamDefinition[];
  userPlan: UserExamPlan;
  theme: ThemeConfig;
  onUpdatePlan: (plan: UserExamPlan) => void;
  onSaveCustomExam: (exam: ExamDefinition) => void;
  onDeleteCustomExam: (examId: string) => void;
  onAddTopicAsDailyTask?: (topicName: string, baselineHours: number) => void;
  onClose?: () => void;
}

export const ExamWorkspace: React.FC<ExamWorkspaceProps> = ({
  exams,
  userPlan,
  theme,
  onUpdatePlan,
  onSaveCustomExam,
  onDeleteCustomExam,
  onAddTopicAsDailyTask,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'planner' | 'syllabus' | 'coach' | 'catalog'>('planner');
  const [selectedExamId, setSelectedExamId] = useState<string>(userPlan.examId || exams[0]?.id || 'exam-neet-med');
  
  // Custom Exam Creator Modal
  const [showCreateExamModal, setShowCreateExamModal] = useState(false);
  const [customExamName, setCustomExamName] = useState('');
  const [customCategory, setCustomCategory] = useState<'Medical' | 'Engineering' | 'Civil Services' | 'Aptitude & College' | 'Custom'>('Custom');
  const [customTotalMarks, setCustomTotalMarks] = useState<number>(500);
  const [customDuration, setCustomDuration] = useState<number>(180);
  const [customSubjectName, setCustomSubjectName] = useState('');
  const [customUnitName, setCustomUnitName] = useState('');
  const [customTopicName, setCustomTopicName] = useState('');
  const [customTopicDifficulty, setCustomTopicDifficulty] = useState<TopicDifficulty>('Medium');

  // Chat State ("GPT 5.6 Terra")
  const [chatMessages, setChatMessages] = useState<CoachChatMessage[]>([
    {
      id: 'msg-welcome',
      sender: 'assistant',
      text: "Hello! I am GPT 5.6 Terra, your Master Exam Strategist & Pace Calibration Coach. I calculate your timeline using baseline cognitive hours, your daily study pace, and a 15–20% revision buffer. How can I optimize your study schedule today?",
      timestamp: 'Just now',
      suggestedPrompts: [
        "Will I finish before my exam date?",
        "How many hours do I need to study per day?",
        "What are the highest-yield topics?",
        "Give me a 30-day crash study roadmap"
      ]
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isCoachThinking, setIsCoachThinking] = useState(false);

  // Active Exam
  const activeExam = exams.find(e => e.id === selectedExamId) || exams[0];

  // Dynamic Pace Calculation using mathematical engine
  const calculationResult: PaceCalculationResult = calculateExamPace(activeExam, userPlan);

  // Toggle Topic Completion
  const handleToggleTopic = (topicId: string) => {
    const isCompleted = userPlan.completedTopicIds.includes(topicId);
    let updated: string[];
    if (isCompleted) {
      updated = userPlan.completedTopicIds.filter(id => id !== topicId);
    } else {
      updated = [...userPlan.completedTopicIds, topicId];
      triggerHapticFeedback([25]);
      playSuccessChime(false);
    }

    const updatedPlan: UserExamPlan = {
      ...userPlan,
      completedTopicIds: updated,
      lastCalculatedAt: new Date().toISOString()
    };
    onUpdatePlan(updatedPlan);
  };

  // Plan Field Updaters
  const handleUpdateDailyHours = (hours: number) => {
    onUpdatePlan({ ...userPlan, dailyStudyHours: hours });
  };

  const handleUpdateTargetDate = (date: string) => {
    onUpdatePlan({ ...userPlan, targetExamDate: date });
  };

  const handleUpdateBuffer = (buffer: number) => {
    onUpdatePlan({ ...userPlan, bufferPercentage: buffer });
  };

  // Chat Handler (GPT 5.6 Terra Engine)
  const handleSendMessage = (textToSend?: string) => {
    const query = (textToSend || chatInput).trim();
    if (!query) return;

    const userMsg: CoachChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, userMsg]);
    setChatInput('');
    setIsCoachThinking(true);

    setTimeout(() => {
      let replyText = "";
      const lower = query.toLowerCase();

      if (lower.includes("finish") || lower.includes("date") || lower.includes("will i")) {
        if (calculationResult.feasibilityStatus === 'impossible') {
          replyText = `🚨 Diagnostic Warning: Under your current schedule of ${calculationResult.dailyStudyHours} hours/day, you will NOT finish in time for ${calculationResult.targetExamDate}. You need ${calculationResult.remainingHours} hours of study across ${calculationResult.availableDays} days. To make it, you must increase daily study time to ${calculationResult.requiredDailyHoursForTarget} hours/day, or prioritize the High-Yield topics first.`;
        } else if (calculationResult.feasibilityStatus === 'tight') {
          replyText = `⚡ Tight Pace Detected: You will complete the raw topics by ${calculationResult.projectedCompletionDate}, but your 18% buffer for mock revisions is compressed down to ${Math.max(0, calculationResult.availableDays - calculationResult.rawDaysNeeded)} days. Recommendation: Bump study time by +1 hour/day to secure full revision.`;
        } else {
          replyText = `🎯 Excellent news: Your pace is comfortable and realistic! At ${calculationResult.dailyStudyHours}h/day, you will complete the remaining ${calculationResult.remainingTopics} topics in ${calculationResult.rawDaysNeeded} days, leaving a full ${calculationResult.bufferDays}-day buffer for mock tests and revision before exam day (${calculationResult.targetExamDate}).`;
        }
      } else if (lower.includes("hours") || lower.includes("per day") || lower.includes("how many")) {
        replyText = `To comfortably finish ${calculationResult.remainingTopics} topics for ${activeExam.title} before ${calculationResult.targetExamDate}, your calibrated daily target is ${calculationResult.requiredDailyHoursForTarget} hours/day. That covers ${calculationResult.remainingHours} hours of syllabus material plus ${calculationResult.bufferDays} buffer days for revisions and rest.`;
      } else if (lower.includes("high-yield") || lower.includes("yield") || lower.includes("important")) {
        const highYieldTopics: string[] = [];
        activeExam.subjects.forEach(s => s.units.forEach(u => u.topics.filter(t => t.highYield).forEach(t => highYieldTopics.push(`${t.name} (${s.name})`))));
        replyText = `Here are the top high-yield topics for ${activeExam.title} (producing over 60% of test questions):\n\n• ${highYieldTopics.slice(0, 5).join('\n• ')}\n\nMaster these first to guarantee your core marks!`;
      } else if (lower.includes("roadmap") || lower.includes("schedule") || lower.includes("plan")) {
        replyText = `Here is your GPT 5.6 Terra Recommended Weekly Roadmap:\n\n1. Morning Block (7:00 - 9:00 AM): Hard difficulty topics while cognitive energy is peak.\n2. Afternoon Block: 20 FlashGenie active recall flashcards.\n3. Evening Block (7:00 - 9:00 PM): Practice problem sets + mock questions.\n4. Sunday: Weekly diagnostic test and topic revision.`;
      } else {
        replyText = `I analyzed your progress on ${activeExam.title}. You've completed ${calculationResult.completedTopics}/${calculationResult.totalTopics} topics (${Math.round((calculationResult.completedTopics/calculationResult.totalTopics)*100)}%). At your pace of ${calculationResult.dailyStudyHours}h/day, you require ${calculationResult.totalDaysNeeded} days total. Keep up consistent morning focus!`;
      }

      const botMsg: CoachChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        calculationSummary: calculationResult,
        suggestedPrompts: [
          "Show me High-Yield topics",
          "Recalculate at 6 hours/day",
          "Give me an active recall routine"
        ]
      };

      setChatMessages(prev => [...prev, botMsg]);
      setIsCoachThinking(false);
      playSuccessChime(false);
    }, 700);
  };

  // Custom Exam Submission
  const handleCreateCustomExamSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customExamName.trim()) return;

    const newExam: ExamDefinition = {
      id: `custom-exam-${Date.now()}`,
      title: customExamName.trim(),
      shortName: customExamName.trim().slice(0, 18),
      category: customCategory,
      description: `Custom syllabus created by student targeting ${customExamName}.`,
      blueprint: {
        totalSubjects: 1,
        totalMarks: customTotalMarks,
        durationMinutes: customDuration,
        questionFormats: ['MCQs', 'Subjective Problems'],
        markingScheme: 'Custom score model'
      },
      isCustom: true,
      subjects: [
        {
          id: `sub-${Date.now()}`,
          name: customSubjectName || 'Core Subject',
          color: 'amber',
          units: [
            {
              id: `unit-${Date.now()}`,
              name: customUnitName || 'Unit 1: Fundamentals',
              weightagePercentage: 100,
              topics: [
                {
                  id: `top-${Date.now()}-1`,
                  name: customTopicName || 'Core Topic 1',
                  difficulty: customTopicDifficulty,
                  baselineHours: customTopicDifficulty === 'Easy' ? 3 : customTopicDifficulty === 'Medium' ? 5 : 8,
                  highYield: true
                },
                {
                  id: `top-${Date.now()}-2`,
                  name: `${customTopicName || 'Core Topic'} Application & Problem Solving`,
                  difficulty: 'Medium',
                  baselineHours: 4.5,
                  highYield: true
                }
              ]
            }
          ]
        }
      ]
    };

    onSaveCustomExam(newExam);
    setSelectedExamId(newExam.id);
    onUpdatePlan({ ...userPlan, examId: newExam.id });
    setShowCreateExamModal(false);
    setCustomExamName('');
    fireTaskConfetti(0.5, 0.5);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-2xl shadow-lg shadow-sky-500/20 text-white font-bold">
            🎓
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Exam Master &amp; Pace Coach</h1>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-400 border border-sky-500/30">
                GPT 5.6 Terra Engine
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Master blueprint catalogs, difficulty ratings, standard baseline hours &amp; calibrated pacing with buffer logic.
            </p>
          </div>
        </div>

        {/* Exam Selection Dropdown */}
        <div className="flex items-center gap-2">
          <select
            value={selectedExamId}
            onChange={(e) => {
              setSelectedExamId(e.target.value);
              onUpdatePlan({ ...userPlan, examId: e.target.value });
            }}
            className="px-3 py-2 text-xs font-bold rounded-xl border border-inherit bg-slate-900 text-slate-100 shadow-sm"
          >
            {exams.map(exam => (
              <option key={exam.id} value={exam.id}>
                {exam.shortName} {exam.isCustom ? '★ (Custom)' : ''}
              </option>
            ))}
          </select>

          <button
            onClick={() => setShowCreateExamModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-amber-500 text-slate-950 hover:bg-amber-400 transition active:scale-95 shadow-md shadow-amber-500/20 whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Create Custom Exam</span>
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center justify-between border-b border-inherit/40 pb-3 mb-6">
        <div className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => setActiveTab('planner')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition ${
              activeTab === 'planner'
                ? 'bg-sky-500 text-slate-950 font-bold shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-500/10'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Pace Calibration Engine</span>
          </button>

          <button
            onClick={() => setActiveTab('syllabus')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition ${
              activeTab === 'syllabus'
                ? 'bg-sky-500 text-slate-950 font-bold shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-500/10'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Syllabus Hierarchy ({calculationResult.completedTopics}/{calculationResult.totalTopics})</span>
          </button>

          <button
            onClick={() => setActiveTab('coach')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition ${
              activeTab === 'coach'
                ? 'bg-sky-500 text-slate-950 font-bold shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-500/10'
            }`}
          >
            <Bot className="w-4 h-4" />
            <span>GPT 5.6 Terra Coach</span>
          </button>

          <button
            onClick={() => setActiveTab('catalog')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition ${
              activeTab === 'catalog'
                ? 'bg-sky-500 text-slate-950 font-bold shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-500/10'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Blueprint Catalog</span>
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* TAB 1: PACE CALIBRATION ENGINE (Mathematical Rules)       */}
      {/* ========================================================= */}
      {activeTab === 'planner' && (
        <div className="space-y-6">
          {/* Real-Time Feasibility Alert Banner */}
          <div className={`p-4 rounded-3xl border shadow-lg transition-all ${
            calculationResult.feasibilityStatus === 'impossible'
              ? 'bg-rose-950/40 border-rose-500/50 text-rose-200'
              : calculationResult.feasibilityStatus === 'tight'
              ? 'bg-amber-950/40 border-amber-500/50 text-amber-200'
              : 'bg-emerald-950/30 border-emerald-500/50 text-emerald-200'
          }`}>
            <div className="flex items-start gap-3">
              <div className="mt-0.5">
                {calculationResult.feasibilityStatus === 'impossible' ? (
                  <ShieldAlert className="w-6 h-6 text-rose-400 animate-pulse" />
                ) : calculationResult.feasibilityStatus === 'tight' ? (
                  <AlertTriangle className="w-6 h-6 text-amber-400" />
                ) : (
                  <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider">
                    {calculationResult.feasibilityStatus === 'impossible'
                      ? 'Physically Impossible Timeline Warning'
                      : calculationResult.feasibilityStatus === 'tight'
                      ? 'Tight Pace Required'
                      : 'Realistic & Scientifically Calibrated'}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-black/40 font-mono font-bold">
                    Target: {calculationResult.targetExamDate || 'Not set'}
                  </span>
                </div>
                <p className="text-sm font-semibold mt-1 leading-snug">
                  {calculationResult.feasibilityMessage}
                </p>
                <div className="mt-2 text-xs opacity-80 flex flex-wrap items-center gap-3">
                  <span>Available: <strong>{calculationResult.availableDays} days</strong></span>
                  <span>·</span>
                  <span>Days Needed with Buffer: <strong>{calculationResult.totalDaysNeeded} days</strong></span>
                  <span>·</span>
                  <span>Required Daily Pace: <strong>{calculationResult.requiredDailyHoursForTarget} hrs/day</strong></span>
                </div>
              </div>
            </div>
          </div>

          {/* Mathematical Pace Formula Controls Card */}
          <div className={`p-5 sm:p-6 rounded-3xl border ${theme.cardBackground} shadow-lg space-y-5`}>
            <div className="flex items-center justify-between border-b border-inherit/40 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-sky-400">
                Calibrate Your Study Parameters
              </span>
              <span className="text-xs text-slate-400">
                Formula: (Remaining Baseline Hours / Daily Hours) × (1 + Buffer%)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Parameter 1: Target Exam Date */}
              <div className="p-4 rounded-2xl bg-black/20 border border-inherit/40 space-y-1.5">
                <label className="flex items-center gap-1.5 text-xs font-bold text-slate-300">
                  <Calendar className="w-3.5 h-3.5 text-sky-400" />
                  <span>Target Exam Date:</span>
                </label>
                <input
                  type="date"
                  value={userPlan.targetExamDate}
                  onChange={(e) => handleUpdateTargetDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-inherit bg-slate-900 text-slate-100"
                />
                <span className="text-[10px] text-slate-400 block">
                  {calculationResult.availableDays} calendar days remaining
                </span>
              </div>

              {/* Parameter 2: User Speed Multiplier (Daily Hours) */}
              <div className="p-4 rounded-2xl bg-black/20 border border-inherit/40 space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span>Daily Study Hours:</span>
                  </span>
                  <span className="text-amber-400 font-mono">{userPlan.dailyStudyHours}h / day</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="12"
                  step="0.5"
                  value={userPlan.dailyStudyHours}
                  onChange={(e) => handleUpdateDailyHours(parseFloat(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>1h (Light)</span>
                  <span>4h (Standard)</span>
                  <span>8h (Intense)</span>
                  <span>12h</span>
                </div>
              </div>

              {/* Parameter 3: Buffer Time Logic (15% - 20% Extra Days) */}
              <div className="p-4 rounded-2xl bg-black/20 border border-inherit/40 space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <Percent className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Buffer Time (Revision):</span>
                  </span>
                  <span className="text-emerald-400 font-mono">
                    {Math.round(userPlan.bufferPercentage * 100)}% (+{calculationResult.bufferDays}d)
                  </span>
                </div>
                <input
                  type="range"
                  min="0.10"
                  max="0.25"
                  step="0.01"
                  value={userPlan.bufferPercentage}
                  onChange={(e) => handleUpdateBuffer(parseFloat(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>10%</span>
                  <span>18% (Recommended)</span>
                  <span>25% (Safe)</span>
                </div>
              </div>
            </div>

            {/* Calculated Metrics Dashboard */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 text-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Remaining Study
                </span>
                <span className="text-lg sm:text-xl font-bold font-mono text-sky-400">
                  {calculationResult.remainingHours} hrs
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  Across {calculationResult.remainingTopics} topics
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 text-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Raw Study Days
                </span>
                <span className="text-lg sm:text-xl font-bold font-mono text-amber-400">
                  {calculationResult.rawDaysNeeded} days
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  At {calculationResult.dailyStudyHours}h per day
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 text-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Revision Buffer
                </span>
                <span className="text-lg sm:text-xl font-bold font-mono text-emerald-400">
                  +{calculationResult.bufferDays} days
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  For mocks &amp; rest
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 text-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Projected Finish
                </span>
                <span className="text-lg sm:text-xl font-bold font-mono text-purple-400">
                  {calculationResult.projectedCompletionDate}
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  Total {calculationResult.totalDaysNeeded} days
                </span>
              </div>
            </div>

            {/* Strategic Advice Points */}
            <div className="p-4 rounded-2xl bg-black/20 border border-inherit/40 space-y-2">
              <span className="text-xs font-bold text-slate-300 block">
                🧠 GPT 5.6 Terra Strategic Advice for {activeExam.title}:
              </span>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {calculationResult.strategicAdvice.map((adv, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-amber-400 font-bold">•</span>
                    <span>{adv}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: SYLLABUS HIERARCHY (Exam -> Subject -> Unit -> Topic) */}
      {/* ========================================================= */}
      {activeTab === 'syllabus' && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 bg-black/20 p-4 rounded-3xl border border-inherit/40">
            <div>
              <h2 className="text-base font-bold text-slate-100">{activeExam.title}</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Check off topics as you master them. Pacing recalibrates in real-time.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-3 py-1 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/30">
                {calculationResult.completedTopics} of {calculationResult.totalTopics} Completed ({Math.round((calculationResult.completedTopics/calculationResult.totalTopics)*100)}%)
              </span>
            </div>
          </div>

          {/* Subjects Hierarchy Accordion */}
          <div className="space-y-4">
            {activeExam.subjects.map(subject => (
              <div key={subject.id} className="rounded-2xl border border-inherit/40 bg-slate-900/60 overflow-hidden">
                <div className="p-4 bg-slate-800/40 border-b border-slate-700/50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                    <h3 className="text-sm font-bold text-slate-100">{subject.name}</h3>
                  </div>
                  <span className="text-xs text-slate-400">{subject.units.length} Units</span>
                </div>

                <div className="p-4 space-y-4">
                  {subject.units.map(unit => (
                    <div key={unit.id} className="space-y-2">
                      <div className="flex items-center justify-between text-xs font-semibold text-slate-400 border-b border-slate-800 pb-1">
                        <span>{unit.name}</span>
                        {unit.weightagePercentage && (
                          <span className="text-amber-400 font-mono">~{unit.weightagePercentage}% Weightage</span>
                        )}
                      </div>

                      <div className="grid grid-cols-1 gap-2">
                        {unit.topics.map(topic => {
                          const isDone = userPlan.completedTopicIds.includes(topic.id);

                          return (
                            <div
                              key={topic.id}
                              className={`p-3 rounded-xl border flex items-center justify-between gap-3 transition ${
                                isDone
                                  ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-200'
                                  : 'bg-black/20 border-slate-800 hover:border-slate-700 text-slate-200'
                              }`}
                            >
                              <div className="flex items-center gap-3 min-w-0 flex-1">
                                <button
                                  onClick={() => handleToggleTopic(topic.id)}
                                  className={`w-5 h-5 rounded-md border flex items-center justify-center transition flex-shrink-0 ${
                                    isDone
                                      ? 'bg-emerald-500 border-emerald-500 text-slate-950'
                                      : 'border-slate-500 hover:border-amber-400'
                                  }`}
                                >
                                  {isDone && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                                </button>

                                <div className="min-w-0">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className={`text-xs font-medium leading-snug ${isDone ? 'line-through opacity-60' : ''}`}>
                                      {topic.name}
                                    </span>
                                    {topic.highYield && (
                                      <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                                        High Yield
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-2 flex-shrink-0">
                                {/* Difficulty Badge */}
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                  topic.difficulty === 'Hard'
                                    ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                                    : topic.difficulty === 'Medium'
                                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                    : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                }`}>
                                  {topic.difficulty} ({topic.baselineHours}h)
                                </span>

                                {/* Quick Add to AuraDay Daily Workspace */}
                                {onAddTopicAsDailyTask && !isDone && (
                                  <button
                                    onClick={() => onAddTopicAsDailyTask(topic.name, topic.baselineHours)}
                                    title="Add to today's priority task list"
                                    className="p-1.5 rounded-lg border border-slate-700 hover:border-amber-500 text-slate-400 hover:text-amber-400 transition"
                                  >
                                    <Plus className="w-3 h-3" />
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 3: GPT 5.6 TERRA EXAM COACH CHATBOT                   */}
      {/* ========================================================= */}
      {activeTab === 'coach' && (
        <div className="space-y-4">
          {/* Chat Container */}
          <div className="rounded-3xl border border-inherit/40 bg-slate-900/80 shadow-2xl flex flex-col h-[520px] overflow-hidden">
            {/* Chat Header */}
            <div className="p-3.5 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-sm font-bold text-white shadow-md">
                  🤖
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
                    <span>GPT 5.6 Terra</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  </h3>
                  <p className="text-[10px] text-slate-400">Master Cognitive &amp; Pace Planner · Online</p>
                </div>
              </div>

              <div className="text-[11px] font-mono font-bold text-sky-400 bg-sky-500/10 px-2.5 py-1 rounded-lg border border-sky-500/20">
                Pace: {calculationResult.dailyStudyHours}h/day ({calculationResult.feasibilityStatus})
              </div>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3.5">
              {chatMessages.map(msg => (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.sender === 'assistant' && (
                    <div className="w-7 h-7 rounded-xl bg-sky-500/20 border border-sky-500/40 text-sky-400 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                      🤖
                    </div>
                  )}

                  <div className={`max-w-md p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-sky-600 text-white rounded-tr-none'
                      : 'bg-slate-800/90 text-slate-100 border border-slate-700/60 rounded-tl-none whitespace-pre-line'
                  }`}>
                    {msg.text}

                    {msg.calculationSummary && (
                      <div className="mt-2.5 pt-2 border-t border-slate-700/80 text-[11px] font-mono grid grid-cols-2 gap-2 text-slate-300">
                        <div>Finish: <strong>{msg.calculationSummary.projectedCompletionDate}</strong></div>
                        <div>Target: <strong>{msg.calculationSummary.requiredDailyHoursForTarget}h/d</strong></div>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isCoachThinking && (
                <div className="flex items-center gap-2 text-xs text-sky-400 font-semibold p-2">
                  <span className="animate-spin">⚙️</span>
                  <span>GPT 5.6 Terra calculating timeline &amp; buffer...</span>
                </div>
              )}
            </div>

            {/* Quick Prompts Bar */}
            <div className="px-3 py-2 border-t border-slate-800 bg-slate-950/40 flex items-center gap-1.5 overflow-x-auto text-[11px]">
              <span className="text-slate-400 flex-shrink-0 font-semibold">Suggested:</span>
              {[
                "Will I finish before my exam date?",
                "What are the highest-yield topics?",
                "How many hours do I need to study per day?",
                "30-day crash study roadmap"
              ].map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => handleSendMessage(prompt)}
                  className="px-2.5 py-1 rounded-lg border border-slate-700 hover:border-sky-500 bg-slate-900/80 text-slate-300 hover:text-sky-300 whitespace-nowrap transition"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <div className="p-3 border-t border-slate-800 bg-slate-950 flex items-center gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask GPT 5.6 Terra about your exam pace, topics, or strategy..."
                className="flex-1 px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-700 bg-slate-900 text-slate-100 focus:outline-none focus:ring-1 focus:ring-sky-500 placeholder:opacity-40"
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={!chatInput.trim() || isCoachThinking}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-sky-500 text-slate-950 hover:bg-sky-400 transition active:scale-95 disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 4: BLUEPRINT CATALOG                                  */}
      {/* ========================================================= */}
      {activeTab === 'catalog' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {exams.map(exam => {
              const isSelected = exam.id === selectedExamId;

              return (
                <div
                  key={exam.id}
                  className={`p-5 rounded-3xl border transition space-y-3 ${
                    isSelected
                      ? 'bg-sky-950/20 border-sky-500 ring-2 ring-sky-500/20 shadow-lg'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-sky-400">
                      {exam.category}
                    </span>
                    {exam.isCustom && (
                      <button
                        onClick={() => onDeleteCustomExam(exam.id)}
                        className="p-1 text-rose-400 hover:bg-rose-500/10 rounded"
                        title="Delete custom exam"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-slate-100">{exam.title}</h3>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      {exam.description}
                    </p>
                  </div>

                  {/* Blueprint Summary */}
                  <div className="p-3 rounded-2xl bg-black/20 border border-slate-800 text-xs space-y-1">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Total Marks:</span>
                      <span className="font-bold text-slate-200">{exam.blueprint.totalMarks} marks</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Duration:</span>
                      <span className="font-bold text-slate-200">{exam.blueprint.durationMinutes} mins</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Marking Scheme:</span>
                      <span className="font-bold text-amber-400 text-[11px] truncate max-w-[180px]">{exam.blueprint.markingScheme}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedExamId(exam.id);
                      onUpdatePlan({ ...userPlan, examId: exam.id });
                      setActiveTab('planner');
                    }}
                    className={`w-full py-2 rounded-xl text-xs font-bold transition ${
                      isSelected
                        ? 'bg-sky-500 text-slate-950'
                        : 'border border-slate-700 hover:border-sky-500 text-slate-300'
                    }`}
                  >
                    {isSelected ? 'Currently Selected Exam' : 'Select This Exam'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: CREATE CUSTOM EXAM                                 */}
      {/* ========================================================= */}
      {showCreateExamModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-700 p-6 text-slate-100 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">✍️</span>
                <h3 className="text-base font-bold">Create Custom Exam &amp; Syllabus</h3>
              </div>
              <button
                onClick={() => setShowCreateExamModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCustomExamSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Exam Title:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CFA Level 1, Bar Exam, USMLE Step 1, Midterm Calculus..."
                  value={customExamName}
                  onChange={(e) => setCustomExamName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-700 bg-slate-950 text-slate-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Total Marks:</label>
                  <input
                    type="number"
                    value={customTotalMarks}
                    onChange={(e) => setCustomTotalMarks(parseInt(e.target.value, 10))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-700 bg-slate-950 text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Exam Duration (Mins):</label>
                  <input
                    type="number"
                    value={customDuration}
                    onChange={(e) => setCustomDuration(parseInt(e.target.value, 10))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-700 bg-slate-950 text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Subject Name:</label>
                <input
                  type="text"
                  placeholder="e.g. Financial Reporting & Analysis"
                  value={customSubjectName}
                  onChange={(e) => setCustomSubjectName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-700 bg-slate-950 text-slate-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">First Topic Name:</label>
                  <input
                    type="text"
                    placeholder="e.g. Cash Flow Statement Analysis"
                    value={customTopicName}
                    onChange={(e) => setCustomTopicName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-700 bg-slate-950 text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Difficulty:</label>
                  <select
                    value={customTopicDifficulty}
                    onChange={(e) => setCustomTopicDifficulty(e.target.value as TopicDifficulty)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-700 bg-slate-950 text-slate-100 font-bold"
                  >
                    <option value="Easy">Easy (3 hrs baseline)</option>
                    <option value="Medium">Medium (5 hrs baseline)</option>
                    <option value="Hard">Hard (8 hrs baseline)</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateExamModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl font-bold bg-amber-500 text-slate-950 hover:bg-amber-400"
                >
                  Create &amp; Calibrate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
