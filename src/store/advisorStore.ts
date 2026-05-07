import { create } from 'zustand';
import api from '@/api/axios';

// ─── Types ─────────────────────────────────────────────────────────────────────

export interface LocationData {
  lat: number;
  lng: number;
  city: string;
  region?: string;
}

export interface SoilData {
  nitrogen: string;
  phosphorus: string;
  potassium: string;
  ph: string;
}

export interface WeatherData {
  city: string;
  country: string;
  temperature: number;
  humidity: number;
  rainfall_5day: number;
  rainfall_month_estimate: number;
}

export interface TopCrop {
  crop: string;
  confidence: number;
}

export interface PredictionData {
  recommended_crop: string;
  confidence: number;
  top_3: TopCrop[];
}

// ─── Validation ────────────────────────────────────────────────────────────────

export function validateSoilData(
  values: SoilData
): Partial<Record<keyof SoilData, string>> {
  const errors: Partial<Record<keyof SoilData, string>> = {};
  const n = Number(values.nitrogen);
  const p = Number(values.phosphorus);
  const k = Number(values.potassium);
  const ph = Number(values.ph);

  if (values.nitrogen === '' || isNaN(n)) errors.nitrogen = 'Required';
  else if (n < 0 || n > 140) errors.nitrogen = 'Must be 0–140';

  if (values.phosphorus === '' || isNaN(p)) errors.phosphorus = 'Required';
  else if (p < 0 || p > 145) errors.phosphorus = 'Must be 0–145';

  if (values.potassium === '' || isNaN(k)) errors.potassium = 'Required';
  else if (k < 0 || k > 205) errors.potassium = 'Must be 0–205';

  if (values.ph === '' || isNaN(ph)) errors.ph = 'Required';
  else if (ph < 0 || ph > 14) errors.ph = 'Must be 0–14';

  return errors;
}

// ─── Store ─────────────────────────────────────────────────────────────────────

interface AdvisorState {
  // Location
  location: LocationData | null;
  // Soil
  soilData: SoilData;
  soilErrors: Partial<Record<keyof SoilData, string>>;
  hasAttemptedSubmit: boolean;
  // Weather
  weather: WeatherData | null;
  weatherLoading: boolean;
  weatherError: string | null;
  // Prediction
  prediction: PredictionData | null;
  predicting: boolean;
  showResults: boolean;

  // ── Actions ──
  setLocation: (loc: LocationData | null) => void;
  setSoilData: (data: SoilData) => void;
  setSoilErrors: (errors: Partial<Record<keyof SoilData, string>>) => void;
  setHasAttemptedSubmit: (v: boolean) => void;
  fetchWeather: (loc: LocationData) => Promise<void>;
  clearLocation: () => void;
  submitPrediction: () => Promise<void>;
  reset: () => void;
}

const initialSoilData: SoilData = {
  nitrogen: '',
  phosphorus: '',
  potassium: '',
  ph: '',
};

export const useAdvisorStore = create<AdvisorState>((set, get) => ({
  // ── Initial state ──
  location: null,
  soilData: { ...initialSoilData },
  soilErrors: {},
  hasAttemptedSubmit: false,
  weather: null,
  weatherLoading: false,
  weatherError: null,
  prediction: null,
  predicting: false,
  showResults: false,

  // ── Actions ──
  setLocation: (loc) => set({ location: loc }),

  setSoilData: (data) => {
    set({ soilData: data });
    if (get().hasAttemptedSubmit) {
      set({ soilErrors: validateSoilData(data) });
    }
  },

  setSoilErrors: (errors) => set({ soilErrors: errors }),
  setHasAttemptedSubmit: (v) => set({ hasAttemptedSubmit: v }),

  fetchWeather: async (loc) => {
    set({ weatherLoading: true, weatherError: null });
    try {
      const res = await api.post('/api/weather/coords', {
        lat: loc.lat,
        lon: loc.lng,
      });
      set({ weather: res.data });
    } catch {
      set({ weatherError: 'Could not fetch weather data. Please try again.', weather: null });
    } finally {
      set({ weatherLoading: false });
    }
  },

  clearLocation: () =>
    set({ location: null, weather: null, weatherError: null }),

  submitPrediction: async () => {
    const { location, soilData, weather } = get();
    set({ hasAttemptedSubmit: true });

    const errors = validateSoilData(soilData);
    set({ soilErrors: errors });

    if (!location || Object.keys(errors).length > 0 || !weather) return;

    set({ predicting: true });
    try {
      const res = await api.post('/api/crop/recommend', {
        lat: location.lat,
        lon: location.lng,
        nitrogen: Number(soilData.nitrogen),
        phosphorus: Number(soilData.phosphorus),
        potassium: Number(soilData.potassium),
        ph: Number(soilData.ph),
      });
      
      // Log response for debugging missing fields
      console.log('[Advisor] API Response:', res.data);

      const predictionRaw = res.data?.prediction;
      const weatherRaw = res.data?.weather;

      // Handle backend returning prediction as a string instead of object
      const mappedPrediction: PredictionData = typeof predictionRaw === 'string'
        ? {
            recommended_crop: predictionRaw,
            confidence: 90, // Fallback
            top_3: []       // Fallback
          }
        : predictionRaw;

      set({
        prediction: mappedPrediction,
        weather: weatherRaw || weather, // Fallback to existing if missing
        showResults: true,
      });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Prediction failed. Please try again.';
      console.error('[Advisor] Prediction error:', message);
      set({ weatherError: message });
    } finally {
      set({ predicting: false });
    }
  },

  reset: () =>
    set({
      showResults: false,
      prediction: null,
      soilData: { ...initialSoilData },
      soilErrors: {},
      hasAttemptedSubmit: false,
      location: null,
      weather: null,
      weatherError: null,
    }),
}));
