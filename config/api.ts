// API Configuration for SportX Platform
// This file contains all API-related configuration

const API_CONFIG = {
  // Production API Base URL - can be overridden with NEXT_PUBLIC_API_URL env variable
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'https://tf1-backend.onrender.com/api/v1',

  // Request timeout (30 seconds - Render free tier can be slow)
  TIMEOUT: 30000,

  // LocalStorage keys for token and user data
  TOKEN_KEY: 'sportx_access_token',
  USER_KEY: 'sportx_user_data',
} as const

export default API_CONFIG
