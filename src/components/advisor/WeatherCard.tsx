import { motion, AnimatePresence } from 'framer-motion';
import { Thermometer, Droplets, CloudRain, MapPin, RefreshCw } from 'lucide-react';

export interface WeatherData {
  city: string;
  country: string;
  temperature: number;
  humidity: number;
  rainfall_5day: number;
  rainfall_month_estimate: number;
}

interface WeatherCardProps {
  weather: WeatherData | null;
  isLoading: boolean;
  error: string | null;
  onRetry?: () => void;
}

function SkeletonPulse({ className }: { className?: string }) {
  return (
    <div className={`bg-primary/5 rounded-lg relative overflow-hidden ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent -translate-x-full animate-shimmer" />
    </div>
  );
}

function WeatherSkeleton() {
  return (
    <div className="p-6 rounded-2xl bg-white border border-muted/50 shadow-sm space-y-5">
      <div className="flex items-center gap-3">
        <SkeletonPulse className="w-10 h-10 rounded-xl" />
        <div className="space-y-2 flex-1">
          <SkeletonPulse className="h-4 w-3/4" />
          <SkeletonPulse className="h-3 w-1/2" />
        </div>
      </div>
      <div className="space-y-3">
        <SkeletonPulse className="h-14 w-full rounded-xl" />
        <div className="grid grid-cols-2 gap-3">
          <SkeletonPulse className="h-14 rounded-xl" />
          <SkeletonPulse className="h-14 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

function MetricCard({
  icon: Icon,
  label,
  value,
  unit,
  color,
  delay = 0,
}: {
  icon: typeof Thermometer;
  label: string;
  value: number;
  unit: string;
  color: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className={`px-3.5 py-3 rounded-xl border border-muted/30 bg-gradient-to-br ${color}`}
    >
      <div className="flex items-center gap-2 mb-1">
        <Icon size={14} className="text-primary/40" />
        <span className="text-[10px] font-bold text-primary/40 uppercase tracking-wider">{label}</span>
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-xl font-extrabold text-primary">{value}</span>
        <span className="text-xs font-semibold text-primary/40">{unit}</span>
      </div>
    </motion.div>
  );
}

export default function WeatherCard({ weather, isLoading, error, onRetry }: WeatherCardProps) {
  return (
    <AnimatePresence mode="wait">
      {isLoading ? (
        <motion.div
          key="skeleton"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <WeatherSkeleton />
        </motion.div>
      ) : error ? (
        <motion.div
          key="error"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="p-6 rounded-2xl bg-red-50/50 border border-red-200/50 shadow-sm"
        >
          <p className="text-sm text-red-600 font-medium mb-3">{error}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-red-500 hover:text-red-700 transition-colors cursor-pointer"
            >
              <RefreshCw size={12} />
              Retry
            </button>
          )}
        </motion.div>
      ) : weather ? (
        <motion.div
          key="weather"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="p-6 rounded-2xl bg-white border border-muted/50 shadow-sm relative overflow-hidden group"
        >
          {/* Ambient glow */}
          <div className="absolute top-0 right-0 w-28 h-28 bg-accent/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:bg-accent/10 transition-colors" />

          <div className="relative z-10 space-y-4">
            {/* City header */}
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                <MapPin size={16} className="text-accent" />
              </div>
              <div>
                <h3 className="text-base font-bold text-primary leading-tight">{weather.city}</h3>
                <p className="text-[11px] font-medium text-primary/40">{weather.country} • Live Weather</p>
              </div>
            </div>

            {/* Temperature hero */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="px-4 py-3.5 rounded-xl bg-gradient-to-br from-accent/5 to-accent/10 border border-accent/10"
            >
              <div className="flex items-center gap-2 mb-1">
                <Thermometer size={14} className="text-accent" />
                <span className="text-[10px] font-bold text-accent uppercase tracking-wider">Temperature</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-extrabold text-primary">{weather.temperature}</span>
                <span className="text-sm font-bold text-primary/40">°C</span>
              </div>
            </motion.div>

            {/* Humidity & Rainfall */}
            <div className="grid grid-cols-2 gap-3">
              <MetricCard
                icon={Droplets}
                label="Humidity"
                value={weather.humidity}
                unit="%"
                color="from-blue-50/50 to-blue-50/80"
                delay={0.2}
              />
              <MetricCard
                icon={CloudRain}
                label="Est. Rain/mo"
                value={weather.rainfall_month_estimate}
                unit="mm"
                color="from-violet-50/50 to-violet-50/80"
                delay={0.3}
              />
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div
          key="empty"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-6 rounded-2xl bg-white/50 border border-dashed border-muted/50 shadow-sm"
        >
          <div className="text-center py-4">
            <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center mx-auto mb-3">
              <CloudRain size={22} className="text-primary/20" />
            </div>
            <p className="text-sm font-medium text-primary/40">Select a location to</p>
            <p className="text-sm font-medium text-primary/40">view live weather</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
