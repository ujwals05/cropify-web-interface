import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Cpu, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle2, 
  Lightbulb, 
  Cloud, 
  Sprout, 
  Layers,
  Droplets,
  RotateCcw,
  MapPin,
  Loader2
} from 'lucide-react';
import Button from '@/components/ui/Button';
import { predictIrrigation, type IrrigationInput, type IrrigationResult } from '@/api/irrigation';
import { useAdvisorStore } from '@/store/advisorStore';
import MapSelector from '@/components/advisor/MapSelector';
import { useEffect } from 'react';
import { useCallback } from 'react';

const INITIAL_FORM_STATE: IrrigationInput = {
  soil_type: '',
  ph: 0,
  moisture: 0,
  organic: 0,
  ec: 0,
  temperature: 0,
  humidity: 0,
  rainfall: 0,
  sunlight: 0,
  wind: 0,
  crop_type: '',
  crop_growth_stage: '',
  season: '',
  irrigation_type: '',
  water_source: '',
  area: 0,
  mulching_used: '',
  previous_irrigation: 0,
  region: '',
};

export default function IrrigationAdvisor() {
  const [formData, setFormData] = useState<IrrigationInput>(INITIAL_FORM_STATE);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<IrrigationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLDivElement>(null);

  // ── Zustand store ──
  const location = useAdvisorStore((s) => s.location);
  const weather = useAdvisorStore((s) => s.weather);
  const weatherLoading = useAdvisorStore((s) => s.weatherLoading);
  const weatherError = useAdvisorStore((s) => s.weatherError);
  
  const setLocation = useAdvisorStore((s) => s.setLocation);
  const fetchWeather = useAdvisorStore((s) => s.fetchWeather);
  const clearLocation = useAdvisorStore((s) => s.clearLocation);
  const resetStore = useAdvisorStore((s) => s.reset);

  // ── Weather Sync ──
  useEffect(() => {
    if (weather) {
      setFormData(prev => ({
        ...prev,
        temperature: weather.temperature,
        humidity: weather.humidity,
        rainfall: weather.rainfall_month_estimate || weather.rainfall_5day || 0,
        region: location?.region || prev.region
      }));
    }
  }, [weather, location]);

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await predictIrrigation(formData);
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData(INITIAL_FORM_STATE);
    setResult(null);
    setError(null);
    resetStore();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getDecisionStyles = (needed: string) => {
    switch (needed.toLowerCase()) {
      case 'high':
        return {
          bg: 'bg-amber-600',
          subtitle: 'Irrigation urgently needed'
        };
      case 'medium':
        return {
          bg: 'bg-blue-600',
          subtitle: 'Irrigation recommended soon'
        };
      case 'low':
        return {
          bg: 'bg-green-800',
          subtitle: 'Irrigation not required currently'
        };
      default:
        return {
          bg: 'bg-gray-600',
          subtitle: ''
        };
    }
  };

  const getConfidenceColor = (conf: number) => {
    if (conf > 85) return 'bg-green-500';
    if (conf >= 70) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const inputClasses = "w-full px-4 py-3 rounded-xl border border-muted/30 focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all bg-white text-primary appearance-none";

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
            Irrigation Advisor
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-base md:text-lg text-primary/50 max-w-2xl mx-auto font-medium"
          >
            Enter your field and weather conditions to get an AI-powered irrigation recommendation.
          </motion.p>
        </div>

        {/* ─── Form Card ─── */}
        <motion.div
          ref={formRef}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 md:p-10 rounded-3xl border border-muted/30 shadow-xl max-w-[800px] mx-auto"
        >
          <form onSubmit={handleSubmit} className="space-y-10">
            {/* Section: Location Selection */}
            <div className="space-y-6">
              <div className="relative flex items-center justify-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-muted/30"></div>
                </div>
                <div className="relative bg-white px-4 flex items-center gap-2 text-primary/60 font-bold text-xs uppercase tracking-widest">
                  <MapPin size={14} className="text-accent" />
                  Select Field Location
                </div>
              </div>
              <MapSelector
                onLocationSelect={handleLocationSelect}
                selectedLocation={location}
                onClearLocation={handleClearLocation}
              />
              {weatherError && (
                <p className="text-xs font-medium text-red-500 mt-2 px-1 flex items-center gap-1">
                  <AlertCircle size={12} />
                  {weatherError}
                </p>
              )}
            </div>

            {/* Section 1: Soil Properties */}
            <div className="space-y-6">
              <div className="relative flex items-center justify-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-muted/30"></div>
                </div>
                <div className="relative bg-white px-4 flex items-center gap-2 text-primary/60 font-bold text-xs uppercase tracking-widest">
                  <Layers size={14} className="text-accent" />
                  Soil Properties
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-primary">Soil pH</label>
                  <input
                    type="number"
                    name="ph"
                    step="0.1"
                    min="4.8"
                    max="8.2"
                    required
                    value={formData.ph || ''}
                    onChange={handleInputChange}
                    placeholder="4.8 – 8.2"
                    className={inputClasses}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-primary">Soil Moisture</label>
                  <input
                    type="number"
                    name="moisture"
                    step="0.1"
                    min="8"
                    max="65"
                    required
                    value={formData.moisture || ''}
                    onChange={handleInputChange}
                    placeholder="8 – 65"
                    className={inputClasses}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-primary">Organic Carbon</label>
                  <input
                    type="number"
                    name="organic"
                    step="0.01"
                    min="0.3"
                    max="1.6"
                    required
                    value={formData.organic || ''}
                    onChange={handleInputChange}
                    placeholder="0.3 – 1.6"
                    className={inputClasses}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-primary">Electrical Conductivity</label>
                  <input
                    type="number"
                    name="ec"
                    step="0.01"
                    min="0.1"
                    max="3.5"
                    required
                    value={formData.ec || ''}
                    onChange={handleInputChange}
                    placeholder="0.1 – 3.5"
                    className={inputClasses}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-primary">Soil Type</label>
                  <select
                    name="soil_type"
                    required
                    value={formData.soil_type}
                    onChange={handleInputChange}
                    className={inputClasses}
                  >
                    <option value="" disabled>Select Soil Type</option>
                    <option value="Clay">Clay</option>
                    <option value="Loamy">Loamy</option>
                    <option value="Sandy">Sandy</option>
                    <option value="Silt">Silt</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-primary">Mulching Used</label>
                  <select
                    name="mulching_used"
                    required
                    value={formData.mulching_used}
                    onChange={handleInputChange}
                    className={inputClasses}
                  >
                    <option value="" disabled>Select Option</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="relative flex items-center justify-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-muted/30"></div>
                </div>
                <div className="relative bg-white px-4 flex items-center gap-2 text-primary/60 font-bold text-xs uppercase tracking-widest">
                  <Cloud size={14} className="text-accent" />
                  Weather Conditions
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-bold text-primary">Temperature (°C)</label>
                    {weatherLoading && <Loader2 size={12} className="animate-spin text-accent" />}
                    {weather && !weatherLoading && <span className="text-[10px] font-bold text-accent uppercase">Auto-filled</span>}
                  </div>
                  <input
                    type="number"
                    name="temperature"
                    step="0.1"
                    min="12"
                    max="42"
                    required
                    value={formData.temperature || ''}
                    onChange={handleInputChange}
                    placeholder="12 – 42"
                    className={inputClasses}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-bold text-primary">Humidity (%)</label>
                    {weatherLoading && <Loader2 size={12} className="animate-spin text-accent" />}
                    {weather && !weatherLoading && <span className="text-[10px] font-bold text-accent uppercase">Auto-filled</span>}
                  </div>
                  <input
                    type="number"
                    name="humidity"
                    step="0.1"
                    min="25"
                    max="95"
                    required
                    value={formData.humidity || ''}
                    onChange={handleInputChange}
                    placeholder="25 – 95"
                    className={inputClasses}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-bold text-primary">Rainfall (mm)</label>
                    {weatherLoading && <Loader2 size={12} className="animate-spin text-accent" />}
                    {weather && !weatherLoading && <span className="text-[10px] font-bold text-accent uppercase">Auto-filled</span>}
                  </div>
                  <input
                    type="number"
                    name="rainfall"
                    step="0.1"
                    min="0.38"
                    max="2499"
                    required
                    value={formData.rainfall || ''}
                    onChange={handleInputChange}
                    placeholder="0.38 – 2499"
                    className={inputClasses}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-primary">Sunlight Hours</label>
                  <input
                    type="number"
                    name="sunlight"
                    step="0.1"
                    min="4"
                    max="11"
                    required
                    value={formData.sunlight || ''}
                    onChange={handleInputChange}
                    placeholder="4 – 11"
                    className={inputClasses}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-primary">Wind Speed (km/h)</label>
                  <input
                    type="number"
                    name="wind"
                    step="0.1"
                    min="0.5"
                    max="20"
                    required
                    value={formData.wind || ''}
                    onChange={handleInputChange}
                    placeholder="0.5 – 20"
                    className={inputClasses}
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Crop & Field Details */}
            <div className="space-y-6">
              <div className="relative flex items-center justify-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-muted/30"></div>
                </div>
                <div className="relative bg-white px-4 flex items-center gap-2 text-primary/60 font-bold text-xs uppercase tracking-widest">
                  <Sprout size={14} className="text-accent" />
                  Crop & Field Details
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-primary">Crop Type</label>
                  <select
                    name="crop_type"
                    required
                    value={formData.crop_type}
                    onChange={handleInputChange}
                    className={inputClasses}
                  >
                    <option value="" disabled>Select Crop Type</option>
                    <option value="Cotton">Cotton</option>
                    <option value="Maize">Maize</option>
                    <option value="Potato">Potato</option>
                    <option value="Rice">Rice</option>
                    <option value="Sugarcane">Sugarcane</option>
                    <option value="Wheat">Wheat</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-primary">Crop Growth Stage</label>
                  <select
                    name="crop_growth_stage"
                    required
                    value={formData.crop_growth_stage}
                    onChange={handleInputChange}
                    className={inputClasses}
                  >
                    <option value="" disabled>Select Growth Stage</option>
                    <option value="Flowering">Flowering</option>
                    <option value="Harvest">Harvest</option>
                    <option value="Sowing">Sowing</option>
                    <option value="Vegetative">Vegetative</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-primary">Season</label>
                  <select
                    name="season"
                    required
                    value={formData.season}
                    onChange={handleInputChange}
                    className={inputClasses}
                  >
                    <option value="" disabled>Select Season</option>
                    <option value="Kharif">Kharif</option>
                    <option value="Rabi">Rabi</option>
                    <option value="Zaid">Zaid</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-primary">Irrigation Type</label>
                  <select
                    name="irrigation_type"
                    required
                    value={formData.irrigation_type}
                    onChange={handleInputChange}
                    className={inputClasses}
                  >
                    <option value="" disabled>Select Irrigation Type</option>
                    <option value="Canal">Canal</option>
                    <option value="Drip">Drip</option>
                    <option value="Rainfed">Rainfed</option>
                    <option value="Sprinkler">Sprinkler</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-primary">Water Source</label>
                  <select
                    name="water_source"
                    required
                    value={formData.water_source}
                    onChange={handleInputChange}
                    className={inputClasses}
                  >
                    <option value="" disabled>Select Water Source</option>
                    <option value="Groundwater">Groundwater</option>
                    <option value="Rainwater">Rainwater</option>
                    <option value="Reservoir">Reservoir</option>
                    <option value="River">River</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-primary">Region</label>
                  <select
                    name="region"
                    required
                    value={formData.region}
                    onChange={handleInputChange}
                    className={inputClasses}
                  >
                    <option value="" disabled>Select Region</option>
                    <option value="Central">Central</option>
                    <option value="East">East</option>
                    <option value="North">North</option>
                    <option value="South">South</option>
                    <option value="West">West</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-primary">Field Area (hectares)</label>
                  <input
                    type="number"
                    name="area"
                    step="0.1"
                    min="0.3"
                    max="15"
                    required
                    value={formData.area || ''}
                    onChange={handleInputChange}
                    placeholder="0.3 – 15"
                    className={inputClasses}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-primary">Previous Irrigation (mm)</label>
                  <input
                    type="number"
                    name="previous_irrigation"
                    step="0.1"
                    min="0"
                    max="120"
                    required
                    value={formData.previous_irrigation || ''}
                    onChange={handleInputChange}
                    placeholder="0 – 120"
                    className={inputClasses}
                  />
                </div>
              </div>
            </div>

            <Button
              type="submit"
              isLoading={loading}
              loadingText="Analyzing field data..."
              size="lg"
              className="w-full py-5 text-base shadow-lg group"
            >
              Analyze Irrigation Need
              <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </form>

          {/* ─── Error State ─── */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-6 p-4 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-between gap-3 text-red-700"
              >
                <div className="flex items-center gap-3">
                  <AlertCircle size={20} />
                  <p className="text-sm font-medium">{error}</p>
                </div>
                <button 
                  onClick={() => setError(null)}
                  className="text-xs font-bold uppercase tracking-wider hover:underline"
                >
                  Try Again
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* ─── Results Section ─── */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-10 space-y-6"
            >
              {/* Card 1: Irrigation Decision */}
              <div className={`p-10 rounded-3xl text-white text-center shadow-xl ${getDecisionStyles(result.irrigation_needed).bg}`}>
                <h3 className="text-xs font-bold uppercase tracking-[0.2em] opacity-80 mb-6">Irrigation Decision</h3>
                <div className="text-7xl font-extrabold mb-4 tracking-tighter">
                  {result.irrigation_needed}
                </div>
                <div className="text-xl font-bold mb-8 opacity-90">
                  Confidence: {Math.round(result.confidence * 100) / 100}%
                </div>
                <div className="text-sm font-medium opacity-70">
                  {result.irrigation_needed === 'High' && "High = Irrigation urgently needed"}
                  {result.irrigation_needed === 'Medium' && "Medium = Irrigation recommended soon"}
                  {result.irrigation_needed === 'Low' && "Low = Irrigation not required currently"}
                </div>
              </div>

              {/* Card 2: Confidence Visualization */}
              <div className="bg-white p-8 rounded-3xl border border-muted/30 shadow-lg">
                <h3 className="text-sm font-bold text-primary/40 uppercase tracking-widest mb-6">Prediction Confidence</h3>
                <div className="flex items-center gap-4">
                  <div className="flex-1 h-3 bg-muted/20 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${result.confidence}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className={`h-full rounded-full ${getConfidenceColor(result.confidence)}`}
                    />
                  </div>
                  <span className="text-sm font-bold text-primary whitespace-nowrap">
                    {Math.round(result.confidence * 100) / 100}%
                  </span>
                </div>
                <p className="mt-4 text-[11px] text-primary/40 font-medium leading-relaxed">
                  Based on Random Forest model trained on 10,000 field records with 98.55% accuracy.
                </p>
              </div>

              {/* Card 3: Recommendation */}
              <div className="bg-white p-8 rounded-3xl border border-muted/30 border-l-4 border-l-emerald-500 shadow-lg">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                    <Lightbulb size={20} />
                  </div>
                  <h3 className="text-sm font-bold text-primary uppercase tracking-widest">Field Recommendation</h3>
                </div>
                <p className="text-primary font-medium mb-8 text-base leading-relaxed">
                  {result.recommendation}
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleReset}
                  className="group"
                >
                  <RotateCcw size={16} className="mr-2 group-hover:-rotate-45 transition-transform" />
                  Try Another Field →
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
