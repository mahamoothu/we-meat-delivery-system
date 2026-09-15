import { BaseApiClient } from '@wemeat/api-client';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://10.0.2.2:5000/api/v1';

export const apiClient = new BaseApiClient({
  baseURL: API_BASE_URL,
  getAuthToken: () => {
    // Placeholder for secure storage token retrieval (e.g., expo-secure-store in future)
    return null;
  },
});
