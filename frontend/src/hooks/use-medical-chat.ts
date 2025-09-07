import { useState, useCallback } from 'react';
import { apiRequest } from '@/lib/queryClient';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface MedicalChatState {
  messages: ChatMessage[];
  isLoading: boolean;
  isOpen: boolean;
  error: string | null;
}

export const useMedicalChat = () => {
  const [state, setState] = useState<MedicalChatState>({
    messages: [{
      id: '1',
      role: 'assistant',
      content: 'Olá! Sou Dr. Gemma, seu assistente médico virtual. Como posso ajudá-lo hoje? Posso responder perguntas sobre saúde, analisar seus dados de atividade e fornecer orientações personalizadas.',
      timestamp: new Date()
    }],
    isLoading: false,
    isOpen: false,
    error: null
  });

  const toggleChat = useCallback(() => {
    setState(prev => ({ ...prev, isOpen: !prev.isOpen }));
  }, []);

  const sendMessage = useCallback(async (message: string) => {
    if (!message.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: message,
      timestamp: new Date()
    };

    setState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isLoading: true,
      error: null
    }));

    try {
      const response = await apiRequest('POST', '/api/medical-chat/message', {
        message,
        chatHistory: state.messages.slice(-10) // Send last 10 messages for context
      });

      const data = await response.json();

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date(data.timestamp)
      };

      setState(prev => ({
        ...prev,
        messages: [...prev.messages, assistantMessage],
        isLoading: false
      }));
    } catch (error) {
      console.error('Error sending message:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Erro ao enviar mensagem. Tente novamente.'
      }));
    }
  }, [state.messages]);

  const analyzeHealth = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await apiRequest('POST', '/api/medical-chat/analyze-health');
      const data = await response.json();

      const analysisMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'assistant',
        content: `📊 **Análise dos Seus Dados de Saúde**\n\n${data.analysis}`,
        timestamp: new Date(data.timestamp)
      };

      setState(prev => ({
        ...prev,
        messages: [...prev.messages, analysisMessage],
        isLoading: false
      }));
    } catch (error) {
      console.error('Error analyzing health:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Erro ao analisar dados de saúde. Tente novamente.'
      }));
    }
  }, []);

  const clearChat = useCallback(() => {
    setState(prev => ({
      ...prev,
      messages: [{
        id: '1',
        role: 'assistant',
        content: 'Olá! Sou Dr. Gemma, seu assistente médico virtual. Como posso ajudá-lo hoje?',
        timestamp: new Date()
      }],
      error: null
    }));
  }, []);

  return {
    ...state,
    toggleChat,
    sendMessage,
    analyzeHealth,
    clearChat
  };
};