import { motion } from 'framer-motion';
import { Lightbulb, Droplets, FlaskRound, Sprout } from 'lucide-react';
import { useAdvisorStore } from '@/store/advisorStore';

// ─── Recommendation Generator ──────────────────────────────────────────────────

interface Recommendation {
  title: string;
  description: string;
  icon: typeof Lightbulb;
  color: string;
  iconBg: string;
}

function generateRecommendations(
  soil: { nitrogen: number; phosphorus: number; potassium: number; ph: number },
  weather: { temperature: number; humidity: number; rainfall: number } | null
): Recommendation[] {
  const recs: Recommendation[] = [];

  // ── Soil Improvement ──
  const soilIssues: string[] = [];
  if (soil.nitrogen < 30) soilIssues.push('Apply urea or ammonium sulfate (60–80 kg/ha) to boost nitrogen');
  if (soil.phosphorus < 25) soilIssues.push('Use DAP or single superphosphate to increase phosphorus');
  if (soil.potassium < 30) soilIssues.push('Add muriate of potash (40–60 kg/ha) for potassium');
  if (soil.ph < 5.5) soilIssues.push('Apply agricultural lime to neutralize acidity');
  if (soil.ph > 7.5) soilIssues.push('Add sulfur or gypsum to lower alkalinity');

  recs.push({
    title: 'Soil Improvement',
    description:
      soilIssues.length > 0
        ? soilIssues.join('. ') + '.'
        : 'Soil nutrient levels are well-balanced. Maintain with regular organic matter application and crop rotation.',
    icon: FlaskRound,
    color: 'text-emerald-600',
    iconBg: 'bg-emerald-100',
  });

  // ── Irrigation Advice ──
  let irrigationAdvice: string;
  if (weather) {
    if (weather.rainfall > 120) {
      irrigationAdvice =
        'Rainfall is sufficient — focus on drainage management to prevent waterlogging. Monitor field moisture regularly.';
    } else if (weather.rainfall > 60) {
      irrigationAdvice =
        'Moderate rainfall detected. Supplement with drip or sprinkler irrigation during dry spells for consistent moisture.';
    } else {
      irrigationAdvice =
        'Low rainfall conditions — implement scheduled irrigation. Drip systems are recommended for water efficiency.';
    }

    if (weather.temperature > 30) {
      irrigationAdvice += ' Increase watering frequency during peak heat hours.';
    }
  } else {
    irrigationAdvice =
      'Set up moisture sensors to optimize irrigation scheduling based on actual field conditions.';
  }

  recs.push({
    title: 'Irrigation Strategy',
    description: irrigationAdvice,
    icon: Droplets,
    color: 'text-blue-600',
    iconBg: 'bg-blue-100',
  });

  // ── Fertilizer Hints ──
  const npkRatio = `${soil.nitrogen}:${soil.phosphorus}:${soil.potassium}`;
  let fertAdvice = `Current NPK ratio is ${npkRatio}. `;

  if (soil.nitrogen > soil.phosphorus * 2) {
    fertAdvice +=
      'Nitrogen-heavy profile — reduce nitrogen-based fertilizers and increase phosphate application for balanced growth.';
  } else if (soil.phosphorus > soil.nitrogen * 2) {
    fertAdvice +=
      'Phosphorus-heavy profile — switch to nitrogen-rich fertilizers like ammonium nitrate to balance nutrition.';
  } else {
    fertAdvice +=
      'Balanced NPK profile detected. Apply a complete fertilizer (like 10:10:10) during planting season for maintenance.';
  }

  recs.push({
    title: 'Fertilizer Plan',
    description: fertAdvice,
    icon: Sprout,
    color: 'text-amber-600',
    iconBg: 'bg-amber-100',
  });

  return recs;
}

// ─── Recommendation Panel ──────────────────────────────────────────────────────

export default function RecommendationPanel() {
  const soilData = useAdvisorStore((s) => s.soilData);
  const weather = useAdvisorStore((s) => s.weather);

  const soil = {
    nitrogen: Number(soilData.nitrogen) || 0,
    phosphorus: Number(soilData.phosphorus) || 0,
    potassium: Number(soilData.potassium) || 0,
    ph: Number(soilData.ph) || 7,
  };

  const recommendations = generateRecommendations(soil, weather);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="p-6 rounded-2xl bg-white border border-muted/30 shadow-sm"
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-5">
        <div className="w-7 h-7 rounded-lg bg-amber-500/10 flex items-center justify-center">
          <Lightbulb size={15} className="text-amber-500" />
        </div>
        <h3 className="text-sm font-bold text-primary/70 uppercase tracking-wider">
          Recommendations
        </h3>
      </div>

      {/* Recommendation cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {recommendations.map((rec, i) => {
          const Icon = rec.icon;
          return (
            <motion.div
              key={rec.title}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.1 }}
              className="p-4 rounded-xl bg-gradient-to-br from-background to-white border border-muted/20 hover:border-muted/40 transition-colors group"
            >
              <div className={`w-9 h-9 rounded-xl ${rec.iconBg} flex items-center justify-center mb-3`}>
                <Icon size={16} className={rec.color} />
              </div>
              <h4 className="text-[13px] font-bold text-primary mb-2">{rec.title}</h4>
              <p className="text-[11px] text-primary/50 leading-relaxed font-medium">
                {rec.description}
              </p>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
