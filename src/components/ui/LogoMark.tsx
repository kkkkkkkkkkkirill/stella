interface LogoMarkProps {
  size?: number;
  withWordmark?: boolean;
  className?: string;
}

/**
 * Точный логотип Stella: три плиты убывающей высоты со скосом
 * правой-верхней грани (как на брендбуке).
 * Если `withWordmark`, добавляется надпись «STELLA» в Audiowide.
 */
export function LogoMark({ size = 28, withWordmark = false, className = '' }: LogoMarkProps) {
  const Slabs = (
    <svg
      viewBox="0 0 200 160"
      width={size}
      height={(size * 160) / 200}
      aria-hidden="true"
      fill="currentColor"
    >
      {/* Большая плита (левая, самая высокая): скос правый-верхний */}
      <path d="M 28 14 L 64 14 L 78 28 L 78 156 L 28 156 Z" />
      {/* Средняя плита: меньше, скос правый-верхний */}
      <path d="M 96 58 L 122 58 L 134 70 L 134 156 L 96 156 Z" />
      {/* Малая плита (правая): самая короткая, скос правый-верхний */}
      <path d="M 152 92 L 172 92 L 182 102 L 182 156 L 152 156 Z" />
    </svg>
  );

  if (!withWordmark) return <span className={className}>{Slabs}</span>;

  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      {Slabs}
      <span
        className="text-current"
        style={{
          fontFamily: 'Audiowide, "Chakra Petch", system-ui, sans-serif',
          letterSpacing: '0.04em',
          fontSize: size * 0.62,
          lineHeight: 1,
          paddingTop: 2,
        }}
      >
        STELLA
      </span>
    </span>
  );
}
