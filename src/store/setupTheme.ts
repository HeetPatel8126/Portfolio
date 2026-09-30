'use client';

import { create } from 'zustand';

export interface SetupTheme {
  id: string;
  name: string;
  primary: string;
  secondary: string;
  glow: string;
  hueRotate: number; // Offset from base cyan hue (~171deg)
}

export const SETUP_THEMES: SetupTheme[] = [
  {
    id: 'cyan',
    name: 'Cyber Mint',
    primary: '#47f0d6',
    secondary: '#ffb454',
    glow: 'rgba(71, 240, 214, 0.5)',
    hueRotate: 0,
  },
  {
    id: 'matrix',
    name: 'Matrix Green',
    primary: '#00ff66',
    secondary: '#10b981',
    glow: 'rgba(0, 255, 102, 0.5)',
    hueRotate: -30,
  },
  {
    id: 'purple',
    name: 'Neon Violet',
    primary: '#c084fc',
    secondary: '#f43f5e',
    glow: 'rgba(192, 132, 252, 0.5)',
    hueRotate: 105,
  },
  {
    id: 'crimson',
    name: 'Crimson Red',
    primary: '#ff3366',
    secondary: '#f97316',
    glow: 'rgba(255, 51, 102, 0.5)',
    hueRotate: 174,
  },
  {
    id: 'amber',
    name: 'Sunset Amber',
    primary: '#ffb454',
    secondary: '#ea580c',
    glow: 'rgba(255, 180, 84, 0.5)',
    hueRotate: -137,
  },
  {
    id: 'ice',
    name: 'Ice Blue',
    primary: '#38bdf8',
    secondary: '#6366f1',
    glow: 'rgba(56, 189, 248, 0.5)',
    hueRotate: 28,
  },
];

interface SetupThemeState {
  currentTheme: SetupTheme;
  isRainbow: boolean;
  customColor: string;
  setThemeById: (id: string) => void;
  setCustomColor: (hex: string) => void;
  toggleRainbow: () => void;
  initTheme: () => void;
}

function hexToRgb(hex: string): [number, number, number] {
  const cleanHex = hex.replace('#', '');
  if (cleanHex.length === 3) {
    return [
      parseInt(cleanHex[0] + cleanHex[0], 16),
      parseInt(cleanHex[1] + cleanHex[1], 16),
      parseInt(cleanHex[2] + cleanHex[2], 16),
    ];
  }
  return [
    parseInt(cleanHex.substring(0, 2), 16) || 71,
    parseInt(cleanHex.substring(2, 4), 16) || 240,
    parseInt(cleanHex.substring(4, 6), 16) || 214,
  ];
}

function hexToRgba(hex: string, alpha: number): string {
  const [r, g, b] = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function hexToHueRotate(hex: string): number {
  const [r, g, b] = hexToRgb(hex).map((v) => v / 255);
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  let h = 0;
  if (d === 0) h = 0;
  else if (max === r) h = ((g - b) / d) % 6;
  else if (max === g) h = (b - r) / d + 2;
  else h = (r - g) / d + 4;
  h = Math.round(h * 60);
  if (h < 0) h += 360;

  // Base cyan in desk.png has hue 171deg
  let diff = h - 171;
  if (diff > 180) diff -= 360;
  if (diff < -180) diff += 360;
  return diff;
}

function applyThemeToCss(theme: SetupTheme) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  root.style.setProperty('--color-accent', theme.primary);
  root.style.setProperty('--color-accent-secondary', theme.secondary);
  root.style.setProperty('--setup-glow', theme.glow);
  root.style.setProperty('--setup-hue-rotate', `${theme.hueRotate}deg`);
}

export const useSetupThemeStore = create<SetupThemeState>((set, get) => ({
  currentTheme: SETUP_THEMES[0],
  isRainbow: false,
  customColor: '#47f0d6',

  initTheme: () => {
    if (typeof window === 'undefined') return;
    try {
      const saved = localStorage.getItem('setup_theme_id');
      const savedCustom = localStorage.getItem('setup_custom_color');
      const savedRainbow = localStorage.getItem('setup_rainbow') === 'true';

      if (savedRainbow) {
        set({ isRainbow: true });
        return;
      }

      if (saved === 'custom' && savedCustom) {
        const customTheme: SetupTheme = {
          id: 'custom',
          name: 'Custom RGB',
          primary: savedCustom,
          secondary: '#ffb454',
          glow: hexToRgba(savedCustom, 0.5),
          hueRotate: hexToHueRotate(savedCustom),
        };
        set({ currentTheme: customTheme, customColor: savedCustom, isRainbow: false });
        applyThemeToCss(customTheme);
        return;
      }

      if (saved) {
        const found = SETUP_THEMES.find((t) => t.id === saved);
        if (found) {
          set({ currentTheme: found, isRainbow: false });
          applyThemeToCss(found);
          return;
        }
      }

      // Default
      applyThemeToCss(SETUP_THEMES[0]);
    } catch {
      applyThemeToCss(SETUP_THEMES[0]);
    }
  },

  setThemeById: (id: string) => {
    const found = SETUP_THEMES.find((t) => t.id === id);
    if (!found) return;
    set({ currentTheme: found, isRainbow: false });
    applyThemeToCss(found);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('setup_theme_id', id);
        localStorage.setItem('setup_rainbow', 'false');
      } catch {}
    }
  },

  setCustomColor: (hex: string) => {
    const customTheme: SetupTheme = {
      id: 'custom',
      name: 'Custom RGB',
      primary: hex,
      secondary: '#ffb454',
      glow: hexToRgba(hex, 0.5),
      hueRotate: hexToHueRotate(hex),
    };
    set({ currentTheme: customTheme, customColor: hex, isRainbow: false });
    applyThemeToCss(customTheme);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('setup_theme_id', 'custom');
        localStorage.setItem('setup_custom_color', hex);
        localStorage.setItem('setup_rainbow', 'false');
      } catch {}
    }
  },

  toggleRainbow: () => {
    const next = !get().isRainbow;
    set({ isRainbow: next });
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('setup_rainbow', String(next));
      } catch {}
    }
  },
}));
