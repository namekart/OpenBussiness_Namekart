import { apiRequest } from "@/lib/queryClient";
import { api } from "@shared/routes";

export type FeaturesResponse = { aiChatbot: boolean };

export async function fetchFeatures(): Promise<FeaturesResponse> {
  const res = await apiRequest("GET", api.features.get.path);
  return res.json();
}
