import { GoogleGenAI } from "@google/genai";

if (!process.env.GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY is required');
}

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface UserHealthData {
  activities?: {
    steps: number;
    calories: number;
    activeMinutes: number;
  };
  sleep?: {
    duration: number;
    quality: string;
  };
  nutrition?: {
    calories: number;
    meals: string[];
  };
  hydration?: {
    current: number;
    goal: number;
  };
  mentalHealth?: {
    mood: string;
    stress: number;
  };
  vitals?: {
    heartRate?: number;
    bloodPressure?: string;
    weight?: number;
  };
  medications?: string[];
  symptoms?: string[];
  medicalHistory?: string[];
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export class MedicalAI {
  private model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

  private getSystemPrompt(): string {
    return `Você é Dr. Gemma, um assistente médico virtual especializado em medicina preventiva e análise de dados de saúde. Você tem acesso aos dados de saúde do usuário e pode fornecer insights personalizados.

IMPORTANTE: Você é um assistente médico virtual para fins educativos e de bem-estar. Sempre lembre o usuário de que:
- Suas respostas não substituem consultas médicas profissionais
- Em caso de sintomas graves ou emergências, procure atendimento médico imediato
- Para diagnósticos ou tratamentos, consulte um médico qualificado

Suas especialidades incluem:
- Análise de padrões de atividade física e sono
- Orientações nutricionais personalizadas
- Monitoramento de hidratação e bem-estar
- Análise de dados de saúde mental e estresse
- Orientações sobre medicamentos e sintomas
- Saúde da mulher, gravidez e cuidados com bebês
- Interpretação de exames médicos básicos

Sempre forneça respostas:
- Baseadas em evidências científicas
- Personalizadas com base nos dados do usuário
- Claras e em português
- Com tom profissional mas acessível
- Incluindo recomendações práticas quando apropriado

Quando analisar dados de saúde, identifique padrões, tendências preocupantes e áreas de melhoria.`;
  }

  async generateResponse(
    userMessage: string,
    chatHistory: ChatMessage[],
    userHealthData?: UserHealthData
  ): Promise<string> {
    try {
      // Preparar contexto dos dados de saúde
      let healthContext = "";
      if (userHealthData) {
        healthContext = `\n\nDados de Saúde do Usuário:
${userHealthData.activities ? `Atividades: ${userHealthData.activities.steps} passos, ${userHealthData.activities.calories} calorias, ${userHealthData.activities.activeMinutes} min ativos` : ''}
${userHealthData.sleep ? `Sono: ${userHealthData.sleep.duration}h, qualidade ${userHealthData.sleep.quality}` : ''}
${userHealthData.nutrition ? `Nutrição: ${userHealthData.nutrition.calories} calorias consumidas` : ''}
${userHealthData.hydration ? `Hidratação: ${userHealthData.hydration.current}ml de ${userHealthData.hydration.goal}ml` : ''}
${userHealthData.mentalHealth ? `Saúde Mental: humor ${userHealthData.mentalHealth.mood}, estresse ${userHealthData.mentalHealth.stress}/10` : ''}
${userHealthData.vitals ? `Sinais Vitais: ${JSON.stringify(userHealthData.vitals)}` : ''}
${userHealthData.medications ? `Medicamentos: ${userHealthData.medications.join(', ')}` : ''}
${userHealthData.symptoms ? `Sintomas: ${userHealthData.symptoms.join(', ')}` : ''}
${userHealthData.medicalHistory ? `Histórico: ${userHealthData.medicalHistory.join(', ')}` : ''}`;
      }

      // Preparar histórico da conversa
      const conversationHistory = chatHistory.slice(-10).map(msg => 
        `${msg.role === 'user' ? 'Usuário' : 'Dr. Gemma'}: ${msg.content}`
      ).join('\n');

      const fullPrompt = `${this.getSystemPrompt()}
      
${healthContext}

Histórico da Conversa:
${conversationHistory}

Usuário: ${userMessage}

Dr. Gemma:`;

      const result = await this.model.generateContent(fullPrompt);
      const response = result.response;
      return response.text() || "Desculpe, não consegui processar sua solicitação no momento.";
    } catch (error) {
      console.error('Erro ao gerar resposta médica:', error);
      return "Desculpe, ocorreu um erro ao processar sua solicitação. Tente novamente em alguns instantes.";
    }
  }

  async analyzeHealthData(userHealthData: UserHealthData): Promise<string> {
    try {
      const prompt = `Como Dr. Gemma, analise os seguintes dados de saúde do usuário e forneça insights e recomendações personalizadas:

Dados de Saúde:
${JSON.stringify(userHealthData, null, 2)}

Forneça uma análise detalhada incluindo:
1. Padrões identificados
2. Áreas de preocupação (se houver)
3. Recomendações específicas
4. Metas sugeridas para melhoria
5. Quando procurar ajuda médica profissional

Mantenha um tom profissional mas acessível.`;

      const result = await this.model.generateContent(prompt);
      return result.response.text() || "Não foi possível analisar os dados no momento.";
    } catch (error) {
      console.error('Erro ao analisar dados de saúde:', error);
      return "Erro ao analisar os dados de saúde. Tente novamente mais tarde.";
    }
  }
}

export const medicalAI = new MedicalAI();