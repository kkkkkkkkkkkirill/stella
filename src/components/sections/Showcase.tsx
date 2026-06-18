import { useMemo, useState } from 'react';
import { Reveal } from '../ui/Reveal';
import { Lightbox, type LightboxItem } from '../ui/Lightbox';

// Реальные материалы «как это выглядит» — кладём сюда фото/видео.
// Пока папка пуста — показываем заглушку из сцен каталога, чтобы был
// виден сам блок и раскладка плиток разного размера.
const showcaseImages = import.meta.glob<{ default: string }>(
  '../../assets/showcase/*.{jpg,jpeg,png,webp}',
  { eager: true },
);
const showcaseVideos = import.meta.glob<{ default: string }>(
  '../../assets/showcase/*.mp4',
  { eager: true },
);
const sceneFulls = import.meta.glob<{ default: string }>(
  '../../assets/scenes/full/*.jpg',
  { eager: true },
);

interface Tile {
  src: string;
  kind: 'image' | 'video';
  poster?: string;
  /** соотношение сторон плитки в сетке (для «живой» раскладки) */
  ratio: string;
}

// разные пропорции, чтобы masonry смотрелась интересно
const RATIOS = ['3/4', '1/1', '4/5', '16/10', '4/3', '2/3', '1/1', '5/4', '3/2'];

function buildTiles(): { tiles: Tile[]; placeholder: boolean } {
  const realImgs = Object.values(showcaseImages).map((m) => m.default);
  const realVids = Object.values(showcaseVideos).map((m) => m.default);
  if (realImgs.length || realVids.length) {
    const tiles: Tile[] = [
      ...realVids.map((src, i) => ({ src, kind: 'video' as const, ratio: RATIOS[i % RATIOS.length] })),
      ...realImgs.map((src, i) => ({ src, kind: 'image' as const, ratio: RATIOS[(i + 3) % RATIOS.length] })),
    ];
    return { tiles, placeholder: false };
  }
  // заглушка: берём кадры каталога с разными пропорциями
  const imgs = Object.values(sceneFulls).map((m) => m.default).slice(0, 9);
  const tiles: Tile[] = imgs.map((src, i) => ({
    src,
    kind: 'image',
    ratio: RATIOS[i % RATIOS.length],
  }));
  return { tiles, placeholder: true };
}

/**
 * «Как это выглядит» — кликабельная masonry-галерея реальных фото/видео
 * с площадок. Плитки разного размера. Клик открывает просмотрщик с листалкой.
 */
export function Showcase() {
  const { tiles, placeholder } = useMemo(buildTiles, []);
  const [active, setActive] = useState<number | null>(null);

  const lightItems: LightboxItem[] = useMemo(
    () => tiles.map((t) => ({ src: t.src, kind: t.kind, poster: t.poster })),
    [tiles],
  );

  return (
    <section
      id="showcase"
      className="relative px-4 md:px-10 pt-24 md:pt-32 pb-24 md:pb-32 border-t border-ink-900/80"
    >
      <div className="max-w-[1320px] mx-auto">
        <Reveal as="div" className="mb-10 text-center">
          <p className="eyebrow mb-4">как это выглядит</p>
          <h2 className="display text-ink-50 text-[clamp(1.7rem,3.8vw,2.8rem)] leading-[1.05] tracking-[-0.02em] max-w-[24ch] mx-auto">
            экраны на реальных церемониях
          </h2>
          {placeholder && (
            <p className="mt-4 text-[13px] text-ink-400 max-w-[44ch] mx-auto">
              заглушка — добавим сюда ваши фото и видео с площадок.
            </p>
          )}
        </Reveal>

        <Reveal>
          <div className="[column-fill:_balance] columns-2 md:columns-3 lg:columns-4 gap-3 md:gap-4">
            {tiles.map((t, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActive(i)}
                style={{ aspectRatio: t.ratio }}
                className="group relative mb-3 md:mb-4 w-full break-inside-avoid rounded-xl overflow-hidden bg-ink-900/50 border border-ink-800 hover:border-ink-600 transition-all"
                aria-label="открыть"
              >
                {t.kind === 'video' ? (
                  <video
                    src={t.src}
                    poster={t.poster}
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="metadata"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <img
                    src={t.src}
                    alt=""
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            ))}
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
