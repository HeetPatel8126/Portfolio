'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSpotifyStore, SPOTIFY_PLAYLISTS } from '@/lib/spotify';

export default function SpotifyPlayer() {
  const currentPlaylistIndex = useSpotifyStore((s) => s.currentPlaylistIndex);
  const isExpanded = useSpotifyStore((s) => s.isExpanded);
  const isOpenEmbed = useSpotifyStore((s) => s.isOpenEmbed);
  const nextPlaylist = useSpotifyStore((s) => s.nextPlaylist);
  const prevPlaylist = useSpotifyStore((s) => s.prevPlaylist);
  const toggleExpanded = useSpotifyStore((s) => s.toggleExpanded);
  const toggleEmbed = useSpotifyStore((s) => s.toggleEmbed);

  const playlist = SPOTIFY_PLAYLISTS[currentPlaylistIndex];

  return (
    <>
      {/* Floating Spotify Dock Widget (Bottom-Left) */}
      <div className="fixed bottom-4 left-4 z-30 font-mono select-none">
        <AnimatePresence mode="wait">
          {isExpanded ? (
            <motion.div
              key="expanded"
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 15, scale: 0.95 }}
              className="group relative flex flex-col gap-2 rounded-xl border border-white/15 bg-[#0a0c10]/95 p-3 backdrop-blur-md shadow-[0_4px_24px_rgba(0,0,0,0.7)] w-[280px] sm:w-[310px]"
              style={{
                borderColor: isOpenEmbed ? '#1DB954' : 'rgba(255,255,255,0.15)',
                boxShadow: isOpenEmbed ? '0 0 20px rgba(29, 185, 84, 0.4)' : 'none',
              }}
            >
              {/* Header: Spotify Brand & Minimize */}
              <div className="flex items-center justify-between border-b border-white/10 pb-1.5 text-[11px] text-text-dim">
                <span className="flex items-center gap-1.5 font-bold text-[#1DB954]">
                  <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.49 17.306a.753.753 0 0 1-1.036.248c-2.834-1.732-6.402-2.124-10.605-1.164a.752.752 0 1 1-.336-1.465c4.604-1.053 8.547-.604 11.729 1.345.367.225.485.706.248 1.036zm1.463-3.255a.94.94 0 0 1-1.296.31c-3.243-1.993-8.188-2.57-12.023-1.405a.94.94 0 0 1-.555-1.794c4.385-1.332 9.824-.69 13.564 1.593.433.266.568.83.31 1.296zm.125-3.39c-3.89-2.31-10.306-2.523-14.025-1.394a1.127 1.127 0 1 1-.65-2.158c4.275-1.298 11.354-1.047 15.82 1.605a1.127 1.127 0 1 1-1.145 1.947z" />
                  </svg>
                  <span>SPOTIFY PLAYER</span>
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={toggleEmbed}
                    className="hover:text-white px-1.5 py-0.5 rounded text-[10px] text-text-dim border border-white/10 hover:border-[#1DB954] transition-colors"
                    title={isOpenEmbed ? 'Hide embed player' : 'Show Spotify embed player'}
                  >
                    {isOpenEmbed ? 'Hide' : 'Player'}
                  </button>
                  <button
                    onClick={toggleExpanded}
                    className="hover:text-text px-1 text-xs transition-colors"
                    title="Minimize"
                  >
                    ─
                  </button>
                </div>
              </div>

              {/* Playlist info */}
              <div className="flex items-center justify-between gap-2.5 pt-0.5">
                <div className="min-w-0 flex-1">
                  <div className="truncate text-xs font-bold text-white">
                    {playlist.name}
                  </div>
                  <div className="text-[10px] text-text-dim truncate">
                    {playlist.genre}
                  </div>
                </div>

                {/* Animated Spotify Equalizer */}
                <div className="flex items-end gap-1 h-5 w-7 shrink-0">
                  {[0.7, 1.3, 0.9, 1.4].map((speed, i) => (
                    <motion.div
                      key={i}
                      className="w-1 rounded-t bg-[#1DB954]"
                      animate={{
                        height: ['20%', '100%', '40%', '85%', '20%'],
                      }}
                      transition={{
                        repeat: Infinity,
                        duration: 0.8 * speed,
                        ease: 'easeInOut',
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={prevPlaylist}
                    className="rounded border border-white/10 bg-white/[0.04] px-2 py-1 text-[11px] text-text-dim hover:border-[#1DB954] hover:text-[#1DB954] transition-all active:scale-95"
                    title="Previous playlist"
                  >
                    ⏮
                  </button>

                  <button
                    onClick={toggleEmbed}
                    className="flex items-center gap-1 rounded-md border border-[#1DB954]/50 bg-[#1DB954]/15 px-2.5 py-1 text-[11px] font-bold text-[#1DB954] shadow-[0_0_10px_rgba(29,185,84,0.3)] hover:bg-[#1DB954] hover:text-black transition-all active:scale-95"
                  >
                    <span>{isOpenEmbed ? '⏹ CLOSE' : '▶ EMBED'}</span>
                  </button>

                  <button
                    onClick={nextPlaylist}
                    className="rounded border border-white/10 bg-white/[0.04] px-2 py-1 text-[11px] text-text-dim hover:border-[#1DB954] hover:text-[#1DB954] transition-all active:scale-95"
                    title="Next playlist"
                  >
                    ⏭
                  </button>
                </div>

                <a
                  href={`https://open.spotify.com/playlist/${playlist.id === 'synthwave' ? '37i9dQZF1DXdLEN7aqioXM' : playlist.id === 'lofi' ? '37i9dQZF1DXcBWIGoYBM5M' : playlist.id === 'focus' ? '37i9dQZF1DX4sWSpwq3LiO' : '37i9dQZF1DX8Uebhn9wzrS'}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] text-[#1DB954] hover:underline flex items-center gap-0.5"
                  title="Open playlist directly in Spotify app"
                >
                  <span>Open</span>
                  <span>↗</span>
                </a>
              </div>
            </motion.div>
          ) : (
            <motion.button
              key="collapsed"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={toggleExpanded}
              className="flex items-center gap-2 rounded-full border border-white/15 bg-[#0a0c10]/95 px-3 py-2 text-xs font-semibold backdrop-blur-md hover:border-[#1DB954] hover:text-[#1DB954] transition-all shadow-[0_4px_16px_rgba(0,0,0,0.6)]"
              style={{
                color: '#1DB954',
                borderColor: 'rgba(29, 185, 84, 0.4)',
              }}
            >
              <svg className="h-4 w-4 fill-[#1DB954]" viewBox="0 0 24 24">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.49 17.306a.753.753 0 0 1-1.036.248c-2.834-1.732-6.402-2.124-10.605-1.164a.752.752 0 1 1-.336-1.465c4.604-1.053 8.547-.604 11.729 1.345.367.225.485.706.248 1.036zm1.463-3.255a.94.94 0 0 1-1.296.31c-3.243-1.993-8.188-2.57-12.023-1.405a.94.94 0 0 1-.555-1.794c4.385-1.332 9.824-.69 13.564 1.593.433.266.568.83.31 1.296zm.125-3.39c-3.89-2.31-10.306-2.523-14.025-1.394a1.127 1.127 0 1 1-.65-2.158c4.275-1.298 11.354-1.047 15.82 1.605a1.127 1.127 0 1 1-1.145 1.947z" />
              </svg>
              <span className="hidden sm:inline">Spotify</span>
              <span className="flex items-center gap-0.5 h-3">
                <span className="h-2 w-0.5 bg-[#1DB954] animate-pulse" />
                <span className="h-3 w-0.5 bg-[#1DB954] animate-pulse delay-75" />
                <span className="h-1.5 w-0.5 bg-[#1DB954] animate-pulse delay-150" />
              </span>
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Slide-out Spotify Embed Player Modal */}
      <AnimatePresence>
        {isOpenEmbed && (
          <motion.div
            initial={{ opacity: 0, x: -20, y: 20 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: -20, y: 20 }}
            className="fixed bottom-28 left-4 z-40 w-[300px] sm:w-[352px] rounded-2xl border border-[#1DB954]/40 bg-[#080a0f]/95 p-2 shadow-2xl backdrop-blur-md overflow-hidden"
          >
            <div className="flex items-center justify-between pb-2 px-1 text-xs text-text-dim">
              <span className="text-[#1DB954] font-bold text-[11px] flex items-center gap-1.5">
                <span>🎵</span>
                <span>{playlist.name}</span>
              </span>
              <button
                onClick={toggleEmbed}
                className="rounded-full bg-white/10 p-1 text-[10px] text-text-dim hover:text-white"
              >
                ✕
              </button>
            </div>

            <iframe
              src={playlist.embedUrl}
              width="100%"
              height="152"
              frameBorder="0"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              className="rounded-xl"
              title="Spotify Embed Player"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
