import { useQuery } from "@tanstack/react-query";
import { MedicalExam, ExamDetail, HealthInsight } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, FileText, Activity } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useTranslation } from "react-i18next";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ExamDetailsTable from "./exam-details-table";

interface ExamResultsProps {
  examId?: number;
}

// Interface for data returned from API
interface ExamResultsData {
  exam: MedicalExam;
  insights: HealthInsight[];
  examDetails: ExamDetail[];
}

export function ExamResults({ examId }: ExamResultsProps) {
  const { t } = useTranslation();
  
  const { data, isLoading, error } = useQuery<ExamResultsData>({
    queryKey: ["/api/exams", examId],
    enabled: !!examId,
  });
  
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "normal":
        return "text-green-600 dark:text-green-400";
      case "high":
      case "attention":
        return "text-yellow-600 dark:text-yellow-400";
      case "low":
      case "critical":
        return "text-red-600 dark:text-red-400";
      default:
        return "text-gray-600 dark:text-gray-400";
    }
  };
  
  // Display empty state if no exam is selected
  if (!examId) {
    return (
      <div className="px-4 py-5 sm:p-6 border-t border-gray-200 dark:border-gray-700">
        <div className="text-center py-12">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100 dark:bg-gray-700">
            <AlertCircle className="h-6 w-6 text-gray-600 dark:text-gray-400" />
          </div>
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">{t('exams.noExamSelected')}</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {t('exams.selectExamForResults')}
          </p>
        </div>
      </div>
    );
  }
  
  // Display loading state
  if (isLoading) {
    return (
      <div className="px-4 py-5 sm:p-6 border-t border-gray-200 dark:border-gray-700">
        <Skeleton className="h-8 w-64 mb-4" />
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      </div>
    );
  }
  
  // Handle error state
  if (error) {
    return (
      <div className="px-4 py-5 sm:p-6 border-t border-gray-200 dark:border-gray-700">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>{t('common.error')}</AlertTitle>
          <AlertDescription>
            {t('exams.failedToLoadResults')}
          </AlertDescription>
        </Alert>
      </div>
    );
  }
  
  const { exam, insights, examDetails } = data || { exam: null, insights: [], examDetails: [] };
  
  // Display "No results" state if exam doesn't have results
  if (!exam || exam.status === "Analyzing") {
    return (
      <div className="px-4 py-5 sm:p-6 border-t border-gray-200 dark:border-gray-700">
        <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">{exam?.name}</h3>
        <Alert className="mt-5">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>{t('exams.resultsPending')}</AlertTitle>
          <AlertDescription>
            {t('exams.stillBeingAnalyzed')}
          </AlertDescription>
        </Alert>
      </div>
    );
  }
  
  // Check if AI analysis is available
  const hasAiAnalysis = exam.aiAnalysis && typeof exam.aiAnalysis === 'object';
  const aiSummary = hasAiAnalysis && (exam.aiAnalysis as any).summary;
  
  // Check if we have details to display
  const hasExamDetails = examDetails && examDetails.length > 0;
  
  return (
    <div className="px-4 py-5 sm:p-6 border-t border-gray-200 dark:border-gray-700">
      <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">
        {exam.name} ({t('exams.results')})
      </h3>
      
      <Tabs defaultValue="overview" className="mt-6">
        <TabsList>
          <TabsTrigger value="overview">
            <Activity className="h-4 w-4 mr-2" />
            {t('exams.overview')}
          </TabsTrigger>
          {hasExamDetails && (
            <TabsTrigger value="details">
              <FileText className="h-4 w-4 mr-2" />
              {t('exams.details')}
            </TabsTrigger>
          )}
        </TabsList>
        
        <TabsContent value="overview">
          {/* Overview tab content */}
          {hasAiAnalysis && (
            <>
              {/* AI summary */}
              <div className="mb-6 bg-blue-50 dark:bg-blue-900 rounded-md p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertCircle className="h-5 w-5 text-blue-400 dark:text-blue-300" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">{t('exams.aiAnalysis')}</h3>
                    <div className="mt-2 text-sm text-blue-700 dark:text-blue-300">
                      <p>{aiSummary}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Parameter summary cards */}
              {hasExamDetails && (
                <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {examDetails.slice(0, 6).map((detail) => (
                    <Card key={detail.id} className="bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
                      <CardContent className="px-4 py-5">
                        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">{detail.name}</h4>
                        <div className="mt-1 flex items-baseline justify-between">
                          <div className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                            {detail.value} {detail.unit}
                          </div>
                          <div className={`text-sm font-medium ${getStatusColor(detail.status || 'normal')}`}>
                            {t(`exams.status.${(detail.status || 'normal').toLowerCase()}`)}
                          </div>
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {t('exams.referenceRange')}: {detail.referenceRange || t('common.notAvailable')}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
              
              {/* Health insights based on the exam */}
              {insights && insights.length > 0 && (
                <div className="mt-8">
                  <h4 className="text-md font-medium text-gray-900 dark:text-gray-100 mb-4">
                    {t('exams.healthInsights')}
                  </h4>
                  <div className="space-y-4">
                    {insights.map((insight) => (
                      <Card key={insight.id} className="bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
                        <CardContent className="px-4 py-4">
                          <div className="flex justify-between items-start">
                            <h5 className="text-sm font-medium text-gray-900 dark:text-gray-100">{insight.title}</h5>
                            <div className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                              insight.severity === 'normal' 
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                            }`}>
                              {t(`exams.severity.${insight.severity}`)}
                            </div>
                          </div>
                          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{insight.description}</p>
                          {insight.recommendation && (
                            <div className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                              <span className="font-medium">{t('exams.recommendation')}:</span> {insight.recommendation}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
          
          {/* If no AI analysis is available, show a message */}
          {!hasAiAnalysis && (
            <Alert className="mt-5">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>{t('exams.noAnalysisAvailable')}</AlertTitle>
              <AlertDescription>
                {t('exams.tryAnalyzeAgain')}
              </AlertDescription>
            </Alert>
          )}
        </TabsContent>
        
        {hasExamDetails && (
          <TabsContent value="details">
            {/* Details tab content */}
            <ExamDetailsTable details={examDetails} />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
