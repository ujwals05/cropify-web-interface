import { motion } from 'framer-motion';
import { BarChart3, TrendingDown, Crown } from 'lucide-react';
import { useAdvisorStore } from '@/store/advisorStore';

// ─── Animated Confidence Bar ───────────────────────────────────────────────────

function ConfidenceBar({ value, delay = 0, accent = false }: { value: number; delay?: number; accent?: boolean }) {
  const getColor = (v: number) => {
    if (accent) return 'bg-accent';
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

// ─── Alternatives List ─────────────────────────────────────────────────────────

export default function AlternativesList() {
  const prediction = useAdvisorStore((s) => s.prediction);

  if (!prediction || !prediction.top_3 || prediction.top_3.length === 0) return null;

  const topConfidence = prediction.top_3[0]?.confidence ?? 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15 }}
    >
      <div className="flex items-center gap-2 mb-4 px-1">
        <div className="w-7 h-7 rounded-lg bg-accent/10 flex items-center justify-center">
          <BarChart3 size={15} className="text-accent" />
        </div>
        <h3 className="text-sm font-bold text-primary/70 uppercase tracking-wider">
          Top Recommendations
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {prediction.top_3.map((item, index) => {
          const isTop = index === 0;
          const diff = topConfidence - item.confidence;

          return (
            <motion.div
              key={item.crop}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.25 + index * 0.1 }}
              className={`relative p-5 rounded-2xl border transition-all duration-300 group ${
                isTop
                  ? 'bg-accent/5 border-accent/25 shadow-lg shadow-accent/5'
                  : 'bg-white border-muted/30 shadow-sm hover:border-accent/20 hover:shadow-md'
              }`}
            >
              {/* Top badge */}
              {isTop && (
                <div className="absolute -top-2.5 right-4">
                  <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-accent text-white text-[10px] font-bold tracking-wider uppercase shadow-lg shadow-accent/30">
                    <Crown size={10} />
                    Best
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3 mb-4">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ${
                    isTop
                      ? 'bg-accent/20 text-accent'
                      : 'bg-primary/5 text-primary/40'
                  }`}
                >
                  #{index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-primary capitalize text-base truncate">
                    {item.crop}
                  </h4>
                  {!isTop && diff > 0 && (
                    <div className="flex items-center gap-1 mt-0.5">
                      <TrendingDown size={11} className="text-primary/30" />
                      <span className="text-[10px] font-semibold text-primary/30">
                        −{diff.toFixed(1)}% from top
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[11px] font-medium text-primary/40">Confidence</span>
                  <span
                    className={`text-sm font-extrabold ${
                      isTop ? 'text-accent' : 'text-primary/70'
                    }`}
                  >
                    {item.confidence}%
                  </span>
                </div>
                <ConfidenceBar value={item.confidence} delay={0.5 + index * 0.12} accent={isTop} />
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
