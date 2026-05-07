import { motion } from 'framer-motion';
import { Leaf, Award, TrendingUp, Sparkles, BarChart3 } from 'lucide-react';
import type { WeatherData } from './WeatherCard';

interface TopCrop {
  crop: string;
  confidence: number;
}

export interface PredictionData {
  recommended_crop: string;
  confidence: number;
  top_3: TopCrop[];
}

interface PredictionResultProps {
  prediction: PredictionData;
  weather: WeatherData | null;
}

function ConfidenceBar({ value, delay = 0 }: { value: number; delay?: number }) {
  const getColor = (v: number) => {
    if (v >= 80) return 'bg-accent';
    if (v >= 50) return 'bg-yellow-400';
    return 'bg-red-400';
  };

  return (
    <div className="h-2 w-full bg-primary/5 rounded-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 1, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
        className={`h-full rounded-full ${getColor(value)}`}
      />
    </div>
  );
}

export default function PredictionResult({ prediction, weather }: PredictionResultProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Hero Result Card */}
      <motion.div
        variants={itemVariants}
        className="bg-primary rounded-3xl p-8 md:p-10 text-white shadow-2xl relative overflow-hidden border border-white/5"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 rounded-full blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-accent/10 rounded-full blur-[80px] pointer-events-none translate-y-1/2 -translate-x-1/2" />

        <div className="relative z-10">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
            <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/10 flex items-center justify-center text-accent shrink-0">
              <Leaf size={32} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Award size={14} className="text-accent" />
                <span className="text-accent font-bold text-[11px] tracking-widest uppercase">
                  Recommended Crop
                </span>
              </div>
              <h2 className="text-3xl md:text-5xl font-heading font-extrabold mb-2 capitalize text-white">
                {prediction.recommended_crop}
              </h2>
              {weather && (
                <div className="flex items-center gap-3 text-white/50 text-sm font-medium flex-wrap">
                  <span>{weather.city}, {weather.country}</span>
                  <span className="w-1 h-1 bg-white/20 rounded-full" />
                  <span>{weather.temperature}°C</span>
                  <span className="w-1 h-1 bg-white/20 rounded-full" />
                  <span>{weather.humidity}% humidity</span>
                  <span className="w-1 h-1 bg-white/20 rounded-full" />
                  <span>{weather.rainfall_month_estimate}mm est. rain</span>
                </div>
              )}
            </div>
            <div className="md:text-right shrink-0">
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.3, type: 'spring' }}
                className="text-3xl md:text-4xl font-extrabold text-accent"
              >
                {prediction.confidence}%
              </motion.div>
              <div className="text-[10px] font-bold text-white/40 tracking-widest uppercase mt-1">
                Confidence Score
              </div>
              <div className="mt-2">
                <ConfidenceBar value={prediction.confidence} delay={0.5} />
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Top 3 Alternatives */}
      <motion.div variants={itemVariants}>
        <div className="flex items-center gap-2 mb-4 px-1">
          <BarChart3 size={16} className="text-accent" />
          <h3 className="text-sm font-bold text-primary/70 uppercase tracking-wider">
            Top Recommendations
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {prediction.top_3.map((item, index) => (
            <motion.div
              key={item.crop}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
              className={`p-5 rounded-2xl border transition-all duration-300 group ${
                index === 0
                  ? 'bg-accent/5 border-accent/20 shadow-md'
                  : 'bg-white border-muted/30 shadow-sm hover:border-accent/20 hover:shadow-md'
              }`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm shrink-0 ${
                    index === 0
                      ? 'bg-accent/20 text-accent'
                      : 'bg-primary/5 text-primary/40'
                  }`}
                >
                  #{index + 1}
                </div>
                <h4 className="font-bold text-primary capitalize text-base">{item.crop}</h4>
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="text-[11px] font-medium text-primary/40">Confidence</span>
                  <span className={`text-sm font-bold ${index === 0 ? 'text-accent' : 'text-primary/70'}`}>
                    {item.confidence}%
                  </span>
                </div>
                <ConfidenceBar value={item.confidence} delay={0.6 + index * 0.1} />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Weather Summary Card */}
      {weather && (
        <motion.div
          variants={itemVariants}
          className="p-6 rounded-2xl bg-gradient-to-br from-primary/[0.02] to-accent/[0.04] border border-muted/30 shadow-sm"
        >
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={16} className="text-accent" />
            <h3 className="text-sm font-bold text-primary/70 uppercase tracking-wider">
              Climate Conditions Used
            </h3>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-extrabold text-primary">{weather.temperature}°C</div>
              <div className="text-[10px] font-bold text-primary/30 uppercase tracking-wider mt-1">
                Temperature
              </div>
            </div>
            <div className="text-center border-x border-muted/30">
              <div className="text-2xl font-extrabold text-primary">{weather.humidity}%</div>
              <div className="text-[10px] font-bold text-primary/30 uppercase tracking-wider mt-1">
                Humidity
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-extrabold text-primary">{weather.rainfall_month_estimate}mm</div>
              <div className="text-[10px] font-bold text-primary/30 uppercase tracking-wider mt-1">
                Est. Rainfall
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* AI Badge */}
      <motion.div
        variants={itemVariants}
        className="flex items-center justify-center gap-2 py-3"
      >
        <Sparkles size={12} className="text-accent/50" />
        <span className="text-[11px] font-semibold text-primary/30">
          Prediction powered by Cropify ML Engine • 14,000+ data points
        </span>
      </motion.div>
    </motion.div>
  );
}
