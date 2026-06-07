// Пять плейсхолдер-визуалов для категорий контента.
// Без фото — чистые SVG-сцены с вечной анимацией.
// Каждый компонент — отдельный, чтобы анимации жили изолированно
// и не дёргали родителя re-рендером.
import { memo } from 'react';

const surfaceBg =
  'linear-gradient(180deg, #1a1a1d 0%, #0e0e10 100%)';

/* ============ Портрет ============ */
export const PortraitVisual = memo(function PortraitVisual() {
  return (
    <div className="absolute inset-0 flex items-center justify-center portrait-breathe" style={{ background: surfaceBg }}>
      <div className="relative w-[55%] aspect-[3/4] rounded-md overflow-hidden border border-ink-700/60 bg-gradient-to-b from-ink-800 to-ink-925 shadow-2xl">
        {/* стилизованный силуэт головы и плеч */}
        <svg viewBox="0 0 100 130" className="absolute inset-0 w-full h-full">
          <defs>
            <radialGradient id="portrait-light" cx="50%" cy="30%" r="60%">
              <stop offset="0" stopColor="#6a6a72" />
              <stop offset="1" stopColor="#1a1a1d" />
            </radialGradient>
          </defs>
          <rect width="100" height="130" fill="url(#portrait-light)" />
          <circle cx="50" cy="48" r="16" fill="#4a4a52" opacity="0.85" />
          <path d="M 24 110 Q 50 75 76 110 L 76 130 L 24 130 Z" fill="#4a4a52" opacity="0.85" />
        </svg>
        {/* подпись с именем и датами */}
        <div className="absolute inset-x-0 bottom-2 flex flex-col items-center text-ink-100/85 text-[7px] tracking-[0.2em] uppercase font-mono">
          <span>имя · фамилия</span>
          <span className="opacity-70 mt-0.5">1949 — 2024</span>
        </div>
      </div>
    </div>
  );
});

/* ============ Свечи ============ */
export const CandlesVisual = memo(function CandlesVisual() {
  return (
    <div className="absolute inset-0 flex items-end justify-center gap-3 pb-[18%]" style={{ background: surfaceBg }}>
      {[0, 1, 2].map((i) => (
        <div key={i} className="flex flex-col items-center" style={{ animationDelay: `${i * 0.4}s` }}>
          {/* пламя */}
          <div
            className="candle-flame w-3 h-7 rounded-full"
            style={{
              background:
                'radial-gradient(50% 60% at 50% 35%, #fff5d4 0%, #ffd58a 35%, #ff9a3a 70%, transparent 100%)',
              filter: 'blur(0.6px)',
              animationDelay: `${i * 0.3}s`,
            }}
          />
          {/* фитиль */}
          <div className="w-px h-1.5 bg-ink-700" />
          {/* свеча */}
          <div className="w-3 h-20 bg-gradient-to-b from-ink-200 to-ink-400 rounded-[2px] shadow-[inset_0_-4px_8px_rgba(0,0,0,0.3)]" />
        </div>
      ))}
      {/* нижнее свечение */}
      <div
        aria-hidden="true"
        className="absolute left-1/2 bottom-[12%] -translate-x-1/2 w-[60%] h-12 rounded-full opacity-40"
        style={{
          background: 'radial-gradient(50% 50% at 50% 50%, rgba(255, 200, 130, 0.5) 0%, transparent 70%)',
          filter: 'blur(12px)',
        }}
      />
    </div>
  );
});

/* ============ Облака ============ */
export const CloudsVisual = memo(function CloudsVisual() {
  return (
    <div className="absolute inset-0 overflow-hidden" style={{ background: 'linear-gradient(180deg, #1c1c20 0%, #0a0a0c 100%)' }}>
      <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full cloud-drift" preserveAspectRatio="xMidYMid slice">
        <defs>
          <radialGradient id="cloud-a" cx="50%" cy="50%" r="50%">
            <stop offset="0" stopColor="#9c9ca5" stopOpacity="0.85" />
            <stop offset="1" stopColor="#9c9ca5" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="cloud-b" cx="50%" cy="50%" r="50%">
            <stop offset="0" stopColor="#bfbfc7" stopOpacity="0.6" />
            <stop offset="1" stopColor="#bfbfc7" stopOpacity="0" />
          </radialGradient>
        </defs>
        <ellipse cx="50"  cy="80"  rx="50" ry="22" fill="url(#cloud-a)" />
        <ellipse cx="150" cy="100" rx="62" ry="28" fill="url(#cloud-a)" />
        <ellipse cx="100" cy="120" rx="70" ry="20" fill="url(#cloud-b)" />
        <ellipse cx="40"  cy="140" rx="48" ry="18" fill="url(#cloud-a)" />
        <ellipse cx="160" cy="160" rx="42" ry="16" fill="url(#cloud-b)" />
      </svg>
    </div>
  );
});

/* ============ Ангел (силуэт фигуры с крыльями) ============ */
export const AngelVisual = memo(function AngelVisual() {
  return (
    <div className="absolute inset-0 flex items-center justify-center wing-pulse" style={{ background: surfaceBg }}>
      <svg viewBox="0 0 200 200" className="w-[65%] h-auto text-ink-300/80">
        {/* нимб */}
        <ellipse cx="100" cy="38" rx="22" ry="6" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.6" />
        {/* фигура */}
        <ellipse cx="100" cy="50" rx="10" ry="12" fill="currentColor" opacity="0.85" />
        <path d="M 86 64 Q 100 60 114 64 L 120 130 Q 100 138 80 130 Z" fill="currentColor" opacity="0.78" />
        {/* левое крыло */}
        <path
          d="M 84 70 Q 38 60 32 110 Q 38 96 60 96 Q 50 110 56 124 Q 70 110 82 110 Z"
          fill="currentColor"
          opacity="0.6"
        />
        {/* правое крыло */}
        <path
          d="M 116 70 Q 162 60 168 110 Q 162 96 140 96 Q 150 110 144 124 Q 130 110 118 110 Z"
          fill="currentColor"
          opacity="0.6"
        />
        {/* лёгкая дымка снизу */}
        <ellipse cx="100" cy="180" rx="80" ry="6" fill="currentColor" opacity="0.15" />
      </svg>
    </div>
  );
});

/* ============ Птицы (силуэты в полёте) ============ */
export const BirdsVisual = memo(function BirdsVisual() {
  const Bird = ({ x, y, size, delay }: { x: number; y: number; size: number; delay: number }) => (
    <svg
      viewBox="0 0 60 30"
      className="absolute bird-glide"
      style={{ left: `${x}%`, top: `${y}%`, width: `${size}%`, animationDelay: `${delay}s` }}
    >
      <path d="M 2 18 Q 14 4 28 16 Q 32 12 36 16 Q 50 4 58 18" stroke="currentColor" strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
  return (
    <div
      className="absolute inset-0 text-ink-200/85"
      style={{
        background: 'linear-gradient(180deg, #2a2a30 0%, #14141a 60%, #0a0a0c 100%)',
      }}
    >
      <Bird x={18} y={28} size={18} delay={0} />
      <Bird x={42} y={20} size={22} delay={1.2} />
      <Bird x={66} y={32} size={16} delay={2.5} />
      <Bird x={30} y={48} size={14} delay={0.8} />
      <Bird x={58} y={56} size={20} delay={2.1} />
      <Bird x={78} y={66} size={12} delay={3.4} />
      {/* лёгкий горизонт */}
      <div className="absolute inset-x-0 bottom-0 h-1/3" style={{ background: 'linear-gradient(180deg, transparent, rgba(0,0,0,0.6))' }} />
    </div>
  );
});

/* Поиск визуала по slug — используется в каталоге */
export function visualFor(slug: string) {
  switch (slug) {
    case 'portrait': return <PortraitVisual />;
    case 'candles':  return <CandlesVisual />;
    case 'clouds':   return <CloudsVisual />;
    case 'angels':   return <AngelVisual />;
    case 'birds':    return <BirdsVisual />;
    default: return null;
  }
}
