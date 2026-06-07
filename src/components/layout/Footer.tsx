import { LogoMark } from '../ui/LogoMark';
import { footer, contact } from '../../data/content';

export function Footer() {
  return (
    <footer className="border-t border-ink-900">
      <div className="max-w-[1320px] mx-auto px-6 md:px-10 pt-20 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          <div className="md:col-span-6">
            <div className="mb-6">
              <LogoMark size={36} withWordmark className="text-ink-50" />
            </div>
            <p className="text-ink-300 text-[15px] leading-relaxed max-w-[42ch]">
              {footer.tagline}
            </p>
          </div>

          <div className="md:col-span-3">
            <p className="eyebrow mb-5">контакт</p>
            <ul className="flex flex-col gap-3 text-[14px]">
              {contact.blocks.map((b) => (
                <li key={b.label}>
                  <a href={b.href} className="text-ink-200 hover:text-ink-50 transition-colors duration-300 ease-out">
                    {b.value}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-3">
            <p className="eyebrow mb-5">направления</p>
            <ul className="flex flex-col gap-3 text-[14px]">
              <li className="text-ink-200">портреты</li>
              <li className="text-ink-200">свечи</li>
              <li className="text-ink-200">облака</li>
              <li className="text-ink-200">ангелы</li>
              <li className="text-ink-200">птицы</li>
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
