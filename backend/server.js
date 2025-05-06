import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import connectDB from './config/db.js';
import loginRegisterRoute from './routes/loginRegisterRoute.js';
import newsRoute from './routes/newsRoute.js';

dotenv.config(); // Only once, no need for a second call

const app = express();

// CORS setup - ensure CLIENT_URL is correctly loaded
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(cookieParser());
app.use(express.json());

connectDB();

const PORT = process.env.PORT || 5000;

app.use('/register-login', loginRegisterRoute);
app.use('/news',newsRoute);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
