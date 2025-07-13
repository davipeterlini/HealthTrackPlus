import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

interface BabyGrowthOverviewProps {
  baby: {
    id: number;
    name: string;
    birthDate: string;
    gender: string;
    ageInDays: number;
    currentWeight: number;
    currentHeight: number;
    currentHeadCircumference: number;
    birthWeight: number;
    birthHeight: number;
    birthHeadCircumference: number;
  };
}

export function BabyGrowthOverview({ baby }: BabyGrowthOverviewProps) {
  // Mock data para gráficos - será substituído por dados reais da API
  const weightData = [
    { age: 0, weight: baby.birthWeight / 1000, percentile: 50 },
    { age: 30, weight: 4.2, percentile: 55 },
    { age: 60, weight: 5.1, percentile: 60 },
    { age: 90, weight: 5.8, percentile: 58 },
    { age: 120, weight: 6.2, percentile: 62 },
    { age: 150, weight: 6.5, percentile: 65 },
    { age: baby.ageInDays, weight: baby.currentWeight / 1000, percentile: 68 }
  ];

  const heightData = [
    { age: 0, height: baby.birthHeight, percentile: 50 },
    { age: 30, height: 54, percentile: 52 },
    { age: 60, height: 58, percentile: 55 },
    { age: 90, height: 61, percentile: 58 },
    { age: 120, height: 63, percentile: 60 },
    { age: 150, height: 64, percentile: 62 },
    { age: baby.ageInDays, height: baby.currentHeight, percentile: 65 }
  ];

  const getPercentileColor = (percentile: number) => {
    if (percentile >= 75) return 'text-green-600';
    if (percentile >= 50) return 'text-blue-600';
    if (percentile >= 25) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getTrendIcon = (current: number, previous: number) => {
    if (current > previous) return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (current < previous) return <TrendingDown className="h-4 w-4 text-red-500" />;
    return <Minus className="h-4 w-4 text-gray-500" />;
  };

  return (
    <div className="space-y-6">
      {/* Growth Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Peso Atual</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{(baby.currentWeight / 1000).toFixed(1)} kg</div>
                <div className="text-sm text-gray-600">
                  Percentil 68 {getTrendIcon(baby.currentWeight, baby.birthWeight)}
                </div>
              </div>
              <Badge variant="outline" className={getPercentileColor(68)}>
                68%
              </Badge>
            </div>
            <Progress value={68} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Altura Atual</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{baby.currentHeight} cm</div>
                <div className="text-sm text-gray-600">
                  Percentil 65 {getTrendIcon(baby.currentHeight, baby.birthHeight)}
                </div>
              </div>
              <Badge variant="outline" className={getPercentileColor(65)}>
                65%
              </Badge>
            </div>
            <Progress value={65} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Perímetro Cefálico</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{baby.currentHeadCircumference} cm</div>
                <div className="text-sm text-gray-600">
                  Percentil 70 {getTrendIcon(baby.currentHeadCircumference, baby.birthHeadCircumference)}
                </div>
              </div>
              <Badge variant="outline" className={getPercentileColor(70)}>
                70%
              </Badge>
            </div>
            <Progress value={70} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Growth Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Evolução do Peso</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={weightData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="age" />
                <YAxis />
                <Tooltip 
                  formatter={(value) => [`${value} kg`, 'Peso']}
                  labelFormatter={(label) => `${label} dias`}
                />
                <Line 
                  type="monotone" 
                  dataKey="weight" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  dot={{ fill: '#3b82f6' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Evolução da Altura</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={heightData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="age" />
                <YAxis />
                <Tooltip 
                  formatter={(value) => [`${value} cm`, 'Altura']}
                  labelFormatter={(label) => `${label} dias`}
                />
                <Line 
                  type="monotone" 
                  dataKey="height" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  dot={{ fill: '#10b981' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Growth Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Comparação com Padrões de Crescimento</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <div className="font-medium">Peso para idade</div>
                <div className="text-sm text-gray-600">Percentil 68 - Normal</div>
              </div>
              <Badge variant="outline" className="bg-green-50 text-green-700">
                Adequado
              </Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <div className="font-medium">Altura para idade</div>
                <div className="text-sm text-gray-600">Percentil 65 - Normal</div>
              </div>
              <Badge variant="outline" className="bg-green-50 text-green-700">
                Adequado
              </Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <div className="font-medium">Peso para altura</div>
                <div className="text-sm text-gray-600">Percentil 72 - Normal</div>
              </div>
              <Badge variant="outline" className="bg-green-50 text-green-700">
                Adequado
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}