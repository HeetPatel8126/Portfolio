'use client';

import { motion } from 'framer-motion';

interface StatsPopupProps {
  label: string;
  value: string;
  isVisible: boolean;
  position: { x: number; y: number };
}

export default function StatsPopup({ label, value, isVisible, position }: StatsPopupProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 4 }}
      animate={{
        opacity: isVisible ? 1 : 0,
        scale: isVisible ? 1 : 0.9,
        y: isVisible ? 0 : 4,
      }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="pointer-events-none absolute z-40 hidden sm:block"
      style={{ left: `${position.x}%`, top: `${position.y}%` }}
    >
      <div className="rounded-lg border border-accent/20 bg-[#0a0c10]/95 px-3 py-2 backdrop-blur-md">
        <div className="text-[10px] uppercase tracking-widest text-text-dim">{label}</div>
        <div className="text-xs font-semibold text-accent">{value}</div>
      </div>
    </motion.div>
  );
}
