import { motion } from 'framer-motion';
import { FlaskRound, Atom, Zap, TestTubes } from 'lucide-react';
import { useAdvisorStore } from '@/store/advisorStore';

// ─── Status helpers ────────────────────────────────────────────────────────────

type Status = 'low' | 'optimal' | 'high';

interface NutrientRange {
  low: number;
  high: number;
  max: number;
}

const ranges: Record<string, NutrientRange> = {
  nitrogen: { low: 30, high: 100, max: 140 },
  phosphorus: { low: 25, high: 100, max: 145 },
  potassium: { low: 30, high: 150, max: 205 },
};

function getStatus(key: string, value: number): Status {
  const range = ranges[key];
  if (!range) return 'optimal';
  if (value < range.low) return 'low';
  if (value > range.high) return 'high';
  return 'optimal';
}

function getPhStatus(ph: number): Status {
  if (ph < 5.5) return 'low';
  if (ph > 7.5) return 'high';
  return 'optimal';
}

const statusConfig: Record<Status, { label: string; color: string; bg: string; border: string }> = {
  low: { label: 'Low', color: 'text-orange-600', bg: 'bg-orange-100', border: 'border-orange-200' },
  optimal: { label: 'Optimal', color: 'text-emerald-600', bg: 'bg-emerald-100', border: 'border-emerald-200' },
  high: { label: 'High', color: 'text-blue-600', bg: 'bg-blue-100', border: 'border-blue-200' },
};

// ─── Nutrient Bar ──────────────────────────────────────────────────────────────

function NutrientBar({
  value,
  max,
  status,
  delay = 0,
}: {
  value: number;
  max: number;
  status: Status;
  delay?: number;
}) {
  const pct = Math.min((value / max) * 100, 100);
  const barColor =
    status === 'low' ? 'bg-orange-400' : status === 'high' ? 'bg-blue-400' : 'bg-emerald-400';

  return (
    <div className="h-1.5 w-full bg-primary/5 rounded-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.8, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
        className={`h-full rounded-full ${barColor}`}
      />
    </div>
  );
}

// ─── pH Scale ──────────────────────────────────────────────────────────────────

function PhScale({ value }: { value: number }) {
  const pct = (value / 14) * 100;

  return (
    <div className="relative mt-2">
      <div
        className="h-2 w-full rounded-full overflow-hidden"
        style={{
          background:
            'linear-gradient(to right, #ef4444 0%, #eab308 30%, #4ade80 50%, #3b82f6 70%, #8b5cf6 100%)',
        }}
      />
      <motion.div
        initial={{ left: '50%' }}
        animate={{ left: `${pct}%` }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="absolute top-0 -translate-x-1/2 -translate-y-1"
        style={{ top: '-2px' }}
      >
        <div className="w-4 h-4 rounded-full bg-white border-2 border-primary shadow-md" />
      </motion.div>
      <div className="flex justify-between mt-1.5 px-0.5">
        <span className="text-[9px] font-bold text-red-400">Acidic</span>
        <span className="text-[9px] font-bold text-emerald-500">Neutral</span>
        <span className="text-[9px] font-bold text-violet-500">Alkaline</span>
      </div>
    </div>
  );
}

// ─── Soil Panel ────────────────────────────────────────────────────────────────

export default function SoilPanel() {
  const soilData = useAdvisorStore((s) => s.soilData);

  const n = Number(soilData.nitrogen) || 0;
  const p = Number(soilData.phosphorus) || 0;
  const k = Number(soilData.potassium) || 0;
  const ph = Number(soilData.ph) || 7;

  const nutrients = [
    { key: 'nitrogen', label: 'Nitrogen (N)', icon: Atom, value: n, unit: 'kg/ha', max: 140 },
    { key: 'phosphorus', label: 'Phosphorus (P)', icon: FlaskRound, value: p, unit: 'kg/ha', max: 145 },
    { key: 'potassium', label: 'Potassium (K)', icon: Zap, value: k, unit: 'kg/ha', max: 205 },
  ];

  const phStatus = getPhStatus(ph);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="p-6 rounded-2xl bg-white border border-muted/30 shadow-sm relative overflow-hidden"
    >
      {/* Ambient */}
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-emerald-100/40 rounded-full blur-3xl pointer-events-none translate-y-1/2 -translate-x-1/2" />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center gap-2 mb-5">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center">
            <FlaskRound size={15} className="text-emerald-500" />
          </div>
          <h3 className="text-sm font-bold text-primary/70 uppercase tracking-wider">
            Soil Analysis
          </h3>
        </div>

        {/* NPK Nutrients */}
        <div className="space-y-4 mb-6">
          {nutrients.map((nutrient, i) => {
            const Icon = nutrient.icon;
            const status = getStatus(nutrient.key, nutrient.value);
            const cfg = statusConfig[status];

            return (
              <motion.div
                key={nutrient.key}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.08 }}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <Icon size={14} className="text-primary/40" />
                    <span className="text-[13px] font-semibold text-primary/70">
                      {nutrient.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-extrabold text-primary">
                      {nutrient.value}
                      <span className="text-[10px] font-semibold text-primary/30 ml-1">
                        {nutrient.unit}
                      </span>
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.color} ${cfg.border} border`}
                    >
                      {cfg.label}
                    </span>
                  </div>
                </div>
                <NutrientBar
                  value={nutrient.value}
                  max={nutrient.max}
                  status={status}
                  delay={0.5 + i * 0.1}
                />
              </motion.div>
            );
          })}
        </div>

        {/* pH Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="pt-4 border-t border-muted/20"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <TestTubes size={14} className="text-primary/40" />
              <span className="text-[13px] font-semibold text-primary/70">Soil pH Level</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-extrabold text-primary">{ph}</span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusConfig[phStatus].bg} ${statusConfig[phStatus].color} ${statusConfig[phStatus].border} border`}
              >
                {phStatus === 'low' ? 'Acidic' : phStatus === 'high' ? 'Alkaline' : 'Neutral'}
              </span>
            </div>
          </div>
          <PhScale value={ph} />
        </motion.div>
      </div>
    </motion.div>
  );
}
