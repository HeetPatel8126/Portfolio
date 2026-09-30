'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useTerminalStore } from '@/store/terminal';
import { executeCommand } from '@/lib/commands';
import { soundManager } from '@/lib/sounds';
import CRTEffect from './CRTEffect';
import TerminalSnake from './TerminalSnake';
import TerminalTypingTest from './TerminalTypingTest';

interface TerminalProps {
  isActive: boolean;
  onExit: () => void;
  onOpenResumePdf?: () => void;
}

export default function Terminal({ isActive, onExit, onOpenResumePdf }: TerminalProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const [inputValue, setInputValue] = useState('');

  const history = useTerminalStore((s) => s.history);
  const isBooted = useTerminalStore((s) => s.isBooted);
  const boot = useTerminalStore((s) => s.boot);
  const addOutput = useTerminalStore((s) => s.addOutput);
  const navigateHistory = useTerminalStore((s) => s.navigateHistory);
  const resetHistoryIndex = useTerminalStore((s) => s.resetHistoryIndex);
  const tabComplete = useTerminalStore((s) => s.tabComplete);
  const soundEnabled = useTerminalStore((s) => s.soundEnabled);
  const activeGame = useTerminalStore((s) => s.activeGame);
  const setActiveGame = useTerminalStore((s) => s.setActiveGame);

  // Auto-focus input when terminal becomes active and no game is running
  useEffect(() => {
    if (isActive && !activeGame) {
      const timer = setTimeout(() => inputRef.current?.focus(), 150);
      if (!isBooted) {
        addOutput([
          {
            text: 'Welcome to the terminal. Type <span class="text-accent font-semibold">help</span> for available commands.',
            className: 'dim',
          },
          { text: '' },
        ]);
        boot();
        soundManager.playBootBeep();
      }
      return () => clearTimeout(timer);
    }
  }, [isActive, isBooted, boot, addOutput, activeGame]);

  // Auto-scroll on new output
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history, activeGame]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (activeGame) return;

      if (soundEnabled) soundManager.playKeyClick(e.key);

      if (e.key === 'Enter') {
        e.preventDefault();
        executeCommand(inputValue, onExit, onOpenResumePdf);
        setInputValue('');
        resetHistoryIndex();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        const cmd = navigateHistory('up');
        setInputValue(cmd);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        const cmd = navigateHistory('down');
        setInputValue(cmd);
      } else if (e.key === 'Tab') {
        e.preventDefault();
        const completed = tabComplete(inputValue);
        setInputValue(completed);
      } else if (e.key === 'Escape') {
        onExit();
      } else if (e.key === 'l' && e.ctrlKey) {
        e.preventDefault();
        useTerminalStore.getState().clearOutput();
      }
    },
    [inputValue, onExit, onOpenResumePdf, navigateHistory, resetHistoryIndex, tabComplete, soundEnabled, activeGame]
  );

  return (
    <motion.div
      layoutId="screen"
      className="fixed inset-0 z-30 flex flex-col overflow-hidden bg-[#05070a]"
      initial={{ opacity: 0 }}
      animate={{ opacity: isActive ? 1 : 0 }}
      exit={{ opacity: 0 }}
      transition={{
        type: 'spring',
        stiffness: 260,
        damping: 26,
      }}
      style={{ pointerEvents: isActive ? 'auto' : 'none' }}
    >
      {/* CRT Effect overlay */}
      <CRTEffect />

      {/* Top action bar */}
      <div className="fixed right-3 sm:right-6 top-3 sm:top-5 z-40 flex items-center gap-2">
        {onOpenResumePdf && (
          <button
            onClick={onOpenResumePdf}
            className="flex items-center gap-1.5 rounded-full sm:rounded border border-accent/30 bg-[#0a0c10]/85 px-3 py-1.5 text-[11px] sm:text-xs tracking-wider text-accent backdrop-blur-md transition-colors hover:bg-accent/15 shadow-[0_0_10px_var(--setup-glow)]"
            title="Download / Print PDF Resume"
          >
            <span>📄</span>
            <span className="hidden sm:inline">Resume PDF</span>
          </button>
        )}

        <motion.button
          className="rounded-full sm:rounded border border-white/15 bg-[#0a0c10]/85 px-3 py-1.5 text-[11px] sm:text-xs tracking-wider text-text-dim backdrop-blur-md transition-colors hover:border-accent/40 hover:text-accent"
          onClick={onExit}
          initial={{ opacity: 0 }}
          animate={{ opacity: isActive ? 1 : 0 }}
          transition={{ delay: 0.2 }}
          title="Return to desk"
        >
          <span className="hidden sm:inline">[ ESC — back to desk ]</span>
          <span className="sm:hidden flex items-center gap-1 font-semibold text-accent">
            <span>✕</span>
            <span>Desk</span>
          </span>
        </motion.button>
      </div>

      {/* Terminal body */}
      <div
        ref={terminalRef}
        className="flex-1 overflow-y-auto pt-16 sm:pt-14 pb-4 px-3 sm:px-10 md:px-[60px] font-mono text-[12px] sm:text-[13.5px] md:text-[15px] leading-relaxed text-text break-words select-text"
        onClick={() => !activeGame && inputRef.current?.focus()}
      >
        {/* Output */}
        <div ref={outputRef}>
          {history.map((line, i) => (
            <div
              key={i}
              className={`whitespace-pre-wrap ${line.className || ''}`}
              style={{ margin: '0 0 2px' }}
              dangerouslySetInnerHTML={{ __html: line.text }}
            />
          ))}
        </div>

        {/* Embedded Mini-Games */}
        {activeGame === 'snake' && (
          <TerminalSnake onExit={() => setActiveGame(null)} />
        )}
        {activeGame === 'typing' && (
          <TerminalTypingTest onExit={() => setActiveGame(null)} />
        )}

        {/* Input row */}
        {!activeGame && (
          <div className="mt-1.5 flex items-center">
            <span className="mr-1.5 sm:mr-2 whitespace-nowrap font-bold text-accent text-xs sm:text-[13.5px]">
              guest@portfolio:~$
            </span>
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 min-w-0 border-none bg-transparent font-mono text-xs sm:text-[13.5px] text-text outline-none caret-accent"
              autoComplete="off"
              spellCheck={false}
              aria-label="Terminal input"
            />
          </div>
        )}
      </div>

      {/* Status bar */}
      <div className="flex items-center justify-between border-t border-white/10 bg-[#0a0c10] px-3 sm:px-5 py-1 text-[10px] sm:text-xs tracking-wide text-text-dim shrink-0 z-10 select-none">
        <span className="truncate mr-2">
          [ NORMAL ]&nbsp;&nbsp;guest@portfolio
        </span>
        <span className="shrink-0 flex items-center gap-2">
          <span className="hidden sm:inline text-text-dim">
            Type <span className="text-accent font-semibold">snake</span> or <span className="text-accent font-semibold">github</span>
          </span>
          <span className="text-accent flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-accent animate-ping" />
            <span>online</span>
          </span>
        </span>
      </div>
    </motion.div>
  );
}
