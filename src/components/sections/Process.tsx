import { SectionHeading } from '../ui/SectionHeading';
import { Reveal } from '../ui/Reveal';
import { process } from '../../data/content';

// Подход и процесс в одну колонку, нумерованный таймлайн с тонкой
// вертикальной линией, как у редакционной хроники.
export function Process() {
  return (
    <section
      id="process"
      className="relative px-6 md:px-10 py-24 md:py-36 border-t border-ink-900/80"
    >
      <div className="max-w-[1320px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-20">
        <div className="md:col-span-5 md:sticky md:top-32 self-start">
          <SectionHeading
            eyebrow={process.eyebrow}
            title={process.title}
            align="left"
            intro="агент берёт на себя всю организационную часть. вы участвуете только в принципиальных решениях."
          />
        </div>

        <div className="md:col-span-7">
          <ol className="relative">
            <span aria-hidden="true" className="absolute left-[18px] top-2 bottom-2 w-px bg-white/10" />
            {process.steps.map((step, i) => (
              <Reveal as="li" key={step.no} delay={i * 90}>
                <div className="grid grid-cols-[36px_1fr] gap-5 md:gap-7 py-6 md:py-8">
                  <div className="relative">
                    <span className="relative z-10 grid place-items-center w-9 h-9 rounded-full bg-ink-950 border border-ink-700 font-mono text-[11px] text-ink-200 tabular-nums">
                      {step.no}
                    </span>
                  </div>
                  <div className="pt-1">
                    <h3 className="display text-ink-50 text-[clamp(20px,2vw,26px)] leading-[1.1] mb-2">
                      {step.title}
                    </h3>
                    <p className="text-ink-300 text-[14.5px] md:text-[15px] leading-relaxed max-w-[42ch]">
                      {step.text}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
