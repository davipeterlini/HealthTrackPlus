import { useState, useRef, useMemo } from "react";
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MedicalExam, HealthInsight } from "@shared/schema";
import { MainLayout } from "@/components/layout/main-layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { VirtualizedExamList } from "@/components/exams/virtualized-exam-list";
import { VirtualizedInsightsGrid } from "@/components/health/virtualized-insights-grid";
import { ExamInsightsChart } from "@/components/exams/exam-insights-chart";
import { InsightDetailCharts } from "@/components/exams/insight-detail-charts";
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
  CircleCheck,
  Calendar
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

export default function ExamsPage() {
  const { t, i18n } = useTranslation();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedExamId, setSelectedExamId] = useState<number | null>(null);
  const [analysisDialogOpen, setAnalysisDialogOpen] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [uploadingExam, setUploadingExam] = useState(false);
  const [newExam, setNewExam] = useState({
    name: '',
    type: 'Blood Test',
    date: new Date().toISOString().slice(0, 10),
    file: null as File | null,
  });
  
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
    data: originalHealthInsights = [], 
    isLoading: isLoadingInsights 
  } = useQuery<HealthInsight[]>({
    queryKey: ["/api/health-insights"],
  });

  // Função para traduzir categorias de insighs
  const translateCategory = (category: string): string => {
    if (i18n.language !== 'pt') return category;
    
    switch(category) {
      case "Cardiovascular": return "Cardiovascular";
      case "Nutrition": return "Nutrição";
      case "Metabolism": return "Metabolismo";
      default: return category;
    }
  };

  // Versão traduzida dos insights de saúde
  const healthInsights = useMemo(() => {
    return originalHealthInsights.map(insight => {
      if (i18n.language !== 'pt') return insight;
      
      // Traduzir títulos comuns
      let translatedTitle = insight.title;
      if (insight.title === "Cardiovascular Health Optimal") {
        translatedTitle = "Saúde Cardiovascular Ótima";
      } else if (insight.title === "Adequate Nutritional Profile") {
        translatedTitle = "Perfil Nutricional Adequado";
      } else if (insight.title === "Glycemic Management") {
        translatedTitle = "Gestão de Glicemia";
      }
      
      // Traduzir descrições comuns
      let translatedDescription = insight.description;
      if (insight.description.includes("indicators are at optimal levels")) {
        translatedDescription = "Seus indicadores cardíacos estão em níveis ótimos, indicando boa função cardiovascular.";
      } else if (insight.description.includes("nutritional markers are balanced")) {
        translatedDescription = "Seus marcadores nutricionais estão equilibrados.";
      } else if (insight.description.includes("glucose levels are within")) {
        translatedDescription = "Seus níveis de glicemia estão dentro da faixa normal, indicando metabolismo eficaz.";
      }
      
      // Traduzir recomendações comuns
      let translatedRecommendation = insight.recommendation || "";
      const recommendationStr = insight.recommendation || "";
      
      if (recommendationStr.includes("Continue with regular exercise")) {
        translatedRecommendation = "Continue com exercícios regulares para manter a saúde cardíaca.";
      } else if (recommendationStr.includes("Maintain a balanced diet rich")) {
        translatedRecommendation = "Mantenha uma dieta balanceada rica em nutrientes essenciais.";
      } else if (recommendationStr.includes("Maintain a balanced diet with complex")) {
        translatedRecommendation = "Mantenha uma dieta balanceada com carboidratos complexos.";
      }
      
      return {
        ...insight,
        category: translateCategory(insight.category),
        title: translatedTitle,
        description: translatedDescription,
        recommendation: translatedRecommendation
      };
    });
  }, [originalHealthInsights, i18n.language]);
  
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
  
  // Função para lidar com mudanças nos campos
  const handleExamChange = (field: string, value: any) => {
    setNewExam(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // Função para upload de arquivo
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setNewExam(prev => ({
        ...prev,
        file
      }));
    }
  };
  
  // Mutação para criar novo exame
  const uploadExamMutation = useMutation({
    mutationFn: async () => {
      setUploadingExam(true);
      
      if (!newExam.name || !newExam.type || !newExam.date) {
        throw new Error('Preencha todos os campos obrigatórios');
      }
      
      const formData = new FormData();
      formData.append('name', newExam.name);
      formData.append('type', newExam.type);
      formData.append('date', newExam.date);
      
      if (newExam.file) {
        formData.append('file', newExam.file);
      }
      
      try {
        const response = await fetch('/api/exams', {
          method: 'POST',
          body: formData,
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error("Erro na resposta:", response.status, errorText);
          throw new Error(errorText || 'Falha ao enviar o exame');
        }
        
        return await response.json();
      } catch (error) {
        console.error("Erro ao fazer upload:", error);
        throw error;
      }
    },
    onSuccess: () => {
      // Resetar o estado e atualizar a lista
      setNewExam({
        name: '',
        type: 'Blood Test',
        date: new Date().toISOString().slice(0, 10),
        file: null,
      });
      setUploadDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ["/api/exams"] });
      toast({
        title: "Sucesso!",
        description: "Seu exame foi enviado com sucesso.",
      });
    },
    onError: (error: Error) => {
      console.error("Erro ao enviar exame:", error);
      toast({
        title: "Erro ao enviar exame",
        description: error.message || "Ocorreu um erro ao enviar seu exame. Tente novamente.",
        variant: "destructive",
      });
    },
    onSettled: () => {
      setUploadingExam(false);
    }
  });
  
  return (
    <MainLayout title={t('health.exams')} hideTitle={true}>
      <div className="flex justify-between items-center responsive-mb">
        <h1 className="responsive-title-lg text-slate-800 dark:text-white">
          {t('health.exams')}
        </h1>
        <Button 
          className="bg-green-600 hover:bg-green-700 dark:text-white responsive-button"
          onClick={() => setUploadDialogOpen(true)}
        >
          <Upload className="mr-2 responsive-icon-sm" /> {t('health.uploadExam')}
        </Button>
      </div>
      
      <p className="text-slate-600 dark:text-slate-400 responsive-text-sm responsive-mb">
        {t('health.examsDescription')}
      </p>
      
      {/* Lista de exames */}
      <Card className="responsive-mb bg-white dark:bg-[#1a2127] border-emerald-100 dark:border-[#2b353e] responsive-card">
        <VirtualizedExamList 
          exams={exams} 
          isLoading={isLoadingExams} 
          onSelectExam={(id: number) => setSelectedExamId(id)}
          containerHeight={400}
        />
      </Card>
      
      {/* Seção de insights de saúde */}
      <div className="responsive-mb flex justify-between items-center">
        <h2 className="responsive-title-md text-slate-800 dark:text-white">{t('health.healthInsights')}</h2>
        <Button variant="outline" className="responsive-text-sm">
          <BarChart3 className="responsive-icon-sm mr-2" /> {t('health.viewAll')}
        </Button>
      </div>
      
      <VirtualizedInsightsGrid
        insights={healthInsights}
        isLoading={isLoadingInsights}
        height={600}
        columnCount={3}
        rowHeight={220}
      />
      
      {/* Dialog de visualização de exame */}
      <Dialog open={!!selectedExamId} onOpenChange={(open) => !open && setSelectedExamId(null)}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-white dark:bg-[#1a2127]">
          {selectedExam && (
            <>
              <DialogHeader>
                <DialogTitle className="text-slate-800 dark:text-white">{selectedExam.name}</DialogTitle>
                <DialogDescription>
                  {formatDate(selectedExam.date)} • {selectedExam.type}
                </DialogDescription>
              </DialogHeader>
              
              <Tabs defaultValue="details">
                <TabsList className="responsive-mb">
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
                          {t('exams.aiAnalyzed')}
                        </Badge>
                      ) : (
                        <Button onClick={handleAnalyzeExam} className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 text-white text-xs sm:text-sm">
                          {t('exams.analyzeWithAI')}
                        </Button>
                      )}
                    </div>
                    
                    {selectedExam.aiAnalysis && typeof selectedExam.aiAnalysis === 'object' && (
                      <div className="bg-white dark:bg-[#1a2127] border-emerald-100 dark:border-[#2b353e] responsive-card rounded-lg responsive-p">
                        <h4 className="responsive-text-md font-medium responsive-mb-xs text-slate-800 dark:text-white">{t('exams.aiAnalysis')}</h4>
                        <p className="responsive-text-sm text-slate-600 dark:text-slate-400 responsive-mb-xs">
                          {(() => {
                            try {
                              // Manipular tanto strings JSON quanto objetos diretamente
                              const analysis: { summary?: string, recommendations?: string[] } = typeof selectedExam.aiAnalysis === 'string' 
                                ? JSON.parse(selectedExam.aiAnalysis) 
                                : selectedExam.aiAnalysis as any;
                              return analysis.summary || t('exams.noSummaryAvailable');
                            } catch (e) {
                              return t('exams.unableToParseAnalysis');
                            }
                          })()}
                        </p>
                        
                        {(() => {
                          try {
                            const analysis: { summary?: string, recommendations?: string[] } = typeof selectedExam.aiAnalysis === 'string' 
                              ? JSON.parse(selectedExam.aiAnalysis) 
                              : selectedExam.aiAnalysis as any;
                            
                            if (analysis.recommendations && Array.isArray(analysis.recommendations)) {
                              // Traduzir recomendações quando o idioma é português
                              const translatedRecs = analysis.recommendations.map(rec => {
                                if (i18n.language !== 'pt') return rec;
                                
                                // Traduzir recomendações comuns
                                if (rec.includes("Maintain a balanced diet")) {
                                  return "Mantenha uma dieta balanceada e prática regular de exercícios";
                                } else if (rec.includes("Reduce the consumption of saturated fats")) {
                                  return "Reduzir o consumo de gorduras saturadas para melhorar os níveis de colesterol";
                                } else if (rec.includes("Continue with the routine of periodic exams")) {
                                  return "Continuar com a rotina de exames periódicos";
                                }
                                return rec;
                              });
                              
                              return (
                                <div>
                                  <h5 className="responsive-text-xs text-slate-500 dark:text-slate-400 mb-1">
                                    {t('exams.recommendations')}:
                                  </h5>
                                  <ul className="responsive-text-sm space-y-1">
                                    {translatedRecs.map((rec: string, i: number) => (
                                      <li key={i} className="flex items-start">
                                        <CircleCheck className="responsive-icon-xs text-emerald-500 mt-0.5 mr-2 flex-shrink-0" />
                                        <span className="text-slate-600 dark:text-slate-300">{rec}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              );
                            }
                            return null;
                          } catch (e) {
                            return null;
                          }
                        })()}
                      </div>
                    )}
                    
                    {selectedExam.results && typeof selectedExam.results === 'object' && (
                      <div>
                        <h4 className="responsive-text-md font-medium responsive-mb-xs text-slate-800 dark:text-white">{t('exams.results')}</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 responsive-gap-xs">
                          {(() => {
                            try {
                              const results = typeof selectedExam.results === 'string' 
                                ? JSON.parse(selectedExam.results) 
                                : selectedExam.results;
                              
                              return Object.entries(results).map(([key, value]) => (
                                <div key={key} className="bg-white dark:bg-[#1a2127] border-emerald-100 dark:border-[#2b353e] responsive-card rounded-md responsive-p-xs">
                                  <p className="responsive-text-xs text-slate-500 dark:text-slate-400 mb-1">
                                    {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                                  </p>
                                  <p className="responsive-text-sm font-medium text-slate-800 dark:text-slate-100">
                                    {typeof value === 'object' 
                                      ? JSON.stringify(value) 
                                      : String(value)}
                                  </p>
                                </div>
                              ));
                            } catch (e) {
                              return (
                                <div className="col-span-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-md">
                                  <p className="responsive-text-sm text-yellow-700 dark:text-yellow-400">
                                    {t('exams.unableToParseResults')}
                                  </p>
                                </div>
                              );
                            }
                          })()}
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="insights">
                  {selectedExam?.status === "Analyzing" ? (
                    <ExamInsightsChart insights={[]} examStatus={selectedExam.status} />
                  ) : examInsights.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500 dark:text-gray-400 mb-2">
                        {t('exams.noAnalysisAvailable')}
                      </p>
                      {!selectedExam.aiProcessed && (
                        <Button onClick={handleAnalyzeExam} className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 text-white text-xs sm:text-sm">
                          {t('exams.generateInsightsWithAI')}
                        </Button>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-5">
                      <div className="bg-white dark:bg-[#1a2127] border-emerald-100 dark:border-[#2b353e] responsive-card rounded-lg pt-3">
                        <h3 className="responsive-text-md font-medium px-4 responsive-mb-xs text-slate-800 dark:text-white">{t('health.insightVisualization')}</h3>
                        <p className="responsive-text-sm text-slate-500 dark:text-slate-400 px-4 responsive-mb-xs">
                          {t('health.healthChartsDescription')}
                        </p>
                        <Tabs defaultValue="overview" className="px-2 sm:px-4 pb-3">
                          <TabsList className="responsive-mb-xs w-full flex">
                            <TabsTrigger value="overview" className="flex-1">{t('health.overview')}</TabsTrigger>
                            <TabsTrigger value="details" className="flex-1">{t('health.details')}</TabsTrigger>
                          </TabsList>
                          <TabsContent value="overview">
                            <div className="h-[300px] sm:h-[350px] min-w-[200px]">
                              <ExamInsightsChart insights={examInsights} />
                            </div>
                          </TabsContent>
                          <TabsContent value="details">
                            <div className="h-[300px] sm:h-[350px]">
                              {examInsights.length > 0 && (
                                <div className="grid grid-cols-1">
                                  <InsightDetailCharts insight={examInsights[0]} />
                                </div>
                              )}
                            </div>
                          </TabsContent>
                        </Tabs>
                      </div>
                      
                      <h3 className="responsive-text-md font-medium mt-4 text-slate-800 dark:text-white">{t('health.detailedRecommendations')}</h3>
                      {examInsights.map((insight) => (
                        <div key={insight.id} className="bg-white dark:bg-[#1a2127] border-emerald-100 dark:border-[#2b353e] responsive-card rounded-lg responsive-p">
                          <div className="flex justify-between items-start responsive-mb-xs">
                            <div className="flex items-center">
                              <div className={`p-1.5 rounded-full ${insight.severity === 'normal' ? 'bg-emerald-50 dark:bg-emerald-900/20' : insight.severity === 'attention' ? 'bg-amber-50 dark:bg-amber-900/20' : 'bg-red-50 dark:bg-red-900/20'} mr-2`}>
                                {getCategoryIcon(insight.category)}
                              </div>
                              <h4 className="responsive-text-sm font-medium text-slate-800 dark:text-white">{insight.title}</h4>
                            </div>
                            <Badge className={getSeverityColor(insight.severity)}>
                              {insight.category}
                            </Badge>
                          </div>
                          <p className="responsive-text-sm text-slate-600 dark:text-slate-400 responsive-mb-xs">
                            {insight.description}
                          </p>
                          <div>
                            <p className="responsive-text-xs text-slate-500 dark:text-slate-400 mb-1">
                              {t('health.recommendation')}:
                            </p>
                            <p className="responsive-text-sm text-emerald-600 dark:text-emerald-400">
                              {insight.recommendation}
                            </p>
                            <InsightDetailCharts insight={insight} />
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
                      {selectedExam.fileUrl ? selectedExam.fileUrl.split('/').pop() : t('common.notAvailable')}
                    </p>
                    {selectedExam.fileUrl && (
                      <Button variant="outline" className="flex items-center">
                        <Download className="h-4 w-4 mr-2" /> {t('exams.downloadExam')}
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
            <DialogTitle>{t('exams.completed')}</DialogTitle>
            <DialogDescription>
              {t('exams.examUploaded')}
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex items-center justify-center py-6">
            <div className="bg-emerald-100 dark:bg-emerald-900/30 p-4 rounded-full">
              <CircleCheck className="h-10 w-10 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
          
          <p className="text-center text-gray-600 dark:text-gray-300 mb-6">
            {t('exams.aiAnalyzed')}. {t('exams.detailedResults')}.
          </p>
          
          <div className="flex justify-center">
            <Button onClick={() => setAnalysisDialogOpen(false)} className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 text-white text-xs sm:text-sm">
              {t('exams.viewResults')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Dialog de upload de exame */}
      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent className="sm:max-w-[500px] bg-white dark:bg-[#1a2127]">
          <DialogHeader>
            <DialogTitle className="text-slate-800 dark:text-white">{t('health.uploadExam')}</DialogTitle>
            <DialogDescription>
              {t('health.uploadExamDescription')}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="exam-name" className="text-slate-800 dark:text-slate-300">{t('health.examName')}</Label>
              <Input 
                id="exam-name" 
                value={newExam.name} 
                onChange={(e) => handleExamChange('name', e.target.value)}
                placeholder={i18n.language === 'pt' ? "Ex: Exame de Sangue Q1 2025" : "Ex: Blood Test Q1 2025"}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="exam-type" className="text-slate-800 dark:text-slate-300">{t('health.examType')}</Label>
              <Select 
                value={newExam.type} 
                onValueChange={(value) => handleExamChange('type', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={i18n.language === 'pt' ? "Selecione o tipo de exame" : "Select exam type"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Blood Test">{t('exams.bloodTest')}</SelectItem>
                  <SelectItem value="Imaging">{t('exams.imagingTest')}</SelectItem>
                  <SelectItem value="Cardiac">Cardiológico</SelectItem>
                  <SelectItem value="Urine Test">{t('exams.urineTest')}</SelectItem>
                  <SelectItem value="General Checkup">Check-up Geral</SelectItem>
                  <SelectItem value="Other">{t('exams.otherTest')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="exam-date" className="text-slate-800 dark:text-slate-300">{t('health.examDate')}</Label>
              <div className="flex items-center">
                <Calendar className="responsive-icon-sm text-slate-500 dark:text-slate-400 mr-2" />
                <Input 
                  id="exam-date" 
                  type="date"
                  value={newExam.date} 
                  onChange={(e) => handleExamChange('date', e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="exam-file" className="text-slate-800 dark:text-slate-300">{t('health.examFile')}</Label>
              <div className="flex flex-col">
                <div 
                  className="border-2 border-dashed rounded-md p-4 sm:p-6 text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input 
                    ref={fileInputRef}
                    type="file" 
                    id="exam-file" 
                    className="hidden" 
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileSelect}
                  />
                  <FileText className="h-8 w-8 sm:h-10 sm:w-10 mx-auto text-slate-400 dark:text-slate-500 mb-3" />
                  
                  {newExam.file ? (
                    <div>
                      <p className="responsive-text-sm font-medium text-slate-800 dark:text-slate-300">{newExam.file.name}</p>
                      <p className="responsive-text-xs text-slate-500 dark:text-slate-400">
                        {Math.round(newExam.file.size / 1024)} KB
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p className="responsive-text-sm text-slate-600 dark:text-slate-400 mb-1">
                        {t('health.dragDropOrClick')}
                      </p>
                      <p className="responsive-text-xs text-slate-500 dark:text-slate-500">
                        {t('health.maxFileSize')}
                      </p>
                    </div>
                  )}
                </div>
                
                {newExam.file && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    type="button"
                    className="mt-2 responsive-text-xs"
                    onClick={() => {
                      setNewExam((prev) => ({ ...prev, file: null }));
                      if (fileInputRef.current) fileInputRef.current.value = '';
                    }}
                  >
                    {t('health.removeFile')}
                  </Button>
                )}
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setUploadDialogOpen(false)}
              disabled={uploadingExam}
              className="responsive-text-sm"
            >
              {t('common.cancel')}
            </Button>
            <Button 
              className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 text-white responsive-button"
              onClick={() => uploadExamMutation.mutate()}
              disabled={uploadingExam || !newExam.name || !newExam.type || !newExam.date}
            >
              {uploadingExam ? (
                <div className="flex items-center">
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  {t('health.uploading')}
                </div>
              ) : (
                <div className="flex items-center">
                  <Upload className="responsive-icon-sm mr-2" />
                  {t('health.upload')}
                </div>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}