// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// server/storage.ts
var MemStorage = class {
  users;
  protocols;
  protocolCheckIns;
  biometrics;
  achievements;
  forumPosts;
  forumComments;
  userId;
  protocolId;
  checkInId;
  biometricId;
  achievementId;
  forumPostId;
  forumCommentId;
  constructor() {
    this.users = /* @__PURE__ */ new Map();
    this.protocols = /* @__PURE__ */ new Map();
    this.protocolCheckIns = /* @__PURE__ */ new Map();
    this.biometrics = /* @__PURE__ */ new Map();
    this.achievements = /* @__PURE__ */ new Map();
    this.forumPosts = /* @__PURE__ */ new Map();
    this.forumComments = /* @__PURE__ */ new Map();
    this.userId = 1;
    this.protocolId = 1;
    this.checkInId = 1;
    this.biometricId = 1;
    this.achievementId = 1;
    this.forumPostId = 1;
    this.forumCommentId = 1;
    this.initializeData();
  }
  initializeData() {
    const defaultUser = {
      id: this.userId++,
      username: "johndoe",
      password: "password123",
      // Note: In a real app, this would be hashed
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      biohackScore: 78,
      currentStreak: 12,
      lastCheckIn: /* @__PURE__ */ new Date(),
      createdAt: /* @__PURE__ */ new Date()
    };
    this.users.set(defaultUser.id, defaultUser);
    const protocols2 = [
      {
        userId: defaultUser.id,
        name: "Morning Cold Exposure",
        description: "5-minute cold shower every morning to boost immunity and energy",
        duration: 30,
        currentDay: 8,
        isCompleted: false,
        isActive: true
      },
      {
        userId: defaultUser.id,
        name: "Meditation & Breathwork",
        description: "10-minute meditation and breathwork routine",
        duration: 14,
        currentDay: 12,
        isCompleted: false,
        isActive: true
      },
      {
        userId: defaultUser.id,
        name: "Nootropic Stack",
        description: "Daily nootropic stack for cognitive enhancement",
        duration: 21,
        currentDay: 5,
        isCompleted: false,
        isActive: true
      },
      {
        userId: defaultUser.id,
        name: "Intermittent Fasting",
        description: "16:8 intermittent fasting protocol",
        duration: 30,
        currentDay: 3,
        isCompleted: false,
        isActive: true
      }
    ];
    protocols2.forEach((protocol) => {
      const newProtocol = {
        id: this.protocolId++,
        createdAt: /* @__PURE__ */ new Date(),
        ...protocol
      };
      this.protocols.set(newProtocol.id, newProtocol);
    });
    const today = /* @__PURE__ */ new Date();
    const days = 7;
    for (let i = 0; i < days; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const sleepQuality = Math.floor(75 + Math.random() * 15);
      const energyLevel = Math.floor(65 + Math.random() * 15);
      const biometric = {
        id: this.biometricId++,
        userId: defaultUser.id,
        date,
        sleepQuality,
        energyLevel,
        stressLevel: Math.floor(30 + Math.random() * 40),
        focusLevel: Math.floor(60 + Math.random() * 30),
        moodLevel: Math.floor(65 + Math.random() * 25),
        notes: ""
      };
      this.biometrics.set(biometric.id, biometric);
    }
    const achievements2 = [
      {
        userId: defaultUser.id,
        name: "30-Day Streak",
        description: "Completed protocols for 30 days in a row",
        points: 25,
        completedAt: new Date(today.setDate(today.getDate() - 2))
      },
      {
        userId: defaultUser.id,
        name: "Protocol Master",
        description: "Completed 5 protocols successfully",
        points: 40,
        completedAt: new Date(today.setDate(today.getDate() - 7))
      }
    ];
    achievements2.forEach((achievement) => {
      const newAchievement = {
        id: this.achievementId++,
        ...achievement
      };
      this.achievements.set(newAchievement.id, newAchievement);
    });
    const forumPosts2 = [
      {
        userId: defaultUser.id,
        title: "Anyone tried Lion's Mane + Bacopa stack?",
        content: "I've been researching cognitive enhancement supplements and this combo keeps coming up. Has anyone here tried it and what were your results?",
        category: "Cognitive Enhancement",
        commentCount: 24,
        createdAt: new Date(today.setHours(today.getHours() - 2))
      },
      {
        userId: defaultUser.id,
        title: "My experience with sleep tracking rings",
        content: "I've been using a sleep tracking ring for 3 months now and here's what I've learned...",
        category: "Sleep Optimization",
        commentCount: 18,
        createdAt: new Date(today.setHours(today.getHours() - 5))
      },
      {
        userId: defaultUser.id,
        title: "Intermittent fasting results (3 months)",
        content: "I've been doing intermittent fasting for the last 3 months and wanted to share my results with the community.",
        category: "Nutrition",
        commentCount: 32,
        createdAt: new Date(today.setDate(today.getDate() - 1))
      }
    ];
    forumPosts2.forEach((post) => {
      const newPost = {
        id: this.forumPostId++,
        ...post
      };
      this.forumPosts.set(newPost.id, newPost);
    });
  }
  // User operations
  async getUser(id) {
    return this.users.get(id);
  }
  async getUserByUsername(username) {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }
  async createUser(insertUser) {
    const id = this.userId++;
    const user = {
      ...insertUser,
      id,
      biohackScore: 50,
      currentStreak: 0,
      lastCheckIn: void 0,
      createdAt: /* @__PURE__ */ new Date()
    };
    this.users.set(id, user);
    return user;
  }
  async updateUser(id, userData) {
    const user = this.users.get(id);
    if (!user) return void 0;
    const updatedUser = { ...user, ...userData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }
  // Protocol operations
  async getProtocols(userId) {
    return Array.from(this.protocols.values()).filter((protocol) => protocol.userId === userId);
  }
  async getActiveProtocols(userId) {
    return Array.from(this.protocols.values()).filter(
      (protocol) => protocol.userId === userId && protocol.isActive && !protocol.isCompleted
    );
  }
  async getProtocol(id) {
    return this.protocols.get(id);
  }
  async createProtocol(insertProtocol) {
    const id = this.protocolId++;
    const protocol = {
      ...insertProtocol,
      id,
      currentDay: 1,
      isCompleted: false,
      isActive: true,
      createdAt: /* @__PURE__ */ new Date()
    };
    this.protocols.set(id, protocol);
    return protocol;
  }
  async updateProtocol(id, protocolData) {
    const protocol = this.protocols.get(id);
    if (!protocol) return void 0;
    const updatedProtocol = { ...protocol, ...protocolData };
    this.protocols.set(id, updatedProtocol);
    return updatedProtocol;
  }
  async deleteProtocol(id) {
    return this.protocols.delete(id);
  }
  // Protocol check-in operations
  async createProtocolCheckIn(insertCheckIn) {
    const id = this.checkInId++;
    const checkIn = {
      ...insertCheckIn,
      id,
      checkInDate: /* @__PURE__ */ new Date()
    };
    this.protocolCheckIns.set(id, checkIn);
    const protocol = await this.getProtocol(insertCheckIn.protocolId);
    if (protocol) {
      const currentDay = protocol.currentDay + 1;
      const isCompleted = currentDay > protocol.duration;
      await this.updateProtocol(protocol.id, {
        currentDay,
        isCompleted
      });
      if (insertCheckIn.userId) {
        const user = await this.getUser(insertCheckIn.userId);
        if (user) {
          const updatedUser = {
            ...user,
            currentStreak: user.currentStreak + 1,
            lastCheckIn: /* @__PURE__ */ new Date()
          };
          this.users.set(user.id, updatedUser);
        }
      }
    }
    return checkIn;
  }
  async getProtocolCheckIns(protocolId) {
    return Array.from(this.protocolCheckIns.values()).filter((checkIn) => checkIn.protocolId === protocolId).sort((a, b) => b.checkInDate.getTime() - a.checkInDate.getTime());
  }
  // Biometric operations
  async createBiometric(insertBiometric) {
    const id = this.biometricId++;
    const biometric = {
      ...insertBiometric,
      id,
      date: /* @__PURE__ */ new Date()
    };
    this.biometrics.set(id, biometric);
    if (insertBiometric.userId) {
      const user = await this.getUser(insertBiometric.userId);
      if (user) {
        const recentBiometrics = await this.getRecentBiometrics(user.id, 7);
        if (recentBiometrics.length > 0) {
          let scoreSum = 0;
          recentBiometrics.forEach((b) => {
            const metricSum = (b.sleepQuality || 0) + (b.energyLevel || 0) + (100 - (b.stressLevel || 0)) + (b.focusLevel || 0) + (b.moodLevel || 0);
            scoreSum += metricSum / 5;
          });
          const newBiohackScore = Math.round(scoreSum / recentBiometrics.length);
          await this.updateUser(user.id, { biohackScore: newBiohackScore });
        }
      }
    }
    return biometric;
  }
  async getBiometrics(userId) {
    return Array.from(this.biometrics.values()).filter((biometric) => biometric.userId === userId).sort((a, b) => b.date.getTime() - a.date.getTime());
  }
  async getRecentBiometrics(userId, days) {
    const cutoffDate = /* @__PURE__ */ new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    return Array.from(this.biometrics.values()).filter(
      (biometric) => biometric.userId === userId && biometric.date >= cutoffDate
    ).sort((a, b) => a.date.getTime() - b.date.getTime());
  }
  // Achievement operations
  async getAchievements(userId) {
    return Array.from(this.achievements.values()).filter((achievement) => achievement.userId === userId).sort((a, b) => b.completedAt.getTime() - a.completedAt.getTime());
  }
  async createAchievement(insertAchievement) {
    const id = this.achievementId++;
    const achievement = {
      ...insertAchievement,
      id,
      completedAt: /* @__PURE__ */ new Date()
    };
    this.achievements.set(id, achievement);
    return achievement;
  }
  // Forum operations
  async getForumPosts() {
    return Array.from(this.forumPosts.values()).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
  async getForumPostsByCategory(category) {
    return Array.from(this.forumPosts.values()).filter((post) => post.category === category).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
  async getForumPost(id) {
    return this.forumPosts.get(id);
  }
  async createForumPost(insertPost) {
    const id = this.forumPostId++;
    const post = {
      ...insertPost,
      id,
      commentCount: 0,
      createdAt: /* @__PURE__ */ new Date()
    };
    this.forumPosts.set(id, post);
    return post;
  }
  // Forum comment operations
  async getForumComments(postId) {
    return Array.from(this.forumComments.values()).filter((comment) => comment.postId === postId).sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }
  async createForumComment(insertComment) {
    const id = this.forumCommentId++;
    const comment = {
      ...insertComment,
      id,
      createdAt: /* @__PURE__ */ new Date()
    };
    this.forumComments.set(id, comment);
    const post = await this.getForumPost(insertComment.postId);
    if (post) {
      const updatedPost = {
        ...post,
        commentCount: post.commentCount + 1
      };
      this.forumPosts.set(post.id, updatedPost);
    }
    return comment;
  }
};
var storage = new MemStorage();

// shared/schema.ts
import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
var users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  email: text("email"),
  biohackScore: integer("biohack_score").default(50),
  currentStreak: integer("current_streak").default(0),
  lastCheckIn: timestamp("last_check_in"),
  createdAt: timestamp("created_at").defaultNow()
});
var insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  firstName: true,
  lastName: true,
  email: true
});
var protocols = pgTable("protocols", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  name: text("name").notNull(),
  description: text("description"),
  duration: integer("duration").notNull(),
  currentDay: integer("current_day").default(1),
  isCompleted: boolean("is_completed").default(false),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow()
});
var insertProtocolSchema = createInsertSchema(protocols).pick({
  userId: true,
  name: true,
  description: true,
  duration: true
});
var protocolCheckIns = pgTable("protocol_check_ins", {
  id: serial("id").primaryKey(),
  protocolId: integer("protocol_id").notNull(),
  userId: integer("user_id").notNull(),
  checkInDate: timestamp("check_in_date").defaultNow(),
  notes: text("notes")
});
var insertProtocolCheckInSchema = createInsertSchema(protocolCheckIns).pick({
  protocolId: true,
  userId: true,
  notes: true
});
var biometrics = pgTable("biometrics", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  date: timestamp("date").defaultNow(),
  sleepQuality: integer("sleep_quality"),
  energyLevel: integer("energy_level"),
  stressLevel: integer("stress_level"),
  focusLevel: integer("focus_level"),
  moodLevel: integer("mood_level"),
  notes: text("notes")
});
var insertBiometricSchema = createInsertSchema(biometrics).pick({
  userId: true,
  sleepQuality: true,
  energyLevel: true,
  stressLevel: true,
  focusLevel: true,
  moodLevel: true,
  notes: true
});
var achievements = pgTable("achievements", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  name: text("name").notNull(),
  description: text("description"),
  points: integer("points").default(0),
  completedAt: timestamp("completed_at").defaultNow()
});
var insertAchievementSchema = createInsertSchema(achievements).pick({
  userId: true,
  name: true,
  description: true,
  points: true
});
var forumPosts = pgTable("forum_posts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  category: text("category").notNull(),
  commentCount: integer("comment_count").default(0),
  createdAt: timestamp("created_at").defaultNow()
});
var insertForumPostSchema = createInsertSchema(forumPosts).pick({
  userId: true,
  title: true,
  content: true,
  category: true
});
var forumComments = pgTable("forum_comments", {
  id: serial("id").primaryKey(),
  postId: integer("post_id").notNull(),
  userId: integer("user_id").notNull(),
  parentId: integer("parent_id"),
  // For nested comments, null means top-level comment
  content: text("content").notNull(),
  likeCount: integer("like_count").default(0),
  createdAt: timestamp("created_at").defaultNow()
});
var insertForumCommentSchema = createInsertSchema(forumComments).pick({
  postId: true,
  userId: true,
  parentId: true,
  content: true
});

// server/routes.ts
import { ZodError } from "zod";
async function registerRoutes(app2) {
  const httpServer = createServer(app2);
  const handleZodError = (err, res) => {
    if (err instanceof ZodError) {
      return res.status(400).json({
        message: "Validation error",
        errors: err.errors
      });
    }
    return res.status(500).json({ message: "Internal server error" });
  };
  app2.get("/api/users/:id", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const { password, ...userWithoutPassword } = user;
      return res.json(userWithoutPassword);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const existingUser = await storage.getUserByUsername(userData.username);
      if (existingUser) {
        return res.status(409).json({ message: "Username already exists" });
      }
      const user = await storage.createUser(userData);
      const { password, ...userWithoutPassword } = user;
      return res.status(201).json(userWithoutPassword);
    } catch (err) {
      return handleZodError(err, res);
    }
  });
  app2.get("/api/protocols", async (req, res) => {
    try {
      const userId = parseInt(req.query.userId);
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      const protocols2 = await storage.getProtocols(userId);
      return res.json(protocols2);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.get("/api/protocols/active", async (req, res) => {
    try {
      const userId = parseInt(req.query.userId);
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      const protocols2 = await storage.getActiveProtocols(userId);
      return res.json(protocols2);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.get("/api/protocols/:id", async (req, res) => {
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
  app2.post("/api/protocols", async (req, res) => {
    try {
      const protocolData = insertProtocolSchema.parse(req.body);
      const protocol = await storage.createProtocol(protocolData);
      return res.status(201).json(protocol);
    } catch (err) {
      return handleZodError(err, res);
    }
  });
  app2.patch("/api/protocols/:id", async (req, res) => {
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
  app2.delete("/api/protocols/:id", async (req, res) => {
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
  app2.post("/api/protocol-check-ins", async (req, res) => {
    try {
      const checkInData = insertProtocolCheckInSchema.parse(req.body);
      const checkIn = await storage.createProtocolCheckIn(checkInData);
      return res.status(201).json(checkIn);
    } catch (err) {
      return handleZodError(err, res);
    }
  });
  app2.get("/api/protocol-check-ins", async (req, res) => {
    try {
      const protocolId = parseInt(req.query.protocolId);
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
  app2.post("/api/biometrics", async (req, res) => {
    try {
      const biometricData = insertBiometricSchema.parse(req.body);
      const biometric = await storage.createBiometric(biometricData);
      return res.status(201).json(biometric);
    } catch (err) {
      return handleZodError(err, res);
    }
  });
  app2.get("/api/biometrics", async (req, res) => {
    try {
      const userId = parseInt(req.query.userId);
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      const biometrics2 = await storage.getBiometrics(userId);
      return res.json(biometrics2);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.get("/api/biometrics/recent", async (req, res) => {
    try {
      const userId = parseInt(req.query.userId);
      const days = parseInt(req.query.days) || 7;
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      const biometrics2 = await storage.getRecentBiometrics(userId, days);
      return res.json(biometrics2);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.get("/api/achievements", async (req, res) => {
    try {
      const userId = parseInt(req.query.userId);
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      const achievements2 = await storage.getAchievements(userId);
      return res.json(achievements2);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.post("/api/achievements", async (req, res) => {
    try {
      const achievementData = insertAchievementSchema.parse(req.body);
      const achievement = await storage.createAchievement(achievementData);
      return res.status(201).json(achievement);
    } catch (err) {
      return handleZodError(err, res);
    }
  });
  app2.get("/api/forum-posts", async (req, res) => {
    try {
      const category = req.query.category;
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
  app2.get("/api/forum-posts/:id", async (req, res) => {
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
  app2.post("/api/forum-posts", async (req, res) => {
    try {
      const postData = insertForumPostSchema.parse(req.body);
      const post = await storage.createForumPost(postData);
      return res.status(201).json(post);
    } catch (err) {
      return handleZodError(err, res);
    }
  });
  app2.get("/api/forum-comments", async (req, res) => {
    try {
      const postId = parseInt(req.query.postId);
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
  app2.post("/api/forum-comments", async (req, res) => {
    try {
      const commentData = insertForumCommentSchema.parse(req.body);
      const comment = await storage.createForumComment(commentData);
      return res.status(201).json(comment);
    } catch (err) {
      return handleZodError(err, res);
    }
  });
  app2.post("/api/check-in", async (req, res) => {
    try {
      const { userId, biometrics: biometrics2 } = req.body;
      if (!userId || !biometrics2) {
        return res.status(400).json({ message: "Missing required fields" });
      }
      const biometricData = insertBiometricSchema.parse({
        userId,
        ...biometrics2
      });
      const biometricEntry = await storage.createBiometric(biometricData);
      const user = await storage.getUser(userId);
      if (user) {
        const now = /* @__PURE__ */ new Date();
        const lastCheckIn = user.lastCheckIn;
        let streak = user.currentStreak || 0;
        if (!lastCheckIn || now.getTime() - lastCheckIn.getTime() > 48 * 60 * 60 * 1e3) {
          streak = 1;
        } else if (now.getTime() - lastCheckIn.getTime() > 20 * 60 * 60 * 1e3) {
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

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist"),
    emptyOutDir: true
  },
  base: "/HomeHubDashboard/",
  // Ensure the correct base path
  server: {
    host: true
  },
  optimizeDeps: {
    include: ["react", "react-dom"]
  },
  esbuild: {
    define: {
      global: "window"
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = 5e3;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
