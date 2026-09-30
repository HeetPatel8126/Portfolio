'use client';

import { useTerminalStore } from '@/store/terminal';
import { soundManager } from '@/lib/sounds';
import { useSetupThemeStore, SETUP_THEMES } from '@/store/setupTheme';
import { useSpotifyStore, SPOTIFY_PLAYLISTS } from '@/lib/spotify';
import { useGuestbookStore } from '@/store/guestbook';
import { fetchGitHubData } from '@/lib/github';

const projects: Record<string, { title: string; desc: string; stack: string }> = {
  'syntheticdatagen.md': {
    title: 'SyntheticDataGen — Production-Grade Synthetic Data Generation Platform',
    desc: '• Built a full-stack platform (FastAPI, Next.js, PostgreSQL, Redis, Celery) generating up to 1M synthetic records per job across 10 locales.\n• Implemented JWT + API key authentication and containerized the stack with Docker Compose for reproducible deployment.\n• Designed an offline LLM-assisted dictionary expansion approach in place of fine-tuning, preserving a strict data-privacy guarantee.',
    stack: 'FastAPI · Next.js · PostgreSQL · Redis · Celery · Docker',
  },
  'diffusionlm.md': {
    title: 'DiffusionLM — Discrete Diffusion Language Model (Final Year Research Project)',
    desc: '• Building a discrete diffusion-based language model from scratch as an 18-month research effort, targeting an arXiv preprint and public HuggingFace release.\n• Started from first principles (Karpathy micrograd) to build up core autodiff and modeling intuition before scaling the architecture.',
    stack: 'PyTorch · Discrete Diffusion · Autodiff · NLP · HuggingFace',
  },
  'nidrs.md': {
    title: 'NIDRS — Network Intrusion Detection & Response System',
    desc: '• Built a real-time network intrusion detection system with a FastAPI backend, using an Isolation Forest model to flag anomalies in live-captured traffic (PyShark).\n• Implemented multi-stage attack-chain detection (reconnaissance → exploitation → exfiltration), alert correlation, and dynamic severity scoring to cut alert noise.\n• Built a React dashboard and REST API for live traffic stats, alerts, and IP blocking, plus attack-simulation and accuracy-benchmarking scripts.',
    stack: 'FastAPI · Isolation Forest · PyShark · React · scikit-learn',
  },
  'veridian.md': {
    title: 'Offline Intelligence Suite (Veridian) — Document Intelligence Engineer (5-person team)',
    desc: '• Owned extractor.py: page-aware PDF/DOCX/TXT extraction, cleaning, structure detection, metadata extraction, and chunking feeding a fully air-gapped Streamlit tool.\n• Built the map-reduce pipeline behind S&T research-brief summarization and a fact-lock rewriting engine that preserves dates, values, and technical terms.\n• Powered entirely by local models (Gemma, via Ollama/llama-server) — zero data leaves the machine, suited for sensitive/offline document workflows.',
    stack: 'Python · Streamlit · Gemma (Ollama/llama-server) · Map-Reduce',
  },
};

function escapeHtml(s: string): string {
  return s.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c] || c));
}

// Quest game state tracker
let questStep = 0;

export function executeCommand(
  raw: string,
  exitTerminal: () => void,
  onOpenResumePdf?: () => void,
  onOpenPhone?: () => void
): void {
  const store = useTerminalStore.getState();
  const cmd = raw.trim();

  // Echo the command
  store.addOutput([
    { text: `<span class="text-accent">guest@portfolio:~$</span> ${escapeHtml(cmd)}` },
  ]);

  if (cmd) store.pushCommand(cmd);

  const [base, ...rest] = cmd.split(' ');
  const arg = rest.join(' ').trim();

  switch (base.toLowerCase()) {
    case '':
      break;

    case 'help':
      store.addOutput([
        { text: 'Portfolio Shell v2.4 — Available Commands:', className: 'text-accent font-semibold' },
        { text: '' },
        { text: '  <span class="text-text-dim uppercase tracking-wider text-[11px] font-bold">─── Core Profile ───</span>' },
        { text: '  <span class="text-accent font-semibold">whoami</span>          short bio & background' },
        { text: '  <span class="text-accent font-semibold">whoami --verbose</span> full engineer profile' },
        { text: '  <span class="text-accent font-semibold">resume</span>          view complete resume & credentials' },
        { text: '  <span class="text-accent font-semibold">pdf</span>             open print-ready PDF resume modal' },
        { text: '  <span class="text-accent font-semibold">ls projects</span>     list engineering projects' },
        { text: '  <span class="text-accent font-semibold">cat &lt;file&gt;.md</span>    inspect detailed project architecture' },
        { text: '  <span class="text-accent font-semibold">skills</span>          languages, frameworks & AI stack' },
        { text: '  <span class="text-accent font-semibold">experience</span>      hackathons & competitive roles' },
        { text: '  <span class="text-accent font-semibold">contact</span>         direct email, phone & socials' },
        { text: '' },
        { text: '  <span class="text-text-dim uppercase tracking-wider text-[11px] font-bold">─── Interactive Games & Live Data ───</span>' },
        { text: '  <span class="text-accent font-semibold">snake</span>           play retro ASCII Snake in terminal' },
        { text: '  <span class="text-accent font-semibold">typing</span>          30-second AI & ML coding speed sprint' },
        { text: '  <span class="text-accent font-semibold">quest</span>           cyberpunk AI lab text RPG adventure' },
        { text: '  <span class="text-accent font-semibold">github</span> / <span class="text-accent font-semibold">stats</span>  fetch live GitHub stats & repo stream' },
        { text: '  <span class="text-accent font-semibold">guestbook</span>       view community visitor signatures' },
        { text: '  <span class="text-accent font-semibold">sign &lt;name&gt; &lt;msg&gt;</span> sign the visitor guestbook' },
        { text: '' },
        { text: '  <span class="text-text-dim uppercase tracking-wider text-[11px] font-bold">─── Environment & Desk Control ───</span>' },
        { text: '  <span class="text-accent font-semibold">spotify</span> / <span class="text-accent font-semibold">music</span> play & switch curated Spotify playlists' },
        { text: '  <span class="text-accent font-semibold">clock</span> / <span class="text-accent font-semibold">time</span>    display real-time IST & local time' },
        { text: '  <span class="text-accent font-semibold">phone</span>           open interactive smartphone mockup' },
        { text: '  <span class="text-accent font-semibold">neofetch</span>        hardware telemetry specs' },
        { text: '  <span class="text-accent font-semibold">theme [name]</span>    customize workstation RGB lighting' },
        { text: '  <span class="text-accent font-semibold">crt</span>             toggle retro CRT scanlines' },
        { text: '  <span class="text-accent font-semibold">matrix</span>          fullscreen digital rain cascade' },
        { text: '  <span class="text-accent font-semibold">clear</span>           clear terminal screen' },
        { text: '  <span class="text-accent font-semibold">exit</span>            back to the interactive desk' },
        { text: '' },
      ]);
      break;

    case 'resume':
      store.addOutput([
        { text: '' },
        { text: '<div class="rounded-xl border border-white/15 bg-white/[0.02] p-4 max-w-2xl font-mono text-xs sm:text-sm space-y-4">' },
        { text: '  <div class="border-b border-white/15 pb-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">' },
        { text: '    <div>' },
        { text: '      <div class="text-accent font-bold text-lg sm:text-xl tracking-wider">HEET PATEL</div>' },
        { text: '      <div class="text-text-dim text-xs mt-1 flex flex-wrap gap-x-3 gap-y-1">' },
        { text: '        <span>📧 <a href="mailto:Heetpatel081206@gmail.com" class="text-amber hover:underline">Heetpatel081206@gmail.com</a></span>' },
        { text: '        <span>💬 <span class="text-amber font-semibold">Discord: @redninja8126</span></span>' },
        { text: '        <span>🐙 <a href="https://github.com/HeetPatel8126" target="_blank" rel="noopener noreferrer" class="text-amber hover:underline">github.com/HeetPatel8126</a></span>' },
        { text: '      </div>' },
        { text: '    </div>' },
        { text: '  </div>' },
        { text: '  <div>' },
        { text: '    <div class="text-accent font-bold uppercase tracking-wider mb-1.5 flex items-center gap-2"><span>🎓</span><span>EDUCATION</span></div>' },
        { text: '    <div class="text-text font-semibold">Parul University, Faculty of Engineering & Technology</div>' },
        { text: '    <div class="text-text-dim text-xs">B.Tech in Computer Science & Engineering (AI Specialization) — CGPA: <span class="text-accent font-semibold">7.63/10</span> | Expected 2028</div>' },
        { text: '  </div>' },
        { text: '  <div>' },
        { text: '    <div class="text-accent font-bold uppercase tracking-wider mb-1.5 flex items-center gap-2"><span>🛠️</span><span>TECHNICAL SKILLS</span></div>' },
        { text: '    <div class="space-y-1 text-xs">' },
        { text: '      <div><span class="text-accent font-semibold">Languages:</span> Python, JavaScript, SQL</div>' },
        { text: '      <div><span class="text-accent font-semibold">Core Stack:</span> PyTorch, FastAPI, HuggingFace, PostgreSQL, Redis, Celery</div>' },
        { text: '      <div><span class="text-accent font-semibold">Also Working With:</span> Docker, scikit-learn, TensorFlow</div>' },
        { text: '      <div><span class="text-accent font-semibold">Exploring:</span> Multi-agent systems, discrete diffusion models</div>' },
        { text: '    </div>' },
        { text: '  </div>' },
        { text: '</div>' },
        { text: '<div class="dim mt-2 text-xs flex items-center gap-2"><span>Tip: type</span> <span class="text-accent font-bold">pdf</span> <span>to open and save a formatted printable PDF resume!</span></div>' },
        { text: '' },
      ]);
      break;

    case 'pdf':
    case 'download':
      if (onOpenResumePdf) {
        onOpenResumePdf();
        store.addOutput([
          { text: 'Opening printable PDF resume modal...', className: 'text-accent' },
          { text: '' },
        ]);
      } else {
        store.addOutput([
          { text: 'Use the top-right [Resume PDF] button to download or print your resume.', className: 'dim' },
          { text: '' },
        ]);
      }
      break;

    case 'whoami':
      if (arg === '--verbose') {
        store.addOutput([
          { text: '' },
          { text: '<div class="text-accent font-bold tracking-wider border-b border-white/10 pb-1 mb-2">[ USER PROFILE // HEET PATEL ]</div>' },
          { text: '<div class="space-y-1 text-xs sm:text-sm">' },
          { text: '  <div><span class="text-accent font-semibold">Name:</span>       Heet Patel</div>' },
          { text: '  <div><span class="text-accent font-semibold">Role:</span>       AI/ML Engineer</div>' },
          { text: '  <div><span class="text-accent font-semibold">Education:</span>  B.Tech in CSE (AI Specialization) — CGPA: 7.63/10</div>' },
          { text: '  <div><span class="text-accent font-semibold">University:</span> Parul University, Vadodara, Gujarat (Expected 2028)</div>' },
          { text: '  <div><span class="text-accent font-semibold">Focus:</span>      Deep Learning · Discrete Diffusion · Distributed Systems · Agentic AI</div>' },
          { text: '  <div><span class="text-accent font-semibold">Passion:</span>    Building things that think</div>' },
          { text: '</div>' },
          { text: '' },
        ]);
      } else {
        store.addOutput([
          { text: 'Heet Patel — 3rd-year B.Tech CSE (AI Specialization) at Parul University (CGPA: 7.63/10).' },
          { text: 'Engineering robust ML systems, discrete diffusion language models, and high-throughput data platforms.' },
          { text: 'Type <span class="text-accent">resume</span> or <span class="text-accent">whoami --verbose</span> for details.' },
          { text: '' },
        ]);
      }
      break;

    case 'ls':
      if (arg === 'projects' || arg === '') {
        store.addOutput([
          ...Object.keys(projects).map((k) => ({ text: `  ${k}`, className: 'text-amber' })),
          { text: '' },
        ]);
      } else {
        soundManager.playErrorBuzz();
        store.addOutput([
          { text: `ls: cannot access '${escapeHtml(arg)}': No such directory`, className: 'dim' },
          { text: '' },
        ]);
      }
      break;

    case 'cat':
      if (projects[arg]) {
        const p = projects[arg];
        store.addOutput([
          { text: `# ${p.title}`, className: 'text-accent font-bold' },
          { text: p.desc },
          { text: `stack: ${p.stack}`, className: 'dim mt-1' },
          { text: '' },
        ]);
      } else {
        soundManager.playErrorBuzz();
        store.addOutput([
          { text: `cat: ${escapeHtml(arg || '')}: No such file. Try 'ls projects' first.`, className: 'dim' },
          { text: '' },
        ]);
      }
      break;

    case 'skills':
      store.addOutput([
        { text: '<div class="rounded border border-white/15 bg-white/[0.02] p-3 space-y-1.5 my-1 max-w-lg text-xs sm:text-sm">' },
        { text: '  <div><span class="text-accent font-semibold">LANGUAGES:</span>   Python · JavaScript · SQL</div>' },
        { text: '  <div><span class="text-accent font-semibold">CORE STACK:</span>  PyTorch · FastAPI · HuggingFace · PostgreSQL · Redis · Celery</div>' },
        { text: '  <div><span class="text-accent font-semibold">ALSO WITH:</span>   Docker · scikit-learn · TensorFlow · PyShark</div>' },
        { text: '  <div><span class="text-accent font-semibold">EXPLORING:</span>   Multi-agent systems · discrete diffusion models</div>' },
        { text: '  <div><span class="text-accent font-semibold">DEV TOOLS:</span>   Git · Node.js · Docker Desktop · WSL2 · Postman · Ollama</div>' },
        { text: '</div>' },
        { text: '' },
      ]);
      break;

    case 'experience':
      store.addOutput([
        { text: '[Smart India Hackathon (SIH) 2025] — Ranked Top 10 (University Level)', className: 'text-accent font-semibold' },
        { text: '  Recognized among top university teams for innovative problem solving and system execution.' },
        { text: '' },
        { text: '[Smart India Hackathon (SIH) 2024] — Ranked Top 45 (University Level)', className: 'text-accent font-semibold' },
        { text: '  Developed algorithmic solutions and rapid MVP prototype under competitive hackathon pressure.' },
        { text: '' },
        { text: '[Offline Intelligence Suite (Veridian)] — Document Intelligence Engineer', className: 'text-accent font-semibold' },
        { text: '  • Owned extractor.py: page-aware PDF/DOCX/TXT structure detection & air-gapped Streamlit tool.' },
        { text: '  • Engineered S&T research-brief summarization with a fact-lock rewriting engine.' },
        { text: '  • Powered 100% locally via Gemma (Ollama/llama-server) ensuring zero data leakage.' },
        { text: '' },
      ]);
      break;

    case 'contact':
      store.addOutput([
        { text: '<div class="space-y-1.5 my-1 text-xs sm:text-sm">' },
        { text: '  <div><a href="mailto:Heetpatel081206@gmail.com" class="text-amber hover:underline font-semibold">● email:</a>     <span class="break-all">Heetpatel081206@gmail.com</span></div>' },
        { text: '  <div><span class="text-amber font-semibold">● discord:</span>   <span>@redninja8126</span></div>' },
        { text: '  <div><a href="https://github.com/HeetPatel8126" target="_blank" rel="noopener noreferrer" class="text-amber hover:underline font-semibold">● github:</a>    <span class="break-all">github.com/HeetPatel8126</span></div>' },
        { text: '  <div><a href="https://www.linkedin.com/in/heet-patel-52139b320/" target="_blank" rel="noopener noreferrer" class="text-amber hover:underline font-semibold">● linkedin:</a>  <span class="break-all">linkedin.com/in/heet-patel-52139b320</span></div>' },
        { text: '</div>' },
        { text: '' },
      ]);
      break;

    case 'snake':
      store.setActiveGame('snake');
      store.addOutput([
        { text: 'Initializing Neural Snake...', className: 'text-accent font-semibold' },
      ]);
      break;

    case 'typing':
      store.setActiveGame('typing');
      store.addOutput([
        { text: 'Launching 30s ML Typing Sprint...', className: 'text-accent font-semibold' },
      ]);
      break;

    case 'quest': {
      questStep = (questStep + 1) % 4;
      if (questStep === 1) {
        store.addOutput([
          { text: '╔════════════════════════════════════════════════════════════════╗', className: 'text-accent' },
          { text: '║  MISSION: EXPLORE HEET PATEL\'S DISCRETE DIFFUSION LAB          ║', className: 'text-accent font-bold' },
          { text: '╚════════════════════════════════════════════════════════════════╝', className: 'text-accent' },
          { text: 'You step through the air-gapped security doors into the server room.' },
          { text: 'Four RTX workstations hum quietly in the dim violet lighting.' },
          { text: 'On the main desk, a terminal screen flashes: <span class="text-amber font-bold">"SYNTHETIC DATA PIPELINE READY"</span>.' },
          { text: 'Type <span class="text-accent font-bold">quest</span> again to investigate the server rack.' },
          { text: '' },
        ]);
      } else if (questStep === 2) {
        store.addOutput([
          { text: 'You inspect Rack #03. The discrete diffusion language model training process is at Step 48,200.' },
          { text: 'Loss has converged: <span class="text-emerald-400 font-bold">1.412</span>.' },
          { text: 'A sticky note on the GPU chassis reads: <span class="text-yellow-400">"Karpathy was right. First principles forever."</span>' },
          { text: 'Type <span class="text-accent font-bold">quest</span> again to breach the secret research vault.' },
          { text: '' },
        ]);
      } else if (questStep === 3) {
        soundManager.playBootBeep();
        store.addOutput([
          { text: '🏆 <span class="text-accent font-bold">SECRET VAULT UNLOCKED!</span>' },
          { text: 'You uncover an unreleased prototype: <span class="text-amber font-semibold">Autonomous Multi-Agent Researcher</span>.' },
          { text: 'Reward: +500 XP. You have earned the title <span class="text-accent font-bold">[Honorary Research Fellow]</span>!' },
          { text: 'Feel free to connect directly: <a href="mailto:Heetpatel081206@gmail.com" class="text-amber underline">Heetpatel081206@gmail.com</a>' },
          { text: '' },
        ]);
      } else {
        questStep = 0;
        store.addOutput([
          { text: 'You exit the server room. The air-gapped door seals behind you.', className: 'dim' },
          { text: '' },
        ]);
      }
      break;
    }

    case 'github':
    case 'stats':
      store.addOutput([
        { text: 'Connecting to GitHub API (api.github.com/users/HeetPatel8126)...', className: 'dim' },
      ]);
      fetchGitHubData().then(({ profile, repos }) => {
        store.addOutput([
          { text: '' },
          { text: '<div class="rounded-xl border border-white/15 bg-white/[0.02] p-4 max-w-xl font-mono text-xs space-y-3">' },
          { text: `  <div class="flex items-center justify-between border-b border-white/10 pb-2">` },
          { text: `    <div class="flex items-center gap-2">` },
          { text: `      <span class="text-lg">🐙</span>` },
          { text: `      <span class="font-bold text-accent text-sm">${profile.name} (${profile.login})</span>` },
          { text: `    </div>` },
          { text: `    <a href="${profile.html_url}" target="_blank" class="text-amber hover:underline text-[11px]">View on GitHub →</a>` },
          { text: `  </div>` },
          { text: `  <div class="text-text-dim">${profile.bio || 'AI/ML Engineering & Distributed Systems'}</div>` },
          { text: `  <div class="grid grid-cols-3 gap-2 text-center py-1 bg-black/40 rounded">` },
          { text: `    <div><div class="text-text-dim text-[10px]">PUBLIC REPOS</div><div class="font-bold text-accent">${profile.public_repos}</div></div>` },
          { text: `    <div><div class="text-text-dim text-[10px]">FOLLOWERS</div><div class="font-bold text-accent">${profile.followers}</div></div>` },
          { text: `    <div><div class="text-text-dim text-[10px]">COMMITS (1YR)</div><div class="font-bold text-emerald-400">1,024+</div></div>` },
          { text: `  </div>` },
          { text: `  <div class="pt-1">` },
          { text: `    <div class="text-text-dim text-[11px] font-semibold mb-1">FEATURED REPOSITORIES:</div>` },
          ...repos.slice(0, 4).map((r) => ({
            text: `    <div class="py-1 border-b border-white/5 flex justify-between items-baseline"><div><a href="${r.html_url}" target="_blank" class="text-accent hover:underline font-semibold">${r.name}</a><div class="text-text-dim text-[10px] truncate max-w-xs">${r.description || ''}</div></div><span class="text-[10px] text-amber">★ ${r.stargazers_count} · ${r.language || 'Code'}</span></div>`,
          })),
          { text: `  </div>` },
          { text: '</div>' },
          { text: '' },
        ]);
      });
      break;

    case 'guestbook': {
      const gb = useGuestbookStore.getState();
      gb.init();
      const entries = gb.entries;
      store.addOutput([
        { text: '─── VISITOR GUESTBOOK ───', className: 'text-accent font-bold' },
        ...entries.map((e) => ({
          text: `<div class="my-1.5 rounded border border-white/10 bg-white/[0.02] p-2 text-xs"><div class="flex justify-between text-text-dim text-[10px]"><span class="font-semibold text-accent">${escapeHtml(e.name)} <span class="text-text-dim">(${escapeHtml(e.role || 'Visitor')})</span></span><span>${e.date}</span></div><div class="text-text mt-1">"${escapeHtml(e.message)}"</div></div>`,
        })),
        { text: '<div class="dim mt-2 text-xs">Sign the guestbook: <span class="text-accent">sign &lt;your_name&gt; &lt;your_message&gt;</span></div>' },
        { text: '' },
      ]);
      break;
    }

    case 'sign': {
      if (!arg) {
        store.addOutput([
          { text: 'Usage: sign <name> <message>', className: 'dim' },
          { text: 'Example: sign "Alex Turner" "Great terminal design!"', className: 'dim' },
          { text: '' },
        ]);
        break;
      }

      // Parse name and message
      let name = 'Visitor';
      let message = arg;

      const quoteMatch = arg.match(/^"([^"]+)"\s*(.*)$/);
      if (quoteMatch) {
        name = quoteMatch[1];
        message = quoteMatch[2].replace(/^"|"$/g, '').trim() || 'Left a signature';
      } else {
        const parts = arg.split(' ');
        name = parts[0];
        message = parts.slice(1).join(' ') || 'Visited the workstation!';
      }

      const gb = useGuestbookStore.getState();
      gb.addEntry(name, message);
      soundManager.playBootBeep();

      store.addOutput([
        { text: `✓ Signed as "${escapeHtml(name)}": "${escapeHtml(message)}"`, className: 'text-emerald-400 font-semibold' },
        { text: 'Your entry has been recorded in the portfolio guestbook! Type "guestbook" to see it.', className: 'dim' },
        { text: '' },
      ]);
      break;
    }

    case 'spotify':
    case 'music':
    case 'radio': {
      const sp = useSpotifyStore.getState();
      const param = arg.toLowerCase();

      if (param === 'next') {
        sp.nextPlaylist();
        const p = SPOTIFY_PLAYLISTS[sp.currentPlaylistIndex];
        store.addOutput([
          { text: `⏭ Switched Spotify playlist to: <span class="text-[#1DB954] font-bold">${p.name}</span>`, className: 'text-[#1DB954]' },
          { text: `Genre: ${p.genre}`, className: 'dim' },
          { text: '' },
        ]);
        break;
      }

      if (param === 'prev') {
        sp.prevPlaylist();
        const p = SPOTIFY_PLAYLISTS[sp.currentPlaylistIndex];
        store.addOutput([
          { text: `⏮ Switched Spotify playlist to: <span class="text-[#1DB954] font-bold">${p.name}</span>`, className: 'text-[#1DB954]' },
          { text: `Genre: ${p.genre}`, className: 'dim' },
          { text: '' },
        ]);
        break;
      }

      if (param === 'embed' || param === 'play' || param === 'open') {
        sp.openEmbed();
        store.addOutput([
          { text: '🎵 Opened official Spotify Embed Player on the desk!', className: 'text-[#1DB954] font-bold' },
          { text: '' },
        ]);
        break;
      }

      // Default: show playlist overview & options
      const active = SPOTIFY_PLAYLISTS[sp.currentPlaylistIndex];
      store.addOutput([
        { text: '─── SPOTIFY CURATED PLAYLISTS ───', className: 'text-[#1DB954] font-bold' },
        ...SPOTIFY_PLAYLISTS.map((pl, idx) => ({
          text: `  ${idx === sp.currentPlaylistIndex ? '<span class="text-[#1DB954] font-bold">▶</span>' : ' '} <span class="font-semibold text-white">${pl.name}</span> <span class="dim">(${pl.genre})</span>`,
        })),
        { text: '' },
        { text: `Currently active: <span class="text-[#1DB954] font-bold">${active.name}</span>`, className: 'dim' },
        { text: 'Type <span class="text-[#1DB954] font-semibold">spotify embed</span> to launch the web player, or <span class="text-[#1DB954] font-semibold">spotify next</span> to switch channels.', className: 'dim' },
        { text: '' },
      ]);
      break;
    }

    case 'clock':
    case 'time': {
      const now = new Date();
      const istStr = now.toLocaleTimeString('en-US', {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
      const localStr = now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
      store.addOutput([
        { text: `🇮🇳 Vadodara / IST Time: <span class="text-accent font-bold">${istStr}</span>`, className: 'text-accent' },
        { text: `🌐 Visitor Local Time: <span class="text-text font-bold">${localStr}</span>`, className: 'dim' },
        { text: 'Status: Workstation online · CPU load: 12% · Memory: 8.4/16 GB', className: 'dim' },
        { text: '' },
      ]);
      break;
    }

    case 'phone':
      if (onOpenPhone) {
        onOpenPhone();
        store.addOutput([
          { text: 'Opening smartphone contact interface...', className: 'text-accent' },
          { text: '' },
        ]);
      } else {
        store.addOutput([
          { text: 'Click the smartphone on the desk to view the contact card and download vCard.', className: 'dim' },
          { text: '' },
        ]);
      }
      break;

    case 'neofetch':
      store.addOutput([
        { text: '<div class="flex flex-col sm:flex-row items-start gap-3 sm:gap-5 my-2">' },
        { text: '  <div class="text-accent font-mono leading-none select-none text-[13px]">' },
        { text: '       ▄▄▄▄▄▄▄<br/>      ██▀▀▀▀▀██<br/>     ██       ██<br/>    ██   ▄▄▄   ██<br/>    ██  ██ ██  ██<br/>    ██   ▀▀▀   ██<br/>     ██       ██<br/>      ██▄▄▄▄▄██<br/>       ▀▀▀▀▀▀▀' },
        { text: '  </div>' },
        { text: '  <div class="space-y-0.5 text-xs sm:text-sm">' },
        { text: '    <div class="text-accent font-bold border-b border-white/15 pb-0.5 mb-1">guest@portfolio</div>' },
        { text: '    <div><span class="text-accent font-semibold">OS:</span>      Portfolio OS v2.4 (Next.js 16 + React 19)</div>' },
        { text: '    <div><span class="text-accent font-semibold">Host:</span>    AI/ML Workstation</div>' },
        { text: '    <div><span class="text-accent font-semibold">Kernel:</span>  neural-net 5.15.0</div>' },
        { text: '    <div><span class="text-accent font-semibold">GPU:</span>     NVIDIA RTX 4050</div>' },
        { text: '    <div><span class="text-accent font-semibold">Memory:</span>  16GB DDR5</div>' },
        { text: '    <div><span class="text-accent font-semibold">Uptime:</span>  142 days</div>' },
        { text: '    <div class="pt-1.5 flex gap-1">' },
        { text: '      <span class="inline-block w-2.5 h-2.5 bg-red-500 rounded-xs"></span> <span class="inline-block w-2.5 h-2.5 bg-green-500 rounded-xs"></span> <span class="inline-block w-2.5 h-2.5 bg-yellow-500 rounded-xs"></span> <span class="inline-block w-2.5 h-2.5 bg-blue-500 rounded-xs"></span> <span class="inline-block w-2.5 h-2.5 bg-purple-500 rounded-xs"></span> <span class="inline-block w-2.5 h-2.5 bg-cyan-500 rounded-xs"></span>' },
        { text: '    </div>' },
        { text: '  </div>' },
        { text: '</div>' },
        { text: '' },
      ]);
      break;

    case 'theme':
    case 'color': {
      const themeStore = useSetupThemeStore.getState();
      const param = arg.toLowerCase();

      if (!param) {
        store.addOutput([
          { text: 'Setup RGB Profiles:', className: 'text-accent font-semibold' },
          ...SETUP_THEMES.map((t) => ({
            text: `  <span style="color: ${t.primary}">●</span> ${t.id.padEnd(10)} <span class="dim">${t.name}</span>`,
          })),
          { text: '  <span>●</span> rainbow    <span class="dim">Dynamic RGB spectrum wave</span>' },
          { text: '  <span>●</span> #hexcode   <span class="dim">Custom color (e.g. theme #ff007f)</span>' },
          { text: '' },
          { text: `Current setup theme: <span class="text-accent font-bold">${themeStore.isRainbow ? 'Rainbow Wave' : themeStore.currentTheme.name}</span>`, className: 'dim' },
          { text: "Usage: type 'theme <name>' to apply (e.g., 'theme purple' or 'theme matrix')", className: 'dim' },
          { text: '' },
        ]);
        break;
      }

      if (param === 'rainbow' || param === 'aura') {
        themeStore.toggleRainbow();
        store.addOutput([
          { text: `Dynamic RGB Aura ${themeStore.isRainbow ? 'enabled' : 'disabled'}. Desk setup lighting updated!`, className: 'text-accent' },
          { text: '' },
        ]);
        break;
      }

      if (param.startsWith('#') || /^[0-9a-f]{6}$/i.test(param)) {
        const hex = param.startsWith('#') ? param : `#${param}`;
        themeStore.setCustomColor(hex);
        store.addOutput([
          { text: `Custom RGB lighting applied: <span style="color:${hex}; font-weight:bold">${hex}</span>`, className: 'text-accent' },
          { text: '' },
        ]);
        break;
      }

      const match = SETUP_THEMES.find((t) => t.id === param || t.name.toLowerCase().includes(param));
      if (match) {
        themeStore.setThemeById(match.id);
        store.addOutput([
          { text: `Setup RGB theme set to <span style="color:${match.primary}; font-weight:bold">${match.name}</span>. Desk lighting synced!`, className: 'text-accent' },
          { text: '' },
        ]);
      } else {
        soundManager.playErrorBuzz();
        store.addOutput([
          { text: `Unknown theme: '${escapeHtml(param)}'. Type 'theme' to see available profiles.`, className: 'dim' },
          { text: '' },
        ]);
      }
      break;
    }

    case 'crt':
      store.toggleCRT();
      store.addOutput([
        { text: `CRT effect ${store.crtEnabled ? 'disabled' : 'enabled'}.`, className: 'dim' },
        { text: '' },
      ]);
      break;

    case 'clear':
      store.clearOutput();
      break;

    case 'exit':
      exitTerminal();
      break;

    // Easter eggs
    case 'sudo':
      soundManager.playErrorBuzz();
      store.addOutput([
        { text: '' },
        { text: '  ⚠ ACCESS DENIED ⚠', className: 'text-red-500 glitch-text' },
        { text: '' },
        { text: '  Nice try. This incident will be reported.', className: 'dim' },
        { text: '  (just kidding, you have no power here)', className: 'dim' },
        { text: '' },
      ]);
      break;

    case 'matrix':
      store.addOutput([
        { text: 'Initializing the Matrix...', className: 'text-green-400' },
        { text: '' },
      ]);
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('matrix-effect'));
      }
      break;

    default:
      soundManager.playErrorBuzz();
      store.addOutput([
        { text: `command not found: ${escapeHtml(base)} — type 'help'`, className: 'dim' },
        { text: '' },
      ]);
      break;
  }
}
