# 🚀 StrideAI

> Your AI Accountability Partner

StrideAI is an AI-powered accountability platform that helps users stay consistent with their goals through intelligent conversations, personalized reminders, and multi-channel communication.

Instead of being just another habit tracker, StrideAI actively follows up with users, understands their responses, tracks progress, and keeps them accountable using AI.

---

# ✨ Features

- 🤖 AI Accountability Coach
- 🎯 Goal Management
- 📅 Automated Daily Check-ins
- ⏰ Smart Reminders
- 💬 AI Conversations
- 📲 Telegram Integration
- 🔐 JWT Authentication
- 🧠 Conversation Memory
- ⚡ Celery Background Tasks
- 🐳 Dockerized Deployment
- ☁️ Azure Ready

---

# 🏗 Architecture

```
                +----------------------+
                |      React UI        |
                +----------+-----------+
                           |
                           |
                    Django REST API
                           |
      +--------------------+--------------------+
      |                    |                    |
      |                    |                    |
 Authentication      Goal Engine        Conversation Engine
      |                    |                    |
      |                    |                    |
      +-----------+--------+--------------------+
                  |
             Accountability Engine
                  |
          +-------+--------+
          |                |
     Reminder Engine   AI Reasoning
          |                |
          +-------+--------+
                  |
         Notification Dispatcher
                  |
        +---------+----------+
        |                    |
    Telegram            Future Channels
                     (WhatsApp, Voice)
```

---

# 🛠 Tech Stack

## Backend

- Python
- Django
- Django REST Framework
- PostgreSQL
- Redis
- Celery
- Celery Beat
- OpenAI
- Docker

## Frontend

- React
- Vite
- TailwindCSS
- Axios

## AI

- OpenAI
- Custom Prompt Builder
- Context Builder
- Behavior Engine
- Intent Detection

## Infrastructure

- Azure Container Apps
- Azure Database for PostgreSQL
- Azure Container Registry
- Azure Storage
- Azure Application Insights

---

# 📂 Project Structure

```
strideAI/
│
├── client/                 # React Frontend
│
├── server/
│   ├── account/
│   ├── ai/
│   ├── automation/
│   ├── channels/
│   ├── checkins/
│   ├── conversations/
│   ├── goals/
│   ├── memory/
│   ├── notifications/
│   ├── config/
│   └── manage.py
│
├── docker-compose.yml
├── Dockerfile
└── README.md
```

---

# 🧠 How StrideAI Works

## 1. User Creates Goals

Example:

```
Drink Water
Daily
Reminder: 8:00 PM
```

↓

Stored in

- Goal
- GoalSchedule

---

## 2. Daily Check-in Generation

Every midnight Celery generates pending check-ins.

```
Goal
    ↓

Today's CheckIn

Status:
Pending
```

---

## 3. Smart Reminder

Every minute Celery checks

```
Which reminder is due now?
```

If the reminder time matches,

```
Reminder Engine
        ↓

Behavior Engine
        ↓

Notification Dispatcher
        ↓

Telegram
```

---

## 4. User Replies

Example

```
"I completed it"

"I'm done"

"Finished today's goal"
```

↓

Intent Detector

↓

Updates Check-in

```
Pending

↓

Completed
```

↓

AI responds naturally.

---

# 🤖 AI Pipeline

```
User Message
      │
      ▼
Intent Detection
      │
      ▼
Behavior Engine
      │
      ▼
Context Builder
      │
      ▼
Prompt Builder
      │
      ▼
OpenAI
      │
      ▼
Structured Response
```

---

# 📱 Telegram Integration

Users can link Telegram with one click.

```
Web App

↓

Generate Secure Token

↓

Open Telegram

↓

/start <token>

↓

Telegram Linked

↓

Receive AI Reminders
```

---

# ⏰ Reminder Pipeline

```
Celery Beat
      │
      ▼
Runs every minute
      │
      ▼
Find Goals Due
      │
      ▼
Group by User
      │
      ▼
Build Reminder Payload
      │
      ▼
Behavior Engine
      │
      ▼
Notification Dispatcher
      │
      ▼
Telegram
```

---

# 🔐 Authentication

Uses JWT Authentication.

Endpoints

```
POST /api/v1/auth/register/

POST /api/v1/auth/login/

POST /api/v1/auth/logout/

GET /api/v1/auth/me/

GET /api/v1/auth/me/profile/

PATCH /api/v1/auth/me/profile/

GET /api/v1/auth/me/preferences/

PATCH /api/v1/auth/me/preferences/
```

---

# 🎯 Goal APIs

```
GET    /api/v1/goals/

POST   /api/v1/goals/

GET    /api/v1/goals/{id}/

PATCH  /api/v1/goals/{id}/

DELETE /api/v1/goals/{id}/

POST   /api/v1/goals/{id}/pause/

POST   /api/v1/goals/{id}/resume/

POST   /api/v1/goals/{id}/archive/
```

---

# ✅ Check-in APIs

```
GET /api/v1/checkins/

POST /api/v1/checkins/

GET /api/v1/checkins/{id}/

DELETE /api/v1/checkins/{id}/

POST /api/v1/checkins/{id}/complete/

POST /api/v1/checkins/{id}/miss/

POST /api/v1/checkins/{id}/skip/
```

---

# 💬 Conversation APIs

```
GET /api/v1/conversations/

POST /api/v1/conversations/

GET /api/v1/conversations/{id}/

DELETE /api/v1/conversations/{id}/

GET /api/v1/conversations/{id}/messages/

POST /api/v1/conversations/{id}/messages/

POST /api/v1/conversations/{id}/end/

POST /api/v1/conversations/{id}/abandon/
```

---

# 📲 Telegram APIs

```
POST /api/v1/channels/telegram/link/

POST /api/v1/channels/telegram/webhook/

GET  /api/v1/channels/telegram/status/
```

---

# 🐳 Running Locally

Clone the repository

```bash
git clone https://github.com/yourusername/strideAI.git
```

Install dependencies

```bash
docker compose up --build
```

Backend

```
http://localhost:8000
```

Frontend

```
http://localhost:5173
```

---

# 🔄 Background Services

Run

- Django API
- PostgreSQL
- Redis
- Celery Worker
- Celery Beat

```
docker compose up
```

---

# 🌍 Deployment

Recommended Azure Services

- Azure Container Registry
- Azure Container Apps
- Azure Database for PostgreSQL
- Azure Storage
- Azure Application Insights

Frontend

- Vercel

---

# 🚀 Future Roadmap

- WhatsApp Integration
- Voice Calling Agent
- Mobile Application
- AI Memory System
- Streak Analytics
- Weekly Reports
- AI Coach Personas
- Push Notifications
- Calendar Integration
- Email Notifications
- Wearable Integrations
- Team Accountability
- Multi-Agent Architecture

---

# 👨‍💻 Author

**Mohd Sameer**

Application Developer @ IBM

Backend • AI • Django • Azure • React

---

# 📄 License

This project is licensed under the MIT License.
