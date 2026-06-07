import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { GateHero } from './components/hero/GateHero';
import { Intro } from './components/sections/Intro';
import { ScreenPreview } from './components/sections/ScreenPreview';
import { DisplayCatalog } from './components/sections/DisplayCatalog';
import { Process } from './components/sections/Process';
import { Contact } from './components/sections/Contact';

export function App() {
  return (
    <div className="bg-ink-950 text-ink-100 min-h-screen">
      <Navbar />
      <main>
        <GateHero />
        <Intro />
        <ScreenPreview />
        <DisplayCatalog />
        <Process />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
