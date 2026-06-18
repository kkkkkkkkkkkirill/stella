export const nav = [
  { href: '#hall',     label: 'Каталог' },
  { href: '#showcase', label: 'Как это выглядит' },
];

export const hero = {
  title: 'Память на экране',
  description:
    'Экраны для церемонии прощания. Готовый сценарий собирается заранее агентом — статичные изображения, портреты и персонализированные видео выводятся на экраны во время церемонии.',
  ctaPrimary: 'Смотреть каталог',
};

export const footer = {
  tagline: 'Stella — видео- и музыкальное сопровождение ритуальных церемоний.',
  bottom: '© stella, 2026. Сайт не является публичной офертой.',
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
    shortLabel: 'Услуга №1',
    fullLabel: 'Базовый формат',
    code: 'ЦСРЦ 2',
    price: '10 000 ₽',
    summary:
      'Статичные изображения и мягкая световая анимация. Подходит, если фото нет или важно сдержанное, нейтральное оформление.',
    features: [
      'Готовые статичные сцены: природа, свечи, иконы, ангелы',
      'Мягкая световая графика',
      'Флаги и символика — по запросу',
    ],
  },
  {
    id: 'personal',
    shortLabel: 'Услуга №2',
    fullLabel: 'Персонализированный формат',
    code: 'ЦСРЦ 3',
    price: '15 000 ₽',
    summary:
      'Личное присутствие через фотографию. Портрет в полный рост или вырезка, рамка, до 10 фото или видео.',
    features: [
      'Фото в полный рост — или вырезка из любой фотографии',
      'До 10 фотографий или коротких видео в слайд-шоу',
      'Рамка чёрная или коричневая, чёрная траурная лента',
      'Сценарий по этапам: сбор гостей → начало → ключевые моменты',
    ],
  },
  {
    id: 'custom',
    shortLabel: 'Услуга №3',
    fullLabel: 'Индивидуальный формат',
    code: 'ЦСРЦ 4',
    price: '25 000 ₽',
    summary:
      'Персональный мини-фильм, отражающий историю и характер человека. Любые анимации, слои, материалы по пожеланиям семьи.',
    features: [
      '10–20 фотографий и/или видеоматериалов',
      'Индивидуальные анимации и визуальные решения',
      'Наложения: лепестки, снежинки, частицы, флаги',
      'Текст, символика и другие дополнительные элементы',
    ],
  },
];

// ─── СЦЕНЫ ───────────────────────────────────────────────────
// Услуга №1 — анимация свечей + 38 статичных рендеров (обновлённые
//   ШАБЛОНЫ ЭКРАНОВ, нумерация 1–40 без №3 и №11).
// Услуга №2 — фото в рамке и свечи, слайд-шоу в рамке.
// Услуга №3 — слайд-шоу на все экраны, всплывающие фото, флаг.
// Все анимации — MP4, перегнаны из ГИФ-АНИМАЦИИ.zip.

export type SceneKind = 'image' | 'video';

export interface Scene {
  id: string;        // image: scene-XX, video: имя mp4 без расширения
  number: number;    // порядковый номер в рамках услуги
  tier: PackageId[];
  kind: SceneKind;
  title?: string;    // подпись для видео
  spread?: string;   // id картинки «экраны раздвинуты» для fade-перехода
}

// Анимация свечей открывает услугу №1 (мягкая световая графика).
const basicVideos: Scene[] = [
  { id: 'candles-wall',    number: 1, tier: ['basic'], kind: 'video', title: 'Зал и фон со свечами' },
  { id: 'candle-in-hands', number: 2, tier: ['basic'], kind: 'video', title: 'Свеча в руках' },
];

// 42 новых статичных экрана (ЭКРАНЫ РЯДОМ). У части есть «раздвинутая»
// версия (ЭКРАНЫ ПОДЕЛЕНЫ) — для них в просмотрщике появляется кнопка
// «раздвинуть» (плавный fade), а в каталоге — бейдж «можно раздвинуть».
const SPREADABLE = [
  2, 3, 4, 5, 8, 10, 11, 12, 13, 14, 15, 21, 22, 23, 24, 29, 37, 38, 39, 40, 41, 42,
];

const basicScenes: Scene[] = Array.from({ length: 42 }, (_, i) => {
  const n = i + 1;
  const id = `scene-${String(n).padStart(2, '0')}`;
  return {
    id,
    number: basicVideos.length + n,
    tier: ['basic'],
    kind: 'image',
    spread: SPREADABLE.includes(n) ? `${id}-apart` : undefined,
  };
});

const personalScenes: Scene[] = [
  { id: 'photo-candles',    number: 1, tier: ['personal'], kind: 'video', title: 'Статичная фотография и свечи' },
  { id: 'framed-slideshow', number: 2, tier: ['personal'], kind: 'video', title: 'Слайд-шоу в рамке и свечи' },
];

const customScenes: Scene[] = [
  { id: 'fullscreen-slideshow', number: 1, tier: ['custom'], kind: 'video', title: 'Фильм о жизни на все экраны' },
  { id: 'floating-photos',      number: 2, tier: ['custom'], kind: 'video', title: 'Слайд-шоу: всплывающие фото' },
  { id: 'flag',                 number: 3, tier: ['custom'], kind: 'video', title: 'Портрет, эпитафия и флаг' },
];

export const scenes: Scene[] = [...basicVideos, ...basicScenes, ...personalScenes, ...customScenes];
