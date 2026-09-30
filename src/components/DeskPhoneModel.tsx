'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface DeskPhoneModelProps {
  onClick: () => void;
}

export default function DeskPhoneModel({ onClick }: DeskPhoneModelProps) {
  const [timeStr, setTimeStr] = useState('10:30');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        })
      );
    };
    update();
    const interval = setInterval(update, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      onClick={onClick}
      whileHover={{ y: -3, scale: 1.06 }}
      whileTap={{ scale: 0.96 }}
      className="group absolute cursor-pointer select-none z-30"
      style={{
        left: '39.2%',
        top: '69.5%',
        width: '5.5%',
        height: '11.5%',
        transform: 'rotate(-22deg) skewX(10deg)',
      }}
      title="📱 Smartphone — Tap to open contact card"
    >
      {/* Ambient shadow beneath the phone on the desk surface */}
      <div
        className="pointer-events-none absolute -inset-1 rounded-xl opacity-60 blur-xs transition-opacity group-hover:opacity-90"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.9) 0%, transparent 80%)',
          boxShadow: '0 6px 16px rgba(0,0,0,0.95), 0 0 12px var(--setup-glow)',
        }}
      />

      {/* Phone chassis */}
      <div className="relative h-full w-full rounded-[9px] border-[1.5px] border-[#2a3040] bg-[#090b10] p-[2px] shadow-xl transition-all group-hover:border-accent">
        {/* Screen Bezel */}
        <div className="relative h-full w-full rounded-[7px] overflow-hidden bg-gradient-to-b from-[#0e121a] via-[#090c12] to-[#040608] flex flex-col justify-between p-1">
          {/* Dynamic Island / Notch */}
          <div className="mx-auto h-[3px] w-3.5 rounded-full bg-black flex items-center justify-center">
            <div className="h-[2px] w-[2px] rounded-full bg-[#10b981]" />
          </div>

          {/* Mini Lock Screen Display */}
          <div className="text-center font-mono my-auto">
            <div className="text-[7.5px] sm:text-[9.5px] font-extrabold text-white tracking-wider leading-none">
              {timeStr}
            </div>
            {/* Discord Notification Pill */}
            <div className="mt-1 inline-flex items-center gap-0.5 rounded-full bg-[#5865F2]/30 px-1 py-[1px] border border-[#5865F2]/50 max-w-full">
              <span className="text-[5.5px]">💬</span>
              <span className="text-[5px] text-[#c7d2fe] font-bold truncate">@redninja8126</span>
            </div>
          </div>

          {/* Home Bar */}
          <div className="mx-auto h-[1.5px] w-4 rounded-full bg-white/40" />

          {/* Screen Glass Glare Reflection */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.08] to-transparent opacity-60" />
        </div>
      </div>

      {/* Floating Hover Label */}
      <div className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md border border-accent/40 bg-[#06080c]/95 px-2 py-0.5 text-[9px] font-mono text-accent opacity-0 backdrop-blur-md transition-opacity group-hover:opacity-100 shadow-[0_0_12px_var(--setup-glow)] z-40">
        📱 Smartphone (Contact)
      </div>
    </motion.div>
  );
}
