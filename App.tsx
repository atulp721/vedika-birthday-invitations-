import { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { content, type Language, type ContentSection, MAPS_EMBED_URL, MAPS_DIRECTIONS_URL } from './content';

// ============================================
// CONSTANTS
// ============================================

const photoGradients = [
  'linear-gradient(135deg, #FADADD 0%, #F4C2C2 100%)',
  'linear-gradient(135deg, #EDE4F3 0%, #D4C1E4 100%)',
  'linear-gradient(135deg, #FFF0E0 0%, #F5D0A0 100%)',
  'linear-gradient(135deg, #FDE8F0 0%, #F0B8D0 100%)',
  'linear-gradient(135deg, #E8E0FE 0%, #D0B8F0 100%)',
  'linear-gradient(135deg, #E0F8F0 0%, #B8F0D8 100%)',
  'linear-gradient(135deg, #FEF8E0 0%, #F5E0A0 100%)',
  'linear-gradient(135deg, #FADADD 0%, #E8B0C0 100%)',
  'linear-gradient(135deg, #E8F0FE 0%, #B8D0F0 100%)',
  'linear-gradient(135deg, #FDE8E8 0%, #F0C0C0 100%)',
  'linear-gradient(135deg, #E8FDE8 0%, #C0F0C0 100%)',
  'linear-gradient(135deg, #FFF0F0 0%, #F0D0D0 100%)',
];

const placeholderEmojis = ['👶', '🌟', '🌙', '🌸', '✨', '🍃', '☀️', '🦋', '💕', '🌺', '💫', '🎀'];
const easeOut = [0.25, 0.46, 0.45, 0.94] as const;

// ============================================
// HELPERS
// ============================================

const getMonthLabel = (month: number, lang: Language): string => {
  if (lang === 'hi') {
    if (month === 0) return '— जन्म —';
    return `— ${month} माह —`;
  }
  if (month === 0) return '— Birth —';
  return `— ${month} ${month === 1 ? 'Month' : 'Months'} —`;
};

/** Generate SVG zigzag path that weaves between left and right card positions */
const generateZigzagPath = (width: number, height: number, numEntries: number): string => {
  if (height === 0 || width === 0) return '';
  const isMobile = width < 768;
  const centerX = isMobile ? 24 : width / 2;
  const amplitude = isMobile ? 8 : Math.min(width * 0.25, 220);
  const topPad = 40;
  const bottomPad = 40;
  const usableHeight = height - topPad - bottomPad;
  const segments = numEntries * 50;

  let d = `M ${centerX} ${topPad}`;
  for (let i = 1; i <= segments; i++) {
    const progress = i / segments;
    const y = topPad + progress * usableHeight;
    const x = centerX - amplitude * Math.sin(Math.PI * numEntries * progress);
    d += ` L ${x.toFixed(1)} ${y.toFixed(1)}`;
  }
  return d;
};

/** Compute x position on the zigzag at a given progress (0-1) */
const getZigzagX = (progress: number, width: number, numEntries: number): number => {
  const isMobile = width < 768;
  const centerX = isMobile ? 24 : width / 2;
  const amplitude = isMobile ? 8 : Math.min(width * 0.25, 220);
  return centerX - amplitude * Math.sin(Math.PI * numEntries * progress);
};

/** Compute y position on the zigzag at a given progress (0-1) */
const getZigzagY = (progress: number, height: number): number => {
  const topPad = 40;
  const usableHeight = height - topPad - 40;
  return topPad + progress * usableHeight;
};

// ============================================
// ICONS & DECORATIONS
// ============================================

/** Birthday cake with one candle — for a 1st birthday */
const BirthdayCakeIcon = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 80 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="cakeBottom" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#FADADD" /><stop offset="100%" stopColor="#EDE4F3" />
      </linearGradient>
      <linearGradient id="cakeTop" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#EDE4F3" /><stop offset="100%" stopColor="#FADADD" />
      </linearGradient>
      <linearGradient id="candleGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#D4AF37" /><stop offset="100%" stopColor="#C9A96E" />
      </linearGradient>
      <radialGradient id="flameGrad" cx="50%" cy="40%" r="50%">
        <stop offset="0%" stopColor="#FFF8DC" /><stop offset="40%" stopColor="#FFD700" /><stop offset="100%" stopColor="#FF8C00" />
      </radialGradient>
    </defs>
    <text x="4" y="32" fontSize="7" fill="#D4AF37" opacity="0.5">✦</text>
    <text x="68" y="28" fontSize="5" fill="#C8B6DB" opacity="0.5">✦</text>
    <text x="8" y="72" fontSize="5" fill="#D4AF37" opacity="0.35">✦</text>
    <text x="66" y="68" fontSize="6" fill="#C8B6DB" opacity="0.35">✦</text>
    <ellipse cx="40" cy="82" rx="36" ry="7" fill="#E8D5A8" stroke="#C9A96E" strokeWidth="1" opacity="0.7" />
    <rect x="10" y="54" width="60" height="28" rx="6" fill="url(#cakeBottom)" stroke="#D4B8D4" strokeWidth="1" />
    <path d="M10 56 C16 60 22 56 28 60 C34 64 40 56 46 60 C52 64 58 56 64 60 C68 62 70 56 70 56" fill="#FADADD" stroke="#F4C2C2" strokeWidth="0.5" />
    <rect x="18" y="32" width="44" height="24" rx="5" fill="url(#cakeTop)" stroke="#D4B8D4" strokeWidth="1" />
    <path d="M18 34 C24 38 30 34 36 38 C42 42 48 34 54 38 C58 40 62 34 62 34" fill="#FADADD" stroke="#F4C2C2" strokeWidth="0.5" />
    <circle cx="24" cy="66" r="2.5" fill="#D4AF37" opacity="0.5" />
    <circle cx="40" cy="68" r="2.5" fill="#C8B6DB" opacity="0.5" />
    <circle cx="56" cy="66" r="2.5" fill="#D4AF37" opacity="0.5" />
    <circle cx="30" cy="43" r="2" fill="#F4C2C2" opacity="0.5" />
    <circle cx="40" cy="45" r="2" fill="#D4AF37" opacity="0.5" />
    <circle cx="50" cy="43" r="2" fill="#F4C2C2" opacity="0.5" />
    <rect x="37" y="16" width="6" height="18" rx="2.5" fill="url(#candleGrad)" stroke="#B8941F" strokeWidth="0.5" />
    <line x1="40" y1="18" x2="40" y2="32" stroke="#E8D5A8" strokeWidth="0.5" opacity="0.5" />
    <ellipse cx="40" cy="12" rx="5" ry="7" fill="url(#flameGrad)" />
    <ellipse cx="40" cy="10" rx="2.5" ry="4" fill="#FFF8DC" opacity="0.8" />
    <ellipse cx="40" cy="12" rx="8" ry="9" fill="#FFD700" opacity="0.08" />
    <text x="40" y="72" fontSize="10" fontFamily="serif" fill="#B76E79" opacity="0.5" textAnchor="middle" fontWeight="bold">1</text>
  </svg>
);

const ButterflyDeco = ({ className = '', style }: { className?: string; style?: React.CSSProperties }) => (
  <span className={`animate-butterfly ${className}`} style={style}>🦋</span>
);

const WandSparkle = ({ className = '', style }: { className?: string; style?: React.CSSProperties }) => (
  <span className={`animate-wand-sparkle ${className}`} style={style}>✨</span>
);

const SparkleParticles = ({ count = 12 }: { count?: number }) => {
  const sparkles = Array.from({ length: count }, (_, i) => ({
    id: i, left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`,
    delay: `${Math.random() * 4}s`, duration: `${3 + Math.random() * 4}s`,
    size: 4 + Math.random() * 8, type: i % 3,
  }));
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {sparkles.map((s) => (
        <div key={s.id} className="absolute animate-sparkle" style={{ left: s.left, top: s.top, animationDelay: s.delay, animationDuration: s.duration }}>
          {s.type === 0 && <span className="text-sparkle/25" style={{ fontSize: `${s.size}px` }}>✦</span>}
          {s.type === 1 && <div className="rounded-full bg-rose-gold/15" style={{ width: `${s.size}px`, height: `${s.size}px` }} />}
          {s.type === 2 && <span className="text-lavender/25" style={{ fontSize: `${s.size}px` }}>◇</span>}
        </div>
      ))}
    </div>
  );
};

const PrincessDeco = ({ src, alt, side, className = '' }: { src: string; alt: string; side: 'left' | 'right'; className?: string }) => (
  <div className={`princess-deco ${side === 'left' ? 'left-0 -translate-x-1/4 md:-translate-x-1/3' : 'right-0 translate-x-1/4 md:translate-x-1/3'} ${className}`}>
    <img src={src} alt={alt} className="h-48 w-auto md:h-64 lg:h-80 object-contain drop-shadow-lg" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
  </div>
);

const CastleDeco = ({ className = '' }: { className?: string }) => (
  <div className={`princess-deco ${className}`}>
    <img src="/images/castle.png" alt="Fairy tale castle" className="h-40 w-auto md:h-56 lg:h-64 object-contain drop-shadow-lg" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
  </div>
);

// ============================================
// UTILITY COMPONENTS
// ============================================

const AnimatedSection = ({ children, className = '', delay = 0, direction = 'up' }: {
  children: React.ReactNode; className?: string; delay?: number; direction?: 'up' | 'down' | 'left' | 'right';
}) => {
  const offsets: Record<string, { x: number; y: number }> = { up: { y: 40, x: 0 }, down: { y: -40, x: 0 }, left: { x: 40, y: 0 }, right: { x: -40, y: 0 } };
  const offset = offsets[direction] || offsets.up;
  return (
    <motion.div initial={{ opacity: 0, ...offset }} whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.8, delay, ease: easeOut }} className={className}>
      {children}
    </motion.div>
  );
};

const PhotoFrame = ({ src, alt, monthIndex, className = '' }: { src: string; alt: string; monthIndex: number; className?: string }) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  return (
    <div className={`relative aspect-[3/4] w-full overflow-hidden rounded-2xl shadow-lg photo-frame ${className}`}>
      <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ background: photoGradients[monthIndex % photoGradients.length] }}>
        {!loaded && !error && <div className="shimmer absolute inset-0" />}
        {error && (
          <>
            <span className="mb-3 text-5xl opacity-70">{placeholderEmojis[monthIndex % placeholderEmojis.length]}</span>
            <span className="font-accent text-sm italic text-white/60">{monthIndex === 0 ? 'Newborn' : `${monthIndex} month${monthIndex !== 1 ? 's' : ''}`}</span>
            <span className="mt-1 font-sans text-[10px] tracking-wider text-white/40 uppercase">Replace with photo</span>
          </>
        )}
      </div>
      {!error && <img src={src} alt={alt} loading="lazy" onLoad={() => setLoaded(true)} onError={() => setError(true)} className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${loaded ? 'opacity-100' : 'opacity-0'}`} />}
    </div>
  );
};

const OrnamentalDivider = ({ className = '' }: { className?: string }) => (
  <div className={`flex items-center justify-center gap-3 py-6 ${className}`}>
    <div className="h-px w-10 bg-gradient-to-r from-transparent to-lavender/50 md:w-16" />
    <span className="text-sparkle/50 text-[10px]">✦</span>
    <span className="gradient-text-princess font-accent text-lg">♡</span>
    <span className="text-sparkle/50 text-[10px]">✦</span>
    <div className="h-px w-10 bg-gradient-to-l from-transparent to-lavender/50 md:w-16" />
  </div>
);

const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  return <motion.div className="fixed left-0 right-0 top-0 z-50 h-[2px] origin-left" style={{ scaleX: scrollYProgress, background: 'linear-gradient(90deg, #B76E79, #D4AF37, #C8B6DB, #B76E79)' }} />;
};

// ============================================
// SVG ICONS
// ============================================

const CalendarIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-rose-gold">
    <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);
const ClockIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-rose-gold">
    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
  </svg>
);
const MapPinIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-rose-gold">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
  </svg>
);
const ArrowRightIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
  </svg>
);
const HeartIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-rose-gold/40">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

// ============================================
// SECTION: LANGUAGE SELECT
// ============================================

const LanguageSelect = ({ onSelect }: { onSelect: (lang: Language) => void }) => (
  <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden">
    {/* ===== FULL-SCREEN BACKGROUND IMAGE with subtle breathing ===== */}
    <div className="absolute inset-0 overflow-hidden bg-gradient-to-br from-rose-gold/40 via-lavender/30 to-rose/40">
      <motion.img
        src="/images/landing page pic.png"
        alt="Vedika"
        className="h-full w-full object-cover object-center"
        initial={{ scale: 1.1 }}
        animate={{ scale: [1.1, 1.15, 1.1] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
      />
    </div>

    {/* ===== MULTI-LAYER OVERLAYS FOR DEPTH & READABILITY ===== */}
    {/* Dark base overlay */}
    <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/50" />
    {/* Pink/lavender tinted overlay */}
    <div className="absolute inset-0 bg-gradient-to-br from-rose-gold/20 via-lavender/10 to-rose/20" />
    {/* Vignette - darker edges */}
    <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.3) 100%)' }} />
    {/* Bottom gradient - stronger for button readability */}
    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

    {/* ===== SPARKLE PARTICLES ===== */}
    <SparkleParticles count={14} />

    {/* ===== SUBTLE DECORATIVE BUTTERFLIES ===== */}
    <ButterflyDeco className="absolute left-[6%] top-[18%] text-2xl opacity-50 md:opacity-60" />
    <ButterflyDeco className="absolute right-[8%] top-[22%] text-xl opacity-40 md:opacity-50" style={{ animationDelay: '2s' }} />
    <WandSparkle className="absolute left-[12%] bottom-[30%] text-lg opacity-40" style={{ animationDelay: '1s' }} />
    <WandSparkle className="absolute right-[10%] bottom-[35%] text-base opacity-35" style={{ animationDelay: '0.5s' }} />

    {/* ===== MAIN CONTENT ===== */}
    <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6">
      {/* Top decorative line */}
      <motion.div initial={{ opacity: 0, scaleX: 0 }} animate={{ opacity: 1, scaleX: 1 }} transition={{ duration: 1.2, delay: 0.3, ease: easeOut }}
        className="mb-8 h-px w-16 bg-gradient-to-r from-transparent via-white/50 to-transparent md:w-24" />

      {/* Birthday cake icon */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5, ease: easeOut }}
        className="mx-auto mb-6 w-16 animate-cake-float md:w-20">
        <BirthdayCakeIcon />
      </motion.div>

      {/* Name - VEIDIKA in large luminous text */}
      <motion.h1
        initial="hidden" animate="visible"
        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
        className="font-serif text-6xl tracking-wide text-white drop-shadow-[0_2px_12px_rgba(255,255,255,0.2)] md:text-8xl lg:text-9xl"
        style={{ textShadow: '0 2px 20px rgba(255,255,255,0.15), 0 4px 40px rgba(183,110,121,0.2)' }}
      >
        {'Vedika'.split('').map((char, i) => (
          <motion.span key={i}
            variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: easeOut } } }}
            className="inline-block"
          >{char}</motion.span>
        ))}
      </motion.h1>

      {/* Occasion line */}
      <motion.p initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.1, ease: easeOut }}
        className="font-accent mt-3 text-lg tracking-[0.3em] uppercase text-white/80 drop-shadow-sm md:text-xl"
      >
        First Birthday Celebration
      </motion.p>

      {/* Decorative divider */}
      <motion.div initial={{ opacity: 0, scaleX: 0 }} animate={{ opacity: 1, scaleX: 1 }}
        transition={{ duration: 0.8, delay: 1.3, ease: easeOut }}
        className="my-8 flex items-center gap-3">
        <div className="h-px w-10 bg-gradient-to-r from-transparent to-white/40 md:w-16" />
        <span className="text-gold-light/70 text-xs">✦</span>
        <span className="font-accent text-white/60 text-lg">♡</span>
        <span className="text-gold-light/70 text-xs">✦</span>
        <div className="h-px w-10 bg-gradient-to-l from-transparent to-white/40 md:w-16" />
      </motion.div>

      {/* Language heading */}
      <motion.p initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.5, ease: easeOut }}
        className="font-accent mb-2 text-base tracking-[0.2em] text-white/70 md:text-lg">
        Choose your language
      </motion.p>
      <motion.p initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.6, ease: easeOut }}
        className="font-serif mb-10 text-lg text-white/60 md:text-xl">
        अपनी भाषा चुनें
      </motion.p>

      {/* Language buttons */}
      <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
        <motion.button initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.8, ease: easeOut }}
          whileHover={{ scale: 1.06, boxShadow: '0 16px 40px rgba(183, 110, 121, 0.5), 0 0 20px rgba(212, 175, 55, 0.2)' }}
          whileTap={{ scale: 0.97 }}
          onClick={() => onSelect('en')}
          className="group min-w-[180px] rounded-full border border-white/20 bg-white/15 px-10 py-4 font-serif text-lg tracking-wide text-white shadow-lg backdrop-blur-md transition-all duration-300 hover:bg-white/25 hover:border-white/30"
        >
          <span className="flex items-center justify-center gap-2">
            <span className="text-gold-light/80 text-sm transition-colors group-hover:text-gold-light">✦</span>
            English
            <span className="text-gold-light/80 text-sm transition-colors group-hover:text-gold-light">✦</span>
          </span>
        </motion.button>
        <motion.button initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.9, ease: easeOut }}
          whileHover={{ scale: 1.06, boxShadow: '0 16px 40px rgba(183, 110, 121, 0.5), 0 0 20px rgba(212, 175, 55, 0.2)' }}
          whileTap={{ scale: 0.97 }}
          onClick={() => onSelect('hi')}
          className="group min-w-[180px] rounded-full border border-white/20 bg-white/15 px-10 py-4 font-serif text-lg tracking-wide text-white shadow-lg backdrop-blur-md transition-all duration-300 hover:bg-white/25 hover:border-white/30"
        >
          <span className="flex items-center justify-center gap-2">
            <span className="text-gold-light/80 text-sm transition-colors group-hover:text-gold-light">✦</span>
            हिन्दी
            <span className="text-gold-light/80 text-sm transition-colors group-hover:text-gold-light">✦</span>
          </span>
        </motion.button>
      </div>

      {/* Bottom decorative line */}
      <motion.div initial={{ opacity: 0, scaleX: 0 }} animate={{ opacity: 1, scaleX: 1 }}
        transition={{ duration: 1.2, delay: 2.2, ease: easeOut }}
        className="mt-10 h-px w-16 bg-gradient-to-r from-transparent via-white/40 to-transparent md:w-24" />
    </div>

    {/* ===== BOTTOM FADE into content ===== */}
    <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-princess-bg to-transparent" />
  </div>
);

// ============================================
// SECTION: WELCOME SCREEN
// ============================================

const WelcomeScreen = ({ t, language }: { t: ContentSection; language: Language }) => {
  // For Hindi, split into proper Devanagari syllables to avoid breaking matras
  // For English, split into individual characters for letter-by-letter animation
  const nameParts = language === 'hi'
    ? (t.welcome.name === 'वेदिका' ? ['वे', 'दि', 'का'] : [t.welcome.name])
    : t.welcome.name.split('');

  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-princess-bg px-6">
      <SparkleParticles count={10} />
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/3 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-pink-baby/20 blur-3xl" />
        <div className="absolute right-1/4 bottom-1/4 h-64 w-64 rounded-full bg-lavender-light/20 blur-3xl" />
      </div>
      <PrincessDeco src="/images/princess-right.png" alt="Princess" side="right" className="bottom-[5%]" />
      <ButterflyDeco className="absolute left-[8%] top-[25%] text-2xl opacity-40" />
      <ButterflyDeco className="absolute right-[12%] top-[40%] text-xl opacity-30" style={{ animationDelay: '2s' }} />
      <div className="relative z-10 text-center">
        <AnimatedSection><div className="mx-auto mb-4 w-16 animate-cake-float md:w-20"><BirthdayCakeIcon /></div></AnimatedSection>
        <AnimatedSection><p className="font-accent mb-6 text-base tracking-[0.25em] uppercase text-rose-gold md:text-lg">{t.welcome.subtitle}</p></AnimatedSection>
        <motion.h1 initial="hidden" animate="visible" variants={{ hidden: {}, visible: { transition: { staggerChildren: language === 'hi' ? 0.15 : 0.08 } } }} className="font-serif text-7xl tracking-tight md:text-9xl md:tracking-tighter">
          {nameParts.map((part, i) => (
            <motion.span key={i} variants={{ hidden: { opacity: 0, y: 40, scale: language === 'hi' ? 0.9 : 1 }, visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, delay: 0.3, ease: easeOut } } }} className="inline-block gradient-text-princess">{part}</motion.span>
          ))}
        </motion.h1>
        <AnimatedSection delay={0.5}><p className="font-accent mt-4 text-2xl tracking-[0.2em] text-rose-gold md:text-3xl">{t.welcome.occasion}</p></AnimatedSection>
        <AnimatedSection delay={0.8}><OrnamentalDivider className="mt-8" /></AnimatedSection>
        <AnimatedSection delay={1.2}>
          <div className="mt-8">
            <p className="font-sans text-xs tracking-[0.2em] uppercase text-brown-light md:text-sm">{t.welcome.scrollHint}</p>
            <div className="mt-4 animate-bounce-subtle"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="mx-auto text-rose-gold"><path d="M12 4L12 20M12 20L5 13M12 20L19 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg></div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

// ============================================
// SECTION: HERO
// ============================================

const HeroSection = ({ t }: { t: ContentSection }) => (
  <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-br from-princess-bg via-blush-light to-lavender-light/30">
      <img src="/images/hero-bg.jpg" alt="" className="h-full w-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
      <div className="absolute inset-0 bg-gradient-to-b from-princess-bg/60 via-princess-bg/40 to-princess-bg/70" />
    </div>
    <SparkleParticles count={8} />
    <CastleDeco className="right-0 bottom-[5%] md:bottom-[8%]" />
    <WandSparkle className="absolute left-[10%] top-[20%] text-lg opacity-30" />
    <WandSparkle className="absolute right-[15%] top-[30%] text-sm opacity-25" style={{ animationDelay: '0.7s' }} />
    <div className="relative z-10 px-6 text-center">
      <AnimatedSection><div className="mx-auto mb-6 w-14 animate-cake-float md:w-18"><BirthdayCakeIcon /></div></AnimatedSection>
      <AnimatedSection delay={0.1}><p className="font-accent mb-4 text-sm tracking-[0.3em] uppercase text-rose-gold md:text-base">✦ &nbsp; {t.hero.date} &nbsp; ✦</p></AnimatedSection>
      <AnimatedSection delay={0.2}><h1 className="gradient-text-princess font-serif text-5xl leading-tight md:text-7xl lg:text-8xl">{t.hero.title}</h1></AnimatedSection>
      <AnimatedSection delay={0.4}><p className="font-accent mx-auto mt-6 max-w-lg text-xl leading-relaxed text-brown-medium md:text-2xl">{t.hero.subtitle}</p></AnimatedSection>
      <AnimatedSection delay={0.6}><p className="font-accent mt-4 text-base tracking-wider text-rose-gold/80 md:text-lg">{t.hero.tagline}</p></AnimatedSection>
      <AnimatedSection delay={0.8}><OrnamentalDivider className="mt-10" /></AnimatedSection>
    </div>
  </section>
);

// ============================================
// SECTION: PHOTO TIMELINE — ZIGZAG SCROLL LINE
// ============================================

const PhotoTimeline = ({ t, language }: { t: ContentSection; language: Language }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const entriesRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Measure the entries container dynamically
  useEffect(() => {
    if (!entriesRef.current) return;
    const update = () => {
      const rect = entriesRef.current!.getBoundingClientRect();
      if (rect.height > 0) setDimensions({ width: rect.width, height: rect.height });
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(entriesRef.current);
    return () => observer.disconnect();
  }, []);

  // Generate zigzag SVG path
  const zigzagPath = useMemo(
    () => generateZigzagPath(dimensions.width, dimensions.height, t.timeline.length),
    [dimensions, t.timeline.length]
  );

  // Scroll progress for the section
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });

  // Draw the line as you scroll down (0→1), erase as you scroll up (1→0)
  const lineProgress = useTransform(scrollYProgress, [0.08, 0.82], [0, 1]);

  // Dot visibility
  const dotOpacity = useTransform(scrollYProgress, [0.08, 0.15, 0.78, 0.86], [0, 1, 1, 0]);

  // Dot position tracks along the zigzag
  const dotCx = useTransform(lineProgress, (v) => getZigzagX(v, dimensions.width, t.timeline.length));
  const dotCy = useTransform(lineProgress, (v) => getZigzagY(v, dimensions.height));

  // Dot glow scale
  const dotGlowScale = useTransform(lineProgress, [0, 0.5, 1], [0.8, 1.4, 0.8]);

  return (
    <section className="relative py-20 md:py-32 overflow-hidden" ref={sectionRef}>
      <div className="absolute inset-0 bg-gradient-to-b from-princess-bg via-white/20 to-princess-bg" />
      <SparkleParticles count={8} />
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-20 top-1/4 h-80 w-80 rounded-full bg-lavender-light/15 blur-3xl" />
        <div className="absolute -right-20 bottom-1/4 h-80 w-80 rounded-full bg-pink-baby/15 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl px-6">
        <AnimatedSection className="text-center">
          <div className="mx-auto mb-3 w-12 animate-cake-float md:w-14"><BirthdayCakeIcon /></div>
          <h2 className="gradient-text-princess font-serif text-3xl md:text-5xl">{language === 'hi' ? 'वेदिका की कहानी' : "Vedika's Story"}</h2>
          <p className="font-accent mt-3 text-base text-brown-light md:text-lg">{language === 'hi' ? 'जन्म से ग्यारह माह तक' : 'From birth to eleven months'}</p>
        </AnimatedSection>
        <OrnamentalDivider />

        {/* ===== TIMELINE ENTRIES CONTAINER ===== */}
        <div ref={entriesRef} className="relative">

          {/* ===== SVG ZIGZAG LINE — BEHIND THE CARDS ===== */}
          {dimensions.height > 0 && (
            <svg
              className="absolute top-0 left-0 w-full pointer-events-none"
              style={{ height: dimensions.height, zIndex: 1 }}
            >
              <defs>
                <linearGradient id="zigzagGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#B76E79" />
                  <stop offset="25%" stopColor="#C8B6DB" />
                  <stop offset="50%" stopColor="#D4AF37" />
                  <stop offset="75%" stopColor="#C8B6DB" />
                  <stop offset="100%" stopColor="#B76E79" />
                </linearGradient>
                <radialGradient id="dotGrad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#FFF8DC" />
                  <stop offset="40%" stopColor="#D4AF37" />
                  <stop offset="100%" stopColor="#B76E79" />
                </radialGradient>
                <filter id="zigzagGlow">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Faint background track — full zigzag path always visible as a ghost */}
              <path d={zigzagPath} fill="none" stroke="rgba(200,182,219,0.12)" strokeWidth="2" strokeLinecap="round" />

              {/* Wide soft glow behind the animated line — draws/erases with scroll */}
              <motion.path
                d={zigzagPath} fill="none"
                stroke="url(#zigzagGrad)" strokeWidth="16" strokeLinecap="round"
                style={{ pathLength: lineProgress, opacity: 0.1, filter: 'blur(8px)' }}
              />

              {/* Main animated zigzag line — draws on scroll DOWN, erases on scroll UP */}
              <motion.path
                d={zigzagPath} fill="none"
                stroke="url(#zigzagGrad)" strokeWidth="3" strokeLinecap="round"
                style={{ pathLength: lineProgress, filter: 'url(#zigzagGlow)' }}
              />

              {/* Glowing dot at the front of the drawn line */}
              <motion.g style={{ opacity: dotOpacity }}>
                {/* Outer glow ring */}
                <motion.circle
                  r="16" fill="none" stroke="rgba(212,175,55,0.15)" strokeWidth="2"
                  style={{ cx: dotCx, cy: dotCy, scale: dotGlowScale }}
                />
                {/* Ping ring */}
                <motion.circle
                  r="12" fill="none" stroke="rgba(183,110,121,0.2)" strokeWidth="1.5"
                  style={{ cx: dotCx, cy: dotCy }}
                />
                {/* Main dot */}
                <motion.circle
                  r="6" fill="url(#dotGrad)"
                  style={{ cx: dotCx, cy: dotCy, filter: 'drop-shadow(0 0 8px rgba(212,175,55,0.6)) drop-shadow(0 0 16px rgba(183,110,121,0.3))' }}
                />
                {/* Inner highlight */}
                <motion.circle
                  r="2.5" fill="rgba(255,255,255,0.5)"
                  style={{ cx: dotCx, cy: dotCy }}
                />
              </motion.g>

              {/* Static dot markers at each entry's zigzag peak position */}
              {t.timeline.map((_, index) => {
                const progress = (index + 0.5) / t.timeline.length;
                const cx = getZigzagX(progress, dimensions.width, t.timeline.length);
                const cy = getZigzagY(progress, dimensions.height);
                return (
                  <circle key={index} cx={cx} cy={cy} r="4" fill="#FFF5F8" stroke="#B76E79" strokeWidth="1.5" opacity="0.5" />
                );
              })}
            </svg>
          )}

          {/* ===== TIMELINE CARD ENTRIES — ABOVE THE LINE ===== */}
          <div style={{ position: 'relative', zIndex: 3 }}>
            {t.timeline.map((entry, index) => {
              const isEven = index % 2 === 0;
              return (
                <div key={index} className="relative mb-20 last:mb-0 md:mb-28">

                  {/* ===== MOBILE ===== */}
                  <div className="md:hidden pl-16">
                    <motion.div initial={{ opacity: 0, y: 30, scale: 0.95 }} whileInView={{ opacity: 1, y: 0, scale: 1 }}
                      viewport={{ once: true, margin: '-40px' }} transition={{ duration: 0.7, delay: 0.1, ease: easeOut }}>
                      <div className="timeline-photo-card rounded-2xl p-4 relative overflow-hidden">
                        <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-transparent via-sparkle/50 to-transparent rounded-full" />
                        <PhotoFrame src={entry.image} alt={`${entry.caption} - Vedika`} monthIndex={entry.month} className="mx-auto max-w-[240px]" />
                        <div className="mt-4 text-center pb-1">
                          <span className="font-accent text-xs tracking-[0.2em] uppercase text-rose-gold/60">{getMonthLabel(entry.month, language)}</span>
                          <h3 className="font-serif mt-1.5 text-xl text-brown-dark">{entry.caption}</h3>
                          <p className="font-accent mt-1.5 text-sm leading-relaxed text-brown-medium">{entry.text}</p>
                          <div className="mt-2 flex items-center justify-center gap-1.5"><span className="text-sparkle/25 text-[8px]">✦</span><span className="text-rose-gold/25 text-xs">♡</span><span className="text-sparkle/25 text-[8px]">✦</span></div>
                        </div>
                      </div>
                    </motion.div>
                  </div>

                  {/* ===== DESKTOP: Alternating Left-Right ===== */}
                  <div className="hidden md:grid md:grid-cols-[1fr_auto_1fr] md:gap-0 md:items-center">
                    {/* LEFT COLUMN */}
                    <motion.div initial={{ opacity: 0, x: isEven ? -50 : 50 }} whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.8, delay: 0.15, ease: easeOut }}
                      className={`pr-4 ${!isEven ? 'order-3 pl-4 pr-0' : ''}`}>
                      {isEven ? (
                        <div className="timeline-photo-card rounded-2xl p-5 relative overflow-hidden">
                          <div className="absolute right-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-transparent via-sparkle/40 to-transparent rounded-full" />
                          <PhotoFrame src={entry.image} alt={`${entry.caption} - Vedika`} monthIndex={entry.month} />
                        </div>
                      ) : (
                        <div className="timeline-photo-card rounded-2xl p-6 text-right relative overflow-hidden">
                          <div className="absolute right-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-transparent via-sparkle/40 to-transparent rounded-full" />
                          <span className="font-accent text-xs tracking-[0.2em] uppercase text-rose-gold/60">{getMonthLabel(entry.month, language)}</span>
                          <h3 className="font-serif mt-2 text-2xl text-brown-dark lg:text-3xl">{entry.caption}</h3>
                          <p className="font-accent mt-2 text-base leading-relaxed text-brown-medium lg:text-lg">{entry.text}</p>
                          <div className="mt-3 flex items-center justify-end gap-1.5"><span className="text-sparkle/25 text-[8px]">✦</span><span className="text-rose-gold/25 text-xs">♡</span></div>
                        </div>
                      )}
                    </motion.div>

                    {/* CENTER CONNECTOR */}
                    <div className="flex flex-col items-center w-10">
                      <div className={`h-px w-full ${isEven ? 'bg-gradient-to-r from-sparkle/25 via-lavender/30 to-transparent' : 'bg-gradient-to-r from-transparent via-lavender/30 to-sparkle/25'}`} />
                      <div className="my-1"><span className="text-sparkle/20 text-[5px]">✦</span></div>
                    </div>

                    {/* RIGHT COLUMN */}
                    <motion.div initial={{ opacity: 0, x: isEven ? 50 : -50 }} whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.8, delay: 0.25, ease: easeOut }}
                      className={`pl-4 ${!isEven ? 'order-1 pr-4 pl-0' : ''}`}>
                      {isEven ? (
                        <div className="timeline-photo-card rounded-2xl p-6 text-left relative overflow-hidden">
                          <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-transparent via-sparkle/40 to-transparent rounded-full" />
                          <span className="font-accent text-xs tracking-[0.2em] uppercase text-rose-gold/60">{getMonthLabel(entry.month, language)}</span>
                          <h3 className="font-serif mt-2 text-2xl text-brown-dark lg:text-3xl">{entry.caption}</h3>
                          <p className="font-accent mt-2 text-base leading-relaxed text-brown-medium lg:text-lg">{entry.text}</p>
                          <div className="mt-3 flex items-center gap-1.5"><span className="text-rose-gold/25 text-xs">♡</span><span className="text-sparkle/25 text-[8px]">✦</span></div>
                        </div>
                      ) : (
                        <div className="timeline-photo-card rounded-2xl p-5 relative overflow-hidden">
                          <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-transparent via-sparkle/40 to-transparent rounded-full" />
                          <PhotoFrame src={entry.image} alt={`${entry.caption} - Vedika`} monthIndex={entry.month} />
                        </div>
                      )}
                    </motion.div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

// ============================================
// SECTION: INVITATION MESSAGE
// ============================================

const InvitationMessage = ({ t }: { t: ContentSection }) => (
  <section className="relative bg-cream-dark py-20 md:py-32 overflow-hidden">
    <SparkleParticles count={5} />
    <PrincessDeco src="/images/princess-left.png" alt="Princess" side="left" className="bottom-[2%]" />
    <div className="mx-auto max-w-2xl px-6 text-center">
      <AnimatedSection><div className="mx-auto mb-4 w-10 animate-cake-float md:w-12"><BirthdayCakeIcon /></div><h2 className="gradient-text-princess font-serif text-4xl md:text-5xl">{t.invitation.heading}</h2></AnimatedSection>
      <AnimatedSection delay={0.2}><p className="font-accent mt-8 text-xl leading-relaxed text-brown-medium md:text-2xl">{t.invitation.message}</p></AnimatedSection>
      <AnimatedSection delay={0.4}>
        <div className="princess-card mt-12 rounded-2xl px-8 py-10 md:px-12 md:py-14">
          <div className="mb-6 flex items-center justify-center gap-3"><div className="h-px w-10 bg-gradient-to-r from-transparent to-rose-gold/30" /><HeartIcon /><div className="h-px w-10 bg-gradient-to-l from-transparent to-rose-gold/30" /></div>
          <p className="font-accent text-xl leading-relaxed italic text-brown-dark md:text-2xl">&ldquo;{t.invitation.quote}&rdquo;</p>
          <p className="font-accent mt-4 text-sm tracking-wider text-rose-gold/70">{t.invitation.quoteAttribution}</p>
        </div>
      </AnimatedSection>
    </div>
  </section>
);

// ============================================
// SECTION: EVENT DETAILS
// ============================================

const EventDetails = ({ t }: { t: ContentSection }) => (
  <section className="relative bg-princess-bg py-20 md:py-32 overflow-hidden">
    <SparkleParticles count={4} />
    <CastleDeco className="left-0 bottom-[2%]" />
    <div className="mx-auto max-w-xl px-6 text-center">
      <AnimatedSection><div className="mx-auto mb-3 w-10 animate-cake-float md:w-12"><BirthdayCakeIcon /></div><h2 className="gradient-text-princess font-serif text-3xl md:text-5xl">{t.event.heading}</h2></AnimatedSection>
      <AnimatedSection delay={0.2}>
        <div className="princess-card mt-12 rounded-2xl px-8 py-10 md:px-12 md:py-14">
          <div className="flex items-center justify-center gap-6">
            <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-lavender-light/50"><CalendarIcon /></div>
            <div className="text-left"><p className="font-sans text-xs tracking-[0.2em] uppercase text-brown-light">{t.event.dateLabel}</p><p className="font-serif text-2xl text-brown-dark md:text-3xl">{t.event.date}</p></div>
          </div>
          <div className="my-8 flex items-center justify-center">
            <div className="h-px w-10 bg-gradient-to-r from-transparent to-lavender/40" />
            <div className="mx-3 flex items-center gap-1.5"><span className="text-sparkle/25 text-[8px]">✦</span><span className="text-rose-gold/30 text-xs">♡</span><span className="text-sparkle/25 text-[8px]">✦</span></div>
            <div className="h-px w-10 bg-gradient-to-l from-transparent to-lavender/40" />
          </div>
          <div className="flex items-center justify-center gap-6">
            <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-lavender-light/50"><ClockIcon /></div>
            <div className="text-left"><p className="font-sans text-xs tracking-[0.2em] uppercase text-brown-light">{t.event.timeLabel}</p><p className="font-serif text-2xl text-brown-dark md:text-3xl">{t.event.time}</p></div>
          </div>
        </div>
      </AnimatedSection>
    </div>
  </section>
);

// ============================================
// SECTION: DINNER
// ============================================

const DinnerSection = ({ t }: { t: ContentSection }) => (
  <section className="relative bg-cream-dark py-16 md:py-24 overflow-hidden">
    <SparkleParticles count={3} />
    <div className="mx-auto max-w-lg px-6 text-center">
      <AnimatedSection><span className="text-3xl">{t.dinner.icon}</span><h2 className="gradient-text-princess font-serif mt-4 text-3xl md:text-4xl">{t.dinner.heading}</h2></AnimatedSection>
      <AnimatedSection delay={0.2}><p className="font-accent mt-6 text-lg leading-relaxed text-brown-medium md:text-xl">{t.dinner.message}</p></AnimatedSection>
    </div>
  </section>
);

// ============================================
// SECTION: VENUE
// ============================================

const VenueSection = ({ t }: { t: ContentSection }) => (
  <section className="relative bg-princess-bg py-20 md:py-32 overflow-hidden">
    <SparkleParticles count={4} />
    <div className="mx-auto max-w-3xl px-6">
      <AnimatedSection className="text-center"><div className="mx-auto mb-3 w-10 animate-cake-float md:w-12"><BirthdayCakeIcon /></div><h2 className="gradient-text-princess font-serif text-3xl md:text-5xl">{t.venue.heading}</h2></AnimatedSection>
      <AnimatedSection delay={0.2}>
        <div className="princess-card mt-10 rounded-2xl px-8 py-8">
          <div className="flex items-start justify-center gap-4"><div className="mt-1 flex-shrink-0"><MapPinIcon /></div><p className="font-accent text-lg leading-relaxed text-brown-medium md:text-xl whitespace-pre-line">{t.venue.address}</p></div>
        </div>
      </AnimatedSection>
      <AnimatedSection delay={0.3}><div className="map-container mt-10"><iframe src={MAPS_EMBED_URL} width="600" height="300" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Venue Location" /></div></AnimatedSection>
      <AnimatedSection delay={0.4}>
        <div className="mt-8 text-center">
          <a href={MAPS_DIRECTIONS_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-rose-gold to-rose px-8 py-3.5 font-serif text-base tracking-wide text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.04]" style={{ boxShadow: '0 8px 24px rgba(183, 110, 121, 0.25)' }}>✦ {t.venue.directions} <ArrowRightIcon /></a>
        </div>
      </AnimatedSection>
    </div>
  </section>
);

// ============================================
// SECTION: BLESSINGS
// ============================================

const BlessingsSection = ({ t }: { t: ContentSection }) => (
  <section className="relative bg-cream-dark py-20 md:py-32 overflow-hidden">
    <SparkleParticles count={5} />
    <PrincessDeco src="/images/princess-right.png" alt="Princess" side="right" className="bottom-[2%]" />
    <div className="mx-auto max-w-xl px-6 text-center">
      <AnimatedSection><div className="mb-4 flex items-center justify-center gap-3"><HeartIcon /><HeartIcon /><HeartIcon /></div><h2 className="gradient-text-princess font-serif text-3xl md:text-5xl">{t.blessings.heading}</h2></AnimatedSection>
      <AnimatedSection delay={0.2}><p className="font-accent mt-8 text-xl leading-relaxed text-brown-medium md:text-2xl">{t.blessings.message}</p></AnimatedSection>
    </div>
  </section>
);

// ============================================
// SECTION: GIFT NOTE
// ============================================

const GiftNote = ({ t }: { t: ContentSection }) => (
  <section className="relative bg-princess-bg py-20 md:py-28 overflow-hidden">
    <SparkleParticles count={3} />
    <div className="mx-auto max-w-lg px-6">
      <AnimatedSection>
        <div className="princess-card rounded-2xl px-8 py-10 text-center md:px-12 md:py-14">
          <div className="mx-auto mb-3 w-8"><BirthdayCakeIcon /></div>
          <h2 className="font-serif text-2xl text-brown-dark md:text-3xl">{t.gift.heading}</h2>
          <div className="mx-auto mt-5 h-px w-12 bg-gradient-to-r from-transparent via-rose-gold/40 to-transparent" />
          <p className="font-accent mt-5 text-lg leading-relaxed text-brown-medium md:text-xl">{t.gift.message}</p>
        </div>
      </AnimatedSection>
    </div>
  </section>
);

// ============================================
// SECTION: CLOSING SCREEN
// ============================================

const ClosingScreen = ({ t }: { t: ContentSection }) => (
  <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-b from-princess-bg via-pink-baby/20 to-blush" />
    <SparkleParticles count={14} />
    <div className="pointer-events-none absolute inset-0">
      <div className="absolute left-1/4 top-1/4 h-64 w-64 rounded-full bg-rose-gold/8 blur-3xl" />
      <div className="absolute bottom-1/3 right-1/4 h-48 w-48 rounded-full bg-lavender/10 blur-3xl" />
    </div>
    <PrincessDeco src="/images/princess-left.png" alt="Princess" side="left" className="bottom-[2%]" />
    <PrincessDeco src="/images/princess-right.png" alt="Princess" side="right" className="bottom-[2%]" />
    <ButterflyDeco className="absolute left-[10%] top-[20%] text-xl opacity-35" />
    <ButterflyDeco className="absolute right-[12%] top-[30%] text-lg opacity-25" style={{ animationDelay: '2s' }} />
    <WandSparkle className="absolute left-[20%] top-[15%] text-sm opacity-20" />
    <WandSparkle className="absolute right-[18%] bottom-[25%] text-base opacity-20" style={{ animationDelay: '1s' }} />
    <div className="relative z-10 px-6 text-center">
      <AnimatedSection><div className="mx-auto mb-4 w-14 animate-cake-float md:w-16"><BirthdayCakeIcon /></div></AnimatedSection>
      <AnimatedSection delay={0.2}><p className="font-accent text-xl leading-relaxed text-brown-medium md:text-2xl md:mx-auto md:max-w-lg">{t.closing.message}</p></AnimatedSection>
      <AnimatedSection delay={0.4}><OrnamentalDivider className="mt-8" /></AnimatedSection>
      <AnimatedSection delay={0.6}><p className="font-accent mt-6 text-lg tracking-wider text-rose-gold/70 md:text-xl">{t.closing.withLove}</p></AnimatedSection>
      <AnimatedSection delay={0.8}><h2 className="gradient-text-princess font-serif mt-3 text-4xl md:text-6xl">{t.closing.from}</h2></AnimatedSection>
      <AnimatedSection delay={1}><div className="mt-8 flex items-center justify-center gap-2"><span className="text-sparkle/25 text-xs">✦</span><p className="font-accent text-sm tracking-[0.3em] text-brown-light/60">{t.closing.year}</p><span className="text-sparkle/25 text-xs">✦</span></div></AnimatedSection>
    </div>
  </section>
);

// ============================================
// MAIN APP
// ============================================

export default function App() {
  const [language, setLanguage] = useState<Language | null>(null);
  return (
    <AnimatePresence mode="wait">
      {!language ? (
        <motion.div key="language-select" initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6, ease: easeOut }}>
          <LanguageSelect onSelect={setLanguage} />
        </motion.div>
      ) : (
        <motion.div key={`invitation-${language}`} lang={language} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, ease: easeOut }}>
          <ScrollProgress />
          <main>
            <WelcomeScreen t={content[language]} language={language} />
            <HeroSection t={content[language]} />
            <PhotoTimeline t={content[language]} language={language} />
            <InvitationMessage t={content[language]} />
            <EventDetails t={content[language]} />
            <DinnerSection t={content[language]} />
            <VenueSection t={content[language]} />
            <BlessingsSection t={content[language]} />
            <GiftNote t={content[language]} />
            <ClosingScreen t={content[language]} />
          </main>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
