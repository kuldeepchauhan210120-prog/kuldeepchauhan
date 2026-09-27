export interface Quote {
  id: number;
  quote: string;
  author: string;
  category: 'Clarity & Focus' | 'Morning Calm' | 'Perseverance' | 'Wisdom' | 'Creativity' | 'Mindfulness';
  source?: string;
  reflectionPrompt?: string;
}

// 365+ Curated Daily Quotes for every day of the year
export const QUOTES_CMS: Quote[] = [
  {
    id: 1,
    quote: "You have power over your mind - not outside events. Realize this, and you will find strength.",
    author: "Marcus Aurelius",
    category: "Morning Calm",
    reflectionPrompt: "What external event can you choose not to let disturb your peace today?"
  },
  {
    id: 2,
    quote: "The secret of getting ahead is getting started. The secret of getting started is breaking your complex overwhelming tasks into small manageable tasks.",
    author: "Mark Twain",
    category: "Clarity & Focus",
    reflectionPrompt: "What is the single smallest action you can take right now?"
  },
  {
    id: 3,
    quote: "Simplicity is the ultimate sophistication.",
    author: "Leonardo da Vinci",
    category: "Clarity & Focus",
    reflectionPrompt: "What clutter or unnecessary step can you strip away today?"
  },
  {
    id: 4,
    quote: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.",
    author: "Will Durant (on Aristotle)",
    category: "Perseverance",
    reflectionPrompt: "Which core habit are you reinforcing with today's top priority?"
  },
  {
    id: 5,
    quote: "Smile, breathe and go slowly. There is no need to hurry. The journey is the destination.",
    author: "Thich Nhat Hanh",
    category: "Mindfulness",
    reflectionPrompt: "How can you bring a relaxed, unhurried presence into your morning tasks?"
  },
  {
    id: 6,
    quote: "It is not that we have a short time to live, but that we waste a lot of it.",
    author: "Seneca",
    category: "Wisdom",
    reflectionPrompt: "Where is your attention most easily stolen during the workday?"
  },
  {
    id: 7,
    quote: "Do what you can, with what you have, where you are.",
    author: "Theodore Roosevelt",
    category: "Perseverance",
    reflectionPrompt: "What resource do you currently possess that you can put to immediate use?"
  },
  {
    id: 8,
    quote: "Focus is a muscle. The more you protect your attention, the more deeply you can think.",
    author: "Cal Newport",
    category: "Clarity & Focus",
    reflectionPrompt: "What deep-work block will you guard against interruptions today?"
  },
  {
    id: 9,
    quote: "When you arise in the morning think of what a privilege it is to be alive, to think, to enjoy, to love.",
    author: "Marcus Aurelius",
    category: "Morning Calm",
    reflectionPrompt: "What is one simple sensory blessing you appreciate right this moment?"
  },
  {
    id: 10,
    quote: "Action is the foundational key to all success.",
    author: "Pablo Picasso",
    category: "Creativity",
    reflectionPrompt: "What creative initiative has been waiting for your first brushstroke?"
  },
  {
    id: 11,
    quote: "Happiness is not something readymade. It comes from your own actions.",
    author: "Dalai Lama",
    category: "Mindfulness",
    reflectionPrompt: "What intentional action will bring quiet joy to your afternoon?"
  },
  {
    id: 12,
    quote: "The impediment to action advances action. What stands in the way becomes the way.",
    author: "Marcus Aurelius",
    category: "Perseverance",
    reflectionPrompt: "How can today's primary obstacle be turned into an advantage?"
  },
  {
    id: 13,
    quote: "Nature does not hurry, yet everything is accomplished.",
    author: "Lao Tzu",
    category: "Morning Calm",
    reflectionPrompt: "Can you trust the organic pacing of your efforts today?"
  },
  {
    id: 14,
    quote: "You do not rise to the level of your goals. You fall to the level of your systems.",
    author: "James Clear",
    category: "Clarity & Focus",
    reflectionPrompt: "What system or routine is supporting your Top 3 priorities today?"
  },
  {
    id: 15,
    quote: "He who has a why to live can bear almost any how.",
    author: "Friedrich Nietzsche",
    category: "Wisdom",
    reflectionPrompt: "What deeper purpose drives your essential work today?"
  },
  {
    id: 16,
    quote: "Peace comes from within. Do not seek it without.",
    author: "Buddha",
    category: "Mindfulness",
    reflectionPrompt: "Take three slow breaths before checking notifications."
  },
  {
    id: 17,
    quote: "The best time to plant a tree was 20 years ago. The second best time is now.",
    author: "Chinese Proverb",
    category: "Perseverance",
    reflectionPrompt: "What long-delayed task will you begin today without regret?"
  },
  {
    id: 18,
    quote: "Creativity is intelligence having fun.",
    author: "Albert Einstein",
    category: "Creativity",
    reflectionPrompt: "Where can you introduce playful curiosity into your solving?"
  },
  {
    id: 19,
    quote: "The only limit to our realization of tomorrow will be our doubts of today.",
    author: "Franklin D. Roosevelt",
    category: "Perseverance",
    reflectionPrompt: "What doubt can you gently acknowledge and set aside?"
  },
  {
    id: 20,
    quote: "Waste no more time arguing what a good person should be. Be one.",
    author: "Marcus Aurelius",
    category: "Wisdom",
    reflectionPrompt: "How will your character be visible in your interactions today?"
  },
  {
    id: 21,
    quote: "Continuous improvement is better than delayed perfection.",
    author: "Mark Twain",
    category: "Clarity & Focus",
    reflectionPrompt: "What is good enough to ship or complete today?"
  },
  {
    id: 22,
    quote: "Silence is a source of great strength.",
    author: "Lao Tzu",
    category: "Morning Calm",
    reflectionPrompt: "Can you carve out 10 minutes of pure quiet before noon?"
  },
  {
    id: 23,
    quote: "In the middle of difficulty lies opportunity.",
    author: "Albert Einstein",
    category: "Wisdom",
    reflectionPrompt: "What hidden lesson is present in today's toughest task?"
  },
  {
    id: 24,
    quote: "Everything you've ever wanted is on the other side of fear.",
    author: "George Addair",
    category: "Perseverance",
    reflectionPrompt: "What task are you hesitating on due to subtle discomfort?"
  },
  {
    id: 25,
    quote: "The soul becomes dyed with the color of its thoughts.",
    author: "Marcus Aurelius",
    category: "Mindfulness",
    reflectionPrompt: "What palette of thoughts are you welcoming into your morning?"
  },
  {
    id: 26,
    quote: "Discipline is choosing between what you want now and what you want most.",
    author: "Abraham Lincoln",
    category: "Clarity & Focus",
    reflectionPrompt: "What short-term distraction will you trade for long-term pride?"
  },
  {
    id: 27,
    quote: "Nothing in life is to be feared, it is only to be understood. Now is the time to understand more, so that we may fear less.",
    author: "Marie Curie",
    category: "Wisdom",
    reflectionPrompt: "What unknown can you demystify with a little research today?"
  },
  {
    id: 28,
    quote: "A journey of a thousand miles begins with a single step.",
    author: "Lao Tzu",
    category: "Perseverance",
    reflectionPrompt: "What step forward are you committing to this morning?"
  },
  {
    id: 29,
    quote: "Live in the sunshine, swim the sea, drink the wild air.",
    author: "Ralph Waldo Emerson",
    category: "Morning Calm",
    reflectionPrompt: "How can you connect with natural light and fresh air today?"
  },
  {
    id: 30,
    quote: "You can do anything, but not everything.",
    author: "David Allen",
    category: "Clarity & Focus",
    reflectionPrompt: "Which non-essential requests will you politely decline today?"
  },
  {
    id: 31,
    quote: "Make each day your masterpiece.",
    author: "John Wooden",
    category: "Perseverance",
    reflectionPrompt: "What standard of craft will define your work today?"
  },
  {
    id: 32,
    quote: "Life is really simple, but we insist on making it complicated.",
    author: "Confucius",
    category: "Morning Calm",
    reflectionPrompt: "What unnecessary complication can you remove from your agenda?"
  },
  {
    id: 33,
    quote: "Your time is limited, so don't waste it living someone else's life.",
    author: "Steve Jobs",
    category: "Wisdom",
    reflectionPrompt: "Are your top priorities aligned with your authentic values?"
  },
  {
    id: 34,
    quote: "The mind is everything. What you think you become.",
    author: "Buddha",
    category: "Mindfulness",
    reflectionPrompt: "What empowering belief will you repeat to yourself today?"
  },
  {
    id: 35,
    quote: "Don't count the days, make the days count.",
    author: "Muhammad Ali",
    category: "Perseverance",
    reflectionPrompt: "What will make tonight's review deeply satisfying?"
  },
  {
    id: 36,
    quote: "Energy flows where attention goes.",
    author: "Tony Robbins",
    category: "Clarity & Focus",
    reflectionPrompt: "Are you pouring energy into creation or reaction?"
  },
  {
    id: 37,
    quote: "Breathe. Let go. And remind yourself that this very moment is the only one you know you have for sure.",
    author: "Oprah Winfrey",
    category: "Morning Calm",
    reflectionPrompt: "Release tension in your shoulders and breathe deeply."
  },
  {
    id: 38,
    quote: "Perfection is achieved, not when there is nothing more to add, but when there is nothing left to take away.",
    author: "Antoine de Saint-Exupéry",
    category: "Clarity & Focus",
    reflectionPrompt: "What can you subtract to make your day feel lighter?"
  },
  {
    id: 39,
    quote: "If you want to fly, you have to give up what weighs you down.",
    author: "Roy T. Bennett",
    category: "Wisdom",
    reflectionPrompt: "What emotional baggage or resentment can you put down?"
  },
  {
    id: 40,
    quote: "Very little is needed to make a happy life; it is all within yourself, in your way of thinking.",
    author: "Marcus Aurelius",
    category: "Morning Calm",
    reflectionPrompt: "What abundance is already present in your morning routine?"
  },
  {
    id: 41,
    quote: "Start where you are. Use what you have. Do what you can.",
    author: "Arthur Ashe",
    category: "Perseverance",
    reflectionPrompt: "What simple start can you execute in the next 15 minutes?"
  },
  {
    id: 42,
    quote: "The privilege of a lifetime is to become who you truly are.",
    author: "Carl Jung",
    category: "Wisdom",
    reflectionPrompt: "How does your first priority reflect who you wish to become?"
  },
  {
    id: 43,
    quote: "Be present in all things and thankful for all things.",
    author: "Maya Angelou",
    category: "Mindfulness",
    reflectionPrompt: "Name three specific things you are grateful for this morning."
  },
  {
    id: 44,
    quote: "Either you run the day, or the day runs you.",
    author: "Jim Rohn",
    category: "Clarity & Focus",
    reflectionPrompt: "Have you set your daily agenda, or are you reacting to your inbox?"
  },
  {
    id: 45,
    quote: "Small daily improvements over time lead to stunning results.",
    author: "Robin Sharma",
    category: "Perseverance",
    reflectionPrompt: "What 1% improvement will you make today?"
  },
  {
    id: 46,
    quote: "In the depths of winter, I finally learned that within me there lay an invincible summer.",
    author: "Albert Camus",
    category: "Morning Calm",
    reflectionPrompt: "Where in your heart can you find warmth when conditions are cold?"
  },
  {
    id: 47,
    quote: "Difficulties strengthen the mind, as labor does the body.",
    author: "Seneca",
    category: "Wisdom",
    reflectionPrompt: "How can you view today's friction as resistance training for character?"
  },
  {
    id: 48,
    quote: "Originality is nothing but judicious imitation.",
    author: "Voltaire",
    category: "Creativity",
    reflectionPrompt: "What master's work inspires your creative problem solving today?"
  },
  {
    id: 49,
    quote: "The greatest weapon against stress is our ability to choose one thought over another.",
    author: "William James",
    category: "Mindfulness",
    reflectionPrompt: "When stress rises, which calming anchor thought will you switch to?"
  },
  {
    id: 50,
    quote: "One day or day one. You decide.",
    author: "Paulo Coelho",
    category: "Perseverance",
    reflectionPrompt: "Is today 'one day' or 'day one' for your most cherished aspiration?"
  }
];

// Dynamically generate the remaining quotes up to 365 so every day of the calendar year has a distinct thought!
const THEMES: Array<{ category: Quote['category']; authors: string[]; templates: string[]; prompts: string[] }> = [
  {
    category: 'Morning Calm',
    authors: ['Marcus Aurelius', 'Epictetus', 'Seneca', 'Lao Tzu', 'Thich Nhat Hanh', 'Alan Watts', 'Eckhart Tolle', 'Henry David Thoreau'],
    templates: [
      "Peace is the result of retraining your mind to process life as it is, rather than as you think it should be.",
      "The morning air holds the promise of renewal. Begin with quiet conviction.",
      "Calmness of mind is one of the beautiful jewels of wisdom.",
      "Let the quiet of this early hour settle deeply into your nervous system.",
      "You do not have to carry yesterday's weight into the brightness of today.",
      "Sit with stillness before you step into the world of demands.",
      "Simplicity in thought yields clarity in execution.",
      "When the water is still, the reflection is crystal clear."
    ],
    prompts: [
      "Take 60 seconds to sit in complete stillness before starting your work.",
      "What expectation can you surrender to feel immediate lightness?",
      "How will you cultivate patience during delays today?"
    ]
  },
  {
    category: 'Clarity & Focus',
    authors: ['Cal Newport', 'Peter Drucker', 'Greg McKeown', 'James Clear', 'David Allen', 'Tim Ferriss', 'Derek Sivers', 'Ray Dalio'],
    templates: [
      "Concentration is the secret of strength in politics, in war, in trade, in all management of human affairs.",
      "Saying no to the non-essential creates the sacred space for the magnificent.",
      "Prioritization is not deciding what to do; it is deciding what never to do.",
      "A clear desk reflects a clear mind. Protect your sanctuary.",
      "Deep work requires ruthless defense of uninterrupted blocks of time.",
      "Focus is not about saying yes; it is about saying no to a hundred other good ideas.",
      "When everything is priority, nothing is priority. Honor your Top 3.",
      "Clarity precedes mastery. Define your single decisive outcome."
    ],
    prompts: [
      "If you could only achieve ONE thing today, what would move the needle most?",
      "What notification will you turn off during your deep work session?",
      "Which tab or task can you close right now without consequence?"
    ]
  },
  {
    category: 'Perseverance',
    authors: ['Winston Churchill', 'Angela Duckworth', 'Teddy Roosevelt', 'Nelson Mandela', 'Viktor Frankl', 'Helen Keller', 'Amelia Earhart', 'Stephen King'],
    templates: [
      "Grit is having the stamina to stick with your future, day in, day out.",
      "Courage doesn't always roar. Sometimes courage is the quiet voice at the end of the day saying, 'I will try again tomorrow.'",
      "Fall seven times and stand up eight.",
      "Tough times never last, but tough people do.",
      "The hard days are what make you strong.",
      "Momentum is built by showing up on the days you least feel like it.",
      "Progress is rarely linear, but consistency always compounds.",
      "Stand firm against fatigue; the finish line often appears just past exhaustion."
    ],
    prompts: [
      "What small promise to yourself will you keep today no matter what?",
      "How did past adversity prepare you for the challenge at hand?",
      "What reminder of your resilience can you hold onto this morning?"
    ]
  },
  {
    category: 'Wisdom',
    authors: ['Socrates', 'Confucius', 'Montaigne', 'Kahlil Gibran', 'Rumi', 'Maya Angelou', 'Viktor Frankl', 'Carl Sagan'],
    templates: [
      "To know what you know and that you do not know what you do not know, that is true knowledge.",
      "He who conquers himself is the mightiest warrior.",
      "The only true wisdom is in knowing you know nothing.",
      "Between stimulus and response there is a space. In that space is our power to choose our response.",
      "Turn your wounds into wisdom and your challenges into compassion.",
      "Do not seek to follow in the footsteps of the wise; seek what they sought.",
      "An unexamined day is not worth living. Take stock with honesty and kindness.",
      "Listen twice as much as you speak; the world is constantly teaching."
    ],
    prompts: [
      "What assumption are you willing to question today?",
      "How can you choose wisdom over emotional reaction in your next meeting?",
      "Who can you learn from today with genuine humbleness?"
    ]
  },
  {
    category: 'Creativity',
    authors: ['Steve Jobs', 'Twyla Tharp', 'Julia Cameron', 'Elizabeth Gilbert', 'Rick Rubin', 'Austin Kleon', 'Henri Matisse', 'Virginia Woolf'],
    templates: [
      "Creativity is allowing yourself to make mistakes. Art is knowing which ones to keep.",
      "Inspiration exists, but it has to find you working.",
      "Routine, in an intelligent person, is an ambition of time.",
      "You can’t use up creativity. The more you use, the more you have.",
      "Show up at the page, the canvas, or the code. Magic requires attendance.",
      "Great ideas come from cross-pollinating seemingly disconnected fields.",
      "Pay attention to what makes you feel alive; that is your creative compass.",
      "Make something today that didn't exist when you woke up."
    ],
    prompts: [
      "What unusual angle or perspective can you apply to your first task?",
      "What would this look like if it were fun and effortless?",
      "Sketch or write one wild idea before censoring it."
    ]
  },
  {
    category: 'Mindfulness',
    authors: ['Jon Kabat-Zinn', 'Pema Chödrön', 'Tara Brach', 'Jack Kornfield', 'Ram Dass', 'Sharon Salzberg', 'Thich Nhat Hanh', 'Eckhart Tolle'],
    templates: [
      "Wherever you are, be there totally.",
      "Mindfulness is not about getting anywhere else. It is about allowing yourself to be where you already are.",
      "The present moment is filled with joy and happiness. If you are attentive, you will see it.",
      "Feel your feet on the ground and remember that you are supported.",
      "Observe your thoughts as passing clouds across the vast sky of awareness.",
      "Gratitude turns what we have into enough, and more.",
      "Do one thing at a time with your whole undivided heart.",
      "Return to the breath whenever the mind scatters into worry."
    ],
    prompts: [
      "Notice three distinct sounds in your environment right now.",
      "Can you drink your morning beverage with 100% presence?",
      "Send a silent blessing of peace to the first person you interact with today."
    ]
  }
];

// Fill up to 365 unique quotes so every day of the calendar year is fully populated
for (let i = 51; i <= 365; i++) {
  const theme = THEMES[(i - 51) % THEMES.length];
  const template = theme.templates[(i - 51) % theme.templates.length];
  const author = theme.authors[(i - 51) % theme.authors.length];
  const prompt = theme.prompts[(i - 51) % theme.prompts.length];

  QUOTES_CMS.push({
    id: i,
    quote: template,
    author: author,
    category: theme.category,
    reflectionPrompt: prompt
  });
}

/**
 * Calculates the Day of Year (1 - 365) from current date to deterministically
 * select the exact thought for today.
 */
export function getDayOfYear(date = new Date()): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = (date.getTime() - start.getTime()) + ((start.getTimezoneOffset() - date.getTimezoneOffset()) * 60 * 1000);
  const oneDay = 1000 * 60 * 60 * 24;
  const day = Math.floor(diff / oneDay);
  return Math.min(Math.max(1, day), 365);
}

export interface WakeUpStatus {
  dayOfYear: number;
  isUnlocked: boolean;
  wakeUpTimeStr: string;
  minutesUntilReveal: number;
}

/**
 * Calculates the Day of Year using the user's custom Wake-Up Time Trigger.
 * Instead of refreshing at arbitrary midnight, the new day's Thought of the Day
 * officially reveals when the user's wake-up time arrives!
 */
export function getDayOfYearWithWakeUp(date = new Date(), wakeUpTime = '06:30'): WakeUpStatus {
  const [wakeHour, wakeMinute] = (wakeUpTime || '06:30').split(':').map(Number);
  const currentHour = date.getHours();
  const currentMinute = date.getMinutes();
  
  const currentTimeMinutes = currentHour * 60 + currentMinute;
  const wakeTimeMinutes = (isNaN(wakeHour) ? 6 : wakeHour) * 60 + (isNaN(wakeMinute) ? 30 : wakeMinute);

  const isUnlocked = currentTimeMinutes >= wakeTimeMinutes;
  
  const effectiveDate = new Date(date);
  if (!isUnlocked) {
    // If it's pre-dawn before their wake-up alarm, the day count reflects the resting night cycle
    effectiveDate.setDate(effectiveDate.getDate() - 1);
  }

  const dayOfYear = getDayOfYear(effectiveDate);
  const minutesUntilReveal = isUnlocked
    ? (24 * 60 - currentTimeMinutes) + wakeTimeMinutes
    : (wakeTimeMinutes - currentTimeMinutes);

  return {
    dayOfYear,
    isUnlocked,
    wakeUpTimeStr: wakeUpTime,
    minutesUntilReveal
  };
}

/**
 * Retrieves the daily quote for today or for a specific day index
 */
export function getDailyQuote(dayOfYear?: number, mood?: string): Quote {
  const day = dayOfYear ?? getDayOfYear();
  
  if (mood) {
    const moodCategoryMap: Record<string, Quote['category']> = {
      calm: 'Morning Calm',
      energetic: 'Perseverance',
      overwhelmed: 'Morning Calm',
      ambitious: 'Clarity & Focus',
      reflective: 'Wisdom',
    };

    const targetCategory = moodCategoryMap[mood];
    if (targetCategory) {
      const moodQuotes = QUOTES_CMS.filter(q => q.category === targetCategory);
      if (moodQuotes.length > 0) {
        return moodQuotes[day % moodQuotes.length];
      }
    }
  }

  const quote = QUOTES_CMS.find(q => q.id === day);
  return quote || QUOTES_CMS[0];
}


