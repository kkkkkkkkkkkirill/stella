import { useMemo, useState } from 'react';
import { Reveal } from '../ui/Reveal';
import { scenes, packages, type SceneTag, type PackageId } from '../../data/content';
import { cn } from '@/lib/utils';

const thumbImages = import.meta.glob<{ default: string }>(
  '../../assets/scenes/thumb/*.jpg',
  { eager: true },
);
function thumbFor(sceneId: string) {
  const entry = Object.entries(thumbImages).find(([k]) => k.endsWith(`${sceneId}.jpg`));
  return entry?.[1].default;
}

const ALL_TAGS: SceneTag[] = ['природа','свечи','ангелы','иконы','символика','портрет','индивидуальный'];

/**
 * Галерея превью всех сцен. Фильтры:
 *   • по услуге (все / №1 / №2 / №3)
 *   • по теме (свечи, природа, портрет…)
 * Клик по превью кидает hash вида #scene-NN — а CeremonyHall выше
 * отлавливает его, переключает услугу/индекс и доскролливает.
 */
export function Gallery() {
  const [pkgFilter, setPkgFilter] = useState<PackageId | 'all'>('all');
  const [tagFilter, setTagFilter] = useState<SceneTag | 'all'>('all');

  const filtered = useMemo(() => {
    return scenes.filter((s) => {
      if (pkgFilter !== 'all' && !s.tier.includes(pkgFilter)) return false;
      if (tagFilter !== 'all' && !s.tags.includes(tagFilter)) return false;
      return true;
    });
  }, [pkgFilter, tagFilter]);

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
          <div className="flex flex-wrap justify-center gap-2 mb-3">
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

        {/* фильтр по теме */}
        <Reveal>
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            <FilterPill
              size="sm"
              active={tagFilter === 'all'}
              onClick={() => setTagFilter('all')}
            >
              все темы
            </FilterPill>
            {ALL_TAGS.map((t) => (
              <FilterPill
                key={t}
                size="sm"
                active={tagFilter === t}
                onClick={() => setTagFilter(t)}
              >
                {t}
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
          {filtered.length === 0 && (
            <p className="text-center text-ink-400 mt-12 text-[14px]">
              под выбранные фильтры сценариев нет
            </p>
          )}
        </Reveal>
      </div>
    </section>
  );
}

function FilterPill({
  active,
  onClick,
  children,
  size = 'md',
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  size?: 'md' | 'sm';
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'rounded-full transition-all duration-300 border',
        size === 'md' ? 'px-4 py-2 text-[13px]' : 'px-3 py-1.5 text-[12px]',
        active
          ? 'bg-white text-ink-950 border-white'
          : 'bg-white/[0.03] text-ink-200 border-white/10 hover:bg-white/[0.07] hover:text-ink-50',
      )}
    >
      {children}
    </button>
  );
}
