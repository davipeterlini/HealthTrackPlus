import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import multer from "multer";
import path from "path";
import { randomBytes } from "crypto";

// Configure multer for file uploads
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(process.cwd(), "uploads"));
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = `${Date.now()}-${randomBytes(6).toString("hex")}`;
      cb(null, `${uniqueSuffix}-${file.originalname}`);
    },
  }),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max file size
  },
  fileFilter: (req, file, cb) => {
    // Accept only PDFs and images
    if (
      file.mimetype === "application/pdf" ||
      file.mimetype.startsWith("image/")
    ) {
      cb(null, true);
    } else {
      cb(new Error("File type not supported. Please upload PDF or image files.") as any);
    }
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication
  setupAuth(app);

  // Medical exam routes
  app.get("/api/exams", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    const userId = (req.user as Express.User).id;
    const exams = await storage.getMedicalExams(userId);
    res.json(exams);
  });
  
  app.get("/api/exams/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    const examId = parseInt(req.params.id);
    if (isNaN(examId)) {
      return res.status(400).json({ message: "Invalid exam ID" });
    }
    
    const exam = await storage.getMedicalExam(examId);
    if (!exam) {
      return res.status(404).json({ message: "Exam not found" });
    }
    
    const userId = (req.user as Express.User).id;
    if (exam.userId !== userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    
    res.json(exam);
  });
  
  app.post("/api/exams", upload.single("file"), async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const { name, type } = req.body;
      const userId = (req.user as Express.User).id;
      const file = req.file;
      
      if (!name || !type || !file) {
        return res.status(400).json({ message: "Name, type, and file are required" });
      }
      
      const exam = await storage.createMedicalExam({
        userId,
        name,
        date: new Date(),
        fileUrl: `/uploads/${file.filename}`,
        type,
        status: "Uploaded",
        results: null,
      });
      
      res.status(201).json(exam);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to upload exam" });
    }
  });
  
  // Activity routes
  app.get("/api/activities", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    const userId = (req.user as Express.User).id;
    const activities = await storage.getActivities(userId);
    res.json(activities);
  });
  
  app.post("/api/activities", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const { steps, calories, minutes } = req.body;
      const userId = (req.user as Express.User).id;
      
      if (!steps || !calories || !minutes) {
        return res.status(400).json({ message: "Steps, calories, and minutes are required" });
      }
      
      const activity = await storage.createActivity({
        userId,
        date: new Date(),
        steps: parseInt(steps),
        calories: parseInt(calories),
        minutes: parseInt(minutes),
      });
      
      res.status(201).json(activity);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to record activity" });
    }
  });
  
  // Sleep routes
  app.get("/api/sleep", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    const userId = (req.user as Express.User).id;
    const sleepRecords = await storage.getSleepRecords(userId);
    res.json(sleepRecords);
  });
  
  app.post("/api/sleep", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const { hours, quality, deepSleep, lightSleep, rem } = req.body;
      const userId = (req.user as Express.User).id;
      
      if (!hours || !quality || !deepSleep || !lightSleep || !rem) {
        return res.status(400).json({ message: "All sleep data fields are required" });
      }
      
      const sleepRecord = await storage.createSleepRecord({
        userId,
        date: new Date(),
        hours: parseFloat(hours),
        quality,
        deepSleep: parseFloat(deepSleep),
        lightSleep: parseFloat(lightSleep),
        rem: parseFloat(rem),
      });
      
      res.status(201).json(sleepRecord);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to record sleep" });
    }
  });
  
  // Water intake routes
  app.get("/api/water", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    const userId = (req.user as Express.User).id;
    const waterIntakeRecords = await storage.getWaterIntake(userId);
    res.json(waterIntakeRecords);
  });
  
  app.post("/api/water", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const { amount } = req.body;
      const userId = (req.user as Express.User).id;
      
      if (!amount) {
        return res.status(400).json({ message: "Amount is required" });
      }
      
      const waterIntakeRecord = await storage.createWaterIntake({
        userId,
        date: new Date(),
        amount: parseInt(amount),
      });
      
      res.status(201).json(waterIntakeRecord);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to record water intake" });
    }
  });
  
  // Meal routes
  app.get("/api/meals", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    const userId = (req.user as Express.User).id;
    const meals = await storage.getMeals(userId);
    res.json(meals);
  });
  
  app.post("/api/meals", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const { mealType, description, calories, carbs, protein, fat } = req.body;
      const userId = (req.user as Express.User).id;
      
      if (!mealType || !description) {
        return res.status(400).json({ message: "Meal type and description are required" });
      }
      
      const meal = await storage.createMeal({
        userId,
        date: new Date(),
        mealType,
        description,
        calories: calories ? parseInt(calories) : null,
        carbs: carbs ? parseInt(carbs) : null,
        protein: protein ? parseInt(protein) : null,
        fat: fat ? parseInt(fat) : null,
      });
      
      res.status(201).json(meal);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to record meal" });
    }
  });
  
  // Video routes
  app.get("/api/videos", async (req, res) => {
    const videos = await storage.getVideos();
    res.json(videos);
  });
  
  app.get("/api/videos/:id", async (req, res) => {
    const videoId = parseInt(req.params.id);
    if (isNaN(videoId)) {
      return res.status(400).json({ message: "Invalid video ID" });
    }
    
    const video = await storage.getVideo(videoId);
    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }
    
    res.json(video);
  });
  
  // Video progress routes
  app.get("/api/video-progress/:videoId", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    const userId = (req.user as Express.User).id;
    const videoId = parseInt(req.params.videoId);
    
    if (isNaN(videoId)) {
      return res.status(400).json({ message: "Invalid video ID" });
    }
    
    const videoProgress = await storage.getVideoProgress(userId, videoId);
    if (!videoProgress) {
      return res.json({ progress: 0 });
    }
    
    res.json(videoProgress);
  });
  
  app.post("/api/video-progress", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const { videoId, progress } = req.body;
      const userId = (req.user as Express.User).id;
      
      if (!videoId || progress === undefined) {
        return res.status(400).json({ message: "Video ID and progress are required" });
      }
      
      const videoProgress = await storage.createOrUpdateVideoProgress({
        userId,
        videoId: parseInt(videoId),
        progress: parseInt(progress),
        lastWatched: new Date(),
      });
      
      res.status(201).json(videoProgress);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to update video progress" });
    }
  });
  
  // Course track routes
  app.get("/api/course-tracks", async (req, res) => {
    const courseTracks = await storage.getCourseTracks();
    res.json(courseTracks);
  });
  
  app.get("/api/course-tracks/:id", async (req, res) => {
    const trackId = parseInt(req.params.id);
    if (isNaN(trackId)) {
      return res.status(400).json({ message: "Invalid track ID" });
    }
    
    const track = await storage.getCourseTrack(trackId);
    if (!track) {
      return res.status(404).json({ message: "Course track not found" });
    }
    
    res.json(track);
  });
  
  app.get("/api/course-tracks/:id/videos", async (req, res) => {
    const trackId = parseInt(req.params.id);
    if (isNaN(trackId)) {
      return res.status(400).json({ message: "Invalid track ID" });
    }
    
    const trackVideos = await storage.getTrackVideos(trackId);
    
    // Get full video information for each track video
    const videos = await Promise.all(
      trackVideos.map(async (trackVideo) => {
        const video = await storage.getVideo(trackVideo.videoId);
        return {
          ...video,
          order: trackVideo.order,
        };
      })
    );
    
    res.json(videos);
  });

  // Add test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is running!' });
});

const httpServer = createServer(app);

  return httpServer;
}
