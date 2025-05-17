import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User } from '@shared/schema';
import { storage } from './storage';

// JWT configuration
const JWT_SECRET = process.env.JWT_SECRET || 'biohacker-app-jwt-secret';
const JWT_EXPIRES_IN = '7d'; // 7 days

// Generate a JWT token
export function generateToken(user: User): string {
  // Don't include password in token payload
  const { password, ...userData } = user;
  return jwt.sign(userData, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

// Verify a token and return the decoded user
export function verifyToken(token: string): any {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid token');
  }
}

// Authentication middleware
export function isAuthenticated(req: Request, res: Response, next: NextFunction) {
  try {
    // Get token from cookies
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    // Verify token
    const decoded = verifyToken(token);
    
    // Set user in request object
    req.user = decoded;
    
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

// Set up auth routes
export function setupAuth(app: any) {
  // Register a new user
  app.post('/api/register', async (req: Request, res: Response) => {
    try {
      const { username, password, ...userData } = req.body;

      // Check if username already exists
      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        return res.status(400).json({ message: 'Username already exists' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user in database
      const user = await storage.createUser({
        username,
        password: hashedPassword,
        ...userData
      });

      // Generate JWT token
      const token = generateToken(user);

      // Set token cookie
      res.cookie('token', token, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      });

      // Return user data (without password)
      const { password: _, ...userWithoutPassword } = user;
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      console.error('Register error:', error);
      res.status(500).json({ message: 'Registration failed' });
    }
  });

  // Login a user
  app.post('/api/login', async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;

      // Get user from database
      const user = await storage.getUserByUsername(username);
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Verify password
      const passwordValid = await bcrypt.compare(password, user.password || '');
      if (!passwordValid) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Generate JWT token
      const token = generateToken(user);

      // Set token cookie
      res.cookie('token', token, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      });

      // Return user data (without password)
      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Login failed' });
    }
  });

  // Get authenticated user
  app.get('/api/user', isAuthenticated, (req: Request, res: Response) => {
    res.json(req.user);
  });

  // Logout a user
  app.post('/api/logout', (req: Request, res: Response) => {
    res.clearCookie('token');
    res.json({ message: 'Logged out successfully' });
  });
}