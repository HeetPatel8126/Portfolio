'use client';

import { Howl } from 'howler';

class SoundManager {
  private keyClicks: Record<string, Howl> = {};
  private bootBeep: Howl | null = null;
  private errorBuzz: Howl | null = null;
  private initialized = false;

  init() {
    if (this.initialized || typeof window === 'undefined') return;
    this.initialized = true;

    // Generate thocky-clicky mechanical switch profiles
    // Kreo Swarm 75 style: crisp tactile leaf snap + deep acoustic bottom-out thock
    this.keyClicks.alpha = new Howl({
      src: [this.generateThockySwitch(165, 1.0, 0.08)],
      volume: 0.35,
    });

    this.keyClicks.space = new Howl({
      src: [this.generateThockySwitch(130, 0.85, 0.095)],
      volume: 0.42,
    });

    this.keyClicks.enter = new Howl({
      src: [this.generateThockySwitch(150, 1.1, 0.085)],
      volume: 0.38,
    });

    this.keyClicks.alt = new Howl({
      src: [this.generateThockySwitch(178, 1.05, 0.075)],
      volume: 0.34,
    });

    // Boot beep - retro vintage sine tone
    this.bootBeep = new Howl({
      src: [this.generateBeepSound()],
      volume: 0.22,
    });

    // Error buzz
    this.errorBuzz = new Howl({
      src: [this.generateBuzzSound()],
      volume: 0.12,
    });
  }

  /**
   * Synthesizes an authentic mechanical keyboard sound:
   * 1. Tactile click: Sharp 3kHz contact snap & metallic leaf tick
   * 2. Bottom-out thock: Low-frequency 130-180Hz plate resonance with harmonic warmth
   * 3. Upstroke micro-release
   */
  private generateThockySwitch(baseFreq: number, clickSharpness: number, duration: number): string {
    const sampleRate = 44100;
    const samples = Math.floor(sampleRate * duration);
    const buffer = new ArrayBuffer(44 + samples * 2);
    const view = new DataView(buffer);

    this.writeString(view, 0, 'RIFF');
    view.setUint32(4, 36 + samples * 2, true);
    this.writeString(view, 8, 'WAVE');
    this.writeString(view, 12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 1, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    this.writeString(view, 36, 'data');
    view.setUint32(40, samples * 2, true);

    for (let i = 0; i < samples; i++) {
      const t = i / sampleRate;

      // 1. Crisp tactile click snap (high-frequency tactile leaf click)
      const clickEnv = Math.exp(-t * 560 * clickSharpness);
      const clickTone = Math.sin(2 * Math.PI * 3150 * t) * 0.45;
      const clickNoise = (Math.random() * 2 - 1) * 0.32;
      const tactileClick = (clickTone + clickNoise) * clickEnv;

      // 2. Deep acoustic bottom-out THOCK (low-frequency plate and switch body resonance)
      const thockEnv = Math.exp(-t * 60);
      const fundamental = Math.sin(2 * Math.PI * baseFreq * t) * 0.78;
      const bodyOvertone = Math.sin(2 * Math.PI * (baseFreq * 2.15) * t) * 0.35;
      const cavityBoom = Math.sin(2 * Math.PI * (baseFreq * 0.52) * t) * 0.38;
      const bottomOutThock = (fundamental + bodyOvertone + cavityBoom) * thockEnv;

      // 3. Keycap spring release micro-tick (~17ms later)
      let releaseTick = 0;
      if (t > 0.017) {
        const rt = t - 0.017;
        releaseTick = Math.sin(2 * Math.PI * 2700 * rt) * Math.exp(-rt * 380) * 0.16;
      }

      // Combine & soft-saturate to deliver rich warm thock without clipping
      const combined = tactileClick * 0.7 + bottomOutThock * 0.88 + releaseTick;
      const saturated = Math.tanh(combined * 1.35);

      view.setInt16(44 + i * 2, Math.max(-32768, Math.min(32767, Math.floor(saturated * 32000))), true);
    }

    return this.bufferToDataUrl(buffer);
  }

  private generateBeepSound(): string {
    const sampleRate = 22050;
    const duration = 0.15;
    const samples = Math.floor(sampleRate * duration);
    const buffer = new ArrayBuffer(44 + samples * 2);
    const view = new DataView(buffer);

    this.writeString(view, 0, 'RIFF');
    view.setUint32(4, 36 + samples * 2, true);
    this.writeString(view, 8, 'WAVE');
    this.writeString(view, 12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 1, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    this.writeString(view, 36, 'data');
    view.setUint32(40, samples * 2, true);

    for (let i = 0; i < samples; i++) {
      const t = i / sampleRate;
      const envelope = t < 0.01 ? t / 0.01 : Math.exp(-(t - 0.01) * 15);
      const sample = Math.sin(2 * Math.PI * 880 * t) * envelope * 0.5;
      view.setInt16(44 + i * 2, Math.max(-32768, Math.min(32767, sample * 32767)), true);
    }

    return this.bufferToDataUrl(buffer);
  }

  private generateBuzzSound(): string {
    const sampleRate = 22050;
    const duration = 0.08;
    const samples = Math.floor(sampleRate * duration);
    const buffer = new ArrayBuffer(44 + samples * 2);
    const view = new DataView(buffer);

    this.writeString(view, 0, 'RIFF');
    view.setUint32(4, 36 + samples * 2, true);
    this.writeString(view, 8, 'WAVE');
    this.writeString(view, 12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 1, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    this.writeString(view, 36, 'data');
    view.setUint32(40, samples * 2, true);

    for (let i = 0; i < samples; i++) {
      const t = i / sampleRate;
      const envelope = Math.exp(-t * 30);
      const sample = Math.sin(2 * Math.PI * 220 * t) * 0.3 + (Math.random() * 2 - 1) * 0.2;
      view.setInt16(44 + i * 2, Math.max(-32768, Math.min(32767, sample * envelope * 32767)), true);
    }

    return this.bufferToDataUrl(buffer);
  }

  private writeString(view: DataView, offset: number, str: string) {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
  }

  private bufferToDataUrl(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return 'data:audio/wav;base64,' + btoa(binary);
  }

  playKeyClick(key?: string) {
    if (!this.initialized) this.init();

    let sound: Howl | undefined;
    if (key === ' ' || key === 'Spacebar') {
      sound = this.keyClicks.space;
    } else if (key === 'Enter') {
      sound = this.keyClicks.enter;
    } else if (key === 'Backspace' || key === 'Tab' || key === 'Shift') {
      sound = this.keyClicks.alt;
    } else {
      // Subtle switch variation between alpha and alt
      sound = Math.random() > 0.35 ? this.keyClicks.alpha : this.keyClicks.alt;
    }

    if (!sound) sound = this.keyClicks.alpha;

    if (sound) {
      // Human-like pitch & velocity micro-jitter for maximum realism
      const pitch = 0.95 + Math.random() * 0.1;
      sound.rate(pitch);
      sound.play();
    }
  }

  playBootBeep() {
    if (!this.initialized) this.init();
    this.bootBeep?.play();
  }

  playErrorBuzz() {
    if (!this.initialized) this.init();
    this.errorBuzz?.play();
  }
}

export const soundManager = new SoundManager();
