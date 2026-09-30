'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import DeskScene from '@/components/DeskScene';
import Terminal from '@/components/Terminal';
import MuteToggle from '@/components/MuteToggle';
import MatrixRain from '@/components/MatrixRain';
import SetupColorPicker from '@/components/SetupColorPicker';
import SpotifyPlayer from '@/components/SpotifyPlayer';
import ResumeModal from '@/components/ResumeModal';
import SmartphoneModal from '@/components/SmartphoneModal';
import { soundManager } from '@/lib/sounds';
import { useSetupThemeStore } from '@/store/setupTheme';

export default function Home() {
  const [terminalActive, setTerminalActive] = useState(false);
  const [resumePdfOpen, setResumePdfOpen] = useState(false);
  const [phoneOpen, setPhoneOpen] = useState(false);

  // Init sound manager and load saved setup lighting theme
  useEffect(() => {
    soundManager.init();
    useSetupThemeStore.getState().initTheme();
  }, []);

  const enterTerminal = () => {
    soundManager.playBootBeep();
    setTerminalActive(true);
  };

  const exitTerminal = () => {
    setTerminalActive(false);
  };

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-[#030405] font-mono">
      {/* Desk scene with responsive scaling for both desktop & mobile */}
      <DeskScene
        onEnterTerminal={enterTerminal}
        isTerminalActive={terminalActive}
        onOpenResumePdf={() => setResumePdfOpen(true)}
        onOpenPhone={() => setPhoneOpen(true)}
      />

      {/* Terminal — expands with layoutId animation */}
      <AnimatePresence>
        <Terminal
          isActive={terminalActive}
          onExit={exitTerminal}
          onOpenResumePdf={() => setResumePdfOpen(true)}
        />
      </AnimatePresence>

      {/* Spotify Player replacing Lo-Fi radio */}
      <SpotifyPlayer />

      {/* Printable & Downloadable PDF Resume Modal */}
      <ResumeModal
        isOpen={resumePdfOpen}
        onClose={() => setResumePdfOpen(false)}
      />

      {/* Interactive Smartphone Contact & Discord vCard Modal */}
      <SmartphoneModal
        isOpen={phoneOpen}
        onClose={() => setPhoneOpen(false)}
        discordUser="redninja8126"
      />

      {/* Matrix rain easter egg */}
      <MatrixRain />

      {/* Interactive Setup RGB Lighting Customizer */}
      <SetupColorPicker />

      {/* Mute toggle */}
      <MuteToggle />
    </main>
  );
}
