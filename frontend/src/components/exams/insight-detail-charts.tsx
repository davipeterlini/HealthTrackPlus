import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { HealthInsight } from '@shared/schema';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  AreaChart,
  Area,
  Scatter,
  ScatterChart,
  ZAxis,
  ReferenceLine 
} from 'recharts';
import { Activity, BarChart2, Maximize2, PieChart as PieChartIcon, TrendingUp } from 'lucide-react';

// Categorias e cores para os gráficos
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

// Função auxiliar para extrair dados de um insight
const extractChartData = (insight: HealthInsight) => {
  const data = insight.data as Record<string, any>;
  
  // Se não há dados, retorna um conjunto padrão
  if (!data) {
    return {
      timeSeriesData: generateDefaultTimeSeriesData(),
      comparisonData: generateDefaultComparisonData(),
      distributionData: generateDefaultDistributionData(),
      correlationData: generateDefaultCorrelationData(),
      referenceValues: { min: "Below", max: "Above", target: "Target" }
    };
  }
  
  // Extrai dados reais do insight
  return {
    timeSeriesData: data.timeSeriesData || generateDefaultTimeSeriesData(),
    comparisonData: data.comparisonData || generateDefaultComparisonData(),
    distributionData: data.distributionData || generateDefaultDistributionData(),
    correlationData: data.correlationData || generateDefaultCorrelationData(),
    referenceValues: data.referenceValues || { min: "Below", max: "Above", target: "Target" }
  };
};

// Funções para gerar dados padrão quando não há dados reais
function generateDefaultTimeSeriesData() {
  return Array.from({ length: 7 }, (_, i) => ({
    day: `Day ${i+1}`,
    value: Math.round(Math.random() * 100)
  }));
}

function generateDefaultComparisonData() {
  return [
    { name: "Your Value", value: 75 },
    { name: "Avg. Population", value: 65 },
    { name: "Reference Min", value: 50 },
    { name: "Reference Max", value: 90 }
  ];
}

function generateDefaultDistributionData() {
  return [
    { name: "Low", value: 20 },
    { name: "Normal", value: 60 },
    { name: "High", value: 20 }
  ];
}

function generateDefaultCorrelationData() {
  return Array.from({ length: 10 }, (_, i) => ({
    x: Math.round(Math.random() * 100),
    y: Math.round(Math.random() * 100),
    z: Math.round(Math.random() * 100)
  }));
}

// Função para obter o ícone da categoria
const getCategoryIcon = (category: string) => {
  switch (category) {
    case "Cardiovascular":
      return <Activity className="h-5 w-5 text-red-500" />;
    case "Nutrition":
      return <PieChartIcon className="h-5 w-5 text-green-500" />;
    case "Metabolism":
      return <TrendingUp className="h-5 w-5 text-blue-500" />;
    default:
      return <BarChart2 className="h-5 w-5 text-gray-500" />;
  }
};

interface InsightDetailChartsProps {
  insight: HealthInsight;
}

export function InsightDetailCharts({ insight }: InsightDetailChartsProps) {
  const { t } = useTranslation();
  const [dialogOpen, setDialogOpen] = useState(false);
  
  // Extrai dados para os gráficos
  const { 
    timeSeriesData, 
    comparisonData, 
    distributionData,
    correlationData,
    referenceValues 
  } = extractChartData(insight);
  
  // Determina a cor baseada na categoria
  const color = categoryColors[insight.category as keyof typeof categoryColors] || "#64748b";
  
  // Retorna o componente
  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="mt-2 w-full">
          <Maximize2 className="mr-2 h-4 w-4" />
          {t('health.viewDetailedCharts')}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            {getCategoryIcon(insight.category)}
            <span className="ml-2">{insight.title}</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
            {insight.description}
          </p>
          
          <Tabs defaultValue="timeSeries">
            <TabsList className="mb-4">
              <TabsTrigger value="timeSeries">{t('health.timeSeriesChart')}</TabsTrigger>
              <TabsTrigger value="comparison">{t('health.comparisonChart')}</TabsTrigger>
              <TabsTrigger value="distribution">{t('health.distributionChart')}</TabsTrigger>
              <TabsTrigger value="correlation">{t('health.correlationChart')}</TabsTrigger>
            </TabsList>
            
            <TabsContent value="timeSeries">
              <Card className="bg-gray-50 dark:bg-[#1a2127] border-0 shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{t('health.timeSeriesAnalysis')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={timeSeriesData}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis />
                        <Tooltip />
                        <ReferenceLine y={80} label={referenceValues.max} stroke="#ef4444" />
                        <ReferenceLine y={60} label={referenceValues.target} stroke="#3b82f6" />
                        <ReferenceLine y={40} label={referenceValues.min} stroke="#f97316" />
                        <Area 
                          type="monotone" 
                          dataKey="value" 
                          stroke={color} 
                          fill={color} 
                          fillOpacity={0.3} 
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                    {t('health.timeSeriesExplanation')}
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="comparison">
              <Card className="bg-gray-50 dark:bg-[#1a2127] border-0 shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{t('health.referenceComparison')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={comparisonData}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value">
                          {comparisonData.map((entry: { name: string, value: number }, index: number) => (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={index === 0 ? color : '#64748b'}
                              fillOpacity={index === 0 ? 1 : 0.7} 
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                    {t('health.comparisonExplanation')}
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="distribution">
              <Card className="bg-gray-50 dark:bg-[#1a2127] border-0 shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{t('health.valueDistribution')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={distributionData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {distributionData.map((entry: { name: string, value: number }, index: number) => (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={
                                entry.name === "Low" ? "#f97316" : 
                                entry.name === "Normal" ? "#22c55e" : 
                                "#ef4444"
                              } 
                            />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                    {t('health.distributionExplanation')}
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="correlation">
              <Card className="bg-gray-50 dark:bg-[#1a2127] border-0 shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{t('health.correlationAnalysis')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <ScatterChart
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          type="number" 
                          dataKey="x" 
                          name={t('health.factor1')} 
                          unit="" 
                        />
                        <YAxis 
                          type="number" 
                          dataKey="y" 
                          name={t('health.factor2')} 
                          unit="" 
                        />
                        <ZAxis 
                          type="number" 
                          range={[50, 500]} 
                          dataKey="z" 
                          name={t('health.intensity')} 
                          unit="" 
                        />
                        <Tooltip 
                          cursor={{ strokeDasharray: '3 3' }}
                          formatter={(value, name) => [value, name]}
                        />
                        <Legend />
                        <Scatter 
                          name={insight.category} 
                          data={correlationData} 
                          fill={color} 
                        />
                      </ScatterChart>
                    </ResponsiveContainer>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                    {t('health.correlationExplanation')}
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        <DialogFooter className="mt-2">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-md w-full">
            <h4 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">
              {t('health.recommendation')}
            </h4>
            <p className="text-sm text-blue-700 dark:text-blue-400">
              {insight.recommendation}
            </p>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}