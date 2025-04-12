import { useState } from "react";
import { useTranslation } from 'react-i18next';
import { useQuery } from "@tanstack/react-query";
import { MedicalExam, HealthInsight } from "@shared/schema";
import { MainLayout } from "@/components/layout/main-layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ExamList } from "@/components/exams/exam-list";
import { 
  BarChart3, 
  Upload, 
  Download, 
  FileText, 
  AlertCircle, 
  Heart, 
  Apple, 
  ActivitySquare,
  Microscope,
  CircleCheck
} from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function ExamsPage() {
  const { t } = useTranslation();
  const [selectedExamId, setSelectedExamId] = useState<number | null>(null);
  const [analysisDialogOpen, setAnalysisDialogOpen] = useState(false);
  
  // Buscar exames
  const { 
    data: exams = [], 
    isLoading: isLoadingExams,
    refetch: refetchExams
  } = useQuery<MedicalExam[]>({
    queryKey: ["/api/exams"],
  });
  
  // Buscar insights de saúde
  const { 
    data: healthInsights = [], 
    isLoading: isLoadingInsights 
  } = useQuery<HealthInsight[]>({
    queryKey: ["/api/health-insights"],
  });
  
  // Buscar um exame específico quando selecionado
  const { data: selectedExam } = useQuery<MedicalExam>({
    queryKey: ["/api/exams", selectedExamId],
    enabled: !!selectedExamId,
  });
  
  // Buscar insights específicos para o exame selecionado
  const { data: examInsights = [] } = useQuery<HealthInsight[]>({
    queryKey: ["/api/health-insights/exam", selectedExamId],
    enabled: !!selectedExamId,
  });
  
  // Função para disparar a análise com IA de um exame
  const handleAnalyzeExam = async () => {
    if (!selectedExamId) return;
    
    try {
      const response = await fetch(`/api/exams/${selectedExamId}/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Falha ao analisar o exame');
      }
      
      const data = await response.json();
      console.log("Análise concluída:", data);
      
      // Atualizar os dados
      refetchExams();
      setAnalysisDialogOpen(true);
    } catch (error) {
      console.error("Erro ao analisar exame:", error);
      alert("Não foi possível realizar a análise do exame. Tente novamente mais tarde.");
    }
  };
  
  // Cores dos badges de severidade
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-50 text-red-600 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800";
      case "attention":
        return "bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800";
      case "normal":
      default:
        return "bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800";
    }
  };
  
  // Ícones para categorias
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Cardiovascular":
        return <Heart className="h-5 w-5" />;
      case "Nutrition":
        return <Apple className="h-5 w-5" />;
      case "Metabolism":
        return <ActivitySquare className="h-5 w-5" />;
      default:
        return <Microscope className="h-5 w-5" />;
    }
  };
  
  return (
    <MainLayout title={t('health.exams')}>
      <div className="flex justify-between items-center mb-6">
        <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
          {t('health.examsDescription')}
        </p>
        <Button className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800">
          <Upload className="h-4 w-4 mr-2" /> {t('health.uploadExam')}
        </Button>
      </div>
      
      {/* Lista de exames */}
      <Card className="mb-8 bg-gray-50 dark:bg-[#1a2127] border-0 shadow-sm">
        <ExamList 
          exams={exams} 
          isLoading={isLoadingExams} 
          onSelectExam={(id: number) => setSelectedExamId(id)}
        />
      </Card>
      
      {/* Seção de insights de saúde */}
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-xl font-bold">{t('health.healthInsights')}</h2>
        <Button variant="outline" className="text-xs">
          <BarChart3 className="h-4 w-4 mr-2" /> {t('health.viewAll')}
        </Button>
      </div>
      
      {isLoadingInsights ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="p-4 animate-pulse bg-gray-50 dark:bg-[#1a2127] border-0 shadow-sm">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 w-1/2 rounded mb-3"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 w-3/4 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 w-full rounded mb-2"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 w-5/6 rounded mb-4"></div>
              <div className="h-6 bg-gray-200 dark:bg-gray-700 w-1/3 rounded"></div>
            </Card>
          ))}
        </div>
      ) : healthInsights.length === 0 ? (
        <Card className="p-6 text-center bg-gray-50 dark:bg-[#1a2127] border-0 shadow-sm">
          <div className="mx-auto w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
            <AlertCircle className="h-6 w-6 text-gray-500 dark:text-gray-400" />
          </div>
          <h3 className="text-lg font-medium mb-2">{t('health.noInsightsYet')}</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            {t('health.uploadExamToGetInsights')}
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {healthInsights.map((insight) => (
            <Card key={insight.id} className="p-5 flex flex-col h-full bg-gray-50 dark:bg-[#1a2127] border-0 shadow-sm">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center">
                  <div className={`p-2 rounded-full ${insight.severity === 'normal' ? 'bg-emerald-50 dark:bg-emerald-900/20' : insight.severity === 'attention' ? 'bg-amber-50 dark:bg-amber-900/20' : 'bg-red-50 dark:bg-red-900/20'} mr-3`}>
                    {getCategoryIcon(insight.category)}
                  </div>
                  <h3 className="font-semibold">{insight.title}</h3>
                </div>
                <Badge className={getSeverityColor(insight.severity)}>
                  {insight.severity.charAt(0).toUpperCase() + insight.severity.slice(1)}
                </Badge>
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">
                {insight.description}
              </p>
              <div className="mt-auto">
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                  {t('health.recommendation')}:
                </div>
                <p className="text-sm text-emerald-600 dark:text-emerald-400">
                  {insight.recommendation}
                </p>
              </div>
            </Card>
          ))}
        </div>
      )}
      
      {/* Dialog de visualização de exame */}
      <Dialog open={!!selectedExamId} onOpenChange={(open) => !open && setSelectedExamId(null)}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          {selectedExam && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedExam.name}</DialogTitle>
                <DialogDescription>
                  {formatDate(selectedExam.date)} • {selectedExam.type}
                </DialogDescription>
              </DialogHeader>
              
              <Tabs defaultValue="details">
                <TabsList className="mb-4">
                  <TabsTrigger value="details">{t('health.details')}</TabsTrigger>
                  <TabsTrigger value="insights">{t('health.insights')}</TabsTrigger>
                  <TabsTrigger value="file">{t('health.file')}</TabsTrigger>
                </TabsList>
                
                <TabsContent value="details">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                        <Badge className={getSeverityColor(selectedExam.riskLevel || 'normal')}>
                          {selectedExam.status}
                        </Badge>
                      </div>
                      
                      {selectedExam.aiProcessed ? (
                        <Badge className="bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800">
                          AI Analyzed
                        </Badge>
                      ) : (
                        <Button onClick={handleAnalyzeExam} className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800">
                          Analyze with AI
                        </Button>
                      )}
                    </div>
                    
                    {selectedExam.aiAnalysis && typeof selectedExam.aiAnalysis === 'object' && (
                      <div className="bg-gray-50 dark:bg-[#1a2127] border-0 shadow-sm rounded-lg p-4">
                        <h4 className="text-sm font-medium mb-2">AI Analysis</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                          {(selectedExam.aiAnalysis as any).summary}
                        </p>
                        
                        {(selectedExam.aiAnalysis as any).recommendations && (
                          <div>
                            <h5 className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                              Recommendations:
                            </h5>
                            <ul className="text-sm space-y-1">
                              {((selectedExam.aiAnalysis as any).recommendations as string[]).map((rec: string, i: number) => (
                                <li key={i} className="flex items-start">
                                  <CircleCheck className="h-4 w-4 text-emerald-500 mt-0.5 mr-2 flex-shrink-0" />
                                  <span className="text-gray-700 dark:text-gray-300">{rec}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {selectedExam.results && typeof selectedExam.results === 'object' && (
                      <div>
                        <h4 className="text-sm font-medium mb-2">Results</h4>
                        <div className="grid grid-cols-2 gap-3">
                          {Object.entries(selectedExam.results as Record<string, any>).map(([key, value]) => (
                            <div key={key} className="bg-gray-50 dark:bg-[#1a2127] border-0 shadow-sm rounded-md p-3">
                              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                                {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                              </p>
                              <p className="text-sm font-medium">
                                {typeof value === 'object' ? JSON.stringify(value) : value}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="insights">
                  {examInsights.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500 dark:text-gray-400 mb-2">
                        No insights available for this exam yet.
                      </p>
                      {!selectedExam.aiProcessed && (
                        <Button onClick={handleAnalyzeExam} className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800">
                          Generate Insights with AI
                        </Button>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {examInsights.map((insight) => (
                        <div key={insight.id} className="bg-gray-50 dark:bg-[#1a2127] border-0 shadow-sm rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center">
                              <div className={`p-1.5 rounded-full ${insight.severity === 'normal' ? 'bg-emerald-50 dark:bg-emerald-900/20' : insight.severity === 'attention' ? 'bg-amber-50 dark:bg-amber-900/20' : 'bg-red-50 dark:bg-red-900/20'} mr-2`}>
                                {getCategoryIcon(insight.category)}
                              </div>
                              <h4 className="font-medium">{insight.title}</h4>
                            </div>
                            <Badge className={getSeverityColor(insight.severity)}>
                              {insight.category}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                            {insight.description}
                          </p>
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                              Recommendation:
                            </p>
                            <p className="text-sm text-emerald-600 dark:text-emerald-400">
                              {insight.recommendation}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="file">
                  <div className="flex flex-col items-center justify-center py-10 border-2 border-dashed rounded-lg border-gray-300 dark:border-gray-700">
                    <FileText className="h-10 w-10 text-gray-400 dark:text-gray-500 mb-3" />
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      {selectedExam.fileUrl ? selectedExam.fileUrl.split('/').pop() : "No file available"}
                    </p>
                    {selectedExam.fileUrl && (
                      <Button variant="outline" className="flex items-center">
                        <Download className="h-4 w-4 mr-2" /> Download File
                      </Button>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Dialog de análise concluída */}
      <Dialog open={analysisDialogOpen} onOpenChange={setAnalysisDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Analysis Complete</DialogTitle>
            <DialogDescription>
              The AI analysis of your exam has been completed successfully.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex items-center justify-center py-6">
            <div className="bg-emerald-100 dark:bg-emerald-900/30 p-4 rounded-full">
              <CircleCheck className="h-10 w-10 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
          
          <p className="text-center text-gray-600 dark:text-gray-300 mb-6">
            We've analyzed your exam and generated health insights based on the results.
            You can view the detailed analysis and recommendations in the exam details.
          </p>
          
          <div className="flex justify-center">
            <Button onClick={() => setAnalysisDialogOpen(false)} className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800">
              View Results
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}