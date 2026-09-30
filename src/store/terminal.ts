'use client';

import { create } from 'zustand';

export interface OutputLine {
  text: string;
  className?: string;
}

interface TerminalStore {
  // Output
  history: OutputLine[];
  addOutput: (lines: OutputLine[]) => void;
  clearOutput: () => void;

  // Command history (up/down arrow)
  commandHistory: string[];
  historyIndex: number;
  pushCommand: (cmd: string) => void;
  navigateHistory: (direction: 'up' | 'down') => string;
  resetHistoryIndex: () => void;

  // Tab completion
  tabComplete: (partial: string) => string;

  // Boot state
  isBooted: boolean;
  boot: () => void;

  // CRT effect
  crtEnabled: boolean;
  toggleCRT: () => void;

  // Sound
  soundEnabled: boolean;
  toggleSound: () => void;

  // Embedded games / interactive tools
  activeGame: 'snake' | 'typing' | null;
  setActiveGame: (game: 'snake' | 'typing' | null) => void;
}

const COMMANDS = [
  'help',
  'whoami',
  'resume',
  'pdf',
  'ls',
  'cat',
  'skills',
  'experience',
  'contact',
  'github',
  'stats',
  'guestbook',
  'sign',
  'snake',
  'typing',
  'quest',
  'music',
  'radio',
  'clock',
  'time',
  'phone',
  'clear',
  'exit',
  'theme',
  'color',
  'sudo',
  'matrix',
  'crt',
  'neofetch',
];

const PROJECT_FILES = [
  'syntheticdatagen.md',
  'diffusionlm.md',
  'nidrs.md',
  'veridian.md',
];

export const useTerminalStore = create<TerminalStore>((set, get) => ({
  history: [],
  addOutput: (lines) =>
    set((s) => ({ history: [...s.history, ...lines] })),
  clearOutput: () => set({ history: [] }),

  commandHistory: [],
  historyIndex: -1,
  pushCommand: (cmd) =>
    set((s) => ({
      commandHistory: [cmd, ...s.commandHistory].slice(0, 50),
      historyIndex: -1,
    })),
  navigateHistory: (direction) => {
    const { commandHistory, historyIndex } = get();
    if (commandHistory.length === 0) return '';
    let newIndex: number;
    if (direction === 'up') {
      newIndex = Math.min(historyIndex + 1, commandHistory.length - 1);
    } else {
      newIndex = Math.max(historyIndex - 1, -1);
    }
    set({ historyIndex: newIndex });
    return newIndex === -1 ? '' : commandHistory[newIndex];
  },
  resetHistoryIndex: () => set({ historyIndex: -1 }),

  tabComplete: (partial) => {
    if (!partial) return '';
    const parts = partial.split(' ');

    // Complete command name
    if (parts.length === 1) {
      const matches = COMMANDS.filter((c) => c.startsWith(parts[0]));
      if (matches.length === 1) return matches[0];
      return partial;
    }

    // Complete file arguments for cat
    if (parts[0] === 'cat' && parts.length === 2) {
      const matches = PROJECT_FILES.filter((f) => f.startsWith(parts[1]));
      if (matches.length === 1) return `cat ${matches[0]}`;
      return partial;
    }

    // Complete 'projects' for ls
    if (parts[0] === 'ls' && parts.length === 2) {
      if ('projects'.startsWith(parts[1])) return 'ls projects';
      return partial;
    }

    return partial;
  },

  isBooted: false,
  boot: () => set({ isBooted: true }),

  crtEnabled: true,
  toggleCRT: () => set((s) => ({ crtEnabled: !s.crtEnabled })),

  soundEnabled: true,
  toggleSound: () => set((s) => ({ soundEnabled: !s.soundEnabled })),

  activeGame: null,
  setActiveGame: (game) => set({ activeGame: game }),
}));
