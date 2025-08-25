import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Circle, Clock, Star, Calendar, Camera } from 'lucide-react';

interface BabyMilestonesProps {
  babyId: number;
}

export function BabyMilestones({ babyId }: BabyMilestonesProps) {
  const [selectedCategory, setSelectedCategory] = useState('motor');

  const milestoneCategories = [
    { id: 'motor', name: 'Motor', icon: '🏃', color: 'bg-blue-500' },
    { id: 'cognitive', name: 'Cognitivo', icon: '🧠', color: 'bg-purple-500' },
    { id: 'social', name: 'Social', icon: '😊', color: 'bg-green-500' },
    { id: 'language', name: 'Linguagem', icon: '💬', color: 'bg-orange-500' }
  ];

  const milestones = {
    motor: [
      {
        id: 1,
        name: 'Segura a cabeça',
        expectedAge: 45,
        achieved: true,
        achievedDate: '2024-03-01',
        actualAge: 45,
        description: 'Consegue manter a cabeça erguida por alguns segundos'
      },
      {
        id: 2,
        name: 'Rola de bruços para costas',
        expectedAge: 90,
        achieved: true,
        achievedDate: '2024-04-15',
        actualAge: 90,
        description: 'Consegue rolar do peito para as costas'
      },
      {
        id: 3,
        name: 'Senta sem apoio',
        expectedAge: 180,
        achieved: false,
        description: 'Consegue sentar sem apoio por pelo menos 30 segundos'
      },
      {
        id: 4,
        name: 'Engatinha',
        expectedAge: 270,
        achieved: false,
        description: 'Consegue engatinhar para frente'
      }
    ],
    cognitive: [
      {
        id: 5,
        name: 'Reconhece rostos familiares',
        expectedAge: 60,
        achieved: true,
        achievedDate: '2024-03-20',
        actualAge: 64,
        description: 'Demonstra reconhecimento ao ver rostos conhecidos'
      },
      {
        id: 6,
        name: 'Segue objetos com o olhar',
        expectedAge: 90,
        achieved: true,
        achievedDate: '2024-04-10',
        actualAge: 85,
        description: 'Acompanha objetos em movimento com os olhos'
      },
      {
        id: 7,
        name: 'Procura objetos escondidos',
        expectedAge: 240,
        achieved: false,
        description: 'Procura por objetos que foram escondidos na sua frente'
      }
    ],
    social: [
      {
        id: 8,
        name: 'Primeiro sorriso',
        expectedAge: 45,
        achieved: true,
        achievedDate: '2024-03-01',
        actualAge: 45,
        description: 'Primeiro sorriso social em resposta a estímulos'
      },
      {
        id: 9,
        name: 'Imita expressões faciais',
        expectedAge: 120,
        achieved: true,
        achievedDate: '2024-05-10',
        actualAge: 115,
        description: 'Imita expressões faciais simples'
      },
      {
        id: 10,
        name: 'Brinca de esconde-esconde',
        expectedAge: 270,
        achieved: false,
        description: 'Participa ativamente do jogo de esconde-esconde'
      }
    ],
    language: [
      {
        id: 11,
        name: 'Primeiros sons',
        expectedAge: 60,
        achieved: true,
        achievedDate: '2024-03-15',
        actualAge: 59,
        description: 'Faz sons além do choro'
      },
      {
        id: 12,
        name: 'Balbucia',
        expectedAge: 180,
        achieved: false,
        description: 'Produz sons como "ma-ma" ou "da-da"'
      },
      {
        id: 13,
        name: 'Primeira palavra',
        expectedAge: 365,
        achieved: false,
        description: 'Diz sua primeira palavra com significado'
      }
    ]
  };

  const currentMilestones = milestones[selectedCategory];
  const achievedCount = currentMilestones.filter(m => m.achieved).length;
  const completionRate = (achievedCount / currentMilestones.length) * 100;

  const formatAge = (days: number) => {
    const months = Math.floor(days / 30);
    const remainingDays = days % 30;
    return `${months}m ${remainingDays}d`;
  };

  const getAgeStatus = (milestone: any, currentAge: number = 180) => {
    if (milestone.achieved) {
      return milestone.actualAge <= milestone.expectedAge ? 'early' : 'late';
    }
    return currentAge >= milestone.expectedAge ? 'overdue' : 'upcoming';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'early': return 'text-green-600 bg-green-50';
      case 'late': return 'text-orange-600 bg-orange-50';
      case 'overdue': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'early': return 'Precoce';
      case 'late': return 'Tardio';
      case 'overdue': return 'Atrasado';
      default: return 'Previsto';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Marcos do Desenvolvimento</h3>
        <div className="flex items-center gap-2">
          <Star className="h-4 w-4 text-yellow-500" />
          <span className="text-sm text-gray-600">
            {achievedCount} de {currentMilestones.length} alcançados
          </span>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {milestoneCategories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? "default" : "outline"}
            onClick={() => setSelectedCategory(category.id)}
            className="flex items-center gap-2 whitespace-nowrap"
          >
            <span>{category.icon}</span>
            {category.name}
          </Button>
        ))}
      </div>

      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${milestoneCategories.find(c => c.id === selectedCategory)?.color}`} />
            Progresso - {milestoneCategories.find(c => c.id === selectedCategory)?.name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Marcos alcançados</span>
              <span>{achievedCount}/{currentMilestones.length}</span>
            </div>
            <Progress value={completionRate} className="h-2" />
            <div className="text-xs text-gray-500">
              {completionRate.toFixed(0)}% concluído
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Milestones List */}
      <div className="space-y-4">
        {currentMilestones.map((milestone) => {
          const status = getAgeStatus(milestone);
          return (
            <Card key={milestone.id} className="relative">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    {milestone.achieved ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <Circle className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className={`font-medium ${milestone.achieved ? 'text-green-700' : 'text-gray-900'}`}>
                        {milestone.name}
                      </h4>
                      <Badge variant="outline" className={getStatusColor(status)}>
                        {getStatusText(status)}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      {milestone.description}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Esperado: {formatAge(milestone.expectedAge)}
                      </div>
                      {milestone.achieved && (
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Alcançado: {new Date(milestone.achievedDate).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                    {!milestone.achieved && (
                      <div className="mt-2">
                        <Button size="sm" variant="outline">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Marcar como alcançado
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}