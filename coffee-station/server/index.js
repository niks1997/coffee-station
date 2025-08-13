import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import twilio from 'twilio';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(bodyParser.json());

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

// Twilio client
const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// Real-time connection for admin
io.on('connection', (socket) => {
  console.log('Admin connected:', socket.id);
});

// Endpoint to receive new orders from customer app
app.post('/new-order', async (req, res) => {
  const order = req.body;

  // 1️⃣ Emit real-time event to admin dashboard
  io.emit('order-received', order);

  // 2️⃣ Send receipt via WhatsApp
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
      from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
      to: `whatsapp:${order.phone}`,
      body: message
    });

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

server.listen(5000, () => console.log('Server running on port 5000'));
a