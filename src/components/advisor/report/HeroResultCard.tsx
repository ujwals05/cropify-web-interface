import { motion } from 'framer-motion';
import { Leaf, Award, Sparkles } from 'lucide-react';
import { useAdvisorStore } from '@/store/advisorStore';

// ─── Radial Gauge ──────────────────────────────────────────────────────────────

function RadialGauge({ value, size = 120 }: { value: number; size?: number }) {
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  const getColor = (v: number) => {
    if (v >= 80) return '#4ade80';
    if (v >= 50) return '#facc15';
    return '#f87171';
  };

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth={strokeWidth}
        />
        {/* Animated arc */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={getColor(value)}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.4, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        />
      </svg>
      {/* Center text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.8, type: 'spring' }}
          className="text-2xl md:text-3xl font-extrabold text-white"
        >
          {value}%
        </motion.span>
        <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest mt-0.5">
          Confidence
        </span>
      </div>
    </div>
  );
}

// ─── Hero Result Card ──────────────────────────────────────────────────────────

export default function HeroResultCard() {
  const prediction = useAdvisorStore((s) => s.prediction);
  const weather = useAdvisorStore((s) => s.weather);

  if (!prediction) return null;

  const crop = prediction.recommended_crop;
  const confidence = prediction.confidence;

  // Generate a contextual insight
  const insight = generateInsight(crop, weather);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden rounded-3xl bg-primary p-6 md:p-10 text-white shadow-2xl border border-white/5"
    >
      {/* Ambient glow effects */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-accent/20 rounded-full blur-[120px] pointer-events-none -translate-y-1/3 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent/10 rounded-full blur-[100px] pointer-events-none translate-y-1/3 -translate-x-1/3" />
      <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-accent/5 rounded-full blur-[80px] pointer-events-none -translate-x-1/2 -translate-y-1/2" />

      <div className="relative z-10">
        {/* Best Match badge */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/20 border border-accent/30 mb-6"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
          </span>
          <span className="text-accent font-bold text-[11px] tracking-widest uppercase">
            Best Match
          </span>
        </motion.div>

        <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-start md:items-center">
          {/* Crop icon + info */}
          <div className="flex items-start gap-5 flex-1">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.6, delay: 0.15, type: 'spring', stiffness: 200 }}
              className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/10 flex items-center justify-center text-accent shrink-0"
            >
              <Leaf size={36} />
            </motion.div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1.5">
                <Award size={14} className="text-accent" />
                <span className="text-accent font-bold text-[11px] tracking-widest uppercase">
                  Recommended Crop
                </span>
              </div>
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="text-3xl sm:text-4xl md:text-5xl font-heading font-extrabold mb-2 capitalize text-white leading-tight"
              >
                {crop}
              </motion.h2>

              {weather && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="flex items-center gap-3 text-white/50 text-sm font-medium flex-wrap"
                >
                  <span>{weather.city}, {weather.country}</span>
                  <span className="w-1 h-1 bg-white/20 rounded-full" />
                  <span>{weather.temperature}°C</span>
                  <span className="w-1 h-1 bg-white/20 rounded-full" />
                  <span>{weather.humidity}% humidity</span>
                  <span className="w-1 h-1 bg-white/20 rounded-full" />
                  <span>{weather.rainfall_5day}mm est. rain</span>
                </motion.div>
              )}

              {/* AI Insight */}
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55 }}
                className="mt-4 flex items-start gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10"
              >
                <Sparkles size={14} className="text-accent shrink-0 mt-0.5" />
                <p className="text-[13px] text-white/60 leading-relaxed">{insight}</p>
              </motion.div>
            </div>
          </div>

          {/* Radial gauge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, type: 'spring' }}
            className="shrink-0 self-center md:self-auto"
          >
            <RadialGauge value={confidence} size={130} />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Insight Generator ─────────────────────────────────────────────────────────

function generateInsight(
  crop: string,
  weather: { temperature: number; humidity: number; rainfall_month_estimate: number } | null
): string {
  const cropLower = crop.toLowerCase();
  if (!weather) return `Ideal conditions detected for ${crop} cultivation.`;

  const { temperature, humidity, rainfall_month_estimate } = weather;

  if (humidity > 70 && rainfall_month_estimate > 100) {
    return `High moisture conditions (${humidity}% humidity, ${rainfall_month_estimate}mm est. rainfall) are ideal for ${cropLower} — a water-friendly crop.`;
  }
  if (temperature > 30) {
    return `Warm climate at ${temperature}°C combined with current soil profile strongly favors ${cropLower} growth.`;
  }
  if (temperature < 20) {
    return `Cooler conditions at ${temperature}°C suit ${cropLower} well — this crop thrives in moderate temperatures.`;
  }
  return `Current soil chemistry and climate profile create optimal growing conditions for ${cropLower}.`;
}
