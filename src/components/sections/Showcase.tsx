import { useMemo, useState } from 'react';
import { Reveal } from '../ui/Reveal';
import { Lightbox, type LightboxItem } from '../ui/Lightbox';
import { cn } from '@/lib/utils';

// Реальные фото с площадок. Имя файла кодирует услугу: u1-*, u2-*, u3-*.
// Пока папка пуста — показываем заглушку из сцен каталога, чтобы был
// виден сам блок и раскладка плиток разного размера.
const showcaseImages = import.meta.glob<{ default: string }>(
  '../../assets/showcase/*.{jpg,jpeg,png,webp}',
  { eager: true },
);
const sceneFulls = import.meta.glob<{ default: string }>(
  '../../assets/scenes/full/*.jpg',
  { eager: true },
);

interface Tile {
  src: string;
  tier?: 1 | 2 | 3;
}

const TIER = {
  1: { label: 'Услуга №1' },
  2: { label: 'Услуга №2' },
  3: { label: 'Услуга №3' },
} as const;

// мозаика: резко разные размеры плиток (col×row в ячейках сетки)
const SPAN = {
  sm: 'col-span-1 row-span-1',
  wide: 'col-span-2 row-span-1',
  tall: 'col-span-1 row-span-2',
  big: 'col-span-2 row-span-2',
} as const;
type Size = keyof typeof SPAN;
const SIZES: Size[] = [
  'big', 'sm', 'tall', 'sm', 'wide', 'sm', 'tall', 'sm', 'big', 'sm',
  'wide', 'tall', 'sm', 'sm', 'big', 'sm', 'tall', 'wide', 'sm', 'sm',
];

function tierFromKey(key: string): 1 | 2 | 3 | undefined {
  const m = key.match(/\/u([123])-/);
  return m ? (Number(m[1]) as 1 | 2 | 3) : undefined;
}

function buildTiles(): { tiles: Tile[]; placeholder: boolean } {
  const real = Object.entries(showcaseImages).map(([key, m]) => ({
    src: m.default,
    tier: tierFromKey(key),
  }));
  if (real.length) {
    // стабильный порядок: по услуге, затем по имени
    real.sort((a, b) => (a.tier ?? 9) - (b.tier ?? 9));
    return { tiles: real, placeholder: false };
  }
  const imgs = Object.values(sceneFulls).map((m) => m.default).slice(0, 9);
  return { tiles: imgs.map((src) => ({ src })), placeholder: true };
}

/**
 * «Как это выглядит» — masonry реальных фото с площадок, у каждого плашка
 * услуги. Плитки естественной высоты (разные размеры). Клик — просмотрщик.
 */
export function Showcase() {
  const { tiles, placeholder } = useMemo(buildTiles, []);
  const [active, setActive] = useState<number | null>(null);
  const [filter, setFilter] = useState<0 | 1 | 2 | 3>(0);

  const shown = useMemo(
    () => (filter === 0 ? tiles : tiles.filter((t) => t.tier === filter)),
    [tiles, filter],
  );

  const lightItems: LightboxItem[] = useMemo(
    () => shown.map((t) => ({ src: t.src, kind: 'image' as const })),
    [shown],
  );

  const hasTiers = !placeholder && tiles.some((t) => t.tier);

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

        {hasTiers && (
          <Reveal>
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {([0, 1, 2, 3] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setFilter(t)}
                  className={cn(
                    'rounded-full transition-all duration-300 border px-5 py-2.5 text-[13px]',
                    filter === t
                      ? 'bg-white text-ink-950 border-white font-semibold'
                      : 'bg-white/[0.03] text-ink-200 border-white/10 hover:bg-white/[0.07] hover:text-ink-50',
                  )}
                >
                  {t === 0 ? 'все услуги' : `Услуга №${t}`}
                </button>
              ))}
            </div>
          </Reveal>
        )}

        <Reveal>
          <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[116px] md:auto-rows-[150px] gap-2.5 md:gap-4 [grid-auto-flow:dense]">
            {shown.map((t, i) => (
              <button
                key={t.src}
                type="button"
                onClick={() => setActive(i)}
                className={cn(
                  'group relative rounded-xl overflow-hidden bg-ink-900/50 border border-ink-800 hover:border-ink-600 transition-all',
                  SPAN[SIZES[i % SIZES.length]],
                )}
                aria-label="открыть фото"
              >
                <img
                  src={t.src}
                  alt=""
                  loading="lazy"
                  className="w-full h-full object-cover block transition-transform duration-700 group-hover:scale-[1.05]"
                />
                {t.tier && (
                  <div className="absolute top-2.5 left-2.5 inline-flex items-center px-2.5 py-1 rounded-full bg-black/55 backdrop-blur-md border border-white/20 text-[10px] tracking-widest uppercase text-white/95">
                    {TIER[t.tier].label}
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
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
