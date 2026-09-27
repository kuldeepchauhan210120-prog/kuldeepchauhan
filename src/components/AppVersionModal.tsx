import React, { useState } from 'react';
import {
  X, Smartphone, Monitor, Download, CheckCircle2, Sparkles,
  Layers, History, ShieldCheck, Wifi, Cpu, ArrowRight, Check,
  Apple, Chrome, Globe, Zap
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export type AppEdition = 'v2.5' | 'v1.0';

interface AppVersionModalProps {
  isOpen: boolean;
  onClose: () => void;
  appEdition: AppEdition;
  onChangeEdition: (edition: AppEdition) => void;
  isMobileAppShell: boolean;
  onToggleMobileAppShell: (enabled: boolean) => void;
}

export const APP_VERSION_INFO = {
  version: '2.5.0',
  codename: 'Terra & FlashGenie Suite',
  releaseDate: 'September 2026',
  engine: 'GPT 5.6 Terra + FlashGenie Vision 4-Step',
  pwaReady: true,
};

const CHANGELOG = [
  {
    version: 'v2.5.0',
    tag: 'Latest Release',
    title: 'FlashGenie AI Flashcards & Spaced Repetition Coach',
    date: 'Sep 26, 2026',
    highlights: [
      '4-Step Photo & Note Flashcard Synthesis (Analyze → Simplify for 10yo → Vector Infographic → Flip Card)',
      'Automatic 1-Line Vivid Analogy + 1-Line Mnemonic generator for every concept',
      'Spaced Repetition Review Loop (Easy 😄 7d, Okay 🤔 3d, Hard 😵 1d) with mastery streak tracking',
      'Mobile App Shell mode with native bottom navigation bar & Edition Switcher'
    ]
  },
  {
    version: 'v2.0.0',
    tag: 'Major Update',
    title: 'Examination Database & GPT 5.6 Terra Pace Calibration',
    date: 'Sep 25, 2026',
    highlights: [
      'Master Exam Blueprint Catalog (Medical NEET/MCAT, Engineering JEE, Civil Services UPSC, SAT/GRE + Custom Exams)',
      'Multi-level Syllabus Hierarchy (Exam → Subject → Unit → Topic) with Easy/Medium/Hard baseline hours',
      'Mathematical Pace Calibration Engine with 15–20% revision buffer & target date feasibility alerts',
      '1-Tap Syllabus Topic to Daily Priority Task synchronization'
    ]
  },
  {
    version: 'v1.5.0',
    tag: 'Feature Update',
    title: 'Timing Engine, Proximity Alerts & Pre-Dawn Sanctuary',
    date: 'Sep 24, 2026',
    highlights: [
      'Pre-Dawn Sanctuary lock screen with live countdown until user wake-up time',
      'Morning Mood Check-In (Energized, Calm, Focused, Overwhelmed, Reflective) tailoring daily quotes',
      '5–10 Minute Proximity Push Notifications & Automatic Morning Roll-Over banner'
    ]
  },
  {
    version: 'v1.0.0',
    tag: 'Foundation',
    title: 'AuraDay Classic — Morning Focus & 365 Quote Sanctuary',
    date: 'Sep 20, 2026',
    highlights: [
      '365+ Curated Daily Quotes CMS with reflection prompts and favorite archive',
      'Top 3 Daily Priorities workspace, routine habit streaks, and 24-hour visual timeline',
      'Floating Pomodoro Focus Timer with tab title sync, harmonic chimes, and confetti'
    ]
  }
];

export const AppVersionModal: React.FC<AppVersionModalProps> = ({
  isOpen,
  onClose,
  appEdition,
  onChangeEdition,
  isMobileAppShell,
  onToggleMobileAppShell,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'install' | 'changelog'>('overview');
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [installTriggered, setInstallTriggered] = useState(false);

  if (!isOpen) return null;

  const handleInstallClick = async () => {
    if (isInstallable) {
      const accepted = await install();
      if (accepted) setInstallTriggered(true);
    } else {
      setActiveTab('install');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="w-full max-w-2xl rounded-3xl bg-slate-900 border border-slate-700/80 text-slate-100 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-slate-800 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 via-rose-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-lg shadow-amber-500/20">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold tracking-tight">AuraDay App Version</h2>
                <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  v{APP_VERSION_INFO.version}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {APP_VERSION_INFO.codename} · Standalone PWA &amp; Mobile App Experience
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-950/50 px-5 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 px-3.5 border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'overview'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>App Mode &amp; Edition</span>
          </button>

          <button
            onClick={() => setActiveTab('install')}
            className={`py-3 px-3.5 border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'install'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>Install Native App</span>
          </button>

          <button
            onClick={() => setActiveTab('changelog')}
            className={`py-3 px-3.5 border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'changelog'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Release Notes (v1.0 → v2.5)</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {activeTab === 'overview' && (
            <>
              {/* 1. Interactive Viewport Mode: Mobile App Shell vs Desktop Web */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                    1. Choose Interface Mode (App vs Web Layout)
                  </span>
                  <span className="text-[11px] text-slate-400">Instant live switch</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={() => onToggleMobileAppShell(true)}
                    className={`p-4 rounded-2xl border text-left transition-all flex items-start gap-3.5 ${
                      isMobileAppShell
                        ? 'bg-amber-500/15 border-amber-500 ring-2 ring-amber-500/30 shadow-lg'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 opacity-80 hover:opacity-100'
                    }`}
                  >
                    <div className={`p-2.5 rounded-xl ${isMobileAppShell ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-300'}`}>
                      <Smartphone className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-white">Mobile App Version</span>
                        {isMobileAppShell && <Check className="w-4 h-4 text-amber-400 stroke-[3]" />}
                      </div>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                        Compact phone app viewport with native iOS/Android status bar &amp; bottom tab navigation bar.
                      </p>
                    </div>
                  </button>

                  <button
                    onClick={() => onToggleMobileAppShell(false)}
                    className={`p-4 rounded-2xl border text-left transition-all flex items-start gap-3.5 ${
                      !isMobileAppShell
                        ? 'bg-sky-500/15 border-sky-500 ring-2 ring-sky-500/30 shadow-lg'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 opacity-80 hover:opacity-100'
                    }`}
                  >
                    <div className={`p-2.5 rounded-xl ${!isMobileAppShell ? 'bg-sky-500 text-slate-950' : 'bg-slate-800 text-slate-300'}`}>
                      <Monitor className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-white">Full Widescreen Web</span>
                        {!isMobileAppShell && <Check className="w-4 h-4 text-sky-400 stroke-[3]" />}
                      </div>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                        Expanded desktop &amp; tablet layout with top header navigation and multi-column cards.
                      </p>
                    </div>
                  </button>
                </div>
              </div>

              {/* 2. App Version Edition Switcher (v2.5 Full Suite vs v1.0 Classic) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-sky-400">
                    2. Active Version Edition
                  </span>
                  <span className="text-[11px] text-slate-400">Switch between v2.5 and v1.0 anytime</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={() => onChangeEdition('v2.5')}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      appEdition === 'v2.5'
                        ? 'bg-gradient-to-br from-sky-500/20 via-indigo-500/15 to-rose-500/15 border-sky-500 ring-2 ring-sky-500/30'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 opacity-75 hover:opacity-100'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-sky-500 text-slate-950">
                        v2.5.0 (Latest)
                      </span>
                      {appEdition === 'v2.5' && (
                        <span className="text-[11px] font-bold text-sky-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Active
                        </span>
                      )}
                    </div>
                    <h4 className="text-sm font-bold text-white">AuraDay + Exam Coach + FlashGenie</h4>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      Includes Morning Focus, Master Exam Database, GPT 5.6 Terra Pace Coach, and FlashGenie AI Visual Flashcards.
                    </p>
                  </button>

                  <button
                    onClick={() => onChangeEdition('v1.0')}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      appEdition === 'v1.0'
                        ? 'bg-gradient-to-br from-amber-500/20 to-emerald-500/10 border-amber-500 ring-2 ring-amber-500/30'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 opacity-75 hover:opacity-100'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-400 border border-amber-500/30">
                        v1.0.0 (Classic)
                      </span>
                      {appEdition === 'v1.0' && (
                        <span className="text-[11px] font-bold text-amber-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Active
                        </span>
                      )}
                    </div>
                    <h4 className="text-sm font-bold text-white">Classic Morning Focus Sanctuary</h4>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      Pure distraction-free Thought of the Day, Top 3 Priorities, Routine Habits, and Pomodoro Timer.
                    </p>
                  </button>
                </div>
              </div>

              {/* 3. System & Build Diagnostics Card */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 block">Build Version</span>
                  <span className="font-mono font-bold text-slate-100 mt-0.5 block">v2.5.0-prod</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 block">AI Engines</span>
                  <span className="font-semibold text-sky-400 mt-0.5 block">GPT 5.6 Terra + Genie</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 block">Offline PWA</span>
                  <span className="font-semibold text-emerald-400 mt-0.5 flex items-center gap-1">
                    <Wifi className="w-3 h-3" /> Service Worker Ready
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 block">Storage Engine</span>
                  <span className="font-semibold text-amber-400 mt-0.5 block">Local Persistence v2</span>
                </div>
              </div>
            </>
          )}

          {activeTab === 'install' && (
            <div className="space-y-5">
              {/* Direct Install Banner */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-indigo-950/60 border border-emerald-500/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                      Progressive Web App (PWA)
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold">
                      100% Offline Capable
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white mt-1">
                    {isInstalled
                      ? 'AuraDay App is Installed on Your Device'
                      : 'Install AuraDay on Your Home Screen or Desktop'}
                  </h3>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Launches full-screen like a native iOS/Android app with instant offline load and push alerts.
                  </p>
                </div>

                {isInstallable && !isInstalled && (
                  <button
                    onClick={handleInstallClick}
                    className="px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-500 text-slate-950 hover:bg-emerald-400 transition active:scale-95 shadow-lg shadow-emerald-500/20 whitespace-nowrap flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Install Now</span>
                  </button>
                )}
              </div>

              {installTriggered && (
                <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500 text-emerald-200 text-xs font-semibold text-center">
                  🎉 AuraDay has been installed! You can now launch it directly from your Home Screen or App Launcher.
                </div>
              )}

              {/* Platform-Specific Guides */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-xs">
                {/* iOS / iPhone */}
                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2.5">
                  <div className="flex items-center gap-2 text-amber-400 font-bold">
                    <Smartphone className="w-4 h-4" />
                    <span>iPhone &amp; iPad (iOS)</span>
                  </div>
                  <ol className="space-y-1.5 text-slate-300 list-decimal list-inside leading-relaxed">
                    <li>Open AuraDay in <strong>Safari</strong>.</li>
                    <li>Tap the <strong>Share</strong> button <span className="px-1.5 py-0.5 rounded bg-slate-800 font-mono text-[10px]">↑</span> at the bottom.</li>
                    <li>Scroll down and tap <strong>"Add to Home Screen"</strong>.</li>
                  </ol>
                </div>

                {/* Android */}
                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2.5">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold">
                    <Smartphone className="w-4 h-4" />
                    <span>Android (Chrome)</span>
                  </div>
                  <ol className="space-y-1.5 text-slate-300 list-decimal list-inside leading-relaxed">
                    <li>Tap the <strong>three-dot menu</strong> <span className="px-1.5 py-0.5 rounded bg-slate-800 font-mono text-[10px]">⋮</span> in Chrome.</li>
                    <li>Select <strong>"Install App"</strong> or <strong>"Add to Home screen"</strong>.</li>
                    <li>Confirm to place the AuraDay icon on your launcher.</li>
                  </ol>
                </div>

                {/* Desktop */}
                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2.5">
                  <div className="flex items-center gap-2 text-sky-400 font-bold">
                    <Monitor className="w-4 h-4" />
                    <span>Mac &amp; Windows</span>
                  </div>
                  <ol className="space-y-1.5 text-slate-300 list-decimal list-inside leading-relaxed">
                    <li>Look at the right side of your browser address bar.</li>
                    <li>Click the <strong>Install icon</strong> <span className="px-1.5 py-0.5 rounded bg-slate-800 font-mono text-[10px]">⊕</span>.</li>
                    <li>Or toggle <strong>Mobile App Version</strong> in tab 1 for phone frame view.</li>
                  </ol>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'changelog' && (
            <div className="space-y-4">
              {CHANGELOG.map((release, idx) => (
                <div
                  key={release.version}
                  className={`p-4 rounded-2xl border ${
                    idx === 0
                      ? 'bg-amber-500/10 border-amber-500/40'
                      : 'bg-slate-950/60 border-slate-800'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded-full ${
                        idx === 0 ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-300'
                      }`}>
                        {release.version}
                      </span>
                      <span className="text-sm font-bold text-white">{release.title}</span>
                    </div>
                    <span className="text-[11px] text-slate-400">{release.date}</span>
                  </div>

                  <ul className="space-y-1 text-xs text-slate-300 mt-2">
                    {release.highlights.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-amber-400 font-bold">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-slate-400">
            <span>Current Active Edition:</span>
            <strong className="text-amber-400">
              {appEdition === 'v2.5' ? 'v2.5.0 Full Suite' : 'v1.0.0 Classic'}
            </strong>
            <span>·</span>
            <strong className="text-sky-400">
              {isMobileAppShell ? '📱 Mobile App Frame' : '🖥️ Widescreen Web'}
            </strong>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl font-bold bg-amber-500 text-slate-950 hover:bg-amber-400 transition active:scale-95"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
