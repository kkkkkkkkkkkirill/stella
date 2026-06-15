import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import type { SceneSlug } from '../ui/AgentControlPanel';

import angelsImg       from '../../assets/hall/angels.jpg';
import iconsImg        from '../../assets/hall/icons.jpg';
import candlesImg      from '../../assets/hall/candles.jpg';
import candlesHandsImg from '../../assets/hall/candles-hands.jpg';
import natureImg       from '../../assets/hall/nature.jpg';

const sceneImages: Record<SceneSlug, string> = {
  'angels':        angelsImg,
  'icons':         iconsImg,
  'candles':       candlesImg,
  'candles-hands': candlesHandsImg,
  'nature':        natureImg,
};

const sceneTitles: Record<SceneSlug, string> = {
  'angels':        'ангелы',
  'icons':         'иконы',
  'candles':       'свечи',
  'candles-hands': 'свечи в руках',
  'nature':        'природа',
};

interface ScenePortalProps {
  scene: SceneSlug | null;
  onClose: () => void;
}

/**
 * ScenePortal — реверс-анимация ворот. Когда агент выбирает сцену,
 * две плиты прилетают с краёв viewport к центру (зеркально hero) и
 * стыкуются в полное фото зала. Между плитами — узкий световой шов
 * закрывается. Esc или клик по X возвращает к панели управления.
 */
export function ScenePortal({ scene, onClose }: ScenePortalProps) {
  // Блокируем скролл страницы пока портал открыт + Esc для закрытия
  useEffect(() => {
    if (!scene) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [scene, onClose]);

  return (
    <AnimatePresence>
      {scene && (
        <motion.div
          key="portal-root"
          initial={{ opacity: 1 }}
          exit={{ opacity: 1 }}
          className="fixed inset-0 z-[100] overflow-hidden bg-black"
          aria-modal="true"
          role="dialog"
        >
          {/* СВЕТЛЫЙ ПРОЁМ — пока плиты в пути, между ними тёплый луч */}
          <motion.div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 1 }}
            transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
            style={{
              background:
                'radial-gradient(60% 90% at 50% 55%, rgba(255,245,220,0.95) 0%, rgba(255,235,200,0.55) 25%, rgba(220,210,190,0.18) 55%, transparent 80%)',
            }}
          />

          {/* СМЕНА КАРТИНКИ: разные сцены — разные key, чтобы AnimatePresence
              корректно докатил предыдущую сцену перед монтированием новой. */}
          <AnimatePresence mode="sync">
            <motion.div key={`scene-${scene}`} className="absolute inset-0">
              {/* ЛЕВАЯ ПЛИТА: летит с -100% к 0, clip правую половину */}
              <motion.div
                aria-hidden="true"
                className="absolute inset-0 bg-cover bg-center will-change-transform"
                style={{
                  backgroundImage: `url(${sceneImages[scene]})`,
                  clipPath: 'inset(0 50% 0 0)',
                }}
                initial={{ x: '-100%' }}
                animate={{ x: '0%' }}
                exit={{ x: '-100%' }}
                transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
              />
              {/* ПРАВАЯ ПЛИТА: с +100% к 0 */}
              <motion.div
                aria-hidden="true"
                className="absolute inset-0 bg-cover bg-center will-change-transform"
                style={{
                  backgroundImage: `url(${sceneImages[scene]})`,
                  clipPath: 'inset(0 0 0 50%)',
                }}
                initial={{ x: '100%' }}
                animate={{ x: '0%' }}
                exit={{ x: '100%' }}
                transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
              />
            </motion.div>
          </AnimatePresence>

          {/* UI: подпись + кнопка закрытия. Появляются ПОСЛЕ закрытия плит. */}
          <motion.div
            className="absolute top-6 right-6 z-10"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5, delay: 1.2, ease: 'easeOut' }}
          >
            <button
              onClick={onClose}
              aria-label="закрыть сцену"
              className="w-11 h-11 rounded-full flex items-center justify-center text-white/85 hover:text-white transition-colors"
              style={{
                background: 'rgba(0,0,0,0.45)',
                backdropFilter: 'blur(14px)',
                WebkitBackdropFilter: 'blur(14px)',
                border: '1px solid rgba(255,255,255,0.18)',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08)',
              }}
            >
              <X size={18} strokeWidth={1.6} />
            </button>
          </motion.div>

          <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 text-center"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.6, delay: 1.4, ease: 'easeOut' }}
          >
            <div
              className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full"
              style={{
                background: 'rgba(0,0,0,0.5)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: '1px solid rgba(255,255,255,0.15)',
              }}
            >
              <span className="w-2 h-2 rounded-full bg-[#bda88a] animate-pulse" />
              <span className="text-[12px] tracking-[0.22em] uppercase text-white/85 font-mono">
                сцена · {sceneTitles[scene]}
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
