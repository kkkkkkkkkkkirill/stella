import { useMemo, useState } from 'react';
import { Clock } from 'lucide-react';
import { Reveal } from '../ui/Reveal';
import { scenes, packages, type PackageId } from '../../data/content';
import { cn } from '@/lib/utils';

const thumbImages = import.meta.glob<{ default: string }>(
  '../../assets/scenes/thumb/*.jpg',
  { eager: true },
);
function thumbFor(sceneId: string) {
  const entry = Object.entries(thumbImages).find(([k]) => k.endsWith(`${sceneId}.jpg`));
  return entry?.[1].default;
}

/**
 * Галерея превью всех сцен. Фильтр — по услуге (все/№1/№2/№3).
 * Клик по превью кидает хеш #scene-XX и переключает каталог сверху.
 */
export function Gallery() {
  const [pkgFilter, setPkgFilter] = useState<PackageId | 'all'>('all');

  const filtered = useMemo(
    () => (pkgFilter === 'all'
      ? scenes
      : scenes.filter((s) => s.tier.includes(pkgFilter))),
    [pkgFilter],
  );

  return (
    <section
      id="gallery"
      className="relative px-4 md:px-10 pt-24 md:pt-32 pb-24 md:pb-32 border-t border-ink-900/80"
    >
      <div className="max-w-[1320px] mx-auto">
        <Reveal as="div" className="mb-10 text-center">
          <p className="eyebrow mb-4">галерея</p>
          <h2 className="display text-ink-50 text-[clamp(1.7rem,3.8vw,2.8rem)] leading-[1.05] tracking-[-0.02em] max-w-[26ch] mx-auto">
            все доступные сценарии — выберите подходящий
          </h2>
        </Reveal>

        {/* фильтр по услуге */}
        <Reveal>
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            <FilterPill active={pkgFilter === 'all'} onClick={() => setPkgFilter('all')}>
              все услуги
            </FilterPill>
            {packages.map((p) => (
              <FilterPill
                key={p.id}
                active={pkgFilter === p.id}
                onClick={() => setPkgFilter(p.id)}
              >
                {p.shortLabel}
              </FilterPill>
            ))}
          </div>
        </Reveal>

        {/* сетка */}
        <Reveal>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {filtered.map((scene) => {
              const tierLabel = scene.tier
                .map((id) => packages.find((p) => p.id === id)?.shortLabel)
                .filter(Boolean)
                .join(' · ');

              if (scene.placeholder) {
                return (
                  <a
                    key={scene.id}
                    href={`#${scene.id}`}
                    className="group relative aspect-[16/10] rounded-xl overflow-hidden border border-dashed border-white/15 hover:border-white/30 transition-all flex flex-col items-center justify-center px-4 text-center"
                    style={{ background: 'rgba(255,255,255,0.025)' }}
                  >
                    <div className="w-10 h-10 rounded-full border border-white/15 flex items-center justify-center mb-3" style={{ background: 'rgba(255,255,255,0.03)' }}>
                      <Clock size={16} strokeWidth={1.5} className="text-ink-300" />
                    </div>
                    <p className="text-ink-200 text-[12.5px] leading-snug">
                      {scene.placeholderTitle}
                    </p>
                    <p className="text-ink-500 text-[10px] tracking-[0.18em] uppercase mt-2">
                      скоро · {tierLabel}
                    </p>
                  </a>
                );
              }

              return (
                <a
                  key={scene.id}
                  href={`#${scene.id}`}
                  className="group relative aspect-[16/10] rounded-xl overflow-hidden bg-ink-900/50 border border-ink-800 hover:border-ink-600 transition-all"
                  aria-label={`открыть сцену ${scene.number}`}
                >
                  <img
                    src={thumbFor(scene.id)}
                    alt={`сцена ${scene.number}`}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/0 to-black/0 opacity-90 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute left-3 right-3 bottom-3 flex items-end justify-between gap-2">
                    <span className="text-[11px] font-mono tracking-widest text-white/90">
                      № {String(scene.number).padStart(2, '0')}
                    </span>
                    <span className="text-[10px] tracking-[0.18em] uppercase text-white/65 text-right">
                      {tierLabel}
                    </span>
                  </div>
                </a>
              );
            })}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function FilterPill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'rounded-full transition-all duration-300 border px-5 py-2.5 text-[13px]',
        active
          ? 'bg-white text-ink-950 border-white shadow-[0_4px_16px_rgba(255,255,255,0.15)] font-semibold'
          : 'bg-white/[0.03] text-ink-200 border-white/10 hover:bg-white/[0.07] hover:text-ink-50',
      )}
    >
      {children}
    </button>
  );
}
