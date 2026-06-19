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
  { id: 'candles-wall',      number: 1, tier: ['basic'], kind: 'video', title: 'Зал и фон со свечами', spread: 'candles-wall-apart' },
  { id: 'candle-in-hands',   number: 2, tier: ['basic'], kind: 'video', title: 'Свеча в руках' },
  { id: 'candle-in-hands-2', number: 3, tier: ['basic'], kind: 'video', title: 'Свеча в руках · 2' },
];

// 42 статичных экрана (ЭКРАНЫ РЯДОМ). Карта раздвижения задаётся явно:
// together-id → apart-файл. Часть пар переназначена вручную (пульт каталога),
// не по номеру. Для сцен из карты в просмотрщике есть кнопка «раздвинуть»
// (плавный fade), а в каталоге — бейдж «можно раздвинуть».
const SPREAD_MAP: Record<string, string> = {
  'scene-02': 'scene-02-apart',
  'scene-03': 'scene-03-apart',
  'scene-04': 'scene-04-apart',
  'scene-10': 'scene-10-apart',
  'scene-11': 'scene-11-apart',
  'scene-12': 'scene-12-apart',
  'scene-13': 'scene-21-apart',
  'scene-14': 'scene-14-apart',
  'scene-15': 'scene-15-apart',
  'scene-19': 'scene-08-apart',
  'scene-21': 'scene-22-apart',
  'scene-23': 'scene-23-apart',
  'scene-24': 'scene-24-apart',
  'scene-29': 'scene-29-apart',
  'scene-37': 'scene-37-apart',
  'scene-38': 'scene-38-apart',
  'scene-39': 'scene-39-apart',
  'scene-40': 'scene-40-apart',
};
// Сцены, убранные из каталога.
const DELETED = new Set<string>(['scene-22', 'scene-41', 'scene-42']);

const basicScenes: Scene[] = [];
for (let n = 1, num = basicVideos.length; n <= 42; n += 1) {
  const id = `scene-${String(n).padStart(2, '0')}`;
  if (DELETED.has(id)) continue;
  num += 1;
  basicScenes.push({ id, number: num, tier: ['basic'], kind: 'image', spread: SPREAD_MAP[id] });
}

const personalScenes: Scene[] = [
  { id: 'photo-candles',    number: 1, tier: ['personal'], kind: 'video', title: 'Фото в рамке и свечи', spread: 'photo-candles-apart' },
  { id: 'framed-slideshow', number: 2, tier: ['personal'], kind: 'video', title: 'Слайд-шоу в рамке и свечи', spread: 'framed-slideshow-apart' },
  { id: 'slide-noframe',    number: 3, tier: ['personal'], kind: 'video', title: 'Слайд-шоу без рамки' },
];

const customScenes: Scene[] = [
  { id: 'fullscreen-slideshow', number: 1, tier: ['custom'], kind: 'video', title: 'Фильм о жизни на все экраны', spread: 'fullscreen-slideshow-apart' },
  { id: 'flag',                 number: 2, tier: ['custom'], kind: 'video', title: 'Портрет, эпитафия и флаг', spread: 'flag-apart' },
];

// Порядок каталога. scene-39 вынесена на 2-е место (по просьбе).
export const scenes: Scene[] = (() => {
  const all = [...basicVideos, ...basicScenes, ...personalScenes, ...customScenes];
  const i = all.findIndex((s) => s.id === 'scene-39');
  if (i > 1) {
    const [s] = all.splice(i, 1);
    all.splice(1, 0, s);
  }
  return all;
})();
