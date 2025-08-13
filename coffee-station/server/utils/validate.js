export function isValidOrderPayload(body) {
  const { cart, total, orderType, details } = body || {};
  if (!Array.isArray(cart) || cart.length === 0) return false;
  if (typeof total !== 'number' || total <= 0) return false;
  if (!['inside', 'outside'].includes(orderType)) return false;
  if (typeof details !== 'string' || !details.trim()) return false;
  return true;
}
