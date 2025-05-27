import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, Sparkles, TrendingUp, Heart, Droplets, Moon, Apple, AlertTriangle, RefreshCw } from "lucide-react";
import { useTranslation } from "react-i18next";
import { apiRequest } from "@/lib/queryClient";

interface HealthInsight {
  id: number;
  userId: number;
  category: string;
  title: string;
  content: string;
  recommendations: string[];
  severity: 'low' | 'medium' | 'high';
  actionable: boolean;
  metadata: {
    activityRecommendations?: string;
    nutritionSuggestions?: string;
    sleepOptimization?: string;
    hydrationManagement?: string;
    mentalWellnessTips?: string;
    healthAlerts?: string;
    overallScore?: number;
    priorityAreas?: string[];
  };
  date: string;
}

export function AIInsightsCard() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("overview");

  // Fetch health insights
  const { data: insights, isLoading, error } = useQuery({
    queryKey: ['/api/health-insights'],
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false
  });

  // Generate new insights mutation
  const generateInsightsMutation = useMutation({
    mutationFn: () => apiRequest('/api/health-insights/generate', {
      method: 'POST'
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/health-insights'] });
    }
  });

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-500" />
            {t('dashboard.aiInsights.title', 'Insights Personalizados de IA')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !insights || insights.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-500" />
            {t('dashboard.aiInsights.title', 'Insights Personalizados de IA')}
          </CardTitle>
          <CardDescription>
            {t('dashboard.aiInsights.description', 'Análise inteligente dos seus dados de saúde para recomendações personalizadas')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">
              {t('dashboard.aiInsights.noData', 'Complete seu perfil de saúde para receber insights personalizados')}
            </p>
            <Button 
              onClick={() => generateInsightsMutation.mutate()}
              disabled={generateInsightsMutation.isPending}
              className="bg-purple-500 hover:bg-purple-600"
            >
              {generateInsightsMutation.isPending ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  {t('dashboard.aiInsights.generating', 'Gerando Insights...')}
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  {t('dashboard.aiInsights.generate', 'Gerar Insights')}
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const latestInsight = insights[0];
  const metadata = latestInsight?.metadata || {};

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-500" />
              {t('dashboard.aiInsights.title', 'Insights Personalizados de IA')}
            </CardTitle>
            <CardDescription>
              {t('dashboard.aiInsights.description', 'Análise inteligente dos seus dados de saúde')}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {metadata.overallScore && (
              <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                Score: {metadata.overallScore}/100
              </Badge>
            )}
            <Button 
              size="sm"
              variant="outline"
              onClick={() => generateInsightsMutation.mutate()}
              disabled={generateInsightsMutation.isPending}
            >
              {generateInsightsMutation.isPending ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" className="text-xs">
              {t('dashboard.aiInsights.overview', 'Visão Geral')}
            </TabsTrigger>
            <TabsTrigger value="activity" className="text-xs">
              {t('dashboard.aiInsights.activity', 'Atividade')}
            </TabsTrigger>
            <TabsTrigger value="nutrition" className="text-xs">
              {t('dashboard.aiInsights.nutrition', 'Nutrição')}
            </TabsTrigger>
            <TabsTrigger value="wellness" className="text-xs">
              {t('dashboard.aiInsights.wellness', 'Bem-estar')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {metadata.priorityAreas && metadata.priorityAreas.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-orange-500" />
                    {t('dashboard.aiInsights.priorityAreas', 'Áreas Prioritárias')}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {metadata.priorityAreas.map((area, index) => (
                      <Badge key={index} variant="outline">
                        {area}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              {metadata.healthAlerts && (
                <div className="space-y-2">
                  <h4 className="font-medium flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                    {t('dashboard.aiInsights.alerts', 'Alertas')}
                  </h4>
                  <p className="text-sm text-gray-600">{metadata.healthAlerts}</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="activity" className="space-y-4">
            {metadata.activityRecommendations && (
              <div className="space-y-2">
                <h4 className="font-medium flex items-center gap-2">
                  <Heart className="h-4 w-4 text-red-500" />
                  {t('dashboard.aiInsights.activityRecommendations', 'Recomendações de Atividade')}
                </h4>
                <p className="text-sm text-gray-600">{metadata.activityRecommendations}</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="nutrition" className="space-y-4">
            <div className="space-y-4">
              {metadata.nutritionSuggestions && (
                <div className="space-y-2">
                  <h4 className="font-medium flex items-center gap-2">
                    <Apple className="h-4 w-4 text-green-500" />
                    {t('dashboard.aiInsights.nutritionSuggestions', 'Sugestões Nutricionais')}
                  </h4>
                  <p className="text-sm text-gray-600">{metadata.nutritionSuggestions}</p>
                </div>
              )}
              {metadata.hydrationManagement && (
                <div className="space-y-2">
                  <h4 className="font-medium flex items-center gap-2">
                    <Droplets className="h-4 w-4 text-blue-500" />
                    {t('dashboard.aiInsights.hydrationManagement', 'Gerenciamento de Hidratação')}
                  </h4>
                  <p className="text-sm text-gray-600">{metadata.hydrationManagement}</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="wellness" className="space-y-4">
            <div className="space-y-4">
              {metadata.sleepOptimization && (
                <div className="space-y-2">
                  <h4 className="font-medium flex items-center gap-2">
                    <Moon className="h-4 w-4 text-indigo-500" />
                    {t('dashboard.aiInsights.sleepOptimization', 'Otimização do Sono')}
                  </h4>
                  <p className="text-sm text-gray-600">{metadata.sleepOptimization}</p>
                </div>
              )}
              {metadata.mentalWellnessTips && (
                <div className="space-y-2">
                  <h4 className="font-medium flex items-center gap-2">
                    <Brain className="h-4 w-4 text-purple-500" />
                    {t('dashboard.aiInsights.mentalWellnessTips', 'Dicas de Bem-estar Mental')}
                  </h4>
                  <p className="text-sm text-gray-600">{metadata.mentalWellnessTips}</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {insights.length > 1 && (
          <div className="mt-4 pt-4 border-t">
            <p className="text-xs text-gray-500">
              {t('dashboard.aiInsights.lastUpdated', 'Última atualização')}: {new Date(latestInsight.date).toLocaleDateString('pt-BR')}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}