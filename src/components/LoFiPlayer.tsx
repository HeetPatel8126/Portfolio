'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { lofiSynth, TrackInfo, TRACKS } from '@/lib/lofiAudio';

export default function LoFiPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<TrackInfo>(TRACKS[0]);
  const [isExpanded, setIsExpanded] = useState(true);

  useEffect(() => {
    const unsub = lofiSynth.subscribe((playing, track) => {
      setIsPlaying(playing);
      setCurrentTrack(track);
    });
    return unsub;
  }, []);

  return (
    <div className="fixed bottom-4 left-4 z-30 font-mono select-none">
      <AnimatePresence mode="wait">
        {isExpanded ? (
          <motion.div
            key="expanded"
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            className="group relative flex flex-col gap-2 rounded-xl border border-white/15 bg-[#0a0c10]/90 p-3 backdrop-blur-md shadow-[0_4px_24px_rgba(0,0,0,0.6)] w-[270px] sm:w-[290px]"
            style={{
              borderColor: isPlaying ? 'var(--color-accent)' : 'rgba(255,255,255,0.15)',
              boxShadow: isPlaying ? '0 0 20px var(--setup-glow)' : 'none',
            }}
          >
            {/* Header: Label & Minimize */}
            <div className="flex items-center justify-between border-b border-white/10 pb-1.5 text-[11px] text-text-dim">
              <span className="flex items-center gap-1.5 font-semibold text-accent">
                <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
                <span>LO-FI RADIO</span>
              </span>
              <button
                onClick={() => setIsExpanded(false)}
                className="hover:text-text px-1 text-xs transition-colors"
                title="Minimize player"
              >
                ─
              </button>
            </div>

            {/* Track Info & Visualizer */}
            <div className="flex items-center justify-between gap-3 pt-0.5">
              <div className="min-w-0 flex-1">
                <div className="truncate text-xs font-bold text-text">
                  {currentTrack.title}
                </div>
                <div className="text-[10px] text-text-dim flex items-center gap-2">
                  <span>{currentTrack.genre}</span>
                  <span>•</span>
                  <span>{currentTrack.bpm} BPM</span>
                </div>
              </div>

              {/* Animated Spectrum Bars */}
              <div className="flex items-end gap-1 h-5 w-8 shrink-0">
                {[0.6, 1.2, 0.8, 1.5, 0.9].map((speed, i) => (
                  <motion.div
                    key={i}
                    className="w-1 rounded-t bg-accent"
                    animate={{
                      height: isPlaying ? ['20%', '100%', '40%', '80%', '20%'] : '20%',
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 0.7 * speed,
                      ease: 'easeInOut',
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => lofiSynth.prevTrack()}
                  className="rounded border border-white/10 bg-white/[0.04] px-2 py-1 text-[11px] text-text-dim hover:border-accent hover:text-accent transition-all active:scale-95"
                  title="Previous track"
                >
                  ⏮
                </button>
                <button
                  onClick={() => lofiSynth.togglePlay()}
                  className="flex items-center gap-1.5 rounded-md border border-accent/40 bg-accent/15 px-3 py-1 text-xs font-bold text-accent shadow-[0_0_10px_var(--setup-glow)] hover:bg-accent hover:text-black transition-all active:scale-95"
                  title={isPlaying ? 'Pause music' : 'Play lo-fi stream'}
                >
                  <span>{isPlaying ? '⏸ PAUSE' : '▶ PLAY'}</span>
                </button>
                <button
                  onClick={() => lofiSynth.nextTrack()}
                  className="rounded border border-white/10 bg-white/[0.04] px-2 py-1 text-[11px] text-text-dim hover:border-accent hover:text-accent transition-all active:scale-95"
                  title="Next track"
                >
                  ⏭
                </button>
              </div>

              <div className="text-[9px] uppercase tracking-wider text-text-dim">
                SYNTH-DSP
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.button
            key="collapsed"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => setIsExpanded(true)}
            className="flex items-center gap-2 rounded-full border border-white/15 bg-[#0a0c10]/90 px-3 py-2 text-xs font-semibold backdrop-blur-md hover:border-accent hover:text-accent transition-all shadow-[0_4px_16px_rgba(0,0,0,0.5)]"
            style={{
              borderColor: isPlaying ? 'var(--color-accent)' : 'rgba(255,255,255,0.15)',
              color: isPlaying ? 'var(--color-accent)' : '#9ca3af',
            }}
          >
            <span>{isPlaying ? '🎵' : '📻'}</span>
            <span className="hidden sm:inline">Lo-Fi Radio</span>
            {isPlaying && (
              <span className="flex items-center gap-0.5 h-3">
                <span className="h-2 w-0.5 bg-accent animate-pulse" />
                <span className="h-3 w-0.5 bg-accent animate-pulse delay-75" />
                <span className="h-1.5 w-0.5 bg-accent animate-pulse delay-150" />
              </span>
            )}
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
