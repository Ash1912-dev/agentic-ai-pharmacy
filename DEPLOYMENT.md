# Deployment Guide (Vercel + Render + Twilio WhatsApp)

## 1) Frontend on Vercel

- Import this GitHub repo in Vercel.
- Set Root Directory to: frontend
- Framework preset: Vite
- Build command: npm run build
- Output directory: dist
- Install command: npm install

### Frontend Environment Variables (Vercel)

- VITE_API_BASE_URL = https://YOUR_RENDER_BACKEND_URL

Example:
- VITE_API_BASE_URL = https://agentic-ai-pharmacy-api.onrender.com

## 2) Backend on Render

- Create a new Web Service from this same repo.
- Root Directory: backend
- Runtime: Node
- Build command: npm install
- Start command: npm start

### Backend Environment Variables (Render)

- NODE_ENV = production
- PORT = 10000 (optional, Render sets this automatically)
- MONGO_URI = your mongodb connection string
- SESSION_SECRET = strong random secret
- FRONTEND_URL = https://YOUR_VERCEL_URL
- CORS_ORIGIN = https://YOUR_VERCEL_URL

#### Existing app integrations you also need on Render

- TWILIO_ACCOUNT_SID
- TWILIO_AUTH_TOKEN
- TWILIO_WHATSAPP_FROM
- GOOGLE_GEMINI_API_KEY
- CLOUDINARY_CLOUD_NAME
- CLOUDINARY_API_KEY
- CLOUDINARY_API_SECRET
- Any Google OAuth keys used by your auth flow

## 3) Twilio WhatsApp Webhook (Production)

After backend deploy, set Twilio webhook URL to:

- https://YOUR_RENDER_BACKEND_URL/api/whatsapp/incoming

Method must be POST.

## 4) Verify End-to-End

- Open Vercel app.
- Test login/signup.
- Confirm frontend API calls go to Render.
- Send a WhatsApp test message to Twilio sandbox/number.
- Confirm Render receives webhook and returns 200.

## 5) Important Notes for WhatsApp Hosting

- Twilio handles WhatsApp delivery infrastructure, so you do not host WhatsApp itself.
- You only host your webhook/API on Render.
- Keep webhook public over HTTPS.
- Use Twilio request signature validation in production for security.
- Ensure Render free tier cold starts do not delay webhook processing if you need strict reliability.

## 6) Domain and CORS

If you add a custom domain later:

- Update VITE_API_BASE_URL in Vercel.
- Update FRONTEND_URL and CORS_ORIGIN in Render.
- Update Twilio webhook URL if backend domain changes.
