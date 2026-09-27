import confetti from 'canvas-confetti';

/**
 * Fires a crisp, subtle digital confetti burst from the task origin or bottom.
 */
export function fireTaskConfetti(x = 0.5, y = 0.5) {
  confetti({
    particleCount: 36,
    spread: 60,
    origin: { x, y },
    colors: ['#10b981', '#34d399', '#f59e0b', '#fbbf24', '#60a5fa'],
    disableForReducedMotion: true,
    ticks: 120,
    gravity: 1.1,
    scalar: 0.85
  });
}

/**
 * Celebrates all 3 top priorities completed with dual cannon burst.
 */
export function fireMajorMilestoneCelebration() {
  const end = Date.now() + 1000;
  const colors = ['#f59e0b', '#10b981', '#6366f1', '#ec4899', '#38bdf8'];

  (function frame() {
    confetti({
      particleCount: 4,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors
    });
    confetti({
      particleCount: 4,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  })();
}

/**
 * Generates an organic, calming audio chime using the Web Audio API.
 * 100% offline, zero external audio asset latency or network dependency.
 */
let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function playSuccessChime(isAllDone = false) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const frequencies = isAllDone ? [523.25, 659.25, 783.99, 1046.50] : [587.33, 880.0]; // C5, E5, G5, C6 for big win, or D5 -> A5 gentle chime

    frequencies.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);

      gain.gain.setValueAtTime(0, now + idx * 0.08);
      gain.gain.linearRampToValueAtTime(0.12, now + idx * 0.08 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + (isAllDone ? 0.7 : 0.45));

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + (isAllDone ? 0.75 : 0.5));
    });
  } catch {
    // Graceful fallback for environments restricting AudioContext
  }
}

/**
 * Triggers crisp, subtle haptic vibration on mobile devices
 */
export function triggerHapticFeedback(pattern: number | number[] = 25) {
  if (typeof window !== 'undefined' && 'navigator' in window && 'vibrate' in navigator) {
    try {
      navigator.vibrate(pattern);
    } catch {
      // ignore
    }
  }
}

