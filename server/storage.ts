import { 
  users, activities, medicalExams, sleepRecords, 
  waterIntake, meals, videos, videoProgress, courseTracks, trackVideos,
  type User, type InsertUser, type MedicalExam, type Activity,
  type SleepRecord, type WaterIntakeRecord, type Meal, type Video,
  type VideoProgress, type CourseTrack, type TrackVideo
} from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Medical exam methods
  getMedicalExams(userId: number): Promise<MedicalExam[]>;
  getMedicalExam(id: number): Promise<MedicalExam | undefined>;
  createMedicalExam(exam: Omit<MedicalExam, 'id'>): Promise<MedicalExam>;
  
  // Activity methods
  getActivities(userId: number): Promise<Activity[]>;
  createActivity(activity: Omit<Activity, 'id'>): Promise<Activity>;
  
  // Sleep methods
  getSleepRecords(userId: number): Promise<SleepRecord[]>;
  createSleepRecord(sleepRecord: Omit<SleepRecord, 'id'>): Promise<SleepRecord>;
  
  // Water intake methods
  getWaterIntake(userId: number): Promise<WaterIntakeRecord[]>;
  createWaterIntake(waterIntake: Omit<WaterIntakeRecord, 'id'>): Promise<WaterIntakeRecord>;
  
  // Meal methods
  getMeals(userId: number): Promise<Meal[]>;
  createMeal(meal: Omit<Meal, 'id'>): Promise<Meal>;
  
  // Video methods
  getVideos(): Promise<Video[]>;
  getVideo(id: number): Promise<Video | undefined>;
  
  // Video progress methods
  getVideoProgress(userId: number, videoId: number): Promise<VideoProgress | undefined>;
  createOrUpdateVideoProgress(progress: Omit<VideoProgress, 'id'>): Promise<VideoProgress>;
  
  // Course track methods
  getCourseTracks(): Promise<CourseTrack[]>;
  getCourseTrack(id: number): Promise<CourseTrack | undefined>;
  
  // Track video methods
  getTrackVideos(trackId: number): Promise<TrackVideo[]>;
  
  // Session store
  sessionStore: session.SessionStore;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private medicalExams: Map<number, MedicalExam>;
  private activities: Map<number, Activity>;
  private sleepRecords: Map<number, SleepRecord>;
  private waterIntakeRecords: Map<number, WaterIntakeRecord>;
  private mealRecords: Map<number, Meal>;
  private videos: Map<number, Video>;
  private videoProgressRecords: Map<number, VideoProgress>;
  private courseTracks: Map<number, CourseTrack>;
  private trackVideos: Map<number, TrackVideo>;
  
  currentUserId: number;
  currentMedicalExamId: number;
  currentActivityId: number;
  currentSleepRecordId: number;
  currentWaterIntakeId: number;
  currentMealId: number;
  currentVideoId: number;
  currentVideoProgressId: number;
  currentCourseTrackId: number;
  currentTrackVideoId: number;
  sessionStore: session.SessionStore;

  constructor() {
    this.users = new Map();
    this.medicalExams = new Map();
    this.activities = new Map();
    this.sleepRecords = new Map();
    this.waterIntakeRecords = new Map();
    this.mealRecords = new Map();
    this.videos = new Map();
    this.videoProgressRecords = new Map();
    this.courseTracks = new Map();
    this.trackVideos = new Map();
    
    this.currentUserId = 1;
    this.currentMedicalExamId = 1;
    this.currentActivityId = 1;
    this.currentSleepRecordId = 1;
    this.currentWaterIntakeId = 1;
    this.currentMealId = 1;
    this.currentVideoId = 1;
    this.currentVideoProgressId = 1;
    this.currentCourseTrackId = 1;
    this.currentTrackVideoId = 1;
    
    // Initialize sample videos
    this.initSampleVideos();
    this.initSampleCourseTracks();
    
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    });
  }

  // Initialize some sample videos for the application
  private initSampleVideos() {
    const sampleVideos: Omit<Video, 'id'>[] = [
      {
        title: 'Stress Reduction Techniques',
        duration: '18:32',
        category: 'Mental Health',
        description: 'Learn effective techniques to reduce stress in daily life',
        thumbnailUrl: ''
      },
      {
        title: 'Nutrition Basics for Wellness',
        duration: '24:15',
        category: 'Nutrition',
        description: 'Fundamental nutrition principles for overall wellness',
        thumbnailUrl: ''
      },
      {
        title: 'Gentle Morning Yoga',
        duration: '15:45',
        category: 'Exercise',
        description: 'Start your day with gentle yoga practices',
        thumbnailUrl: ''
      },
      {
        title: 'Understanding Inflammation',
        duration: '22:10', 
        category: 'Medical',
        description: 'Learn about inflammation and its impact on health',
        thumbnailUrl: ''
      },
      {
        title: 'Sleep Optimization',
        duration: '19:30',
        category: 'Sleep',
        description: 'Improve your sleep quality with these evidence-based tips',
        thumbnailUrl: ''
      }
    ];
    
    sampleVideos.forEach(video => {
      const id = this.currentVideoId++;
      this.videos.set(id, { ...video, id });
    });
  }
  
  // Initialize sample course tracks
  private initSampleCourseTracks() {
    const sampleTracks: Omit<CourseTrack, 'id'>[] = [
      {
        title: 'Foundations of Holistic Health',
        description: 'Comprehensive introduction to integrative medicine principles',
        videoCount: 5
      },
      {
        title: 'Nutrition Masterclass',
        description: 'Deep dive into nutrition for optimal health',
        videoCount: 8
      }
    ];
    
    sampleTracks.forEach(track => {
      const id = this.currentCourseTrackId++;
      this.courseTracks.set(id, { ...track, id });
    });
    
    // Create track videos relationships
    const trackVideos: Omit<TrackVideo, 'id'>[] = [
      { trackId: 1, videoId: 1, order: 1 },
      { trackId: 1, videoId: 2, order: 2 },
      { trackId: 1, videoId: 3, order: 3 },
      { trackId: 1, videoId: 4, order: 4 },
      { trackId: 1, videoId: 5, order: 5 }
    ];
    
    trackVideos.forEach(trackVideo => {
      const id = this.currentTrackVideoId++;
      this.trackVideos.set(id, { ...trackVideo, id });
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const now = new Date();
    const user: User = { 
      ...insertUser, 
      id, 
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(insertUser.username)}&background=random`, 
      createdAt: now 
    };
    this.users.set(id, user);
    return user;
  }
  
  // Medical exam methods
  async getMedicalExams(userId: number): Promise<MedicalExam[]> {
    return Array.from(this.medicalExams.values()).filter(
      (exam) => exam.userId === userId,
    );
  }
  
  async getMedicalExam(id: number): Promise<MedicalExam | undefined> {
    return this.medicalExams.get(id);
  }
  
  async createMedicalExam(exam: Omit<MedicalExam, 'id'>): Promise<MedicalExam> {
    const id = this.currentMedicalExamId++;
    const medicalExam: MedicalExam = { ...exam, id };
    this.medicalExams.set(id, medicalExam);
    return medicalExam;
  }
  
  // Activity methods
  async getActivities(userId: number): Promise<Activity[]> {
    return Array.from(this.activities.values())
      .filter((activity) => activity.userId === userId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }
  
  async createActivity(activity: Omit<Activity, 'id'>): Promise<Activity> {
    const id = this.currentActivityId++;
    const newActivity: Activity = { ...activity, id };
    this.activities.set(id, newActivity);
    return newActivity;
  }
  
  // Sleep methods
  async getSleepRecords(userId: number): Promise<SleepRecord[]> {
    return Array.from(this.sleepRecords.values())
      .filter((record) => record.userId === userId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }
  
  async createSleepRecord(sleepRecord: Omit<SleepRecord, 'id'>): Promise<SleepRecord> {
    const id = this.currentSleepRecordId++;
    const newSleepRecord: SleepRecord = { ...sleepRecord, id };
    this.sleepRecords.set(id, newSleepRecord);
    return newSleepRecord;
  }
  
  // Water intake methods
  async getWaterIntake(userId: number): Promise<WaterIntakeRecord[]> {
    return Array.from(this.waterIntakeRecords.values())
      .filter((record) => record.userId === userId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }
  
  async createWaterIntake(waterIntakeRecord: Omit<WaterIntakeRecord, 'id'>): Promise<WaterIntakeRecord> {
    const id = this.currentWaterIntakeId++;
    const newWaterIntakeRecord: WaterIntakeRecord = { ...waterIntakeRecord, id };
    this.waterIntakeRecords.set(id, newWaterIntakeRecord);
    return newWaterIntakeRecord;
  }
  
  // Meal methods
  async getMeals(userId: number): Promise<Meal[]> {
    return Array.from(this.mealRecords.values())
      .filter((record) => record.userId === userId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }
  
  async createMeal(meal: Omit<Meal, 'id'>): Promise<Meal> {
    const id = this.currentMealId++;
    const newMeal: Meal = { ...meal, id };
    this.mealRecords.set(id, newMeal);
    return newMeal;
  }
  
  // Video methods
  async getVideos(): Promise<Video[]> {
    return Array.from(this.videos.values());
  }
  
  async getVideo(id: number): Promise<Video | undefined> {
    return this.videos.get(id);
  }
  
  // Video progress methods
  async getVideoProgress(userId: number, videoId: number): Promise<VideoProgress | undefined> {
    return Array.from(this.videoProgressRecords.values()).find(
      (progress) => progress.userId === userId && progress.videoId === videoId,
    );
  }
  
  async createOrUpdateVideoProgress(progress: Omit<VideoProgress, 'id'>): Promise<VideoProgress> {
    const existingProgress = await this.getVideoProgress(progress.userId, progress.videoId);
    
    if (existingProgress) {
      const updatedProgress: VideoProgress = { ...existingProgress, ...progress };
      this.videoProgressRecords.set(existingProgress.id, updatedProgress);
      return updatedProgress;
    }
    
    const id = this.currentVideoProgressId++;
    const newProgress: VideoProgress = { ...progress, id };
    this.videoProgressRecords.set(id, newProgress);
    return newProgress;
  }
  
  // Course track methods
  async getCourseTracks(): Promise<CourseTrack[]> {
    return Array.from(this.courseTracks.values());
  }
  
  async getCourseTrack(id: number): Promise<CourseTrack | undefined> {
    return this.courseTracks.get(id);
  }
  
  // Track video methods
  async getTrackVideos(trackId: number): Promise<TrackVideo[]> {
    return Array.from(this.trackVideos.values())
      .filter((trackVideo) => trackVideo.trackId === trackId)
      .sort((a, b) => a.order - b.order);
  }
}

export const storage = new MemStorage();
