'use client';

import { useState, ReactNode } from 'react';

interface HotspotProps {
  position: { left: string; top: string; width: string; height: string };
  label: string;
  onClick?: () => void;
  children?: ReactNode;
  glowColor?: string;
}

export default function Hotspot({
  position,
  label,
  onClick,
  children,
  glowColor = 'rgba(71, 240, 214, 0.15)',
}: HotspotProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="absolute cursor-pointer transition-all duration-300"
      style={{
        left: position.left,
        top: position.top,
        width: position.width,
        height: position.height,
        boxShadow: hovered ? `0 0 30px ${glowColor}, inset 0 0 20px ${glowColor}` : 'none',
        borderRadius: '4px',
        border: hovered ? `1px solid ${glowColor}` : '1px solid transparent',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
      role="button"
      aria-label={label}
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick?.()}
    >
      {hovered && children}
    </div>
  );
}
