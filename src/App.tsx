import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';
import Home from '@/pages/Home';
import About from '@/pages/About';
import Advisor from '@/pages/Advisor';

import SoilAnalyzer from '@/pages/SoilAnalyzer';
import IrrigationAdvisor from '@/pages/IrrigationAdvisor';

function App() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-accent/30 selection:text-primary overflow-x-hidden">
      <Navbar />
      <AnimatePresence mode="wait">
        <main key={location.pathname}>
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/advisor" element={<Advisor />} />
            <Route path="/soil" element={<SoilAnalyzer />} />
            <Route path="/irrigation" element={<IrrigationAdvisor />} />
          </Routes>
        </main>
      </AnimatePresence>
    </div>
  );
}

export default App;

