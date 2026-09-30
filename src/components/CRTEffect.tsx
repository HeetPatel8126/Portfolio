'use client';

import { useTerminalStore } from '@/store/terminal';

export default function CRTEffect() {
  const crtEnabled = useTerminalStore((s) => s.crtEnabled);

  if (!crtEnabled) return null;

  return (
    <div className="pointer-events-none absolute inset-0 z-50 overflow-hidden">
      {/* Scanlines */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          background:
            'repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(0,0,0,0.3) 1px, rgba(0,0,0,0.3) 2px)',
          backgroundSize: '100% 2px',
        }}
      />

      {/* Chromatic aberration via overlapping colored shadows */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          background:
            'linear-gradient(90deg, rgba(255,0,0,0.2) 0%, transparent 20%, transparent 80%, rgba(0,0,255,0.2) 100%)',
        }}
      />

      {/* Subtle vignette */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.6) 100%)',
        }}
      />

      {/* Screen flicker - very subtle */}
      <div className="absolute inset-0 animate-crt-flicker opacity-[0.01] bg-white" />
    </div>
  );
}
