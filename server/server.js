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

// Connect Database
connectDB();

const app = express();

// Security Middleware
app.use(helmet());

// CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

// Rate Limiting
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    message: {
      message: 'Too many requests. Try again later.',
    },
  })
);

// Body Parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Root Route
app.get('/', (req, res) => {
  res.send('VoxNote Backend Running');
});
app.get('/debug-routes', (req, res) => {
  res.send('debug route working');
});
// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'VoxNote API is running',
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/speech', speechRoutes);
app.use('/api/transcripts', transcriptRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    message: 'Route not found.',
    path: req.originalUrl,
  });
});

// Global Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});