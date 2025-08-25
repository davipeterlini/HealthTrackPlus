// Função para adicionar ao arquivo storage.ts

/*
// Inicializa atividades de exemplo para demonstração
private initSampleActivities() {
  // Mock de usuário se não existir
  if (!this.users.has(1)) {
    this.users.set(1, {
      id: 1,
      username: "usuario_teste",
      email: "teste@exemplo.com",
      password: "senha_criptografada",
      name: "Usuário Teste",
      avatar: null,
      createdAt: new Date()
    });
  }
  
  // Tipos de atividades para variedade
  const activityTypes = ["walking", "running", "cycling", "swimming", "yoga", "gym", "hiking"];
  
  // Criar atividades para os últimos 30 dias
  const today = new Date();
  
  for (let i = 0; i < 25; i++) {
    const activityDate = new Date();
    activityDate.setDate(today.getDate() - i);
    
    // Gerar um tipo de atividade aleatório
    const randomType = activityTypes[Math.floor(Math.random() * activityTypes.length)];
    
    // Valores aleatórios para cada atividade
    const stepsCount = Math.floor(Math.random() * 10000) + 2000; // Entre 2000 e 12000 passos
    const durationMinutes = Math.floor(Math.random() * 60) + 30; // Entre 30 e 90 minutos
    const caloriesBurned = Math.floor(Math.random() * 500) + 150; // Entre 150 e 650 calorias
    const distanceValue = Math.floor(Math.random() * 10) + 2; // Entre 2 e 12 km
    
    // Criar novas atividades
    const newActivity: Activity = {
      id: this.currentActivityId++,
      userId: 1,
      date: activityDate,
      startTime: null,
      endTime: null,
      activityType: randomType,
      steps: stepsCount,
      distance: distanceValue,
      calories: caloriesBurned,
      minutes: durationMinutes,
      heartRate: Math.floor(Math.random() * 40) + 120, // Entre 120 e 160 bpm
      heartRateZones: null,
      elevationGain: randomType === "hiking" ? Math.floor(Math.random() * 500) + 100 : null,
      elevationLoss: randomType === "hiking" ? Math.floor(Math.random() * 500) + 100 : null,
      avgPace: null,
      maxPace: null,
      intensity: ["low", "medium", "high"][Math.floor(Math.random() * 3)],
      cadence: null,
      strideLength: null,
      routeData: null,
      gpsPoints: null,
      activityImage: null,
      feeling: ["great", "good", "ok", "bad"][Math.floor(Math.random() * 4)],
      weatherCondition: ["sunny", "cloudy", "rainy"][Math.floor(Math.random() * 3)],
      temperature: Math.floor(Math.random() * 20) + 15, // Entre 15 e 35 graus
      humidity: Math.floor(Math.random() * 50) + 30, // Entre 30 e 80%
      terrainType: randomType === "hiking" || randomType === "running" ? 
        ["flat", "hilly", "mixed", "trail"][Math.floor(Math.random() * 4)] : null,
      equipmentUsed: null,
      notes: `${randomType.charAt(0).toUpperCase() + randomType.slice(1)} session on ${activityDate.toDateString()}`,
      source: "manual",
      isRealTime: false,
      achievements: null
    };
    
    this.activities.set(newActivity.id, newActivity);
  }
}
*/