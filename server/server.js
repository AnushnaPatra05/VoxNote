require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const speechRoutes = require('./routes/speechRoutes');
const transcriptRoutes = require('./routes/transcriptRoutes');
const { errorHandler } = require('./middleware/errorMiddleware');

connectDB();

const app = express();

app.use(express.json());
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  methods: ['GET', 'POST', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { message: 'Too many requests. Try again later.' },
}));

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

console.log(authRoutes);
app.get('/test', (req, res) => {
  res.send('test route works');
});
app.use('/api/auth', authRoutes);
app.use('/api/speech', speechRoutes);
app.use('/api/transcripts', transcriptRoutes);

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use((_req, res) => res.status(404).json({ message: 'Route not found.' }));
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));