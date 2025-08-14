import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import twilio from 'twilio';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import cors from 'cors';

import adminRoutes, { getOrdersStore } from './routes/admin.js';
import adminAuth from './utils/adminAuth.js';

dotenv.config();

const app = express();
app.use(cors({ origin: '*' })); // dev only
app.use(express.json()); // parse JSON
app.use(bodyParser.json()); // extra parsing (optional)

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

// Socket namespace for admin dashboard
const adminNs = io.of('/admin');
adminNs.on('connection', (socket) => {
  console.log('Admin connected:', socket.id);
});

// Twilio client
const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// Protect all admin APIs with token
app.use('/api/admin', adminAuth, adminRoutes);

// Receive new orders from customer app
app.post('/new-order', async (req, res) => {
  const order = req.body;

  // default server-side fields
  order.status = order.status || 'PENDING';
  order.createdAt = order.createdAt || new Date().toISOString();
  order.updatedAt = order.updatedAt || order.createdAt;

  // store in memory (swap with DB if needed)
  const store = getOrdersStore();
  store.push(order);

  // realtime push to admins
  adminNs.emit('order-received', order);

  // Try to send WhatsApp receipt but don't block order placement
  try {
    let message = `*Coffee Station Receipt*\n\n`;
    message += `*${order.orderType === 'inside' ? 'Table' : 'Vehicle'}:* ${order.details}\n`;
    message += `*Phone:* ${order.phone}\n`;
    message += `*Order ID:* ${order.id}\n\n`;
    message += `*Items:*\n`;
    order.cart.forEach(item => {
      message += `${item.name} x${item.qty} - ₹${(item.price * item.qty).toFixed(2)}\n`;
    });
    message += `\n*Subtotal:* ₹${order.subtotal.toFixed(2)}`;
    message += `\n*GST(18%):* ₹${order.gst.toFixed(2)}`;
    message += `\n*Total:* ₹${order.total.toFixed(2)}`;
    message += `\n*Payment:* ${order.payment.method}`;

    await twilioClient.messages.create({
      from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`, // e.g. +14155238886 in .env
      to: `whatsapp:${order.phone}`,
      body: message
    });

    console.log(`WhatsApp receipt sent to ${order.phone}`);
  } catch (err) {
    console.warn("Twilio WhatsApp error:", err.message);
  }

  // Always respond success so frontend doesn't show popup
  res.json({ success: true });
});

server.listen(process.env.PORT || 5000, () =>
  console.log(`Server running on port ${process.env.PORT || 5000}`)
);
