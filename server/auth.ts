import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { Express, Request, Response, NextFunction } from "express";
import { storage } from "./storage";
import { User } from "@shared/schema";

// JWT configuration
const JWT_SECRET = process.env.JWT_SECRET || "biohacker-app-jwt-secret";
const JWT_EXPIRES_IN = "7d"; // 7 days

// Add user type to Express request
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

// Hash a password
export async function hashPassword(password: string) {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
}

// Compare a password against a hash
export async function comparePasswords(supplied: string, stored: string) {
  return await bcrypt.compare(supplied, stored);
}

// Generate a JWT
export function generateToken(user: User) {
  // Don't include password in token payload
  const { password, ...userWithoutPassword } = user;
  return jwt.sign(userWithoutPassword, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

// Middleware to authenticate token
export function isAuthenticated(req: Request, res: Response, next: NextFunction) {
  // Get token from header or cookies
  let token = null;
  
  if (req.headers.authorization?.startsWith("Bearer ")) {
    // Get from Authorization header
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies?.token) {
    // Get from cookies
    token = req.cookies.token;
  }
  
  if (!token) {
    return res.status(401).json({ message: "Authentication required" });
  }
  
  try {
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET) as User;
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

// Setup auth routes
export function setupAuth(app: Express) {
  // Register endpoint
  app.post("/api/register", async (req, res) => {
    try {
      const { username, password, ...rest } = req.body;
      
      // Check if username already exists
      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }
      
      // Hash password
      const hashedPassword = await hashPassword(password);
      
      // Create user
      const user = await storage.createUser({
        username,
        password: hashedPassword,
        ...rest
      });
      
      // Generate JWT token
      const token = generateToken(user);
      
      // Set token as a cookie
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
      });
      
      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;
      
      // Return user data and token
      res.status(201).json({
        user: userWithoutPassword,
        token
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ message: "Registration failed" });
    }
  });
  
  // Login endpoint
  app.post("/api/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      // Check if user exists
      const user = await storage.getUserByUsername(username);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // Verify password
      const isPasswordValid = await comparePasswords(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // Generate JWT token
      const token = generateToken(user);
      
      // Set token as a cookie
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
      });
      
      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;
      
      // Return user data and token
      res.json({
        user: userWithoutPassword,
        token
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Login failed" });
    }
  });
  
  // Get current user endpoint
  app.get("/api/user", isAuthenticated, (req, res) => {
    // User is already set in req.user by the isAuthenticated middleware
    const { password, ...userWithoutPassword } = req.user as User;
    res.json(userWithoutPassword);
  });
  
  // Logout endpoint
  app.post("/api/logout", (req, res) => {
    // Clear the token cookie
    res.clearCookie("token");
    res.json({ message: "Logged out successfully" });
  });
  
  // Protect routes that require authentication
  app.use("/api/protected/*", isAuthenticated);
}