# Coffie Station – QR Ordering App

Mobile-first ordering with Razorpay Test Mode.

## Quick Start

### 1) Backend
```bash
cd server
cp .env.example .env   # put your Razorpay TEST secret
npm install
npm run dev
```

### 2) Frontend
```bash
cd client
npm install
echo "VITE_API_BASE=http://localhost:5000" > .env
echo "VITE_RAZORPAY_KEY=rzp_test_1DP5mmOlF5G5ag" >> .env
npm run dev
```

Open http://localhost:5173

## Deploy
- Backend → Render/Railway (set env vars from `.env.example`)
- Frontend → Vercel/Netlify (set `VITE_API_BASE` to your backend URL and `VITE_RAZORPAY_KEY` to your LIVE key)
