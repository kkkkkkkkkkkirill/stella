export const nav = [
  { href: '#hall',    label: 'каталог' },
  { href: '#gallery', label: 'галерея' },
];

export const hero = {
  title: 'память на экране',
  description:
    'экраны для церемонии прощания. готовый сценарий собирается заранее агентом — статичные изображения, портреты и персонализированные видео выводятся на экраны во время церемонии.',
  ctaPrimary: 'смотреть каталог',
};

export const footer = {
  tagline: 'stella — видео- и музыкальное сопровождение ритуальных церемоний.',
  bottom: '© stella, 2026. сайт не является публичной офертой.',
};

// ─── ПАКЕТЫ УСЛУГ ─────────────────────────────────────────────
export type PackageId = 'basic' | 'personal' | 'custom';

export interface PackageInfo {
  id: PackageId;
  shortLabel: string;
  fullLabel: string;
  code: string;
  price: string;
  summary: string;
  features: string[];
}

export const packages: PackageInfo[] = [
  {
    id: 'basic',
    shortLabel: 'услуга №1',
    fullLabel: 'базовый формат',
    code: 'ЦСРЦ 2',
    price: '10 000 ₽',
    summary:
      'статичные изображения и мягкая световая анимация. подходит, если фото нет или важно сдержанное, нейтральное оформление.',
    features: [
      'готовые статичные сцены: природа, свечи, иконы, ангелы',
      'мягкая световая графика',
      'фио, даты, эпитафия — текстом поверх сцены',
      'флаги и символика — по запросу',
    ],
  },
  {
    id: 'personal',
    shortLabel: 'услуга №2',
    fullLabel: 'персонализированный формат',
    code: 'ЦСРЦ 3',
    price: '15 000 ₽',
    summary:
      'личное присутствие через фотографию. портрет в полный рост или вырезка, рамка, до 10 фото или видео.',
    features: [
      'фото в полный рост — или вырезка из любой фотографии',
      'до 10 фотографий или коротких видео в слайд-шоу',
      'рамка чёрная или коричневая, чёрная траурная лента',
      'сценарий по этапам: сбор гостей → начало → ключевые моменты',
    ],
  },
  {
    id: 'custom',
    shortLabel: 'услуга №3',
    fullLabel: 'индивидуальный формат',
    code: 'ЦСРЦ 4',
    price: '25 000 ₽',
    summary:
      'персональный мини-фильм, отражающий историю и характер человека. любые анимации, слои, материалы по пожеланиям семьи.',
    features: [
      '10–20 фотографий и/или видеоматериалов',
      'индивидуальные анимации и визуальные решения',
      'наложения: лепестки, снежинки, частицы, флаги',
      'текст, символика и другие дополнительные элементы',
    ],
  },
];

// ─── СЦЕНЫ ───────────────────────────────────────────────────
// Услуга №1 — все 35 статичных рендеров из ДИЗАЙН.zip.
// Услуги №2 и №3 — анимированные превью (MP4) из ГИФ-АНИМАЦИИ.zip.

export type SceneKind = 'image' | 'video';

export interface Scene {
  id: string;        // image: scene-XX, video: имя mp4 без расширения
  number: number;    // порядковый номер в рамках услуги
  tier: PackageId[];
  kind: SceneKind;
  title?: string;    // подпись для видео
}

const RAW_IMAGE_NUMBERS = [
  1,  2,  3,  4,  5,  6,  7,  8,  9,  10,
  11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
  21, 22, 23, 25, 26, 27, 30, 31, 32, 33,
  34, 35, 36, 37, 40,
];

const basicScenes: Scene[] = RAW_IMAGE_NUMBERS.map((n, i) => ({
  id: `scene-${String(n).padStart(2, '0')}`,
  number: i + 1,
  tier: ['basic'],
  kind: 'image',
}));

const personalScenes: Scene[] = [
  { id: 'personal-static-photo-candles', number: 1, tier: ['personal'], kind: 'video', title: 'статичная фотография и свечи' },
  { id: 'personal-floating-photos',      number: 2, tier: ['personal'], kind: 'video', title: 'слайд-шоу: всплывающие фото' },
  { id: 'personal-framed-slideshow',     number: 3, tier: ['personal'], kind: 'video', title: 'слайд-шоу в рамке и свечи' },
];

const customScenes: Scene[] = [
  { id: 'custom-fullscreen-slideshow', number: 1, tier: ['custom'], kind: 'video', title: 'слайд-шоу на все экраны' },
  { id: 'custom-hall-candles-bg',      number: 2, tier: ['custom'], kind: 'video', title: 'зал и фон со свечами' },
];

export const scenes: Scene[] = [...basicScenes, ...personalScenes, ...customScenes];
