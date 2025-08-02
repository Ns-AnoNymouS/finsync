# FinSync Backend

> Scalable and secure RESTful API built with Node.js, Express, and MongoDB.

This project powers the **FinSync** platform — a financial management tool that helps users manage transactions, track expenses, and gain insights into their financial behavior.

---

## 🔧 Tech Stack

- **Node.js** (v18+)
- **Express.js**
- **MongoDB** with **Mongoose**
- **JWT** authentication
- **Joi** for validation
- **Winston & Morgan** for logging
- **Swagger** for API docs
- **PM2** for production process management
- **Jest** for unit/integration testing
- **Docker** support

---

## 📦 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Ns-AnoNymouS/finsync-backend.git
cd finsync-backend
```

### 2. Install Dependencies

```bash
npm install
```

> Make sure you have **Node.js**, **npm**, and **MongoDB** installed locally.

### 3. Setup Environment Variables

```bash
cp .env.example .env
```

Edit `.env` with your local values:

```dotenv
PORT=3000
MONGODB_URL=mongodb://localhost:27017/financeApp
JWT_SECRET=thisisasamplesecret
JWT_ACCESS_EXPIRATION_MINUTES=1440
JWT_REFRESH_EXPIRATION_DAYS=30
JWT_RESET_PASSWORD_EXPIRATION_MINUTES=10
JWT_VERIFY_EMAIL_EXPIRATION_MINUTES=10
SMTP_HOST=email-server
SMTP_PORT=587
SMTP_USERNAME=email-server-username
SMTP_PASSWORD=email-server-password
EMAIL_FROM=support@yourapp.com
GEMINI_API_KEY=gemini-api-key
```

---

## 🚀 Running the App

### Local Development

```bash
npm run dev
```

Server runs at: `http://localhost:3000`

### Production Mode

```bash
npm run start
```

### Docker Support

```bash
npm run docker:dev
# or
npm run docker:prod
```

---

## 📁 Project Structure

```
src/
│
├── config/         # App configs and env setup
├── controllers/    # Route controllers
├── routes/         # Express routes
├── services/       # Business logic layer
├── models/         # Mongoose schemas
├── validations/    # Joi validation schemas
├── middlewares/    # Custom middlewares (auth, error, etc.)
├── utils/          # Helpers and shared utilities
├── docs/           # Swagger documentation
├── app.js          # Express app entry
└── index.js        # Server bootstrap
```

---

## ✅ API Endpoints

Base URL: `http://localhost:3000/v1`

**Auth**

- `POST /v1/auth/register`
- `POST /v1/auth/login`
- `POST /v1/auth/refresh-tokens`

**Users**

- `GET /v1/users`
- `GET /v1/users/:userId`
- `PATCH /v1/users/:userId`
- `DELETE /v1/users/:userId`

**Transactions**

- `GET /v1/transactions`
- `POST /v1/transactions`
- `GET /v1/transactions/stats` (User-specific)

> More endpoints documented at:
> 📘 `http://localhost:3000/v1/docs`

---

## 🔐 Authentication

- Uses **JWT** (access + refresh tokens)
- Routes are protected via `auth()` middleware
- Role-based access via `auth('permission')` (e.g. `auth('manageUsers')`)

---

## 🧠 Design Decisions

- **Controller-Service Pattern** for clean separation of concerns.
- Each module (e.g. `transactions`, `auth`) has its own **controller**, **service**, **validation**, and **routes**.
- Business logic never resides in controllers — it's centralized in the `services/` folder.
- **Stats endpoints** are designed to hit the database only once for aggregate data.
- **User scoping** is enforced at the service level (e.g. transactions always filtered by `userId`).
- Swagger is auto-generated for easier collaboration with frontend devs.

---

## 🧪 Running Tests

```bash
npm run test         # Run all tests
npm run test:watch   # Watch mode
npm run coverage     # Generate coverage report
```

---

## 🧹 Linting & Formatting

```bash
npm run lint
npm run lint:fix
npm run prettier
npm run prettier:fix
```

---

## 🧪 Sample `.env`

```dotenv
PORT=3000
MONGODB_URL=mongodb://localhost:27017/financeApp
JWT_SECRET=thisisasamplesecret
JWT_ACCESS_EXPIRATION_MINUTES=1440
JWT_REFRESH_EXPIRATION_DAYS=30
JWT_RESET_PASSWORD_EXPIRATION_MINUTES=10
JWT_VERIFY_EMAIL_EXPIRATION_MINUTES=10
SMTP_HOST=email-server
SMTP_PORT=587
SMTP_USERNAME=email-server-username
SMTP_PASSWORD=email-server-password
EMAIL_FROM=support@yourapp.com
GEMINI_API_KEY=gemini-api-key

```

---

## 📄 License

[MIT](./LICENSE)

---

Let me know if you'd like to add a **frontend readme**, **postman collection**, or **deployment steps (Vercel/Render/Docker Compose)** too.
