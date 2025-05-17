import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { Request, Response, NextFunction, Express } from 'express';
import { storage } from './storage';
import { User } from '@shared/schema';

// JWT secret key - should be set as environment variable in production
const JWT_SECRET = process.env.JWT_SECRET || 'biohacker-jwt-secret-key';
const JWT_EXPIRES_IN = '7d'; // Token expires in 7 days

// Generate a JWT token for a user
export function generateToken(user: User): string {
  // Don't include password in the token payload
  const { password, ...userWithoutPassword } = user;
  
  return jwt.sign(userWithoutPassword, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN
  });
}

// Verify a token and return the decoded user
export function verifyToken(token: string): any {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid token');
  }
}

// Middleware to check if user is authenticated
export function isAuthenticated(req: Request, res: Response, next: NextFunction) {
  try {
    // Get the token from the Authorization header or cookies
    const authHeader = req.headers.authorization;
    let token = '';
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }
    
    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    // Verify the token
    const decoded = verifyToken(token);
    
    // Add the user data to the request object
    req.user = decoded;
    
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Authentication failed' });
  }
}

// Hash a password
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
}

// Compare passwords
export async function comparePasswords(
  candidatePassword: string,
  hashedPassword: string
): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, hashedPassword);
}

// Setup auth routes
export function setupAuth(app: Express) {
  // Register a new user
  app.post('/api/register', async (req, res) => {
    try {
      const { username, password, ...userData } = req.body;
      
      // Check if username already exists
      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        return res.status(400).json({ message: 'Username already exists' });
      }
      
      // Hash the password
      const hashedPassword = await hashPassword(password);
      
      // Create the user
      const user = await storage.createUser({
        username,
        password: hashedPassword,
        ...userData
      });
      
      // Remove password before sending response
      const { password: _, ...userWithoutPassword } = user;
      
      // Generate token
      const token = generateToken(user);
      
      // Set cookie with the token
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });
      
      res.status(201).json({
        user: userWithoutPassword,
        token
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ message: 'Error registering user' });
    }
  });
  
  // Login
  app.post('/api/login', async (req, res) => {
    try {
      const { username, password } = req.body;
      
      // Find the user
      const user = await storage.getUserByUsername(username);
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      
      // Check password
      const isMatch = await comparePasswords(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      
      // Remove password before sending response
      const { password: _, ...userWithoutPassword } = user;
      
      // Generate token
      const token = generateToken(user);
      
      // Set cookie with the token
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });
      
      res.json({
        user: userWithoutPassword,
        token
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Error logging in' });
    }
  });
  
  // Logout
  app.post('/api/logout', (req, res) => {
    // Clear the token cookie
    res.clearCookie('token');
    res.json({ message: 'Logged out successfully' });
  });
  
  // Get current user
  app.get('/api/user', isAuthenticated, (req, res) => {
    res.json(req.user);
  });
}

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}