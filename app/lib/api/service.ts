/**
 * API Service - Specific API calls
 */

import { apiClient } from './client';
import { API_CONFIG } from '../constants/api';

export const apiService = {
  /**
   * Health Check
   */
  health: {
    check: () => apiClient.get(API_CONFIG.ENDPOINTS.HEALTH),
  },

  /**
   * Fuzzy Logic APIs
   */
  fuzzy: {
    getInfo: () => apiClient.get(API_CONFIG.ENDPOINTS.FUZZY.INFO),
    classifyTemperature: (temperature: number) =>
      apiClient.post(API_CONFIG.ENDPOINTS.FUZZY.TEMPERATURE, { temperature }),
    calculate: (data: any) =>
      apiClient.post(API_CONFIG.ENDPOINTS.FUZZY.CALCULATE, data),
  },

  /**
   * Neural Network APIs
   */
  neuralNetwork: {
    getInfo: () => apiClient.get(API_CONFIG.ENDPOINTS.NEURAL_NETWORK.INFO),
    train: (trainingData: any, epochs: number = 100) =>
      apiClient.post(API_CONFIG.ENDPOINTS.NEURAL_NETWORK.TRAIN, {
        training_data: trainingData,
        epochs,
      }),
    predict: (input: any) =>
      apiClient.post(API_CONFIG.ENDPOINTS.NEURAL_NETWORK.PREDICT, { input }),
  },

  /**
   * Fuzzy Mamdani APIs (Tugas 2)
   */
  mamdani: {
    getInfo: () => apiClient.get('/api/v1/mamdani/info'),
    getMembershipFunctions: () => apiClient.get('/api/v1/mamdani/membership-functions'),
    compute: (params: {
      demand: number;
      inventory: number;
      params?: {
        demand_range?: [number, number];
        inventory_range?: [number, number];
        production_range?: [number, number];
        resolution?: number;
      };
    }) => apiClient.post('/api/v1/mamdani/compute', params),
  },
};
