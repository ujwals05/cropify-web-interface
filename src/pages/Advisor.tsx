import { useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Shield,
  Cpu,
  Loader2,
} from 'lucide-react';
import { useAdvisorStore, validateSoilData } from '@/store/advisorStore';
import MapSelector from '@/components/advisor/MapSelector';
import SoilInputForm from '@/components/advisor/SoilInputForm';
import WeatherCard from '@/components/advisor/WeatherCard';
import PredictionReport from '@/components/advisor/report/PredictionReport';
import Button from '@/components/ui/Button';

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function Advisor() {
  // ── Zustand store ──
  const location = useAdvisorStore((s) => s.location);
  const soilData = useAdvisorStore((s) => s.soilData);
  const soilErrors = useAdvisorStore((s) => s.soilErrors);
  const hasAttemptedSubmit = useAdvisorStore((s) => s.hasAttemptedSubmit);
  const weather = useAdvisorStore((s) => s.weather);
  const weatherLoading = useAdvisorStore((s) => s.weatherLoading);
  const weatherError = useAdvisorStore((s) => s.weatherError);
  const predicting = useAdvisorStore((s) => s.predicting);
  const showResults = useAdvisorStore((s) => s.showResults);

  const setLocation = useAdvisorStore((s) => s.setLocation);
  const setSoilData = useAdvisorStore((s) => s.setSoilData);
  const fetchWeather = useAdvisorStore((s) => s.fetchWeather);
  const clearLocation = useAdvisorStore((s) => s.clearLocation);
  const submitPrediction = useAdvisorStore((s) => s.submitPrediction);

  // ── Derived ──
  const validationErrors = useMemo(() => validateSoilData(soilData), [soilData]);
  const isFormValid = useMemo(
    () => location !== null && Object.keys(validationErrors).length === 0,
    [location, validationErrors]
  );

  // ── Handlers ──
  const handleLocationSelect = useCallback(
    (loc: { lat: number; lng: number; city: string; region?: string }) => {
      setLocation(loc);
      fetchWeather(loc);
    },
    [setLocation, fetchWeather]
  );

  const handleClearLocation = useCallback(() => {
    clearLocation();
  }, [clearLocation]);

  const handleSoilChange = useCallback(
    (values: typeof soilData) => {
      setSoilData(values);
    },
    [setSoilData]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitPrediction();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-background min-h-screen pb-32"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 lg:px-24">
        {/* ─── Header ─── */}
        <div className="pt-28 md:pt-32 pb-10 md:pb-14 text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent font-bold text-xs tracking-widest uppercase mb-5"
          >
            <Sparkles size={14} />
            <span>AI-Powered Crop Advisory</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="text-4xl sm:text-5xl md:text-7xl font-heading font-extrabold text-primary tracking-tight mb-5"
          >
            Cropify{' '}
            <span className="text-accent underline decoration-accent/10 underline-offset-4">
              Advisor
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-base md:text-lg text-primary/50 max-w-2xl mx-auto font-medium"
          >
            Select your location, enter soil parameters, and let our ML engine recommend the optimal
            crop for your conditions.
          </motion.p>
        </div>

        {/* ─── Main Grid ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* ─── Left Column (70%) ─── */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              {!showResults ? (
                <motion.div
                  key="form"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="p-6 md:p-10 rounded-3xl border border-muted/30 shadow-xl bg-white/70 backdrop-blur-md">
                    <form onSubmit={handleSubmit} className="space-y-8">
                      {/* Section: Map */}
                      <div>
                        <div className="flex items-center gap-2 mb-4">
                          <div className="w-6 h-6 rounded-md bg-accent/10 flex items-center justify-center">
                            <span className="text-accent text-xs font-extrabold">1</span>
                          </div>
                          <h2 className="text-sm font-bold text-primary/60 uppercase tracking-wider">
                            Choose Location
                          </h2>
                        </div>
                        <MapSelector
                          onLocationSelect={handleLocationSelect}
                          selectedLocation={location}
                          onClearLocation={handleClearLocation}
                        />
                        {/* Inline error for location */}
                        <AnimatePresence>
                          {hasAttemptedSubmit && !location && (
                            <motion.p
                              initial={{ opacity: 0, y: -4 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -4 }}
                              className="text-[11px] font-medium text-red-500 mt-2 px-1"
                            >
                              Please select a location on the map
                            </motion.p>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Divider */}
                      <div className="border-t border-muted/30" />

                      {/* Section: Soil Inputs */}
                      <div>
                        <div className="flex items-center gap-2 mb-4">
                          <div className="w-6 h-6 rounded-md bg-accent/10 flex items-center justify-center">
                            <span className="text-accent text-xs font-extrabold">2</span>
                          </div>
                          <h2 className="text-sm font-bold text-primary/60 uppercase tracking-wider">
                            Soil Parameters
                          </h2>
                        </div>
                        <SoilInputForm
                          values={soilData}
                          onChange={handleSoilChange}
                          errors={hasAttemptedSubmit ? soilErrors : {}}
                        />
                      </div>

                      {/* Divider */}
                      <div className="border-t border-muted/30" />

                      {/* Submit Button */}
                      <div>
                        <Button
                          type="submit"
                          disabled={!isFormValid && hasAttemptedSubmit}
                          isLoading={predicting}
                          loadingText="Analyzing soil & climate data..."
                          size="lg"
                          className={`w-full py-5 text-base shadow-lg group transition-all duration-300 ${
                            !isFormValid && hasAttemptedSubmit
                              ? 'opacity-50 cursor-not-allowed'
                              : ''
                          }`}
                        >
                          <Cpu size={18} className="mr-2" />
                          Predict Optimal Crop
                          {!predicting && (
                            <ArrowRight
                              size={18}
                              className="ml-2 group-hover:translate-x-1 transition-transform"
                            />
                          )}
                        </Button>

                        {!isFormValid && hasAttemptedSubmit && (
                          <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center text-[11px] text-primary/30 font-medium mt-3"
                          >
                            Fill all fields and select a location to enable prediction
                          </motion.p>
                        )}
                      </div>
                    </form>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                >
                  <PredictionReport />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ─── Right Sidebar (30%) ─── */}
          <div className="lg:col-span-4 space-y-6">
            {/* Weather Card */}
            <WeatherCard
              weather={weather}
              isLoading={weatherLoading}
              error={weatherError}
              onRetry={location ? () => fetchWeather(location) : undefined}
            />

            {/* Cropify Insights Card */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="p-6 rounded-2xl bg-primary text-white shadow-xl relative overflow-hidden"
            >
              <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-accent/20 rounded-full blur-3xl" />
              <div className="absolute top-0 right-0 w-20 h-20 bg-accent/10 rounded-full blur-2xl" />

              <div className="relative z-10">
                <Shield className="text-accent mb-4" size={28} />
                <h3 className="text-base font-bold mb-2 tracking-tight text-white">
                  How It Works
                </h3>
                <ul className="space-y-2.5 text-white/60 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={14} className="text-accent shrink-0 mt-0.5" />
                    <span>Select your farm location on the interactive map</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={14} className="text-accent shrink-0 mt-0.5" />
                    <span>Weather data is fetched automatically for your area</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={14} className="text-accent shrink-0 mt-0.5" />
                    <span>Enter soil nutrients (N, P, K) and pH level</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={14} className="text-accent shrink-0 mt-0.5" />
                    <span>Our ML model recommends the optimal crop with confidence scores</span>
                  </li>
                </ul>

                <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-between text-[10px] font-bold text-accent tracking-widest uppercase">
                  <span>14,000+ Data Points</span>
                  <span>ML v2.0</span>
                </div>
              </div>
            </motion.div>

            {/* Prediction status indicator */}
            <AnimatePresence>
              {predicting && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="p-5 rounded-2xl bg-accent/5 border border-accent/20"
                >
                  <div className="flex items-center gap-3">
                    <Loader2 size={20} className="text-accent animate-spin" />
                    <div>
                      <p className="text-sm font-bold text-primary">Analyzing Data...</p>
                      <p className="text-[11px] text-primary/40">
                        Running ML model with soil &amp; climate inputs
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
