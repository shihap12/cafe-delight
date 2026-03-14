export const API_BASE = "/api";

export async function fetchSettings() {
  const res = await fetch(`${API_BASE}/settings.php`);
  return res.json();
}

export function buildApiUrl(name: string) {
  // backend exposes endpoints like /api/menu.php, /api/order.php
  return `${API_BASE}/${name}.php`;
}
