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
};
