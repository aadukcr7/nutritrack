import { User } from '../models/index.js';
import {
  hashPassword,
  verifyPassword,
  validatePasswordStrength,
  createAccessToken,
} from '../utils/auth.js';

/**
 * Register a new user
 */
export const register = async (req, res, next) => {
  try {
    const { email, password, full_name, due_date, user_type, baby_date_of_birth } = req.body;

    // Validate password strength
    const passwordValidation = validatePasswordStrength(password);
    if (!passwordValidation.valid) {
      return res.status(400).json({
        detail: passwordValidation.errors[0],
        errors: passwordValidation.errors,
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ detail: 'Email already registered' });
    }

    // Hash password and create user
    const hashedPassword = await hashPassword(password);
    const newUser = await User.create({
      email,
      hashed_password: hashedPassword,
      full_name,
      due_date,
      user_type,
      baby_date_of_birth,
    });

    return res.status(201).json({ msg: 'User created' });
  } catch (error) {
    console.error(`Registration error: ${error.message}`);
    return res.status(500).json({
      detail: 'An error occurred during registration. Please try again.',
    });
  }
};

/**
 * Login user and return JWT token
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ detail: 'Incorrect email or password' });
    }

    // Verify password
    const passwordValid = await verifyPassword(password, user.hashed_password);
    if (!passwordValid) {
      return res.status(401).json({ detail: 'Incorrect email or password' });
    }

    // Create and return token
    const token = createAccessToken(user.id);
    return res.json({
      access_token: token,
      token_type: 'bearer',
    });
  } catch (error) {
    console.error(`Login error: ${error.message}`);
    return res.status(500).json({
      detail: 'An error occurred during login. Please try again.',
    });
  }
};

/**
 * Get current user profile
 */
export const getCurrentUser = async (req, res, next) => {
  try {
    const user = req.user; // Added by authenticateToken middleware
    return res.json({
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      due_date: user.due_date,
      user_type: user.user_type,
      baby_date_of_birth: user.baby_date_of_birth,
      created_at: user.created_at,
      updated_at: user.updated_at,
    });
  } catch (error) {
    console.error(`Error fetching user: ${error.message}`);
    return res.status(500).json({
      detail: 'An error occurred while fetching user profile.',
    });
  }
};
