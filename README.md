# CareerBlueprint backend

A production-ready backend service for generating **AI-powered interview preparation reports** based on user resumes, skills, and job descriptions.

Built with scalability, fault tolerance, and clean architecture in mind.

---

## 🧠 Features

* 🔐 Authentication (JWT + Cookies)
* 👤 User Registration & Login
* 🚪 Secure Logout (Token Blacklisting)
* 🗑️ Delete Account with Cascade Cleanup
* 📄 AI-Powered Interview Report Generation
* ⚡ Smart AI Model Switching (Fallback Models)
* 🧯 Circuit Breaker Pattern (AI Failure Handling)
* 🛡️ AI Response Guard & Validation
* 📉 Fallback Report System (if AI fails)
* 🧱 Clean MVC Architecture

---

## 🏗️ Tech Stack

* Node.js
* Express.js
* MongoDB + Mongoose
* JWT Authentication
* Zod (Validation)
* Google Gemini AI API

---

## 📁 Folder Structure

```
server/
│
├── server.js
├── package.json
│
└── src/
    ├── config/        # DB & app configs
    ├── controllers/   # Route controllers
    ├── routes/        # API routes
    ├── middleware/    # Auth & error middlewares
    ├── services/      # Business logic (AI, etc.)
    ├── models/        # Mongoose schemas
    ├── utils/         # Helpers & utilities
```

---

## ⚙️ Environment Variables

Create a `.env` file in the root directory and add:

```
MONGO_URI=
PORT=
DB_NAME=
JWT_SECRET=
JWT_EXPIRES_IN=
GOOGLE_GENAI_API_KEY=
FRONTEND_URL=
NODE_ENV=
```

---

## 🚀 Getting Started

### 1️⃣ Clone the repository

```
git clone https://github.com/your-username/your-repo.git
cd server
```

### 2️⃣ Install dependencies

```
npm install
```

### 3️⃣ Setup environment variables

Create `.env` file using `.env.example`

### 4️⃣ Run the server

```
npm run dev
```

Server will run on:

```
http://localhost:5000
```

---

## 🔐 Authentication Flow

* JWT stored in **HTTP-only cookies**
* Secure cookie in production
* Token blacklist on logout
* Protected routes via middleware

---

## 🤖 AI Report System

### Flow:

1. User sends resume + job description
2. Prompt builder generates optimized prompt
3. AI model generates structured JSON response
4. Response is validated & normalized
5. If AI fails → fallback report is generated

---

## ⚡ Smart AI Handling

* 🔁 Multiple model fallback system
* 🚫 Circuit breaker prevents repeated failures
* 🧹 Response sanitization & JSON extraction
* 🛡️ Zod schema validation

---

## 🗑️ Account Deletion

* Deletes user from DB
* Automatically removes related data (cascade)
* Invalidates active session

---

## 📡 API Endpoints

### Auth

| Method | Endpoint           | Description   |
| ------ | ------------------ | ------------- |
| POST   | /api/auth/register | Register user |
| POST   | /api/auth/login    | Login user    |
| POST   | /api/auth/logout   | Logout user   |
| GET    | /api/auth/me       | Get user      |

---

### Report

| Method | Endpoint    | Description        |
| ------ | ----------- | ------------------ |
| POST   | /api/report | Generate AI report |

---

### User

| Method | Endpoint                 | Description |
| ------ | ------------------------ | ----------- |
| DELETE | /api/user/delete-account | Delete user |

---

## 🛡️ Error Handling

* Centralized error handler
* Custom `ApiError` class
* Async wrapper for controllers
* Graceful AI failure fallback

---

## 🧪 Future Improvements

* Rate limiting
* Email verification
* Resume parsing with file upload
* Caching (Redis)
* Admin dashboard

---

## 👨‍💻 Author

**Adnan Qureshi**

---

## 📜 License

This project is licensed under the MIT License.
