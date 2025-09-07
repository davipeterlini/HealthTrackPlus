// Use Case - Get User Dashboard Data (Frontend)
import { User } from '../../domain/entities/User';
import { Activity } from '../../domain/entities/Activity';
import { MedicalExam } from '../../domain/entities/MedicalExam';
import { IUserRepository } from '../../domain/interfaces/IUserRepository';
import { IActivityRepository } from '../../domain/interfaces/IActivityRepository';
import { IMedicalExamRepository } from '../../domain/interfaces/IMedicalExamRepository';

export interface DashboardData {
  user: User | null;
  recentActivities: Activity[];
  activityStats: {
    totalCalories: number;
    totalDuration: number;
    totalDistance: number;
    activeDays: number;
  };
  recentExams: MedicalExam[];
  examsNeedingAttention: MedicalExam[];
  achievements: {
    type: string;
    description: string;
    date: Date;
  }[];
}

export class GetUserDashboardDataUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly activityRepository: IActivityRepository,
    private readonly medicalExamRepository: IMedicalExamRepository
  ) {}

  async execute(): Promise<DashboardData> {
    try {
      // Fetch data in parallel for better performance
      const [user, activities, exams] = await Promise.all([
        this.userRepository.getCurrentUser(),
        this.activityRepository.getActivities(),
        this.medicalExamRepository.getExams()
      ]);

      // Process activities data
      const recentActivities = activities
        .sort((a, b) => b.date.getTime() - a.date.getTime())
        .slice(0, 5);

      // Calculate weekly stats
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      
      const weekActivities = activities.filter(
        activity => activity.date >= weekAgo
      );

      const activityStats = {
        totalCalories: weekActivities.reduce((sum, activity) => sum + activity.calories, 0),
        totalDuration: weekActivities.reduce((sum, activity) => sum + activity.duration, 0),
        totalDistance: weekActivities.reduce((sum, activity) => sum + (activity.distance || 0), 0),
        activeDays: new Set(
          weekActivities.map(activity => activity.date.toDateString())
        ).size
      };

      // Process exams data
      const recentExams = exams
        .sort((a, b) => b.date.getTime() - a.date.getTime())
        .slice(0, 3);

      const examsNeedingAttention = exams.filter(exam => exam.needsAttention());

      // Generate achievements
      const achievements = this.generateAchievements(weekActivities, exams);

      return {
        user,
        recentActivities,
        activityStats,
        recentExams,
        examsNeedingAttention,
        achievements
      };
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Return empty state instead of throwing to handle gracefully in UI
      return {
        user: null,
        recentActivities: [],
        activityStats: {
          totalCalories: 0,
          totalDuration: 0,
          totalDistance: 0,
          activeDays: 0
        },
        recentExams: [],
        examsNeedingAttention: [],
        achievements: []
      };
    }
  }

  private generateAchievements(
    weekActivities: Activity[], 
    exams: MedicalExam[]
  ): { type: string; description: string; date: Date }[] {
    const achievements: { type: string; description: string; date: Date }[] = [];

    // Activity achievements
    const totalCalories = weekActivities.reduce((sum, activity) => sum + activity.calories, 0);
    if (totalCalories > 2000) {
      achievements.push({
        type: 'calories',
        description: `Queimou ${totalCalories} calorias esta semana!`,
        date: new Date()
      });
    }

    const activeDays = new Set(
      weekActivities.map(activity => activity.date.toDateString())
    ).size;
    if (activeDays >= 5) {
      achievements.push({
        type: 'consistency',
        description: `Ativo por ${activeDays} dias esta semana!`,
        date: new Date()
      });
    }

    // Long duration activities
    const longActivities = weekActivities.filter(activity => activity.isLongDuration());
    if (longActivities.length > 0) {
      achievements.push({
        type: 'endurance',
        description: `Completou ${longActivities.length} atividade(s) de longa duração!`,
        date: longActivities[0].date
      });
    }

    // Health exam achievements
    const recentNormalExams = exams.filter(
      exam => exam.date >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) && 
              exam.status === 'Normal'
    );
    if (recentNormalExams.length > 0) {
      achievements.push({
        type: 'health',
        description: 'Exames recentes com resultados normais!',
        date: recentNormalExams[0].date
      });
    }

    return achievements.slice(0, 3); // Return top 3 achievements
  }
}