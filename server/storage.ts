import {
  users, type User, type InsertUser,
  protocols, type Protocol, type InsertProtocol,
  protocolCheckIns, type ProtocolCheckIn, type InsertProtocolCheckIn,
  biometrics, type Biometric, type InsertBiometric,
  achievements, type Achievement, type InsertAchievement,
  forumPosts, type ForumPost, type InsertForumPost,
  forumComments, type ForumComment, type InsertForumComment
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, userData: Partial<User>): Promise<User | undefined>;
  
  // Protocol operations
  getProtocols(userId: number): Promise<Protocol[]>;
  getActiveProtocols(userId: number): Promise<Protocol[]>;
  getProtocol(id: number): Promise<Protocol | undefined>;
  createProtocol(protocol: InsertProtocol): Promise<Protocol>;
  updateProtocol(id: number, protocolData: Partial<Protocol>): Promise<Protocol | undefined>;
  deleteProtocol(id: number): Promise<boolean>;
  
  // Protocol check-in operations
  createProtocolCheckIn(checkIn: InsertProtocolCheckIn): Promise<ProtocolCheckIn>;
  getProtocolCheckIns(protocolId: number): Promise<ProtocolCheckIn[]>;
  
  // Biometric operations
  createBiometric(biometric: InsertBiometric): Promise<Biometric>;
  getBiometrics(userId: number): Promise<Biometric[]>;
  getRecentBiometrics(userId: number, days: number): Promise<Biometric[]>;
  
  // Achievement operations
  getAchievements(userId: number): Promise<Achievement[]>;
  createAchievement(achievement: InsertAchievement): Promise<Achievement>;
  
  // Forum operations
  getForumPosts(): Promise<ForumPost[]>;
  getForumPostsByCategory(category: string): Promise<ForumPost[]>;
  getForumPost(id: number): Promise<ForumPost | undefined>;
  createForumPost(post: InsertForumPost): Promise<ForumPost>;
  
  // Forum comment operations
  getForumComments(postId: number): Promise<ForumComment[]>;
  createForumComment(comment: InsertForumComment): Promise<ForumComment>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private protocols: Map<number, Protocol>;
  private protocolCheckIns: Map<number, ProtocolCheckIn>;
  private biometrics: Map<number, Biometric>;
  private achievements: Map<number, Achievement>;
  private forumPosts: Map<number, ForumPost>;
  private forumComments: Map<number, ForumComment>;
  
  private userId: number;
  private protocolId: number;
  private checkInId: number;
  private biometricId: number;
  private achievementId: number;
  private forumPostId: number;
  private forumCommentId: number;

  constructor() {
    this.users = new Map();
    this.protocols = new Map();
    this.protocolCheckIns = new Map();
    this.biometrics = new Map();
    this.achievements = new Map();
    this.forumPosts = new Map();
    this.forumComments = new Map();
    
    this.userId = 1;
    this.protocolId = 1;
    this.checkInId = 1;
    this.biometricId = 1;
    this.achievementId = 1;
    this.forumPostId = 1;
    this.forumCommentId = 1;
    
    // Initialize with sample data
    this.initializeData();
  }
  
  private initializeData() {
    // Create a default user
    const defaultUser: User = {
      id: this.userId++,
      username: "johndoe",
      password: "password123", // Note: In a real app, this would be hashed
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      biohackScore: 78,
      currentStreak: 12,
      lastCheckIn: new Date(),
      createdAt: new Date()
    };
    this.users.set(defaultUser.id, defaultUser);
    
    // Create sample protocols
    const protocols: Partial<Protocol>[] = [
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
    
    protocols.forEach(protocol => {
      const newProtocol: Protocol = {
        id: this.protocolId++,
        createdAt: new Date(),
        ...protocol as Omit<Protocol, 'id' | 'createdAt'>
      };
      this.protocols.set(newProtocol.id, newProtocol);
    });
    
    // Create sample biometrics
    const today = new Date();
    const days = 7;
    for (let i = 0; i < days; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      const sleepQuality = Math.floor(75 + Math.random() * 15);
      const energyLevel = Math.floor(65 + Math.random() * 15);
      
      const biometric: Biometric = {
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
    
    // Create sample achievements
    const achievements: Partial<Achievement>[] = [
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
    
    achievements.forEach(achievement => {
      const newAchievement: Achievement = {
        id: this.achievementId++,
        ...achievement as Omit<Achievement, 'id'>
      };
      this.achievements.set(newAchievement.id, newAchievement);
    });
    
    // Create sample forum posts
    const forumPosts: Partial<ForumPost>[] = [
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
    
    forumPosts.forEach(post => {
      const newPost: ForumPost = {
        id: this.forumPostId++,
        ...post as Omit<ForumPost, 'id'>
      };
      this.forumPosts.set(newPost.id, newPost);
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const user: User = { 
      ...insertUser, 
      id, 
      biohackScore: 50,
      currentStreak: 0,
      lastCheckIn: undefined,
      createdAt: new Date() 
    };
    this.users.set(id, user);
    return user;
  }
  
  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...userData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }
  
  // Protocol operations
  async getProtocols(userId: number): Promise<Protocol[]> {
    return Array.from(this.protocols.values()).filter(protocol => protocol.userId === userId);
  }
  
  async getActiveProtocols(userId: number): Promise<Protocol[]> {
    return Array.from(this.protocols.values()).filter(protocol => 
      protocol.userId === userId && protocol.isActive && !protocol.isCompleted
    );
  }
  
  async getProtocol(id: number): Promise<Protocol | undefined> {
    return this.protocols.get(id);
  }
  
  async createProtocol(insertProtocol: InsertProtocol): Promise<Protocol> {
    const id = this.protocolId++;
    const protocol: Protocol = {
      ...insertProtocol,
      id,
      currentDay: 1,
      isCompleted: false,
      isActive: true,
      createdAt: new Date()
    };
    this.protocols.set(id, protocol);
    return protocol;
  }
  
  async updateProtocol(id: number, protocolData: Partial<Protocol>): Promise<Protocol | undefined> {
    const protocol = this.protocols.get(id);
    if (!protocol) return undefined;
    
    const updatedProtocol = { ...protocol, ...protocolData };
    this.protocols.set(id, updatedProtocol);
    return updatedProtocol;
  }
  
  async deleteProtocol(id: number): Promise<boolean> {
    return this.protocols.delete(id);
  }
  
  // Protocol check-in operations
  async createProtocolCheckIn(insertCheckIn: InsertProtocolCheckIn): Promise<ProtocolCheckIn> {
    const id = this.checkInId++;
    const checkIn: ProtocolCheckIn = {
      ...insertCheckIn,
      id,
      checkInDate: new Date()
    };
    this.protocolCheckIns.set(id, checkIn);
    
    // Update the protocol's current day
    const protocol = await this.getProtocol(insertCheckIn.protocolId);
    if (protocol) {
      const currentDay = protocol.currentDay + 1;
      const isCompleted = currentDay > protocol.duration;
      
      await this.updateProtocol(protocol.id, { 
        currentDay, 
        isCompleted 
      });
      
      // Update user's streak if needed
      if (insertCheckIn.userId) {
        const user = await this.getUser(insertCheckIn.userId);
        if (user) {
          const updatedUser = { 
            ...user, 
            currentStreak: user.currentStreak + 1,
            lastCheckIn: new Date()
          };
          this.users.set(user.id, updatedUser);
        }
      }
    }
    
    return checkIn;
  }
  
  async getProtocolCheckIns(protocolId: number): Promise<ProtocolCheckIn[]> {
    return Array.from(this.protocolCheckIns.values())
      .filter(checkIn => checkIn.protocolId === protocolId)
      .sort((a, b) => b.checkInDate.getTime() - a.checkInDate.getTime());
  }
  
  // Biometric operations
  async createBiometric(insertBiometric: InsertBiometric): Promise<Biometric> {
    const id = this.biometricId++;
    const biometric: Biometric = {
      ...insertBiometric,
      id,
      date: new Date()
    };
    this.biometrics.set(id, biometric);
    
    // Update the user's biohack score
    if (insertBiometric.userId) {
      const user = await this.getUser(insertBiometric.userId);
      if (user) {
        // Calculate new biohack score based on recent biometrics
        const recentBiometrics = await this.getRecentBiometrics(user.id, 7);
        if (recentBiometrics.length > 0) {
          let scoreSum = 0;
          recentBiometrics.forEach(b => {
            const metricSum = (b.sleepQuality || 0) + 
                             (b.energyLevel || 0) + 
                             (100 - (b.stressLevel || 0)) + 
                             (b.focusLevel || 0) + 
                             (b.moodLevel || 0);
            scoreSum += metricSum / 5;
          });
          
          const newBiohackScore = Math.round(scoreSum / recentBiometrics.length);
          await this.updateUser(user.id, { biohackScore: newBiohackScore });
        }
      }
    }
    
    return biometric;
  }
  
  async getBiometrics(userId: number): Promise<Biometric[]> {
    return Array.from(this.biometrics.values())
      .filter(biometric => biometric.userId === userId)
      .sort((a, b) => b.date.getTime() - a.date.getTime());
  }
  
  async getRecentBiometrics(userId: number, days: number): Promise<Biometric[]> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    return Array.from(this.biometrics.values())
      .filter(biometric => 
        biometric.userId === userId && 
        biometric.date >= cutoffDate
      )
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  }
  
  // Achievement operations
  async getAchievements(userId: number): Promise<Achievement[]> {
    return Array.from(this.achievements.values())
      .filter(achievement => achievement.userId === userId)
      .sort((a, b) => b.completedAt.getTime() - a.completedAt.getTime());
  }
  
  async createAchievement(insertAchievement: InsertAchievement): Promise<Achievement> {
    const id = this.achievementId++;
    const achievement: Achievement = {
      ...insertAchievement,
      id,
      completedAt: new Date()
    };
    this.achievements.set(id, achievement);
    return achievement;
  }
  
  // Forum operations
  async getForumPosts(): Promise<ForumPost[]> {
    return Array.from(this.forumPosts.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
  
  async getForumPostsByCategory(category: string): Promise<ForumPost[]> {
    return Array.from(this.forumPosts.values())
      .filter(post => post.category === category)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
  
  async getForumPost(id: number): Promise<ForumPost | undefined> {
    return this.forumPosts.get(id);
  }
  
  async createForumPost(insertPost: InsertForumPost): Promise<ForumPost> {
    const id = this.forumPostId++;
    const post: ForumPost = {
      ...insertPost,
      id,
      commentCount: 0,
      createdAt: new Date()
    };
    this.forumPosts.set(id, post);
    return post;
  }
  
  // Forum comment operations
  async getForumComments(postId: number): Promise<ForumComment[]> {
    return Array.from(this.forumComments.values())
      .filter(comment => comment.postId === postId)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }
  
  async createForumComment(insertComment: InsertForumComment): Promise<ForumComment> {
    const id = this.forumCommentId++;
    const comment: ForumComment = {
      ...insertComment,
      id,
      createdAt: new Date()
    };
    this.forumComments.set(id, comment);
    
    // Update post comment count
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
}

export const storage = new MemStorage();
