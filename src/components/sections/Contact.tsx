import { useState, type FormEvent } from 'react';
import { ArrowRight } from 'lucide-react';
import { SectionHeading } from '../ui/SectionHeading';
import { Reveal } from '../ui/Reveal';
import { contact } from '../../data/content';

const slug = (s: string) =>
  `f-${s.replace(/\s+/g, '-').replace(/[^\p{L}\p{N}-]/gu, '').toLowerCase()}`;

const inputCls =
  'w-full bg-transparent border-b border-white/15 text-ink-50 placeholder:text-ink-500 py-3 text-[15px] outline-none transition-colors duration-300 ease-out hover:border-white/30 focus:border-sand-500';

export function Contact() {
  const [sent, setSent] = useState(false);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: подключить отправку заявки в CRM или почту менеджера.
    setSent(true);
  };

  return (
    <section
      id="contact"
      className="relative px-6 md:px-10 py-24 md:py-36 border-t border-ink-900/80"
    >
      <div className="max-w-[1320px] mx-auto">
        <SectionHeading
          eyebrow={contact.eyebrow}
          title={contact.title}
          intro={contact.intro}
        />

        <div className="mt-16 md:mt-24 grid grid-cols-1 lg:grid-cols-12 gap-10">
          <Reveal as="div" className="lg:col-span-7">
            <form onSubmit={onSubmit} className="surface-card rounded-2xl p-7 md:p-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-x-10">
                <div className="flex flex-col gap-2">
                  <label htmlFor={slug('имя')} className="eyebrow">имя</label>
                  <input id={slug('имя')} className={inputCls} type="text" autoComplete="name" required placeholder="как к вам обращаться" />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor={slug('телефон')} className="eyebrow">телефон</label>
                  <input id={slug('телефон')} className={inputCls} type="tel" inputMode="tel" required placeholder="+7" />
                </div>
                <div className="md:col-span-2 flex flex-col gap-2">
                  <label htmlFor={slug('город')} className="eyebrow">город</label>
                  <input id={slug('город')} className={inputCls} type="text" placeholder="москва, мо или другой город" />
                </div>
                <div className="md:col-span-2 flex flex-col gap-2">
                  <label htmlFor={slug('комментарий')} className="eyebrow">комментарий</label>
                  <textarea
                    id={slug('комментарий')}
                    rows={4}
                    className={`${inputCls} resize-none`}
                    placeholder="дата церемонии, пожелания, контакт для связи"
                  />
                </div>
              </div>

              <div className="mt-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
                <p className="text-[12px] text-ink-500 max-w-[44ch] leading-relaxed">
                  отправляя форму, вы соглашаетесь с обработкой данных для подготовки сценария.
                </p>
                <button
                  type="submit"
                  disabled={sent}
                  className="inline-flex items-center justify-center gap-2 bg-ink-50 text-ink-950 text-[14px] font-medium rounded-full pl-6 pr-5 py-3.5 hover:bg-white disabled:opacity-60 transition-colors duration-300 ease-out"
                >
                  {sent ? 'отправлено' : 'отправить заявку'}
                  {!sent && <ArrowRight size={15} strokeWidth={1.8} />}
                </button>
              </div>
            </form>
          </Reveal>

          <Reveal delay={120} as="div" className="lg:col-span-5">
            <div className="surface-card rounded-2xl p-6 md:p-8">
              <p className="eyebrow mb-6">контакт</p>
              <ul className="flex flex-col">
                {contact.blocks.map((b, i) => (
                  <li key={b.label} className={i === 0 ? '' : 'border-t border-white/8'}>
                    <a href={b.href} className="group flex items-baseline justify-between gap-6 py-4">
                      <span className="text-[12px] text-ink-500 shrink-0 w-32">{b.label}</span>
                      <span className="text-ink-100 text-[14.5px] md:text-[15px] text-right group-hover:text-ink-50 transition-colors duration-300 ease-out">
                        {b.value}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
