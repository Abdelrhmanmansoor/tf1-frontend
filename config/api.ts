// API Configuration for SportX Platform
// This file contains all API-related configuration

const API_CONFIG = {
  // Production API Base URL
  BASE_URL: 'https://sportsplatform-be.onrender.com/api/v1',

  // Request timeout (10 seconds)
  TIMEOUT: 10000,

  // LocalStorage keys for token and user data
  TOKEN_KEY: 'sportx_access_token',
  USER_KEY: 'sportx_user_data',
} as const

export default API_CONFIG
