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

app.use(helmet());

// CORS — allows localhost + any Vercel preview/production URL
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (mobile apps, curl, Postman)
      if (!origin) return callback(null, true);

      const allowedOrigins = [
        'http://localhost:5173',
        'http://localhost:3000',
        process.env.CLIENT_URL,
      ].filter(Boolean);

      // Allow any vercel.app subdomain for preview deployments
      const isVercel = origin.endsWith('.vercel.app');
      const isAllowed = allowedOrigins.includes(origin);

      if (isVercel || isAllowed) {
        callback(null, true);
      } else {
        callback(new Error(`CORS: origin ${origin} not allowed`));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { message: 'Too many requests. Try again later.' },
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.get('/', (_req, res) => res.send('VoxNote AI Backend Running'));

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok', message: 'VoxNote API is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/speech', speechRoutes);
app.use('/api/transcripts', transcriptRoutes);

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found.', path: req.originalUrl });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));