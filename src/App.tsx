import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { GateHero } from './components/hero/GateHero';
import { Gallery } from './components/sections/Gallery';
import { Showcase } from './components/sections/Showcase';

export function App() {
  return (
    <div className="bg-ink-950 text-ink-100 min-h-screen">
      <Navbar />
      <main>
        <GateHero />
        <Gallery />
        <Showcase />
      </main>
      <Footer />
    </div>
  );
}
