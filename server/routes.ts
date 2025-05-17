import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertProtocolSchema, insertProtocolCheckInSchema, insertBiometricSchema, insertAchievementSchema, insertForumPostSchema, insertForumCommentSchema } from "@shared/schema";
import { ZodError } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // Error handler for Zod validation errors
  const handleZodError = (err: unknown, res: Response) => {
    if (err instanceof ZodError) {
      return res.status(400).json({
        message: "Validation error",
        errors: err.errors,
      });
    }
    return res.status(500).json({ message: "Internal server error" });
  };

  // User routes
  app.get("/api/users/:id", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }

      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Don't return password in the response
      const { password, ...userWithoutPassword } = user;
      return res.json(userWithoutPassword);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const existingUser = await storage.getUserByUsername(userData.username);
      
      if (existingUser) {
        return res.status(409).json({ message: "Username already exists" });
      }
      
      const user = await storage.createUser(userData);
      
      // Don't return password in the response
      const { password, ...userWithoutPassword } = user;
      return res.status(201).json(userWithoutPassword);
    } catch (err) {
      return handleZodError(err, res);
    }
  });

  // Protocol routes
  app.get("/api/protocols", async (req, res) => {
    try {
      const userId = parseInt(req.query.userId as string);
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }

      const protocols = await storage.getProtocols(userId);
      return res.json(protocols);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/protocols/active", async (req, res) => {
    try {
      const userId = parseInt(req.query.userId as string);
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }

      const protocols = await storage.getActiveProtocols(userId);
      return res.json(protocols);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/protocols/:id", async (req, res) => {
    try {
      const protocolId = parseInt(req.params.id);
      if (isNaN(protocolId)) {
        return res.status(400).json({ message: "Invalid protocol ID" });
      }

      const protocol = await storage.getProtocol(protocolId);
      if (!protocol) {
        return res.status(404).json({ message: "Protocol not found" });
      }

      return res.json(protocol);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/protocols", async (req, res) => {
    try {
      const protocolData = insertProtocolSchema.parse(req.body);
      const protocol = await storage.createProtocol(protocolData);
      return res.status(201).json(protocol);
    } catch (err) {
      return handleZodError(err, res);
    }
  });

  app.patch("/api/protocols/:id", async (req, res) => {
    try {
      const protocolId = parseInt(req.params.id);
      if (isNaN(protocolId)) {
        return res.status(400).json({ message: "Invalid protocol ID" });
      }

      const protocol = await storage.getProtocol(protocolId);
      if (!protocol) {
        return res.status(404).json({ message: "Protocol not found" });
      }

      const updatedProtocol = await storage.updateProtocol(protocolId, req.body);
      return res.json(updatedProtocol);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.delete("/api/protocols/:id", async (req, res) => {
    try {
      const protocolId = parseInt(req.params.id);
      if (isNaN(protocolId)) {
        return res.status(400).json({ message: "Invalid protocol ID" });
      }

      const success = await storage.deleteProtocol(protocolId);
      if (!success) {
        return res.status(404).json({ message: "Protocol not found" });
      }

      return res.status(204).end();
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // Protocol check-in routes
  app.post("/api/protocol-check-ins", async (req, res) => {
    try {
      const checkInData = insertProtocolCheckInSchema.parse(req.body);
      const checkIn = await storage.createProtocolCheckIn(checkInData);
      return res.status(201).json(checkIn);
    } catch (err) {
      return handleZodError(err, res);
    }
  });

  app.get("/api/protocol-check-ins", async (req, res) => {
    try {
      const protocolId = parseInt(req.query.protocolId as string);
      if (isNaN(protocolId)) {
        return res.status(400).json({ message: "Invalid protocol ID" });
      }

      const checkIns = await storage.getProtocolCheckIns(protocolId);
      return res.json(checkIns);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // Biometric routes
  app.post("/api/biometrics", async (req, res) => {
    try {
      const biometricData = insertBiometricSchema.parse(req.body);
      const biometric = await storage.createBiometric(biometricData);
      return res.status(201).json(biometric);
    } catch (err) {
      return handleZodError(err, res);
    }
  });

  app.get("/api/biometrics", async (req, res) => {
    try {
      const userId = parseInt(req.query.userId as string);
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }

      const biometrics = await storage.getBiometrics(userId);
      return res.json(biometrics);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/biometrics/recent", async (req, res) => {
    try {
      const userId = parseInt(req.query.userId as string);
      const days = parseInt(req.query.days as string) || 7;
      
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }

      const biometrics = await storage.getRecentBiometrics(userId, days);
      return res.json(biometrics);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // Achievement routes
  app.get("/api/achievements", async (req, res) => {
    try {
      const userId = parseInt(req.query.userId as string);
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }

      const achievements = await storage.getAchievements(userId);
      return res.json(achievements);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/achievements", async (req, res) => {
    try {
      const achievementData = insertAchievementSchema.parse(req.body);
      const achievement = await storage.createAchievement(achievementData);
      return res.status(201).json(achievement);
    } catch (err) {
      return handleZodError(err, res);
    }
  });

  // Forum post routes
  app.get("/api/forum-posts", async (req, res) => {
    try {
      const category = req.query.category as string | undefined;
      
      let posts;
      if (category) {
        posts = await storage.getForumPostsByCategory(category);
      } else {
        posts = await storage.getForumPosts();
      }
      
      return res.json(posts);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/forum-posts/:id", async (req, res) => {
    try {
      const postId = parseInt(req.params.id);
      if (isNaN(postId)) {
        return res.status(400).json({ message: "Invalid post ID" });
      }

      const post = await storage.getForumPost(postId);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }

      return res.json(post);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/forum-posts", async (req, res) => {
    try {
      const postData = insertForumPostSchema.parse(req.body);
      const post = await storage.createForumPost(postData);
      return res.status(201).json(post);
    } catch (err) {
      return handleZodError(err, res);
    }
  });

  // Forum comment routes
  app.get("/api/forum-comments", async (req, res) => {
    try {
      const postId = parseInt(req.query.postId as string);
      if (isNaN(postId)) {
        return res.status(400).json({ message: "Invalid post ID" });
      }

      const comments = await storage.getForumComments(postId);
      return res.json(comments);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/forum-comments", async (req, res) => {
    try {
      const commentData = insertForumCommentSchema.parse(req.body);
      const comment = await storage.createForumComment(commentData);
      return res.status(201).json(comment);
    } catch (err) {
      return handleZodError(err, res);
    }
  });

  // Check-in route (Updates biometrics and user data)
  app.post("/api/check-in", async (req, res) => {
    try {
      const { userId, biometrics } = req.body;
      
      if (!userId || !biometrics) {
        return res.status(400).json({ message: "Missing required fields" });
      }
      
      // Create biometric entry
      const biometricData = insertBiometricSchema.parse({
        userId,
        ...biometrics
      });
      
      const biometricEntry = await storage.createBiometric(biometricData);
      
      // Update user's last check-in and streak
      const user = await storage.getUser(userId);
      if (user) {
        const now = new Date();
        const lastCheckIn = user.lastCheckIn;
        
        let streak = user.currentStreak || 0;
        
        // If this is the first check-in or it's been more than 48 hours, reset streak
        if (!lastCheckIn || (now.getTime() - lastCheckIn.getTime()) > 48 * 60 * 60 * 1000) {
          streak = 1;
        } else if ((now.getTime() - lastCheckIn.getTime()) > 20 * 60 * 60 * 1000) {
          // If it's been more than 20 hours, increment streak
          streak += 1;
        }
        
        await storage.updateUser(userId, {
          lastCheckIn: now,
          currentStreak: streak
        });
      }
      
      return res.status(200).json({
        message: "Check-in successful",
        biometric: biometricEntry
      });
    } catch (err) {
      return handleZodError(err, res);
    }
  });

  return httpServer;
}
