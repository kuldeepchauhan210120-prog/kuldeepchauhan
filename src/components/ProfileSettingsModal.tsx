import React, { useState } from 'react';
import { X, User, Bell, Volume2, Sparkles, Download, LogIn, LogOut, Check, Mail, Clock, Sun, Moon, Timer, Eye, ShieldCheck, AlertCircle } from 'lucide-react';
import { UserProfile } from '../types';

interface ProfileSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onUpdateUser: (updated: UserProfile) => void;
}

export const ProfileSettingsModal: React.FC<ProfileSettingsModalProps> = ({
  isOpen,
  onClose,
  user,
  onUpdateUser,
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'reminders' | 'preferences'>('profile');
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [wakeUpTime, setWakeUpTime] = useState(user.wakeUpTime || '06:30');
  const [reminderTime, setReminderTime] = useState(user.reminderTime || '07:15');
  const [reminderEnabled, setReminderEnabled] = useState(user.reminderEnabled);
  const [pomodoroWorkMinutes, setPomodoroWorkMinutes] = useState(user.pomodoroWorkMinutes || 25);
  const [pomodoroBreakMinutes, setPomodoroBreakMinutes] = useState(user.pomodoroBreakMinutes || 5);
  const [spotlightFocusMode, setSpotlightFocusMode] = useState(user.spotlightFocusMode || false);
  const [soundEnabled, setSoundEnabled] = useState(user.soundEnabled);
  const [confettiEnabled, setConfettiEnabled] = useState(user.confettiEnabled);
  const [notificationStatus, setNotificationStatus] = useState<string>('');
  const [saveSuccessToast, setSaveSuccessToast] = useState(false);

  if (!isOpen) return null;

  const handleSaveProfile = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    onUpdateUser({
      ...user,
      name,
      email,
      wakeUpTime,
      reminderTime,
      reminderEnabled,
      pomodoroWorkMinutes,
      pomodoroBreakMinutes,
      spotlightFocusMode,
      soundEnabled,
      confettiEnabled,
    });
    setSaveSuccessToast(true);
    setTimeout(() => setSaveSuccessToast(false), 2000);
  };

  const handleGoogleSignIn = () => {
    // 1-click Google Sign-in instant connection
    onUpdateUser({
      ...user,
      name: 'Kuldeep Chauhan',
      email: 'kuldeepchauhan210120@gmail.com',
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=256&q=80',
      provider: 'google',
    });
    setName('Kuldeep Chauhan');
    setEmail('kuldeepchauhan210120@gmail.com');
    setSaveSuccessToast(true);
    setTimeout(() => setSaveSuccessToast(false), 2000);
  };

  const handleAppleSignIn = () => {
    onUpdateUser({
      ...user,
      name: 'Alex Apple',
      email: 'alex.apple@icloud.com',
      avatarUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=256&q=80',
      provider: 'apple',
    });
    setName('Alex Apple');
    setEmail('alex.apple@icloud.com');
    setSaveSuccessToast(true);
    setTimeout(() => setSaveSuccessToast(false), 2000);
  };

  const handleSignOut = () => {
    onUpdateUser({
      ...user,
      name: 'Guest Mindful User',
      email: 'guest@auraday.app',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
      provider: 'guest',
    });
    setName('Guest Mindful User');
    setEmail('guest@auraday.app');
  };

  const handleRequestPushPermission = async () => {
    if (!('Notification' in window)) {
      setNotificationStatus('Browser does not support notifications.');
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        setNotificationStatus('Notifications enabled! Dispatched test reminder.');
        new Notification('☀️ AuraDay Morning Focus', {
          body: `Good morning! Wake-up trigger set to ${wakeUpTime}. Custom reminder ping at ${reminderTime}.`,
          icon: '/pwa-192x192.png',
        });
      } else {
        setNotificationStatus('Notification permission was declined.');
      }
    } catch {
      setNotificationStatus('Could not request notification permission.');
    }
  };

  const handleExportBackup = () => {
    const backupData = {
      profile: user,
      exportedAt: new Date().toISOString(),
      app: 'AuraDay',
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `auraday-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="w-full max-w-xl rounded-3xl bg-slate-900 border border-slate-800 text-slate-100 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Settings &amp; Schedule Triggers</h2>
              <p className="text-xs text-slate-400">Personalize wake-up time, reminder pings, and focus timers</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-950/40 px-4 text-xs font-medium">
          <button
            onClick={() => setActiveTab('profile')}
            className={`py-3 px-3 border-b-2 transition ${
              activeTab === 'profile'
                ? 'border-amber-500 text-amber-400 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Authentication &amp; Profile
          </button>
          <button
            onClick={() => setActiveTab('reminders')}
            className={`py-3 px-3 border-b-2 transition ${
              activeTab === 'reminders'
                ? 'border-amber-500 text-amber-400 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Wake-Up &amp; Reminders
          </button>
          <button
            onClick={() => setActiveTab('preferences')}
            className={`py-3 px-3 border-b-2 transition ${
              activeTab === 'preferences'
                ? 'border-amber-500 text-amber-400 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Pomodoro &amp; Focus Mode
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {activeTab === 'profile' && (
            <div className="space-y-6">
              {/* Auth Status Banner */}
              <div className="p-4 rounded-2xl border border-slate-800 bg-slate-950/60 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={user.avatarUrl}
                    alt={user.name}
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-amber-500/40"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold">{user.name}</span>
                      <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        {user.provider === 'google' ? 'Google Account' : user.provider === 'apple' ? 'Apple ID' : 'Guest Account'}
                      </span>
                    </div>
                    <span className="text-xs text-slate-400">{user.email}</span>
                  </div>
                </div>

                {user.provider !== 'guest' ? (
                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                ) : null}
              </div>

              {/* 1-Click Fast Auth Options */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  One-Click Authentication
                </h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Sign in with Google */}
                  <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    className="flex items-center justify-center gap-3 p-3 rounded-2xl border border-slate-700 bg-slate-800/80 hover:bg-slate-800 text-xs font-semibold text-white transition active:scale-95 shadow-sm"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                    <span>Sign in with Google</span>
                  </button>

                  {/* Sign in with Apple */}
                  <button
                    type="button"
                    onClick={handleAppleSignIn}
                    className="flex items-center justify-center gap-3 p-3 rounded-2xl border border-slate-700 bg-black/60 hover:bg-black text-xs font-semibold text-white transition active:scale-95 shadow-sm"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.84c.67-.82 1.13-1.96 1-3.1-.98.04-2.18.66-2.88 1.48-.62.72-1.16 1.88-1.01 3 .01 0 .04.01.07.01 1.01 0 2.16-.62 2.82-1.39z" />
                    </svg>
                    <span>Sign in with Apple</span>
                  </button>
                </div>
              </div>

              {/* Edit Profile Form */}
              <form onSubmit={handleSaveProfile} className="space-y-4 pt-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Profile Details
                </h4>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-800 text-xs sm:text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-800 text-xs sm:text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition active:scale-95 shadow-sm"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'reminders' && (
            <div className="space-y-6">
              
              {/* Feature 1: Personalized Morning Motivation (Wake-Up Time Trigger) */}
              <div className="p-4 rounded-2xl border border-amber-500/40 bg-gradient-to-br from-amber-500/10 via-slate-900 to-slate-950 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Sun className="w-5 h-5 text-amber-400" />
                    <div>
                      <span className="text-xs font-bold text-amber-300 block">Wake-Up Time Trigger</span>
                      <span className="text-[11px] text-slate-400">
                        When your "new day" begins (refreshes quote at your actual morning hour)
                      </span>
                    </div>
                  </div>

                  <input
                    type="time"
                    value={wakeUpTime}
                    onChange={(e) => setWakeUpTime(e.target.value)}
                    className="px-3 py-1.5 rounded-xl border border-amber-500/40 bg-slate-900 text-xs font-bold text-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                  />
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Instead of flashing a new quote at midnight when you are sleeping, AuraDay reveals your fresh Thought of the Day at exactly <strong>{wakeUpTime}</strong>.
                </p>
              </div>

              {/* Feature 2: Custom Reminder Pings */}
              <div className="p-4 rounded-2xl border border-slate-800 bg-slate-950/60 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Bell className="w-5 h-5 text-emerald-400" />
                    <div>
                      <span className="text-xs font-semibold block">Custom Reminder Ping</span>
                      <span className="text-[11px] text-slate-400">
                        Daily notification sent right before your commute or focus hour
                      </span>
                    </div>
                  </div>

                  <input
                    type="time"
                    value={reminderTime}
                    onChange={(e) => setReminderTime(e.target.value)}
                    className="px-3 py-1.5 rounded-xl border border-slate-700 bg-slate-800 text-xs font-bold text-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  />
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                  <div>
                    <span className="text-xs font-semibold block">Enable Browser Push Alerts</span>
                    <span className="text-[11px] text-slate-400">Scheduled local notification</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={reminderEnabled}
                    onChange={(e) => setReminderEnabled(e.target.checked)}
                    className="w-4 h-4 accent-amber-500 rounded"
                  />
                </div>
              </div>

              {/* Notification Permission & Test */}
              <div className="p-4 rounded-2xl border border-slate-800 bg-slate-950/60 space-y-3">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-sky-400" />
                  <span className="text-xs font-semibold">Test Browser Notification Trigger</span>
                </div>
                <p className="text-xs text-slate-400">
                  Click below to grant notification permission and test the morning alert sound and banner.
                </p>
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={handleRequestPushPermission}
                    className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition active:scale-95"
                  >
                    Dispatch Test Push Ping
                  </button>
                  {notificationStatus && (
                    <span className="text-xs text-emerald-400 font-medium">
                      {notificationStatus}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => handleSaveProfile()}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition active:scale-95 shadow-sm"
                >
                  Save Schedule Settings
                </button>
              </div>
            </div>
          )}

          {activeTab === 'preferences' && (
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-semibold mb-1">Focus Timer &amp; Pomodoro Settings</h4>
                <p className="text-xs text-slate-400">
                  Customize your work/break intervals and distraction-free visual spotlight.
                </p>
              </div>

              {/* Work / Break Intervals */}
              <div className="p-4 rounded-2xl border border-slate-800 bg-slate-950/60 space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
                  <Timer className="w-4 h-4" />
                  <span>Custom Work / Break Intervals</span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Focus Work Block (mins)
                    </label>
                    <select
                      value={pomodoroWorkMinutes}
                      onChange={(e) => setPomodoroWorkMinutes(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-slate-700 bg-slate-800 text-xs font-bold text-amber-400 focus:outline-none"
                    >
                      <option value={15}>15 minutes (Quick sprint)</option>
                      <option value={25}>25 minutes (Classic Pomodoro)</option>
                      <option value={45}>45 minutes (Deep Work)</option>
                      <option value={50}>50 minutes (Extended Focus)</option>
                      <option value={60}>60 minutes (Ultra sprint)</option>
                      <option value={90}>90 minutes (Full Ultradian Cycle)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Restorative Break (mins)
                    </label>
                    <select
                      value={pomodoroBreakMinutes}
                      onChange={(e) => setPomodoroBreakMinutes(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-slate-700 bg-slate-800 text-xs font-bold text-sky-400 focus:outline-none"
                    >
                      <option value={3}>3 minutes (Micro break)</option>
                      <option value={5}>5 minutes (Standard break)</option>
                      <option value={10}>10 minutes (Walk & stretch)</option>
                      <option value={15}>15 minutes (Long break)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Spotlight Focus Mode */}
              <div className="p-4 rounded-2xl border border-slate-800 bg-slate-950/60 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Eye className="w-5 h-5 text-amber-400" />
                  <div>
                    <span className="text-xs font-semibold block">Intelligent Spotlight Focus</span>
                    <span className="text-[11px] text-slate-400">
                      Dims non-active tasks on your workspace to eliminate visual clutter
                    </span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={spotlightFocusMode}
                  onChange={(e) => setSpotlightFocusMode(e.target.checked)}
                  className="w-4 h-4 accent-amber-500 rounded"
                />
              </div>

              {/* Sound & Confetti */}
              <div className="space-y-3">
                <div className="p-4 rounded-2xl border border-slate-800 bg-slate-950/60 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Volume2 className="w-5 h-5 text-amber-400" />
                    <div>
                      <span className="text-xs font-semibold block">Harmonic Audio Chime</span>
                      <span className="text-[11px] text-slate-400">Gentle bell when checking off tasks or timers finish</span>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={soundEnabled}
                    onChange={(e) => setSoundEnabled(e.target.checked)}
                    className="w-4 h-4 accent-amber-500 rounded"
                  />
                </div>

                <div className="p-4 rounded-2xl border border-slate-800 bg-slate-950/60 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-5 h-5 text-emerald-400" />
                    <div>
                      <span className="text-xs font-semibold block">Digital Confetti Celebrations</span>
                      <span className="text-[11px] text-slate-400">Micro particle burst upon task completion</span>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={confettiEnabled}
                    onChange={(e) => setConfettiEnabled(e.target.checked)}
                    className="w-4 h-4 accent-amber-500 rounded"
                  />
                </div>
              </div>

              {/* Backup & Export */}
              <div className="p-4 rounded-2xl border border-slate-800 bg-slate-950/40 space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                  <Download className="w-4 h-4 text-sky-400" />
                  <span>Data Portability &amp; Backup</span>
                </div>
                <p className="text-xs text-slate-400">
                  Download a complete JSON snapshot of your priorities, time blocks, and favorites.
                </p>
                <button
                  type="button"
                  onClick={handleExportBackup}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
                >
                  Download JSON Backup
                </button>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => handleSaveProfile()}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition active:scale-95 shadow-sm"
                >
                  Save Preferences
                </button>
              </div>
            </div>
          )}

          {saveSuccessToast && (
            <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-medium flex items-center gap-2">
              <Check className="w-4 h-4" />
              <span>Settings updated successfully!</span>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

