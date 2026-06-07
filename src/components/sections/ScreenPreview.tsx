// Секция «как это выглядит на экране» — ContainerScroll из 21st.dev
// крутит «монитор» на скролле и внутри показываем превью композиции.
import { ContainerScroll } from '../ui/ContainerScroll';
import { CandlesVisual, PortraitVisual, BirdsVisual } from './CategoryVisuals';

export function ScreenPreview() {
  return (
    <section className="relative bg-ink-950" id="screen-preview">
      <ContainerScroll
        titleComponent={
          <>
            <p className="eyebrow mb-5">вот как это выглядит на экране</p>
            <h2 className="display text-ink-50 text-[clamp(2.2rem,5vw,4.4rem)] leading-[1.02] tracking-[-0.02em]">
              экран сам ведёт <br />
              церемонию
            </h2>
            <p className="mt-6 max-w-[60ch] mx-auto text-ink-300 text-[15px] md:text-[17px] leading-relaxed">
              согласованная композиция выводится в нужный момент. портрет, подпись, свечи, тихий полёт птиц — всё по сценарию, без вмешательства оператора.
            </p>
          </>
        }
      >
        {/* Содержимое «экрана» — 3 одновременных визуала ритма церемонии */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 h-full w-full">
          <div className="relative rounded-xl overflow-hidden h-full">
            <PortraitVisual />
          </div>
          <div className="relative rounded-xl overflow-hidden h-full">
            <CandlesVisual />
          </div>
          <div className="relative rounded-xl overflow-hidden h-full">
            <BirdsVisual />
          </div>
        </div>
      </ContainerScroll>
    </section>
  );
}
