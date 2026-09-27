import { ExamDefinition, PaceCalculationResult, TopicDifficulty, UserExamPlan } from '../types';

export const STARTER_EXAMS: ExamDefinition[] = [
  {
    id: 'exam-neet-med',
    title: 'Medical Entrance Exam (NEET / MCAT)',
    shortName: 'Medical (NEET/MCAT)',
    category: 'Medical',
    description: 'National pre-medical entrance examination evaluating mastery in Physics, Chemistry, and Biology (Botany & Zoology).',
    blueprint: {
      totalSubjects: 3,
      totalMarks: 720,
      passingMarks: 500,
      durationMinutes: 200,
      questionFormats: ['MCQs (Single Correct)', 'Assertion & Reason', 'Match the Columns', 'Diagram Interpretation'],
      markingScheme: '+4 marks for correct answer, -1 mark penalty for incorrect'
    },
    subjects: [
      {
        id: 'neet-bio',
        name: 'Biology & Life Sciences',
        color: 'emerald',
        units: [
          {
            id: 'bio-genetics',
            name: 'Genetics, Evolution & Molecular Biology',
            weightagePercentage: 18,
            topics: [
              { id: 't-bio-1', name: 'Mendelian Principles & Pedigree Analysis', difficulty: 'Medium', baselineHours: 4.5, highYield: true },
              { id: 't-bio-2', name: 'Molecular Basis of Inheritance (DNA & RNA)', difficulty: 'Hard', baselineHours: 7.0, highYield: true },
              { id: 't-bio-3', name: 'Transcription, Genetic Code & Translation', difficulty: 'Hard', baselineHours: 6.5, highYield: true },
              { id: 't-bio-4', name: 'Evolution Theories & Hardy-Weinberg Principle', difficulty: 'Easy', baselineHours: 3.0 }
            ]
          },
          {
            id: 'bio-physiology',
            name: 'Human Physiology',
            weightagePercentage: 20,
            topics: [
              { id: 't-bio-5', name: 'Cardiovascular System & Blood Circulation', difficulty: 'Medium', baselineHours: 5.0, highYield: true },
              { id: 't-bio-6', name: 'Neural Control & Nerve Impulse Transmission', difficulty: 'Hard', baselineHours: 6.0, highYield: true },
              { id: 't-bio-7', name: 'Chemical Coordination & Endocrine Feedback', difficulty: 'Medium', baselineHours: 4.0 },
              { id: 't-bio-8', name: 'Breathing, Gas Exchange & Excretory Products', difficulty: 'Easy', baselineHours: 3.5 }
            ]
          },
          {
            id: 'bio-cell',
            name: 'Cell Biology & Plant Physiology',
            weightagePercentage: 14,
            topics: [
              { id: 't-bio-9', name: 'Cell Structure, Organelles & Endomembrane System', difficulty: 'Easy', baselineHours: 3.0 },
              { id: 't-bio-10', name: 'Cell Cycle, Mitosis & Meiosis Stages', difficulty: 'Medium', baselineHours: 4.5, highYield: true },
              { id: 't-bio-11', name: 'Photosynthesis in Higher Plants (Light/Dark Reactions)', difficulty: 'Hard', baselineHours: 7.0, highYield: true },
              { id: 't-bio-12', name: 'Cellular Respiration & Krebs Cycle Energetics', difficulty: 'Hard', baselineHours: 6.0 }
            ]
          }
        ]
      },
      {
        id: 'neet-chem',
        name: 'Chemistry',
        color: 'amber',
        units: [
          {
            id: 'chem-organic',
            name: 'Organic Chemistry & Reaction Mechanisms',
            weightagePercentage: 18,
            topics: [
              { id: 't-chem-1', name: 'GOC: Electrophiles, Nucleophiles & Resonance', difficulty: 'Hard', baselineHours: 7.5, highYield: true },
              { id: 't-chem-2', name: 'Hydrocarbons (Alkanes, Alkenes, Alkynes)', difficulty: 'Medium', baselineHours: 5.0 },
              { id: 't-chem-3', name: 'Carbonyl Compounds (Aldehydes & Ketones)', difficulty: 'Hard', baselineHours: 8.0, highYield: true },
              { id: 't-chem-4', name: 'Biomolecules, Polymers & Amines', difficulty: 'Easy', baselineHours: 3.5 }
            ]
          },
          {
            id: 'chem-physical',
            name: 'Physical Chemistry',
            weightagePercentage: 16,
            topics: [
              { id: 't-chem-5', name: 'Chemical Thermodynamics & Entropy', difficulty: 'Hard', baselineHours: 7.0, highYield: true },
              { id: 't-chem-6', name: 'Chemical Equilibrium & Le Chatelier Principle', difficulty: 'Medium', baselineHours: 5.0 },
              { id: 't-chem-7', name: 'Electrochemistry & Nernst Equation', difficulty: 'Hard', baselineHours: 6.5, highYield: true },
              { id: 't-chem-8', name: 'Chemical Kinetics & Rate Laws', difficulty: 'Medium', baselineHours: 4.0 }
            ]
          },
          {
            id: 'chem-inorganic',
            name: 'Inorganic Chemistry & Coordination',
            weightagePercentage: 14,
            topics: [
              { id: 't-chem-9', name: 'Chemical Bonding & Hybridization (VSEPR & MOT)', difficulty: 'Hard', baselineHours: 6.5, highYield: true },
              { id: 't-chem-10', name: 'Coordination Compounds & Crystal Field Theory', difficulty: 'Medium', baselineHours: 5.5, highYield: true },
              { id: 't-chem-11', name: 'Periodic Table Trends & Block Elements', difficulty: 'Easy', baselineHours: 3.5 }
            ]
          }
        ]
      },
      {
        id: 'neet-phys',
        name: 'Physics',
        color: 'sky',
        units: [
          {
            id: 'phys-mechanics',
            name: 'Mechanics & Dynamics',
            weightagePercentage: 18,
            topics: [
              { id: 't-phy-1', name: 'Kinematics & Projectile Motion', difficulty: 'Medium', baselineHours: 4.5 },
              { id: 't-phy-2', name: 'Newtons Laws of Motion & Friction', difficulty: 'Medium', baselineHours: 5.0, highYield: true },
              { id: 't-phy-3', name: 'Work, Energy, Power & Collisions', difficulty: 'Medium', baselineHours: 4.5 },
              { id: 't-phy-4', name: 'Rotational Motion & Moment of Inertia', difficulty: 'Hard', baselineHours: 8.5, highYield: true }
            ]
          },
          {
            id: 'phys-electro',
            name: 'Electrodynamics & Magnetism',
            weightagePercentage: 16,
            topics: [
              { id: 't-phy-5', name: 'Electrostatics & Gauss Law Applications', difficulty: 'Hard', baselineHours: 7.0, highYield: true },
              { id: 't-phy-6', name: 'Current Electricity & Kirchhoffs Circuit Laws', difficulty: 'Medium', baselineHours: 5.0, highYield: true },
              { id: 't-phy-7', name: 'Magnetic Effects of Current & Biot-Savart Law', difficulty: 'Hard', baselineHours: 6.5 },
              { id: 't-phy-8', name: 'Electromagnetic Induction & Lenzs Law', difficulty: 'Medium', baselineHours: 4.5 }
            ]
          },
          {
            id: 'phys-optics',
            name: 'Optics & Modern Physics',
            weightagePercentage: 14,
            topics: [
              { id: 't-phy-9', name: 'Ray Optics, Lenses & Optical Instruments', difficulty: 'Medium', baselineHours: 5.5, highYield: true },
              { id: 't-phy-10', name: 'Wave Optics: Interference & Youngs Double Slit', difficulty: 'Medium', baselineHours: 4.5 },
              { id: 't-phy-11', name: 'Photoelectric Effect & Dual Nature of Matter', difficulty: 'Easy', baselineHours: 3.0, highYield: true },
              { id: 't-phy-12', name: 'Nuclear Physics & Radioactivity', difficulty: 'Easy', baselineHours: 3.0 }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'exam-jee-stem',
    title: 'Engineering & STEM Entrance (JEE Main/Adv)',
    shortName: 'Engineering (JEE/STEM)',
    category: 'Engineering',
    description: 'Premier engineering entrance exam testing deep conceptual problem solving across Mathematics, Physics, and Chemistry.',
    blueprint: {
      totalSubjects: 3,
      totalMarks: 300,
      passingMarks: 180,
      durationMinutes: 180,
      questionFormats: ['MCQs (Single Correct)', 'Numerical Value / Integer Type', 'Multi-Correct', 'Matrix Match'],
      markingScheme: '+4 marks for correct, -1 mark penalty for MCQ errors, no negative on numerical'
    },
    subjects: [
      {
        id: 'jee-math',
        name: 'Mathematics',
        color: 'purple',
        units: [
          {
            id: 'math-calculus',
            name: 'Differential & Integral Calculus',
            weightagePercentage: 35,
            topics: [
              { id: 't-math-1', name: 'Limits, Continuity & Differentiability', difficulty: 'Medium', baselineHours: 5.5 },
              { id: 't-math-2', name: 'Applications of Derivatives (Maxima/Minima)', difficulty: 'Hard', baselineHours: 8.0, highYield: true },
              { id: 't-math-3', name: 'Definite Integration & Properties', difficulty: 'Hard', baselineHours: 8.5, highYield: true },
              { id: 't-math-4', name: 'Differential Equations (Linear & Homogeneous)', difficulty: 'Medium', baselineHours: 5.0 }
            ]
          },
          {
            id: 'math-algebra',
            name: 'Algebra, Matrices & Probability',
            weightagePercentage: 35,
            topics: [
              { id: 't-math-5', name: 'Complex Numbers & Quadratic Equations', difficulty: 'Hard', baselineHours: 7.5, highYield: true },
              { id: 't-math-6', name: 'Matrices, Determinants & System of Equations', difficulty: 'Easy', baselineHours: 3.5, highYield: true },
              { id: 't-math-7', name: 'Permutations, Combinations & Binomial Theorem', difficulty: 'Hard', baselineHours: 7.0 },
              { id: 't-math-8', name: 'Probability & Bayes Theorem', difficulty: 'Hard', baselineHours: 7.5, highYield: true }
            ]
          },
          {
            id: 'math-geom',
            name: 'Coordinate Geometry & 3D Vectors',
            weightagePercentage: 30,
            topics: [
              { id: 't-math-9', name: 'Circles, Parabolas, Ellipses & Hyperbolas', difficulty: 'Hard', baselineHours: 9.0, highYield: true },
              { id: 't-math-10', name: 'Vectors (Dot/Cross Products & Triple Products)', difficulty: 'Medium', baselineHours: 4.5 },
              { id: 't-math-11', name: 'Three Dimensional Geometry (Lines & Planes)', difficulty: 'Hard', baselineHours: 6.5, highYield: true }
            ]
          }
        ]
      },
      {
        id: 'jee-phys',
        name: 'Physics',
        color: 'sky',
        units: [
          {
            id: 'jee-phy-mech',
            name: 'Advanced Mechanics & Gravitation',
            weightagePercentage: 30,
            topics: [
              { id: 't-jphy-1', name: 'Center of Mass & Linear Momentum Conservation', difficulty: 'Medium', baselineHours: 5.0 },
              { id: 't-jphy-2', name: 'Rigid Body Dynamics & Pure Rolling', difficulty: 'Hard', baselineHours: 9.0, highYield: true },
              { id: 't-jphy-3', name: 'Simple Harmonic Motion (SHM) & Oscillations', difficulty: 'Medium', baselineHours: 5.5, highYield: true }
            ]
          },
          {
            id: 'jee-phy-elec',
            name: 'Electromagnetism & Waves',
            weightagePercentage: 40,
            topics: [
              { id: 't-jphy-4', name: 'Capacitance & Dielectric Breakdown', difficulty: 'Medium', baselineHours: 5.0 },
              { id: 't-jphy-5', name: 'Electromagnetic Waves & Alternating Current (AC)', difficulty: 'Easy', baselineHours: 3.5 },
              { id: 't-jphy-6', name: 'Wave Optics & Sound Doppler Effect', difficulty: 'Medium', baselineHours: 5.0, highYield: true }
            ]
          }
        ]
      },
      {
        id: 'jee-chem',
        name: 'Chemistry',
        color: 'amber',
        units: [
          {
            id: 'jee-chm-main',
            name: 'Comprehensive Chemistry Concepts',
            weightagePercentage: 35,
            topics: [
              { id: 't-jch-1', name: 'Atomic Structure & Quantum Numbers', difficulty: 'Easy', baselineHours: 3.0 },
              { id: 't-jch-2', name: 'Aromatic Compounds & Electrophilic Substitution', difficulty: 'Hard', baselineHours: 7.0, highYield: true },
              { id: 't-jch-3', name: 'Chemical Equilibrium & Solubility Products (Ksp)', difficulty: 'Hard', baselineHours: 6.0, highYield: true }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'exam-upsc-civil',
    title: 'Civil Services & General Studies (UPSC / State PSC)',
    shortName: 'Civil Services (UPSC)',
    category: 'Civil Services',
    description: 'Prestigious public administration examination testing analytical depth, governance knowledge, history, and constitutional acumen.',
    blueprint: {
      totalSubjects: 4,
      totalMarks: 1000,
      passingMarks: 520,
      durationMinutes: 360,
      questionFormats: ['Descriptive Analytical Essays', 'Case Studies', 'Objective MCQs (Prelims)'],
      markingScheme: 'Subjective evaluation with strict rubric + negative marking in Prelims'
    },
    subjects: [
      {
        id: 'upsc-polity',
        name: 'Indian Polity & Governance',
        color: 'blue',
        units: [
          {
            id: 'polity-const',
            name: 'Constitutional Framework & Rights',
            weightagePercentage: 30,
            topics: [
              { id: 't-up-1', name: 'Preamble, Fundamental Rights & DPSP', difficulty: 'Medium', baselineHours: 6.0, highYield: true },
              { id: 't-up-2', name: 'Parliament, Federal Structure & Emergency Provisions', difficulty: 'Hard', baselineHours: 8.0, highYield: true },
              { id: 't-up-3', name: 'Judiciary (Supreme Court, Judicial Review & PIL)', difficulty: 'Medium', baselineHours: 5.5, highYield: true },
              { id: 't-up-4', name: 'Local Self-Government (73rd & 74th Amendments)', difficulty: 'Easy', baselineHours: 3.5 }
            ]
          }
        ]
      },
      {
        id: 'upsc-history',
        name: 'Modern Indian History & Culture',
        color: 'rose',
        units: [
          {
            id: 'hist-modern',
            name: 'Freedom Struggle & National Movement',
            weightagePercentage: 25,
            topics: [
              { id: 't-up-5', name: 'Revolt of 1857 & Early Socio-Religious Reforms', difficulty: 'Medium', baselineHours: 4.5 },
              { id: 't-up-6', name: 'Gandhian Era & Mass Movements (Non-Cooperation, Civil Disobedience)', difficulty: 'Hard', baselineHours: 7.5, highYield: true },
              { id: 't-up-7', name: 'Post-Independence Consolidation & Reorganization', difficulty: 'Easy', baselineHours: 3.5 }
            ]
          }
        ]
      },
      {
        id: 'upsc-econ',
        name: 'Economics, Geography & Environment',
        color: 'emerald',
        units: [
          {
            id: 'econ-env',
            name: 'Macroeconomics & Ecology',
            weightagePercentage: 25,
            topics: [
              { id: 't-up-8', name: 'Fiscal Policy, Inflation & Monetary Framework', difficulty: 'Hard', baselineHours: 7.0, highYield: true },
              { id: 't-up-9', name: 'Biodiversity Conservation & Climate Change Agreements', difficulty: 'Medium', baselineHours: 5.0, highYield: true },
              { id: 't-up-10', name: 'Physical Geography & Monsoon Dynamics', difficulty: 'Medium', baselineHours: 5.0 }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'exam-sat-gre',
    title: 'Graduate & College Aptitude (SAT / GRE / GMAT)',
    shortName: 'College Aptitude (SAT/GRE)',
    category: 'Aptitude & College',
    description: 'Standardized aptitude test assessing quantitative problem solving, vocabulary in context, reading comprehension, and analytical writing.',
    blueprint: {
      totalSubjects: 2,
      totalMarks: 340,
      passingMarks: 315,
      durationMinutes: 230,
      questionFormats: ['Quantitative Comparison', 'Text Completion', 'Sentence Equivalence', 'Reading Passages'],
      markingScheme: 'Adaptive computer scoring algorithm with percentile rank'
    },
    subjects: [
      {
        id: 'gre-quant',
        name: 'Quantitative Reasoning',
        color: 'indigo',
        units: [
          {
            id: 'quant-algebra',
            name: 'Arithmetic, Algebra & Data Analysis',
            weightagePercentage: 50,
            topics: [
              { id: 't-gr-1', name: 'Number Properties, Prime Factors & Remainders', difficulty: 'Easy', baselineHours: 3.0 },
              { id: 't-gr-2', name: 'Algebraic Equations & Coordinate Geometry', difficulty: 'Medium', baselineHours: 4.5, highYield: true },
              { id: 't-gr-3', name: 'Combinatorics, Probability & Standard Deviation', difficulty: 'Hard', baselineHours: 6.5, highYield: true },
              { id: 't-gr-4', name: 'Data Interpretation Charts & Percentiles', difficulty: 'Medium', baselineHours: 4.0 }
            ]
          }
        ]
      },
      {
        id: 'gre-verbal',
        name: 'Verbal Reasoning & Critical Analysis',
        color: 'teal',
        units: [
          {
            id: 'verb-vocab',
            name: 'Advanced Lexicon & Passage Logic',
            weightagePercentage: 50,
            topics: [
              { id: 't-gr-5', name: 'High-Frequency Vocabulary in Context (800 words)', difficulty: 'Hard', baselineHours: 8.0, highYield: true },
              { id: 't-gr-6', name: 'Double & Triple Blank Text Completion', difficulty: 'Hard', baselineHours: 6.0, highYield: true },
              { id: 't-gr-7', name: 'Critical Reasoning: Strengthen, Weaken & Assumptions', difficulty: 'Medium', baselineHours: 4.5 }
            ]
          }
        ]
      }
    ]
  }
];

// Difficulty baseline hour benchmarks
export const DIFFICULTY_HOURS: Record<TopicDifficulty, number> = {
  Easy: 3.0,
  Medium: 5.0,
  Hard: 7.5
};

// ==========================================
// PACE & TIME CALIBRATION MATHEMATICAL ENGINE
// ==========================================

export function calculateExamPace(
  exam: ExamDefinition,
  plan: UserExamPlan
): PaceCalculationResult {
  // 1. Traverse syllabus hierarchy and compute baseline hours
  let totalTopics = 0;
  let completedTopics = 0;
  let totalBaselineHours = 0;
  let completedHours = 0;

  exam.subjects.forEach(subject => {
    subject.units.forEach(unit => {
      unit.topics.forEach(topic => {
        totalTopics += 1;
        const topicHours = topic.baselineHours || DIFFICULTY_HOURS[topic.difficulty] || 4.0;
        totalBaselineHours += topicHours;

        if (plan.completedTopicIds.includes(topic.id)) {
          completedTopics += 1;
          completedHours += topicHours;
        }
      });
    });
  });

  const remainingTopics = Math.max(0, totalTopics - completedTopics);
  const remainingHours = Math.max(0, totalBaselineHours - completedHours);

  // 2. Pace Calibration inputs
  const dailyHours = Math.max(0.5, plan.dailyStudyHours || 3.0);
  const bufferPct = plan.bufferPercentage || 0.18; // 18% default buffer for revision/mocks

  // 3. Raw study days needed
  const rawDaysNeeded = remainingHours > 0 ? Math.ceil(remainingHours / dailyHours) : 0;
  
  // 4. Buffer days (15-20% extra days for revision, practice tests, and rest days)
  const bufferDays = Math.ceil(rawDaysNeeded * bufferPct);
  const totalDaysNeeded = rawDaysNeeded + bufferDays;

  // 5. Projected completion date
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const projectedDate = new Date(today);
  projectedDate.setDate(projectedDate.getDate() + totalDaysNeeded);
  const projectedCompletionDate = projectedDate.toISOString().split('T')[0];

  // 6. Target Exam Date Comparison
  let availableDays = 0;
  let feasibilityStatus: 'comfortable' | 'tight' | 'impossible' = 'comfortable';
  let feasibilityMessage = '';
  let requiredDailyHoursForTarget = dailyHours;

  if (plan.targetExamDate) {
    const examDate = new Date(plan.targetExamDate);
    examDate.setHours(0, 0, 0, 0);
    const diffTime = examDate.getTime() - today.getTime();
    availableDays = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

    if (availableDays <= 0) {
      feasibilityStatus = 'impossible';
      feasibilityMessage = '⚠️ Exam date has already passed or is today! Please calibrate with a future date.';
    } else {
      // Calculate required daily study hours to hit the target date with revision buffer
      const targetDaysForStudy = Math.max(1, availableDays * (1 - bufferPct));
      requiredDailyHoursForTarget = Number((remainingHours / targetDaysForStudy).toFixed(1));

      if (availableDays < rawDaysNeeded) {
        feasibilityStatus = 'impossible';
        feasibilityMessage = `🚨 PHYSICALLY IMPOSSIBLE at ${dailyHours}h/day: You need ${remainingHours} hours of deep learning in ${availableDays} days. Even with zero rest or revision, you need ${requiredDailyHoursForTarget} hours every single day!`;
      } else if (availableDays < totalDaysNeeded) {
        feasibilityStatus = 'tight';
        feasibilityMessage = `⚡ HIGH INTENSITY: You can complete the raw syllabus in ${rawDaysNeeded} days, but you will compress your revision buffer down to ${Math.max(0, availableDays - rawDaysNeeded)} days. Recommendation: ramp study time to ${requiredDailyHoursForTarget}h/day.`;
      } else {
        const spareDays = availableDays - totalDaysNeeded;
        feasibilityStatus = 'comfortable';
        feasibilityMessage = `🎯 REALISTIC & BALANCED: You will finish all topics in ${rawDaysNeeded} days with ${bufferDays} full days for mock tests, plus ${spareDays} extra cushion days before exam day.`;
      }
    }
  } else {
    feasibilityMessage = `📅 Pace calculated: At ${dailyHours}h/day, you need ${totalDaysNeeded} days (including a ${Math.round(bufferPct * 100)}% revision buffer). Set an exam date to check feasibility!`;
  }

  const dailyTopicsTarget = totalDaysNeeded > 0
    ? Number((remainingTopics / totalDaysNeeded).toFixed(1))
    : 0;

  // 7. Strategic Advice
  const strategicAdvice: string[] = [];
  if (feasibilityStatus === 'impossible') {
    strategicAdvice.push(`Focus 80% of your time on High-Yield topics only.`);
    strategicAdvice.push(`Increase study hours from ${dailyHours}h to at least ${Math.min(12, requiredDailyHoursForTarget)}h/day.`);
    strategicAdvice.push(`Use active recall flashcards instead of re-reading textbooks.`);
  } else if (feasibilityStatus === 'tight') {
    strategicAdvice.push(`Complete 1 mock test every Sunday under timed conditions.`);
    strategicAdvice.push(`Prioritize Medium and Hard difficulty topics first.`);
    strategicAdvice.push(`Block 45-minute Pomodoro sessions with zero phone distraction.`);
  } else {
    strategicAdvice.push(`Maintain consistency of ${dailyHours} hours every morning.`);
    strategicAdvice.push(`Use the ${bufferDays}-day buffer for 3 full-length timed diagnostic exams.`);
    strategicAdvice.push(`Review your FlashGenie flashcard decks daily to lock concepts in long-term memory.`);
  }

  return {
    examTitle: exam.title,
    totalTopics,
    completedTopics,
    remainingTopics,
    totalBaselineHours,
    completedHours,
    remainingHours,
    dailyStudyHours: dailyHours,
    rawDaysNeeded,
    bufferPercentage: bufferPct,
    bufferDays,
    totalDaysNeeded,
    targetExamDate: plan.targetExamDate,
    availableDays,
    projectedCompletionDate,
    feasibilityStatus,
    feasibilityMessage,
    requiredDailyHoursForTarget,
    dailyTopicsTarget,
    strategicAdvice
  };
}

// Storage helpers for Custom Exams and User Exam Plan
const CUSTOM_EXAMS_KEY = 'auraday_custom_exams_v1';
const USER_EXAM_PLAN_KEY = 'auraday_user_exam_plan_v1';

export function loadAllExams(): ExamDefinition[] {
  try {
    const raw = localStorage.getItem(CUSTOM_EXAMS_KEY);
    const custom: ExamDefinition[] = raw ? JSON.parse(raw) : [];
    return [...STARTER_EXAMS, ...custom];
  } catch {
    return STARTER_EXAMS;
  }
}

export function saveCustomExam(exam: ExamDefinition): ExamDefinition[] {
  try {
    const all = loadAllExams();
    const existingIndex = all.findIndex(e => e.id === exam.id);
    let updated: ExamDefinition[];
    if (existingIndex >= 0) {
      updated = all.map(e => e.id === exam.id ? exam : e);
    } else {
      updated = [...all, { ...exam, isCustom: true }];
    }
    const customOnly = updated.filter(e => e.isCustom);
    localStorage.setItem(CUSTOM_EXAMS_KEY, JSON.stringify(customOnly));
    return updated;
  } catch {
    return loadAllExams();
  }
}

export function deleteCustomExam(examId: string): ExamDefinition[] {
  try {
    const all = loadAllExams();
    const filtered = all.filter(e => e.id !== examId);
    const customOnly = filtered.filter(e => e.isCustom);
    localStorage.setItem(CUSTOM_EXAMS_KEY, JSON.stringify(customOnly));
    return filtered;
  } catch {
    return loadAllExams();
  }
}

export function loadUserExamPlan(): UserExamPlan {
  try {
    const raw = localStorage.getItem(USER_EXAM_PLAN_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // fallback
  }

  // Default target date is 90 days from today
  const defaultDate = new Date();
  defaultDate.setDate(defaultDate.getDate() + 90);
  const targetDateStr = defaultDate.toISOString().split('T')[0];

  return {
    examId: 'exam-neet-med',
    targetExamDate: targetDateStr,
    dailyStudyHours: 4.0,
    bufferPercentage: 0.18,
    completedTopicIds: ['t-bio-1', 't-bio-9', 't-chem-4', 't-phy-11']
  };
}

export function saveUserExamPlan(plan: UserExamPlan): void {
  try {
    localStorage.setItem(USER_EXAM_PLAN_KEY, JSON.stringify(plan));
  } catch {
    // ignore
  }
}
