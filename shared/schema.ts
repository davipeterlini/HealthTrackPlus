import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  name: text("name"),
  avatar: text("avatar"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const medicalExams = pgTable("medical_exams", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  date: timestamp("date").notNull(),
  fileUrl: text("file_url").notNull(),
  type: text("type").notNull(),
  status: text("status").notNull(),
  results: json("results"),
});

export const activities = pgTable("activities", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  date: timestamp("date").notNull(),
  steps: integer("steps").notNull(),
  calories: integer("calories").notNull(),
  minutes: integer("minutes").notNull(),
});

export const sleepRecords = pgTable("sleep_records", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  date: timestamp("date").notNull(),
  hours: integer("hours").notNull(),
  quality: text("quality").notNull(),
  deepSleep: integer("deep_sleep").notNull(),
  lightSleep: integer("light_sleep").notNull(),
  rem: integer("rem").notNull(),
});

export const waterIntake = pgTable("water_intake", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  date: timestamp("date").notNull(),
  amount: integer("amount").notNull(),
});

export const meals = pgTable("meals", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  date: timestamp("date").notNull(),
  mealType: text("meal_type").notNull(),
  description: text("description").notNull(),
  calories: integer("calories"),
  carbs: integer("carbs"),
  protein: integer("protein"),
  fat: integer("fat"),
});

export const videos = pgTable("videos", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  duration: text("duration").notNull(),
  category: text("category").notNull(),
  description: text("description").notNull(),
  thumbnailUrl: text("thumbnail_url"),
});

export const videoProgress = pgTable("video_progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  videoId: integer("video_id").notNull().references(() => videos.id),
  progress: integer("progress").notNull(),
  lastWatched: timestamp("last_watched").notNull(),
});

export const courseTracks = pgTable("course_tracks", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  videoCount: integer("video_count").notNull(),
});

export const trackVideos = pgTable("track_videos", {
  id: serial("id").primaryKey(),
  trackId: integer("track_id").notNull().references(() => courseTracks.id),
  videoId: integer("video_id").notNull().references(() => videos.id),
  order: integer("order").notNull(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  email: true,
  password: true,
  name: true,
});

export const insertMedicalExamSchema = createInsertSchema(medicalExams).omit({
  id: true,
});

export const insertActivitySchema = createInsertSchema(activities).omit({
  id: true,
});

export const insertSleepRecordSchema = createInsertSchema(sleepRecords).omit({
  id: true,
});

export const insertWaterIntakeSchema = createInsertSchema(waterIntake).omit({
  id: true,
});

export const insertMealSchema = createInsertSchema(meals).omit({
  id: true,
});

export const insertVideoProgressSchema = createInsertSchema(videoProgress).omit({
  id: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type MedicalExam = typeof medicalExams.$inferSelect;
export type Activity = typeof activities.$inferSelect;
export type SleepRecord = typeof sleepRecords.$inferSelect;
export type WaterIntakeRecord = typeof waterIntake.$inferSelect;
export type Meal = typeof meals.$inferSelect;
export type Video = typeof videos.$inferSelect;
export type VideoProgress = typeof videoProgress.$inferSelect;
export type CourseTrack = typeof courseTracks.$inferSelect;
export type TrackVideo = typeof trackVideos.$inferSelect;

// Login schema
export const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export type LoginData = z.infer<typeof loginSchema>;

// 2FA schema
export const twoFactorSchema = z.object({
  code: z.string().length(6, "Code must be 6 digits"),
});

export type TwoFactorData = z.infer<typeof twoFactorSchema>;
