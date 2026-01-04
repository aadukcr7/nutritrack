import express from 'express';
import cors from 'cors';
import sequelize from './db/sequelize.js';
import { config } from './config/index.js';
import { errorHandler } from './middleware/auth.js';

// Import routes
import authRoutes from './routes/authRoutes.js';
import growthRoutes from './routes/growthRoutes.js';
import reminderRoutes from './routes/reminderRoutes.js';
import staticRoutes from './routes/staticRoutes.js';

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(config.cors));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/growth', growthRoutes);
app.use('/api/reminders', reminderRoutes);
app.use('/api/static', staticRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({ message: 'NutriTrack API running' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ detail: 'Not found' });
});

// Error handler
app.use(errorHandler);

// Initialize database and start server
const startServer = async () => {
  try {
    // Authenticate and sync database
    await sequelize.authenticate();
    console.log('Database connection established');

    // Sync models with database
    await sequelize.sync({ alter: true });
    console.log('Database synced');

    // Start server
    const PORT = config.server.port;
    app.listen(PORT, () => {
      console.log(`NutriTrack API listening on port ${PORT}`);
      console.log(`Environment: ${config.server.environment}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;
