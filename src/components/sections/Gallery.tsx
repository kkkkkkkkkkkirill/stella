import { useMemo, useState } from 'react';
import { Play } from 'lucide-react';
import { Reveal } from '../ui/Reveal';
import { scenes, packages, type PackageId, type Scene } from '../../data/content';
import { cn } from '@/lib/utils';

const thumbImages = import.meta.glob<{ default: string }>(
  '../../assets/scenes/thumb/*.jpg',
  { eager: true },
);
const videoPosters = import.meta.glob<{ default: string }>(
  '../../assets/animated/*.jpg',
  { eager: true },
);

function urlEndsWith(map: Record<string, { default: string }>, suffix: string) {
  const entry = Object.entries(map).find(([k]) => k.endsWith(suffix));
  return entry?.[1].default;
}

function thumbFor(scene: Scene) {
  return scene.kind === 'image'
    ? urlEndsWith(thumbImages, `${scene.id}.jpg`)
    : urlEndsWith(videoPosters, `${scene.id}.jpg`);
}

/**
 * Галерея превью всех сцен. Фильтр — по услуге (все/№1/№2/№3).
 * Клик по превью кидает хеш и каталог сверху переключается.
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

        <Reveal>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {filtered.map((scene) => {
              const tierLabel = scene.tier
                .map((id) => packages.find((p) => p.id === id)?.shortLabel)
                .filter(Boolean)
                .join(' · ');
              const isVideo = scene.kind === 'video';
              return (
                <a
                  key={scene.id}
                  href={`#${scene.id}`}
                  className="group relative aspect-[16/10] rounded-xl overflow-hidden bg-ink-900/50 border border-ink-800 hover:border-ink-600 transition-all"
                  aria-label={`открыть сцену ${scene.number}`}
                >
                  <img
                    src={thumbFor(scene)}
                    alt={scene.title ?? `сцена ${scene.number}`}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/5 to-black/20 opacity-95 group-hover:opacity-100 transition-opacity" />

                  {/* бейдж «видео» в углу */}
                  {isVideo && (
                    <div className="absolute top-2.5 right-2.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-[10px] tracking-widest uppercase text-white">
                      <Play size={10} strokeWidth={2} fill="currentColor" />
                      <span>анимация</span>
                    </div>
                  )}

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
