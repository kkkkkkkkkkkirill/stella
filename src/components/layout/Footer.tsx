import { LogoMark } from '../ui/LogoMark';
import { footer, packages } from '../../data/content';

export function Footer() {
  return (
    <footer className="border-t border-ink-900">
      <div className="max-w-[1320px] mx-auto px-6 md:px-10 pt-20 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          <div className="md:col-span-7">
            <div className="mb-6">
              <LogoMark size={36} withWordmark className="text-ink-50" />
            </div>
            <p className="text-ink-300 text-[15px] leading-relaxed max-w-[44ch]">
              {footer.tagline}
            </p>
          </div>

          <div className="md:col-span-5">
            <p className="eyebrow mb-5">пакеты услуг</p>
            <ul className="flex flex-col gap-3 text-[14px]">
              {packages.map((p) => (
                <li key={p.id} className="flex items-baseline justify-between gap-4">
                  <span className="text-ink-200">{p.shortLabel} · {p.fullLabel}</span>
                  <span className="text-ink-400 font-mono text-[12px]">{p.price}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="hairline my-12" />

        <div className="flex flex-col md:flex-row justify-between gap-3 text-[12px] text-ink-500">
          <p>{footer.bottom}</p>
          <p className="font-mono tracking-[0.16em] uppercase text-ink-600">
            stella · digital memorials
          </p>
        </div>
      </div>
    </footer>
  );
}
