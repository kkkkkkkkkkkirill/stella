import { useEffect, useMemo, useState } from 'react';
import { Play, ChevronDown, Columns2 } from 'lucide-react';
import { Reveal } from '../ui/Reveal';
import { Lightbox, type LightboxItem } from '../ui/Lightbox';
import { scenes, packages, type PackageId, type Scene } from '../../data/content';
import { cn } from '@/lib/utils';

const thumbImages = import.meta.glob<{ default: string }>(
  '../../assets/scenes/thumb/*.jpg',
  { eager: true },
);
const fullImages = import.meta.glob<{ default: string }>(
  '../../assets/scenes/full/*.jpg',
  { eager: true },
);
const videos = import.meta.glob<{ default: string }>(
  '../../assets/animated/*.mp4',
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
function fullById(id: string) {
  return urlEndsWith(fullImages, `${id}.jpg`);
}
function fullFor(scene: Scene) {
  return fullById(scene.id);
}
function videoById(id: string) {
  return urlEndsWith(videos, `${id}.mp4`);
}
function videoFor(scene: Scene) {
  return scene.kind === 'video' ? videoById(scene.id) : undefined;
}

function lightItem(scene: Scene): LightboxItem {
  // «раздвинутая» версия: для фото — jpg, для анимации — mp4
  const spreadSrc = scene.spread
    ? (scene.kind === 'image' ? fullById(scene.spread) : videoById(scene.spread))
    : undefined;
  return {
    src: scene.kind === 'image' ? fullFor(scene) : videoFor(scene),
    poster: thumbFor(scene),
    kind: scene.kind,
    title: scene.title,
    spreadSrc,
  };
}

/**
 * Каталог = сразу галерея сцен. Фильтр по услугам, у выбранной услуги —
 * сворачиваемое описание. Клик по сцене открывает просмотрщик с листалкой.
 */
export function Gallery() {
  const [pkgFilter, setPkgFilter] = useState<PackageId | 'all'>('all');
  const [descOpen, setDescOpen] = useState(false);
  const [active, setActive] = useState<number | null>(null);
  const [mobileCols, setMobileCols] = useState<1 | 2>(2);

  useEffect(() => { setDescOpen(false); }, [pkgFilter]);

  const filtered = useMemo(
    () => (pkgFilter === 'all'
      ? scenes
      : scenes.filter((s) => s.tier.includes(pkgFilter))),
    [pkgFilter],
  );

  const lightItems = useMemo(() => filtered.map(lightItem), [filtered]);
  const activePkg = pkgFilter === 'all' ? null : packages.find((p) => p.id === pkgFilter)!;

  return (
    <section
      id="hall"
      className="relative px-4 md:px-10 pt-24 md:pt-32 pb-24 md:pb-32 border-t border-ink-900/80"
    >
      <div className="max-w-[1320px] mx-auto">
        <Reveal as="div" className="mb-10 text-center">
          <p className="eyebrow mb-4">каталог · услуги</p>
          <h2 className="display text-ink-50 text-[clamp(1.7rem,3.8vw,2.8rem)] leading-[1.05] tracking-[-0.02em] max-w-[26ch] mx-auto">
            выберите формат — посмотрите сценарии
          </h2>
        </Reveal>

        {/* ── ФИЛЬТР ПО УСЛУГАМ ── */}
        <Reveal>
          <div className="flex flex-wrap justify-center gap-2 mb-6">
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

        {/* ── СВОРАЧИВАЕМОЕ ОПИСАНИЕ ВЫБРАННОЙ УСЛУГИ ── */}
        {activePkg && (
          <div className="max-w-[720px] mx-auto mb-10">
            <button
              type="button"
              onClick={() => setDescOpen((o) => !o)}
              aria-expanded={descOpen}
              className="w-full flex items-center justify-center gap-2.5 text-[13px] text-ink-200 hover:text-ink-50 transition-colors"
            >
              <span className="font-medium">{activePkg.fullLabel}</span>
              <span className="text-ink-500">·</span>
              <span className="font-mono text-[12px] text-ink-400">{activePkg.code} · {activePkg.price}</span>
              <ChevronDown
                size={15}
                strokeWidth={2}
                className={cn('transition-transform duration-300', descOpen && 'rotate-180')}
              />
            </button>

            <div
              className={cn(
                'grid transition-all duration-300 ease-out',
                descOpen ? 'grid-rows-[1fr] opacity-100 mt-5' : 'grid-rows-[0fr] opacity-0',
              )}
            >
              <div className="overflow-hidden">
                <div className="rounded-2xl border border-ink-800 bg-white/[0.02] p-5 md:p-6">
                  <p className="text-ink-300 text-[14px] leading-relaxed">{activePkg.summary}</p>
                  <ul className="mt-4 space-y-2.5">
                    {activePkg.features.map((f, i) => (
                      <li key={i} className="flex gap-3 text-[13.5px] text-ink-200 leading-relaxed">
                        <span className="text-ink-500 mt-0.5">·</span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* переключатель плотности сетки — только на мобиле */}
        <div className="sm:hidden flex justify-end items-center gap-2 mb-4">
          <span className="text-[12px] text-ink-400">в ряду</span>
          <div className="inline-flex rounded-full border border-white/10 bg-white/[0.03] p-1">
            {([1, 2] as const).map((n) => (
              <button
                key={n}
                onClick={() => setMobileCols(n)}
                className={cn(
                  'w-9 py-1 rounded-full text-[13px] font-medium transition-colors',
                  mobileCols === n
                    ? 'bg-white text-ink-950'
                    : 'text-ink-200 hover:text-ink-50',
                )}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        <Reveal>
          <div
            className={cn(
              'grid gap-3 md:gap-4 sm:grid-cols-3 lg:grid-cols-4',
              mobileCols === 1 ? 'grid-cols-1' : 'grid-cols-2',
            )}
          >
            {filtered.map((scene, i) => {
              const tierLabel = scene.tier
                .map((id) => packages.find((p) => p.id === id)?.shortLabel)
                .filter(Boolean)
                .join(' · ');
              const isVideo = scene.kind === 'video';
              return (
                <button
                  key={scene.id}
                  type="button"
                  onClick={() => setActive(i)}
                  className="group relative aspect-square rounded-xl overflow-hidden bg-ink-900/50 border border-ink-800 hover:border-ink-600 transition-all text-left"
                  aria-label={`открыть сцену ${scene.number}`}
                >
                  {isVideo ? (
                    <video
                      src={videoFor(scene)}
                      poster={thumbFor(scene)}
                      autoPlay
                      loop
                      muted
                      playsInline
                      preload="metadata"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <img
                      src={thumbFor(scene)}
                      alt={scene.title ?? `сцена ${scene.number}`}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/5 to-black/20 opacity-95 group-hover:opacity-100 transition-opacity" />

                  {isVideo && (
                    <div className="absolute top-2.5 right-2.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-[10px] tracking-widest uppercase text-white">
                      <Play size={10} strokeWidth={2} fill="currentColor" />
                      <span>анимация</span>
                    </div>
                  )}

                  {scene.spread && (
                    <div className="absolute top-2.5 left-2.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/55 backdrop-blur-md border border-white/20 text-[10px] tracking-widest uppercase text-white/95">
                      <Columns2 size={10} strokeWidth={2} />
                      <span>можно раздвинуть</span>
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
                </button>
              );
            })}
          </div>
        </Reveal>
      </div>

      {active !== null && (
        <Lightbox
          items={lightItems}
          index={active}
          onIndex={setActive}
          onClose={() => setActive(null)}
        />
      )}
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
