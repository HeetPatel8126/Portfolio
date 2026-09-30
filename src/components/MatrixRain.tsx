'use client';

import { useState, useEffect, useCallback } from 'react';

export default function MatrixRain() {
  const [active, setActive] = useState(false);

  useEffect(() => {
    const handler = () => {
      setActive(true);
      setTimeout(() => setActive(false), 5000);
    };
    window.addEventListener('matrix-effect', handler);
    return () => window.removeEventListener('matrix-effect', handler);
  }, []);

  const canvasRef = useCallback(
    (canvas: HTMLCanvasElement | null) => {
      if (!canvas || !active) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const fontSize = 14;
      const columns = Math.floor(canvas.width / fontSize);
      const drops: number[] = new Array(columns).fill(1);
      const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEF';

      let animId: number;
      const draw = () => {
        ctx.fillStyle = 'rgba(5, 7, 10, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#47f0d6';
        ctx.font = `${fontSize}px monospace`;

        for (let i = 0; i < drops.length; i++) {
          const char = chars[Math.floor(Math.random() * chars.length)];
          ctx.fillStyle = Math.random() > 0.9 ? '#ffffff' : '#47f0d6';
          ctx.globalAlpha = 0.6 + Math.random() * 0.4;
          ctx.fillText(char, i * fontSize, drops[i] * fontSize);

          if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
          }
          drops[i]++;
        }
        ctx.globalAlpha = 1;

        if (active) animId = requestAnimationFrame(draw);
      };

      draw();
      return () => cancelAnimationFrame(animId);
    },
    [active]
  );

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[100] pointer-events-none"
      style={{ mixBlendMode: 'screen' }}
    />
  );
}
