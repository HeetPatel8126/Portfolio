'use client';

import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import Hotspot from './Hotspot';
import StatsPopup from './StatsPopup';
import DeskClockModel from './DeskClockModel';
import DeskPhoneModel from './DeskPhoneModel';
import { useSetupThemeStore } from '@/store/setupTheme';

interface DeskSceneProps {
  onEnterTerminal: () => void;
  isTerminalActive: boolean;
  onOpenResumePdf?: () => void;
  onOpenPhone?: () => void;
}

const bootLines = [
  'Booting AI/ML Portfolio OS v2.4...',
  '[ OK ] Loaded kernel modules.',
  '[ OK ] Initialized neural network weights.',
  '[ OK ] Mounted /home/guest.',
  '',
  'guest@portfolio:~$ _',
];

export default function DeskScene({
  onEnterTerminal,
  isTerminalActive,
  onOpenResumePdf,
  onOpenPhone,
}: DeskSceneProps) {
  const sceneRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);
  const towerLedRef = useRef<HTMLDivElement>(null);
  const fanRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [booted, setBooted] = useState(false);
  const [bootText, setBootText] = useState<string[]>([]);
  const [showHint, setShowHint] = useState(false);

  // Boot sequence
  useEffect(() => {
    let i = 0;
    const timer = setTimeout(() => {
      setBooted(true);
      const interval = setInterval(() => {
        if (i < bootLines.length) {
          setBootText((prev) => [...prev, bootLines[i]]);
          i++;
        } else {
          clearInterval(interval);
          setTimeout(() => setShowHint(true), 300);
        }
      }, i === 0 ? 400 : 220);
      return () => clearInterval(interval);
    }, 700);
    return () => clearTimeout(timer);
  }, []);

  // GSAP cursor-following spotlight
  useEffect(() => {
    const scene = sceneRef.current;
    const spotlight = spotlightRef.current;
    if (!scene || !spotlight) return;

    const handleMove = (e: MouseEvent) => {
      const rect = scene.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      gsap.to(spotlight, {
        x: x - 150,
        y: y - 150,
        duration: 0.4,
        ease: 'power2.out',
      });
    };

    scene.addEventListener('mousemove', handleMove);
    return () => scene.removeEventListener('mousemove', handleMove);
  }, []);

  // GSAP tower fans & LED animation with idle detection
  useEffect(() => {
    const led = towerLedRef.current;
    const fans = fanRefs.current.filter(Boolean);
    if (!fans.length) return;

    // Continuous fan rotation for all case fans
    const fanTweens = fans.map((f) =>
      gsap.to(f, {
        rotation: 360,
        duration: 2.2,
        repeat: -1,
        ease: 'none',
      })
    );

    // LED pulsing
    let ledTimeline: gsap.core.Timeline | null = null;
    if (led) {
      ledTimeline = gsap.timeline({ repeat: -1 });
      ledTimeline
        .to(led, { opacity: 1, duration: 1.2, ease: 'sine.inOut' })
        .to(led, { opacity: 0.3, duration: 1.2, ease: 'sine.inOut' });
    }

    // Idle-time animation: spin up fans when user is idle
    let idleTimer: ReturnType<typeof setTimeout>;
    const resetIdle = () => {
      fanTweens.forEach((tw) => gsap.to(tw, { timeScale: 1, duration: 0.6 }));
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => {
        fanTweens.forEach((tw) => gsap.to(tw, { timeScale: 2.4, duration: 1 }));
      }, 2500);
    };

    window.addEventListener('mousemove', resetIdle);
    resetIdle();

    return () => {
      fanTweens.forEach((tw) => tw.kill());
      ledTimeline?.kill();
      clearTimeout(idleTimer);
      window.removeEventListener('mousemove', resetIdle);
    };
  }, []);

  return (
    <motion.div
      className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-[#030405]"
      initial={{ opacity: 1, scale: 0.96 }}
      animate={{
        opacity: isTerminalActive ? 0 : 1,
        scale: isTerminalActive ? 1.06 : 1,
      }}
      transition={{ duration: 0.6, ease: [0.7, 0, 0.2, 1] }}
      style={{ pointerEvents: isTerminalActive ? 'none' : 'auto' }}
    >
      {/* Ambient background room glow matching active setup RGB */}
      <div
        className="pointer-events-none absolute inset-0 opacity-25 blur-3xl transition-all duration-1000"
        style={{
          background: 'radial-gradient(ellipse at 50% 40%, var(--setup-glow) 0%, transparent 70%)',
        }}
      />

      {/* Top HUD Action Bar on Desk */}
      <div className="fixed top-4 right-4 z-30 flex items-center gap-2 font-mono">
        {onOpenResumePdf && (
          <button
            onClick={onOpenResumePdf}
            className="flex items-center gap-1.5 rounded-full border border-accent/40 bg-[#0a0c10]/90 px-3.5 py-1.5 text-xs font-semibold text-accent shadow-[0_0_12px_var(--setup-glow)] backdrop-blur-md hover:bg-accent hover:text-black transition-all active:scale-95"
            title="Open printable & downloadable resume"
          >
            <span>📄</span>
            <span>Resume PDF</span>
          </button>
        )}

        {onOpenPhone && (
          <button
            onClick={onOpenPhone}
            className="flex items-center gap-1.5 rounded-full border border-white/15 bg-[#0a0c10]/80 px-3 py-1.5 text-xs text-text-dim backdrop-blur-md hover:border-accent hover:text-accent transition-all active:scale-95"
            title="Open Smartphone Contact"
          >
            <span>📱</span>
            <span className="hidden sm:inline">Phone</span>
          </button>
        )}
      </div>

      <div
        ref={sceneRef}
        className="relative cursor-pointer select-none max-w-full max-h-full transition-transform duration-300"
        style={{
          width: 'min(78vw, calc(75vh * (1376 / 768)))',
          height: 'min(75vh, calc(78vw * (768 / 1376)))',
          aspectRatio: '1376 / 768',
        }}
      >
        {/* Ambient behind-monitor wall bias lighting */}
        <div
          className="pointer-events-none absolute rounded-full blur-2xl opacity-45 transition-all duration-700"
          style={{
            left: '30%',
            top: '8%',
            width: '24%',
            height: '45%',
            background: 'radial-gradient(circle, var(--color-accent) 0%, transparent 75%)',
          }}
        />

        {/* Cursor-following spotlight */}
        <div
          ref={spotlightRef}
          className="pointer-events-none absolute z-10 h-[300px] w-[300px] rounded-full opacity-0 transition-opacity duration-700"
          style={{
            background: 'radial-gradient(circle, var(--setup-glow) 0%, transparent 70%)',
            opacity: booted ? 0.75 : 0,
          }}
        />

        {/* Desk Base Image with enlarged platform and native phone/clock illustrations */}
        <img
          src="/desk.png"
          alt="AI/ML Engineer desk setup"
          className="absolute inset-0 h-full w-full object-contain transition-all duration-700"
          style={{
            filter: booted
              ? 'brightness(1) saturate(1.15) hue-rotate(var(--setup-hue-rotate, 0deg))'
              : 'brightness(0.55) saturate(0.7)',
          }}
        />

        {/* ─── INTERACTIVE DESK CLOCK OVERLAY ─── */}
        <DeskClockModel />

        {/* ─── INTERACTIVE SMARTPHONE OVERLAY ─── */}
        {onOpenPhone && <DeskPhoneModel onClick={onOpenPhone} />}

        {/* Screen overlay with boot text & shared layoutId for screen expansion */}
        {!isTerminalActive && (
          <motion.div
            layoutId="screen"
            className="absolute overflow-hidden rounded-[4px] bg-[#05070a] font-mono z-20 transition-all duration-500"
            style={{
              left: '36.5%',
              top: '16.2%',
              width: '15.5%',
              height: '24%',
              padding: '1.2% 1.5%',
              fontSize: 'clamp(6.5px, 0.78vw, 10.5px)',
              lineHeight: 1.45,
              opacity: booted ? 1 : 0,
              boxShadow: 'inset 0 0 10px rgba(0,0,0,0.8), 0 0 18px var(--setup-glow)',
            }}
            onClick={onEnterTerminal}
            transition={{
              type: 'spring',
              stiffness: 260,
              damping: 26,
            }}
          >
            {bootText.map((line, i) => (
              <div
                key={i}
                className="whitespace-pre-wrap text-text-dim animate-fade-in"
                style={{
                  textShadow: '0 0 6px var(--setup-glow)',
                  animationDelay: `${i * 0.08}s`,
                }}
              >
                {line}
              </div>
            ))}
          </motion.div>
        )}

        {/* Kreo Swarm 75 Keyboard RGB Underglow Projection on Desk Mat */}
        <div
          className="pointer-events-none absolute rounded-lg blur-md opacity-80 transition-all duration-700 z-10"
          style={{
            left: '40.5%',
            top: '52%',
            width: '19%',
            height: '17%',
            background: 'radial-gradient(ellipse at center, var(--setup-glow) 0%, transparent 80%)',
            boxShadow: '0 0 18px var(--setup-glow)',
          }}
        />

        {/* Logitech G304 Mousepad Ambient Reflection */}
        <div
          className="pointer-events-none absolute rounded-full blur-sm opacity-65 transition-all duration-700 z-10"
          style={{
            left: '58.8%',
            top: '50%',
            width: '5.5%',
            height: '8%',
            background: 'radial-gradient(circle, var(--setup-glow) 0%, transparent 75%)',
          }}
        />

        {/* PC Tower Chassis Internal Chamber RGB Glow */}
        <div
          className="pointer-events-none absolute rounded blur-sm opacity-50 transition-all duration-700 z-10"
          style={{
            left: '54.5%',
            top: '18%',
            width: '13%',
            height: '28%',
            background: 'linear-gradient(135deg, var(--setup-glow) 0%, transparent 80%)',
          }}
        />

        {/* ─── PC Tower Fans Overlays ─── */}
        {/* Fan 1 (Top Front Intake) */}
        <div
          ref={(el) => { fanRefs.current[0] = el; }}
          className="pointer-events-none absolute rounded-full border border-accent/40 opacity-85 z-20"
          style={{
            left: '66.8%',
            top: '28.5%',
            width: '20px',
            height: '20px',
            boxShadow: '0 0 10px var(--setup-glow), inset 0 0 5px var(--setup-glow)',
            background:
              'conic-gradient(from 0deg, var(--color-accent) 0deg, transparent 90deg, var(--color-accent-secondary, #ffb454) 180deg, transparent 270deg, var(--color-accent) 360deg)',
          }}
        >
          <div className="absolute inset-[30%] rounded-full bg-[#0a0c10] border border-accent/50" />
        </div>

        {/* Fan 2 (Mid Front Intake) */}
        <div
          ref={(el) => { fanRefs.current[1] = el; }}
          className="pointer-events-none absolute rounded-full border border-accent/40 opacity-85 z-20"
          style={{
            left: '66.8%',
            top: '35.8%',
            width: '20px',
            height: '20px',
            boxShadow: '0 0 10px var(--setup-glow), inset 0 0 5px var(--setup-glow)',
            background:
              'conic-gradient(from 0deg, var(--color-accent) 0deg, transparent 90deg, var(--color-accent-secondary, #ffb454) 180deg, transparent 270deg, var(--color-accent) 360deg)',
          }}
        >
          <div className="absolute inset-[30%] rounded-full bg-[#0a0c10] border border-accent/50" />
        </div>

        {/* Fan 3 (Bot Front Intake) */}
        <div
          ref={(el) => { fanRefs.current[2] = el; }}
          className="pointer-events-none absolute rounded-full border border-accent/40 opacity-85 z-20"
          style={{
            left: '66.8%',
            top: '42.8%',
            width: '20px',
            height: '20px',
            boxShadow: '0 0 10px var(--setup-glow), inset 0 0 5px var(--setup-glow)',
            background:
              'conic-gradient(from 0deg, var(--color-accent) 0deg, transparent 90deg, var(--color-accent-secondary, #ffb454) 180deg, transparent 270deg, var(--color-accent) 360deg)',
          }}
        >
          <div className="absolute inset-[30%] rounded-full bg-[#0a0c10] border border-accent/50" />
        </div>

        {/* Fan 4 (Rear Exhaust) */}
        <div
          ref={(el) => { fanRefs.current[3] = el; }}
          className="pointer-events-none absolute rounded-full border border-accent/35 opacity-75 z-20"
          style={{
            left: '55.6%',
            top: '20.6%',
            width: '18px',
            height: '18px',
            boxShadow: '0 0 8px var(--setup-glow)',
            background:
              'conic-gradient(from 0deg, var(--color-accent) 0deg, transparent 90deg, var(--color-accent) 360deg)',
          }}
        >
          <div className="absolute inset-[30%] rounded-full bg-[#0a0c10]" />
        </div>

        {/* Tower Power LED */}
        <div
          ref={towerLedRef}
          className="absolute rounded-full bg-accent transition-colors duration-500 z-20"
          style={{
            left: '66.0%',
            top: '22.8%',
            width: '4px',
            height: '4px',
            opacity: 0.6,
            boxShadow: '0 0 8px var(--setup-glow)',
          }}
        />

        {/* ─── HOTSPOTS (Mapped to enlarged desk objects) ─── */}
        {/* Monitor Hotspot */}
        <Hotspot
          position={{ left: '36.5%', top: '16%', width: '15.5%', height: '25%' }}
          label="Monitor — Click to enter terminal"
          onClick={onEnterTerminal}
          glowColor="var(--setup-glow)"
        >
          <StatsPopup
            label="MONITOR"
            value="Click to enter terminal →"
            isVisible={true}
            position={{ x: 105, y: 15 }}
          />
        </Hotspot>

        {/* Keyboard — Kreo Swarm 75 */}
        <Hotspot
          position={{ left: '40.5%', top: '52%', width: '19%', height: '18%' }}
          label="Mechanical keyboard"
          glowColor="var(--setup-glow)"
        >
          <StatsPopup
            label="KEYBOARD"
            value="Kreo Swarm 75 · Wireless Mech"
            isVisible={true}
            position={{ x: 50, y: -45 }}
          />
        </Hotspot>

        {/* Mouse — Logitech G304 */}
        <Hotspot
          position={{ left: '58.8%', top: '50%', width: '5.5%', height: '8.5%' }}
          label="Mouse"
          glowColor="var(--setup-glow)"
        >
          <StatsPopup
            label="MOUSE"
            value="Logitech G304 Lightspeed"
            isVisible={true}
            position={{ x: 110, y: -25 }}
          />
        </Hotspot>

        {/* Mug */}
        <Hotspot
          position={{ left: '34.2%', top: '61.5%', width: '5.2%', height: '12%' }}
          label="Coffee mug"
          glowColor="rgba(255, 180, 84, 0.18)"
        >
          <StatsPopup
            label="FUEL"
            value="☕ Black coffee · 3 cups/day"
            isVisible={true}
            position={{ x: -20, y: -40 }}
          />
        </Hotspot>

        {/* Plant */}
        <Hotspot
          position={{ left: '25.2%', top: '56.5%', width: '5.8%', height: '11%' }}
          label="Plant"
          glowColor="rgba(100, 220, 100, 0.18)"
        >
          <StatsPopup
            label="PLANT"
            value="🌿 Still alive (somehow)"
            isVisible={true}
            position={{ x: -20, y: -40 }}
          />
        </Hotspot>

        {/* PC Tower */}
        <Hotspot
          position={{ left: '53.5%', top: '11%', width: '16.5%', height: '38%' }}
          label="PC Tower"
          glowColor="var(--setup-glow)"
        >
          <StatsPopup
            label="WORKSTATION"
            value="RTX 4050 · 16GB RAM · Arch Linux"
            isVisible={true}
            position={{ x: -70, y: 15 }}
          />
        </Hotspot>

      </div>

      {/* Hint (Desktop) */}
      <motion.div
        className="absolute inset-x-0 bottom-5 text-center text-[13px] tracking-wider text-text-dim hidden sm:block z-20 pointer-events-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: showHint ? 1 : 0 }}
        transition={{ duration: 0.8 }}
      >
        click the monitor to{' '}
        <span className="text-accent font-semibold cursor-pointer hover:underline" onClick={onEnterTerminal}>
          jump into terminal →
        </span>
      </motion.div>

      {/* Mobile Action Bar & Hardware Specs (Mobile only) */}
      <div className="mt-3 sm:hidden flex flex-col items-center gap-2.5 w-full max-w-[320px] px-3 z-30">
        <button
          onClick={onEnterTerminal}
          className="w-full flex items-center justify-center gap-2 rounded-xl border border-accent/40 bg-accent/15 py-2.5 px-4 font-mono text-xs font-semibold tracking-wider text-accent shadow-[0_0_15px_var(--setup-glow)] active:scale-95 transition-all"
        >
          <span>ENTER TERMINAL</span>
          <span>→</span>
        </button>
        <div className="flex flex-wrap items-center justify-center gap-1.5 text-[10px] text-text-dim">
          <span className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-0.5">🖱️ G304</span>
          <span className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-0.5">⌨️ Swarm 75</span>
          <span className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-0.5">🖥️ RTX 4050</span>
        </div>
      </div>
    </motion.div>
  );
}
