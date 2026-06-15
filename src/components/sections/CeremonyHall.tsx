import { useState } from 'react';
import { Reveal } from '../ui/Reveal';
import { AgentControlPanel, type SceneSlug } from '../ui/AgentControlPanel';
import { ScenePortal } from './ScenePortal';

/**
 * CeremonyHall — каталог как живая консоль агента.
 *
 * Видимая часть: панель управления (21st.dev / sand-glow) с пятью
 * кнопками сцен. Клик по кнопке открывает ScenePortal — fullscreen
 * оверлей, в котором две плиты ЗАХЛОПЫВАЮТСЯ к центру с краёв
 * экрана (реверс анимации hero) и формируют полное фото сцены.
 */
export function CeremonyHall() {
  const [activeScene, setActiveScene] = useState<SceneSlug | null>(null);

  return (
    <section
      id="hall"
      className="relative px-4 md:px-10 pt-24 md:pt-32 pb-24 md:pb-32 border-t border-ink-900/80"
    >
      <div className="max-w-[1320px] mx-auto">
        <Reveal as="div" className="mb-10 md:mb-14 text-center">
          <p className="eyebrow mb-5">каталог · агентская консоль</p>
          <h2 className="display text-ink-50 text-[clamp(2.2rem,5.4vw,4.4rem)] leading-[1.02] tracking-[-0.02em] max-w-[22ch] mx-auto">
            выбери сцену — экраны схлопнутся и покажут её на весь зал
          </h2>
          <p className="mt-6 max-w-[60ch] mx-auto text-ink-300 text-[15px] md:text-[17px] leading-relaxed">
            пять заранее подготовленных сценариев. агент выбирает нужный с планшета прямо во время церемонии — плиты сходятся к центру и проецируют выбранное на весь экран.
          </p>
        </Reveal>

        <Reveal>
          <AgentControlPanel
            embedded
            onSelect={(slug) => setActiveScene(slug)}
            defaultScene="angels"
          />
        </Reveal>
      </div>

      <ScenePortal scene={activeScene} onClose={() => setActiveScene(null)} />
    </section>
  );
}
