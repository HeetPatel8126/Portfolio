'use client';

import { create } from 'zustand';

export interface SpotifyPlaylist {
  id: string;
  name: string;
  genre: string;
  spotifyUri: string;
  embedUrl: string;
  description: string;
}

export const SPOTIFY_PLAYLISTS: SpotifyPlaylist[] = [
  {
    id: 'synthwave',
    name: 'RetroWave // Cyberpunk 2084',
    genre: 'Synthwave & Darksynth',
    spotifyUri: 'spotify:playlist:37i9dQZF1DXdLEN7aqioXM',
    embedUrl: 'https://open.spotify.com/embed/playlist/37i9dQZF1DXdLEN7aqioXM?utm_source=generator&theme=0',
    description: 'Neon synth rhythms and driving electronic bass for high-velocity coding.',
  },
  {
    id: 'lofi',
    name: 'Lo-Fi Chill Beats',
    genre: 'Lo-Fi & Downtempo',
    spotifyUri: 'spotify:playlist:37i9dQZF1DXcBWIGoYBM5M',
    embedUrl: 'https://open.spotify.com/embed/playlist/37i9dQZF1DXcBWIGoYBM5M?utm_source=generator&theme=0',
    description: 'Warm vinyl warmth and gentle chillhop beats for steady focus.',
  },
  {
    id: 'focus',
    name: 'Deep Focus & Ambient Piano',
    genre: 'Minimal & Instrumental',
    spotifyUri: 'spotify:playlist:37i9dQZF1DX4sWSpwq3LiO',
    embedUrl: 'https://open.spotify.com/embed/playlist/37i9dQZF1DX4sWSpwq3LiO?utm_source=generator&theme=0',
    description: 'Calm instrumental melodies to enter deep neural architecture flow.',
  },
  {
    id: 'ai-flow',
    name: 'Electronic Concentration',
    genre: 'Ambient Techno & IDM',
    spotifyUri: 'spotify:playlist:37i9dQZF1DX8Uebhn9wzrS',
    embedUrl: 'https://open.spotify.com/embed/playlist/37i9dQZF1DX8Uebhn9wzrS?utm_source=generator&theme=0',
    description: 'Hypnotic electronic pulses engineered for sustained programming sessions.',
  },
];

interface SpotifyStore {
  currentPlaylistIndex: number;
  isExpanded: boolean;
  isOpenEmbed: boolean;
  setPlaylistIndex: (index: number) => void;
  nextPlaylist: () => void;
  prevPlaylist: () => void;
  toggleExpanded: () => void;
  toggleEmbed: () => void;
  openEmbed: () => void;
}

export const useSpotifyStore = create<SpotifyStore>((set, get) => ({
  currentPlaylistIndex: 0,
  isExpanded: true,
  isOpenEmbed: false,

  setPlaylistIndex: (index) => set({ currentPlaylistIndex: index }),

  nextPlaylist: () => {
    const { currentPlaylistIndex } = get();
    set({
      currentPlaylistIndex: (currentPlaylistIndex + 1) % SPOTIFY_PLAYLISTS.length,
    });
  },

  prevPlaylist: () => {
    const { currentPlaylistIndex } = get();
    set({
      currentPlaylistIndex:
        (currentPlaylistIndex - 1 + SPOTIFY_PLAYLISTS.length) %
        SPOTIFY_PLAYLISTS.length,
    });
  },

  toggleExpanded: () => set((s) => ({ isExpanded: !s.isExpanded })),
  toggleEmbed: () => set((s) => ({ isOpenEmbed: !s.isOpenEmbed })),
  openEmbed: () => set({ isOpenEmbed: true }),
}));
