'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { soundManager } from '@/lib/sounds';

interface Point {
  x: number;
  y: number;
}

const WIDTH = 20;
const HEIGHT = 14;

export default function TerminalSnake({ onExit }: { onExit: () => void }) {
  const [snake, setSnake] = useState<Point[]>([
    { x: 10, y: 7 },
    { x: 9, y: 7 },
    { x: 8, y: 7 },
  ]);
  const [food, setFood] = useState<Point>({ x: 15, y: 7 });
  const [dir, setDir] = useState<Point>({ x: 1, y: 0 });
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const dirRef = useRef(dir);
  dirRef.current = dir;

  // Load highscore
  useEffect(() => {
    try {
      const saved = localStorage.getItem('portfolio_snake_highscore');
      if (saved) setHighScore(parseInt(saved, 10));
    } catch {
      // ignore
    }
  }, []);

  const spawnFood = useCallback((currentSnake: Point[]): Point => {
    let newFood: Point;
    let collision = true;
    while (collision) {
      newFood = {
        x: Math.floor(Math.random() * WIDTH),
        y: Math.floor(Math.random() * HEIGHT),
      };
      // eslint-disable-next-line @typescript-eslint/no-loop-func
      collision = currentSnake.some((segment) => segment.x === newFood.x && segment.y === newFood.y);
    }
    return newFood!;
  }, []);

  const resetGame = () => {
    const initialSnake = [
      { x: 10, y: 7 },
      { x: 9, y: 7 },
      { x: 8, y: 7 },
    ];
    setSnake(initialSnake);
    setDir({ x: 1, y: 0 });
    setScore(0);
    setGameOver(false);
    setIsPaused(false);
    setFood(spawnFood(initialSnake));
    soundManager.playBootBeep();
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'q' || e.key === 'Q') {
        e.preventDefault();
        onExit();
        return;
      }

      if (e.key === ' ' || e.key === 'p' || e.key === 'P') {
        e.preventDefault();
        setIsPaused((p) => !p);
        return;
      }

      if (gameOver && (e.key === 'r' || e.key === 'R' || e.key === 'Enter')) {
        e.preventDefault();
        resetGame();
        return;
      }

      const current = dirRef.current;
      if ((e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') && current.y === 0) {
        e.preventDefault();
        setDir({ x: 0, y: -1 });
      } else if ((e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') && current.y === 0) {
        e.preventDefault();
        setDir({ x: 0, y: 1 });
      } else if ((e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') && current.x === 0) {
        e.preventDefault();
        setDir({ x: -1, y: 0 });
      } else if ((e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') && current.x === 0) {
        e.preventDefault();
        setDir({ x: 1, y: 0 });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameOver, onExit, spawnFood]);

  // Game loop
  useEffect(() => {
    if (gameOver || isPaused) return;

    const interval = setInterval(() => {
      setSnake((prevSnake) => {
        const head = prevSnake[0];
        const newHead = {
          x: head.x + dirRef.current.x,
          y: head.y + dirRef.current.y,
        };

        // Wall collision
        if (newHead.x < 0 || newHead.x >= WIDTH || newHead.y < 0 || newHead.y >= HEIGHT) {
          setGameOver(true);
          soundManager.playErrorBuzz();
          return prevSnake;
        }

        // Self collision
        if (prevSnake.some((seg) => seg.x === newHead.x && seg.y === newHead.y)) {
          setGameOver(true);
          soundManager.playErrorBuzz();
          return prevSnake;
        }

        // Check food collision
        const ateFood = newHead.x === food.x && newHead.y === food.y;
        if (ateFood) {
          soundManager.playBootBeep();
          setScore((s) => {
            const next = s + 10;
            if (next > highScore) {
              setHighScore(next);
              try {
                localStorage.setItem('portfolio_snake_highscore', next.toString());
              } catch {
                // ignore
              }
            }
            return next;
          });
          setFood(spawnFood([newHead, ...prevSnake]));
          return [newHead, ...prevSnake];
        }

        return [newHead, ...prevSnake.slice(0, -1)];
      });
    }, 110);

    return () => clearInterval(interval);
  }, [gameOver, isPaused, food, highScore, spawnFood]);

  return (
    <div className="my-3 max-w-md rounded-xl border border-accent/40 bg-[#07090e] p-3 font-mono shadow-[0_0_20px_var(--setup-glow)]">
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-white/10 pb-2 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-bold text-accent">🐍 NEURAL_SNAKE.EXE</span>
          <span className="text-text-dim text-[11px]">| Controls: WASD / Arrows</span>
        </div>
        <button
          onClick={onExit}
          className="rounded border border-white/10 px-2 py-0.5 text-[10px] text-text-dim hover:border-red-400 hover:text-red-400"
        >
          [Q] Exit
        </button>
      </div>

      {/* Score bar */}
      <div className="flex justify-between py-1.5 text-xs">
        <div>
          SCORE: <span className="font-bold text-accent">{score}</span>
        </div>
        <div>
          HIGH: <span className="font-bold text-yellow-400">{highScore}</span>
        </div>
      </div>

      {/* Game board */}
      <div
        className="relative mx-auto rounded border border-white/10 bg-black/60 p-1"
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${WIDTH}, minmax(0, 1fr))`,
          aspectRatio: `${WIDTH} / ${HEIGHT}`,
          width: '100%',
        }}
      >
        {Array.from({ length: HEIGHT }).map((_, y) =>
          Array.from({ length: WIDTH }).map((__, x) => {
            const isHead = snake[0].x === x && snake[0].y === y;
            const isBody = !isHead && snake.some((seg) => seg.x === x && seg.y === y);
            const isFood = food.x === x && food.y === y;

            return (
              <div
                key={`${x}-${y}`}
                className="flex items-center justify-center text-[10px]"
                style={{
                  backgroundColor: isHead
                    ? 'var(--color-accent)'
                    : isBody
                    ? 'rgba(71, 240, 214, 0.45)'
                    : isFood
                    ? 'rgba(239, 68, 68, 0.9)'
                    : 'transparent',
                  borderRadius: isFood || isHead ? '2px' : '0px',
                  boxShadow: isHead
                    ? '0 0 6px var(--color-accent)'
                    : isFood
                    ? '0 0 6px #ef4444'
                    : 'none',
                }}
              />
            );
          })
        )}

        {/* Game over modal overlay */}
        {gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/85 backdrop-blur-xs text-center p-3">
            <div className="text-red-500 font-bold text-base tracking-wider animate-pulse">
              GAME OVER
            </div>
            <div className="text-xs text-text-dim mt-1">Final Score: {score}</div>
            <div className="mt-3 flex gap-2">
              <button
                onClick={resetGame}
                className="rounded border border-accent/50 bg-accent/20 px-3 py-1 text-xs font-bold text-accent hover:bg-accent hover:text-black transition-colors"
              >
                [R] Play Again
              </button>
              <button
                onClick={onExit}
                className="rounded border border-white/20 bg-white/5 px-3 py-1 text-xs text-text-dim hover:text-white transition-colors"
              >
                [ESC] Return
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="mt-2 text-[10px] text-text-dim flex justify-between">
        <span>SPACE: {isPaused ? 'Resume' : 'Pause'}</span>
        <span>Eat red tokens to train weights</span>
      </div>
    </div>
  );
}
