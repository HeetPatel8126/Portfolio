# ⚡ Heet Patel — Interactive 3D Desk & Cyber-Terminal Portfolio

[![Next.js](https://img.shields.io/badge/Next.js-16.3-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-13-ff0055?style=for-the-badge&logo=framer)](https://www.framer.com/motion/)
[![Zustand](https://img.shields.io/badge/Zustand-State_Management-4338CA?style=for-the-badge)](https://zustand.docs.pmnd.rs/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

An immersive, retro-futuristic developer portfolio that blends an interactive visual developer desk environment with a full-blown UNIX-style cyberpunk terminal. Visitors can explore the workstation, inspect hardware components, customize ambient RGB lighting, and execute interactive terminal commands with authentic mechanical audio feedback.

---

## 📸 Overview & Features

### 🖥️ 1. Interactive Desk Workstation
- **High-Definition Desk Environment**: Realistic developer desk featuring dual displays, mechanical keyboard, custom PC build, and ambient studio acoustics.
- **Interactive Hotspots**:
  - **Monitor**: Expands into the full interactive command-line terminal with fluid Framer Motion transitions.
  - **Custom PC Build**: Displays system specifications and internal hardware telemetry.
  - **Audio & Ambiance**: Real-time sound controls and interactive room elements.
- **Responsive Viewport**: Dynamically scales across ultrawide monitors, standard laptops, tablets, and mobile devices.

### 📟 2. Full-Featured Retro Cyber-Terminal
- **UNIX-Style Command Line**: Complete command processor supporting argument parsing, history navigation (`Up` / `Down` arrows), and tab completion.
- **CRT Simulation**: Scanlines, phosphor curvature glow, vignette, and authentic flicker effects (toggleable on/off).
- **Rich Output Formatting**: High-impact ASCII headers, styled project cards, syntax highlighting, and hyperlinked navigation.

### 🎨 3. Real-Time RGB Setup Customizer
- Customize the desk's ambient lighting in real time with quick presets and custom color channels:
  - 🟢 **Matrix Green** (Phosphor / Cyberpunk Hacker)
  - 🟠 **Amber CRT** (Warm Vintage Terminal)
  - 🟣 **Synthwave Neon** (Magenta & Deep Violet)
  - 🔵 **Ice Cyan** (Cold Tech Glow)
  - 🔴 **Bloodline** (Deep Crimson Stealth)
- Synchronized color tokens dynamically adjust terminal prompt accents, screen ambient glow, and interactive hotspots.

### 🔊 4. Synthesized Audio Engine (Web Audio API & Howler)
- **Zero-Latency Sound Effects**:
  - Mechanical keyboard typing clicks with pitch randomization for natural acoustic feel.
  - CRT monitor power-on hum and degauss boot tones.
  - Command error buzzers and terminal execution chirps.
- **Global Audio Control**: Instant mute/unmute floating toggle with persistent state.

### 🌧️ 5. Hidden Easter Eggs
- Fullscreen **Matrix Digital Rain** overlay with customizable density and character cascades.
- Interactive system diagnostics (`neofetch`, `matrix`, `secret`).

---

## ⌨️ Terminal Command Reference

| Command | Arguments | Description |
| :--- | :--- | :--- |
| `help` | — | Display all available commands categorized by section |
| `whoami` | `[--verbose]` | Short bio or comprehensive engineering profile |
| `resume` | — | Formatted resume with education, skills, and credentials |
| `pdf` | — | Open the print-ready, clean PDF resume viewer modal |
| `ls projects` | — | List all featured projects and engineering work |
| `cat <project>.md` | `syntheticdatagen`, `diffusionlm`, etc. | Deep-dive breakdown: architecture, stack, and metrics |
| `skills` | — | Breakdown of languages, frameworks, AI/ML models, and tools |
| `experience` | — | Hackathons, engineering roles, and competitive achievements |
| `contact` | — | Direct email, phone, GitHub, and LinkedIn links |
| `snake` | — | Launch playable retro ASCII Snake mini-game inside the terminal |
| `typing` | — | Launch 30-second AI & ML coding speed sprint benchmark |
| `quest` | — | Play an interactive cyberpunk AI lab text RPG adventure |
| `github` / `stats` | — | Fetch live GitHub repository activity, commits, and star metrics |
| `guestbook` | — | View community visitor signatures and comments |
| `sign <name> <msg>`| `"Name" "Message"` | Sign the persistent visitor guestbook |
| `music` / `radio` | — | Play or pause generative procedural lo-fi ambient beats |
| `clock` / `time` | — | Display live IST (Vadodara) and visitor local time |
| `phone` | — | Open interactive smartphone contact mockup & vCard card |
| `neofetch` | — | Visual ASCII system specs and portfolio runtime environment |
| `theme` | `[amber \| matrix \| synthwave \| cyan \| red]` | Switch workspace RGB ambient lighting and terminal glow |
| `crt` | — | Toggle retro CRT screen curve and scanline effects |
| `clear` | — | Clear terminal screen buffer |
| `exit` | — | Minimize terminal and return to the interactive desk view |

---

## 🛠️ Tech Stack & Architecture

- **Framework**: [Next.js 16 (Turbopack & App Router)](https://nextjs.org/)
- **Core UI**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [TailwindCSS v4](https://tailwindcss.com/) + CSS Variables
- **Animations**: [Framer Motion 13](https://www.framer.com/motion/) + [GSAP 3](https://greensock.com/gsap/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand) (Terminal I/O buffer, theme persistence, audio states)
- **Audio Synthesis**: [Howler.js](https://howlerjs.com/) + Native Web Audio API
- **Fonts**: [Geist Sans & Geist Mono](https://vercel.com/font)

---

## 📁 Project Structure

```text
├── public/
│   ├── desk.png               # High-res workstation base visual
│   └── ...                    # Icons & vector assets
├── src/
│   ├── app/
│   │   ├── globals.css        # Tailwind v4 theme, scanline shaders, animations
│   │   ├── layout.tsx         # Root layout with fonts and metadata
│   │   └── page.tsx           # Main container coordinating Desk & Terminal states
│   ├── components/
│   │   ├── CRTEffect.tsx       # Phosphor scanlines and CRT curvature overlay
│   │   ├── DeskScene.tsx       # Interactive viewport with coordinate hotspots
│   │   ├── Hotspot.tsx         # Pulsing interactive radar markers
│   │   ├── MatrixRain.tsx      # Canvas-based digital rain animation
│   │   ├── MuteToggle.tsx      # Audio state controller
│   │   ├── SetupColorPicker.tsx# Floating RGB lighting and theme customizer
│   │   ├── StatsPopup.tsx      # Hardware specs modal for desk components
│   │   └── Terminal.tsx        # Command-line interface with layoutId expansion
│   ├── lib/
│   │   ├── commands.ts         # Command parser, outputs, and project repository
│   │   └── sounds.ts           # Web Audio procedural synthesis and sound triggers
│   └── store/
│       ├── setupTheme.ts       # RGB colors, active preset, and lighting store
│       └── terminal.ts         # Command history, output lines, and state
├── package.json
├── tsconfig.json
└── next.config.ts
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** `v18.17` or higher
- **npm** (or `pnpm` / `bun`)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/HeetPatel8126/Portfolio.git
   cd Portfolio
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the local development server**:
   ```bash
   npm run dev
   ```

4. **Open in browser**:
   Navigate to [http://localhost:3000](http://localhost:3000) to view the interactive portfolio.

### Production Build

Verify type safety and compile optimized production assets:
```bash
npm run build
npm run start
```

---

## ⚙️ Customization Guide

### Adding or Modifying Projects
Open [`src/lib/commands.ts`](file:///c:/Users/HeetP/OneDrive/Desktop/Portfolio/src/lib/commands.ts) and edit the `projects` map:
```typescript
const projects: Record<string, { title: string; desc: string; stack: string }> = {
  'myproject.md': {
    title: 'Project Name — Brief Headline',
    desc: '• Bullet points describing architectural decisions, scale, and results.',
    stack: 'Technologies · Used · Separated · By · Dots',
  },
};
```

### Adding New Commands
To register a new terminal command, add a case block to `executeCommand` in [`src/lib/commands.ts`](file:///c:/Users/HeetP/OneDrive/Desktop/Portfolio/src/lib/commands.ts):
```typescript
case 'mycommand':
  store.addOutput([
    { text: 'Custom output goes here!', className: 'text-accent' },
  ]);
  break;
```

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

---

**Developed with 💻 & ☕ by [Heet Patel](https://github.com/HeetPatel8126)**
