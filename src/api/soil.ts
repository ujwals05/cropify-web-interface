import api from "./axios";

export interface SoilAnalysisResult {
  fertility_value: number;
  fertility_level: 'Low' | 'Medium' | 'High';
  interpretation: string;
}

export const analyzeSoil = async (ndvi: number, moisture: number, elevation: number): Promise<SoilAnalysisResult> => {
  const response = await api.post('/api/soil/fertility', {
    ndvi,
    moisture,
    elevation,
  });
  return response.data;
};
