import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react';

interface RevealProps {
  children: ReactNode;
  delay?: number;
  as?: 'div' | 'section' | 'article' | 'li' | 'p' | 'span' | 'header';
  className?: string;
  id?: string;
}

export function Reveal({ children, delay = 0, as = 'div', className = '', id }: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') {
      el.classList.add('is-visible');
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const style: CSSProperties = { ['--reveal-delay' as string]: `${delay}ms` };
  const Tag = as as 'div';
  return (
    <Tag
      ref={ref as React.MutableRefObject<HTMLDivElement | null>}
      id={id}
      style={style}
      className={`reveal ${className}`}
    >
      {children}
    </Tag>
  );
}
