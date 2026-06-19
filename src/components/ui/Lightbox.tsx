import { useCallback, useEffect, useRef, useState } from 'react';
import { X, ChevronLeft, ChevronRight, Columns2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface LightboxItem {
  src?: string;
  poster?: string;
  kind: 'image' | 'video';
  title?: string;
  /** картинка «экраны раздвинуты»: если задана — показываем кнопку
   *  «раздвинуть» с плавным fade-переходом между вместе/раздельно */
  spreadSrc?: string;
}

/**
 * Полноэкранный просмотрщик: листалка ←→ (стрелки, клавиши, не закрывая),
 * крестик / клик по фону / Esc — закрыть. Для сцен с готовым рендером
 * «раздвинуто» — кнопка «раздвинуть» с плавным fade-переходом.
 */
export function Lightbox({
  items,
  index,
  onIndex,
  onClose,
}: {
  items: LightboxItem[];
  index: number;
  onIndex: (i: number) => void;
  onClose: () => void;
}) {
  const [shown, setShown] = useState(false);
  const [split, setSplit] = useState(false);
  const [dx, setDx] = useState(0);          // горизонтальный сдвиг слайда, px
  const [op, setOp] = useState(1);          // прозрачность слайда
  const [trans, setTrans] = useState(false); // включена ли анимация
  const touch = useRef<{ x: number; y: number; drag: boolean } | null>(null);

  const close = useCallback(() => {
    setShown(false);
    window.setTimeout(onClose, 250);
  }, [onClose]);

  // листание: короткий push (~22% ширины) + кроссфейд. Подмена кадра прячется
  // в момент прозрачности — почти без чёрного зазора, быстро (~300 мс).
  const nav = useCallback(
    (dir: number, fromX = 0) => {
      const ni = index + dir;
      const w = window.innerWidth;
      if (ni < 0 || ni >= items.length) {
        setTrans(true);
        setDx(0);
        setOp(1);
        return;
      }
      const out = Math.max(w * 0.22, Math.abs(fromX) + 40);
      setTrans(true);
      setDx(-dir * out);
      setOp(0);
      window.setTimeout(() => {
        setSplit(false);
        onIndex(ni);
        setTrans(false);
        setDx(dir * w * 0.22); // новый кадр — чуть сбоку, прозрачный
        setOp(0);
        requestAnimationFrame(() =>
          requestAnimationFrame(() => {
            setTrans(true);
            setDx(0);
            setOp(1);
          }),
        );
      }, 160);
    },
    [index, items.length, onIndex],
  );

  // жест пальцем: контент следует за пальцем, на отпускании — доводка/отскок
  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.changedTouches[0];
    touch.current = { x: t.clientX, y: t.clientY, drag: false };
    setTrans(false);
  };
  const onTouchMove = (e: React.TouchEvent) => {
    if (!touch.current) return;
    const t = e.changedTouches[0];
    const mx = t.clientX - touch.current.x;
    const my = t.clientY - touch.current.y;
    if (!touch.current.drag) {
      if (Math.abs(mx) > 8 && Math.abs(mx) > Math.abs(my)) touch.current.drag = true;
      else if (Math.abs(my) > 12) { touch.current = null; return; }
      else return;
    }
    // сопротивление на краях (некуда листать)
    const edge = (mx > 0 && index === 0) || (mx < 0 && index === items.length - 1);
    const v = edge ? mx * 0.3 : mx;
    setDx(v);
    setOp(1 - Math.min(Math.abs(v) / window.innerWidth, 1) * 0.35);
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touch.current) return;
    const drag = touch.current.drag;
    const mx = e.changedTouches[0].clientX - touch.current.x;
    touch.current = null;
    if (!drag) return;
    if (Math.abs(mx) > 55) nav(mx < 0 ? 1 : -1, mx);
    else { setTrans(true); setDx(0); setOp(1); }
  };

  useEffect(() => {
    const raf = requestAnimationFrame(() => setShown(true));
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowLeft') nav(-1);
      else if (e.key === 'ArrowRight') nav(1);
    };
    window.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [close, nav]);

  const item = items[index];
  if (!item) return null;

  const isVideo = item.kind === 'video';
  const canSplit = !!item.spreadSrc;
  const hasPrev = index > 0;
  const hasNext = index < items.length - 1;

  return (
    <div
      className={cn(
        'fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-10 transition-opacity duration-300',
        shown ? 'opacity-100' : 'opacity-0',
      )}
      onClick={close}
      role="dialog"
      aria-modal="true"
    >
      <div className="absolute inset-0 bg-black/85 backdrop-blur-md" />

      <button
        type="button"
        onClick={close}
        aria-label="закрыть"
        className="fixed top-4 right-4 sm:top-6 sm:right-6 z-20 w-11 h-11 rounded-full flex items-center justify-center text-white bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 transition-colors"
      >
        <X size={20} strokeWidth={1.8} />
      </button>

      <div
        onClick={(e) => e.stopPropagation()}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        className={cn(
          'relative transition-all duration-300 touch-pan-y',
          shown ? 'opacity-100 scale-100' : 'opacity-0 scale-95',
        )}
      >
        <div
          className="relative overflow-hidden rounded-2xl bg-black shadow-2xl will-change-transform"
          style={{
            transform: `translateX(${dx}px)`,
            opacity: op,
            transition: trans
              ? 'transform 160ms cubic-bezier(0.33,0,0.2,1), opacity 160ms ease'
              : 'none',
          }}
        >
          {/* «вместе» задаёт размер; «раздельно» лежит сверху и плавно
              проявляется по кнопке «раздвинуть» (cross-fade). Работает
              и для фото, и для видео-анимаций. */}
          <div className="relative">
            {isVideo ? (
              <video
                src={item.src}
                poster={item.poster}
                autoPlay
                loop
                muted
                playsInline
                className="block max-w-[92vw] max-h-[84vh] w-auto h-auto"
              />
            ) : (
              <img
                src={item.src}
                alt={item.title ?? ''}
                className="block max-w-[92vw] max-h-[84vh] w-auto h-auto"
              />
            )}
            {canSplit && (
              isVideo ? (
                <video
                  src={item.spreadSrc}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out pointer-events-none"
                  style={{ opacity: split ? 1 : 0 }}
                />
              ) : (
                <img
                  src={item.spreadSrc}
                  alt=""
                  aria-hidden="true"
                  className="absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out"
                  style={{ opacity: split ? 1 : 0 }}
                />
              )
            )}
          </div>

          {item.title && (
            <div className="absolute left-4 bottom-4 px-3 py-1.5 rounded-full bg-black/55 backdrop-blur-md border border-white/15 text-[11px] tracking-[0.18em] uppercase text-white/90">
              {item.title}
            </div>
          )}

          {canSplit && (
            <button
              type="button"
              onClick={() => setSplit((s) => !s)}
              aria-pressed={split}
              className={cn(
                'absolute right-4 bottom-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full backdrop-blur-md border text-[11px] tracking-[0.16em] uppercase transition-colors',
                split
                  ? 'bg-white text-ink-950 border-white'
                  : 'bg-black/55 text-white/90 border-white/15 hover:bg-black/75',
              )}
            >
              <Columns2 size={14} strokeWidth={1.8} />
              {split ? 'сдвинуть' : 'раздвинуть'}
            </button>
          )}
        </div>
      </div>

      {items.length > 1 && (
        <>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); nav(-1); }}
            disabled={!hasPrev}
            aria-label="предыдущее"
            className={cn(
              'fixed left-3 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full flex items-center justify-center text-white transition-all',
              hasPrev
                ? 'bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20'
                : 'bg-white/5 opacity-30 cursor-not-allowed',
            )}
          >
            <ChevronLeft size={22} strokeWidth={1.7} />
          </button>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); nav(1); }}
            disabled={!hasNext}
            aria-label="следующее"
            className={cn(
              'fixed right-3 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full flex items-center justify-center text-white transition-all',
              hasNext
                ? 'bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20'
                : 'bg-white/5 opacity-30 cursor-not-allowed',
            )}
          >
            <ChevronRight size={22} strokeWidth={1.7} />
          </button>

          <div className="fixed left-1/2 -translate-x-1/2 bottom-5 z-20 px-4 py-1.5 rounded-full bg-black/55 backdrop-blur-md border border-white/15 text-[11px] font-mono tracking-widest text-white/90">
            {String(index + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}
          </div>
        </>
      )}
    </div>
  );
}
