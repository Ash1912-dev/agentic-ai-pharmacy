# Agentic AI Pharmacy - LLM Context Document

## Project Summary
**Agentic AI Pharmacy** is an intelligent pharmaceutical management platform that integrates AI-powered medication consultation, digital prescription management, inventory tracking, and automated medication reminders.

## Core Purpose
Enable patients to:
1. Get AI-powered medication guidance via chat
2. Digitally manage prescriptions
3. Order medicines online
4. Receive automated medication reminders

Enable pharmacies to:
1. Manage inventory efficiently
2. Process orders systematically
3. Track user compliance
4. Scale operations with AI

## Tech Stack
- **Frontend**: React 18, Vite, Tailwind CSS, Axios, React Router
- **Backend**: Node.js, Express.js, MongoDB
- **AI/LLM**: LangChain/Vercel AI, OpenAI, Langfuse (monitoring)
- **Integrations**: Twilio (WhatsApp), Cloudinary (files), Tesseract (OCR)
- **Auth**: Passport.js, JWT
- **Scheduling**: Node-cron
- **Optional**: Go microservices

## User Types
1. **Regular Users**: Patients managing medications
2. **Admin Users**: Pharmacy staff managing inventory and orders
3. **AI Agent**: Pharmacist chatbot providing guidance

## Key Features

### 1. User Authentication
- Local registration/login
- Passport strategies
- JWT token-based session
- Secure password hashing

### 2. AI Pharmacist Agent
- Natural language chat interface
- Personalized medication recommendations
- Drug interaction checking
- Multi-turn conversations
- Langfuse integration for monitoring LLM calls
- Uses LangChain tools for structured outputs

### 3. Prescription Management
- Digital prescription upload
- OCR parsing with Tesseract.js
- Automatic medicine extraction
- Store extracted data in database
- Prescription history tracking
- Status management (pending, processed, expired)

### 4. Medicine Inventory
- Complete medicine database
- Real-time stock tracking
- Medicine details (dosage, side effects, price, manufacturer)
- Search and filtering
- Admin inventory management

### 5. Order Management
- Add medicines to cart
- Order checkout
- Order status tracking (pending, processing, shipped, delivered)
- Order history
- Fulfillment workflow

### 6. Medication Reminders
- Daily intake reminders via WhatsApp
- Refill reminders for chronic medications
- Configurable schedules
- Timezone support
- Cron-based automation

## Database Models

```
User: {
  email, password, name, phone, address, medical_history,
  created_at, updated_at
}

Medicine: {
  name, dosage, form, description, side_effects, 
  manufacturer, price, stock_quantity, 
  sku, category, created_at
}

Prescription: {
  user_id, original_image_url, extracted_medicines[],
  extracted_text, status, expiry_date, 
  upload_date, processing_date
}

Order: {
  user_id, medicines[{medicine_id, quantity}], 
  total_price, status, order_number,
  created_at, shipped_at, delivered_at
}

DailyIntakeReminder: {
  user_id, medicine_id, dosage, frequency, 
  time_of_day, enabled, created_at
}

RefillReminder: {
  user_id, medicine_id, refill_date, 
  quantity_needed, status, created_at
}

UserMedicineCourse: {
  user_id, medicine_id, dosage, frequency, 
  start_date, end_date, notes
}
```

## API Endpoints Overview

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout
- `GET /auth/profile` - Get user profile

### AI Agent
- `POST /agent/chat` - Send message to pharmacist
- `GET /agent/history` - Get chat history

### Medicines
- `GET /medicines` - Get all medicines
- `GET /medicines/:id` - Get medicine details
- `POST /medicines` - Add medicine (admin)
- `PUT /medicines/:id` - Update medicine (admin)
- `DELETE /medicines/:id` - Delete medicine (admin)

### Prescriptions
- `POST /prescriptions/upload` - Upload prescription
- `GET /prescriptions` - Get user prescriptions
- `GET /prescriptions/:id` - Get prescription details
- `DELETE /prescriptions/:id` - Delete prescription

### Orders
- `POST /orders` - Create order
- `GET /orders` - Get user orders
- `GET /orders/:id` - Get order details
- `PUT /orders/:id/status` - Update order status (admin)

### Reminders
- `POST /reminders` - Create reminder
- `GET /reminders` - Get user reminders
- `PUT /reminders/:id` - Update reminder
- `DELETE /reminders/:id` - Delete reminder

### WhatsApp/Notifications
- `POST /whatsapp/send` - Send WhatsApp message
- `POST /whatsapp/webhook` - Receive WhatsApp messages

## File Structure Context

```
backend/
├── src/
│   ├── agents/
│   │   └── pharmacist.agent.js         # Main AI agent logic
│   ├── controllers/
│   │   ├── agent.controller.js         # Chat logic
│   │   ├── medicine.controller.js      # Medicine operations
│   │   ├── order.controller.js         # Order management
│   │   ├── prescription.controller.js  # Prescription handling
│   │   └── ... (more controllers)
│   ├── services/
│   │   ├── ai.service.js               # LLM integration
│   │   ├── order.service.js            # Business logic
│   │   ├── prescription.service.js     # OCR processing
│   │   └── tool.service.js             # Agent tools
│   ├── models/
│   │   ├── User.model.js
│   │   ├── Medicine.model.js
│   │   ├── Prescription.model.js
│   │   ├── Order.model.js
│   │   └── ... (other models)
│   ├── cron/
│   │   ├── dailyIntake.cron.js         # Daily reminders
│   │   └── refillReminder.cron.js      # Refill reminders
│   ├── config/
│   │   ├── db.js                       # MongoDB connection
│   │   ├── cloudinary.js               # File storage
│   │   ├── twilio.js                   # WhatsApp/SMS
│   │   ├── langfuse.js                 # LLM monitoring
│   │   └── passport.js                 # Authentication
│   └── routes/
│       ├── agent.routes.js
│       ├── medicine.routes.js
│       ├── order.routes.js
│       ├── prescription.routes.js
│       └── ... (more routes)

frontend/
├── src/
│   ├── components/
│   │   ├── chat/                       # AI chat components
│   │   ├── common/                     # Reusable UI components
│   │   └── layout/                     # Layout wrappers
│   ├── pages/
│   │   ├── Chat.jsx                    # Chat interface
│   │   ├── UploadPrescription.jsx      # Prescription upload
│   │   ├── Medicines.jsx               # Medicine catalog
│   │   ├── Orders.jsx                  # Order management
│   │   ├── Reminders.jsx               # Reminder dashboard
│   │   └── ... (more pages)
│   ├── api/
│   │   ├── agent.api.js                # Chat API calls
│   │   ├── auth.api.js                 # Auth API calls
│   │   └── axiosInstance.js            # Axios config
│   ├── context/
│   │   └── AuthContext.jsx             # Global auth state
│   └── hooks/                          # Custom React hooks
```

## Key Integration Points

### 1. LangChain / AI Agent
**Location**: `backend/src/agents/pharmacist.agent.js`  
**Purpose**: Main AI logic for medication consultation  
**Tools**: Medicine search, drug interaction checker, user history lookup  
**Monitoring**: Langfuse tracks all LLM calls

### 2. OCR Processing
**Location**: `backend/src/utils/ocr.js`  
**Tool**: Tesseract.js  
**Purpose**: Extract medicine names/dosages from uploaded prescription images  
**Output**: Structured medicine list saved to database

### 3. Cron Jobs
**Location**: `backend/src/cron/`  
**Purpose**: Automated reminders (runs on schedule)  
**Action**: Sends WhatsApp notifications via Twilio

### 4. WhatsApp Integration
**Location**: `backend/src/config/twilio.js`  
**Provider**: Twilio API  
**Use Cases**: Order confirmations, reminders, notifications

### 5. File Upload
**Location**: `backend/src/middlewares/upload.middleware.js`  
**Provider**: Cloudinary  
**Purpose**: Store prescription images and user documents

## Frontend User Flows

### 1. User Registration Flow
Signup → Email verification → Profile setup → Dashboard

### 2. Chat with AI
Chat page → Send message → AI processes → Response displayed → Add to history

### 3. Prescription Upload Flow
Upload page → Select image → OCR processing → Extract medicines → Save to DB → Show extracted medicines

### 4. Medicine Ordering Flow
Browse medicines → Add to cart → Checkout → Create order → Track status → Receive delivery notification

### 5. Medication Reminder Setup
User profile/reminders → Add reminder → Set frequency & time → System sends WhatsApp reminders

## Environment Variables Needed

```
# MongoDB
MONGODB_URI=

# Authentication
JWT_SECRET=
PASSPORT_SECRET=

# AI Services
OPENAI_API_KEY=
LANGFUSE_PUBLIC_KEY=
LANGFUSE_SECRET_KEY=

# File Storage
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Twilio (WhatsApp)
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=

# Frontend API
VITE_API_URL=http://localhost:5000
```

## Current Status
✅ **MVP Complete**: All core features implemented and functional  
🚀 **Ready to Deploy**: Infrastructure setup ready  
📊 **Ready to Monitor**: Langfuse integration active for LLM tracking  

## Deployment Architecture
- Frontend: Vercel/Netlify
- Backend: AWS EC2/Heroku + MongoDB Atlas
- Files: Cloudinary CDN
- Monitoring: Langfuse

## Key Considerations for AI/LLM Work

### Agent Design
- Uses tools for structured actions (medicine lookup, history retrieval)
- Maintains conversation context across turns
- Validates AI responses before sending to user
- Logs all interactions to Langfuse for analysis

### Context Management
- User medical history available to agent
- Medicine database searchable
- Drug interaction database accessible
- Previous conversations retrievable

### Safety & Compliance
- AI responses should always recommend consulting pharmacist for critical decisions
- Strict handling of medical data
- Validation of extracted OCR data before processing
- Clear disclaimers on AI capabilities vs. professional advice

## Next Steps for Development
1. Payment integration (Stripe/PayPal)
2. Advanced medicine search (semantic)
3. AI-powered drug interaction detection
4. Video consultation features
5. Mobile app development
6. Advanced analytics dashboard

---

**Document Version**: 1.0  
**Last Updated**: February 9, 2026  
**Status**: MVP Complete & Ready for Context Sharing
