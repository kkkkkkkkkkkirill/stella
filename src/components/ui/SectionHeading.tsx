import type { ReactNode } from 'react';
import { Reveal } from './Reveal';

interface SectionHeadingProps {
  eyebrow?: string;
  title: ReactNode;
  intro?: ReactNode;
  align?: 'left' | 'split';
}

export function SectionHeading({ eyebrow, title, intro, align = 'split' }: SectionHeadingProps) {
  if (align === 'left') {
    return (
      <header className="max-w-[64ch]">
        {eyebrow && (
          <Reveal as="p" className="eyebrow mb-6">{eyebrow}</Reveal>
        )}
        <Reveal>
          <h2 className="display text-[clamp(2.4rem,6vw,5rem)] text-ink-50 mb-6">{title}</h2>
        </Reveal>
        {intro && (
          <Reveal delay={80} as="p" className="text-ink-300 text-[15px] md:text-[17px] leading-relaxed">
            {intro}
          </Reveal>
        )}
      </header>
    );
  }
  return (
    <header className="grid grid-cols-1 md:grid-cols-12 gap-y-8 md:gap-x-16 items-end">
      <Reveal as="div" className="md:col-span-8">
        {eyebrow && <p className="eyebrow mb-5">{eyebrow}</p>}
        <h2 className="display text-[clamp(2.4rem,6.5vw,5.5rem)] text-ink-50">{title}</h2>
      </Reveal>
      {intro && (
        <Reveal delay={80} as="div" className="md:col-span-4 md:pb-4">
          <p className="text-ink-300 text-[15px] md:text-[16px] leading-relaxed max-w-[42ch]">
            {intro}
          </p>
        </Reveal>
      )}
    </header>
  );
}
