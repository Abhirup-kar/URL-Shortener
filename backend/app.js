require('dotenv').config();
const express = require('express');
const app = express();
const authRouter = require('./routers/authRouter');
const urlRouter = require('./routers/urlRouter');
const cors = require('cors');
const session = require('express-session');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo').MongoStore;

const DB_PATH = process.env.MONGODB_URI || process.env.DB_PATH || "mongodb+srv://Abhirup:root@cluster0.x32ee4l.mongodb.net/?appName=Cluster0";
const PORT = process.env.PORT || 3000;
const SESSION_SECRET = process.env.SESSION_SECRET || 'secret';

// Middleware
app.use(express.json());
app.use(cors({
  origin: process.env.FRONTEND_URL ? [process.env.FRONTEND_URL, 'http://localhost:5173'] : true,
  credentials: true
}));

// Session configuration
const store = MongoStore.create({
    mongoUrl: DB_PATH,
    collectionName: 'URL_Shortener',
});

app.use(session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: store,
}));

// Database connection helper (cached for serverless environments like Vercel)
let cachedDb = null;
async function connectToDatabase() {
    if (cachedDb && mongoose.connection.readyState === 1) {
        return cachedDb;
    }
    try {
        cachedDb = await mongoose.connect(DB_PATH, {
            serverSelectionTimeoutMS: 5000,
        });
        console.log("MongoDB connected");
        return cachedDb;
    } catch (err) {
        console.error("Error while connecting to database:", err.message);
        throw err;
    }
}

// Ensure DB is connected before handling API requests
app.use(async (req, res, next) => {
    try {
        await connectToDatabase();
        next();
    } catch (err) {
        res.status(500).json({ 
            message: "Database connection error", 
            error: err.message 
        });
    }
});

// Routes
app.use(authRouter);
app.use(urlRouter);

// Health check route
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date() });
});

// Run server locally if not imported as a serverless module
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
    connectToDatabase().then(() => {
        app.listen(PORT, () => {
            console.log(`Server running on address http://localhost:${PORT}`);
        });
    }).catch(err => {
        console.error("Startup DB error:", err);
    });
}

module.exports = app;
