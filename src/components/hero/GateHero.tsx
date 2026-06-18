import { ArrowDown } from 'lucide-react';
import { hero } from '../../data/content';
import gateImage from '../../assets/gate-reference.jpg';

/**
 * Статичная главная заставка: фон-кадр зала с экранами и заголовок.
 * Никакой анимации схлопывания — просто визитка.
 */
export function GateHero() {
  return (
    <section
      id="top"
      className="relative h-[100svh] min-h-[640px] w-full overflow-hidden bg-black"
      aria-label="главный экран"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${gateImage})` }}
      />
      {/* лёгкая виньетка снизу — чтобы текст уверенно читался */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.25) 35%, rgba(0,0,0,0.55) 75%, rgba(0,0,0,0.85) 100%)',
        }}
      />

      <div className="relative z-10 h-full w-full flex flex-col">
        <div className="h-24 md:h-28 shrink-0" aria-hidden="true" />

        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
          <h1 className="display text-ink-50 text-[clamp(40px,7vw,108px)] leading-[1.02] tracking-[-0.02em] max-w-[22ch]">
            Видео- и музыкальное сопровождение ритуальных церемоний
          </h1>

          <p className="mt-7 max-w-[60ch] text-[15px] md:text-[17px] text-ink-200 leading-relaxed">
            {hero.description}
          </p>

          <a
            href="#hall"
            className="mt-9 inline-flex items-center gap-2 bg-ink-50 text-ink-950 rounded-full px-6 py-3 text-[14px] font-medium hover:bg-white transition-colors duration-300 ease-out"
          >
            {hero.ctaPrimary}
            <ArrowDown size={15} strokeWidth={1.7} />
          </a>
        </div>

        <div className="absolute left-1/2 -translate-x-1/2 bottom-5 md:bottom-7 flex flex-col items-center gap-2 text-ink-50/70">
          <ArrowDown size={14} strokeWidth={1.5} className="animate-bounce" />
        </div>
      </div>
    </section>
  );
}
