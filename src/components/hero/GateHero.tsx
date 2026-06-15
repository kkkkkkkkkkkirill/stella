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
 * в стороны и проявляется СВЕТ за ними. Заголовок появляется в конце.
 *
 * Тайминг подобран медленно (scrub 2, end +=400%, sine.inOut) чтобы
 * движение читалось как «портал открывается», а не «дёрнули за плиты».
 */
export function GateHero() {
  const heroRef = useRef<HTMLElement | null>(null);

  useGSAP(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Начальные состояния — критично для scrub-режима. Без gsap.set() элементы
    // показываются в финальном состоянии по CSS-дефолтам, пока playhead < 0.45.
    gsap.set('.hero-title', { opacity: 0, scale: 0.94, filter: 'blur(28px)' });
    gsap.set('.hero-sub',   { opacity: 0, y: 24 });
    gsap.set('.hero-cta',   { opacity: 0, y: 16 });

    if (reduce) {
      gsap.set('.gate-left',  { xPercent: -100 });
      gsap.set('.gate-right', { xPercent:  100 });
      gsap.set('.gate-glow',  { scale: 5, opacity: 1 });
      gsap.set('.hero-title', { opacity: 1, scale: 1, filter: 'blur(0)' });
      gsap.set('.hero-sub',   { opacity: 1, y: 0 });
      gsap.set('.hero-cta',   { opacity: 1, y: 0 });
      return;
    }

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: heroRef.current,
        start: 'top top',
        end: '+=400%',           // длинный путь = медленнее
        pin: true,
        scrub: 2,                // плавнее, инерционнее
        anticipatePin: 1,
      },
    });

    // 0 → 1 : плиты медленно расходятся и проявляется свет
    tl.to('.gate-left',  { xPercent: -100, ease: 'sine.inOut' }, 0)
      .to('.gate-right', { xPercent:  100, ease: 'sine.inOut' }, 0)
      .to('.gate-glow',  { scale: 4.5, opacity: 1, ease: 'sine.inOut' }, 0)
      .to('.gate-haze',  { opacity: 0.85, ease: 'sine.inOut' }, 0)
      // Заголовок — только в самом конце, когда плиты ушли с дороги
      .to('.hero-title', { opacity: 1, scale: 1, filter: 'blur(0px)', ease: 'power2.out' }, 0.55)
      .to('.hero-sub',   { opacity: 1, y: 0, ease: 'power2.out' }, 0.68)
      .to('.hero-cta',   { opacity: 1, y: 0, ease: 'power2.out' }, 0.78)
      .to('.scroll-hint',{ opacity: 0, ease: 'power1.in', duration: 0.25 }, 0);

    return () => { tl.scrollTrigger?.kill(); tl.kill(); };
  }, { scope: heroRef });

  return (
    <section
      ref={heroRef}
      id="top"
      className="relative h-[100svh] min-h-[640px] w-full overflow-hidden bg-black"
      aria-label="главный экран"
    >
      {/* СВЕТЛЫЙ ПОРТАЛ — самый дальний слой. Тёплое сияние от центра. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            // тёплый световой фон, который видно когда плиты разъезжаются
            'radial-gradient(60% 90% at 50% 55%, rgba(255,245,220,0.95) 0%, rgba(255,235,200,0.55) 25%, rgba(220,210,190,0.18) 55%, transparent 80%)',
        }}
      />
      {/* Дымка света — softer halo */}
      <div
        aria-hidden="true"
        className="gate-glow absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[140vh] pointer-events-none"
        style={{
          background:
            'radial-gradient(50% 50% at 50% 50%, rgba(255,240,210,0.7) 0%, rgba(255,235,200,0.25) 45%, transparent 75%)',
          filter: 'blur(60px)',
          opacity: 0.5,
          transformOrigin: 'center center',
        }}
      />
      {/* Мягкая туманная завеса между плитами — добавляет глубины */}
      <div
        aria-hidden="true"
        className="gate-haze absolute inset-x-0 bottom-0 h-[55%] pointer-events-none"
        style={{
          background:
            'radial-gradient(60% 80% at 50% 100%, rgba(255,250,240,0.55) 0%, rgba(200,200,200,0.25) 35%, transparent 75%)',
          filter: 'blur(30px)',
          opacity: 0.45,
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

      {/* Spotlight 21st.dev — поверх для синематик-подсветки */}
      <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="rgba(255, 240, 210, 1)" />

      {/* КОНТЕНТ HERO — поверх плит, появляется в конце таймлайна */}
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
              href="#hall"
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
          <span className="eyebrow text-ink-100/80">прокрутите медленно</span>
          <ArrowDown size={14} strokeWidth={1.5} />
        </div>
      </div>
    </section>
  );
}
