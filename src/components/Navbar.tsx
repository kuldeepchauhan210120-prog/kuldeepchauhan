import React, { useState } from 'react';
import { Flame, Sparkles, BookOpen, BarChart3, Sun, Moon, Laptop, Palette, User, Check, Download, AlertCircle, GraduationCap, Zap, Smartphone } from 'lucide-react';
import { ThemeId, UserProfile, StreakState } from '../types';
import { THEMES } from '../utils/themes';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { AppEdition } from './AppVersionModal';

interface NavbarProps {
  themeId: ThemeId;
  onSelectTheme: (id: ThemeId) => void;
  streak: StreakState;
  user: UserProfile;
  currentView: 'morning' | 'exam_coach' | 'flashgenie';
  onSelectView: (view: 'morning' | 'exam_coach' | 'flashgenie') => void;
  onOpenArchive: () => void;
  onOpenInsights: () => void;
  onOpenProfile: () => void;
  onOpenStreakModal: () => void;
  appEdition?: AppEdition;
  isMobileAppShell?: boolean;
  onOpenAppVersion?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  themeId,
  onSelectTheme,
  streak,
  user,
  currentView,
  onSelectView,
  onOpenArchive,
  onOpenInsights,
  onOpenProfile,
  onOpenStreakModal,
  appEdition = 'v2.5',
  isMobileAppShell = false,
  onOpenAppVersion,
}) => {
  const currentTheme = THEMES[themeId];
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full transition-colors duration-200 backdrop-blur-md border-b border-inherit bg-opacity-70">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        {/* Brand identity & Main Navigation Switchers */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="flex items-center gap-2">
            <div
              onClick={() => {
                if (appEdition === 'exam_only') onSelectView('exam_coach');
                else if (appEdition === 'flashgenie_only') onSelectView('flashgenie');
                else onSelectView('morning');
              }}
              className="flex items-center gap-2.5 cursor-pointer"
            >
              <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-indigo-600 shadow-md shadow-amber-500/20 text-white font-bold">
                {appEdition === 'exam_only' ? (
                  <GraduationCap className="w-5 h-5" />
                ) : appEdition === 'flashgenie_only' ? (
                  <Sparkles className="w-5 h-5" />
                ) : (
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="4" />
                    <path d="M12 2v2" />
                    <path d="M12 20v2" />
                    <path d="m4.93 4.93 1.41 1.41" />
                    <path d="m17.66 17.66 1.41 1.41" />
                    <path d="M2 12h2" />
                    <path d="M20 12h2" />
                    <path d="m6.34 17.66-1.41 1.41" />
                    <path d="m19.07 4.93-1.41 1.41" />
                  </svg>
                )}
              </div>
              <span className="text-base sm:text-lg font-bold tracking-tight">
                {appEdition === 'exam_only'
                  ? 'ExamMaster Terra'
                  : appEdition === 'flashgenie_only'
                  ? 'FlashGenie AI'
                  : 'AuraDay'}
              </span>
            </div>

            {onOpenAppVersion && (
              <button
                onClick={onOpenAppVersion}
                title="Switch Separate Websites (AuraDay v1.0, Exam Coach Website, FlashGenie Website) or Mobile App Mode"
                className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30 hover:bg-amber-500 hover:text-slate-950 transition"
              >
                {appEdition === 'v1.0'
                  ? 'v1.0 Website'
                  : appEdition === 'exam_only'
                  ? 'Exam Website'
                  : appEdition === 'flashgenie_only'
                  ? 'FlashGenie Site'
                  : 'v2.5.0'}
              </button>
            )}
          </div>

          {/* Core Module Navigation Tabs */}
          {!isMobileAppShell && appEdition === 'v2.5' && (
            <nav className="flex items-center p-1 rounded-xl bg-black/20 border border-inherit/40 text-xs font-semibold">
              <button
                onClick={() => onSelectView('morning')}
                className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg transition ${
                  currentView === 'morning'
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                    : 'opacity-70 hover:opacity-100 hover:text-amber-400'
                }`}
              >
                <span>☀️</span>
                <span className="hidden md:inline">Morning Focus</span>
              </button>

              <button
                onClick={() => onSelectView('exam_coach')}
                className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg transition ${
                  currentView === 'exam_coach'
                    ? 'bg-sky-500 text-slate-950 font-bold shadow-sm'
                    : 'opacity-70 hover:opacity-100 hover:text-sky-400'
                }`}
              >
                <span>🎓</span>
                <span>Exam Coach</span>
              </button>

              <button
                onClick={() => onSelectView('flashgenie')}
                className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg transition ${
                  currentView === 'flashgenie'
                    ? 'bg-rose-500 text-white font-bold shadow-sm'
                    : 'opacity-70 hover:opacity-100 hover:text-rose-400'
                }`}
              >
                <span>🧞‍♂️</span>
                <span>FlashGenie</span>
              </button>
            </nav>
          )}
        </div>

        {/* Center / Right actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* App Version / Mobile App Mode Button */}
          {onOpenAppVersion && (
            <button
              onClick={onOpenAppVersion}
              title="Open Separate Standalone Websites or Mobile App Mode"
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-semibold transition-all active:scale-95 ${
                isMobileAppShell
                  ? 'bg-sky-500 text-slate-950 border-sky-400 shadow-sm'
                  : 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/25'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{isMobileAppShell ? 'App Mode On' : 'Separate Websites'}</span>
            </button>
          )}

          {/* Daily Streak Counter Button */}
          <button
            onClick={onOpenStreakModal}
            title="View Daily Streak Details"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs sm:text-sm font-semibold transition-all hover:scale-105 active:scale-95 bg-amber-500/10 border-amber-500/30 text-amber-500"
          >
            <Flame className="w-4 h-4 fill-amber-500 text-amber-500 animate-pulse" />
            <span>{streak.currentStreak}</span>
            <span className="hidden lg:inline font-normal text-xs text-amber-500/80">day streak</span>
          </button>

          {/* Quick Insights Nav */}
          <button
            onClick={onOpenInsights}
            title="Weekly Progress & Insights"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border border-transparent hover:border-slate-700/30 hover:bg-slate-500/10 transition"
          >
            <BarChart3 className="w-4 h-4 text-emerald-500" />
            <span className="hidden xl:inline">Insights</span>
          </button>

          {/* Quote Archive Nav */}
          <button
            onClick={onOpenArchive}
            title="365 Daily Quotes Archive"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border border-transparent hover:border-slate-700/30 hover:bg-slate-500/10 transition"
          >
            <BookOpen className="w-4 h-4 text-sky-500" />
            <span className="hidden xl:inline">Archive</span>
          </button>

          {/* Aesthetic Toggle Menu */}
          <div className="relative">
            <button
              onClick={() => setShowThemeMenu(!showThemeMenu)}
              title="Change Morning Aesthetic"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border border-transparent hover:border-slate-700/30 hover:bg-slate-500/10 transition"
            >
              <Palette className="w-4 h-4 text-violet-400" />
              <span className="hidden md:inline">Aesthetic</span>
            </button>

            {showThemeMenu && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowThemeMenu(false)}
                />
                <div className="absolute right-0 mt-2 w-64 p-2 rounded-2xl shadow-2xl z-50 border bg-slate-900 text-slate-100 border-slate-700 backdrop-blur-2xl">
                  <div className="px-3 py-2 border-b border-slate-800">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Morning Mood & Aesthetic</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">Switch gradients to match your energy</p>
                  </div>
                  <div className="mt-1 space-y-1">
                    {(Object.keys(THEMES) as ThemeId[]).map((id) => {
                      const t = THEMES[id];
                      const isSelected = themeId === id;
                      return (
                        <button
                          key={id}
                          onClick={() => {
                            onSelectTheme(id);
                            setShowThemeMenu(false);
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition text-left ${
                            isSelected
                              ? 'bg-amber-500/20 text-amber-300 font-semibold'
                              : 'text-slate-300 hover:bg-slate-800/80'
                          }`}
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span>{t.name}</span>
                              {t.isDark ? (
                                <Moon className="w-3 h-3 text-indigo-400" />
                              ) : (
                                <Sun className="w-3 h-3 text-amber-400" />
                              )}
                            </div>
                            <span className="text-[10px] text-slate-400 block">{t.subtitle}</span>
                          </div>
                          {isSelected && <Check className="w-4 h-4 text-amber-400" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* In-App PWA Install Button */}
          {!isInstalled && isInstallable && (
            <button
              onClick={install}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm transition active:scale-95"
              title="Install AuraDay as Desktop/Mobile App"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Install App</span>
            </button>
          )}

          {!isInstalled && isIOS && (
            <button
              onClick={() => setShowIOSGuide(true)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border border-slate-700/50 hover:bg-slate-800/40 text-slate-300 transition"
              title="Install AuraDay on iOS"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Add to Home</span>
            </button>
          )}

          {/* User Profile Avatar / Settings Button */}
          <button
            onClick={onOpenProfile}
            title={`Account Settings: ${user.name}`}
            className="flex items-center gap-2 p-1 pl-1.5 pr-2.5 rounded-xl border border-transparent hover:border-slate-700/30 hover:bg-slate-500/10 transition group"
          >
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="w-7 h-7 rounded-full object-cover ring-2 ring-amber-500/30 group-hover:ring-amber-500/60 transition"
              onError={(e) => {
                // fallback to colored placeholder
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            <span className="text-xs font-medium hidden md:inline truncate max-w-[80px]">
              {user.name.split(' ')[0]}
            </span>
          </button>
        </div>
      </div>

      {/* iOS Safari Installation Guide Modal */}
      {showIOSGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-800 p-6 text-slate-100 shadow-2xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <Download className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-semibold">Install AuraDay on iOS</h3>
                <p className="text-xs text-slate-400">Launch in full-screen standalone mode</p>
              </div>
            </div>
            <ol className="mt-4 space-y-2.5 text-xs text-slate-300 leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-slate-800 text-amber-400 font-bold flex items-center justify-center text-[10px]">1</span>
                <span>Tap the <strong>Share</strong> icon (box with upward arrow) in the Safari toolbar.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-slate-800 text-amber-400 font-bold flex items-center justify-center text-[10px]">2</span>
                <span>Scroll down the action sheet and select <strong>Add to Home Screen</strong>.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-slate-800 text-amber-400 font-bold flex items-center justify-center text-[10px]">3</span>
                <span>Tap <strong>Add</strong> in the top right corner. Enjoy instant offline morning focus!</span>
              </li>
            </ol>
            <button
              onClick={() => setShowIOSGuide(false)}
              className="mt-6 w-full rounded-xl bg-slate-800 hover:bg-slate-700 py-2.5 text-xs font-medium text-slate-200 transition"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
