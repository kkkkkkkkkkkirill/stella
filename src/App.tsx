import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { GateHero } from './components/hero/GateHero';
import { CeremonyHall } from './components/sections/CeremonyHall';
import { Gallery } from './components/sections/Gallery';

export function App() {
  return (
    <div className="bg-ink-950 text-ink-100 min-h-screen">
      <Navbar />
      <main>
        <GateHero />
        <CeremonyHall />
        <Gallery />
      </main>
      <Footer />
    </div>
  );
}
