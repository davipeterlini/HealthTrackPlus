import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  Cell
} from 'recharts';
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
      <Card className="w-full bg-gray-50 dark:bg-[#1a2127] border-0 shadow-sm mb-4">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">Health Metrics Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center h-[300px]">
            <Loader className="h-8 w-8 text-blue-500 animate-spin mb-3" />
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              {examStatus === "Analyzing" ? "AI is analyzing your exam data..." : "Loading health insights..."}
            </p>
            <div className="grid grid-cols-3 gap-4 w-full mt-6">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Dados para gráfico de barras
  const barChartData = insights.map(insight => ({
    name: insight.category,
    value: severityToValue[insight.severity as keyof typeof severityToValue] || 50,
    color: categoryColors[insight.category as keyof typeof categoryColors] || "#64748b"
  }));

  // Dados para gráfico de radar
  const radarChartData = [
    insights.reduce((acc, insight) => {
      acc[insight.category] = severityToValue[insight.severity as keyof typeof severityToValue] || 50;
      return acc;
    }, {} as Record<string, number>)
  ];

  // Obtém as categorias únicas para o gráfico de radar
  const categories = insights.map(insight => insight.category);

  return (
    <Card className="w-full bg-gray-50 dark:bg-[#1a2127] border-0 shadow-sm mb-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">Health Metrics Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="bar">
          <TabsList className="mb-4 w-full flex">
            <TabsTrigger value="bar" className="flex-1">Bar Chart</TabsTrigger>
            <TabsTrigger value="radar" className="flex-1">Radar Chart</TabsTrigger>
          </TabsList>
          
          <TabsContent value="bar">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={barChartData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
                >
                  <XAxis 
                    dataKey="name" 
                    angle={-45} 
                    textAnchor="end" 
                    height={70} 
                    tick={{ fontSize: 12 }}
                    tickMargin={8}
                  />
                  <YAxis
                    domain={[0, 100]}
                    tickFormatter={(value) => {
                      if (value === 0) return "Critical";
                      if (value === 25) return "High";
                      if (value === 50) return "Medium";
                      if (value === 75) return "Low";
                      if (value === 100) return "Normal";
                      return "";
                    }}
                    width={70}
                  />
                  <Tooltip
                    formatter={(value, name, props) => {
                      if (value === 100) return ["Normal", "Health Level"];
                      if (value === 75) return ["Low Risk", "Health Level"];
                      if (value === 50) return ["Medium Risk", "Health Level"];
                      if (value === 25) return ["High Risk", "Health Level"];
                      if (value === 0) return ["Critical Risk", "Health Level"];
                      return [value, "Health Level"];
                    }}
                    wrapperStyle={{ zIndex: 1000 }}
                  />
                  <Bar 
                    dataKey="value" 
                    radius={[4, 4, 0, 0]}
                    minPointSize={3}
                    barSize={30}
                  >
                    {barChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          
          <TabsContent value="radar">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart 
                  outerRadius={90} 
                  width={730} 
                  height={250} 
                  data={radarChartData}
                >
                  <PolarGrid />
                  <PolarAngleAxis 
                    dataKey="subject" 
                    tick={{ fill: 'currentColor', fontSize: 12 }}
                  />
                  <PolarRadiusAxis
                    angle={90}
                    domain={[0, 100]}
                    tick={{ fill: 'currentColor', fontSize: 10 }}
                    tickFormatter={(value) => {
                      if (value === 0) return "Critical";
                      if (value === 25) return "High";
                      if (value === 50) return "Medium";
                      if (value === 75) return "Low";
                      if (value === 100) return "Normal";
                      return "";
                    }}
                  />
                  {categories.map((category) => (
                    <Radar
                      key={category}
                      name={category}
                      dataKey={category}
                      stroke={categoryColors[category as keyof typeof categoryColors] || "#64748b"}
                      fill={categoryColors[category as keyof typeof categoryColors] || "#64748b"}
                      fillOpacity={0.6}
                    />
                  ))}
                  <Legend wrapperStyle={{ fontSize: 12, paddingTop: 10 }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}