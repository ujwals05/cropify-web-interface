import { motion } from 'framer-motion';
import {
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Info,
  type LucideIcon,
} from 'lucide-react';
import { useAdvisorStore } from '@/store/advisorStore';

// ─── Insight Types ─────────────────────────────────────────────────────────────

type InsightSeverity = 'success' | 'warning' | 'info';

interface Insight {
  text: string;
  severity: InsightSeverity;
  icon: LucideIcon;
}

const severityStyles: Record<InsightSeverity, { bg: string; border: string; iconColor: string }> = {
  success: {
    bg: 'bg-emerald-50/80',
    border: 'border-emerald-200/60',
    iconColor: 'text-emerald-500',
  },
  warning: {
    bg: 'bg-amber-50/80',
    border: 'border-amber-200/60',
    iconColor: 'text-amber-500',
  },
  info: {
    bg: 'bg-blue-50/80',
    border: 'border-blue-200/60',
    iconColor: 'text-blue-500',
  },
};

// ─── Rule Engine ───────────────────────────────────────────────────────────────

function generateInsights(
  soil: { nitrogen: number; phosphorus: number; potassium: number; ph: number },
  weather: { temperature: number; humidity: number; rainfall_month_estimate: number } | null,
  crop: string
): Insight[] {
  const insights: Insight[] = [];
  const cropName = crop.toLowerCase();

  // ── pH Insights ──
  if (soil.ph >= 5.5 && soil.ph <= 7.5) {
    insights.push({
      text: `Optimal pH range (${soil.ph}) detected for ${cropName} cultivation — ideal for nutrient absorption.`,
      severity: 'success',
      icon: CheckCircle2,
    });
  } else if (soil.ph < 5.5) {
    insights.push({
      text: `Acidic soil (pH ${soil.ph}) may limit phosphorus availability. Consider liming to raise pH.`,
      severity: 'warning',
      icon: AlertTriangle,
    });
  } else {
    insights.push({
      text: `Alkaline soil (pH ${soil.ph}) detected — iron and zinc uptake may be reduced.`,
      severity: 'warning',
      icon: AlertTriangle,
    });
  }

  // ── Nitrogen Insights ──
  if (soil.nitrogen < 30) {
    insights.push({
      text: 'Low nitrogen levels may stunt vegetative growth. Consider urea or ammonium-based fertilizers.',
      severity: 'warning',
      icon: AlertTriangle,
    });
  } else if (soil.nitrogen > 100) {
    insights.push({
      text: 'High nitrogen content promotes strong leaf growth — excellent for leafy crops.',
      severity: 'success',
      icon: CheckCircle2,
    });
  }

  // ── Potassium Insights ──
  if (soil.potassium < 30) {
    insights.push({
      text: 'Low potassium may reduce crop yield and disease resistance. Apply potash fertilizer.',
      severity: 'warning',
      icon: AlertTriangle,
    });
  } else if (soil.potassium >= 30 && soil.potassium <= 150) {
    insights.push({
      text: 'Potassium levels support healthy root development and water regulation.',
      severity: 'success',
      icon: CheckCircle2,
    });
  }

  // ── Phosphorus Insights ──
  if (soil.phosphorus < 25) {
    insights.push({
      text: 'Low phosphorus may limit root and flower development. Consider DAP or superphosphate.',
      severity: 'warning',
      icon: AlertTriangle,
    });
  }

  // ── Weather Insights ──
  if (weather) {
    if (weather.humidity > 70) {
      insights.push({
        text: `High humidity (${weather.humidity}%) supports crop growth but increases fungal disease risk.`,
        severity: 'info',
        icon: Info,
      });
    }
    if (weather.rainfall_month_estimate > 120) {
      insights.push({
        text: `Abundant rainfall (est. ${weather.rainfall_month_estimate}mm/mo) reduces irrigation needs — ideal for water-intensive crops.`,
        severity: 'success',
        icon: CheckCircle2,
      });
    }
    if (weather.temperature > 35) {
      insights.push({
        text: `High temperature (${weather.temperature}°C) — ensure adequate irrigation to prevent heat stress.`,
        severity: 'warning',
        icon: AlertTriangle,
      });
    }
    if (weather.temperature >= 20 && weather.temperature <= 30) {
      insights.push({
        text: `Temperature (${weather.temperature}°C) falls in the ideal growth range for most crops.`,
        severity: 'success',
        icon: CheckCircle2,
      });
    }
  }

  // Limit to 5 most relevant
  return insights.slice(0, 5);
}

// ─── Insights Panel ────────────────────────────────────────────────────────────

export default function InsightsPanel() {
  const prediction = useAdvisorStore((s) => s.prediction);
  const soilData = useAdvisorStore((s) => s.soilData);
  const weather = useAdvisorStore((s) => s.weather);

  if (!prediction) return null;

  const soil = {
    nitrogen: Number(soilData.nitrogen) || 0,
    phosphorus: Number(soilData.phosphorus) || 0,
    potassium: Number(soilData.potassium) || 0,
    ph: Number(soilData.ph) || 7,
  };

  const insights = generateInsights(soil, weather, prediction.recommended_crop);

  if (insights.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.35 }}
      className="p-6 rounded-2xl bg-white border border-muted/30 shadow-sm"
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-5">
        <div className="w-7 h-7 rounded-lg bg-accent/10 flex items-center justify-center">
          <Sparkles size={15} className="text-accent" />
        </div>
        <h3 className="text-sm font-bold text-primary/70 uppercase tracking-wider">
          AI Insights
        </h3>
        <span className="ml-auto text-[10px] font-bold text-primary/25 uppercase tracking-widest">
          Rule-based Analysis
        </span>
      </div>

      {/* Insight list */}
      <div className="space-y-3">
        {insights.map((insight, i) => {
          const Icon = insight.icon;
          const style = severityStyles[insight.severity];

          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.45 + i * 0.08 }}
              className={`flex items-start gap-3 px-4 py-3 rounded-xl ${style.bg} border ${style.border}`}
            >
              <Icon size={15} className={`${style.iconColor} shrink-0 mt-0.5`} />
              <p className="text-[12px] text-primary/70 leading-relaxed font-medium">
                {insight.text}
              </p>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
