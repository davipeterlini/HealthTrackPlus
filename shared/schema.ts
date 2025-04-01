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
  startTime: timestamp("start_time"),
  endTime: timestamp("end_time"),
  activityType: text("activity_type").notNull().default("walking"),
  steps: integer("steps").notNull(),
  distance: integer("distance"),
  calories: integer("calories").notNull(),
  minutes: integer("minutes").notNull(),
  heartRate: integer("heart_rate"),
  heartRateZones: json("heart_rate_zones"),
  elevationGain: integer("elevation_gain"),
  elevationLoss: integer("elevation_loss"),
  avgPace: integer("avg_pace"),
  maxPace: integer("max_pace"),
  intensity: text("intensity"),
  cadence: integer("cadence"),
  strideLength: integer("stride_length"),
  routeData: json("route_data"),
  gpsPoints: json("gps_points"),
  activityImage: text("activity_image"),
  feeling: text("feeling"),
  weatherCondition: text("weather_condition"),
  temperature: integer("temperature"),
  humidity: integer("humidity"),
  terrainType: text("terrain_type"),
  equipmentUsed: text("equipment_used"),
  notes: text("notes"),
  source: text("source").default("manual"),
  isRealTime: boolean("is_real_time").default(false),
  achievements: json("achievements"),
});

export const sleepRecords = pgTable("sleep_records", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  date: timestamp("date").notNull(),
  bedTime: timestamp("bed_time").notNull(),
  wakeTime: timestamp("wake_time").notNull(),
  hours: integer("hours").notNull(),
  quality: text("quality").notNull(),
  deepSleep: integer("deep_sleep").notNull(),
  lightSleep: integer("light_sleep").notNull(),
  rem: integer("rem").notNull(),
  awakeTime: integer("awake_time"),
  snoring: boolean("snoring"),
  respiratoryRate: integer("respiratory_rate"),
  heartRateDuringSleep: integer("heart_rate"),
  sleepNotes: text("sleep_notes"),
  sleepEnvironment: text("sleep_environment"),
  stressLevel: integer("stress_level"),
  source: text("source").default("manual"),
});

export const waterIntake = pgTable("water_intake", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  date: timestamp("date").notNull(),
  time: timestamp("time").notNull(),
  amount: integer("amount").notNull(),
  unit: text("unit").notNull().default("ml"),
  containerType: text("container_type"),
  hydrationGoal: integer("hydration_goal"),
  reminder: boolean("reminder").default(false),
  reminderInterval: integer("reminder_interval"),
});

export const meals = pgTable("meals", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  date: timestamp("date").notNull(),
  time: timestamp("time").notNull(),
  mealType: text("meal_type").notNull(),
  description: text("description").notNull(),
  calories: integer("calories"),
  carbs: integer("carbs"),
  protein: integer("protein"),
  fat: integer("fat"),
  fiber: integer("fiber"),
  sugar: integer("sugar"),
  sodium: integer("sodium"),
  cholesterol: integer("cholesterol"),
  foodItems: json("food_items"),
  dietaryRestrictions: text("dietary_restrictions"),
  moodAfterEating: text("mood_after_eating"),
  hungerLevel: integer("hunger_level"),
  photoUrl: text("photo_url"),
  recipeId: integer("recipe_id"),
});

export const foodItems = pgTable("food_items", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  calories: integer("calories"),
  carbs: integer("carbs"),
  protein: integer("protein"),
  fat: integer("fat"),
  fiber: integer("fiber"),
  sugar: integer("sugar"),
  sodium: integer("sodium"),
  cholesterol: integer("cholesterol"),
  servingSize: text("serving_size"),
  category: text("category"),
});

export const recipes = pgTable("recipes", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  name: text("name").notNull(),
  description: text("description"),
  instructions: text("instructions"),
  prepTime: integer("prep_time"),
  cookTime: integer("cook_time"),
  servings: integer("servings"),
  ingredients: json("ingredients"),
  nutritionInfo: json("nutrition_info"),
  tags: text("tags").array(),
  category: text("category"),
  photoUrl: text("photo_url"),
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
  avatar: true,
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

// Adicionando tabelas para gerenciamento de estresse e medicamentos
export const stressLevels = pgTable("stress_levels", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  date: timestamp("date").notNull(),
  time: timestamp("time").notNull(),
  level: integer("level").notNull(),
  notes: text("notes"),
  triggers: text("triggers"),
  symptoms: text("symptoms").array(),
  meditationMinutes: integer("meditation_minutes"),
  breathingExercises: boolean("breathing_exercises"),
});

export const medications = pgTable("medications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  dosage: text("dosage").notNull(),
  frequency: text("frequency").notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date"),
  instructions: text("instructions"),
  reasonForTaking: text("reason_for_taking"),
  sideEffects: text("side_effects").array(),
  reminderEnabled: boolean("reminder_enabled").default(true),
  reminderTimes: json("reminder_times"),
  prescribedBy: text("prescribed_by"),
  pharmacy: text("pharmacy"),
  refillReminder: boolean("refill_reminder").default(false),
  refillDate: timestamp("refill_date"),
  active: boolean("active").default(true),
});

export const medicationLogs = pgTable("medication_logs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  medicationId: integer("medication_id").notNull().references(() => medications.id),
  timeTaken: timestamp("time_taken").notNull(),
  taken: boolean("taken").notNull(),
  skipped: boolean("skipped").default(false),
  missedReason: text("missed_reason"),
  symptoms: text("symptoms"),
  notes: text("notes"),
});

export const meditationSessions = pgTable("meditation_sessions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  date: timestamp("date").notNull(),
  duration: integer("duration").notNull(),
  type: text("type").notNull(),
  guidedBy: text("guided_by"),
  notes: text("notes"),
  stressLevelBefore: integer("stress_level_before"),
  stressLevelAfter: integer("stress_level_after"),
  favorited: boolean("favorited").default(false),
});

export const menstrualCycles = pgTable("menstrual_cycles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  cycleStartDate: timestamp("cycle_start_date").notNull(),
  cycleEndDate: timestamp("cycle_end_date"),
  predictedStartDate: timestamp("predicted_start_date"),
  predictedEndDate: timestamp("predicted_end_date"),
  duration: integer("duration"),
  flow: text("flow"),
  symptoms: text("symptoms").array(),
  mood: text("mood"),
  notes: text("notes"),
});

export const menstrualCycleSymptoms = pgTable("menstrual_cycle_symptoms", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  date: timestamp("date").notNull(),
  symptomType: text("symptom_type").notNull(),
  intensity: integer("intensity"),
  notes: text("notes"),
});

export const fertilityTracking = pgTable("fertility_tracking", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  date: timestamp("date").notNull(),
  basalTemperature: integer("basal_temperature"),
  cervicalMucus: text("cervical_mucus"),
  ovulationTestResult: text("ovulation_test_result"),
  intercourse: boolean("intercourse"),
  notes: text("notes"),
  predictedFertileWindow: json("predicted_fertile_window"),
  predictedOvulationDay: timestamp("predicted_ovulation_day"),
});

export const pregnancyTracking = pgTable("pregnancy_tracking", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  dueDate: timestamp("due_date").notNull(),
  lastPeriod: timestamp("last_period"),
  currentWeek: integer("current_week"),
  symptoms: text("symptoms").array(),
  notes: text("notes"),
  appointments: json("appointments"),
  weightGain: integer("weight_gain"),
  babySize: text("baby_size"),
  babyMovements: boolean("baby_movements"),
});

// Esquemas de inserção para as novas tabelas
export const insertFoodItemSchema = createInsertSchema(foodItems).omit({
  id: true,
});

export const insertRecipeSchema = createInsertSchema(recipes).omit({
  id: true,
});

export const insertStressLevelSchema = createInsertSchema(stressLevels).omit({
  id: true,
});

export const insertMedicationSchema = createInsertSchema(medications).omit({
  id: true,
});

export const insertMedicationLogSchema = createInsertSchema(medicationLogs).omit({
  id: true,
});

export const insertMeditationSessionSchema = createInsertSchema(meditationSessions).omit({
  id: true,
});

export const insertMenstrualCycleSchema = createInsertSchema(menstrualCycles).omit({
  id: true,
});

export const insertMenstrualCycleSymptomSchema = createInsertSchema(menstrualCycleSymptoms).omit({
  id: true,
});

export const insertFertilityTrackingSchema = createInsertSchema(fertilityTracking).omit({
  id: true,
});

export const insertPregnancyTrackingSchema = createInsertSchema(pregnancyTracking).omit({
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
export type FoodItem = typeof foodItems.$inferSelect;
export type Recipe = typeof recipes.$inferSelect;
export type StressLevel = typeof stressLevels.$inferSelect;
export type Medication = typeof medications.$inferSelect;
export type MedicationLog = typeof medicationLogs.$inferSelect;
export type MeditationSession = typeof meditationSessions.$inferSelect;
export type MenstrualCycle = typeof menstrualCycles.$inferSelect;
export type MenstrualCycleSymptom = typeof menstrualCycleSymptoms.$inferSelect;
export type FertilityTracking = typeof fertilityTracking.$inferSelect;
export type PregnancyTracking = typeof pregnancyTracking.$inferSelect;
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
