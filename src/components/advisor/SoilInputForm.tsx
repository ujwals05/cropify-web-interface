import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FlaskRound, Atom, Zap, TestTubes, Info } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface SoilData {
  nitrogen: string;
  phosphorus: string;
  potassium: string;
  ph: string;
}

interface SoilInputFormProps {
  values: SoilData;
  onChange: (values: SoilData) => void;
  errors: Partial<Record<keyof SoilData, string>>;
}

interface FieldConfig {
  key: keyof SoilData;
  label: string;
  icon: LucideIcon;
  min: number;
  max: number;
  step: number;
  unit: string;
  tooltip: string;
  placeholder: string;
}

const fields: FieldConfig[] = [
  {
    key: 'nitrogen',
    label: 'Nitrogen (N)',
    icon: Atom,
    min: 0,
    max: 140,
    step: 1,
    unit: 'kg/ha',
    tooltip: 'Nitrogen promotes leaf growth and green coloring. Essential for vegetative growth.',
    placeholder: '0 – 140',
  },
  {
    key: 'phosphorus',
    label: 'Phosphorus (P)',
    icon: FlaskRound,
    min: 0,
    max: 145,
    step: 1,
    unit: 'kg/ha',
    tooltip: 'Phosphorus supports root development and flower/fruit production.',
    placeholder: '0 – 145',
  },
  {
    key: 'potassium',
    label: 'Potassium (K)',
    icon: Zap,
    min: 0,
    max: 205,
    step: 1,
    unit: 'kg/ha',
    tooltip: 'Potassium strengthens plant immunity and regulates water uptake.',
    placeholder: '0 – 205',
  },
];

function Tooltip({ text }: { text: string }) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative inline-block">
      <button
        type="button"
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        onFocus={() => setShow(true)}
        onBlur={() => setShow(false)}
        className="text-primary/30 hover:text-accent transition-colors p-0.5 cursor-pointer"
        aria-label="Info"
      >
        <Info size={14} />
      </button>
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-primary text-white text-[11px] leading-relaxed font-medium rounded-lg shadow-xl z-50 w-52 pointer-events-none"
          >
            {text}
            <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[5px] border-r-[5px] border-t-[5px] border-l-transparent border-r-transparent border-t-primary" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function SoilInputForm({ values, onChange, errors }: SoilInputFormProps) {
  const handleChange = useCallback(
    (key: keyof SoilData, value: string) => {
      onChange({ ...values, [key]: value });
    },
    [values, onChange]
  );

  return (
    <div className="space-y-6">
      {/* NPK Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {fields.map((field) => {
          const Icon = field.icon;
          const error = errors[field.key];
          return (
            <div key={field.key} className="space-y-1.5">
              <div className="flex items-center gap-1.5 px-1">
                <label
                  htmlFor={`soil-${field.key}`}
                  className="text-sm font-semibold text-primary/80"
                >
                  {field.label}
                </label>
                <Tooltip text={field.tooltip} />
              </div>
              <div className="relative group">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-primary/30 group-focus-within:text-accent transition-colors duration-200">
                  <Icon size={16} />
                </div>
                <input
                  id={`soil-${field.key}`}
                  type="number"
                  min={field.min}
                  max={field.max}
                  step={field.step}
                  value={values[field.key]}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  placeholder={field.placeholder}
                  className={`w-full pl-10 pr-14 py-3 rounded-xl bg-white/50 backdrop-blur-sm border 
                    ${error ? 'border-red-400 focus:ring-red-400/30' : 'border-muted/50 focus:ring-accent/30'}
                    focus:bg-white focus:ring-2 focus:border-accent transition-all duration-200 font-medium text-primary 
                    placeholder:text-primary/20 shadow-sm text-sm [appearance:textfield] 
                    [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-primary/25 uppercase tracking-wide">
                  {field.unit}
                </span>
              </div>
              <AnimatePresence>
                {error && (
                  <motion.span
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    className="text-[11px] font-medium text-red-500 px-1 block"
                  >
                    {error}
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* pH Slider + Input Combo */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-1.5 px-1">
          <label htmlFor="soil-ph" className="text-sm font-semibold text-primary/80">
            Soil pH Level
          </label>
          <Tooltip text="pH measures soil acidity/alkalinity. Most crops thrive between 5.5–7.5. Below 7 = acidic, above 7 = alkaline." />
        </div>

        <div className="flex items-center gap-4">
          {/* Slider */}
          <div className="flex-1 relative">
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-bold text-red-400 shrink-0">Acidic</span>
              <div className="flex-1 relative">
                <input
                  type="range"
                  min="0"
                  max="14"
                  step="0.1"
                  value={values.ph || '7'}
                  onChange={(e) => handleChange('ph', e.target.value)}
                  className="w-full h-2 rounded-full appearance-none cursor-pointer
                    [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 
                    [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-accent [&::-webkit-slider-thumb]:shadow-lg
                    [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:cursor-pointer
                    [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-110"
                  style={{
                    background: `linear-gradient(to right, #ef4444 0%, #eab308 35%, #4ade80 50%, #3b82f6 75%, #8b5cf6 100%)`,
                  }}
                />
              </div>
              <span className="text-[10px] font-bold text-violet-500 shrink-0">Alkaline</span>
            </div>
          </div>

          {/* Numeric input */}
          <div className="relative w-24 shrink-0">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-primary/30">
              <TestTubes size={14} />
            </div>
            <input
              id="soil-ph"
              type="number"
              min="0"
              max="14"
              step="0.1"
              value={values.ph}
              onChange={(e) => handleChange('ph', e.target.value)}
              placeholder="0 – 14"
              className={`w-full pl-9 pr-3 py-3 rounded-xl bg-white/50 backdrop-blur-sm border 
                ${errors.ph ? 'border-red-400 focus:ring-red-400/30' : 'border-muted/50 focus:ring-accent/30'}
                focus:bg-white focus:ring-2 focus:border-accent transition-all duration-200 font-bold text-primary 
                text-sm text-center shadow-sm [appearance:textfield] 
                [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
            />
          </div>
        </div>

        <AnimatePresence>
          {errors.ph && (
            <motion.span
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="text-[11px] font-medium text-red-500 px-1 block"
            >
              {errors.ph}
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
