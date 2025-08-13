const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000';

export async function createOrder(payload) {
  const res = await fetch(`${API_BASE}/api/create-order`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Create order failed');
  return res.json();
}

export async function verifyPayment(payload) {
  const res = await fetch(`${API_BASE}/api/verify-payment`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Verify failed');
  return res.json();
}

export async function getOrder(id) {
  const res = await fetch(`${API_BASE}/api/orders/${id}`);
  if (!res.ok) throw new Error('Order not found');
  return res.json();
}
