# 🧠 Agentic AI Pharmacy

**Intelligent Pharmacy Automation System (MERN + AI + WhatsApp)**

Agentic AI Pharmacy is an **end-to-end intelligent pharmacy management platform** that automates medicine ordering, prescription verification, inventory handling, daily intake reminders, and refill alerts using **AI, WhatsApp automation, and event-driven backend logic**.

The system is designed to reflect **real-world pharmacy workflows**, ensuring medical safety, regulatory compliance, and an excellent user experience.

---

## 🚀 Quick Start

### Prerequisites
- Node.js v14+
- MongoDB (local or cloud)
- Twilio Account (WhatsApp API)
- Cloudinary Account (Image storage)
- Google Gemini API key

### Installation

**Backend Setup:**
```bash
cd backend
npm install
cp .env.example .env
# Fill in your environment variables
npm run dev
```

**Frontend Setup:**
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

**Access:**
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`

---

## 📚 Table of Contents

1. [System Overview](#-system-overview)
2. [Key Highlights](#-key-highlights)
3. [Core Problem Solved](#-core-problem-solved)
4. [Architecture](#-architecture)
5. [Features](#-features)
   - [User Features](#user-features)
   - [Admin Features](#admin-features)
6. [AI Layer](#-ai-layer)
7. [WhatsApp Automation](#-whatsapp-automation)
8. [Database Models](#-database-models)
9. [Edge Cases](#-edge-cases-handled)
10. [Tech Stack](#-tech-stack)
11. [Environment Setup](#-environment-setup)
12. [Running Locally](#️-run-locally)
13. [Project Structure](#-project-structure)
14. [Why This Stands Out](#-why-this-project-stands-out)
15. [Future Enhancements](#-future-enhancements)

---

## 🎯 System Overview

### What is Agentic AI Pharmacy?

A **full-stack pharmacy management system** that:
- Accepts medicine orders via AI chat
- Verifies prescriptions with admin approval
- Tracks daily medicine consumption
- Predicts refills based on actual usage
- Automates everything via WhatsApp

### Why It's Different

Most online pharmacies:
- ❌ Guess refill dates (inaccurate)
- ❌ Mix inventory with patient consumption
- ❌ Lack prescription safety enforcement
- ❌ Have poor automation

**This system:**
- ✅ Tracks actual consumption
- ✅ Separates inventory from patient courses
- ✅ Enforces prescription verification
- ✅ Automates via WhatsApp + AI

---

## 🚀 Key Highlights

- 🤖 **AI Chat-Based Medicine Ordering** - Natural language order parsing with Gemini AI
- 📄 **Prescription Upload & Verification** - OCR-based prescription extraction and admin approval
- 📲 **WhatsApp Automation** - Orders, reminders, refills all via WhatsApp
- 📦 **Inventory Management** - Real-time stock tracking and low-stock alerts
- 🔔 **Consumption-Based Refill** - Refills triggered by actual medicine usage, not assumptions
- 🧠 **Event-Driven Architecture** - Scalable, maintainable backend design
- 👨‍⚕️ **Admin Dashboard** - Full control over inventory, orders, and prescriptions
- 🔐 **Medical Safety** - Rx enforcement, prescription verification, user safety

---

## 🧩 Core Problem Solved

### The Problem
Online pharmacies typically:
1. **Don't track consumption** - They guess when users run out
2. **Mix two concepts** - Store inventory ≠ User medicine courses
3. **Lack safety measures** - No prescription enforcement
4. **Poor automation** - Email/SMS only, no smart channels

### The Solution
**Separation of concerns:**
- **Store Inventory** - What's in stock
- **User Medicine Courses** - What each user is taking
- **Consumption Log** - When doses are actually taken
- **Refill Trigger** - Based on remaining quantity, not time

**Result:**
- 📊 Accurate refill predictions
- 🔒 Medical safety compliance
- ⚡ Smart WhatsApp automation
- 🎯 Better user experience

---

## 🏗️ Architecture

```
┌─────────────────────────────────────┐
│      Frontend (React + Tailwind)     │
│  - User Dashboard                   │
│  - AI Chat Interface                │
│  - Order History                    │
│  - Daily Reminders Display          │
└──────────────┬──────────────────────┘
               │
               ↓
┌─────────────────────────────────────┐
│    Backend (Node.js + Express)      │
│  - REST API                         │
│  - WhatsApp Handler                 │
│  - Cron Jobs                        │
│  - AI Integration                   │
└──────────────┬──────────────────────┘
               │
               ↓
┌─────────────────────────────────────┐
│   MongoDB (Event-Driven Models)     │
│  - User, Medicine, Order            │
│  - Prescription, Inventory          │
│  - DailyIntakeReminder              │
│  - RefillReminder                   │
└─────────────────────────────────────┘
               │
    ┌──────────┼──────────┐
    ↓          ↓          ↓
  Twilio   Cloudinary  Gemini AI
  WhatsApp  (Images)   (Chat/OCR)
```

### Architecture Philosophy

1. **Inventory ≠ User Consumption**
   - Store has fixed inventory
   - Users have medicine courses with tracking

2. **Order Intent ≠ Order Fulfillment**
   - User creates order
   - Admin verifies prescription
   - Stock is reduced only after verification

3. **Events Drive Automation**
   - User takes dose → Consumption logged
   - Remaining = 1 → Refill reminder created
   - User responds → Order created
   - Not time-based, event-based

---

## 👥 Features

### User Features

#### 1️⃣ Authentication
- Email/Password login
- Google OAuth support
- Session-based authentication
- Protected routes
- JWT tokens

#### 2️⃣ AI Chat-Based Ordering
Users can order naturally:
```
User: "I need 5 tablets of paracetamol 500mg"

AI extracts:
- Medicine: Paracetamol
- Strength: 500mg
- Quantity: 5

Backend checks:
- Medicine exists? ✓
- Stock available? ✓
- Requires prescription? ✓
```

#### 3️⃣ Prescription Upload
- Upload image or PDF
- Automatic OCR extraction
- Cloudinary storage
- AI parsing for medicines
- Admin verification workflow

#### 4️⃣ Orders Management
- View order history
- Track order status:
  - `CREATED` → `WAITING_PRESCRIPTION` → `CONFIRMED` → `FULFILLED`
- Real-time status updates
- WhatsApp confirmations

#### 5️⃣ Daily Intake Reminders
- Set custom intake schedule
- WhatsApp reminders at scheduled time
- Reply interface:
  - `1` = TAKEN
  - `2` = SKIPPED
- Automatic consumption logging
- View intake history

#### 6️⃣ Refill Prediction (Core Innovation)
Refills are triggered when:
```
IF remainingQuantity <= 0:
  → Create RefillReminder
  → Send WhatsApp notification
  → User can reorder immediately
```

### Admin Features

#### 🔐 Admin Authentication
- Secure JWT-based login
- Role-based access control
- Admin-only dashboard

#### 💊 Medicine Management
- Add new medicines
- Edit medicine details:
  - Category
  - Brand
  - Price
  - Dosage strength
  - Rx requirement
- Enable/disable medicines
- Search and filter

#### 📦 Inventory Management
- Add stock (create inventory records)
- Manual stock correction
- Low-stock alerts
- Full inventory overview
- Real-time stock tracking
- Stock used tracking

#### 📄 Prescription Verification
- View uploaded prescriptions with images
- Verify or reject prescriptions
- Automatic actions on verification:
  - Confirm linked orders
  - Reduce inventory
  - Send WhatsApp confirmation to user
- Verification history

#### 📊 Orders Dashboard
- View all orders with details
- Filter by:
  - User
  - Medicine
  - Status
  - Date range
- Update order status
- Full audit trail

---

## 🤖 AI Layer

### Gemini AI Integration

**Medicine Ordering:**
- Parse natural language orders
- Extract: medicine name, quantity, strength
- Suggest alternatives if out of stock
- Validate against database

**Prescription Analysis:**
- OCR text from uploaded prescriptions
- Extract:
  - Patient name
  - Prescribed medicines
  - Dosage and frequency
  - Duration
- Flag missing or unclear information

**Symptom-Based Suggestions:**
- User describes symptoms
- AI suggests relevant medicines
- Includes disclaimer: "Consult doctor"
- Only suggests OTC medicines

### Safety-First Prompting

**What AI Does NOT Do:**
- ❌ Provide medical diagnosis
- ❌ Replace doctor's advice
- ❌ Recommend Rx medicines without prescription
- ❌ Adjust dosages

**What AI Does:**
- ✅ Parse natural language
- ✅ Extract prescription info
- ✅ Suggest common OTC medicines
- ✅ Flag potentially critical cases

---

## 📲 WhatsApp Automation

### Outbound Messages (Bot → User)

1. **Order Confirmation**
   ```
   ✅ Your order for 5 Paracetamol has been received.
   Awaiting prescription verification.
   Status: WAITING_PRESCRIPTION
   ```

2. **Daily Intake Reminder**
   ```
   💊 Medicine Reminder
   
   Take Paracetamol 500mg
   
   Reply:
   1️⃣ TAKEN
   2️⃣ SKIPPED
   ```

3. **Refill Alert**
   ```
   🟡 Refill Reminder
   
   You will run out of Paracetamol tomorrow.
   
   Reply:
   1️⃣ Reorder now
   2️⃣ Ignore
   ```

4. **Reorder Confirmation**
   ```
   ✅ Order placed successfully for 10 Paracetamol.
   Status: CONFIRMED
   ```

### Inbound Handling (User → Bot)

| Message | Action |
|---------|--------|
| `1` (Intake reminder) | Log dose as TAKEN, decrement quantity |
| `2` (Intake reminder) | Log dose as SKIPPED, don't decrement |
| `1` (Refill reminder) | Ask "How many units?" |
| `2` (Refill reminder) | Deactivate refill reminder |
| `[number]` (Refill quantity) | Create order, send confirmation |

### Key Constraint

⚠️ **Only ONE active WhatsApp flow per user at a time**

If intake reminder is active:
- Don't process refill messages
- User must respond to intake first

If refill reminder is active:
- Don't process intake messages
- User must respond to refill first

---

## 🗄️ Database Models

### Core Models

**User**
```
{
  name: String,
  email: String,
  phone: String,
  password: String (hashed),
  medicines: [Reference to UserMedicineCourse],
  orders: [Reference to Order],
  createdAt: Date,
  updatedAt: Date
}
```

**Medicine**
```
{
  name: String,
  strength: String,
  category: String,
  brand: String,
  price: Number,
  requiresPrescription: Boolean,
  enabled: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

**Inventory**
```
{
  medicine: Reference to Medicine,
  quantityInStock: Number,
  lastRestockDate: Date,
  lowStockThreshold: Number,
  createdAt: Date,
  updatedAt: Date
}
```

**Order**
```
{
  user: Reference to User,
  medicine: Reference to Medicine,
  quantity: Number,
  status: String (CREATED, WAITING_PRESCRIPTION, CONFIRMED, FULFILLED),
  prescription: Reference to Prescription,
  createdAt: Date,
  updatedAt: Date
}
```

**Prescription**
```
{
  user: Reference to User,
  imageUrl: String,
  extractedText: String,
  verifiedBy: Reference to Admin,
  status: String (PENDING, VERIFIED, REJECTED),
  linkedOrders: [Reference to Order],
  createdAt: Date,
  updatedAt: Date
}
```

**UserMedicineCourse**
```
{
  user: Reference to User,
  medicine: Reference to Medicine,
  remainingQuantity: Number,
  startDate: Date,
  endDate: Date,
  createdAt: Date,
  updatedAt: Date
}
```

**DailyIntakeReminder**
```
{
  user: Reference to User,
  medicine: Reference to Medicine,
  enabled: Boolean,
  startDate: Date,
  endDate: Date,
  times: [String], // ["09:00", "14:00"]
  awaitingResponse: Boolean,
  lastNotifiedAt: Date,
  logs: [{date, time, status}],
  createdAt: Date,
  updatedAt: Date
}
```

**RefillReminder**
```
{
  user: Reference to User,
  medicine: Reference to Medicine,
  expectedRefillDate: Date,
  reminderSent: Boolean,
  awaitingUserAction: Boolean,
  awaitingQuantity: Boolean,
  lastNotifiedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🧪 Edge Cases Handled

| Edge Case | Solution |
|-----------|----------|
| **Ordering 1 tablet** | Works normally, refill at 0 |
| **Immediate refill after first intake** | Prevents duplicate refills |
| **Multiple medicines per user** | Separate tracking per medicine |
| **Multiple concurrent users** | Event-driven, no race conditions |
| **Rx vs OTC differentiation** | Admin flag + admin verification |
| **WhatsApp state conflicts** | Only 1 active flow per user |
| **Phone number normalization** | Helper function handles formats |
| **Refill for bulk orders** | Only event-driven, not automatic |
| **Skipped doses** | Don't decrement, don't trigger refill |
| **User doesn't respond** | Reminder waits, can be manual override |

---

## 🧑‍💻 Tech Stack

### Frontend
- **React** - UI library
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **React Router** - Navigation
- **Vite** - Build tool

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Bcrypt** - Password hashing

### AI & Automation
- **Google Gemini AI** - Chat & OCR
- **Twilio** - WhatsApp API
- **Cloudinary** - Image storage
- **Tesseract OCR** - Text extraction
- **Node Cron** - Job scheduling

### DevOps & Tools
- **dotenv** - Environment management
- **Nodemon** - Auto-reload
- **Postman** - API testing
- **MongoDB Compass** - Database GUI

---

## 🔐 Environment Setup

### Backend (.env)

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017/pharmacy
# Or MongoDB Atlas:
# MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/pharmacy

# Authentication
JWT_SECRET=your_jwt_secret_key
ADMIN_JWT_SECRET=your_admin_jwt_secret_key
JWT_EXPIRE=7d

# Twilio (WhatsApp)
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_WHATSAPP_FROM=whatsapp:+1234567890

# Cloudinary (Image Storage)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Gemini AI
GEMINI_API_KEY=your_gemini_api_key

# Email (Optional, for notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# Frontend
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env.local)

```env
VITE_API_BASE_URL=http://localhost:5000
VITE_GEMINI_API_KEY=your_gemini_api_key
```

---

## ▶️ Run Locally

### 1. Clone Repository
```bash
git clone <repository-url>
cd agentic-ai-pharmacy
```

### 2. Backend Setup
```bash
cd backend
npm install

# Create .env file
cp .env.example .env
# Fill in all required variables

# Start server
npm run dev
# Server runs on http://localhost:5000
```

### 3. Frontend Setup
```bash
cd frontend
npm install

# Create .env.local file
cp .env.example .env.local
# Fill in required variables

# Start app
npm run dev
# App runs on http://localhost:5173
```

### 4. Database Setup
```bash
# If using local MongoDB:
mongod

# Or use MongoDB Atlas connection string in .env
```

### 5. Access Application
- **User App:** `http://localhost:5173/user`
- **Admin App:** `http://localhost:5173/admin`
- **API Docs:** `http://localhost:5000/api-docs`

---

## 📁 Project Structure

```
agentic-ai-pharmacy/
├── backend/
│   ├── src/
│   │   ├── models/
│   │   │   ├── User.model.js
│   │   │   ├── Medicine.model.js
│   │   │   ├── Order.model.js
│   │   │   ├── Prescription.model.js
│   │   │   ├── UserMedicineCourse.model.js
│   │   │   ├── DailyIntakeReminder.model.js
│   │   │   ├── RefillReminder.model.js
│   │   │   └── Inventory.model.js
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   ├── user.routes.js
│   │   │   ├── admin.routes.js
│   │   │   ├── medicine.routes.js
│   │   │   ├── order.routes.js
│   │   │   ├── whatsapp.routes.js
│   │   │   └── ai.routes.js
│   │   ├── controllers/
│   │   │   ├── auth.controller.js
│   │   │   ├── user.controller.js
│   │   │   ├── admin.controller.js
│   │   │   ├── order.controller.js
│   │   │   ├── whatsapp.controller.js
│   │   │   └── ai.controller.js
│   │   ├── services/
│   │   │   ├── order.service.js
│   │   │   ├── prescription.service.js
│   │   │   ├── ai.service.js
│   │   │   └── whatsapp.service.js
│   │   ├── crons/
│   │   │   ├── dailyIntakeReminder.cron.js
│   │   │   └── refillReminder.cron.js
│   │   ├── middleware/
│   │   │   ├── auth.middleware.js
│   │   │   └── errorHandler.middleware.js
│   │   ├── config/
│   │   │   ├── database.js
│   │   │   ├── twilio.js
│   │   │   ├── cloudinary.js
│   │   │   └── gemini.js
│   │   └── app.js
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── ...
│   │   ├── pages/
│   │   │   ├── user/
│   │   │   │   ├── Dashboard.jsx
│   │   │   │   ├── AIChat.jsx
│   │   │   │   ├── Orders.jsx
│   │   │   │   └── Reminders.jsx
│   │   │   └── admin/
│   │   │       ├── Dashboard.jsx
│   │   │       ├── Medicines.jsx
│   │   │       ├── Inventory.jsx
│   │   │       ├── Prescriptions.jsx
│   │   │       └── Orders.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env.example
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

## 🏆 Why This Project Stands Out

### 1. **Real Healthcare Logic**
- Not just a CRUD app
- Implements actual pharmacy workflows
- Medical safety compliance
- Prescription verification built-in

### 2. **Event-Driven Architecture**
- No guessing or timer-based logic
- Automation triggered by actual events
- Scalable and maintainable
- Real consumption tracking

### 3. **AI + WhatsApp Integration**
- Natural language ordering
- WhatsApp as primary channel
- Automated prescription OCR
- Smart refill predictions

### 4. **Production-Grade Design**
- Error handling everywhere
- Validation at every step
- Role-based access control
- Audit trails for all actions

### 5. **Hackathon-Ready**
- Clean code structure
- Well-documented
- Easy to extend
- Impressive demo potential

### 6. **Clear Separation of Concerns**
- Frontend independent of backend
- Services layer for business logic
- Cron jobs for automation
- Middleware for cross-cutting concerns

---

## 🚀 Future Enhancements

- 📈 **Order Timeline Visualization** - Visual history of order journey
- 📊 **Admin Audit Logs** - Track all admin actions
- ⚠️ **Drug Interaction Warnings** - AI checks for contraindications
- 🤖 **AI Prescription Risk Scoring** - Flags risky prescriptions
- 📈 **Analytics Dashboard** - Sales, consumption, trends
- 🚚 **Delivery Partner Integration** - Track deliveries in real-time
- 💬 **Two-way WhatsApp Chat** - Customer support via WhatsApp
- 📱 **Mobile App** - Native iOS/Android apps
- 🔔 **Push Notifications** - In-app notifications for updates
- 💳 **Payment Gateway** - Accept online payments

---

## 🤝 Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

## 📜 License

This project is licensed under the MIT License. See LICENSE file for details.

---

## 👨‍💻 Author

**Aashay Vaidya**

Built as a hackathon-grade, real-world scalable system.

---

## 📝 Disclaimer

⚠️ **This project is for educational and demonstration purposes.**

- Medical advice should always be provided by licensed professionals
- Prescription verification should follow local regulatory guidelines
- This is not a substitute for professional pharmacy services
- Use only in compliance with local healthcare laws and regulations

---

## 📞 Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Contact: support@agentic-pharmacy.com

---

**Last Updated:** February 2024  
**Status:** Production Ready