import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import twilio from 'twilio';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(express.json());

// Allow your deployed frontend(s)
const allowed = (process.env.CORS_ORIGIN || '').split(',').filter(Boolean);
app.use(cors({ origin: allowed.length ? allowed : true }));

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: allowed.length ? allowed : true, methods: ['GET','POST'] }
});

// Toggle WhatsApp sending
const SEND_WA = (process.env.SEND_WHATSAPP_RECEIPT || 'false') === 'true';

const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

io.on('connection', (socket) => {
  console.log('Admin connected:', socket.id);
});

app.get('/health', (_, res) => res.json({ ok: true }));

app.post('/new-order', async (req, res) => {
  const order = req.body;

  // 1) Notify admins in real time
  io.emit('order-received', order);

  // 2) (Optional) Send WhatsApp receipt
  if (SEND_WA) {
    try {
      let msg = `*Coffee Station Receipt*\n\n`;
      msg += `*${order.orderType === 'inside' ? 'Table' : 'Vehicle'}:* ${order.details}\n`;
      msg += `*Phone:* ${order.phone}\n*Order ID:* ${order.id}\n\n*Items:*\n`;
      order.cart.forEach(i => { msg += `${i.name} x${i.qty} - ₹${(i.price*i.qty).toFixed(2)}\n`; });
      msg += `\n*Subtotal:* ₹${order.subtotal.toFixed(2)}\n*GST (18%):* ₹${order.gst.toFixed(2)}\n*Total:* ₹${order.total.toFixed(2)}\n*Payment:* ${order.payment.method}`;

      await twilioClient.messages.create({
        from: process.env.TWILIO_WHATSAPP_NUMBER,   // e.g. "whatsapp:+14155238886"
        to: `whatsapp:${order.phone}`,              // e.g. "+91xxxxxxxxxx"
        body: msg
      });
    } catch (e) {
      console.error('WhatsApp send failed:', e.message);
    }
  } else {
    console.log('WhatsApp sending disabled (SEND_WHATSAPP_RECEIPT=false).');
  }

  res.json({ success: true });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log('Server listening on', PORT));
