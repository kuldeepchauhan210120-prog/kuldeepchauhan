import React, { useState, useRef } from 'react';
import {
  Sparkles, Camera, Upload, Layers, Shuffle, RotateCcw,
  CheckCircle2, Clock, Flame, BookOpen, Plus, Tag, ArrowRight,
  Globe, Edit3, Trash2, Eye, HelpCircle, Check, X, ArrowLeft
} from 'lucide-react';
import { FlashCard, FlashGenieDeck, FlashGenieStats, SpacedRepetitionRating, ThemeConfig } from '../types';
import { applySpacedRepetition } from '../data/flashgenie_decks';
import { FlashcardIllustration } from './FlashcardIllustration';
import { fireTaskConfetti, playSuccessChime, triggerHapticFeedback } from '../utils/feedback';

interface FlashGenieStudioProps {
  cards: FlashCard[];
  decks: FlashGenieDeck[];
  stats: FlashGenieStats;
  theme: ThemeConfig;
  onSaveCard: (card: FlashCard) => void;
  onDeleteCard: (cardId: string) => void;
  onUpdateCardRating: (cardId: string, rating: SpacedRepetitionRating) => void;
  onCreateDeck: (deck: FlashGenieDeck) => void;
  onClose?: () => void;
}

// Sample study notes for instant 1-tap testing
const SAMPLE_STUDY_NOTES = [
  {
    label: "🌿 Biology: Photosynthesis & Light Reactions",
    topic: "Photosynthesis",
    subject: "Biology",
    notes: "Light reaction happens in thylakoid membranes where chlorophyll absorbs photons, splitting H2O into oxygen, electrons, and protons to make ATP and NADPH. Dark reaction/Calvin cycle uses CO2 and rubisco enzyme in stroma to create G3P sugar.",
  },
  {
    label: "⚡ Physics: Newton's Second Law & Acceleration",
    topic: "Newton's 2nd Law",
    subject: "Physics",
    notes: "The acceleration of an object is directly proportional to the net force acting upon it and inversely proportional to its mass. Standard equation: Net Force F = m * a.",
  },
  {
    label: "🧪 Chemistry: Le Chatelier's Principle",
    topic: "Le Chatelier Principle",
    subject: "Chemistry",
    notes: "When a chemical system at equilibrium is disturbed by a change in temperature, pressure, or concentration of components, the system shifts equilibrium position in a way that counteracts the disturbance.",
  },
  {
    label: "📐 Mathematics: Pythagorean Theorem",
    topic: "Pythagorean Theorem",
    subject: "Mathematics",
    notes: "In any right-angled triangle, the area of the square whose side is the hypotenuse is equal to the sum of the areas of the squares on the other two legs: a² + b² = c².",
  },
  {
    label: "🏛️ History: French Revolution Bastille Storming",
    topic: "French Revolution",
    subject: "History",
    notes: "On July 14, 1789, French revolutionaries attacked the medieval fortress and political prison known as the Bastille, symbolizing the fall of royal tyranny and launching the declaration of rights.",
  }
];

export const FlashGenieStudio: React.FC<FlashGenieStudioProps> = ({
  cards,
  decks,
  stats,
  theme,
  onSaveCard,
  onDeleteCard,
  onUpdateCardRating,
  onCreateDeck,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'create' | 'review' | 'decks'>('create');
  const [selectedDeckId, setSelectedDeckId] = useState<string>('all');

  // Creation State
  const [inputText, setInputText] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('Biology');
  const [uploadedImagePreview, setUploadedImagePreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState<number>(0);
  const [generatedCard, setGeneratedCard] = useState<FlashCard | null>(null);
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [saveSuccessToast, setSaveSuccessToast] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Review (Spaced Repetition) Mode State
  const [reviewIndex, setReviewIndex] = useState(0);
  const [isReviewFlipped, setIsReviewFlipped] = useState(false);
  const [sessionCompletedCount, setSessionCompletedCount] = useState(0);
  const [lastReviewFeedback, setLastReviewFeedback] = useState<string | null>(null);

  // Filtered Cards for Review
  const reviewDeckCards = cards.filter(c => selectedDeckId === 'all' || c.deckId === selectedDeckId);
  const currentReviewCard = reviewDeckCards[reviewIndex] || reviewDeckCards[0];

  // Helper to simulate or execute the 4-step FlashGenie pipeline
  const processStudyContent = (text: string, subject: string, topicOverride?: string) => {
    setIsAnalyzing(true);
    setAnalysisStep(1); // Step 1: Analyze

    setTimeout(() => {
      setAnalysisStep(2); // Step 2: Simplify for 10-year-old

      setTimeout(() => {
        setAnalysisStep(3); // Step 3: Generate visual illustration prompt

        setTimeout(() => {
          setAnalysisStep(4); // Step 4: Assemble visual flashcard

          const cleanTopic = topicOverride || (
            text.toLowerCase().includes('photo') ? 'Photosynthesis' :
            text.toLowerCase().includes('newton') ? "Newton's 2nd Law" :
            text.toLowerCase().includes('chatelier') ? "Le Chatelier Principle" :
            text.toLowerCase().includes('pythagor') ? "Pythagorean Theorem" :
            text.toLowerCase().includes('bastille') || text.toLowerCase().includes('revolution') ? "French Revolution" :
            text.split(' ').slice(0, 3).join(' ') || "Core Concept"
          );

          // Build smart analogies & mnemonics matching the user prompt instructions
          let analogy = "Like a master chef balancing ingredients in a busy kitchen.";
          let mnemonic = "'FAST' → Focus, Action, Simplify, Test.";
          let emojiChain = "💡 ➔ ⚙️ ➔ 🎯";
          let question = `What is the fundamental mechanism of ${cleanTopic}?`;
          let answer = `${cleanTopic} works by balancing key inputs and outputs to achieve predictable equilibrium.`;
          let imagePrompt = `Cartoon infographic of ${cleanTopic} with labeled arrows, bright colors, bold text, playful mascot, flat design, white background`;

          if (cleanTopic.toLowerCase().includes('photo')) {
            analogy = "A leaf is a tiny solar-powered rooftop kitchen baking sugar cookies for the tree.";
            mnemonic = "'COW eats GLOW' → CO₂ + Water + Light energy → Sugar + Oxygen.";
            emojiChain = "☀️ + 💧 + 🌬️ ➔ 🍬 + 🍃";
            question = "How do green plants cook their own food using light?";
            answer = "Plants cook glucose sugar using sunlight, water, and CO₂ while breathing out oxygen.";
            imagePrompt = "A cartoon leaf wearing a chef hat, cooking sugar cubes in a pot on a sun-stove, water droplets and CO₂ bubbles entering, oxygen bubbles and sugar cubes coming out, bold labels: Sunlight, Water, CO₂, Sugar, Oxygen, cute style, white background";
          } else if (cleanTopic.toLowerCase().includes('newton')) {
            analogy = "Pushing a shopping cart: an empty cart flies, a full cart packed with bricks crawls.";
            mnemonic = "'FMA — Force Makes Acceleration' (F = m × a).";
            emojiChain = "💪 ➔ 🛒💨  vs  💪 ➔ 🛒🧱🐢";
            question = "What happens when you push harder or carry more mass?";
            answer = "More force = more acceleration. More mass = less acceleration. Net Force F = m × a.";
            imagePrompt = "Cartoon of a person pushing an empty shopping cart that zooms fast, and a full shopping cart that barely moves, arrows labeled Force, Mass, Acceleration, bright colors, bold text, flat infographic style, white background";
          } else if (cleanTopic.toLowerCase().includes('chatelier')) {
            analogy = "A seesaw with stubborn kids: when one side gets too heavy, the system slides weight to the other side.";
            mnemonic = "'PUSH BACK' → Whatever stress you apply, the reaction shifts to undo it.";
            emojiChain = "⚖️ ➔ ➕(Heat/Pressure) ➔ 🔄(Shift to balance)";
            question = "How does a chemical system react when disturbed at equilibrium?";
            answer = "The system automatically shifts its reaction direction to counteract and minimize the applied change.";
            imagePrompt = "Cartoon seesaw with friendly flask characters balancing weights, arrows showing shift to restore balance, bold labels: Reactants, Products, Stress, Shift, bright colors, white background";
          } else if (cleanTopic.toLowerCase().includes('pythagor')) {
            analogy = "The shortcut across the grass field equals the square of the two pavement sidewalks.";
            mnemonic = "'All Boys Climb' → a² + b² = c² (Legs squared = Hypotenuse squared).";
            emojiChain = "📐[a² + b²] ➔ 📏[c²]";
            question = "How do you calculate the diagonal hypotenuse of a right triangle?";
            answer = "Square the two shorter sides (a² + b²), add them together, and take the square root for side c.";
            imagePrompt = "Cartoon right triangle with squares built on each side, filled with colorful blocks showing area a² + b² = c², friendly math mascot owl pointing a ruler, bold text, flat design, white background";
          } else if (cleanTopic.toLowerCase().includes('revolution')) {
            analogy = "A pressure cooker with the lid locked: when the heat gets unbearable, the steam blows the lid off.";
            mnemonic = "'LIBERTY' → Lockout, Insurrection, Bastille, Equality, Republic.";
            emojiChain = "🏰💥 ➔ 📜(Rights) ➔ 👑❌";
            question = "Why was the storming of the Bastille a turning point?";
            answer = "It destroyed the symbol of the king's tyranny, giving ordinary citizens the power to demand liberty and constitutional equality.";
            imagePrompt = "3-panel comic strip style: King taxing poor peasants -> Bastille fortress stormed with torches -> Citizens celebrating with Declaration of Rights, time-traveling owl narrator mascot, bright colors, white background";
          }

          const newCard: FlashCard = {
            id: `card-${Date.now()}`,
            topic: cleanTopic,
            subject,
            frontQuestion: question,
            backAnswer: answer,
            analogy,
            mnemonic,
            emojiChain,
            imagePrompt,
            difficultyLevel: 'Beginner',
            tags: [subject.toLowerCase(), cleanTopic.toLowerCase().replace(/\s+/g, '-')],
            deckId: decks.find(d => d.subject.toLowerCase() === subject.toLowerCase())?.id || decks[0].id,
            deckName: decks.find(d => d.subject.toLowerCase() === subject.toLowerCase())?.name || decks[0].name,
            masteryStatus: 'new',
            intervalDays: 1,
            nextReviewDate: new Date().toISOString().split('T')[0],
            reviewCount: 0,
            createdAt: new Date().toISOString().split('T')[0],
            sourceImageUrl: uploadedImagePreview || undefined
          };

          setGeneratedCard(newCard);
          setIsAnalyzing(false);
          setIsCardFlipped(false);
          playSuccessChime(false);
        }, 350);
      }, 350);
    }, 400);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setUploadedImagePreview(result);
        processStudyContent(file.name.replace(/\.[^/.]+$/, ""), selectedSubject);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveToDeck = () => {
    if (!generatedCard) return;
    onSaveCard(generatedCard);
    setSaveSuccessToast(true);
    fireTaskConfetti(0.5, 0.5);
    setTimeout(() => setSaveSuccessToast(false), 3000);
  };

  const handleReviewRating = (rating: SpacedRepetitionRating) => {
    if (!currentReviewCard) return;
    const { updatedCard, statusMessage } = applySpacedRepetition(currentReviewCard, rating);
    onUpdateCardRating(currentReviewCard.id, rating);
    setLastReviewFeedback(statusMessage);
    setSessionCompletedCount(prev => prev + 1);

    if (rating === 'easy') {
      triggerHapticFeedback([20, 50, 20]);
      fireTaskConfetti(0.5, 0.6);
    } else {
      triggerHapticFeedback([30]);
    }

    // Advance to next card
    setTimeout(() => {
      setIsReviewFlipped(false);
      setLastReviewFeedback(null);
      if (reviewIndex + 1 < reviewDeckCards.length) {
        setReviewIndex(reviewIndex + 1);
      } else {
        setReviewIndex(0);
      }
    }, 900);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center text-2xl shadow-lg shadow-amber-500/20 text-white font-bold">
            🧞‍♂️
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight">FlashGenie</h1>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                Visual AI Flashcards
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Turn photos &amp; study notes into unforgettable visual flashcards with 1 analogy + 1 mnemonic.
            </p>
          </div>
        </div>

        {/* Global Spaced Repetition Stats Anchor */}
        <div className="flex items-center gap-2.5 bg-black/20 border border-inherit/40 p-1.5 px-3 rounded-2xl text-xs font-semibold">
          <div className="flex items-center gap-1 text-amber-400">
            <Flame className="w-4 h-4 fill-amber-500 text-amber-500 animate-pulse" />
            <span>{stats.streakDays}-Day Streak</span>
          </div>
          <span className="opacity-30">|</span>
          <div className="flex items-center gap-1 text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
            <span>{stats.totalMastered} Mastered</span>
          </div>
        </div>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="flex items-center justify-between border-b border-inherit/40 pb-3 mb-6">
        <div className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => setActiveTab('create')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition ${
              activeTab === 'create'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-500/10'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>Generate Visual Card</span>
          </button>

          <button
            onClick={() => setActiveTab('review')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition ${
              activeTab === 'review'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-500/10'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Spaced Repetition ({reviewDeckCards.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('decks')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition ${
              activeTab === 'decks'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-500/10'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>My Decks ({decks.length})</span>
          </button>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-xs font-semibold opacity-60 hover:opacity-100 hover:bg-slate-500/10"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* ========================================================= */}
      {/* TAB 1: GENERATE / SNAP VISUAL FLASHCARD                   */}
      {/* ========================================================= */}
      {activeTab === 'create' && (
        <div className="space-y-6">
          {/* Welcome Prompt Anchor */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 via-rose-500/10 to-indigo-500/15 border border-amber-500/30 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">📸</span>
              <div>
                <p className="text-sm font-bold text-slate-100">
                  "Hi! Snap a photo of any topic and I'll make a flashcard you'll never forget."
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  Upload textbook pages, whiteboard diagrams, or paste notes. FlashGenie simplifies it for a 10-year-old with 1 vivid analogy and 1 mnemonic.
                </p>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => cameraInputRef.current?.click()}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-amber-500 text-slate-950 hover:bg-amber-400 transition active:scale-95 shadow-md"
                title="Take photo using camera"
              >
                <Camera className="w-4 h-4" />
                <span className="hidden sm:inline">Take Photo</span>
              </button>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border border-inherit/40 hover:border-amber-500/50 bg-black/20 hover:bg-black/30 transition"
                title="Upload image file"
              >
                <Upload className="w-4 h-4" />
                <span className="hidden sm:inline">Upload Image</span>
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          </div>

          {/* Input Formulation Area */}
          <div className={`p-5 rounded-3xl border ${theme.cardBackground} shadow-lg space-y-4`}>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Enter Study Notes, Topic Name, or Diagram Description:
              </label>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Paste or write notes (e.g., 'Mitochondria burns glucose and oxygen to make ATP' or 'Newton's second law: Force equals mass times acceleration...')"
                className="w-full h-24 p-3.5 text-xs sm:text-sm rounded-2xl border border-inherit bg-black/20 focus:outline-none focus:ring-2 focus:ring-amber-500/50 resize-none text-slate-100 placeholder:opacity-40"
              />
            </div>

            {/* Subject Selector & Preset Notes */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[11px] font-semibold text-slate-400 mr-1">Subject:</span>
                {['Biology', 'Physics', 'Chemistry', 'Mathematics', 'History'].map(sub => (
                  <button
                    key={sub}
                    type="button"
                    onClick={() => setSelectedSubject(sub)}
                    className={`px-2.5 py-1 rounded-xl text-xs font-semibold border transition ${
                      selectedSubject === sub
                        ? 'bg-amber-500/20 border-amber-500 text-amber-400'
                        : 'border-inherit/40 opacity-70 hover:opacity-100 hover:bg-slate-500/10'
                    }`}
                  >
                    {sub}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => processStudyContent(inputText || "Cellular Respiration and Energy", selectedSubject)}
                disabled={isAnalyzing}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-amber-500 text-slate-950 hover:bg-amber-400 transition active:scale-95 shadow-md shadow-amber-500/20 disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4 fill-current" />
                <span>Generate Unforgettable Card</span>
              </button>
            </div>

            {/* Instant Sample Inspiration Picker */}
            <div className="pt-3 border-t border-inherit/30">
              <span className="text-[11px] font-semibold text-slate-400 block mb-2">
                Or Try Sample High-Yield Study Notes (Instant Demo):
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {SAMPLE_STUDY_NOTES.map((sample, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setInputText(sample.notes);
                      setSelectedSubject(sample.subject);
                      processStudyContent(sample.notes, sample.subject, sample.topic);
                    }}
                    className="text-left p-2.5 rounded-xl border border-inherit/40 hover:border-amber-500/40 bg-black/10 hover:bg-slate-500/10 transition group"
                  >
                    <span className="text-xs font-bold text-slate-200 group-hover:text-amber-400 block">
                      {sample.label}
                    </span>
                    <span className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                      {sample.notes}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Analysis Loading Progress (The 4-Step Pipeline) */}
          {isAnalyzing && (
            <div className="p-6 rounded-3xl bg-slate-900 border border-amber-500/40 text-center space-y-4 shadow-xl animate-in fade-in">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500 text-amber-400 mx-auto flex items-center justify-center animate-spin">
                🧠
              </div>
              <h3 className="text-base font-bold text-slate-100">
                FlashGenie is Synthesizing Your Memory Trick...
              </h3>
              <div className="max-w-md mx-auto grid grid-cols-4 gap-2 text-[10px] font-bold">
                <div className={`p-2 rounded-xl border transition ${analysisStep >= 1 ? 'border-amber-500 bg-amber-500/20 text-amber-300' : 'border-slate-800 opacity-40'}`}>
                  1. Analyze
                </div>
                <div className={`p-2 rounded-xl border transition ${analysisStep >= 2 ? 'border-amber-500 bg-amber-500/20 text-amber-300' : 'border-slate-800 opacity-40'}`}>
                  2. Simplify (10yo)
                </div>
                <div className={`p-2 rounded-xl border transition ${analysisStep >= 3 ? 'border-amber-500 bg-amber-500/20 text-amber-300' : 'border-slate-800 opacity-40'}`}>
                  3. Image Prompt
                </div>
                <div className={`p-2 rounded-xl border transition ${analysisStep >= 4 ? 'border-amber-500 bg-amber-500/20 text-amber-300' : 'border-slate-800 opacity-40'}`}>
                  4. Assemble Card
                </div>
              </div>
            </div>
          )}

          {/* GENERATED FLASHCARD PREVIEW CARD (Interactive Flip Card) */}
          {generatedCard && !isAnalyzing && (
            <div className="space-y-4 animate-in slide-in-from-bottom-3 duration-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                    FlashGenie Output Card
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-semibold">
                    10-Year-Old Friendly ✨
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsCardFlipped(!isCardFlipped)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Flip Card ({isCardFlipped ? 'Show Front' : 'Show Back'})</span>
                  </button>
                </div>
              </div>

              {/* The Physical Card Container */}
              <div
                onClick={() => setIsCardFlipped(!isCardFlipped)}
                className={`relative rounded-3xl p-6 sm:p-8 border cursor-pointer transition-all duration-300 select-none shadow-2xl ${
                  isCardFlipped
                    ? 'bg-slate-900 border-amber-500/40 text-slate-100'
                    : 'bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/60 border-slate-700/60 text-slate-100'
                }`}
                style={{ minHeight: '380px' }}
              >
                {!isCardFlipped ? (
                  /* FRONT OF CARD */
                  <div className="flex flex-col items-center justify-center text-center h-full min-h-[320px] space-y-4">
                    <span className="text-[11px] font-bold uppercase tracking-widest text-amber-500 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30">
                      {generatedCard.subject} · Front Question
                    </span>

                    <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white max-w-lg leading-snug">
                      {generatedCard.topic}
                    </h2>

                    <p className="text-base sm:text-lg text-slate-300 max-w-md font-medium leading-relaxed">
                      "{generatedCard.frontQuestion}"
                    </p>

                    <div className="pt-6 flex items-center gap-2 text-xs font-semibold text-amber-400/80 animate-pulse">
                      <span>Click anywhere to reveal simple answer &amp; visual trick ➔</span>
                    </div>
                  </div>
                ) : (
                  /* BACK OF CARD: Simple Answer + Vector Infographic + Analogy + Mnemonic */
                  <div className="space-y-4 text-left">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-amber-400">{generatedCard.topic}</span>
                        <span className="text-[10px] text-slate-400">· Back Explanation</span>
                      </div>
                      <span className="text-xs font-mono text-emerald-400 font-bold">Grade-5 Reading Level</span>
                    </div>

                    {/* Simple Definition */}
                    <div className="p-3 rounded-2xl bg-black/30 border border-slate-800">
                      <p className="text-sm sm:text-base font-semibold text-slate-100 leading-snug">
                        {generatedCard.backAnswer}
                      </p>
                    </div>

                    {/* The Visual Infographic */}
                    <FlashcardIllustration
                      topic={generatedCard.topic}
                      subject={generatedCard.subject}
                      analogy={generatedCard.analogy}
                      mnemonic={generatedCard.mnemonic}
                      emojiChain={generatedCard.emojiChain}
                    />

                    {/* DALL-E / Stable Diffusion Prompt Card */}
                    <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] text-slate-400 font-mono">
                      <span className="font-bold text-amber-400 block mb-1">🎨 DALL·E / SD Visual Prompt:</span>
                      <p className="line-clamp-2">{generatedCard.imagePrompt}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons: Save, Translate, Regenerate */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      if (!generatedCard) return;
                      // Simplify more
                      setGeneratedCard({
                        ...generatedCard,
                        backAnswer: `In simplest words: ${generatedCard.analogy}`,
                        difficultyLevel: 'Beginner'
                      });
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border border-inherit/40 hover:bg-slate-500/10 text-slate-300"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Simplify Even More</span>
                  </button>

                  <button
                    onClick={() => {
                      if (!generatedCard) return;
                      // Translate to Hindi / multilingual summary
                      setGeneratedCard({
                        ...generatedCard,
                        mnemonic: `${generatedCard.mnemonic} (हिंदी: ${generatedCard.topic} को सरलता से याद रखने की अनोखी ट्रिक)`
                      });
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border border-inherit/40 hover:bg-slate-500/10 text-slate-300"
                  >
                    <Globe className="w-3.5 h-3.5" />
                    <span>Multilingual Note</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSaveToDeck}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-emerald-500 text-slate-950 hover:bg-emerald-400 transition active:scale-95 shadow-md shadow-emerald-500/20"
                  >
                    <Check className="w-4 h-4 stroke-[3]" />
                    <span>Save to Deck</span>
                  </button>
                </div>
              </div>

              {saveSuccessToast && (
                <div className="p-3 rounded-2xl bg-emerald-950/60 border border-emerald-500 text-emerald-200 text-xs font-semibold text-center animate-in fade-in">
                  🎉 Card saved into <strong>{generatedCard.deckName}</strong>! Ready for spaced repetition practice.
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: SPACED REPETITION REVIEW COACH                     */}
      {/* ========================================================= */}
      {activeTab === 'review' && (
        <div className="space-y-6">
          {/* Deck Filter & Progress Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-black/20 p-3 rounded-2xl border border-inherit/40">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400">Review Deck:</span>
              <select
                value={selectedDeckId}
                onChange={(e) => {
                  setSelectedDeckId(e.target.value);
                  setReviewIndex(0);
                  setIsReviewFlipped(false);
                }}
                className="px-2.5 py-1 text-xs font-bold rounded-xl border border-inherit bg-slate-900 text-slate-200"
              >
                <option value="all">All Flashcard Decks ({cards.length})</option>
                {decks.map(d => (
                  <option key={d.id} value={d.id}>{d.name} ({cards.filter(c => c.deckId === d.id).length})</option>
                ))}
              </select>
            </div>

            <div className="text-xs font-medium text-slate-400">
              Card {reviewDeckCards.length > 0 ? reviewIndex + 1 : 0} of {reviewDeckCards.length}
            </div>
          </div>

          {currentReviewCard ? (
            <div className="space-y-4">
              {/* Spaced Repetition Card Body */}
              <div
                onClick={() => setIsReviewFlipped(!isReviewFlipped)}
                className={`relative rounded-3xl p-6 sm:p-8 border cursor-pointer transition-all duration-300 select-none shadow-2xl ${
                  isReviewFlipped
                    ? 'bg-slate-900 border-amber-500/40 text-slate-100'
                    : 'bg-gradient-to-br from-slate-900 to-indigo-950/60 border-slate-700/60 text-slate-100'
                }`}
                style={{ minHeight: '360px' }}
              >
                {!isReviewFlipped ? (
                  /* FRONT: Question Prompt */
                  <div className="flex flex-col items-center justify-center text-center h-full min-h-[300px] space-y-4">
                    <span className="text-[11px] font-bold uppercase tracking-widest text-amber-500 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30">
                      {currentReviewCard.subject} · {currentReviewCard.deckName}
                    </span>

                    <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white max-w-lg leading-snug">
                      {currentReviewCard.topic}
                    </h2>

                    <p className="text-base sm:text-lg text-slate-300 max-w-md font-medium leading-relaxed">
                      "{currentReviewCard.frontQuestion}"
                    </p>

                    <div className="pt-6 flex items-center gap-2 text-xs font-semibold text-amber-400/80 animate-pulse">
                      <span>Click to flip &amp; check if you remember ➔</span>
                    </div>
                  </div>
                ) : (
                  /* BACK: Answer, Analogy, Mnemonic & Vector Canvas */
                  <div className="space-y-4 text-left">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <span className="text-xs font-bold text-amber-400">{currentReviewCard.topic}</span>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">
                        Interval: {currentReviewCard.intervalDays} days
                      </span>
                    </div>

                    <div className="p-3 rounded-2xl bg-black/30 border border-slate-800">
                      <p className="text-sm sm:text-base font-semibold text-slate-100">
                        {currentReviewCard.backAnswer}
                      </p>
                    </div>

                    <FlashcardIllustration
                      topic={currentReviewCard.topic}
                      subject={currentReviewCard.subject}
                      analogy={currentReviewCard.analogy}
                      mnemonic={currentReviewCard.mnemonic}
                      emojiChain={currentReviewCard.emojiChain}
                    />
                  </div>
                )}
              </div>

              {/* COACH RATING QUESTION: "Did you remember it? 😄 / 🤔 / 😵" */}
              <div className="p-4 rounded-2xl bg-black/20 border border-inherit/40 text-center space-y-3">
                <span className="text-xs font-bold text-slate-300 block">
                  Did you remember it?
                </span>

                <div className="grid grid-cols-3 gap-3 max-w-md mx-auto">
                  <button
                    onClick={() => handleReviewRating('easy')}
                    className="p-3 rounded-xl border border-emerald-500/40 bg-emerald-950/20 hover:bg-emerald-500/20 text-emerald-300 font-bold text-xs transition active:scale-95 flex flex-col items-center gap-1"
                  >
                    <span className="text-xl">😄</span>
                    <span>Easy</span>
                    <span className="text-[10px] opacity-70">Review in 7 days</span>
                  </button>

                  <button
                    onClick={() => handleReviewRating('okay')}
                    className="p-3 rounded-xl border border-amber-500/40 bg-amber-950/20 hover:bg-amber-500/20 text-amber-300 font-bold text-xs transition active:scale-95 flex flex-col items-center gap-1"
                  >
                    <span className="text-xl">🤔</span>
                    <span>Okay</span>
                    <span className="text-[10px] opacity-70">Review in 3 days</span>
                  </button>

                  <button
                    onClick={() => handleReviewRating('hard')}
                    className="p-3 rounded-xl border border-rose-500/40 bg-rose-950/20 hover:bg-rose-500/20 text-rose-300 font-bold text-xs transition active:scale-95 flex flex-col items-center gap-1"
                  >
                    <span className="text-xl">😵</span>
                    <span>Hard</span>
                    <span className="text-[10px] opacity-70">Review tomorrow</span>
                  </button>
                </div>

                {lastReviewFeedback && (
                  <p className="text-xs text-amber-400 font-semibold animate-in fade-in">
                    {lastReviewFeedback}
                  </p>
                )}
              </div>

              {/* Review Session Progress */}
              <div className="flex items-center justify-between text-xs text-slate-400 px-2">
                <span>🔥 {stats.streakDays}-day streak! Keep going!</span>
                <span>📈 Mastered {stats.totalMastered} cards so far</span>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center rounded-3xl border border-dashed border-inherit/40">
              <p className="text-sm font-semibold text-slate-300">No cards found in this deck.</p>
              <button
                onClick={() => setActiveTab('create')}
                className="mt-3 px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 text-slate-950 hover:bg-amber-400 transition"
              >
                Create First Card Now
              </button>
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 3: MY DECKS & REPOSITORY                              */}
      {/* ========================================================= */}
      {activeTab === 'decks' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {decks.map(deck => {
              const deckCards = cards.filter(c => c.deckId === deck.id);
              const masteredCount = deckCards.filter(c => c.masteryStatus === 'mastered').length;

              return (
                <div
                  key={deck.id}
                  className="p-5 rounded-2xl border border-inherit/40 bg-slate-900/60 hover:border-amber-500/40 transition space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">{deck.icon}</span>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-amber-400">
                      {deckCards.length} cards
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-slate-100">{deck.name}</h3>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {deck.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-emerald-400 font-semibold">{masteredCount} mastered</span>
                    <button
                      onClick={() => {
                        setSelectedDeckId(deck.id);
                        setActiveTab('review');
                      }}
                      className="px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-500/20 hover:bg-amber-500 text-amber-400 hover:text-slate-950 transition"
                    >
                      Study Deck ➔
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* All Cards Table / Viewer */}
          <div className="mt-8">
            <h3 className="text-sm font-bold text-slate-200 mb-3">All Saved Flashcards ({cards.length})</h3>
            <div className="space-y-2">
              {cards.map(c => (
                <div
                  key={c.id}
                  className="p-3 rounded-xl border border-inherit/30 bg-black/10 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="font-bold text-amber-400">{c.topic}:</span>
                    <span className="text-slate-300 truncate">{c.frontQuestion}</span>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-400">
                      {c.deckName}
                    </span>
                    <button
                      onClick={() => onDeleteCard(c.id)}
                      className="p-1 opacity-40 hover:opacity-100 hover:text-rose-400"
                      title="Delete card"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
