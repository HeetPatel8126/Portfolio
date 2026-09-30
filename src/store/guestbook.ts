'use client';

import { create } from 'zustand';

export interface GuestbookEntry {
  id: string;
  name: string;
  message: string;
  role?: string;
  date: string;
  badge?: string;
}

const DEFAULT_ENTRIES: GuestbookEntry[] = [
  {
    id: '1',
    name: 'Sarah Lin',
    role: 'Senior ML Engineer @ Meta',
    message: 'Discrete diffusion from first principles is impressive! Keep building.',
    date: '2026-09-27',
    badge: '🚀 Verified Dev',
  },
  {
    id: '2',
    name: 'Devin Thorne',
    role: 'Tech Lead @ Cybersec',
    message: 'Checked out the NIDRS intrusion detection architecture. Solid anomaly modeling with PyShark.',
    date: '2026-09-24',
    badge: '🛡️ Security',
  },
  {
    id: '3',
    name: 'Aryan Mehta',
    role: 'Hackathon Teammate',
    message: 'SIH 2025 grind was legendary. 10/10 portfolio setup!',
    date: '2026-09-20',
    badge: '🏆 SIH Alumni',
  },
];

interface GuestbookState {
  entries: GuestbookEntry[];
  addEntry: (name: string, message: string, role?: string) => GuestbookEntry;
  init: () => void;
}

export const useGuestbookStore = create<GuestbookState>((set, get) => ({
  entries: DEFAULT_ENTRIES,

  init: () => {
    if (typeof window === 'undefined') return;
    try {
      const stored = localStorage.getItem('portfolio_guestbook_entries');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          set({ entries: parsed });
        }
      }
    } catch {
      // ignore
    }
  },

  addEntry: (name: string, message: string, role?: string) => {
    const newEntry: GuestbookEntry = {
      id: Date.now().toString(),
      name: name.trim(),
      message: message.trim(),
      role: role?.trim() || 'Visitor',
      date: new Date().toISOString().split('T')[0],
      badge: '✨ Visitor',
    };

    const updated = [newEntry, ...get().entries];
    set({ entries: updated });

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('portfolio_guestbook_entries', JSON.stringify(updated));
      } catch {
        // ignore
      }
    }

    return newEntry;
  },
}));
