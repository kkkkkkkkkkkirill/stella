import { useMemo, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { Reveal } from '../ui/Reveal';
import { packages, scenes, type PackageId } from '../../data/content';
import { cn } from '@/lib/utils';

const fullImages = import.meta.glob<{ default: string }>(
  '../../assets/scenes/full/*.jpg',
  { eager: true },
);

function urlFor(sceneId: string) {
  const entry = Object.entries(fullImages).find(([k]) => k.endsWith(`${sceneId}.jpg`));
  return entry?.[1].default;
}

/**
 * Главный блок каталога:
 *   1. Тулбар с выбором услуги (Услуга №1 / №2 / №3)
 *   2. Большой превью текущей сцены этой услуги (или плейсхолдер)
 *   3. Стрелки + индикатор для переключения сцен внутри услуги
 */
export function CeremonyHall() {
  const [tier, setTier] = useState<PackageId>('basic');
  const tierScenes = useMemo(
    () => scenes.filter((s) => s.tier.includes(tier)),
    [tier],
  );
  const [idx, setIdx] = useState(0);

  useEffect(() => { setIdx(0); }, [tier]);

  // Хеш #scene-NN из галереи: переключаем на нужную услугу/сцену
  useEffect(() => {
    const onHash = () => {
      const hash = window.location.hash;
      if (!hash.startsWith('#scene-') && !hash.startsWith('#placeholder-')) return;
      const targetId = hash.slice(1);
      const scene = scenes.find((s) => s.id === targetId);
      if (!scene) return;
      const nextTier = scene.tier[0];
      const list = scenes.filter((s) => s.tier.includes(nextTier));
      const nextIdx = Math.max(0, list.findIndex((s) => s.id === targetId));
      setTier(nextTier);
      setIdx(nextIdx);
      const el = document.getElementById('hall');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };
    window.addEventListener('hashchange', onHash);
    onHash();
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const current = tierScenes[idx];
  const pkg = packages.find((p) => p.id === tier)!;
  const hasPrev = idx > 0;
  const hasNext = idx < tierScenes.length - 1;
  const showArrows = tierScenes.length > 1;

  return (
    <section
      id="hall"
      className="relative px-4 md:px-10 pt-24 md:pt-32 pb-24 md:pb-32 border-t border-ink-900/80"
    >
      <div className="max-w-[1280px] mx-auto">
        <Reveal as="div" className="mb-10 md:mb-14 text-center">
          <p className="eyebrow mb-4">каталог · услуги</p>
          <h2 className="display text-ink-50 text-[clamp(1.9rem,4.4vw,3.4rem)] leading-[1.05] tracking-[-0.02em] max-w-[24ch] mx-auto">
            выберите формат — посмотрите сценарии
          </h2>
        </Reveal>

        {/* ── ТУЛБАР: три услуги ── */}
        <Reveal>
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8">
            {packages.map((p) => {
              const active = p.id === tier;
              return (
                <button
                  key={p.id}
                  onClick={() => setTier(p.id)}
                  className={cn(
                    'px-5 sm:px-6 py-3 rounded-full text-[13px] sm:text-[14px] transition-all duration-300 border',
                    active
                      ? 'bg-white text-ink-950 border-white shadow-[0_4px_20px_rgba(255,255,255,0.18)]'
                      : 'glass text-ink-100 border-white/10 hover:text-ink-50 hover:bg-white/[0.06]',
                  )}
                >
                  <span className="font-semibold">{p.shortLabel}</span>
                  <span className={cn('mx-2', active ? 'opacity-50' : 'opacity-40')}>·</span>
                  <span className={cn(active ? 'opacity-100' : 'opacity-75')}>
                    {p.fullLabel}
                  </span>
                </button>
              );
            })}
          </div>
        </Reveal>

        {/* ── БОЛЬШОЙ ПРЕВЬЮ ── */}
        <Reveal>
          <div className="relative rounded-2xl overflow-hidden bg-ink-900/50 border border-ink-800">
            <div className="aspect-[16/9] w-full bg-black">
              {current && !current.placeholder && (
                <img
                  key={current.id}
                  src={urlFor(current.id)}
                  alt={`сцена ${current.number}`}
                  className="w-full h-full object-cover transition-opacity duration-500"
                  loading="eager"
                />
              )}
              {current?.placeholder && (
                <div className="w-full h-full flex flex-col items-center justify-center gap-5 text-center px-6">
                  <div
                    className="w-14 h-14 rounded-full border border-white/15 flex items-center justify-center"
                    style={{ background: 'rgba(255,255,255,0.04)' }}
                  >
                    <Clock size={22} strokeWidth={1.5} className="text-ink-200" />
                  </div>
                  <div>
                    <p className="text-ink-100 text-[15px] md:text-[17px]">
                      {current.placeholderTitle}
                    </p>
                    <p className="text-ink-400 text-[13px] mt-2 max-w-[40ch]">
                      дизайнер готовит примеры сценариев для этой услуги — скоро появятся здесь
                    </p>
                  </div>
                </div>
              )}
            </div>

            {showArrows && (
              <>
                <button
                  onClick={() => hasPrev && setIdx((i) => i - 1)}
                  disabled={!hasPrev}
                  aria-label="предыдущая сцена"
                  className={cn(
                    'absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full flex items-center justify-center text-white transition-all',
                    hasPrev
                      ? 'bg-black/55 hover:bg-black/75 backdrop-blur-md border border-white/15'
                      : 'bg-black/30 opacity-40 cursor-not-allowed',
                  )}
                >
                  <ChevronLeft size={20} strokeWidth={1.7} />
                </button>
                <button
                  onClick={() => hasNext && setIdx((i) => i + 1)}
                  disabled={!hasNext}
                  aria-label="следующая сцена"
                  className={cn(
                    'absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full flex items-center justify-center text-white transition-all',
                    hasNext
                      ? 'bg-black/55 hover:bg-black/75 backdrop-blur-md border border-white/15'
                      : 'bg-black/30 opacity-40 cursor-not-allowed',
                  )}
                >
                  <ChevronRight size={20} strokeWidth={1.7} />
                </button>

                <div className="absolute left-1/2 -translate-x-1/2 bottom-4 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/55 backdrop-blur-md border border-white/15 text-[11px] font-mono tracking-widest text-white/90">
                  {String(idx + 1).padStart(2, '0')} / {String(tierScenes.length).padStart(2, '0')}
                </div>
              </>
            )}
          </div>
        </Reveal>

        {/* ── ОПИСАНИЕ ВЫБРАННОЙ УСЛУГИ ── */}
        <Reveal>
          <div className="mt-10 grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-5">
              <p className="eyebrow mb-3">{pkg.code} · {pkg.price}</p>
              <h3 className="display text-ink-50 text-[clamp(1.4rem,2.6vw,2.1rem)] leading-[1.15] tracking-[-0.01em]">
                {pkg.fullLabel}
              </h3>
              <p className="mt-5 text-ink-300 text-[15px] leading-relaxed">
                {pkg.summary}
              </p>
            </div>
            <ul className="md:col-span-7 space-y-3">
              {pkg.features.map((f, i) => (
                <li key={i} className="flex gap-3 text-[14px] text-ink-200 leading-relaxed">
                  <span className="text-ink-400 mt-1">·</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
