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
// Все 35 рендеров из ДИЗАЙН.zip — это статика, относятся к услуге №1.
// Для услуг №2/№3 пока стоят плейсхолдеры (дизайнер готовит варианты).

export interface Scene {
  id: string;
  number: number;
  tier: PackageId[];
  placeholder?: boolean;
  // подпись, если placeholder
  placeholderTitle?: string;
}

const RAW_NUMBERS = [
  1,  2,  3,  4,  5,  6,  7,  8,  9,  10,
  11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
  21, 22, 23, 25, 26, 27, 30, 31, 32, 33,
  34, 35, 36, 37, 40,
];

const realScenes: Scene[] = RAW_NUMBERS.map((n) => ({
  id: `scene-${String(n).padStart(2, '0')}`,
  number: n,
  tier: ['basic'],
}));

const placeholderScenes: Scene[] = [
  // услуга №2
  { id: 'placeholder-p1', number: 1, tier: ['personal'], placeholder: true, placeholderTitle: 'портрет в полный рост' },
  { id: 'placeholder-p2', number: 2, tier: ['personal'], placeholder: true, placeholderTitle: 'портрет с эпитафией' },
  { id: 'placeholder-p3', number: 3, tier: ['personal'], placeholder: true, placeholderTitle: 'слайд-шоу до 10 фото' },
  // услуга №3
  { id: 'placeholder-c1', number: 1, tier: ['custom'], placeholder: true, placeholderTitle: 'персональный мини-фильм' },
  { id: 'placeholder-c2', number: 2, tier: ['custom'], placeholder: true, placeholderTitle: 'фото с авторской анимацией' },
  { id: 'placeholder-c3', number: 3, tier: ['custom'], placeholder: true, placeholderTitle: 'слои: лепестки, частицы, символика' },
];

export const scenes: Scene[] = [...realScenes, ...placeholderScenes];
