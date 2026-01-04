import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';

const SALT_ROUNDS = 10;

/**
 * Validate password strength
 * Requirements:
 * - Minimum 8 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one digit
 * - At least one special character
 */
export const validatePasswordStrength = (password) => {
  const errors = [];

  if (!password || password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character (!@#$%^&*(),.?":{}|<>)');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

/**
 * Hash a password using bcrypt
 */
export const hashPassword = async (password) => {
  try {
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    return await bcrypt.hash(password, salt);
  } catch (error) {
    throw new Error(`Password hashing error: ${error.message}`);
  }
};

/**
 * Verify a password against a hashed password
 */
export const verifyPassword = async (plainPassword, hashedPassword) => {
  try {
    return await bcrypt.compare(plainPassword, hashedPassword);
  } catch (error) {
    console.error(`Password verification error: ${error.message}`);
    return false;
  }
};

/**
 * Create a JWT access token
 */
export const createAccessToken = (userId) => {
  return jwt.sign(
    { sub: String(userId) },
    config.jwt.secret,
    {
      algorithm: config.jwt.algorithm,
      expiresIn: config.jwt.expiresIn,
    }
  );
};

/**
 * Verify and decode a JWT token
 */
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, config.jwt.secret, {
      algorithms: [config.jwt.algorithm],
    });
  } catch (error) {
    throw new Error(`Invalid token: ${error.message}`);
  }
};
