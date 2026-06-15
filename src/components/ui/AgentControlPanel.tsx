import React, { useState } from 'react';
// MOD: меняем Flame на Cross для "иконы" — у 21st.dev был дубль Flame для двух разных сцен
import { Sparkles, Flame, Cross, Hand, Trees } from 'lucide-react';
import { cn } from '@/lib/utils';

type BGVariantType = 'dots' | 'diagonal-stripes' | 'grid' | 'horizontal-lines' | 'vertical-lines' | 'checkerboard';
type BGMaskType =
  | 'fade-center'
  | 'fade-edges'
  | 'fade-top'
  | 'fade-bottom'
  | 'fade-left'
  | 'fade-right'
  | 'fade-x'
  | 'fade-y'
  | 'none';

type BGPatternProps = React.ComponentProps<'div'> & {
  variant?: BGVariantType;
  mask?: BGMaskType;
  size?: number;
  fill?: string;
};

const maskClasses: Record<BGMaskType, string> = {
  'fade-edges': '[mask-image:radial-gradient(ellipse_at_center,var(--background),transparent)]',
  'fade-center': '[mask-image:radial-gradient(ellipse_at_center,transparent,var(--background))]',
  'fade-top': '[mask-image:linear-gradient(to_bottom,transparent,var(--background))]',
  'fade-bottom': '[mask-image:linear-gradient(to_bottom,var(--background),transparent)]',
  'fade-left': '[mask-image:linear-gradient(to_right,transparent,var(--background))]',
  'fade-right': '[mask-image:linear-gradient(to_right,var(--background),transparent)]',
  'fade-x': '[mask-image:linear-gradient(to_right,transparent,var(--background),transparent)]',
  'fade-y': '[mask-image:linear-gradient(to_bottom,transparent,var(--background),transparent)]',
  none: '',
};

function geBgImage(variant: BGVariantType, fill: string, size: number) {
  switch (variant) {
    case 'dots':
      return `radial-gradient(${fill} 1px, transparent 1px)`;
    case 'grid':
      return `linear-gradient(to right, ${fill} 1px, transparent 1px), linear-gradient(to bottom, ${fill} 1px, transparent 1px)`;
    case 'diagonal-stripes':
      return `repeating-linear-gradient(45deg, ${fill}, ${fill} 1px, transparent 1px, transparent ${size}px)`;
    case 'horizontal-lines':
      return `linear-gradient(to bottom, ${fill} 1px, transparent 1px)`;
    case 'vertical-lines':
      return `linear-gradient(to right, ${fill} 1px, transparent 1px)`;
    case 'checkerboard':
      return `linear-gradient(45deg, ${fill} 25%, transparent 25%), linear-gradient(-45deg, ${fill} 25%, transparent 25%), linear-gradient(45deg, transparent 75%, ${fill} 75%), linear-gradient(-45deg, transparent 75%, ${fill} 75%)`;
    default:
      return undefined;
  }
}

const BGPattern = ({
  variant = 'grid',
  mask = 'none',
  size = 24,
  fill = '#252525',
  className,
  style,
  ...props
}: BGPatternProps) => {
  const bgSize = `${size}px ${size}px`;
  const backgroundImage = geBgImage(variant, fill, size);

  return (
    <div
      className={cn('absolute inset-0 z-[-10] size-full', maskClasses[mask], className)}
      style={{
        backgroundImage,
        backgroundSize: bgSize,
        ...style,
      }}
      {...props}
    />
  );
};

// MOD: единый набор слагов проекта
export type SceneSlug = 'angels' | 'icons' | 'candles' | 'candles-hands' | 'nature';

interface Scene {
  slug: SceneSlug;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface AgentControlPanelProps {
  onSelect?: (scene: SceneSlug) => void;
  defaultScene?: SceneSlug;
  // MOD: возможность встроить как блок секции вместо fullscreen-демо
  embedded?: boolean;
}

const scenes: Scene[] = [
  { slug: 'angels',         label: 'ангелы',        icon: Sparkles },
  { slug: 'icons',          label: 'иконы',         icon: Cross }, // MOD: Flame → Cross
  { slug: 'candles',        label: 'свечи',         icon: Flame },
  { slug: 'candles-hands',  label: 'свечи в руках', icon: Hand },  // MOD: slug унифицирован
  { slug: 'nature',         label: 'природа',       icon: Trees },
];

export const AgentControlPanel: React.FC<AgentControlPanelProps> = ({
  onSelect = () => {},
  defaultScene = 'angels',
  embedded = false,
}) => {
  const [activeScene, setActiveScene] = useState<SceneSlug>(defaultScene);

  const handleSceneSelect = (slug: SceneSlug) => {
    setActiveScene(slug);
    onSelect(slug);
  };

  // MOD: если embedded — убираем фуллскрин-обёртку, ставим только панель
  const wrapperClasses = embedded
    ? 'relative w-full flex items-center justify-center p-8 overflow-hidden'
    : 'relative min-h-screen w-full bg-zinc-950 flex items-center justify-center p-8 overflow-hidden';

  return (
    <div className={wrapperClasses}>
      <style>{`
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .glass-button {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow:
            0 8px 32px 0 rgba(0, 0, 0, 0.37),
            inset 0 1px 0 0 rgba(255, 255, 255, 0.05);
        }
        .glass-button:hover {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(255, 255, 255, 0.12);
          box-shadow:
            0 12px 40px 0 rgba(0, 0, 0, 0.45),
            inset 0 1px 0 0 rgba(255, 255, 255, 0.08);
        }
        .glass-button.active {
          background: rgba(189, 168, 138, 0.15);
          border-color: rgba(189, 168, 138, 0.4);
          box-shadow:
            0 12px 40px 0 rgba(189, 168, 138, 0.25),
            inset 0 1px 0 0 rgba(189, 168, 138, 0.2),
            0 0 30px rgba(189, 168, 138, 0.3);
        }
        .control-panel {
          background: rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(40px);
          -webkit-backdrop-filter: blur(40px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow:
            0 20px 60px rgba(0, 0, 0, 0.5),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
        }
      `}</style>

      {!embedded && (
        <>
          <BGPattern variant="grid" mask="fade-edges" size={40} fill="rgba(255, 255, 255, 0.03)" />
          <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-zinc-950 to-black opacity-90" />
        </>
      )}

      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#bda88a] rounded-full blur-[120px] opacity-10 animate-pulse" style={{ animation: 'pulse-glow 4s ease-in-out infinite' }} />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-zinc-700 rounded-full blur-[120px] opacity-10 animate-pulse" style={{ animation: 'pulse-glow 6s ease-in-out infinite', animationDelay: '2s' }} />

      <div className="relative z-10 w-full max-w-6xl">
        <div className="control-panel rounded-3xl p-8 md:p-12">
          <div className="mb-8 text-center">
            <h1 className="text-3xl md:text-4xl font-light text-white mb-2 tracking-wide">
              управление сценами
            </h1>
            <p className="text-zinc-400 text-sm md:text-base font-light tracking-wider">
              выберите церемониальную сцену
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
            {scenes.map((scene) => {
              const Icon = scene.icon;
              const isActive = activeScene === scene.slug;

              return (
                <button
                  key={scene.slug}
                  onClick={() => handleSceneSelect(scene.slug)}
                  className={cn(
                    'glass-button group relative flex flex-col items-center justify-center p-6 md:p-8 rounded-2xl transition-all duration-300 hover:scale-105 active:scale-95',
                    isActive && 'active'
                  )}
                >
                  <div
                    className={cn(
                      'mb-4 p-4 rounded-xl transition-all duration-300',
                      isActive
                        ? 'bg-[#bda88a]/20 text-[#bda88a]'
                        : 'bg-white/5 text-zinc-400 group-hover:bg-white/10 group-hover:text-zinc-300'
                    )}
                  >
                    <Icon className="w-8 h-8 md:w-10 md:h-10" />
                  </div>

                  <span
                    className={cn(
                      'text-sm md:text-base font-medium tracking-wide transition-colors duration-300',
                      isActive ? 'text-[#bda88a]' : 'text-zinc-300 group-hover:text-white'
                    )}
                  >
                    {scene.label}
                  </span>

                  {isActive && (
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#bda88a]/10 to-transparent pointer-events-none" />
                  )}

                  <div
                    className={cn(
                      'absolute bottom-2 left-1/2 -translate-x-1/2 w-12 h-1 rounded-full transition-all duration-300',
                      isActive ? 'bg-[#bda88a] opacity-100' : 'bg-white/20 opacity-0 group-hover:opacity-50'
                    )}
                  />
                </button>
              );
            })}
          </div>

          <div className="mt-8 flex items-center justify-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#bda88a] animate-pulse" />
            <span className="text-xs text-zinc-500 font-mono tracking-wider">
              СИСТЕМА АКТИВНА
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
