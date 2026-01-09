import express from 'express';
import cors from 'cors';
import sequelize from './db/sequelize.js';
import { config } from './config/index.js';
import { errorHandler } from './middleware/auth.js';
import seedVaccines from './db/vaccineSeeds.js';
import seedFeedings from './db/feedingSeeds.js';

// Import routes
import authRoutes from './routes/authRoutes.js';
import babyRoutes from './routes/babyRoutes.js';
import growthRoutes from './routes/growthRoutes.js';
import reminderRoutes from './routes/reminderRoutes.js';
import vaccineRoutes from './routes/vaccineRoutes.js';
import staticRoutes from './routes/staticRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import feedingRoutes from './routes/feedingRoutes.js';

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(config.cors));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/babies', babyRoutes);
app.use('/api/growth', growthRoutes);
app.use('/api/reminders', reminderRoutes);
app.use('/api/vaccines', vaccineRoutes);
app.use('/api/static', staticRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/feedings', feedingRoutes);

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

    // For SQLite, disable foreign key constraints temporarily during sync
    if (config.database.url.startsWith('sqlite')) {
      await sequelize.query('PRAGMA foreign_keys = OFF');
    }

    // Sync models with database - use alter: true to add new columns
    await sequelize.sync({ force: false, alter: true });
    console.log('Database synced');

    // Re-enable foreign key constraints for SQLite
    if (config.database.url.startsWith('sqlite')) {
      await sequelize.query('PRAGMA foreign_keys = ON');
    }

    // Seed vaccines
    await seedVaccines();
    console.log('Vaccine seeds loaded');

    // Seed feedings
    try {
      await seedFeedings();
      console.log('Feeding seeds loaded');
    } catch (err) {
      console.warn('Feeding seeds skipped or failed:', err.message);
    }

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
