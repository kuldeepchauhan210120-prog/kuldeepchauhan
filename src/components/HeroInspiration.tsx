import React, { useState, useEffect } from 'react';
import {
  Share2, Heart, Copy, Check, Twitter, MessageCircle, Sparkles,
  ChevronLeft, ChevronRight, RotateCcw, Flame, Sun, Moon, Bell,
  Clock, Lock, Unlock, Zap, Smile, Compass, CloudRain
} from 'lucide-react';
import { Quote } from '../data/quotes';
import { ThemeConfig, UserMood } from '../types';
import { formatTime12Hour } from '../utils/time';

interface HeroInspirationProps {
  quote: Quote;
  dayOfYear: number;
  totalDays?: number;
  theme: ThemeConfig;
  isFavorited: boolean;
  onToggleFavorite: (quoteId: number) => void;
  onPreviousQuote: () => void;
  onNextQuote: () => void;
  onTodayQuote: () => void;
  isToday: boolean;
  morningIntention: string;
  onSaveIntention: (val: string) => void;
  streakCount: number;
  onOpenStreakModal: () => void;
  wakeUpTime: string;
  reminderTime: string;
  isBeforeWakeUp?: boolean;
  onOpenWakeUpSettings?: () => void;
  onForceRevealNow?: () => void;
  currentMood?: UserMood;
  onSelectMood?: (mood: UserMood) => void;
  onClearMood?: () => void;
}

const MOODS: { id: UserMood; label: string; emoji: string; desc: string; color: string }[] = [
  { id: 'energetic', label: 'Energized', emoji: '⚡', desc: 'Discipline & Action', color: 'from-amber-500/20 to-orange-500/20 text-amber-400 border-amber-500/40' },
  { id: 'calm', label: 'Calm', emoji: '🧘', desc: 'Peace & Mindfulness', color: 'from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/40' },
  { id: 'ambitious', label: 'Focused', emoji: '🎯', desc: 'Clarity & High Goals', color: 'from-sky-500/20 to-blue-500/20 text-sky-400 border-sky-500/40' },
  { id: 'overwhelmed', label: 'Overwhelmed', emoji: '🌧️', desc: 'Gentle Resilience', color: 'from-indigo-500/20 to-purple-500/20 text-indigo-300 border-indigo-500/40' },
  { id: 'reflective', label: 'Reflective', emoji: '🔥', desc: 'Wisdom & Courage', color: 'from-rose-500/20 to-amber-500/20 text-rose-400 border-rose-500/40' }
];

export const HeroInspiration: React.FC<HeroInspirationProps> = ({
  quote,
  dayOfYear,
  totalDays = 365,
  theme,
  isFavorited,
  onToggleFavorite,
  onPreviousQuote,
  onNextQuote,
  onTodayQuote,
  isToday,
  morningIntention,
  onSaveIntention,
  streakCount,
  onOpenStreakModal,
  wakeUpTime = '06:30',
  reminderTime = '07:15',
  isBeforeWakeUp = false,
  onOpenWakeUpSettings,
  onForceRevealNow,
  currentMood,
  onSelectMood,
  onClearMood,
}) => {
  const [copied, setCopied] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [intentionInput, setIntentionInput] = useState(morningIntention);
  const [isEditingIntention, setIsEditingIntention] = useState(false);
  const [intentionSavedToast, setIntentionSavedToast] = useState(false);
  const [secondsUntilWakeUp, setSecondsUntilWakeUp] = useState<number>(0);

  // Calculate live countdown until wake up time
  useEffect(() => {
    if (!isBeforeWakeUp) return;

    const updateCountdown = () => {
      const now = new Date();
      const [wH, wM] = wakeUpTime.split(':').map(Number);
      const wakeDate = new Date(now);
      wakeDate.setHours(wH, wM, 0, 0);

      // If wake time already passed today, it's for tomorrow
      if (wakeDate.getTime() <= now.getTime()) {
        wakeDate.setDate(wakeDate.getDate() + 1);
      }

      const diffSecs = Math.max(0, Math.floor((wakeDate.getTime() - now.getTime()) / 1000));
      setSecondsUntilWakeUp(diffSecs);
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, [isBeforeWakeUp, wakeUpTime]);

  const formatCountdown = (secs: number) => {
    const hours = Math.floor(secs / 3600);
    const minutes = Math.floor((secs % 3600) / 60);
    const seconds = secs % 60;
    if (hours > 0) {
      return `${hours}h ${String(minutes).padStart(2, '0')}m ${String(seconds).padStart(2, '0')}s`;
    }
    return `${minutes}m ${String(seconds).padStart(2, '0')}s`;
  };

  const formattedDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  }).format(new Date());

  const handleCopyQuote = () => {
    const textToCopy = `"${quote.quote}" — ${quote.author} (via AuraDay)`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTweet = () => {
    const tweetText = `"${quote.quote}" — ${quote.author}\n\nToday's thought of the day on AuraDay ☀️ #DailyInspiration #Mindfulness #Focus`;
    const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;
    window.open(tweetUrl, '_blank', 'noopener,noreferrer');
    setShowShareMenu(false);
  };

  const handleWhatsApp = () => {
    const text = `"${quote.quote}" — ${quote.author} ✨ Shared from AuraDay Morning Focus`;
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
    setShowShareMenu(false);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `AuraDay - Thought of the Day`,
          text: `"${quote.quote}" — ${quote.author}`,
          url: window.location.href
        });
        setShowShareMenu(false);
      } catch {
        // User cancelled share
      }
    } else {
      handleCopyQuote();
      setShowShareMenu(false);
    }
  };

  const handleSaveIntentionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveIntention(intentionInput);
    setIsEditingIntention(false);
    setIntentionSavedToast(true);
    setTimeout(() => setIntentionSavedToast(false), 2500);
  };

  return (
    <section className="relative pt-6 pb-10 sm:pt-10 sm:pb-14 transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Subtle Date, Wake-Up Trigger & Anchor Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm font-medium opacity-80">
            <span>{formattedDate}</span>
            <span aria-hidden="true" className="opacity-40">·</span>
            <span>Day {dayOfYear} of {totalDays}</span>
            {!isToday && (
              <button
                onClick={onTodayQuote}
                className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-500 hover:bg-amber-500/30 transition"
              >
                <RotateCcw className="w-3 h-3" />
                Return to Today
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {/* Wake-Up Time Trigger Pill */}
            <button
              onClick={onOpenWakeUpSettings}
              title="Personalized Morning Motivation: Adjust your wake-up day start time"
              className="flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-full border border-inherit/40 hover:border-amber-500/50 bg-black/5 hover:bg-amber-500/10 transition"
            >
              {isBeforeWakeUp ? (
                <Moon className="w-3 h-3 text-indigo-400" />
              ) : (
                <Sun className="w-3 h-3 text-amber-500" />
              )}
              <span>Wake: {formatTime12Hour(wakeUpTime)}</span>
            </button>

            {/* Custom Reminder Ping */}
            <button
              onClick={onOpenWakeUpSettings}
              title="Custom Reminder Ping: Scheduled daily alert time"
              className="hidden sm:flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-full border border-inherit/40 hover:border-amber-500/50 bg-black/5 hover:bg-amber-500/10 transition"
            >
              <Bell className="w-3 h-3 text-emerald-400" />
              <span>Ping: {formatTime12Hour(reminderTime)}</span>
            </button>

            {/* Category tag */}
            <div className="text-xs font-semibold uppercase tracking-wider text-amber-500/90 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              {quote.category}
            </div>

            {/* Streak Anchor */}
            <button
              onClick={onOpenStreakModal}
              className="flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-md bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 border border-amber-500/20 transition"
            >
              <Flame className="w-3.5 h-3.5 fill-amber-500" />
              <span>{streakCount}d</span>
            </button>
          </div>
        </div>

        {/* Micro-Interaction: Morning Mood Check-In */}
        <div className="mb-4 p-3 sm:p-4 rounded-2xl border border-inherit/40 bg-black/10 backdrop-blur-sm">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
            <div className="flex items-center gap-2">
              <Smile className="w-4 h-4 text-amber-500" />
              <span className="text-xs sm:text-sm font-semibold tracking-tight">
                Morning Mood Check-in:
              </span>
              <span className="text-xs opacity-70 hidden sm:inline">
                How is your energy starting today?
              </span>
            </div>
            {currentMood && onClearMood && (
              <button
                onClick={onClearMood}
                className="text-[11px] font-medium text-amber-500 hover:underline flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset to Daily Sequence</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {MOODS.map(m => {
              const isSelected = currentMood === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => onSelectMood?.(m.id)}
                  className={`flex items-center sm:flex-col justify-start sm:justify-center gap-2 p-2 sm:p-2.5 rounded-xl border text-xs transition-all active:scale-95 text-left sm:text-center ${
                    isSelected
                      ? `bg-gradient-to-br ${m.color} ring-2 ring-amber-500/50 shadow-md font-bold scale-[1.02]`
                      : 'border-inherit/30 hover:border-amber-500/30 hover:bg-slate-500/10 opacity-80 hover:opacity-100'
                  }`}
                >
                  <span className="text-base sm:text-lg">{m.emoji}</span>
                  <div>
                    <div className="font-semibold leading-tight">{m.label}</div>
                    <div className="text-[10px] opacity-60 leading-none mt-0.5">{m.desc}</div>
                  </div>
                </button>
              );
            })}
          </div>

          {currentMood && (
            <div className="mt-2 text-[11px] text-amber-400/90 flex items-center gap-1 font-medium">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Thought of the Day tailored for your <strong>{MOODS.find(m => m.id === currentMood)?.label}</strong> mindset.</span>
            </div>
          )}
        </div>

        {/* SECTION 1 CARD: Pre-Dawn Locked Anticipation OR Unlocked Daily Thought Display */}
        {isBeforeWakeUp ? (
          /* LOCKED STATE CARD */
          <div
            className={`relative rounded-3xl p-6 sm:p-10 transition-all duration-300 border border-indigo-500/30 bg-indigo-950/40 text-indigo-100 text-center flex flex-col items-center justify-center`}
            style={{
              boxShadow: `0 20px 40px -15px rgba(99, 102, 241, 0.25)`
            }}
          >
            <div className="w-16 h-16 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300 mb-4 animate-pulse">
              <Lock className="w-8 h-8" />
            </div>

            <span className="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-1">
              Pre-Dawn Sanctuary · Day {dayOfYear}
            </span>

            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-slate-100 max-w-lg mb-2">
              Your Daily Thought is Awakening
            </h3>

            <p className="text-sm opacity-80 max-w-md mb-6 leading-relaxed">
              Your mind is resting in stillness. The new Thought of the Day is set to lock until your morning begins at <strong>{formatTime12Hour(wakeUpTime)}</strong>.
            </p>

            {/* Countdown Badge */}
            <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-black/40 border border-indigo-500/40 text-sm font-mono font-bold text-amber-400 mb-6">
              <Clock className="w-4 h-4 text-amber-400 animate-spin" />
              <span>Unlocks in: {formatCountdown(secondsUntilWakeUp)}</span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              {onForceRevealNow && (
                <button
                  onClick={onForceRevealNow}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-amber-500 text-slate-950 hover:bg-amber-400 transition active:scale-95 shadow-lg shadow-amber-500/20"
                >
                  <Unlock className="w-4 h-4" />
                  <span>Early Riser? Reveal Thought Now</span>
                </button>
              )}

              <button
                onClick={onOpenWakeUpSettings}
                className="px-4 py-2 rounded-xl text-xs font-semibold border border-inherit/40 hover:border-indigo-400 text-slate-300 hover:text-white transition"
              >
                Change Wake-Up Time
              </button>
            </div>
          </div>
        ) : (
          /* UNLOCKED FULL EDITORIAL QUOTE CARD */
          <div
            className={`relative rounded-3xl p-6 sm:p-10 transition-all duration-300 ${theme.cardBackground}`}
            style={{
              boxShadow: `0 20px 40px -15px ${theme.glowColor}`
            }}
          >
          {/* Subtle quotation watermark */}
          <div
            className="absolute top-4 right-6 text-7xl sm:text-8xl select-none pointer-events-none font-serif opacity-10 leading-none"
            aria-hidden="true"
          >
            “
          </div>

          {/* Quotation text */}
          <div className="relative z-10">
            <blockquote className="font-serif-quote text-2xl sm:text-3xl md:text-4xl lg:text-[2.65rem] font-medium leading-[1.3] sm:leading-[1.28] tracking-tight text-balance">
              “{quote.quote}”
            </blockquote>

            {/* Author citation */}
            <div className="mt-5 sm:mt-6 flex flex-wrap items-center justify-between gap-4">
              <cite className="not-italic flex items-center gap-2">
                <span className="w-6 h-[2px] bg-amber-500 inline-block rounded-full" />
                <span className="text-base sm:text-lg font-semibold tracking-wide">
                  {quote.author}
                </span>
                {quote.source && (
                  <span className="text-xs opacity-60">({quote.source})</span>
                )}
              </cite>

              {/* Card Interactive Controls: Quote cycle, favorite, share, copy */}
              <div className="flex items-center gap-1.5 sm:gap-2">
                {/* Previous quote */}
                <button
                  onClick={onPreviousQuote}
                  title="Previous Day's Thought"
                  className="p-2 rounded-xl text-xs opacity-70 hover:opacity-100 hover:bg-slate-500/15 transition active:scale-95"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {/* Next quote */}
                <button
                  onClick={onNextQuote}
                  title="Next Day's Thought"
                  className="p-2 rounded-xl text-xs opacity-70 hover:opacity-100 hover:bg-slate-500/15 transition active:scale-95"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>

                <div className="w-[1px] h-4 bg-slate-500/30 mx-1" />

                {/* Favorite toggle */}
                <button
                  onClick={() => onToggleFavorite(quote.id)}
                  title={isFavorited ? 'Remove from Favorites' : 'Save to Favorites'}
                  className={`p-2 rounded-xl text-xs transition active:scale-95 flex items-center gap-1 ${
                    isFavorited
                      ? 'text-rose-500 bg-rose-500/15 font-semibold'
                      : 'opacity-70 hover:opacity-100 hover:bg-slate-500/15'
                  }`}
                >
                  <Heart
                    className={`w-4 h-4 ${isFavorited ? 'fill-rose-500 text-rose-500' : ''}`}
                  />
                </button>

                {/* Copy quote button */}
                <button
                  onClick={handleCopyQuote}
                  title="Copy Quote text"
                  className="p-2 rounded-xl text-xs opacity-70 hover:opacity-100 hover:bg-slate-500/15 transition active:scale-95 flex items-center gap-1"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                  {copied && <span className="text-[11px] text-emerald-400 font-medium">Copied!</span>}
                </button>

                {/* Share dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setShowShareMenu(!showShareMenu)}
                    title="Share Thought to Social Media"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-amber-500/15 text-amber-500 hover:bg-amber-500/25 transition active:scale-95"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Share</span>
                  </button>

                  {showShareMenu && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setShowShareMenu(false)}
                      />
                      <div className="absolute right-0 mt-2 w-48 p-1.5 rounded-2xl shadow-xl z-50 border bg-slate-900 text-slate-100 border-slate-700 backdrop-blur-2xl">
                        <button
                          onClick={handleTweet}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium hover:bg-slate-800 text-left transition"
                        >
                          <Twitter className="w-3.5 h-3.5 text-sky-400" />
                          <span>Share on X (Twitter)</span>
                        </button>
                        <button
                          onClick={handleWhatsApp}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium hover:bg-slate-800 text-left transition"
                        >
                          <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Send via WhatsApp</span>
                        </button>
                        <button
                          onClick={handleNativeShare}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium hover:bg-slate-800 text-left transition"
                        >
                          <Share2 className="w-3.5 h-3.5 text-amber-400" />
                          <span>More options / Device</span>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Reflection prompt */}
            {quote.reflectionPrompt && (
              <div className="mt-6 pt-5 border-t border-inherit/40 flex items-start gap-2.5 text-xs sm:text-sm opacity-85">
                <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <p className="italic">
                  <span className="font-semibold not-italic">Morning Prompt: </span>
                  {quote.reflectionPrompt}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

        {/* Morning Intention Anchor / Micro-Journaling */}
        <div className="mt-4 px-2">
          {isEditingIntention ? (
            <form onSubmit={handleSaveIntentionSubmit} className="flex gap-2 items-center">
              <input
                type="text"
                value={intentionInput}
                onChange={(e) => setIntentionInput(e.target.value)}
                placeholder="What is your single guiding intention today?"
                className="flex-1 px-4 py-2 text-xs sm:text-sm rounded-xl border bg-black/10 focus:outline-none focus:ring-2 focus:ring-amber-500/50 border-inherit"
                autoFocus
              />
              <button
                type="submit"
                className="px-3 py-2 rounded-xl text-xs font-medium bg-amber-500 text-slate-950 hover:bg-amber-400 transition"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => {
                  setIntentionInput(morningIntention);
                  setIsEditingIntention(false);
                }}
                className="px-2.5 py-2 rounded-xl text-xs opacity-70 hover:opacity-100 transition"
              >
                Cancel
              </button>
            </form>
          ) : (
            <div
              onClick={() => setIsEditingIntention(true)}
              className="flex items-center justify-between py-2 px-3 rounded-xl border border-dashed border-inherit/40 hover:border-amber-500/50 cursor-pointer group transition text-xs sm:text-sm opacity-80 hover:opacity-100"
            >
              <div className="flex items-center gap-2 truncate">
                <span className="font-semibold text-amber-500">Today’s Intention:</span>
                <span className="italic truncate">
                  {morningIntention || "Click to set a one-line focus intention..."}
                </span>
              </div>
              <span className="text-[11px] opacity-60 group-hover:opacity-100 text-amber-400 ml-2 flex-shrink-0">
                Edit
              </span>
            </div>
          )}

          {intentionSavedToast && (
            <p className="text-[11px] text-emerald-400 mt-1 pl-1">
              ✓ Intention saved for today
            </p>
          )}
        </div>

      </div>
    </section>
  );
};
