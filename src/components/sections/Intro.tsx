import { Reveal } from '../ui/Reveal';
import { intro } from '../../data/content';

export function Intro() {
  return (
    <section id="intro" className="relative px-6 md:px-10 py-24 md:py-36 border-t border-ink-900/80">
      <div className="max-w-[1320px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-10">
        <div className="md:col-span-3">
          <Reveal as="p" className="eyebrow">о stella</Reveal>
        </div>
        <Reveal delay={80} as="div" className="md:col-span-9">
          <p className="display text-ink-50 text-[clamp(1.8rem,3.4vw,2.8rem)] leading-[1.18] max-w-[42ch]">
            {intro.body}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
