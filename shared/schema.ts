import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  email: text("email"),
  biohackScore: integer("biohack_score").default(50),
  currentStreak: integer("current_streak").default(0),
  lastCheckIn: timestamp("last_check_in"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  firstName: true,
  lastName: true,
  email: true,
});

// Protocols
export const protocols = pgTable("protocols", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  name: text("name").notNull(),
  description: text("description"),
  duration: integer("duration").notNull(),
  currentDay: integer("current_day").default(1),
  isCompleted: boolean("is_completed").default(false),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertProtocolSchema = createInsertSchema(protocols).pick({
  userId: true,
  name: true,
  description: true,
  duration: true,
});

// Protocol Check-ins
export const protocolCheckIns = pgTable("protocol_check_ins", {
  id: serial("id").primaryKey(),
  protocolId: integer("protocol_id").notNull(),
  userId: integer("user_id").notNull(),
  checkInDate: timestamp("check_in_date").defaultNow(),
  notes: text("notes"),
});

export const insertProtocolCheckInSchema = createInsertSchema(protocolCheckIns).pick({
  protocolId: true,
  userId: true,
  notes: true,
});

// Biometrics
export const biometrics = pgTable("biometrics", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  date: timestamp("date").defaultNow(),
  sleepQuality: integer("sleep_quality"),
  energyLevel: integer("energy_level"),
  stressLevel: integer("stress_level"),
  focusLevel: integer("focus_level"),
  moodLevel: integer("mood_level"),
  notes: text("notes"),
});

export const insertBiometricSchema = createInsertSchema(biometrics).pick({
  userId: true,
  sleepQuality: true,
  energyLevel: true,
  stressLevel: true,
  focusLevel: true,
  moodLevel: true,
  notes: true,
});

// Achievements
export const achievements = pgTable("achievements", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  name: text("name").notNull(),
  description: text("description"),
  points: integer("points").default(0),
  completedAt: timestamp("completed_at").defaultNow(),
});

export const insertAchievementSchema = createInsertSchema(achievements).pick({
  userId: true,
  name: true,
  description: true,
  points: true,
});

// Forum Posts
export const forumPosts = pgTable("forum_posts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  category: text("category").notNull(),
  commentCount: integer("comment_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertForumPostSchema = createInsertSchema(forumPosts).pick({
  userId: true,
  title: true,
  content: true,
  category: true,
});

// Forum Comments
export const forumComments = pgTable("forum_comments", {
  id: serial("id").primaryKey(),
  postId: integer("post_id").notNull(),
  userId: integer("user_id").notNull(),
  parentId: integer("parent_id"), // For nested comments, null means top-level comment
  content: text("content").notNull(),
  likeCount: integer("like_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertForumCommentSchema = createInsertSchema(forumComments).pick({
  postId: true,
  userId: true,
  parentId: true,
  content: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Protocol = typeof protocols.$inferSelect;
export type InsertProtocol = z.infer<typeof insertProtocolSchema>;

export type ProtocolCheckIn = typeof protocolCheckIns.$inferSelect;
export type InsertProtocolCheckIn = z.infer<typeof insertProtocolCheckInSchema>;

export type Biometric = typeof biometrics.$inferSelect;
export type InsertBiometric = z.infer<typeof insertBiometricSchema>;

export type Achievement = typeof achievements.$inferSelect;
export type InsertAchievement = z.infer<typeof insertAchievementSchema>;

export type ForumPost = typeof forumPosts.$inferSelect;
export type InsertForumPost = z.infer<typeof insertForumPostSchema>;

export type ForumComment = typeof forumComments.$inferSelect;
export type InsertForumComment = z.infer<typeof insertForumCommentSchema>;
