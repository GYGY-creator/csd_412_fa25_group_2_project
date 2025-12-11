export function getApiBase() {
  const url = import.meta.env.VITE_API_URL || ''
  return `${url}/api/v1`
}

export const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
