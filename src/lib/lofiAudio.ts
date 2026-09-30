'use client';

/**
 * Procedural Lo-Fi & Synthwave audio synthesizer using Web Audio API.
 * Generates continuous generative ambient chill beats without any external assets.
 */

export interface TrackInfo {
  id: string;
  title: string;
  genre: string;
  bpm: number;
}

export const TRACKS: TrackInfo[] = [
  { id: 'midnight', title: 'Midnight GPU Cluster', genre: 'Cyberpunk Ambient', bpm: 80 },
  { id: 'diffusion', title: 'Discrete Diffusion Dreams', genre: 'Lo-Fi Chillhop', bpm: 72 },
  { id: 'synthwave', title: 'Neon Highway 2084', genre: 'Retro Synthwave', bpm: 105 },
];

class LoFiSynthesizer {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private currentTrackIndex = 0;
  private masterGain: GainNode | null = null;
  private timerId: number | null = null;
  private step = 0;
  private subscribers = new Set<(playing: boolean, track: TrackInfo) => void>();

  init() {
    if (this.ctx || typeof window === 'undefined') return;
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    this.ctx = new AudioCtx();
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.18, this.ctx.currentTime);
    this.masterGain.connect(this.ctx.destination);
  }

  subscribe(callback: (playing: boolean, track: TrackInfo) => void) {
    this.subscribers.add(callback);
    callback(this.isPlaying, TRACKS[this.currentTrackIndex]);
    return () => {
      this.subscribers.delete(callback);
    };
  }

  private notify() {
    this.subscribers.forEach((cb) => cb(this.isPlaying, TRACKS[this.currentTrackIndex]));
  }

  getIsPlaying() {
    return this.isPlaying;
  }

  getCurrentTrack() {
    return TRACKS[this.currentTrackIndex];
  }

  async togglePlay() {
    if (this.isPlaying) {
      this.stop();
    } else {
      await this.play();
    }
  }

  async play() {
    this.init();
    if (!this.ctx || !this.masterGain) return;

    if (this.ctx.state === 'suspended') {
      await this.ctx.resume();
    }

    this.isPlaying = true;
    this.step = 0;
    this.scheduleBeat();
    this.notify();
  }

  stop() {
    this.isPlaying = false;
    if (this.timerId !== null) {
      window.clearTimeout(this.timerId);
      this.timerId = null;
    }
    this.notify();
  }

  nextTrack() {
    this.currentTrackIndex = (this.currentTrackIndex + 1) % TRACKS.length;
    if (this.isPlaying) {
      this.step = 0;
    }
    this.notify();
  }

  prevTrack() {
    this.currentTrackIndex = (this.currentTrackIndex - 1 + TRACKS.length) % TRACKS.length;
    if (this.isPlaying) {
      this.step = 0;
    }
    this.notify();
  }

  private scheduleBeat = () => {
    if (!this.isPlaying || !this.ctx || !this.masterGain) return;

    const track = TRACKS[this.currentTrackIndex];
    const beatDuration = 60 / track.bpm;
    const now = this.ctx.currentTime;

    // Chord progression notes (frequencies)
    const chordsA = [
      [220, 261.63, 329.63], // Am
      [174.61, 220, 261.63], // F
      [130.81, 164.81, 196.0], // C
      [196.0, 246.94, 293.66], // G
    ];

    const chordsB = [
      [146.83, 174.61, 220.0], // Dm
      [164.81, 196.0, 246.94], // Em
      [174.61, 220.0, 261.63], // F
      [196.0, 246.94, 293.66], // G
    ];

    const activeChords = track.id === 'synthwave' ? chordsB : chordsA;
    const chordIndex = Math.floor(this.step / 4) % activeChords.length;
    const currentChord = activeChords[chordIndex];

    // Beat step (0-3 in 4/4 bar)
    const barBeat = this.step % 4;

    // 1. Warm Analog Chord Pad
    if (barBeat === 0) {
      this.playWarmChord(currentChord, beatDuration * 3.8);
    }

    // 2. Lo-Fi Kick Drum (beat 0 and 2.5)
    if (barBeat === 0 || barBeat === 2) {
      this.playKick(now);
    }

    // 3. Vintage Snare / Rimshot (beat 1 and 3)
    if (barBeat === 1 || barBeat === 3) {
      this.playSnare(now);
    }

    // 4. Subtle Hi-hat tick (every beat)
    this.playHiHat(now, barBeat % 2 === 1);

    // 5. Arpeggio lead note
    const note = currentChord[this.step % currentChord.length] * (track.id === 'synthwave' ? 2 : 1.5);
    this.playLeadNote(note, beatDuration * 0.7);

    this.step++;
    const nextIntervalMs = (beatDuration / 2) * 1000;
    this.timerId = window.setTimeout(this.scheduleBeat, nextIntervalMs);
  };

  private playKick(time: number) {
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(120, time);
    osc.frequency.exponentialRampToValueAtTime(32, time + 0.16);

    gain.gain.setValueAtTime(0.55, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.22);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(time);
    osc.stop(time + 0.25);
  }

  private playSnare(time: number) {
    if (!this.ctx || !this.masterGain) return;
    // Noise buffer for snap
    const bufferSize = this.ctx.sampleRate * 0.12;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    // Filter to warm lo-fi frequencies
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1400, time);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.22, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.12);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    noise.start(time);
  }

  private playHiHat(time: number, isAccent: boolean) {
    if (!this.ctx || !this.masterGain) return;
    const bufferSize = this.ctx.sampleRate * 0.04;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(7000, time);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(isAccent ? 0.08 : 0.035, time);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.04);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    noise.start(time);
  }

  private playWarmChord(freqs: number[], duration: number) {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;

    freqs.forEach((freq) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      const filter = this.ctx!.createBiquadFilter();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq * 0.5, now);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(450, now);
      filter.frequency.linearRampToValueAtTime(800, now + duration * 0.5);
      filter.frequency.linearRampToValueAtTime(450, now + duration);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.06, now + 0.3);
      gain.gain.linearRampToValueAtTime(0.04, now + duration * 0.7);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain!);

      osc.start(now);
      osc.stop(now + duration + 0.1);
    });
  }

  private playLeadNote(freq: number, duration: number) {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(0.04, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + duration);
  }
}

export const lofiSynth = new LoFiSynthesizer();
