/**
 * API Configuration
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000';
const API_VERSION = 'v1';
const API_PREFIX = `/api/${API_VERSION}`;

export const API_CONFIG = {
  BASE_URL: API_BASE_URL,
  VERSION: API_VERSION,
  PREFIX: API_PREFIX,
  ENDPOINTS: {
    HEALTH: `${API_PREFIX}/health`,
    FUZZY: {
      INFO: `${API_PREFIX}/fuzzy/info`,
      TEMPERATURE: `${API_PREFIX}/fuzzy/temperature`,
      CALCULATE: `${API_PREFIX}/fuzzy/calculate`,
    },
    NEURAL_NETWORK: {
      INFO: `${API_PREFIX}/neural-network/info`,
      TRAIN: `${API_PREFIX}/neural-network/train`,
      PREDICT: `${API_PREFIX}/neural-network/predict`,
    },
  },
  TIMEOUT: 30000, // 30 seconds
};
