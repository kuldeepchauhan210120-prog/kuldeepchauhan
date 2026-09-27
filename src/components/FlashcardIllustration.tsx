import React from 'react';

interface FlashcardIllustrationProps {
  topic: string;
  subject: string;
  analogy: string;
  mnemonic: string;
  emojiChain: string;
  promptDescription?: string;
  className?: string;
}

export const FlashcardIllustration: React.FC<FlashcardIllustrationProps> = ({
  topic,
  subject,
  analogy,
  mnemonic,
  emojiChain,
  className = ''
}) => {
  const normalizedTopic = topic.toLowerCase();

  // Dynamic visual themes based on topic / subject
  return (
    <div className={`relative w-full rounded-2xl overflow-hidden border border-slate-700/40 bg-gradient-to-b from-slate-900/90 to-slate-950/90 p-4 shadow-inner ${className}`}>
      {/* Top Infographic Header Badge */}
      <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
            {subject}
          </span>
          <span className="text-xs font-bold text-slate-200 truncate">{topic}</span>
        </div>
        <span className="text-xs tracking-widest">{emojiChain}</span>
      </div>

      {/* Visual Canvas Area with Custom Vector Infographic */}
      <div className="relative h-44 w-full rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-center justify-center p-3 overflow-hidden">
        {/* Subtle grid background */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, #f59e0b 1px, transparent 0)',
            backgroundSize: '16px 16px'
          }}
        />

        {/* 1. PHOTOSYNTHESIS THEME */}
        {normalizedTopic.includes('photo') ? (
          <div className="relative flex flex-col items-center justify-center w-full h-full text-center animate-in fade-in duration-300">
            <div className="flex items-center justify-around w-full max-w-xs">
              {/* Sun */}
              <div className="flex flex-col items-center">
                <span className="text-3xl animate-bounce">☀️</span>
                <span className="text-[10px] font-bold text-amber-400">Sunlight</span>
              </div>
              <span className="text-slate-400 font-bold text-sm">+</span>
              {/* Leaf Chef */}
              <div className="flex flex-col items-center p-2 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 shadow-lg shadow-emerald-500/10">
                <div className="relative">
                  <span className="text-4xl">🍃</span>
                  <span className="absolute -top-2 -right-1 text-base">👨‍🍳</span>
                </div>
                <span className="text-[10px] font-bold text-emerald-300 mt-1">Leaf Kitchen</span>
              </div>
              <span className="text-slate-400 font-bold text-sm">➔</span>
              {/* Sugar + O2 */}
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-1">
                  <span className="text-2xl">🍬</span>
                  <span className="text-2xl">😮‍💨</span>
                </div>
                <span className="text-[10px] font-bold text-sky-300">Glucose + O₂</span>
              </div>
            </div>
            <div className="mt-2 text-[10px] text-emerald-400/90 font-medium px-2 py-0.5 rounded-full bg-emerald-500/10">
              CO₂ In ➔ Solar Stove ➔ Sugar Out
            </div>
          </div>
        ) : normalizedTopic.includes('mito') ? (
          /* 2. MITOCHONDRIA THEME */
          <div className="relative flex flex-col items-center justify-center w-full h-full text-center">
            <div className="flex items-center justify-around w-full max-w-xs">
              <div className="flex flex-col items-center">
                <span className="text-3xl">🍎</span>
                <span className="text-[10px] font-bold text-rose-400">Nutrients</span>
              </div>
              <span className="text-slate-400 font-bold text-sm">➔</span>
              <div className="flex flex-col items-center p-2 rounded-2xl bg-indigo-950/60 border border-indigo-500/40">
                <div className="relative">
                  <span className="text-4xl">🏭</span>
                  <span className="absolute -top-1 -right-1 text-sm animate-pulse">⚡</span>
                </div>
                <span className="text-[10px] font-bold text-indigo-300 mt-1">Power Plant</span>
              </div>
              <span className="text-slate-400 font-bold text-sm">➔</span>
              <div className="flex flex-col items-center">
                <span className="text-3xl animate-pulse">🔋</span>
                <span className="text-[10px] font-bold text-emerald-400">ATP Energy</span>
              </div>
            </div>
            <div className="mt-2 text-[10px] text-indigo-300/90 font-medium px-2 py-0.5 rounded-full bg-indigo-500/10">
              Cellular Generator Charging Chemical Batteries
            </div>
          </div>
        ) : normalizedTopic.includes('newton') ? (
          /* 3. NEWTON'S 2ND LAW THEME */
          <div className="relative flex flex-col items-center justify-center w-full h-full text-center">
            <div className="grid grid-cols-2 gap-3 w-full max-w-xs">
              {/* Empty Cart */}
              <div className="p-2 rounded-xl bg-amber-950/30 border border-amber-500/30 flex flex-col items-center">
                <div className="flex items-center gap-1">
                  <span className="text-xl">🏃</span>
                  <span className="text-2xl animate-pulse">🛒💨</span>
                </div>
                <span className="text-[10px] font-bold text-amber-300 mt-1">Light Mass = Zooms!</span>
              </div>
              {/* Full Cart */}
              <div className="p-2 rounded-xl bg-rose-950/30 border border-rose-500/30 flex flex-col items-center">
                <div className="flex items-center gap-1">
                  <span className="text-xl">🥵</span>
                  <span className="text-2xl">🛒🧱🐢</span>
                </div>
                <span className="text-[10px] font-bold text-rose-300 mt-1">Heavy Mass = Crawls</span>
              </div>
            </div>
            <div className="mt-2 text-[11px] font-mono font-bold text-amber-400 bg-black/40 px-3 py-0.5 rounded-md border border-amber-500/30">
              F = m × a (Force = Mass × Acceleration)
            </div>
          </div>
        ) : normalizedTopic.includes('bond') ? (
          /* 4. CHEMICAL BONDS THEME */
          <div className="relative flex flex-col items-center justify-center w-full h-full text-center">
            <div className="grid grid-cols-2 gap-3 w-full max-w-xs">
              <div className="p-2 rounded-xl bg-emerald-950/30 border border-emerald-500/30 flex flex-col items-center">
                <div className="flex items-center gap-1 text-2xl">
                  <span>⚛️</span>
                  <span>🤝</span>
                  <span>⚛️</span>
                </div>
                <span className="text-[10px] font-bold text-emerald-300 mt-1">Covalent: Handshake (Share)</span>
              </div>
              <div className="p-2 rounded-xl bg-purple-950/30 border border-purple-500/30 flex flex-col items-center">
                <div className="flex items-center gap-1 text-2xl">
                  <span>➕</span>
                  <span>🧲</span>
                  <span>➖</span>
                </div>
                <span className="text-[10px] font-bold text-purple-300 mt-1">Ionic: Magnets (Transfer)</span>
              </div>
            </div>
            <div className="mt-2 text-[10px] text-teal-300 font-medium px-2 py-0.5 rounded-full bg-teal-500/10">
              Shared Electrons vs Opposites Attract
            </div>
          </div>
        ) : normalizedTopic.includes('quad') || normalizedTopic.includes('math') || normalizedTopic.includes('formula') ? (
          /* 5. MATH RECIPE THEME */
          <div className="relative flex flex-col items-center justify-center w-full h-full text-center">
            <div className="flex items-center justify-around w-full max-w-xs">
              <div className="flex flex-col items-center">
                <span className="text-2xl">🧂</span>
                <span className="text-[10px] font-mono font-bold text-amber-400">a, b, c</span>
              </div>
              <span className="text-slate-400 font-bold text-sm">➔</span>
              <div className="flex flex-col items-center p-2 rounded-2xl bg-purple-950/60 border border-purple-500/40">
                <span className="text-3xl">🍲</span>
                <span className="text-[10px] font-bold text-purple-300 mt-1">Formula Pot</span>
              </div>
              <span className="text-slate-400 font-bold text-sm">➔</span>
              <div className="flex flex-col items-center">
                <span className="text-2xl">🍽️</span>
                <span className="text-[10px] font-mono font-bold text-emerald-400">x-Roots</span>
              </div>
            </div>
            <div className="mt-2 font-mono text-[11px] font-bold text-purple-300 bg-black/40 px-3 py-0.5 rounded-md border border-purple-500/30">
              x = (-b ± √(b² - 4ac)) / (2a)
            </div>
          </div>
        ) : (
          /* GENERAL / DEFAULT INFOGRAPHIC THEME */
          <div className="relative flex flex-col items-center justify-center w-full h-full text-center">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-2xl shadow-md">
                💡
              </div>
              <div className="text-left">
                <span className="text-xs font-bold text-slate-100 block">{topic}</span>
                <span className="text-[10px] text-amber-400/90 block">Visual Analogy Infographic</span>
              </div>
            </div>
            <div className="mt-2 text-xs font-medium text-slate-300 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-700/60 max-w-xs truncate">
              "{analogy}"
            </div>
          </div>
        )}
      </div>

      {/* Memory Anchors Bottom Section */}
      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-left">
        <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800">
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block mb-0.5">
            🔑 Analogy (10-Yr-Old Level):
          </span>
          <p className="text-xs text-slate-300 leading-snug line-clamp-2">
            {analogy}
          </p>
        </div>

        <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800">
          <span className="text-[10px] font-bold uppercase tracking-wider text-sky-400 block mb-0.5">
            🧠 Mnemonic Trick:
          </span>
          <p className="text-xs text-slate-300 leading-snug line-clamp-2">
            {mnemonic}
          </p>
        </div>
      </div>
    </div>
  );
};
