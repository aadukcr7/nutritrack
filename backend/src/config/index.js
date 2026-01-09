import 'dotenv/config';

export const config = {
  database: {
    url: process.env.DATABASE_URL || 'sqlite://./db.sqlite',
    dialect: process.env.DATABASE_URL?.startsWith('mysql') ? 'mysql' : 'sqlite',
  },
  jwt: {
    secret: process.env.SECRET_KEY || 'your-secret-key-change-this-in-production-min-32-chars',
    algorithm: process.env.ALGORITHM || 'HS256',
    expiresIn: process.env.ACCESS_TOKEN_EXPIRE_MINUTES || '1440m',
  },
  server: {
    port: process.env.PORT || 8000,
    environment: process.env.NODE_ENV || 'development',
  },
  cors: {
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:5174', 'http://127.0.0.1:5174'],
    credentials: true,
  },
  oauth: {
    googleClientId: process.env.GOOGLE_CLIENT_ID || '',
  },
};
