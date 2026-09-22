const express = require('express');
const app = express();
const authRouter = require('./routers/authRouter');
const urlRouter = require('./routers/urlRouter');
const cors = require('cors');
const session = require('express-session');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo').MongoStore;

const DB_PATH = process.env.DB_PATH;
const SESSION_SECRET = process.env.SESSION_SECRET;

if (!DB_PATH) {
    throw new Error('Missing required environment variable: DB_PATH');
}

if (!SESSION_SECRET) {
    throw new Error('Missing required environment variable: SESSION_SECRET');
}

app.use(express.json());
app.use(cors());

app.use(authRouter);
app.use(urlRouter);
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

const PORT = 3000;

mongoose.connect(DB_PATH).then(()=>{
  console.log("MongoDb connected");
  app.listen(PORT, () => {
    console.log(`Server running on address http://localhost:${PORT}`);
  });
}).catch(err=>{
  console.log("Error while connecting to database");
})
