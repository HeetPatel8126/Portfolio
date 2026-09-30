'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SmartphoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  discordUser?: string;
}

export default function SmartphoneModal({
  isOpen,
  onClose,
  discordUser = 'redninja8126',
}: SmartphoneModalProps) {
  const [timeStr, setTimeStr] = useState('');
  const [copiedDiscord, setCopiedDiscord] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!isOpen) return null;

  const copyDiscord = async () => {
    try {
      await navigator.clipboard.writeText(discordUser);
      setCopiedDiscord(true);
      setTimeout(() => setCopiedDiscord(false), 2500);
    } catch {
      // fallback
      setCopiedDiscord(true);
      setTimeout(() => setCopiedDiscord(false), 2500);
    }
  };

  const downloadVCard = () => {
    const vcard = `BEGIN:VCARD
VERSION:3.0
N:Patel;Heet;;;
FN:Heet Patel
TITLE:AI/ML Engineer
EMAIL;TYPE=INTERNET,HOME:Heetpatel081206@gmail.com
X-DISCORD:${discordUser}
URL:https://github.com/HeetPatel8126
URL:https://www.linkedin.com/in/heet-patel-52139b320/
NOTE:B.Tech CSE (AI Specialization) - Parul University | Discord: @${discordUser}
END:VCARD`;

    const blob = new Blob([vcard], { type: 'text/vcard' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Heet_Patel_Contact.vcf';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, y: 100, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 80, scale: 0.9 }}
          transition={{ type: 'spring', damping: 25, stiffness: 280 }}
          className="relative flex flex-col w-[300px] sm:w-[320px] h-[580px] rounded-[42px] border-[5px] border-[#222736] bg-[#0c0f17] p-3 shadow-[0_0_40px_rgba(0,0,0,0.8),0_0_20px_var(--setup-glow)] font-mono overflow-hidden"
        >
          {/* Dynamic Island / Notch */}
          <div className="mx-auto h-5 w-24 rounded-full bg-black flex items-center justify-center z-20">
            <div className="h-2.5 w-2.5 rounded-full bg-[#151923] mr-2" />
            <div className="h-1.5 w-1.5 rounded-full bg-[#10b981] animate-pulse" />
          </div>

          {/* Status Bar */}
          <div className="flex items-center justify-between px-3 pt-1 text-[11px] text-text-dim z-20">
            <span className="font-semibold text-white">{timeStr || '9:41 AM'}</span>
            <div className="flex items-center gap-1.5 text-[10px]">
              <span>5G</span>
              <span>📶</span>
              <span>🔋 98%</span>
            </div>
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-30 rounded-full bg-white/10 p-1.5 text-xs text-text-dim hover:text-white transition-colors"
            title="Lock phone"
          >
            ✕
          </button>

          {/* Screen Content */}
          <div className="flex-1 flex flex-col justify-between pt-5 pb-4 px-2 text-center z-10 overflow-y-auto">
            {/* Contact Card Header */}
            <div>
              <div className="mx-auto relative h-20 w-20 rounded-full border-2 border-accent bg-accent/15 p-1 shadow-[0_0_15px_var(--setup-glow)] flex items-center justify-center text-3xl">
                👨‍💻
              </div>
              <h2 className="mt-2 text-lg font-bold text-white tracking-wide">
                Heet Patel
              </h2>
              <p className="text-xs text-accent">AI/ML Engineer</p>
              <p className="text-[11px] text-text-dim">Parul University (CSE - AI)</p>
            </div>

            {/* Quick Action Buttons Grid */}
            <div className="grid grid-cols-2 gap-2 my-2">
              {/* Discord Button with Copy Action */}
              <button
                onClick={copyDiscord}
                className="relative flex flex-col items-center justify-center gap-1 rounded-xl border border-[#5865F2]/40 bg-[#5865F2]/10 p-2.5 text-xs text-white hover:border-[#5865F2] hover:bg-[#5865F2]/25 transition-all active:scale-95"
                title="Click to copy Discord handle"
              >
                <span className="text-base">💬</span>
                <span className="font-semibold text-[#8ea1e1]">Discord</span>
                <span className="text-[9px] text-text-dim truncate max-w-full">
                  {copiedDiscord ? '✓ Copied!' : `@${discordUser}`}
                </span>
                {copiedDiscord && (
                  <span className="absolute -top-2 left-1/2 -translate-x-1/2 rounded bg-[#5865F2] px-1.5 py-0.5 text-[9px] font-bold text-white shadow-md animate-fade-in">
                    Copied!
                  </span>
                )}
              </button>

              {/* Email */}
              <a
                href="mailto:Heetpatel081206@gmail.com"
                className="flex flex-col items-center justify-center gap-1 rounded-xl border border-white/10 bg-white/[0.04] p-2.5 text-xs text-white hover:border-accent hover:bg-accent/10 transition-all active:scale-95"
              >
                <span className="text-base">📧</span>
                <span>Email</span>
                <span className="text-[9px] text-text-dim truncate max-w-full">Direct Send</span>
              </a>

              {/* GitHub */}
              <a
                href="https://github.com/HeetPatel8126"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center gap-1 rounded-xl border border-white/10 bg-white/[0.04] p-2.5 text-xs text-white hover:border-accent hover:bg-accent/10 transition-all active:scale-95"
              >
                <span className="text-base">🐙</span>
                <span>GitHub</span>
                <span className="text-[9px] text-text-dim">@HeetPatel8126</span>
              </a>

              {/* LinkedIn */}
              <a
                href="https://www.linkedin.com/in/heet-patel-52139b320/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center gap-1 rounded-xl border border-white/10 bg-white/[0.04] p-2.5 text-xs text-white hover:border-accent hover:bg-accent/10 transition-all active:scale-95"
              >
                <span className="text-base">💼</span>
                <span>LinkedIn</span>
                <span className="text-[9px] text-text-dim">Connect</span>
              </a>
            </div>

            {/* vCard Download Button */}
            <div className="space-y-2">
              <button
                onClick={downloadVCard}
                className="w-full flex items-center justify-center gap-2 rounded-xl border border-accent/40 bg-accent/20 py-2.5 px-3 text-xs font-bold text-accent shadow-[0_0_12px_var(--setup-glow)] hover:bg-accent hover:text-black transition-all active:scale-95"
              >
                <span>💾</span>
                <span>Save Contact (vCard)</span>
              </button>

              <div className="text-[10px] text-text-dim">
                Tap Discord to copy · Tap ✕ to close
              </div>
            </div>
          </div>

          {/* Home indicator bar */}
          <div
            onClick={onClose}
            className="mx-auto h-1 w-28 rounded-full bg-white/30 hover:bg-white cursor-pointer transition-colors mb-1"
          />
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
