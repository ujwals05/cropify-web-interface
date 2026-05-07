import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Cpu, CheckCircle2, Check, AlertCircle } from 'lucide-react';
import Button from '@/components/ui/Button';
import { analyzeSoil, type SoilAnalysisResult } from '@/api/soil';

export default function SoilAnalyzer() {
  const [ndvi, setNdvi] = useState<string>('');
  const [moisture, setMoisture] = useState<string>('');
  const [elevation, setElevation] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SoilAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await analyzeSoil(
        parseFloat(ndvi),
        parseFloat(moisture),
        parseFloat(elevation)
      );
      setResult(data);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getRecommendations = (level: string) => {
    switch (level) {
      case 'High':
        return [
          'Excellent soil health detected',
          'Maintain natural organic matter',
          'Optimize water management',
        ];
      case 'Medium':
        return [
          'Apply balanced N-P-K fertilizers',
          'Implement regular crop rotation',
          'Monitor soil pH levels monthly',
        ];
      case 'Low':
        return [
          'Immediate organic manuring required',
          'Consider nitrogen fixation crops',
          'Improve irrigation infrastructure',
        ];
      default:
        return [];
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'High': return 'bg-green-100 text-green-700 border-green-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Low': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  // Map fertility value to percentage for the scale bar (assuming 0-600 range)
  const calculatePointerPosition = (value: number) => {
    const max = 600;
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
    return `${percentage}%`;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-background min-h-screen pb-32"
    >
      <div className="max-w-4xl mx-auto px-4">
        {/* ─── Header ─── */}
        <div className="pt-28 md:pt-32 pb-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent font-bold text-xs tracking-widest uppercase mb-5"
          >
            <Sparkles size={14} />
            <span>AI Powered</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="text-4xl sm:text-5xl font-heading font-extrabold text-primary tracking-tight mb-5"
          >
            Soil Fertility Analyzer
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-base md:text-lg text-primary/50 max-w-2xl mx-auto font-medium"
          >
            Enter your soil satellite metrics to get an AI-powered fertility assessment.
          </motion.p>
        </div>

        {/* ─── Input Form Card ─── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 md:p-10 rounded-3xl border border-muted/30 shadow-xl"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* NDVI Value */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-primary flex items-center gap-2">
                  NDVI Value
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="-1"
                  max="1"
                  required
                  value={ndvi}
                  onChange={(e) => setNdvi(e.target.value)}
                  placeholder="0.45"
                  className="w-full px-4 py-3 rounded-xl border border-muted/30 focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all"
                />
                <p className="text-[11px] text-primary/40 font-medium">Healthy crops: 0.2 to 0.7</p>
              </div>

              {/* Soil Moisture */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-primary flex items-center gap-2">
                  Soil Moisture
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="1"
                  required
                  value={moisture}
                  onChange={(e) => setMoisture(e.target.value)}
                  placeholder="0.25"
                  className="w-full px-4 py-3 rounded-xl border border-muted/30 focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all"
                />
                <p className="text-[11px] text-primary/40 font-medium">Ideal farming: 0.2 to 0.4</p>
              </div>

              {/* Elevation */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-primary flex items-center gap-2">
                  Elevation (meters)
                </label>
                <input
                  type="number"
                  required
                  value={elevation}
                  onChange={(e) => setElevation(e.target.value)}
                  placeholder="500"
                  className="w-full px-4 py-3 rounded-xl border border-muted/30 focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all"
                />
                <p className="text-[11px] text-primary/40 font-medium">Most Indian farmland: 0 to 600m</p>
              </div>
            </div>

            <Button
              type="submit"
              isLoading={loading}
              loadingText="Analyzing Satellite Data..."
              className="w-full py-5 text-base shadow-lg group"
            >
              <Cpu size={18} className="mr-2" />
              Analyze Fertility
            </Button>
          </form>
        </motion.div>

        {/* ─── Error State ─── */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-6 p-4 rounded-2xl bg-red-50 border border-red-100 flex items-center gap-3 text-red-700"
            >
              <AlertCircle size={20} />
              <p className="text-sm font-medium">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ─── Results Section ─── */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-10 space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Fertility Score Card */}
                <div className="bg-white p-8 rounded-3xl border border-muted/30 shadow-lg flex flex-col items-center justify-center text-center">
                  <h3 className="text-sm font-bold text-primary/40 uppercase tracking-widest mb-4">Fertility Score</h3>
                  <div className="text-6xl font-extrabold text-primary mb-4">{result.fertility_value}</div>
                  <div className={`px-4 py-1.5 rounded-full border font-bold text-xs uppercase tracking-wider ${getLevelColor(result.fertility_level)}`}>
                    {result.fertility_level} Fertility
                  </div>
                </div>

                {/* Recommendations Card */}
                <div className="bg-white p-8 rounded-3xl border border-muted/30 shadow-lg">
                  <div className="flex items-center gap-2 mb-4">
                    <CheckCircle2 size={20} className="text-accent" />
                    <h3 className="text-sm font-bold text-primary/40 uppercase tracking-widest">Expert Advice</h3>
                  </div>
                  <p className="text-primary font-medium mb-6 text-sm leading-relaxed">
                    {result.interpretation}
                  </p>
                  <ul className="space-y-3">
                    {getRecommendations(result.fertility_level).map((rec, i) => (
                      <li key={i} className="flex items-center gap-3 text-sm text-primary/70">
                        <div className="w-5 h-5 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                          <Check size={12} className="text-accent" />
                        </div>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Fertility Scale Card */}
              <div className="bg-white p-8 rounded-3xl border border-muted/30 shadow-lg">
                <h3 className="text-sm font-bold text-primary/40 uppercase tracking-widest mb-8">Fertility Scale</h3>
                
                <div className="relative pt-6 pb-2">
                  {/* Pointer */}
                  <div 
                    className="absolute top-0 transition-all duration-1000 ease-out"
                    style={{ left: calculatePointerPosition(result.fertility_value) }}
                  >
                    <div className="flex flex-col items-center -translate-x-1/2">
                      <div className="w-0.5 h-6 bg-primary" />
                      <div className="w-3 h-3 rounded-full bg-primary border-2 border-white shadow-sm" />
                    </div>
                  </div>

                  {/* Gradient Bar */}
                  <div className="h-4 w-full rounded-full bg-gradient-to-r from-red-500 via-yellow-400 to-green-500 shadow-inner" />
                  
                  {/* Labels */}
                  <div className="flex justify-between mt-4 text-[10px] font-bold text-primary/40 uppercase tracking-tighter">
                    <div className="flex flex-col items-start">
                      <span>Low</span>
                      <span>0-300</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span>Medium</span>
                      <span>300-450</span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span>High</span>
                      <span>450+</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
