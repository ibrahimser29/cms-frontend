const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export async function getSections() {
  try {
    const res = await fetch(`${API_BASE}/homepage`, { cache: 'no-store' });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data ?? [];
  } catch {
    return [];
  }
}

export async function getProducts() {
  try {
    const res = await fetch(`${API_BASE}/wood`, { cache: 'no-store' });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data ?? [];
  } catch {
    return [];
  }
}

export async function getPrices() {
  try {
    const res = await fetch(`${API_BASE}/price`, { cache: 'no-store' });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data ?? [];
  } catch {
    return [];
  }
}
