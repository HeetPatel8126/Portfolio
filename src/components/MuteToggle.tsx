'use client';

import { useTerminalStore } from '@/store/terminal';
import { useEffect } from 'react';

export default function MuteToggle() {
  const soundEnabled = useTerminalStore((s) => s.soundEnabled);
  const toggleSound = useTerminalStore((s) => s.toggleSound);

  useEffect(() => {
    // Howler global mute
    if (typeof window !== 'undefined') {
      const { Howler } = require('howler');
      Howler.mute(!soundEnabled);
    }
  }, [soundEnabled]);

  return (
    <button
      onClick={toggleSound}
      className="fixed top-3 right-[80px] sm:bottom-5 sm:right-5 sm:top-auto z-[60] flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full sm:rounded-lg border border-white/15 bg-[#0a0c10]/85 text-text-dim backdrop-blur-md transition-all duration-200 hover:border-accent/30 hover:text-accent"
      aria-label={soundEnabled ? 'Mute sounds' : 'Unmute sounds'}
      title={soundEnabled ? 'Mute' : 'Unmute'}
    >
      {soundEnabled ? (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <line x1="23" y1="9" x2="17" y2="15" />
          <line x1="17" y1="9" x2="23" y2="15" />
        </svg>
      )}
    </button>
  );
}
