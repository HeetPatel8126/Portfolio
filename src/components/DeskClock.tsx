'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function DeskClock() {
  const [timeStr, setTimeStr] = useState('');
  const [tzMode, setTzMode] = useState<'IST' | 'LOCAL'>('IST');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      if (tzMode === 'IST') {
        const istStr = now.toLocaleTimeString('en-US', {
          timeZone: 'Asia/Kolkata',
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        });
        setTimeStr(istStr);
      } else {
        const localStr = now.toLocaleTimeString('en-US', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        });
        setTimeStr(localStr);
      }
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [tzMode]);

  const toggleTz = (e: React.MouseEvent) => {
    e.stopPropagation();
    setTzMode((m) => (m === 'IST' ? 'LOCAL' : 'IST'));
  };

  return (
    <div
      onClick={toggleTz}
      className="group relative cursor-pointer rounded border border-white/10 bg-black/80 px-2.5 py-1 font-mono backdrop-blur-xs select-none transition-all hover:border-accent/40 shadow-[0_0_12px_var(--setup-glow)]"
      title={`Click to switch between IST (Vadodara) and Local Time (Current: ${tzMode})`}
    >
      <div className="flex items-center gap-1.5 text-[11px] font-bold text-accent">
        <span className="h-1.5 w-1.5 rounded-full bg-accent animate-ping" />
        <span className="tracking-widest">{timeStr || '12:00:00'}</span>
        <span className="rounded bg-white/10 px-1 py-0.2 text-[9px] font-normal text-text-dim group-hover:text-accent">
          {tzMode}
        </span>
      </div>
    </div>
  );
}
