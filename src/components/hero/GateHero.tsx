import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { ArrowDown, ArrowRight } from 'lucide-react';
import { hero } from '../../data/content';
import { Spotlight } from '../ui/Spotlight';
import gateImage from '../../assets/gate-reference.jpg';

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * Сцена «Врата». Фон — твой брендовый кадр Image #9. Кадр разрезан
 * программно на две половины (`clip-path: inset(0 50% 0 0)` и
 * `inset(0 0 0 50%)`). На скролле половины реально разъезжаются
 * в стороны, проявляется свет, заголовок «память на экране»
 * выходит из-за плит. После полного открытия секция отпускается.
 */
export function GateHero() {
  const heroRef = useRef<HTMLElement | null>(null);

  useGSAP(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Начальные состояния, чтобы при scrub progress=0 элементы реально были
    // в стартовом виде (иначе CSS-default 1.0 показывает заголовок сразу).
    gsap.set('.hero-title',     { opacity: 0, scale: 0.92, filter: 'blur(24px)' });
    gsap.set('.hero-sub',       { opacity: 0, y: 20 });
    gsap.set('.hero-cta',       { opacity: 0, y: 14 });
    gsap.set('.gate-light-bar', { scaleX: 1,  opacity: 0.95 });

    if (reduce) {
      // Без скролла — финальное состояние сразу
      gsap.set('.gate-left',     { xPercent: -100 });
      gsap.set('.gate-right',    { xPercent:  100 });
      gsap.set('.hero-title',    { opacity: 1, scale: 1, filter: 'blur(0)' });
      gsap.set('.hero-sub',      { opacity: 1, y: 0 });
      gsap.set('.hero-cta',      { opacity: 1, y: 0 });
      return;
    }

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: heroRef.current,
        start: 'top top',
        end: '+=200%',
        pin: true,
        scrub: 1,
        anticipatePin: 1,
      },
    });

    // 0 → 0.6 : разъезжаются плиты, расширяется свет
    tl.to('.gate-left',     { xPercent: -100, ease: 'power2.inOut' }, 0)
      .to('.gate-right',    { xPercent:  100, ease: 'power2.inOut' }, 0)
      .to('.gate-light-bar',{ scaleX: 90, opacity: 0.65, ease: 'power2.inOut' }, 0)
      .to('.gate-glow',     { scale: 4, opacity: 0.7, ease: 'power2.inOut' }, 0)
      // 0.45 → 0.85 : проявляются заголовок и описание
      .to('.hero-title',    { opacity: 1, scale: 1, filter: 'blur(0px)', ease: 'power2.out' }, 0.45)
      .to('.hero-sub',      { opacity: 1, y: 0, ease: 'power2.out' }, 0.6)
      .to('.hero-cta',      { opacity: 1, y: 0, ease: 'power2.out' }, 0.7)
      .to('.scroll-hint',   { opacity: 0, ease: 'power1.in', duration: 0.2 }, 0);

    return () => { tl.scrollTrigger?.kill(); tl.kill(); };
  }, { scope: heroRef });

  return (
    <section
      ref={heroRef}
      id="top"
      className="relative h-[100svh] min-h-[640px] w-full overflow-hidden bg-black"
      aria-label="главный экран"
    >
      {/* Свет в проёме — он живёт за плитами */}
      <div
        aria-hidden="true"
        className="gate-glow absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[120vh] pointer-events-none"
        style={{
          background:
            'radial-gradient(50% 50% at 50% 50%, rgba(245,235,210,0.85) 0%, rgba(245,235,210,0.35) 40%, transparent 75%)',
          filter: 'blur(50px)',
          opacity: 0.35,
        }}
      />
      <div
        aria-hidden="true"
        className="gate-light-bar absolute left-1/2 top-0 bottom-0 -translate-x-1/2 w-[6px] pointer-events-none"
        style={{
          background:
            'linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,250,235,0.95) 18%, rgba(255,255,255,1) 45%, rgba(255,245,220,0.95) 75%, rgba(255,255,255,0) 100%)',
          filter: 'blur(1.5px)',
          transformOrigin: '50% 50%',
        }}
      />

      {/* ЛЕВАЯ ПОЛОВИНА КАДРА — clip правую половину */}
      <div
        aria-hidden="true"
        className="gate-left absolute inset-0 z-[2] bg-cover bg-center will-change-transform"
        style={{
          backgroundImage: `url(${gateImage})`,
          clipPath: 'inset(0 50% 0 0)',
        }}
      />
      {/* ПРАВАЯ ПОЛОВИНА КАДРА — clip левую половину */}
      <div
        aria-hidden="true"
        className="gate-right absolute inset-0 z-[2] bg-cover bg-center will-change-transform"
        style={{
          backgroundImage: `url(${gateImage})`,
          clipPath: 'inset(0 0 0 50%)',
        }}
      />

      {/* Spotlight 21st.dev — поверх обоих половин для синематик-подсветки */}
      <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="rgba(245, 230, 200, 1)" />

      {/* КОНТЕНТ HERO — рендерится поверх плит, но появляется
          только когда плиты разъехались (через GSAP opacity). */}
      <div className="relative z-[10] h-full w-full flex flex-col">
        <div className="h-24 md:h-28 shrink-0" aria-hidden="true" />

        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
          <p className="hero-sub eyebrow mb-5">{hero.eyebrow}</p>

          <h1 className="hero-title display text-ink-50 text-[clamp(48px,9vw,140px)] leading-[0.95] tracking-[-0.02em] mix-blend-screen">
            {hero.title}
          </h1>

          <p className="hero-sub mt-6 max-w-[58ch] text-[15px] md:text-[17px] text-ink-100 leading-relaxed">
            {hero.description}
          </p>

          <div className="hero-cta mt-9 flex flex-wrap gap-3 justify-center">
            <a
              href="#catalog"
              className="inline-flex items-center gap-2 bg-ink-50 text-ink-950 rounded-full px-6 py-3 text-[14px] font-medium hover:bg-white transition-colors duration-300 ease-out"
            >
              {hero.ctaPrimary}
              <ArrowRight size={15} strokeWidth={1.7} />
            </a>
            <a
              href="#contact"
              className="glass inline-flex items-center gap-2 rounded-full px-6 py-3 text-[14px] text-ink-50 hover:bg-white/[0.06] transition-colors duration-300 ease-out"
            >
              {hero.ctaSecondary}
            </a>
          </div>
        </div>

        <div className="scroll-hint absolute left-1/2 -translate-x-1/2 bottom-5 md:bottom-7 flex flex-col items-center gap-2 text-ink-50/85">
          <span className="eyebrow text-ink-100/80">прокрутить · ворота откроются</span>
          <ArrowDown size={14} strokeWidth={1.5} />
        </div>
      </div>
    </section>
  );
}
