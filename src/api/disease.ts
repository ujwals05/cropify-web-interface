const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export interface DiseaseResult {
  plant: string;
  disease: string;
  confidence: number;
  is_healthy: boolean;
  treatment: string;
  top_3: Array<{
    plant: string;
    disease: string;
    confidence: number;
    is_healthy: boolean;
  }>;
}

export async function detectDisease(file: File): Promise<DiseaseResult> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${BASE_URL}/api/disease/predict`, {
    method: "POST",
    body: formData,
    // Do NOT set Content-Type header manually
    // Browser sets it automatically with correct boundary for multipart
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Disease detection failed");
  }

  return response.json();
}
