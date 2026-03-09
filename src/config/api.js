const API_BASE = import.meta.env.VITE_API_BASE || "/api";

export const buildApiUrl = (endpoint) => `${API_BASE}/${endpoint}.php`;
