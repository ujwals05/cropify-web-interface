import { motion } from 'framer-motion';
import { Sparkles, RotateCcw } from 'lucide-react';
import { useAdvisorStore } from '@/store/advisorStore';
import Button from '@/components/ui/Button';
import HeroResultCard from './HeroResultCard';
import AlternativesList from './AlternativesList';
import WeatherPanel from './WeatherPanel';
import SoilPanel from './SoilPanel';
import InsightsPanel from './InsightsPanel';
import RecommendationPanel from './RecommendationPanel';

// ─── Prediction Report ─────────────────────────────────────────────────────────

export default function PredictionReport() {
  const prediction = useAdvisorStore((s) => s.prediction);
  const reset = useAdvisorStore((s) => s.reset);

  if (!prediction) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* Hero — Primary result */}
      <HeroResultCard />

      {/* Top 3 alternatives */}
      <AlternativesList />

      {/* Two-column layout: Weather + Soil */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <WeatherPanel />
        <SoilPanel />
      </div>

      {/* AI Insights */}
      <InsightsPanel />

      {/* Recommendations */}
      <RecommendationPanel />

      {/* AI Badge footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="flex items-center justify-center gap-2 py-3"
      >
        <Sparkles size={12} className="text-accent/50" />
        <span className="text-[11px] font-semibold text-primary/30">
          Analysis powered by Cropify ML Engine • 14,000+ data points
        </span>
      </motion.div>

      {/* Reset / Re-run CTA */}
      <Button
        variant="outline"
        className="w-full py-4 border-primary/10 text-primary/50 hover:text-primary hover:border-accent/30 transition-all"
        onClick={reset}
      >
        <RotateCcw size={16} className="mr-2" />
        New Prediction
      </Button>
    </motion.div>
  );
}
