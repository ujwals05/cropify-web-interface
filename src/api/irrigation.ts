const BASE_URL = "http://localhost:8000/api/irrigation";

export interface IrrigationInput {
  soil_type: string;
  ph: number;
  moisture: number;
  organic: number;
  ec: number;
  temperature: number;
  humidity: number;
  rainfall: number;
  sunlight: number;
  wind: number;
  crop_type: string;
  crop_growth_stage: string;
  season: string;
  irrigation_type: string;
  water_source: string;
  area: number;
  mulching_used: string;
  previous_irrigation: number;
  region: string;
}

export interface IrrigationResult {
  irrigation_needed: string;
  confidence: number;
  recommendation: string;
}

export async function predictIrrigation(data: IrrigationInput): Promise<IrrigationResult> {
  const response = await fetch(`${BASE_URL}/predict`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Prediction failed");
  }
  return response.json();
}
