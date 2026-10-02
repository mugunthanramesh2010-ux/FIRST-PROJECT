// 100% Offline Procedural Web Audio Synthesizer
// Zero external mp3/wav files required. Synthesizes clean soundscapes mathematically.

class SoundEffectsEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
  }

  init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
  }

  playTone(freq, type = 'sine', duration = 0.15, gainVal = 0.1) {
    if (this.isMuted) return;
    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {
      // Audio autoplay policy fallback
    }
  }

  playSuccess() {
    this.playTone(523.25, 'triangle', 0.12, 0.15); // C5
    setTimeout(() => this.playTone(659.25, 'triangle', 0.12, 0.15), 100); // E5
    setTimeout(() => this.playTone(783.99, 'triangle', 0.25, 0.2), 200); // G5
  }

  playHintUnlock() {
    this.playTone(440, 'sine', 0.1, 0.1);
    setTimeout(() => this.playTone(880, 'sine', 0.2, 0.1), 80);
  }

  playWarning() {
    this.playTone(180, 'sawtooth', 0.2, 0.25);
    setTimeout(() => this.playTone(140, 'sawtooth', 0.25, 0.25), 120);
  }

  playClick() {
    this.playTone(800, 'sine', 0.04, 0.05);
  }
}

export const soundEffects = new SoundEffectsEngine();

// Text-to-Speech Offline Viva Examiner Voice (Browser Native)
export function speakVivaQuestion(text, onEnd) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

  window.speechSynthesis.cancel(); // Cancel any ongoing speech
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 1.0;
  utterance.pitch = 1.05;
  utterance.lang = 'en-US';

  if (onEnd) utterance.onend = onEnd;
  window.speechSynthesis.speak(utterance);
}

export function stopSpeaking() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}
