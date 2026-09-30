'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSetupThemeStore, SETUP_THEMES } from '@/store/setupTheme';
import { soundManager } from '@/lib/sounds';
import { useTerminalStore } from '@/store/terminal';

export default function SetupColorPicker() {
  const [isOpen, setIsOpen] = useState(false);
  const currentTheme = useSetupThemeStore((s) => s.currentTheme);
  const isRainbow = useSetupThemeStore((s) => s.isRainbow);
  const customColor = useSetupThemeStore((s) => s.customColor);
  const setThemeById = useSetupThemeStore((s) => s.setThemeById);
  const setCustomColor = useSetupThemeStore((s) => s.setCustomColor);
  const toggleRainbow = useSetupThemeStore((s) => s.toggleRainbow);
  const soundEnabled = useTerminalStore((s) => s.soundEnabled);

  const colorInputRef = useRef<HTMLInputElement>(null);

  const handleSelect = (id: string) => {
    if (soundEnabled) soundManager.playKeyClick();
    setThemeById(id);
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomColor(e.target.value);
  };

  const handleRainbowClick = () => {
    if (soundEnabled) soundManager.playKeyClick();
    toggleRainbow();
  };

  // Rainbow color cycling effect when isRainbow is active
  useEffect(() => {
    if (!isRainbow) return;
    let hue = 0;
    const interval = setInterval(() => {
      hue = (hue + 2) % 360;
      const rgbHex = `hsl(${hue}, 90%, 60%)`;
      if (typeof document !== 'undefined') {
        document.documentElement.style.setProperty('--color-accent', rgbHex);
        document.documentElement.style.setProperty('--setup-glow', `hsla(${hue}, 90%, 60%, 0.5)`);
        document.documentElement.style.setProperty('--setup-hue-rotate', `${hue - 171}deg`);
      }
    }, 40);

    return () => {
      clearInterval(interval);
      // Restore current theme color when stopped
      if (typeof document !== 'undefined') {
        document.documentElement.style.setProperty('--color-accent', currentTheme.primary);
        document.documentElement.style.setProperty('--setup-glow', currentTheme.glow);
        document.documentElement.style.setProperty('--setup-hue-rotate', `${currentTheme.hueRotate}deg`);
      }
    };
  }, [isRainbow, currentTheme]);

  return (
    <div className="fixed top-3 sm:top-5 left-3 sm:left-6 z-40 flex items-center select-none font-mono">
      {/* Trigger button */}
      <button
        onClick={() => {
          if (soundEnabled) soundManager.playKeyClick();
          setIsOpen(!isOpen);
        }}
        className="group flex items-center gap-1.5 sm:gap-2.5 rounded-full border border-white/15 bg-[#0a0c10]/85 px-2.5 sm:px-3.5 py-1.5 backdrop-blur-md transition-all duration-300 hover:border-accent/40 hover:shadow-[0_0_15px_var(--setup-glow)]"
        title="Setup RGB Lighting"
      >
        {/* Glowing bulb icon with active color */}
        <span
          className="relative flex h-2.5 w-2.5 sm:h-3 sm:w-3 items-center justify-center rounded-full transition-all duration-300 shrink-0"
          style={{
            backgroundColor: isRainbow ? 'transparent' : currentTheme.primary,
            backgroundImage: isRainbow
              ? 'linear-gradient(135deg, #ff0055, #00ffcc, #ffbb00)'
              : undefined,
            boxShadow: `0 0 10px ${isRainbow ? 'rgba(71,240,214,0.8)' : currentTheme.primary}`,
          }}
        >
          <span
            className="absolute inset-0 rounded-full animate-ping opacity-60"
            style={{
              backgroundColor: isRainbow ? '#00ffcc' : currentTheme.primary,
            }}
          />
        </span>

        <span className="text-[11px] sm:text-xs font-semibold tracking-wider text-text transition-colors group-hover:text-accent">
          RGB
        </span>

        <span className="hidden sm:inline text-[10px] text-text-dim uppercase tracking-widest pl-1 border-l border-white/10">
          {isRainbow ? 'RAINBOW' : currentTheme.name}
        </span>

        <svg
          className={`h-3 w-3 text-text-dim transition-transform duration-200 ${isOpen ? 'rotate-180 text-accent' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="absolute left-0 top-10 sm:top-11 mt-1 flex flex-col gap-3 rounded-2xl border border-white/15 bg-[#0a0c10]/95 p-3 sm:p-3.5 shadow-2xl backdrop-blur-xl w-[260px] sm:min-w-[280px] max-w-[calc(100vw-24px)]"
          >
            <div className="flex items-center justify-between text-[11px] text-text-dim tracking-wider uppercase border-b border-white/5 pb-2">
              <span>Lighting Profiles</span>
              <span className="text-accent font-semibold">{isRainbow ? 'Dynamic' : 'Static'}</span>
            </div>

            {/* Presets Grid */}
            <div className="grid grid-cols-3 gap-2">
              {SETUP_THEMES.map((theme) => {
                const isActive = !isRainbow && currentTheme.id === theme.id;
                return (
                  <button
                    key={theme.id}
                    onClick={() => handleSelect(theme.id)}
                    className={`relative flex flex-col items-center gap-1.5 rounded-xl border p-2 text-center transition-all duration-200 ${
                      isActive
                        ? 'border-accent bg-accent/15 shadow-[0_0_12px_var(--setup-glow)]'
                        : 'border-white/5 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.06]'
                    }`}
                  >
                    <span
                      className="h-4 w-4 rounded-full transition-transform duration-200"
                      style={{
                        backgroundColor: theme.primary,
                        boxShadow: isActive ? `0 0 8px ${theme.primary}` : 'none',
                        transform: isActive ? 'scale(1.15)' : 'scale(1)',
                      }}
                    />
                    <span className="text-[10px] font-medium text-text leading-tight">
                      {theme.name}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Special modes: Rainbow Cycle & Custom Hex */}
            <div className="flex items-center gap-2 pt-1 border-t border-white/5">
              {/* Rainbow button */}
              <button
                onClick={handleRainbowClick}
                className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg border py-1.5 px-2 text-[11px] font-medium transition-all ${
                  isRainbow
                    ? 'border-accent bg-accent/20 text-accent shadow-[0_0_12px_rgba(71,240,214,0.4)]'
                    : 'border-white/10 bg-white/[0.02] text-text-dim hover:text-text hover:border-white/20'
                }`}
              >
                <span className="h-3 w-3 rounded-full bg-gradient-to-r from-red-500 via-green-400 to-blue-500" />
                <span>RGB Aura</span>
              </button>

              {/* Custom Color Button */}
              <button
                onClick={() => colorInputRef.current?.click()}
                className={`flex items-center justify-center gap-1.5 rounded-lg border py-1.5 px-3 text-[11px] font-medium transition-all ${
                  !isRainbow && currentTheme.id === 'custom'
                    ? 'border-accent bg-accent/20 text-accent shadow-[0_0_12px_var(--setup-glow)]'
                    : 'border-white/10 bg-white/[0.02] text-text-dim hover:text-text hover:border-white/20'
                }`}
                title="Pick Custom Color"
              >
                <span
                  className="h-3 w-3 rounded-full border border-white/40"
                  style={{ backgroundColor: customColor }}
                />
                <span>Custom</span>
                <input
                  ref={colorInputRef}
                  type="color"
                  value={customColor}
                  onChange={handleCustomChange}
                  className="sr-only"
                />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
