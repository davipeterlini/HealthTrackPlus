// Domain Entity - Activity
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

  // Business logic methods
  public isCardioActivity(): boolean {
    return ['running', 'cycling', 'swimming', 'walking'].includes(this.type.toLowerCase());
  }

  public isHighIntensity(): boolean {
    return this.heartRate ? this.heartRate > 140 : this.calories / this.duration > 8;
  }

  public getCaloriesPerMinute(): number {
    return this.duration > 0 ? this.calories / this.duration : 0;
  }

  public isLongDuration(): boolean {
    return this.duration > 60;
  }

  public hasGoodPace(): boolean {
    if (!this.distance || this.duration === 0) return false;
    const paceMinutesPerKm = this.duration / this.distance;
    return paceMinutesPerKm < 7; // Less than 7 minutes per km is considered good
  }

  // Factory method
  public static create(
    userId: number,
    type: string,
    name: string,
    duration: number,
    calories: number,
    date: Date = new Date(),
    distance?: number,
    steps?: number,
    heartRate?: number,
    notes?: string
  ): Omit<Activity, 'id'> {
    return {
      userId,
      type,
      name,
      duration,
      calories,
      date,
      distance,
      steps,
      heartRate,
      notes,
      isCardioActivity: () => ['running', 'cycling', 'swimming', 'walking'].includes(type.toLowerCase()),
      isHighIntensity: () => heartRate ? heartRate > 140 : calories / duration > 8,
      getCaloriesPerMinute: () => duration > 0 ? calories / duration : 0,
      isLongDuration: () => duration > 60,
      hasGoodPace: () => {
        if (!distance || duration === 0) return false;
        const paceMinutesPerKm = duration / distance;
        return paceMinutesPerKm < 7;
      }
    };
  }
}