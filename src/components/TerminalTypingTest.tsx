'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { soundManager } from '@/lib/sounds';

const CODE_SNIPPETS = [
  'loss = criterion(model(inputs), targets).backward()',
  'diffusion_step = sample_discrete_noise(t, beta_schedule)',
  'app = FastAPI(title="SyntheticDataGen", version="2.0")',
  'anomaly_scores = isolation_forest.decision_function(traffic)',
  'extractor = PageAwareParser(ocr=False, strict_privacy=True)',
  'optimizer = torch.optim.AdamW(model.parameters(), lr=3e-4)',
];

export default function TerminalTypingTest({ onExit }: { onExit: () => void }) {
  const [snippetIndex, setSnippetIndex] = useState(0);
  const targetText = CODE_SNIPPETS[snippetIndex];
  const [userInput, setUserInput] = useState('');
  const [timeLeft, setTimeLeft] = useState(30);
  const [isActive, setIsActive] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [totalCharsTyped, setTotalCharsTyped] = useState(0);
  const [correctCharsTyped, setCorrectCharsTyped] = useState(0);
  const [highWpm, setHighWpm] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('portfolio_typing_high_wpm');
      if (saved) setHighWpm(parseInt(saved, 10));
    } catch {
      // ignore
    }
    inputRef.current?.focus();
  }, []);

  // Timer countdown
  useEffect(() => {
    if (!isActive || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          setIsFinished(true);
          setIsActive(false);
          soundManager.playBootBeep();
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, timeLeft]);

  const restartTest = () => {
    setSnippetIndex((i) => (i + 1) % CODE_SNIPPETS.length);
    setUserInput('');
    setTimeLeft(30);
    setIsActive(false);
    setIsFinished(false);
    setTotalCharsTyped(0);
    setCorrectCharsTyped(0);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isFinished) return;
    if (!isActive) setIsActive(true);

    const val = e.target.value;
    setUserInput(val);
    soundManager.playKeyClick();

    // Check if current snippet completed
    if (val === targetText) {
      soundManager.playBootBeep();
      setTotalCharsTyped((t) => t + val.length + 1);
      setCorrectCharsTyped((c) => c + val.length + 1);
      setUserInput('');
      setSnippetIndex((i) => (i + 1) % CODE_SNIPPETS.length);
    }
  };

  // Compute live metrics
  const elapsedMinutes = (30 - timeLeft) / 60 || 0.001;
  const currentCorrectInSnippet = userInput
    .split('')
    .filter((ch, i) => ch === targetText[i]).length;
  const currentTotalTyped = totalCharsTyped + userInput.length;
  const currentCorrectTotal = correctCharsTyped + currentCorrectInSnippet;
  const wpm = Math.round(currentCorrectTotal / 5 / elapsedMinutes) || 0;
  const accuracy = currentTotalTyped > 0 ? Math.round((currentCorrectTotal / currentTotalTyped) * 100) : 100;

  // Save highscore on finish
  useEffect(() => {
    if (isFinished && wpm > highWpm) {
      setHighWpm(wpm);
      try {
        localStorage.setItem('portfolio_typing_high_wpm', wpm.toString());
      } catch {
        // ignore
      }
    }
  }, [isFinished, wpm, highWpm]);

  const getRank = (scoreWpm: number) => {
    if (scoreWpm >= 110) return '🚀 10x Kernel God';
    if (scoreWpm >= 85) return '⚡ Staff AI Engineer';
    if (scoreWpm >= 65) return '🔥 Senior Dev';
    if (scoreWpm >= 45) return '💻 Systems Engineer';
    return '🌱 Junior Architect';
  };

  return (
    <div className="my-3 max-w-xl rounded-xl border border-accent/40 bg-[#07090e] p-4 font-mono shadow-[0_0_20px_var(--setup-glow)]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-2 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-bold text-accent">⚡ CODE_TYPING_BENCHMARK</span>
          <span className="text-text-dim text-[11px]">| 30s ML Sprint</span>
        </div>
        <button
          onClick={onExit}
          className="rounded border border-white/10 px-2 py-0.5 text-[10px] text-text-dim hover:border-red-400 hover:text-red-400"
        >
          [ESC] Exit
        </button>
      </div>

      {/* Metrics Header */}
      <div className="flex items-center justify-between py-2 text-xs border-b border-white/5">
        <div>
          TIME: <span className={`font-bold ${timeLeft <= 5 ? 'text-red-400 animate-pulse' : 'text-accent'}`}>{timeLeft}s</span>
        </div>
        <div>
          WPM: <span className="font-bold text-amber">{wpm}</span>
        </div>
        <div>
          ACCURACY: <span className="font-bold text-emerald-400">{accuracy}%</span>
        </div>
        <div>
          RECORD: <span className="font-bold text-yellow-400">{highWpm}</span>
        </div>
      </div>

      {/* Code target view */}
      {!isFinished ? (
        <div className="mt-3 rounded border border-white/10 bg-black/60 p-3">
          <div className="text-[13px] leading-relaxed select-none mb-2 font-mono">
            {targetText.split('').map((char, index) => {
              let color = 'text-gray-500';
              if (index < userInput.length) {
                color = userInput[index] === char ? 'text-accent font-semibold' : 'text-red-400 bg-red-950/60';
              }
              return (
                <span key={index} className={color}>
                  {char}
                </span>
              );
            })}
          </div>

          <input
            ref={inputRef}
            type="text"
            value={userInput}
            onChange={handleInputChange}
            placeholder={isActive ? '' : 'Type the code snippet above to start timer...'}
            className="w-full rounded border border-accent/30 bg-white/[0.03] px-2.5 py-1.5 text-xs text-text outline-none caret-accent focus:border-accent"
            autoComplete="off"
            spellCheck={false}
          />
        </div>
      ) : (
        <div className="mt-3 rounded border border-accent/40 bg-black/80 p-4 text-center">
          <div className="text-accent font-bold text-sm tracking-wide">SPRINT COMPLETED!</div>
          <div className="mt-2 flex justify-center gap-6 text-xs">
            <div>
              <div className="text-text-dim">SPEED</div>
              <div className="text-lg font-bold text-amber">{wpm} WPM</div>
            </div>
            <div>
              <div className="text-text-dim">ACCURACY</div>
              <div className="text-lg font-bold text-emerald-400">{accuracy}%</div>
            </div>
            <div>
              <div className="text-text-dim">RANK</div>
              <div className="text-lg font-bold text-accent">{getRank(wpm)}</div>
            </div>
          </div>

          <div className="mt-4 flex justify-center gap-3">
            <button
              onClick={restartTest}
              className="rounded border border-accent/50 bg-accent/20 px-3 py-1.5 text-xs font-bold text-accent hover:bg-accent hover:text-black transition-colors"
            >
              [R] Try Again
            </button>
            <button
              onClick={onExit}
              className="rounded border border-white/20 bg-white/5 px-3 py-1.5 text-xs text-text-dim hover:text-white transition-colors"
            >
              Return to Terminal
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
