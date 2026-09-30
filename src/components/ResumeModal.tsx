'use client';

import { motion, AnimatePresence } from 'framer-motion';

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ResumeModal({ isOpen, onClose }: ResumeModalProps) {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative flex flex-col max-h-[90vh] w-full max-w-3xl rounded-2xl border border-white/20 bg-[#0c0e14] text-text shadow-2xl font-mono overflow-hidden"
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between border-b border-white/10 bg-[#12151f] px-5 py-3 select-none">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-accent" />
              <span className="font-bold text-xs sm:text-sm tracking-wider text-accent">
                RESUME // HEET PATEL
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handlePrint}
                className="flex items-center gap-1.5 rounded-lg border border-accent/40 bg-accent/20 px-3 py-1.5 text-xs font-bold text-accent hover:bg-accent hover:text-black transition-colors shadow-[0_0_10px_var(--setup-glow)]"
                title="Print or Save as PDF"
              >
                <span>🖨️</span>
                <span>Print / Save PDF</span>
              </button>
              <button
                onClick={onClose}
                className="rounded-lg border border-white/10 bg-white/5 p-1.5 text-xs text-text-dim hover:text-white transition-colors"
                title="Close"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Printable Resume Body */}
          <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 text-xs sm:text-sm select-text bg-[#080a0f] text-gray-200">
            {/* Name & Contact */}
            <div className="border-b border-white/15 pb-4">
              <h1 className="text-xl sm:text-2xl font-bold tracking-wide text-accent">
                HEET PATEL
              </h1>
              <p className="text-text-dim text-xs mt-1">
                AI/ML Engineer · Distributed Systems & Discrete Diffusion Research
              </p>
              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-text-dim font-mono">
                <span>📧 <a href="mailto:Heetpatel081206@gmail.com" className="text-accent hover:underline">Heetpatel081206@gmail.com</a></span>
                <span>💬 <span className="text-accent font-semibold">Discord: @redninja8126</span></span>
                <span>🐙 <a href="https://github.com/HeetPatel8126" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">github.com/HeetPatel8126</a></span>
                <span>💼 <a href="https://www.linkedin.com/in/heet-patel-52139b320/" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">linkedin.com/in/heet-patel</a></span>
              </div>
            </div>

            {/* Education */}
            <div>
              <div className="text-accent font-bold uppercase tracking-wider text-xs mb-2 flex items-center gap-2">
                <span>🎓</span>
                <span>EDUCATION</span>
              </div>
              <div className="flex justify-between items-baseline font-semibold text-white">
                <span>Parul University — Faculty of Engineering & Technology</span>
                <span className="text-text-dim text-xs">Expected 2028</span>
              </div>
              <div className="text-text-dim text-xs mt-0.5">
                B.Tech in Computer Science & Engineering (AI Specialization) — CGPA: <span className="text-accent font-bold">7.63 / 10</span>
              </div>
              <div className="text-text-dim text-xs mt-1">
                <span className="text-accent font-medium">Relevant Coursework:</span> Design & Analysis of Algorithms, Artificial Intelligence, Cloud Computing (AWS), Data Structures & Object-Oriented Programming.
              </div>
            </div>

            {/* Technical Skills */}
            <div>
              <div className="text-accent font-bold uppercase tracking-wider text-xs mb-2 flex items-center gap-2">
                <span>🛠️</span>
                <span>TECHNICAL SKILLS</span>
              </div>
              <div className="space-y-1.5 text-xs">
                <div><span className="text-accent font-semibold">Languages:</span> Python, JavaScript, SQL, C++ basics</div>
                <div><span className="text-accent font-semibold">Frameworks & Libraries:</span> PyTorch, FastAPI, HuggingFace, scikit-learn, Next.js, React, Celery, Redis</div>
                <div><span className="text-accent font-semibold">Databases & Infrastructure:</span> PostgreSQL, Docker, Docker Compose, WSL2, Git, Linux, Postman</div>
                <div><span className="text-accent font-semibold">AI/ML Specialties:</span> Discrete Diffusion, Autodiff from first principles, Multi-Agent Systems, Offline LLM deployment (Ollama)</div>
              </div>
            </div>

            {/* Featured Projects */}
            <div>
              <div className="text-accent font-bold uppercase tracking-wider text-xs mb-2 flex items-center gap-2">
                <span>🚀</span>
                <span>KEY PROJECTS</span>
              </div>
              <div className="space-y-3.5 text-xs">
                <div>
                  <div className="flex justify-between font-semibold text-white">
                    <span>SyntheticDataGen — Synthetic Data Generation Platform</span>
                    <span className="text-text-dim text-[11px]">FastAPI · Next.js · Celery · Redis · Docker</span>
                  </div>
                  <ul className="mt-1 list-disc list-inside text-text-dim space-y-1">
                    <li>Engineered a full-stack platform generating up to 1M synthetic records per job across 10 locales with high throughput.</li>
                    <li>Designed an offline LLM-assisted dictionary expansion pipeline, ensuring complete client data privacy without fine-tuning overhead.</li>
                    <li>Implemented JWT + API key authentication and containerized services with Docker Compose for reproducible deployments.</li>
                  </ul>
                </div>

                <div>
                  <div className="flex justify-between font-semibold text-white">
                    <span>DiffusionLM — Discrete Diffusion Language Model</span>
                    <span className="text-text-dim text-[11px]">PyTorch · Autodiff · Discrete Diffusion · NLP</span>
                  </div>
                  <ul className="mt-1 list-disc list-inside text-text-dim space-y-1">
                    <li>18-month research initiative engineering a discrete diffusion-based language model from scratch.</li>
                    <li>Built foundational autodiff engine from first principles (inspired by Karpathy micrograd) to develop deep structural modeling intuition before scaling.</li>
                    <li>Targeting arXiv preprint submission and public HuggingFace open-source release.</li>
                  </ul>
                </div>

                <div>
                  <div className="flex justify-between font-semibold text-white">
                    <span>NIDRS — Network Intrusion Detection & Response System</span>
                    <span className="text-text-dim text-[11px]">FastAPI · Isolation Forest · PyShark · React</span>
                  </div>
                  <ul className="mt-1 list-disc list-inside text-text-dim space-y-1">
                    <li>Built a real-time NIDS using an Isolation Forest anomaly detection model on live packet traffic captured via PyShark.</li>
                    <li>Engineered multi-stage attack-chain detection (reconnaissance → exploitation → exfiltration) cutting alert noise by 65%.</li>
                    <li>Designed an interactive React dashboard with REST API for live traffic telemetry and automated IP mitigation.</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Achievements */}
            <div>
              <div className="text-accent font-bold uppercase tracking-wider text-xs mb-2 flex items-center gap-2">
                <span>🏆</span>
                <span>HONORS & HACKATHONS</span>
              </div>
              <div className="space-y-1 text-xs text-text-dim">
                <div>• <span className="text-white font-semibold">Smart India Hackathon (SIH) 2025</span> — Ranked Top 10 at University level.</div>
                <div>• <span className="text-white font-semibold">Smart India Hackathon (SIH) 2024</span> — Ranked Top 45 at University level.</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
