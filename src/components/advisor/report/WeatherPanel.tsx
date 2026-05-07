import { motion } from 'framer-motion';
import { Thermometer, Droplets, CloudRain, MapPin, Cloud } from 'lucide-react';
import { useAdvisorStore } from '@/store/advisorStore';

// ─── Climate Insight Generator ─────────────────────────────────────────────────

function getClimateInsight(temp: number, humidity: number, rainfall_month_estimate: number): string {
  if (humidity > 75 && rainfall_month_estimate > 100) {
    return 'Climate conditions favor water-intensive crops like rice and sugarcane.';
  }
  if (humidity > 60 && temp > 25) {
    return 'Warm and humid conditions support tropical crop varieties.';
  }
  if (temp < 20 && rainfall_month_estimate < 50) {
    return 'Cool and dry conditions are suitable for wheat and barley cultivation.';
  }
  if (temp > 30 && humidity < 40) {
    return 'Hot arid conditions — consider drought-resistant crop varieties.';
  }
  if (rainfall_month_estimate > 150) {
    return 'Heavy rainfall region — focus on crops with strong water-logging tolerance.';
  }
  return 'Moderate climate profile supports a diverse range of crop options.';
}

// ─── Weather Panel ─────────────────────────────────────────────────────────────

export default function WeatherPanel() {
  const weather = useAdvisorStore((s) => s.weather);

  if (!weather) return null;

  const insight = getClimateInsight(weather.temperature, weather.humidity, weather.rainfall_month_estimate);

  const metrics = [
    {
      icon: Thermometer,
      label: 'Temperature',
      value: weather.temperature,
      unit: '°C',
      gradient: 'from-orange-50 to-amber-50/80',
      iconColor: 'text-orange-500',
    },
    {
      icon: Droplets,
      label: 'Humidity',
      value: weather.humidity,
      unit: '%',
      gradient: 'from-blue-50 to-cyan-50/80',
      iconColor: 'text-blue-500',
    },
    {
      icon: CloudRain,
      label: 'Est. Rainfall',
      value: weather.rainfall_month_estimate,
      unit: 'mm',
      gradient: 'from-violet-50 to-purple-50/80',
      iconColor: 'text-violet-500',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.25 }}
      className="p-6 rounded-2xl bg-white border border-muted/30 shadow-sm relative overflow-hidden"
    >
      {/* Ambient */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-blue-100/40 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2" />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <Cloud size={15} className="text-blue-500" />
            </div>
            <h3 className="text-sm font-bold text-primary/70 uppercase tracking-wider">
              Weather Intelligence
            </h3>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] font-medium text-primary/40">
            <MapPin size={12} />
            <span>{weather.city}, {weather.country}</span>
          </div>
        </div>

        {/* Metrics grid */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          {metrics.map((metric, i) => {
            const Icon = metric.icon;
            return (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 + i * 0.08 }}
                className={`px-3.5 py-3.5 rounded-xl bg-gradient-to-br ${metric.gradient} border border-muted/20`}
              >
                <div className="flex items-center gap-1.5 mb-1.5">
                  <Icon size={13} className={metric.iconColor} />
                  <span className="text-[10px] font-bold text-primary/40 uppercase tracking-wider">
                    {metric.label}
                  </span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-extrabold text-primary">{metric.value}</span>
                  <span className="text-xs font-semibold text-primary/40">{metric.unit}</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Climate insight */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex items-start gap-2.5 px-4 py-3 rounded-xl bg-blue-50/60 border border-blue-100/60"
        >
          <Cloud size={14} className="text-blue-500 shrink-0 mt-0.5" />
          <p className="text-[12px] text-primary/60 leading-relaxed font-medium">{insight}</p>
        </motion.div>
      </div>
    </motion.div>
  );
}
