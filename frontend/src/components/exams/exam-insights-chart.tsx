import React, { useMemo } from 'react';
import { EnhancedChart } from '@/components/ui/enhanced-chart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HealthInsight, MedicalExam } from '@shared/schema';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

// Mapeamento de severidade para valores numéricos
const severityToValue = {
  "normal": 100,
  "low": 75,
  "medium": 50,
  "high": 25,
  "critical": 0
};

// Cores para cada categoria
const categoryColors = {
  "Cardiovascular": "#ef4444",
  "Nutrition": "#22c55e",
  "Metabolism": "#3b82f6",
  "Respiratory": "#f97316",
  "Renal": "#a855f7",
  "Hepatic": "#eab308",
  "Hormonal": "#ec4899",
  "Immunology": "#14b8a6"
};

interface ExamInsightsChartProps {
  insights: HealthInsight[];
  isLoading?: boolean;
  examStatus?: string;
}

export function ExamInsightsChart({ insights, isLoading = false, examStatus }: ExamInsightsChartProps) {
  // Se não houver insights e não está carregando, retorna null
  if (!isLoading && (!insights || insights.length === 0) && examStatus !== "Analyzing") {
    return null;
  }
  
  // Se está carregando ou o exame está sendo analisado, mostra o skeleton
  if (isLoading || examStatus === "Analyzing") {
    return (
      <Card className="w-full bg-gray-50 dark:bg-[#1a2127] border-0 shadow-md mb-4">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold">Health Metrics Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center h-[300px]">
            <Loader className="h-8 w-8 text-primary animate-spin mb-3" />
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              {examStatus === "Analyzing" ? "AI is analyzing your exam data..." : "Loading health insights..."}
            </p>
            <div className="grid grid-cols-3 gap-4 w-full mt-6">
              <Skeleton className="h-4 w-full rounded-md" />
              <Skeleton className="h-4 w-full rounded-md" />
              <Skeleton className="h-4 w-full rounded-md" />
              <Skeleton className="h-4 w-3/4 rounded-md" />
              <Skeleton className="h-4 w-2/3 rounded-md" />
              <Skeleton className="h-4 w-1/2 rounded-md" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Preparar dados para os gráficos
  const chartData = useMemo(() => {
    // Dados para gráfico de barras
    const barData = insights.map(insight => ({
      name: insight.category,
      value: severityToValue[insight.severity as keyof typeof severityToValue] || 50,
      color: categoryColors[insight.category as keyof typeof categoryColors] || "#64748b"
    }));
    
    // Dados formatados para o EnhancedChart
    const formattedData = barData.map(item => ({
      name: item.name,
      healthValue: item.value,
    }));
    
    // Para o gráfico de radar
    const radarData = [
      insights.reduce((acc, insight) => {
        acc[insight.category] = severityToValue[insight.severity as keyof typeof severityToValue] || 50;
        return acc;
      }, {} as Record<string, number>)
    ];
    
    // Formatar dados para o radar no EnhancedChart
    const radarFormatted = insights.map(insight => ({
      subject: insight.category,
      [insight.category]: severityToValue[insight.severity as keyof typeof severityToValue] || 50
    }));
    
    return { 
      barData: formattedData, 
      radarData: radarFormatted,
      colors: insights.map(insight => 
        categoryColors[insight.category as keyof typeof categoryColors] || "#64748b"
      )
    };
  }, [insights]);
  
  // Custom formatter para tooltips
  const valueFormatter = (value: number) => {
    if (value === 100) return "Normal";
    if (value === 75) return "Low Risk";
    if (value === 50) return "Medium Risk";
    if (value === 25) return "High Risk";
    if (value === 0) return "Critical Risk";
    return value.toString();
  };

  return (
    <Card className="w-full bg-gray-50 dark:bg-[#1a2127] border-0 shadow-md mb-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">Health Metrics Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="bar">
          <TabsList className="mb-4 w-full flex rounded-md overflow-hidden">
            <TabsTrigger value="bar" className="flex-1">Bar Chart</TabsTrigger>
            <TabsTrigger value="radar" className="flex-1">Radar Chart</TabsTrigger>
          </TabsList>
          
          <TabsContent value="bar">
            <EnhancedChart
              type="bar"
              data={chartData.barData}
              dataKeys={["healthValue"]}
              xAxisKey="name"
              colors={chartData.colors}
              height={300}
              rounded={true}
              showGrid={true}
              formatter={valueFormatter}
              legendPosition="bottom"
              stacked={false}
            />
          </TabsContent>
          
          <TabsContent value="radar">
            <EnhancedChart
              type="radar"
              data={chartData.radarData}
              dataKeys={insights.map(insight => insight.category)}
              labelKey="subject"
              colors={chartData.colors}
              height={300}
              formatter={valueFormatter}
              legendPosition="bottom"
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}