import { useEffect, useState } from 'react';
import { LogoMark } from '../ui/LogoMark';
import { nav } from '../../data/content';

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <nav
        className={`flex items-center justify-between gap-4 px-4 md:px-10 transition-all duration-500 ease-out ${
          scrolled ? 'py-3' : 'py-5 md:py-6'
        }`}
        aria-label="главная навигация"
      >
        <a
          href="#top"
          className="glass rounded-full pl-3 pr-5 py-2 flex items-center hover:bg-white/[0.06] transition-colors duration-300 ease-out"
          aria-label="на главную, stella"
        >
          <LogoMark size={22} withWordmark className="text-ink-50" />
        </a>

        <ul className="hidden md:flex items-center gap-0.5 glass rounded-full px-2 py-1.5">
          {nav.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-ink-200 hover:text-ink-50 transition-colors duration-300 ease-out text-[13px] px-4 py-2 rounded-full"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* пустой правый блок — чтобы flex justify-between сохранил геометрию */}
        <span className="w-[44px]" aria-hidden="true" />
      </nav>
    </header>
  );
}
