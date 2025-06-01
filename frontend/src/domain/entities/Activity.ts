// Domain Entity - Activity (Frontend)
export class Activity {
  constructor(
    public readonly id: number,
    public readonly userId: number,
    public readonly type: string,
    public readonly name: string,
    public readonly duration: number, // in minutes
    public readonly calories: number,
    public readonly date: Date,
    public readonly distance?: number, // in km
    public readonly steps?: number,
    public readonly heartRate?: number,
    public readonly notes?: string
  ) {}

  // Business logic methods for UI display
  public isCardioActivity(): boolean {
    return ['running', 'cycling', 'swimming', 'walking'].includes(this.type.toLowerCase());
  }

  public isHighIntensity(): boolean {
    return this.heartRate ? this.heartRate > 140 : this.calories / this.duration > 8;
  }

  public getCaloriesPerMinute(): number {
    return this.duration > 0 ? Math.round((this.calories / this.duration) * 10) / 10 : 0;
  }

  public isLongDuration(): boolean {
    return this.duration > 60;
  }

  public getPaceDisplay(): string {
    if (!this.distance || this.duration === 0) return 'N/A';
    const paceMinutesPerKm = this.duration / this.distance;
    const minutes = Math.floor(paceMinutesPerKm);
    const seconds = Math.round((paceMinutesPerKm - minutes) * 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')} min/km`;
  }

  public getIntensityLevel(): 'low' | 'moderate' | 'high' {
    if (this.isHighIntensity()) return 'high';
    if (this.getCaloriesPerMinute() > 5) return 'moderate';
    return 'low';
  }

  public getIntensityColor(): string {
    switch (this.getIntensityLevel()) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'moderate': return 'text-yellow-600 bg-yellow-50';
      default: return 'text-green-600 bg-green-50';
    }
  }

  public getActivityIcon(): string {
    switch (this.type.toLowerCase()) {
      case 'running': return '🏃‍♂️';
      case 'cycling': return '🚴‍♂️';
      case 'swimming': return '🏊‍♂️';
      case 'walking': return '🚶‍♂️';
      case 'yoga': return '🧘‍♀️';
      case 'weightlifting': return '🏋️‍♂️';
      default: return '💪';
    }
  }

  public getDurationDisplay(): string {
    if (this.duration < 60) {
      return `${this.duration} min`;
    }
    const hours = Math.floor(this.duration / 60);
    const minutes = this.duration % 60;
    return minutes > 0 ? `${hours}h ${minutes}min` : `${hours}h`;
  }

  public getDistanceDisplay(): string {
    if (!this.distance) return 'N/A';
    return this.distance < 1 
      ? `${Math.round(this.distance * 1000)}m`
      : `${this.distance.toFixed(1)}km`;
  }

  public getFormattedDate(): string {
    return this.date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  public getTimeOfDay(): string {
    return this.date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  // Factory method for creating from API response
  public static fromApiResponse(data: any): Activity {
    return new Activity(
      data.id,
      data.userId,
      data.activityType || data.type,
      data.name || data.activityType,
      data.minutes || data.duration,
      data.calories,
      new Date(data.date),
      data.distance ? data.distance / 1000 : undefined, // Convert to km if in meters
      data.steps,
      data.heartRate,
      data.notes
    );
  }
}