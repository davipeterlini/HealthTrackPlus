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

  // Dashboard routes
  app.get("/api/dashboard", async (req, res) => {
    if (!req.isAuthenticated()) {
      // Para desenvolvimento, permita acesso sem autenticação usando userId fixo
      const stats = await storage.getDashboardStats(1);
      return res.json(stats);
    }
    
    const userId = (req.user as Express.User).id;
    const stats = await storage.getDashboardStats(userId);
    res.json(stats);
  });

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
    // Para desenvolvimento, permita acesso sem autenticação usando userId fixo
    let userId = 1;
    
    if (req.isAuthenticated()) {
      userId = (req.user as Express.User).id;
    }
    
    try {
      const { name, type, date } = req.body;
      const file = req.file;
      
      if (!name || !type) {
        return res.status(400).json({ message: "Name and type are required" });
      }
      
      const exam = await storage.createMedicalExam({
        userId,
        name,
        date: date ? new Date(date) : new Date(),
        fileUrl: file ? `/uploads/${file.filename}` : null,
        type,
        status: "Analyzing",
        results: null,
        aiAnalysis: null,
        anomalies: null,
        riskLevel: null,
        aiProcessed: false
      });
      
      // Responder imediatamente com o exame criado
      res.status(201).json(exam);
      
      // Iniciar análise automática em background
      setTimeout(async () => {
        try {
          console.log(`Iniciando análise do exame ${exam.id}...`);
          
          // Preparar resultado da análise AI
          let aiAnalysis = null;
          let examStatus = "Normal";
          let examRiskLevel = "normal";
          
          // Verificar se existe arquivo para análise
          if (file && exam.fileUrl) {
            console.log(`Analisando arquivo: ${exam.fileUrl}`);
            
            // Extrair texto do PDF/imagem (simulado aqui)
            // Em uma implementação real, usaria OCR para imagens ou parser para PDFs
            let extractedText = "";
            
            // Gerar resultados baseados no tipo de exame
            if (type.toLowerCase().includes('blood') || type.toLowerCase().includes('sangue')) {
              extractedText = "Hemoglobina: 14.2 g/dL (Ref: 13.5-17.5)\nGlicose: 98 mg/dL (Ref: 70-99)\nColesterol total: 185 mg/dL (Ref: <200)\nHDL: 52 mg/dL (Ref: >40)\nLDL: 115 mg/dL (Ref: <130)\nTriglicerídeos: 150 mg/dL (Ref: <150)";
              
              // Análise AI do conteúdo extraído
              aiAnalysis = {
                summary: "A análise do exame de sangue indica resultados próximos aos limites superiores normais, com alguns pontos de atenção.",
                details: {
                  bloodGlucose: {
                    value: 98,
                    status: "normal",
                    reference: "70-99 mg/dL",
                    attention: "Próximo ao limite superior"
                  },
                  cholesterol: {
                    total: {
                      value: 185,
                      status: "normal",
                      reference: "<200 mg/dL"
                    },
                    hdl: {
                      value: 52,
                      status: "normal",
                      reference: ">40 mg/dL"
                    },
                    ldl: {
                      value: 115,
                      status: "normal",
                      reference: "<130 mg/dL"
                    },
                    triglycerides: {
                      value: 150,
                      status: "attention",
                      reference: "<150 mg/dL",
                      note: "No limite superior da referência"
                    }
                  },
                  hemoglobin: {
                    value: 14.2,
                    status: "normal",
                    reference: "13.5-17.5 g/dL"
                  }
                },
                timeSeriesData: Array.from({ length: 7 }, (_, i) => ({
                  day: `Day ${i+1}`,
                  value: 95 + Math.floor(Math.random() * 10 - 5)
                })),
                comparisonData: [
                  { name: "Seu Valor", value: 98 },
                  { name: "Média Pop.", value: 88 },
                  { name: "Ref. Min", value: 70 },
                  { name: "Ref. Max", value: 99 }
                ],
                distributionData: [
                  { name: "Baixo", value: 15 },
                  { name: "Normal", value: 70 },
                  { name: "Alto", value: 15 }
                ],
                correlationData: Array.from({ length: 10 }, () => ({
                  x: 80 + Math.floor(Math.random() * 40),
                  y: 120 + Math.floor(Math.random() * 40),
                  z: Math.floor(Math.random() * 100)
                })),
                recommendations: [
                  "Considere reduzir a ingestão de carboidratos refinados",
                  "Aumente a atividade física para pelo menos 30 minutos diários",
                  "Monitore seus níveis de triglicerídeos em 3 meses"
                ]
              };
              
              examStatus = "Attention";
              examRiskLevel = "attention";
            } else if (type.toLowerCase().includes('cardiac') || type.toLowerCase().includes('cardio')) {
              extractedText = "Pressão arterial: 135/85 mmHg\nFrequência cardíaca: 72 bpm\nECG: Ritmo sinusal normal";
              
              aiAnalysis = {
                summary: "Avaliação cardíaca apresenta leve elevação da pressão arterial, mas demais parâmetros normais.",
                details: {
                  bloodPressure: {
                    systolic: {
                      value: 135,
                      status: "attention",
                      reference: "<120 mmHg",
                    },
                    diastolic: {
                      value: 85,
                      status: "attention",
                      reference: "<80 mmHg",
                    }
                  },
                  heartRate: {
                    value: 72,
                    status: "normal",
                    reference: "60-100 bpm"
                  },
                  ecg: {
                    finding: "Ritmo sinusal normal",
                    status: "normal"
                  }
                },
                timeSeriesData: Array.from({ length: 7 }, (_, i) => ({
                  day: `Day ${i+1}`,
                  value: 130 + Math.floor(Math.random() * 10 - 5)
                })),
                recommendations: [
                  "Monitorar pressão arterial regularmente",
                  "Reduzir a ingestão de sódio na dieta",
                  "Praticar atividades físicas aeróbicas regularmente"
                ]
              };
              
              examStatus = "Attention";
              examRiskLevel = "attention";
            } else {
              // Para outros tipos de exame
              aiAnalysis = {
                summary: "A análise do exame indica resultados dentro dos parâmetros normais, com algumas observações.",
                details: {
                  general: {
                    status: "normal",
                    findings: "Sem alterações significativas"
                  }
                },
                recommendations: [
                  "Mantenha uma dieta balanceada rica em frutas e vegetais",
                  "Continue praticando exercícios físicos regularmente",
                  "Considere aumentar a ingestão de água diária"
                ]
              };
              
              examStatus = "Normal";
              examRiskLevel = "normal";
            }
          } else {
            // Sem arquivo para análise, fornecer análise genérica
            aiAnalysis = {
              summary: "Não foi possível realizar análise detalhada por falta de arquivo anexo.",
              details: {
                notice: {
                  status: "attention",
                  message: "Recomendamos anexar os resultados do exame para uma análise completa."
                }
              },
              recommendations: [
                "Anexar arquivo do exame para análise completa",
                "Agendar consulta com seu médico para revisão dos resultados"
              ]
            };
            
            examStatus = "Incomplete";
            examRiskLevel = "attention";
          }
          
          // Atualizar o exame com os resultados da análise
          const updatedExam = await storage.updateMedicalExam(exam.id, {
            status: examStatus,
            aiAnalysis,
            riskLevel: examRiskLevel,
            aiProcessed: true
          });
          
          // Gerar insights de saúde baseados na análise
          const categories = ["Cardiovascular", "Nutrition", "Metabolism"];
          
          for (const category of categories) {
            let title = "";
            let description = "";
            let recommendation = "";
            let severity = examRiskLevel; // Usar o risco global do exame como base
            let data = {};
            
            switch (category) {
              case "Cardiovascular":
                if (type.toLowerCase().includes('cardiac') || type.toLowerCase().includes('cardio')) {
                  // Para exames cardíacos
                  if (aiAnalysis?.details?.bloodPressure) {
                    const systolic = aiAnalysis.details.bloodPressure.systolic;
                    const diastolic = aiAnalysis.details.bloodPressure.diastolic;
                    
                    if (systolic.status === "attention" || diastolic.status === "attention") {
                      title = "Atenção à Pressão Arterial";
                      description = "Sua pressão arterial está levemente elevada, requerendo monitoramento.";
                      recommendation = "Reduza o consumo de sal e pratique atividades físicas regularmente.";
                      severity = "attention";
                    } else {
                      title = "Saúde Cardiovascular Adequada";
                      description = "Seus parâmetros cardíacos estão em níveis adequados.";
                      recommendation = "Continue com bons hábitos para manter a saúde cardíaca.";
                      severity = "normal";
                    }
                    
                    data = {
                      bloodPressure: {
                        systolic: aiAnalysis.details.bloodPressure.systolic.value,
                        diastolic: aiAnalysis.details.bloodPressure.diastolic.value,
                        status: severity
                      }
                    };
                  } else {
                    title = "Monitoramento Cardíaco";
                    description = "Acompanhamento regular de seus indicadores cardiovasculares.";
                    recommendation = "Mantenha o controle regular da pressão arterial e frequência cardíaca.";
                    severity = "normal";
                    data = {};
                  }
                } else if (aiAnalysis?.details?.cholesterol) {
                  // Para exames de sangue com colesterol
                  const cholesterol = aiAnalysis.details.cholesterol;
                  
                  if (cholesterol.total?.status === "attention" || 
                      cholesterol.ldl?.status === "attention" ||
                      cholesterol.triglycerides?.status === "attention") {
                    title = "Monitoramento de Lipídios";
                    description = "Seus níveis de colesterol estão próximos dos limites recomendados.";
                    recommendation = "Considere reduzir alimentos processados e aumentar o consumo de fibras.";
                    severity = "attention";
                  } else {
                    title = "Perfil Lipídico Saudável";
                    description = "Seus níveis de colesterol estão dentro dos parâmetros recomendados.";
                    recommendation = "Continue com uma alimentação balanceada e exercícios regulares.";
                    severity = "normal";
                  }
                  
                  data = {
                    cholesterol: aiAnalysis.details.cholesterol
                  };
                } else {
                  title = "Saúde Cardiovascular";
                  description = "Monitore regularmente seus indicadores cardíacos.";
                  recommendation = "Pratique exercícios físicos e mantenha uma alimentação balanceada.";
                  severity = "normal";
                  data = {};
                }
                break;
              case "Nutrition":
                if (aiAnalysis?.details?.cholesterol || aiAnalysis?.details?.bloodGlucose) {
                  let nutritionalIssues = [];
                  
                  if (aiAnalysis.details.cholesterol?.triglycerides?.status === "attention") {
                    nutritionalIssues.push("triglicerídeos");
                  }
                  
                  if (aiAnalysis.details.bloodGlucose?.status === "attention") {
                    nutritionalIssues.push("glicemia");
                  }
                  
                  if (nutritionalIssues.length > 0) {
                    title = "Atenção Nutricional";
                    description = `Seus marcadores de ${nutritionalIssues.join(" e ")} merecem atenção.`;
                    recommendation = "Reduza o consumo de carboidratos refinados e aumente o consumo de vegetais.";
                    severity = "attention";
                  } else {
                    title = "Nutrição Adequada";
                    description = "Seus marcadores nutricionais apresentam bom equilíbrio.";
                    recommendation = "Mantenha uma dieta variada e rica em nutrientes essenciais.";
                    severity = "normal";
                  }
                  
                  data = {
                    markers: {
                      cholesterol: aiAnalysis.details.cholesterol?.total?.value,
                      glucose: aiAnalysis.details.bloodGlucose?.value
                    }
                  };
                } else {
                  title = "Acompanhamento Nutricional";
                  description = "Acompanhamento contínuo do seu perfil nutricional.";
                  recommendation = "Mantenha uma dieta equilibrada com todos os grupos alimentares.";
                  severity = "normal";
                  data = {};
                }
                break;
              case "Metabolism":
                if (aiAnalysis?.details?.bloodGlucose) {
                  const glucose = aiAnalysis.details.bloodGlucose;
                  
                  if (glucose.status === "attention" || glucose.attention) {
                    title = "Atenção ao Metabolismo da Glicose";
                    description = "Seus níveis de glicose estão próximos dos limites superiores.";
                    recommendation = "Considere reduzir o consumo de açúcares e carboidratos refinados.";
                    severity = "attention";
                  } else {
                    title = "Metabolismo Saudável";
                    description = "Seus níveis de glicose estão dentro dos parâmetros normais.";
                    recommendation = "Mantenha hábitos saudáveis para conservar seu equilíbrio metabólico.";
                    severity = "normal";
                  }
                  
                  data = {
                    glucose: aiAnalysis.details.bloodGlucose
                  };
                } else {
                  title = "Acompanhamento Metabólico";
                  description = "Monitoramento regular do seu equilíbrio metabólico.";
                  recommendation = "Mantenha uma rotina de atividades físicas e alimentação balanceada.";
                  severity = "normal";
                  data = {};
                }
                break;
            }
            
            // Criar o insight no banco
            await storage.createHealthInsight({
              userId,
              examId: exam.id,
              date: new Date(),
              category,
              title,
              description,
              recommendation,
              severity,
              status: "active",
              aiGenerated: true,
              data: JSON.stringify(data)
            });
          }
          
          console.log(`Auto-análise completa para o exame ${exam.id}`);
        } catch (error) {
          console.error(`Erro na auto-análise do exame ${exam.id}:`, error);
        }
      }, 3000); // Aguardar 3 segundos para simular processamento
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to upload exam" });
    }
  });
  
  // Rota para análise de exame com IA
  app.post("/api/exams/:id/analyze", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    const examId = parseInt(req.params.id);
    if (isNaN(examId)) {
      return res.status(400).json({ message: "Invalid exam ID" });
    }
    
    try {
      // Buscar o exame
      const exam = await storage.getMedicalExam(examId);
      if (!exam) {
        return res.status(404).json({ message: "Exam not found" });
      }
      
      const userId = (req.user as Express.User).id;
      if (exam.userId !== userId) {
        return res.status(403).json({ message: "Unauthorized" });
      }
      
      // Simular análise de IA
      // Na implementação real, aqui chamaria uma API de IA externa
      const aiAnalysis = {
        summary: "A análise do exame indica resultados dentro dos parâmetros normais, com algumas observações.",
        details: {
          bloodGlucose: {
            value: 95,
            status: "normal",
            reference: "70-99 mg/dL"
          },
          cholesterol: {
            total: {
              value: 180,
              status: "normal",
              reference: "<200 mg/dL"
            },
            hdl: {
              value: 55,
              status: "normal",
              reference: ">40 mg/dL"
            },
            ldl: {
              value: 110,
              status: "normal",
              reference: "<130 mg/dL"
            }
          },
          hemoglobin: {
            value: 14.5,
            status: "normal",
            reference: "13.5-17.5 g/dL"
          }
        },
        recommendations: [
          "Manter alimentação balanceada e prática regular de exercícios",
          "Reduzir o consumo de gorduras saturadas para melhorar os níveis de colesterol",
          "Continuar com a rotina de exames periódicos"
        ]
      };
      
      const anomalies = false;
      const riskLevel = "low";
      
      // Atualizar o exame com os resultados da análise
      const updatedExam = await storage.updateMedicalExamWithAIAnalysis(
        examId,
        aiAnalysis,
        anomalies,
        riskLevel
      );
      
      // Criar insights de saúde com base na análise
      const categories = ["Cardiovascular", "Nutrition", "Metabolism"];
      const insights = [];
      
      // Criar um insight para cada categoria relevante
      for (const category of categories) {
        let title, description, recommendation, severity, data;
        
        switch (category) {
          case "Cardiovascular":
            title = "Saúde Cardiovascular Ótima";
            description = "Seus indicadores cardíacos estão em níveis ótimos, indicando boa função cardiovascular.";
            recommendation = "Continue com exercícios regulares para manter a saúde cardíaca.";
            severity = "normal";
            data = {
              cholesterol: aiAnalysis.details.cholesterol,
              bloodPressure: "120/80"
            };
            break;
          case "Nutrition":
            title = "Perfil Nutricional Adequado";
            description = "Seus marcadores nutricionais estão equilibrados.";
            recommendation = "Mantenha uma dieta balanceada rica em nutrientes essenciais.";
            severity = "normal";
            data = {
              cholesterol: aiAnalysis.details.cholesterol
            };
            break;
          case "Metabolism":
            title = "Gestão de Glicemia";
            description = "Seus níveis de glicemia estão dentro da faixa normal, indicando metabolismo eficaz.";
            recommendation = "Mantenha uma dieta balanceada com carboidratos complexos.";
            severity = "normal";
            data = {
              glucose: aiAnalysis.details.bloodGlucose
            };
            break;
        }
        
        // Criar o insight no banco
        const insight = await storage.createHealthInsight({
          userId,
          examId,
          date: new Date(),
          category,
          title,
          description,
          recommendation,
          severity,
          status: "active",
          aiGenerated: true,
          data
        });
        
        insights.push(insight);
      }
      
      // Retornar o exame atualizado e os insights gerados
      res.json({
        exam: updatedExam,
        insights
      });
      
    } catch (error) {
      console.error("Erro ao analisar exame:", error);
      res.status(500).json({ message: "Falha ao processar a análise do exame" });
    }
  });
  
  // Activity routes
  app.get("/api/activities", async (req, res) => {
    // Para permitir dados de exemplo sem autenticação
    let userId = 1; // ID padrão para acessar os dados de exemplo
    
    if (req.isAuthenticated()) {
      userId = (req.user as Express.User).id;
    }
    
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

  // Health Insights routes
  app.get("/api/health-insights", async (req, res) => {
    // Para desenvolvimento, permita acesso sem autenticação usando userId fixo
    let userId = 1;
    
    if (req.isAuthenticated()) {
      userId = (req.user as Express.User).id;
    }
    
    try {
      const insights = await storage.getHealthInsights(userId);
      res.json(insights);
    } catch (error) {
      console.error("Erro ao buscar health insights:", error);
      res.status(500).json({ message: "Falha ao buscar insights de saúde" });
    }
  });
  
  app.get("/api/health-insights/category/:category", async (req, res) => {
    // Para desenvolvimento, permita acesso sem autenticação usando userId fixo
    let userId = 1;
    
    if (req.isAuthenticated()) {
      userId = (req.user as Express.User).id;
    }
    
    try {
      const { category } = req.params;
      if (!category) {
        return res.status(400).json({ message: "Categoria é obrigatória" });
      }
      
      const insights = await storage.getHealthInsightsByCategory(userId, category);
      res.json(insights);
    } catch (error) {
      console.error("Erro ao buscar health insights por categoria:", error);
      res.status(500).json({ message: "Falha ao buscar insights por categoria" });
    }
  });
  
  app.get("/api/health-insights/exam/:examId", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const examId = parseInt(req.params.examId);
      if (isNaN(examId)) {
        return res.status(400).json({ message: "ID de exame inválido" });
      }
      
      // Verificar se o exame pertence ao usuário
      const userId = (req.user as Express.User).id;
      const exam = await storage.getMedicalExam(examId);
      
      if (!exam) {
        return res.status(404).json({ message: "Exame não encontrado" });
      }
      
      if (exam.userId !== userId) {
        return res.status(403).json({ message: "Não autorizado" });
      }
      
      const insights = await storage.getHealthInsightsByExam(examId);
      res.json(insights);
    } catch (error) {
      console.error("Erro ao buscar health insights por exame:", error);
      res.status(500).json({ message: "Falha ao buscar insights por exame" });
    }
  });
  
  // Add test route
  app.get('/api/test', (req, res) => {
    res.json({ message: 'Server is running!' });
  });

const httpServer = createServer(app);

  return httpServer;
}
