# Agentic AI Pharmacy

An end-to-end pharmacy automation platform with AI-assisted ordering, WhatsApp workflows, prescription handling, inventory management, and reminder automation.

Built for real-world pharmacy flows with safety constraints, admin verification, and cost-protected hosted demo mode.

## Live Deployments

- Frontend (Vercel): https://agentic-ai-pharmacy.vercel.app
- Backend (Render): https://agentic-ai-pharmacy.onrender.com

## What This Project Solves

Most pharmacy demos stop at catalog search. This project models the full lifecycle:

- Discover medicine
- Create order
- Verify prescription
- Track stock and order status
- Remind intake daily
- Trigger refill flow via WhatsApp

## Core Features

### User Side

- Auth (email/phone + password, Google OAuth)
- Medicine catalog with price and available quantity
- AI chat ordering (can be toggled off for safe hosting)
- Prescription upload + OCR extraction
- Orders page with status and reminder action
- Daily intake reminder setup and management

### Admin Side

- Admin authentication and protected routes
- Add/update medicines
- Inventory and stock updates
- Prescription approval/rejection workflow
- Order monitoring and operations

### Automation

- WhatsApp inbound/outbound workflow via Twilio
- Daily intake cron reminders
- Refill reminder creation from consumption events
- Event-driven updates across order, course, and reminder models

## AI Safety and Cost Controls (Important)

This repository includes anti-abuse controls to avoid AI billing spikes on public deployments:

- Auth-protected AI endpoint
- Per-user + IP rate limiting
- Daily AI request cap
- Allowlist-only AI access (optional)
- Global AI on/off switch
- Frontend "AI Paused" mode with manual fallback ordering

## Tech Stack

- Frontend: React, Vite, Tailwind CSS, React Router
- Backend: Node.js, Express, Passport, Mongoose
- Database: MongoDB
- AI: Sarvam API
- Messaging: Twilio WhatsApp API
- Media/OCR: Cloudinary + OCR pipeline
- Observability: Langfuse

## Project Structure

```text
frontend/   React app (user + admin UI)
backend/    Express API, auth, cron jobs, WhatsApp handlers, services
internal/   Go backend modules (experimental/service layer)
cmd/        Go entrypoint
```

## Local Setup

### Prerequisites

- Node.js 18+
- MongoDB
- Twilio account (for WhatsApp)
- Cloudinary account
- Sarvam API key (if AI enabled)

### 1) Backend

```bash
cd backend
npm install
npm run dev
```

### 2) Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:5173` by default.

## Environment Variables

### Frontend (Vercel)

- `VITE_API_BASE_URL` (Render backend URL)
- `VITE_AI_CHAT_ENABLED=true|false`

### Backend (Render)

Required:

- `NODE_ENV=production`
- `MONGODB_URI`
- `SESSION_SECRET`
- `JWT_SECRET`
- `FRONTEND_URL`
- `CORS_ORIGIN`

Integrations:

- `TWILIO_ACCOUNT_SID`
- `TWILIO_AUTH_TOKEN`
- `TWILIO_WHATSAPP_FROM`
- `SARVAM_API_KEY`
- `SARVAM_API_URL` (optional)
- `SARVAM_CHAT_MODEL`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- Google OAuth keys

AI guard controls:

- `AI_ENABLED=true|false`
- `AI_DAILY_LIMIT=40`
- `AI_ALLOWED_USERS=email1,email2,userIdOrPhone`

## Deployment Notes

- Frontend is configured for SPA routing on Vercel using `frontend/vercel.json` rewrite.
- Backend CORS is configured for Vercel origins and credentialed requests.
- If using Twilio in production, set webhook to:
  - `https://<your-render-domain>/api/whatsapp/incoming`

## Demo Mode (Recommended for Public Academic Showcase)

To avoid AI abuse while keeping core flows visible:

- Set frontend `VITE_AI_CHAT_ENABLED=false`
- Keep reminders, medicine browsing, and order tracking active
- Use fallback manual quick order from chat UI

## Roadmap

- Provider abstraction for multi-LLM backends
- Stronger per-user quota persistence in DB
- Enhanced analytics and admin insights
- Multi-language chat and notifications

## Author

Aashay Vaidya.

---

If this project helped you, consider starring the repo.
