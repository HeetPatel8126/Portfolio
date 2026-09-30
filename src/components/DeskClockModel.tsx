'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { soundManager } from '@/lib/sounds';

export default function DeskClockModel() {
  const [hoursMin, setHoursMin] = useState('12:00');
  const [seconds, setSeconds] = useState('00');
  const [colonVisible, setColonVisible] = useState(true);
  const [tzMode, setTzMode] = useState<'IST' | 'LOCAL'>('IST');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const tz = tzMode === 'IST' ? 'Asia/Kolkata' : undefined;

      const hm = now.toLocaleTimeString('en-US', {
        timeZone: tz,
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
      });
      const sec = now.toLocaleTimeString('en-US', {
        timeZone: tz,
        hour12: false,
        second: '2-digit',
      });

      setHoursMin(hm);
      setSeconds(sec);
      setColonVisible((prev) => !prev);
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [tzMode]);

  const toggleTz = (e: React.MouseEvent) => {
    e.stopPropagation();
    soundManager.playKeyClick();
    setTzMode((m) => (m === 'IST' ? 'LOCAL' : 'IST'));
  };

  const [h, m] = hoursMin.split(':');

  return (
    <motion.div
      onClick={toggleTz}
      whileHover={{ y: -3, scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      className="group absolute cursor-pointer select-none z-30"
      style={{
        left: '52.5%',
        top: '43.2%',
        width: '7.6%',
        height: '8.8%',
        transform: 'rotate(-20deg) skewX(10deg)',
      }}
      title={`⏰ Desk Clock — Click to switch timezone (Current: ${tzMode} - ${tzMode === 'IST' ? 'Vadodara' : 'Local'})`}
    >
      {/* Desk surface contact shadow */}
      <div
        className="pointer-events-none absolute -inset-1 rounded-md opacity-60 blur-xs transition-opacity group-hover:opacity-90"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.95) 0%, transparent 80%)',
          boxShadow: '0 6px 14px rgba(0,0,0,0.95), 0 0 16px var(--setup-glow)',
        }}
      />

      {/* Clock Casing with metallic bezel */}
      <div className="relative h-full w-full rounded-[6px] border-[1.5px] border-[#2c3444] bg-gradient-to-b from-[#181d26] via-[#0d1017] to-[#06080c] p-[3px] shadow-[0_4px_16px_rgba(0,0,0,0.8)] transition-all group-hover:border-accent">
        {/* Recessed Matte LED Face */}
        <div className="relative h-full w-full rounded-[4px] bg-[#030508] border border-black flex flex-col justify-between p-1 overflow-hidden shadow-inner">
          {/* Top header row: Timezone & Live pulse indicator */}
          <div className="flex w-full items-center justify-between text-[6px] sm:text-[7.5px] font-mono leading-none">
            <span className="text-accent font-bold tracking-wider">{tzMode}</span>
            <div className="flex items-center gap-0.5">
              <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse shadow-[0_0_5px_var(--setup-glow)]" />
            </div>
          </div>

          {/* Main glowing digital time display */}
          <div className="flex items-baseline justify-center font-mono my-auto">
            <span
              className="text-[10px] sm:text-[13px] font-extrabold tracking-tight text-accent leading-none"
              style={{
                textShadow: '0 0 10px var(--setup-glow), 0 0 20px var(--setup-glow)',
              }}
            >
              {h || '12'}
              <span className={`inline-block transition-opacity duration-200 ${colonVisible ? 'opacity-100' : 'opacity-20'}`}>
                :
              </span>
              {m || '00'}
            </span>
            <span
              className="ml-0.5 text-[6px] sm:text-[8px] font-bold text-accent/80 font-mono leading-none"
              style={{ textShadow: '0 0 6px var(--setup-glow)' }}
            >
              .{seconds}
            </span>
          </div>

          {/* Bottom tag: Vadodara / Local */}
          <div className="flex w-full items-center justify-between text-[5px] sm:text-[6.5px] text-text-dim font-mono tracking-wider">
            <span className="truncate">{tzMode === 'IST' ? 'VADODARA' : 'SYSTEM'}</span>
            <span className="text-[5px] text-accent/60">TOGGLE ⇄</span>
          </div>

          {/* Subtle LED screen horizontal scanlines */}
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.4)_50%)] bg-[length:100%_2px] opacity-25" />
          
          {/* Beveled glass glare reflection */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.08] to-transparent opacity-70" />
        </div>
      </div>

      {/* Floating Hover Badge */}
      <div className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md border border-accent/40 bg-[#06080c]/95 px-2 py-0.5 text-[9px] font-mono text-accent opacity-0 backdrop-blur-md transition-opacity group-hover:opacity-100 shadow-[0_0_12px_var(--setup-glow)] z-40">
        ⏰ Desk Clock ({tzMode} · Click to toggle)
      </div>
    </motion.div>
  );
}
