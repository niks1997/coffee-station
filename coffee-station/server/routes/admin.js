import express from 'express';
const router = express.Router();

// In-memory order store (replace with DB if needed)
const orders = [];
export function getOrdersStore() { return orders; }

// GET all orders
router.get('/orders', (req, res) => {
  // newest first
  res.json(orders.slice().sort((a, b) => (b.id ?? 0) - (a.id ?? 0)));
});

// UPDATE order status
router.put('/orders/:id/status', (req, res) => {
  const id = Number(req.params.id);
  const { status } = req.body;

  const allowed = ['PENDING', 'IN_PROGRESS', 'READY', 'COMPLETED', 'CANCELLED'];
  if (!allowed.includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }

  const idx = orders.findIndex(o => Number(o.id) === id);
  if (idx === -1) return res.status(404).json({ message: 'Order not found' });

  orders[idx].status = status;
  orders[idx].updatedAt = new Date().toISOString();

  return res.json(orders[idx]);
});

export default router;
