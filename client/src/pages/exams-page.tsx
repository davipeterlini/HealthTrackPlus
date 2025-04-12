import { useState, useRef } from "react";
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
import { ExamList } from "@/components/exams/exam-list";
import { ExamInsightsChart } from "@/components/exams/exam-insights-chart";
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
  const { t } = useTranslation();
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
    <MainLayout title={t('health.exams')}>
      <div className="flex justify-between items-center mb-6">
        <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
          {t('health.examsDescription')}
        </p>
        <Button 
          className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 text-white xs:text-xs sm:text-sm"
          onClick={() => setUploadDialogOpen(true)}
        >
          <Upload className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" /> {t('health.uploadExam')}
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
                        <Button onClick={handleAnalyzeExam} className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 text-white text-xs sm:text-sm">
                          Analyze with AI
                        </Button>
                      )}
                    </div>
                    
                    {selectedExam.aiAnalysis && typeof selectedExam.aiAnalysis === 'object' && (
                      <div className="bg-gray-50 dark:bg-[#1a2127] border-0 shadow-sm rounded-lg p-4">
                        <h4 className="text-sm font-medium mb-2">AI Analysis</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                          {(selectedExam.aiAnalysis as Record<string, any>).summary}
                        </p>
                        
                        {(selectedExam.aiAnalysis as Record<string, any>).recommendations && (
                          <div>
                            <h5 className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                              Recommendations:
                            </h5>
                            <ul className="text-sm space-y-1">
                              {((selectedExam.aiAnalysis as Record<string, any>).recommendations as string[]).map((rec: string, i: number) => (
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
                                {typeof value === 'object' ? JSON.stringify(value) : String(value)}
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
                        <Button onClick={handleAnalyzeExam} className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 text-white text-xs sm:text-sm">
                          Generate Insights with AI
                        </Button>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <ExamInsightsChart insights={examInsights} />
                      
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
            <Button onClick={() => setAnalysisDialogOpen(false)} className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 text-white text-xs sm:text-sm">
              View Results
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Dialog de upload de exame */}
      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{t('health.uploadExam')}</DialogTitle>
            <DialogDescription>
              {t('health.uploadExamDescription')}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="exam-name">{t('health.examName')}</Label>
              <Input 
                id="exam-name" 
                value={newExam.name} 
                onChange={(e) => handleExamChange('name', e.target.value)}
                placeholder="Ex: Blood Test Q1 2025"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="exam-type">{t('health.examType')}</Label>
              <Select 
                value={newExam.type} 
                onValueChange={(value) => handleExamChange('type', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select exam type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Blood Test">Blood Test</SelectItem>
                  <SelectItem value="Imaging">Imaging</SelectItem>
                  <SelectItem value="Cardiac">Cardiac</SelectItem>
                  <SelectItem value="Urine Test">Urine Test</SelectItem>
                  <SelectItem value="General Checkup">General Checkup</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="exam-date">{t('health.examDate')}</Label>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-2" />
                <Input 
                  id="exam-date" 
                  type="date"
                  value={newExam.date} 
                  onChange={(e) => handleExamChange('date', e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="exam-file">{t('health.examFile')}</Label>
              <div className="flex flex-col">
                <div 
                  className="border-2 border-dashed rounded-md p-6 text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
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
                  <FileText className="h-10 w-10 mx-auto text-gray-400 dark:text-gray-500 mb-3" />
                  
                  {newExam.file ? (
                    <div>
                      <p className="text-sm font-medium">{newExam.file.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {Math.round(newExam.file.size / 1024)} KB
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                        {t('health.dragDropOrClick')}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500">
                        PDF, JPG, PNG (max 10MB)
                      </p>
                    </div>
                  )}
                </div>
                
                {newExam.file && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    type="button"
                    className="mt-2 text-xs"
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
            >
              {t('common.cancel')}
            </Button>
            <Button 
              className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 text-white text-xs sm:text-sm"
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
                  <Upload className="h-4 w-4 mr-2" />
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