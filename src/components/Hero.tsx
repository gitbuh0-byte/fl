import React, { useState, useEffect, useRef } from 'react';
import { ArrowUpRight, Download } from 'lucide-react';

interface HeroProps {
  onCtaclick: () => void;
}

const videoSources = ['/videos/vid1.mp4', '/videos/vid2.mp4', '/videos/vid3.mp4', '/videos/vid4.mp4'];

export default function Hero({ onCtaclick }: HeroProps) {
  const [systemPower, setSystemPower] = useState(10.0);
  const [temp, setTemp] = useState(1450);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [nextVideoIndex, setNextVideoIndex] = useState(1);
  const [activePlayer, setActivePlayer] = useState(0);
  const [isFading, setIsFading] = useState(false);
  const [activeWordIndex, setActiveWordIndex] = useState(0);
  const videoRefs = [useRef<HTMLVideoElement>(null), useRef<HTMLVideoElement>(null)];
  const rotatingWords = ['Architecture', 'Agriculture', 'Custom Steel Fabrication', 'Industries'];

  useEffect(() => {
    const interval = setInterval(() => {
      setSystemPower((prev) => parseFloat(Math.max(9.8, Math.min(10.2, prev + (Math.random() - 0.5) * 0.1)).toFixed(2)));
      setTemp((prev) => Math.max(1430, Math.min(1470, prev + Math.round((Math.random() - 0.5) * 8))));
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const activeVideo = videoRefs[activePlayer].current;
    if (!activeVideo) return;

    activeVideo.load();
    const playPromise = activeVideo.play();
    if (playPromise?.catch) {
      playPromise.catch((err) => {
        console.warn('Hero video play() rejected:', err);
      });
    }
  }, [currentVideoIndex, activePlayer]);

  // Runtime availability check for video assets (helps detect 404s on deployed site)
  useEffect(() => {
    let cancelled = false;
    async function checkAvailability() {
      try {
        const url = videoSources[0];
        const res = await fetch(url, { method: 'HEAD' });
        if (cancelled) return;
        if (!res.ok) {
          console.warn('Hero video HEAD check failed:', res.status);
        }
      } catch (e) {
        console.warn('Hero video availability check error:', e);
      }
    }
    checkAvailability();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!isFading) return;
    const timeout = window.setTimeout(() => {
      setCurrentVideoIndex(nextVideoIndex);
      setNextVideoIndex((prev) => (prev + 1) % videoSources.length);
      setActivePlayer((prev) => 1 - prev);
      setIsFading(false);
    }, 500);

    return () => window.clearTimeout(timeout);
  }, [isFading, nextVideoIndex]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveWordIndex((prev) => (prev + 1) % rotatingWords.length);
    }, 4290);

    return () => window.clearInterval(interval);
  }, []);

  const handleDownloadCapabilities = () => {
    const dummyText = `FORGELINEA ENGINEERING - CAPACITY STATEMENT 2026\n\n` +
      `- Precision structural steel fabrication and architectural metalwork\n` +
      `- 10kW fiber laser cutting with ±0.05mm tolerance control\n` +
      `- AWS-certified heavy structural welding and quality testing\n` +
      `- CAD/CAM-driven production workflows with FEA-backed design\n` +
      `- Nairobi-based workshop serving commercial, industrial and government sectors\n\n` +
      `Contact: forgelineaeng@gmail.com | Tel: +254 722 210 838`;

    const blob = new Blob([dummyText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'forgelinea_capabilities_statement.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section id="hero" className="relative overflow-hidden bg-white">
      <div className="absolute inset-0 overflow-hidden">
        {[0, 1].map((player) => {
          const isActive = activePlayer === player;
          const videoIndex = isActive ? currentVideoIndex : nextVideoIndex;
          return (
            <video
              key={player}
              ref={videoRefs[player]}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${isActive ? 'opacity-100' : 'opacity-0'}`}
              muted
              playsInline
              autoPlay
              preload="auto"
              onEnded={() => setIsFading(true)}
              src={videoSources[videoIndex]}
              crossOrigin="anonymous"
              onCanPlay={() => console.log('Hero video canplay:', videoSources[videoIndex])}
              onLoadedMetadata={() => console.log('Hero video loaded metadata:', videoSources[videoIndex])}
            >
              <source src={videoSources[videoIndex]} type="video/mp4" />
            </video>
          );
        })}
        <div className="absolute inset-0 bg-slate-950/40" />
      </div>

      <div className="absolute inset-x-0 top-0 h-[420px] bg-gradient-to-b from-accent-blue/10 to-transparent pointer-events-none" />
      <div className="absolute top-[12%] right-0 w-[420px] h-[420px] rounded-full bg-accent-blue/12 blur-3xl pointer-events-none" />
      <div className="absolute left-0 top-[42%] w-[360px] h-[360px] rounded-full bg-slate-900/5 blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 py-24 lg:py-32 flex flex-col items-center justify-center">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold tracking-tight text-white leading-tight line-clamp-3">
            Forgelinea Engineering
          </h1>
          <h2 className="mt-4 text-2xl sm:text-3xl font-display font-bold tracking-tight text-white leading-tight">
            Where Ideas Become Reality
            <br />
            Shaping The Future In ...{' '}
            <span className="text-white font-bold tracking-tight">
              {rotatingWords[activeWordIndex]}
            </span>
          </h2>

          <div className="mt-10 flex flex-wrap justify-center gap-4 items-center">
            <button
              onClick={onCtaclick}
              className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-7 py-3 text-sm font-semibold tracking-[0.15em] text-white transition hover:bg-accent-blue"
            >
              Get In Touch
              <ArrowUpRight className="w-4 h-4" />
            </button>
            <button
              onClick={handleDownloadCapabilities}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-7 py-3 text-sm font-semibold tracking-[0.15em] text-slate-950 transition hover:border-accent-blue hover:text-accent-blue"
            >
              Capabilities Statement
              <Download className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-12 grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-xl mx-auto">
            <div className="rounded-3xl border border-slate-200 bg-white p-5">
              <p className="text-[10px] uppercase tracking-[0.35em] text-slate-500">Founded</p>
              <p className="mt-3 text-xl font-semibold text-slate-950">2025</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-5">
              <p className="text-[10px] uppercase tracking-[0.35em] text-slate-500">Headquarters</p>
              <p className="mt-3 text-xl font-semibold text-slate-950">Nairobi</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-5">
              <p className="text-[10px] uppercase tracking-[0.35em] text-slate-500">Focus</p>
              <p className="mt-3 text-xl font-semibold text-slate-950">Precision Engineering</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
