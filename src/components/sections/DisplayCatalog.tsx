import { SectionHeading } from '../ui/SectionHeading';
import { Reveal } from '../ui/Reveal';
import { catalog } from '../../data/content';
import { visualFor } from './CategoryVisuals';

// Bento-сетка: первая карточка широкая (портрет — ключевой контент),
// остальные четыре — в две строки по две. На карточках бесконечная
// микро-анимация, специфичная для категории.
const layout = ['wide', 'narrow', 'narrow', 'narrow', 'narrow'];

export function DisplayCatalog() {
  return (
    <section
      id="catalog"
      className="relative px-6 md:px-10 py-24 md:py-36 border-t border-ink-900/80"
    >
      <div className="max-w-[1320px] mx-auto">
        <SectionHeading
          eyebrow={catalog.eyebrow}
          title={catalog.title}
          intro={catalog.intro}
        />

        <div className="mt-16 md:mt-24 grid grid-cols-1 md:grid-cols-6 gap-4 md:gap-6">
          {catalog.items.map((item, idx) => {
            const span = layout[idx] === 'wide' ? 'md:col-span-4' : 'md:col-span-2';
            const aspect = layout[idx] === 'wide' ? 'aspect-[16/10]' : 'aspect-[4/5]';
            return (
              <Reveal key={item.slug} delay={idx * 80} className={span}>
                <article className="group surface-card rounded-2xl overflow-hidden">
                  <div className={`relative ${aspect} overflow-hidden`}>
                    {visualFor(item.slug)}
                    {/* мягкое затемнение к подписи внизу */}
                    <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/55 to-transparent pointer-events-none" />
                    <span className="absolute top-4 left-4 eyebrow text-ink-200/85">
                      0{idx + 1} · {item.sub}
                    </span>
                  </div>
                  <div className="p-6 md:p-7">
                    <h3 className="display text-ink-50 text-[clamp(22px,2.4vw,30px)] leading-tight mb-2">
                      {item.title}
                    </h3>
                    <p className="text-ink-300 text-[14px] md:text-[15px] leading-relaxed max-w-[42ch]">
                      {item.text}
                    </p>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
