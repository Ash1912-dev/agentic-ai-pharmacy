# Agentic AI Pharmacy - MVP Overview

## 📋 Executive Summary

**Agentic AI Pharmacy** is an intelligent pharmaceutical management system that combines AI-powered consultation, prescription management, inventory tracking, and automated reminders. The system leverages LLMs to provide personalized medication guidance while maintaining comprehensive inventory and order management.

---

## 🎯 Problem Statement

- Patients struggle to manage multiple medications and compliance
- Pharmacies face manual inventory and order management challenges
- Lack of personalized medication guidance and adherence tracking
- Limited accessibility for prescription management

---

## ✨ Core Features (MVP)

### 1. **AI Pharmacist Agent**
- Natural language chat interface for medication queries
- Personalized medication recommendations
- Drug interaction checking
- Langfuse monitoring for LLM performance tracking
- Multi-turn conversation support

### 2. **Prescription Management**
- Digital prescription upload with OCR parsing
- Automatic medicine extraction from prescriptions
- Prescription history tracking
- Prescription validation and processing

### 3. **Medicine Inventory**
- Complete medicine catalog with details
- Real-time stock tracking
- Automated low-stock alerts
- Medicine search and filtering

### 4. **Order Management**
- Online medicine ordering
- Order tracking and status updates
- Automated order fulfillment workflow
- Order history

### 5. **Medication Reminders**
- Daily intake reminders (SMS/WhatsApp)
- Refill reminders for chronic medications
- Customizable reminder schedules
- Cron-based automated reminders

### 6. **User Management**
- Secure authentication (Local + Passport strategies)
- User profile management
- Medicine course tracking
- Medical history

### 7. **Admin Panel**
- Inventory management
- User management
- Order monitoring
- System administration

### 8. **WhatsApp Integration**
- Push notifications via WhatsApp
- Order confirmations
- Reminder notifications
- Two-way messaging support

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (React/Vite)                 │
│  - Chat Interface | Prescription Upload | Orders         │
│  - Reminders Dashboard | User Profile | Admin Panel      │
└────────────────────────┬────────────────────────────────┘
                         │ REST API
┌─────────────────────────────────────────────────────────┐
│                 Backend (Node.js/Express)                │
│  ├── Routes (Agent, Auth, Orders, Medicines, etc)       │
│  ├── Controllers (Business Logic)                        │
│  ├── Services (AI, Orders, Prescriptions, Refills)      │
│  ├── Models (MongoDB Schemas)                            │
│  ├── Agents (Pharmacist AI Agent)                        │
│  ├── Cron Jobs (Reminders, Daily Intake)                │
│  └── Integrations (Twilio, Cloudinary, Langfuse, OCR)   │
└────────────────────────┬────────────────────────────────┘
                         │
      ┌──────────────────┼──────────────────┐
      │                  │                  │
   MongoDB          Cloudinary            Twilio
 (Database)        (File Storage)    (WhatsApp/SMS)
      
      ├── Langfuse (LLM Monitoring)
      └── OpenAI (LLM Provider)
```

---

## 💾 Data Models

```
User
├── email, password, name, phone
├── medicine courses (array)
├── prescriptions (array)
└── reminders (array)

Medicine
├── name, dosage, form
├── description, side effects
├── price, manufacturer
└── stock quantity

Prescription
├── user reference
├── medicines (array)
├── upload date, expiry
├── OCR extracted data
└── status (pending, processed, expired)

Order
├── user reference
├── medicines (array)
├── quantity, total price
├── status (pending, processing, delivered)
└── timestamps (created, shipped, delivered)

Reminder
├── user reference
├── type (daily intake / refill)
├── medicine reference
├── schedule, timezone
└── delivery status

UserMedicineCourse
├── user reference
├── medicine reference
├── dosage, frequency
├── start/end dates
└── notes
```

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: Context API
- **HTTP Client**: Axios
- **Routing**: React Router

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **Authentication**: Passport.js
- **Scheduling**: Node-cron
- **File Upload**: Multer + Cloudinary
- **OCR**: Tesseract.js
- **LLM Integration**: LangChain / Vercel AI SDK
- **LLM Monitoring**: Langfuse
- **WhatsApp**: Twilio

### Infrastructure & Tools
- **Go Backend** (Optional): For high-performance services
- **Container**: Docker-ready
- **Version Control**: Git

---

## 🚀 Getting Started

### Prerequisites
- Node.js 16+
- MongoDB
- Cloudinary Account
- Twilio Account
- OpenAI API Key
- Langfuse Account

### Environment Variables

**Backend (.env)**
```
# Database
MONGODB_URI=mongodb://localhost:27017/pharmacy

# Authentication
JWT_SECRET=your_secret_key
PASSPORT_SECRET=passport_secret

# AI & Monitoring
OPENAI_API_KEY=your_api_key
LANGFUSE_PUBLIC_KEY=public_key
LANGFUSE_SECRET_KEY=secret_key

# File Storage
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_secret

# SMS/WhatsApp
TWILIO_ACCOUNT_SID=your_sid
TWILIO_AUTH_TOKEN=your_token
TWILIO_PHONE_NUMBER=your_number
```

### Installation & Running

```bash
# Backend Setup
cd backend
npm install
node src/server.js

# Frontend Setup
cd frontend
npm install
npm run dev
```

**Frontend URL**: http://localhost:5173  
**Backend API**: http://localhost:5000 (or configured port)

---

## 📊 Key Workflows

### 1. **User Registration & Login**
```
User → SignUp Page → Validation → Database → Auto-Login → Dashboard
```

### 2. **Prescription Upload & Processing**
```
User → Upload Image → OCR Parsing → Extract Medicines → Save to DB → Add to Orders
```

### 3. **Chat with AI Pharmacist**
```
User Query → Backend → LangChain Agent → LLM Call → Response → Langfuse Monitor → Display to User
```

### 4. **Order Management**
```
User Selects Medicines → Add to Order → Checkout → Payment → Order Created → Track Status
```

### 5. **Medication Reminders**
```
Cron Job Triggers → Check Schedules → Generate Reminders → Twilio SMS/WhatsApp → User Receives
```

---

## 📁 Project Structure

```
backend/
├── src/
│   ├── app.js              # Express app setup
│   ├── server.js           # Server entry point
│   ├── routes/             # API routes
│   ├── controllers/        # Business logic
│   ├── services/           # Reusable services
│   ├── models/             # MongoDB schemas
│   ├── agents/             # AI agents
│   ├── config/             # Configuration files
│   ├── cron/               # Scheduled tasks
│   ├── middlewares/        # Custom middlewares
│   └── utils/              # Utilities

frontend/
├── src/
│   ├── components/         # Reusable components
│   ├── pages/              # Page components
│   ├── api/                # API calls
│   ├── context/            # React context
│   ├── hooks/              # Custom hooks
│   ├── utils/              # Utilities
│   └── routes/             # Route definitions

cmd/
├── main.go                 # Go service (optional)
```

---

## 🔐 Security Features

- ✅ JWT-based authentication
- ✅ Password hashing with bcrypt
- ✅ Input validation & sanitization
- ✅ CORS protection
- ✅ Rate limiting ready
- ✅ Secure file uploads

---

## 📈 MVP Roadmap

### Phase 1 (Current MVP)
- ✅ User authentication
- ✅ AI pharmacist chat
- ✅ Prescription upload & OCR
- ✅ Medicine inventory
- ✅ Order management
- ✅ Reminders system
- ✅ WhatsApp integration

### Phase 2 (Enhancement)
- Payment gateway integration (Stripe/PayPal)
- Video consultation with pharmacists
- Insurance claim management
- Medicine recommendations based on medical history
- Advanced analytics dashboard

### Phase 3 (Scale)
- Mobile app (React Native)
- Multi-language support
- AI-powered drug interaction detection
- Telemedicine integration
- Pharmacy partner ecosystem

---

## 🎨 User Interfaces Overview

### Public Pages
- **Landing Page**: Project overview and CTA
- **Login/Signup**: User authentication
- **Medicine Catalog**: Browse available medicines

### User Dashboard
- **Chat Interface**: Talk to AI Pharmacist
- **Upload Prescription**: Digital prescription management
- **My Orders**: Track and manage orders
- **My Reminders**: View and manage medication reminders
- **Profile**: User settings and medical info

### Admin Panel
- **Inventory Management**: Add/edit/delete medicines
- **User Management**: View and manage users
- **Order Monitoring**: Track all orders
- **System Settings**: Configuration management

---

## 🧪 Testing & Deployment

### Testing
- Unit tests for services
- Integration tests for APIs
- E2E tests for critical workflows

### Deployment
- Frontend: Vercel / Netlify / AWS S3 + CloudFront
- Backend: Heroku / AWS EC2 / DigitalOcean
- Database: MongoDB Atlas
- Monitoring: Langfuse + Sentry

---

## 📞 Support & Contact

For questions or collaboration, please refer to the project README.md

---

## 📝 License

[Specify your license]

---

**Last Updated**: February 9, 2026  
**Version**: 1.0 (MVP)
