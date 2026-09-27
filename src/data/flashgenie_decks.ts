import { FlashCard, FlashGenieDeck, FlashGenieStats, SpacedRepetitionRating } from '../types';

export const STARTER_DECKS: FlashGenieDeck[] = [
  {
    id: 'deck-bio',
    name: 'Biology & Life Science',
    icon: '🌱',
    subject: 'Biology',
    color: 'emerald',
    description: 'Cell biology, human physiology, genetics, and molecular biochemistry.'
  },
  {
    id: 'deck-phys',
    name: 'Physics & Mechanics',
    icon: '⚡',
    subject: 'Physics',
    color: 'sky',
    description: 'Newtonian mechanics, electrodynamics, waves, and optics.'
  },
  {
    id: 'deck-chem',
    name: 'Chemistry & Molecules',
    icon: '🧪',
    subject: 'Chemistry',
    color: 'amber',
    description: 'Reaction mechanisms, chemical bonds, thermodynamics, and periodic table.'
  },
  {
    id: 'deck-math',
    name: 'Math Formulas as Recipes',
    icon: '📐',
    subject: 'Mathematics',
    color: 'purple',
    description: 'Calculus, algebra, geometry recipes, and memory shortcuts.'
  },
  {
    id: 'deck-hist',
    name: 'History Comics & Civics',
    icon: '🏛️',
    subject: 'History',
    color: 'rose',
    description: 'Historical turning points, constitutions, and 3-panel comic summaries.'
  }
];

export const STARTER_FLASHCARDS: FlashCard[] = [
  {
    id: 'card-photo-1',
    topic: 'Photosynthesis',
    subject: 'Biology',
    frontQuestion: 'How do green plants cook their own food using light?',
    backAnswer: 'Plants convert sunlight, water, and CO₂ into glucose sugar and release oxygen as clean exhaust.',
    analogy: 'A leaf is a tiny solar-powered rooftop kitchen baking sugar cookies for the tree.',
    mnemonic: "'COW eats GLOW' → CO₂ + Water + Light energy → Sugar + Oxygen.",
    emojiChain: '☀️ + 💧 + 🌬️ ➔ 🍬 + 🍃',
    imagePrompt: 'A cute cartoon leaf wearing a chef hat cooking glowing sugar cubes in a pot on a sun-stove, water droplets and CO₂ bubbles entering, oxygen bubbles and sugar cubes coming out, bold labels: Sunlight, Water, CO₂, Sugar, Oxygen, bright cheerful colors, white background',
    difficultyLevel: 'Beginner',
    tags: ['biology', 'botany', 'energy', 'plants'],
    deckId: 'deck-bio',
    deckName: 'Biology & Life Science',
    masteryStatus: 'learning',
    intervalDays: 3,
    nextReviewDate: new Date().toISOString().split('T')[0],
    reviewCount: 2,
    createdAt: '2026-09-20'
  },
  {
    id: 'card-mito-2',
    topic: 'Mitochondria',
    subject: 'Biology',
    frontQuestion: 'Why is the mitochondria called the powerhouse of the cell?',
    backAnswer: 'It burns nutrients and oxygen through cellular respiration to charge up ATP battery molecules.',
    analogy: 'Mitochondria is the rechargeable power plant supplying electricity to all the cell factories.',
    mnemonic: "'MIGHTY Mito Makes Money' → Mighty Mitochondria manufactures ATP currency.",
    emojiChain: '🍎 + 🫁 ➔ 🏭⚡ ➔ 🔋(ATP)',
    imagePrompt: 'Cartoon mitochondria shaped like a cute jellybean power plant with glowing turbine gears, turning apple slices and oxygen tanks into glowing bright ATP batteries, big bold labels: Glucose, Oxygen, ATP Battery, white background, flat infographic style',
    difficultyLevel: 'Beginner',
    tags: ['cell-bio', 'organelles', 'atp'],
    deckId: 'deck-bio',
    deckName: 'Biology & Life Science',
    masteryStatus: 'mastered',
    intervalDays: 7,
    nextReviewDate: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0],
    reviewCount: 5,
    createdAt: '2026-09-15'
  },
  {
    id: 'card-newt-3',
    topic: "Newton's 2nd Law",
    subject: 'Physics',
    frontQuestion: 'What happens when you push an object harder or add more mass?',
    backAnswer: 'Acceleration increases with force, but decreases with mass. Pushing harder speeds it up; heavier slows it down.',
    analogy: 'Pushing a shopping cart: an empty cart flies across the aisle, but a cart packed with bricks crawls.',
    mnemonic: "'FMA — Force Makes Acceleration' (F = m × a).",
    emojiChain: '💪 ➔ 🛒💨  vs  💪 ➔ 🛒🧱🐢',
    imagePrompt: 'A friendly cartoon mascot pushing an empty yellow shopping cart with speed lines (labeled Force & Acceleration) and struggling to push a cart full of heavy bricks (labeled Mass), bold text F = m × a, bright colors, flat educational infographic, white background',
    difficultyLevel: 'Beginner',
    tags: ['physics', 'mechanics', 'newton'],
    deckId: 'deck-phys',
    deckName: 'Physics & Mechanics',
    masteryStatus: 'learning',
    intervalDays: 3,
    nextReviewDate: new Date().toISOString().split('T')[0],
    reviewCount: 3,
    createdAt: '2026-09-18'
  },
  {
    id: 'card-ohm-4',
    topic: "Ohm's Law",
    subject: 'Physics',
    frontQuestion: 'How do Voltage, Current, and Resistance interact in a circuit?',
    backAnswer: 'Voltage pushes the electric current, while Resistance squeezes the pipe and restricts the flow (V = I × R).',
    analogy: 'Water in a garden hose: Voltage is water pressure, Current is water flowing, Resistance is stepping on the hose.',
    mnemonic: "'Very Important Rule' → V = I × R (Volts = Amps × Ohms).",
    emojiChain: '💧(Pressure) ➔ 🚰(Flow) ➗ 🪨(Block)',
    imagePrompt: 'Cartoon pipe showing three friendly characters: Volt pushing green Amp through a tunnel, while red Ohm character wraps a rope around the tunnel squeezing it tight, bold labels Volt, Amp, Ohm, colorful infographic, white background',
    difficultyLevel: 'Intermediate',
    tags: ['circuits', 'electricity', 'physics'],
    deckId: 'deck-phys',
    deckName: 'Physics & Mechanics',
    masteryStatus: 'new',
    intervalDays: 1,
    nextReviewDate: new Date().toISOString().split('T')[0],
    reviewCount: 0,
    createdAt: '2026-09-24'
  },
  {
    id: 'card-bonds-5',
    topic: 'Covalent vs Ionic Bonds',
    subject: 'Chemistry',
    frontQuestion: 'What is the key difference between covalent and ionic chemical bonding?',
    backAnswer: 'Covalent atoms hold hands and share electrons equally; ionic atoms completely gift or steal electrons like magnets.',
    analogy: 'Covalent is two friends sharing a blanket; Ionic is one person buying the blanket and sticking together by magnetic debt.',
    mnemonic: "'CO-valent CO-operates' (shares), 'IONIC has I-O-U charges' (+/- attract).",
    emojiChain: '🤝(Share e⁻)  vs  🎁 ➔ 🧲(Opposites Attract)',
    imagePrompt: 'Two cute cartoon atoms happily holding hands sharing two glowing yellow electron balls (labeled Covalent Sharing), and next to them a sodium atom handing an electron gift box to chlorine atom, gaining plus and minus magnet badges (labeled Ionic Transfer), bright colors, white background',
    difficultyLevel: 'Intermediate',
    tags: ['chemistry', 'bonding', 'electrons'],
    deckId: 'deck-chem',
    deckName: 'Chemistry & Molecules',
    masteryStatus: 'learning',
    intervalDays: 3,
    nextReviewDate: new Date().toISOString().split('T')[0],
    reviewCount: 2,
    createdAt: '2026-09-21'
  },
  {
    id: 'card-quad-6',
    topic: 'Quadratic Formula',
    subject: 'Mathematics',
    frontQuestion: 'What is the recipe for finding roots of ax² + bx + c = 0?',
    backAnswer: 'x = (-b ± √(b² - 4ac)) / (2a). Plug in the ingredients a, b, and c to solve any parabolic curve.',
    analogy: 'Cooking a signature dish: numbers a, b, c are spices tossed into the radical oven to bake the roots.',
    mnemonic: "'Negative boy couldn't decide (±) whether to go to a Radical party (√), but he squared up (b²), missed 4 awesome chicks (-4ac), and it was all over by 2 AM (/2a)'.",
    emojiChain: '🍲[a, b, c] ➔ ⏱️(Formula Recipe) ➔ 🍽️(x-roots)',
    imagePrompt: 'A playful recipe card drawn like a chef menu titled The Parabola Stew with ingredients a, b, c and pot simmering the equation x = (-b ± √(b² - 4ac)) / 2a, mascot owl tasting the broth, bold numbers, bright colors, flat infographic, white background',
    difficultyLevel: 'Intermediate',
    tags: ['math', 'algebra', 'formulas'],
    deckId: 'deck-math',
    deckName: 'Math Formulas as Recipes',
    masteryStatus: 'mastered',
    intervalDays: 7,
    nextReviewDate: new Date(Date.now() + 6 * 86400000).toISOString().split('T')[0],
    reviewCount: 4,
    createdAt: '2026-09-17'
  }
];

// LocalStorage helpers
const FLASHGENIE_CARDS_KEY = 'auraday_flashgenie_cards_v1';
const FLASHGENIE_DECKS_KEY = 'auraday_flashgenie_decks_v1';
const FLASHGENIE_STATS_KEY = 'auraday_flashgenie_stats_v1';

export function loadFlashCards(): FlashCard[] {
  try {
    const raw = localStorage.getItem(FLASHGENIE_CARDS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // fallback
  }
  return STARTER_FLASHCARDS;
}

export function saveFlashCards(cards: FlashCard[]): void {
  try {
    localStorage.setItem(FLASHGENIE_CARDS_KEY, JSON.stringify(cards));
  } catch {
    // ignore
  }
}

export function loadFlashDecks(): FlashGenieDeck[] {
  try {
    const raw = localStorage.getItem(FLASHGENIE_DECKS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // fallback
  }
  return STARTER_DECKS;
}

export function saveFlashDecks(decks: FlashGenieDeck[]): void {
  try {
    localStorage.setItem(FLASHGENIE_DECKS_KEY, JSON.stringify(decks));
  } catch {
    // ignore
  }
}

export function loadFlashStats(): FlashGenieStats {
  try {
    const raw = localStorage.getItem(FLASHGENIE_STATS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // fallback
  }
  return {
    streakDays: 5,
    totalMastered: 14,
    masteredThisWeek: 8,
    cardsReviewedToday: 4,
    lastReviewDate: new Date().toISOString().split('T')[0]
  };
}

export function saveFlashStats(stats: FlashGenieStats): void {
  try {
    localStorage.setItem(FLASHGENIE_STATS_KEY, JSON.stringify(stats));
  } catch {
    // ignore
  }
}

export function applySpacedRepetition(
  card: FlashCard,
  rating: SpacedRepetitionRating
): { updatedCard: FlashCard; intervalDays: number; statusMessage: string } {
  const today = new Date();
  let intervalDays = 1;
  let masteryStatus = card.masteryStatus;

  if (rating === 'easy') {
    intervalDays = 7;
    masteryStatus = 'mastered';
  } else if (rating === 'okay') {
    intervalDays = 3;
    masteryStatus = 'learning';
  } else {
    // hard
    intervalDays = 1;
    masteryStatus = 'learning';
  }

  const nextDate = new Date(today);
  nextDate.setDate(nextDate.getDate() + intervalDays);
  const nextReviewDate = nextDate.toISOString().split('T')[0];

  const updatedCard: FlashCard = {
    ...card,
    masteryStatus,
    intervalDays,
    nextReviewDate,
    lastReviewedDate: today.toISOString().split('T')[0],
    reviewCount: card.reviewCount + 1
  };

  const statusMessage = rating === 'easy'
    ? '😄 Easy! Mastered. Scheduled for review in 7 days.'
    : rating === 'okay'
    ? '🤔 Good progress! Scheduled for review in 3 days.'
    : '😵 Challenging! Queued for rapid reinforcement tomorrow.';

  return { updatedCard, intervalDays, statusMessage };
}
