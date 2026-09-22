# 🔗 Shorten.it - Full-Stack URL Shortener Application

A fast, scalable, and user-friendly URL shortener web application built with **React**, **Node.js**, **Express**, and **MongoDB**. **Shorten.it** allows users to transform long web URLs into compact, shareable links, customize aliases, track click analytics, and manage their links through a dashboard.

---

## 🚀 Features

- **⚡ Instant URL Shortening**: Convert long URLs into 5-character short codes in seconds.
- **🏷️ Custom Aliases**: Choose custom short aliases (e.g., `shorten.it/my-link`) with instant collision detection.
- **👤 User Authentication**: Secure Signup & Login powered by `bcryptjs` password hashing.
- **📊 Personal Dashboard**: View click statistics, copy links, and manage/delete shortened URLs.
- **🔓 Guest Mode Support**: Guest users can shorten URLs without logging in.
- **🎯 Dynamic Redirection & Analytics**: Auto-tracks click counts every time a short link is visited (`/r/:alias`).
- **🎨 Glassmorphism UI**: Built with modern CSS glassmorphism effects, fluid animations, and dark mode aesthetics.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Styling**: [Bootstrap 5](https://getbootstrap.com/), CSS Modules, Vanilla CSS
- **Icons**: SVG Iconography

### Backend
- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express 5](https://expressjs.com/)
- **Database**: [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) with [Mongoose 9](https://mongoosejs.com/)
- **Authentication & Security**: `bcryptjs`, `express-session`, `connect-mongo`, `cors`

---

## 📁 Project Architecture & Directory Structure

```text
URL Shortener/
├── backend/
│   ├── controllers/
│   │   ├── authController.js     # Signup & Login handler
│   │   └── urlController.js      # Shortening, Redirection, Analytics & Deletion
│   ├── models/
│   │   ├── urls.js               # Mongoose Schema for URLs (url, shortUrl, count, userId)
│   │   └── users.js              # Mongoose Schema for Users (username, email, password)
│   ├── routers/
│   │   ├── authRouter.js         # Auth routes handler
│   │   └── urlRouter.js          # URL routes handler
│   ├── app.js                    # Express app entry point & MongoDB connection
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AuthModal.jsx     # Login/Signup modal dialog
│   │   │   ├── Dashboard.jsx     # User link history & analytics view
│   │   │   ├── nav.jsx           # Responsive top navigation header
│   │   │   └── UrlForm.jsx       # URL shortener input hero section
│   │   ├── services/
│   │   │   └── backend-connector.js # API service integration layer
│   │   ├── App.jsx               # Main React Application
│   │   └── main.jsx              # React DOM render root
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── URL_Shortener_Architecture_and_Algorithm.pdf # Architecture design documentation
├── URL_Shortener_How_It_Works.pdf               # System flow guide
└── README.md
```

---

## 📡 API Endpoints

### 🔑 Authentication Routes

| Method | Endpoint | Description | Request Body |
| :--- | :--- | :--- | :--- |
| `POST` | `/signup` | Register a new user | `{ "username": "string", "email": "string", "password": "string" }` |
| `POST` | `/login` | Authenticate existing user | `{ "email": "string", "password": "string" }` |

### 🔗 URL Management Routes

| Method | Endpoint | Description | Request Body / Query |
| :--- | :--- | :--- | :--- |
| `POST` | `/urls/shorten` | Create short URL | `{ "originalUrl": "string", "customAlias": "string" (opt), "email": "string" (opt) }` |
| `POST` | `/urls/my-urls` | Get user's URL history | `{ "email": "string" }` |
| `DELETE` | `/urls/:id` | Delete a shortened link | URL parameter `id` |
| `GET` | `/r/:alias` | Redirect to destination | URL parameter `alias` |

---

## ⚡ Getting Started

### Prerequisites

Ensure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (v18 or later)
- [npm](https://www.npmjs.com/) (v9 or later)
- Access to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) or a local MongoDB instance

---

### 1. Clone & Setup Repository

```bash
git clone https://github.com/Abhirup-kar/URL-Shortener.git
cd "URL Shortener"
```

---

### 2. Backend Setup

1. Open a terminal and navigate to the `backend` folder:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Database Connection:
   Update `DB_PATH` in `backend/app.js` with your MongoDB connection string if required.

4. Start the backend server:
   ```bash
   npm start
   ```
   The backend server will run at: `http://localhost:3000`

---

### 3. Frontend Setup

1. Open another terminal and navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to:
   ```text
   http://localhost:5173
   ```

---

## 📄 Documentation

For deep technical insights on the algorithm, collision handling, and scaling strategies, check out the included documentation files:
- `URL_Shortener_Architecture_and_Algorithm.pdf`
- `URL_Shortener_How_It_Works.pdf`

---

## 👤 Author

**Abhirup Kar**
- GitHub: [@Abhirup-kar](https://github.com/Abhirup-kar)

---

## 📜 License

This project is licensed under the [ISC License](LICENSE).
