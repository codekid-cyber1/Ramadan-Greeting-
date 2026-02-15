
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { toPng } from 'html-to-image';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';
import { Moon, Sparkles, Send, Share2, ArrowRight, RefreshCw, Calendar, Volume2, VolumeX, Play, Pause } from 'lucide-react';
import Tilt from 'react-parallax-tilt';
import { AppState, CountdownTime } from './types';

// Constants - Set specifically to February 18, 2026
const RAMADAN_START_DATE = new Date('2026-02-18T00:00:00');

const RAMADAN_WISHES = [
  "May this holy month bring you peace, prosperity, and blessings.",
  "May Allah bless you and your family with happiness and grace.",
  "Wishing you a Ramadan filled with prayer, peace, and joy.",
  "May your fasts be accepted and your prayers answered.",
  "Ramadan Mubarak! May this month be a source of light for your soul.",
  "May the crescent moon brighten your path toward enlightenment.",
  "Wishing you a blessed Ramadan that inspires you and gives you strength.",
  "May Allah shower His blessings upon you and your loved ones.",
  "Have a peaceful and happy Ramadan Kareem.",
  "May this Ramadan bring heart-warming love and respect into your life."
];

// Sub-component for the typing effect
const TypingText: React.FC<{ text: string }> = ({ text }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      setDisplayedText(text.slice(0, i + 1));
      i++;
      if (i >= text.length) {
        clearInterval(timer);
        setIsFinished(true);
      }
    }, 50); // Speed of typing

    return () => clearInterval(timer);
  }, [text]);

  return (
    <span className="relative">
      {displayedText}
      {!isFinished && (
        <motion.span
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
          className="inline-block w-[2px] h-[1em] bg-amber-400 align-middle ml-1"
        />
      )}
      {isFinished && (
        <motion.span
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ delay: 2, duration: 1 }}
          className="inline-block w-[2px] h-[1em] bg-amber-400 align-middle ml-1"
        />
      )}
    </span>
  );
};

const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<AppState>(AppState.INTRO);
  const [userName, setUserName] = useState<string>('');
  const [wish, setWish] = useState<string>('');
  const [isFocused, setIsFocused] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const [volume, setVolume] = useState(0.5);
  const [isMobile, setIsMobile] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const countdown = useRef<CountdownTime>({ days: 0, hours: 0, minutes: 0, seconds: 0 }).current; // simplified for ref usage context if needed, but keeping original logic is safer.

  const [countdownState, setCountdownState] = useState<CountdownTime>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // Audio context for synthesized sound effects
  const audioCtxRef = useRef<AudioContext | null>(null);

  const initAudio = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  };

  const playChime = () => {
    initAudio();
    const ctx = audioCtxRef.current!;
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = 'sine';
    osc2.type = 'sine';
    osc1.frequency.setValueAtTime(880, ctx.currentTime);
    osc2.frequency.setValueAtTime(1320, ctx.currentTime);

    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.5);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc1.start();
    osc2.start();
    osc1.stop(ctx.currentTime + 1.5);
    osc2.stop(ctx.currentTime + 1.5);
  };

  const playWhoosh = () => {
    initAudio();
    const ctx = audioCtxRef.current!;
    const bufferSize = ctx.sampleRate * 1.5;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(100, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(3000, ctx.currentTime + 0.5);
    filter.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 1.2);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.4);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.2);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start();
    noise.stop(ctx.currentTime + 1.2);
  };

  const triggerHaptic = () => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(100);
    }
  };

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.matchMedia('(max-width: 768px)').matches);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const calculateCountdown = useCallback(() => {
    const now = new Date();
    const difference = RAMADAN_START_DATE.getTime() - now.getTime();

    if (difference > 0) {
      setCountdownState({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      });
    } else {
      setCountdownState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    }
  }, []);

  useEffect(() => {
    // Immediate calculation
    calculateCountdown();
    // Live update every second
    const timer = setInterval(calculateCountdown, 1000);
    return () => clearInterval(timer);
  }, [calculateCountdown]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.log("Audio play failed:", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  const handleStart = () => {
    playChime();
    triggerHaptic();
    setIsPlaying(true);
    setCurrentStep(AppState.INPUT);
  };

  const togglePlay = () => setIsPlaying(!isPlaying);

  const handleGenerate = () => {
    if (userName.trim()) {
      playWhoosh();
      const randomWish = RAMADAN_WISHES[Math.floor(Math.random() * RAMADAN_WISHES.length)];
      setWish(randomWish);
      setCurrentStep(AppState.RESULT);
    }
  };

  useEffect(() => {
    if (currentStep === AppState.RESULT) {
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

      const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

      const interval: any = setInterval(function () {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        // since particles fall down, start a bit higher than random
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
          colors: ['#fbbf24', '#f59e0b', '#ffffff']
        });
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
          colors: ['#fbbf24', '#f59e0b', '#ffffff']
        });
      }, 250);

      return () => clearInterval(interval);
    }
  }, [currentStep]);

  const handleShareImage = async () => {
    if (!cardRef.current) return;

    setIsSharing(true);
    try {
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        backgroundColor: '#0f172a', // Dark slate background to match theme
        filter: (node) => {
          // Exclude elements with the 'share-hidden' class
          const element = node as HTMLElement;
          return !element.classList?.contains('share-hidden');
        }
      });
      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], 'ramadan-mubarak.png', { type: 'image/png' });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'Ramadan Mubarak',
          text: `Ramadan Mubarak from ${userName}! ✨`,
        });
        triggerHaptic();
      } else {
        const link = document.createElement('a');
        link.download = 'ramadan-mubarak.png';
        link.href = dataUrl;
        link.click();
        triggerHaptic();
      }
    } catch (err) {
      console.error('Failed to share image:', err);
      alert('Could not share image. Please try again.');
    } finally {
      setIsSharing(false);
    }
  };

  const reset = () => {
    setUserName('');
    setCurrentStep(AppState.INTRO);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-black overflow-hidden relative p-4">

      {/* Animated Background Waves */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Deep Slate Base */}
        <div className="absolute inset-0 bg-slate-950" />

        {/* Layer 1: Moving Glow */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            x: ['-10%', '10%', '-10%'],
            y: ['-10%', '10%', '-10%'],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute inset-[-50%] bg-[radial-gradient(circle_at_center,_rgba(15,23,42,0.8)_0%,_transparent_70%)] opacity-60"
        />

        {/* Layer 2: Secondary Shimmer */}
        <motion.div
          animate={{
            scale: [1.1, 1, 1.1],
            x: ['15%', '-15%', '15%'],
            y: ['10%', '-10%', '10%'],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute inset-[-50%] bg-[radial-gradient(circle_at_center,_rgba(30,41,59,0.5)_0%,_transparent_60%)] opacity-40"
        />

        {/* Layer 3: Accent Wave */}
        <motion.div
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: 40,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute inset-[-100%] bg-[conic-gradient(from_0deg_at_50%_50%,_transparent_0%,_rgba(245,158,11,0.03)_25%,_transparent_50%)]"
        />
      </div>

      {/* Background Decorative Stars */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-[1]">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0.1, scale: 0.5 }}
            animate={{
              opacity: [0.1, 0.4, 0.1],
              scale: [0.5, 1, 0.5],
              y: [0, -10, 0]
            }}
            transition={{
              duration: Math.random() * 5 + 3,
              repeat: Infinity,
              delay: Math.random() * 5
            }}
            className="absolute bg-amber-200 rounded-full"
            style={{
              width: Math.random() * 2 + 1 + 'px',
              height: Math.random() * 2 + 1 + 'px',
              top: Math.random() * 100 + '%',
              left: Math.random() * 100 + '%',
            }}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {currentStep === AppState.INTRO && (
          <motion.div
            key="intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }}
            onClick={handleStart}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center text-center cursor-pointer select-none"
          >
            <div className="flex flex-col items-center justify-center max-w-lg w-full px-6">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="relative group"
              >
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-amber-500/20 blur-[100px] rounded-full scale-150 animate-pulse" />

                <motion.div
                  animate={{
                    y: [0, -20, 0],
                    rotate: [0, 2, -2, 0]
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 6,
                    ease: "easeInOut"
                  }}
                  className="relative z-10"
                >
                  <img
                    src="/moon.svg"
                    alt="Ornate Moon"
                    className="w-48 h-48 md:w-64 md:h-64 object-contain drop-shadow-[0_0_35px_rgba(245,158,11,0.5)]"
                    style={{
                      filter: "sepia(1) saturate(5) hue-rotate(5deg) brightness(1.2) contrast(1.1)"
                    }}
                  />
                </motion.div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="mt-12 space-y-4"
              >
                <h1 className="text-5xl md:text-7xl font-serif gold-gradient font-bold tracking-tight">
                  Ramadan Kareem
                </h1>
                <p className="text-slate-400 text-lg font-light tracking-[0.3em] uppercase opacity-70">
                  Touch anywhere to Reveal
                </p>
                <div className="flex justify-center pt-8">
                  <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  >
                    <ArrowRight className="text-amber-400/30 w-8 h-8 rotate-90" />
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}

        {currentStep === AppState.INPUT && (
          <motion.div
            key="input"
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            className="w-full max-w-md bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-[2.5rem] shadow-2xl relative z-10"
          >
            <div className="flex justify-center mb-6">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <Moon className="w-12 h-12 text-amber-300" />
              </motion.div>
            </div>

            {/* Countdown Timer */}
            <div className="mb-8 p-4 bg-slate-950/50 border border-amber-500/10 rounded-2xl flex justify-around items-center">
              <CountdownItem label="Days" value={countdownState.days} />
              <CountdownItem label="Hours" value={countdownState.hours} />
              <CountdownItem label="Min" value={countdownState.minutes} />
              <CountdownItem label="Sec" value={countdownState.seconds} />
            </div>

            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-serif gold-gradient font-semibold mb-2">Create Your Wish</h2>
                <p className="text-slate-400 text-sm">Personalize your blessing for this holy month</p>
              </div>

              <div className="relative group">
                {/* Refined Shimmering Focus Container */}
                <motion.div
                  initial={false}
                  animate={{
                    opacity: isFocused ? 1 : 0,
                    scale: isFocused ? 1.02 : 1
                  }}
                  className="absolute -inset-1.5 rounded-[1.2rem] shimmer-gold opacity-0 pointer-events-none blur-sm z-0"
                />

                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  placeholder="Enter your name for a blessed wish"
                  className="w-full relative z-10 bg-slate-950/90 border border-white/10 rounded-xl px-4 py-5 text-white placeholder-slate-500/80 focus:outline-none focus:border-amber-400/50 transition-all text-center text-lg md:text-xl font-serif"
                />

                {/* Subtle Decorative Bottom Line */}
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: isFocused ? 1 : 0 }}
                  className="absolute bottom-0 left-4 right-4 h-[1px] bg-gradient-to-r from-transparent via-amber-400 to-transparent z-20 origin-center opacity-60"
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(245,158,11,0.3)" }}
                whileTap={{ scale: 0.98 }}
                onClick={handleGenerate}
                disabled={!userName.trim()}
                className="w-full bg-gradient-to-r from-amber-400 to-yellow-600 text-slate-950 font-bold py-4 rounded-xl shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <span>Generate Wish</span>
                <Sparkles className="w-5 h-5" />
              </motion.button>
            </div>
          </motion.div>
        )}

        {currentStep === AppState.RESULT && (
          <motion.div
            key="result"
            initial={{ opacity: 0, rotateY: 90 }}
            animate={{ opacity: 1, rotateY: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="w-full max-w-lg perspective-1000 z-10"
          >
            <Tilt
              tiltEnable={isMobile}
              glareEnable={isMobile}
              glareMaxOpacity={0.4}
              glareColor="#ffffff"
              glarePosition="all"
              scale={isMobile ? 1.02 : 1}
              className="w-full"
            >
              <div
                ref={cardRef}
                className="bg-white/5 backdrop-blur-xl border border-white/20 p-10 rounded-[3rem] shadow-[0_0_100px_rgba(245,158,11,0.15)] relative overflow-hidden flex flex-col items-center text-center"
              >
                {/* Decorative Ornament */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-50" />

                <div className="mb-6 opacity-80">
                  <Sparkles className="w-10 h-10 text-amber-200" />
                </div>

                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-amber-200 font-serif text-xl italic mb-4 min-h-[1.5em]"
                >
                  <TypingText text={`${userName} is wishing you...`} />
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{
                    opacity: 1,
                    scale: [1, 1.03, 1]
                  }}
                  transition={{
                    opacity: { delay: 0.6, type: 'spring' },
                    scale: { repeat: Infinity, duration: 4, ease: "easeInOut" }
                  }}
                  className="space-y-4"
                >
                  <h1 className="text-5xl md:text-7xl gold-gradient font-serif font-black tracking-tight leading-tight">
                    Ramadan<br />Mubarak
                  </h1>
                  <div className="text-4xl md:text-6xl text-amber-100/40 opacity-50 font-serif mt-2">
                    رمضان مبارك
                  </div>
                </motion.div>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                  className="mt-8 text-slate-300 text-lg leading-relaxed max-w-xs"
                >
                  {wish}
                </motion.p>

                <div className="mt-12 flex flex-col sm:flex-row gap-4 w-full share-hidden">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleShareImage}
                    disabled={isSharing}
                    className="flex-1 bg-green-600 hover:bg-green-500 text-white font-semibold py-4 rounded-2xl flex items-center justify-center gap-2 shadow-xl shadow-green-900/20 transition-all disabled:opacity-70 disabled:cursor-wait"
                  >
                    {isSharing ? (
                      <RefreshCw className="w-5 h-5 animate-spin" />
                    ) : (
                      <Share2 className="w-5 h-5" />
                    )}
                    <span>{isSharing ? 'Generating...' : 'Share Card'}</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={reset}
                    className="px-6 py-4 rounded-2xl border border-white/10 hover:bg-white/5 text-slate-300 flex items-center justify-center transition-all"
                  >
                    <RefreshCw className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>
            </Tilt>
          </motion.div>
        )}
      </AnimatePresence>

      <audio ref={audioRef} src="/ramadan-ambient.mp3" loop />

      {/* Floating Audio Player */}
      <AnimatePresence>
        {currentStep !== AppState.INTRO && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 right-6 z-50 bg-black/40 backdrop-blur-md border border-white/10 rounded-full p-2 px-4 flex items-center gap-4 shadow-lg share-hidden"
          >
            <button
              onClick={togglePlay}
              className="text-amber-400 hover:text-amber-300 transition-colors"
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </button>

            <div className="flex items-center gap-2">
              {volume === 0 ? <VolumeX className="w-4 h-4 text-slate-400" /> : <Volume2 className="w-4 h-4 text-slate-400" />}
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={(e) => {
                  setVolume(parseFloat(e.target.value));
                  if (parseFloat(e.target.value) > 0 && !isPlaying) setIsPlaying(true);
                }}
                className="w-20 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-amber-500 [&::-webkit-slider-thumb]:rounded-full"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

interface CountdownItemProps {
  label: string;
  value: number;
}

const CountdownItem: React.FC<CountdownItemProps> = ({ label, value }) => (
  <div className="flex flex-col items-center min-w-[60px]">
    <span className="text-2xl font-serif gold-gradient font-bold">{value.toString().padStart(2, '0')}</span>
    <span className="text-[10px] text-slate-500 uppercase tracking-tighter">{label}</span>
  </div>
);

export default App;
