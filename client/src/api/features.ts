import { apiRequest } from "@/lib/queryClient";

export type FeaturesResponse = { aiChatbot: boolean };
const FEATURES_PATH = "/api/features";

export async function fetchFeatures(): Promise<FeaturesResponse> {
  const res = await apiRequest("GET", FEATURES_PATH);
  return res.json();
}
