import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Milk, 
  Plus, 
  Droplets, 
  Clock, 
  Calendar, 
  TrendingUp,
  Baby
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

interface MilkConsumption {
  id: number;
  date: string;
  time: string;
  milkType: string;
  amount: number;
  duration?: number;
  notes?: string;
  temperature?: string;
  feedingMethod: string;
}

interface BabyMilkConsumptionProps {
  babyId: number;
}

export function BabyMilkConsumption({ babyId }: BabyMilkConsumptionProps) {
  const { t } = useTranslation();
  const [showAddDialog, setShowAddDialog] = useState(false);
  
  // Mock data - será substituído por dados reais da API
  const dailyGoal = 800; // ml por dia
  const consumptionData: MilkConsumption[] = [
    {
      id: 1,
      date: '2024-01-15',
      time: '07:30',
      milkType: 'formula',
      amount: 120,
      feedingMethod: 'bottle',
      temperature: 'warm'
    },
    {
      id: 2,
      date: '2024-01-15',
      time: '11:00',
      milkType: 'breast_milk',
      amount: 100,
      duration: 15,
      feedingMethod: 'breastfeeding'
    },
    {
      id: 3,
      date: '2024-01-15',
      time: '14:30',
      milkType: 'formula',
      amount: 130,
      feedingMethod: 'bottle',
      temperature: 'warm'
    },
    {
      id: 4,
      date: '2024-01-15',
      time: '18:00',
      milkType: 'formula',
      amount: 110,
      feedingMethod: 'bottle',
      temperature: 'warm'
    },
    {
      id: 5,
      date: '2024-01-15',
      time: '21:30',
      milkType: 'breast_milk',
      amount: 90,
      duration: 12,
      feedingMethod: 'breastfeeding'
    }
  ];

  const todayConsumption = consumptionData.reduce((total, consumption) => total + consumption.amount, 0);
  const consumptionPercentage = Math.min((todayConsumption / dailyGoal) * 100, 100);
  const remaining = Math.max(dailyGoal - todayConsumption, 0);

  const getMilkTypeLabel = (type: string) => {
    switch (type) {
      case 'breast_milk': return 'Leite Materno';
      case 'formula': return 'Fórmula';
      case 'cow_milk': return 'Leite de Vaca';
      default: return type;
    }
  };

  const getFeedingMethodLabel = (method: string) => {
    switch (method) {
      case 'breastfeeding': return 'Amamentação';
      case 'bottle': return 'Mamadeira';
      case 'cup': return 'Copo';
      case 'spoon': return 'Colher';
      default: return method;
    }
  };

  const handleAddConsumption = () => {
    // Implementar lógica para adicionar consumo
    console.log('Adicionar consumo de leite');
    setShowAddDialog(false);
  };

  const handleQuickAdd = (amount: number) => {
    // Implementar lógica para adicionar quantidade rápida
    console.log('Adicionar quantidade rápida:', amount);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">
            {t('baby.milk_consumption')}
          </h2>
          <p className="text-muted-foreground">
            {t('baby.milk_consumption_description', 'Monitore o consumo diário de leite do bebê')}
          </p>
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              {t('baby.add_milk_intake')}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{t('baby.add_milk_intake')}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="milkType">{t('baby.milk_type')}</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo de leite" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="breast_milk">Leite Materno</SelectItem>
                    <SelectItem value="formula">Fórmula</SelectItem>
                    <SelectItem value="cow_milk">Leite de Vaca</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="amount">{t('baby.amount')} (ml)</Label>
                <Input id="amount" type="number" placeholder="120" />
              </div>
              <div>
                <Label htmlFor="time">{t('baby.time')}</Label>
                <Input id="time" type="time" />
              </div>
              <div>
                <Label htmlFor="feedingMethod">Método de Alimentação</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o método" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="breastfeeding">Amamentação</SelectItem>
                    <SelectItem value="bottle">Mamadeira</SelectItem>
                    <SelectItem value="cup">Copo</SelectItem>
                    <SelectItem value="spoon">Colher</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="notes">Observações</Label>
                <Textarea id="notes" placeholder="Observações adicionais" />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                  {t('common.cancel')}
                </Button>
                <Button onClick={handleAddConsumption}>
                  {t('common.add')}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Resumo Diário */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Droplets className="h-5 w-5 text-blue-500" />
                <span className="text-sm font-medium">{t('baby.daily_milk_goal')}</span>
              </div>
            </div>
            <div className="mt-2">
              <div className="text-2xl font-bold">{dailyGoal} ml</div>
              <div className="text-sm text-muted-foreground">Meta diária</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                <span className="text-sm font-medium">{t('baby.total_consumed')}</span>
              </div>
            </div>
            <div className="mt-2">
              <div className="text-2xl font-bold">{todayConsumption} ml</div>
              <div className="text-sm text-muted-foreground">{Math.round(consumptionPercentage)}% da meta</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Baby className="h-5 w-5 text-orange-500" />
                <span className="text-sm font-medium">{t('baby.remaining')}</span>
              </div>
            </div>
            <div className="mt-2">
              <div className="text-2xl font-bold">{remaining} ml</div>
              <div className="text-sm text-muted-foreground">Para atingir a meta</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progresso do Dia */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Droplets className="h-5 w-5 text-blue-500" />
            Progresso do Dia
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-medium">{todayConsumption} ml de {dailyGoal} ml</span>
              <span className="text-sm text-muted-foreground">{Math.round(consumptionPercentage)}%</span>
            </div>
            <Progress value={consumptionPercentage} className="h-3" />
            
            {/* Botões de Adição Rápida */}
            <div className="flex gap-2 mt-4">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleQuickAdd(60)}
              >
                <Plus className="h-4 w-4 mr-1" />
                +60ml
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleQuickAdd(120)}
              >
                <Plus className="h-4 w-4 mr-1" />
                +120ml
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleQuickAdd(180)}
              >
                <Plus className="h-4 w-4 mr-1" />
                +180ml
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Histórico do Dia */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-gray-500" />
            Histórico de Hoje
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {consumptionData.map((consumption) => (
              <div key={consumption.id} className="border rounded-lg p-3">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">{consumption.time}</span>
                      <Badge variant="outline">
                        {getMilkTypeLabel(consumption.milkType)}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {getFeedingMethodLabel(consumption.feedingMethod)}
                      {consumption.duration && ` • ${consumption.duration} min`}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-blue-600">
                      {consumption.amount} ml
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {consumptionData.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Milk className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>{t('baby.no_milk_consumption', 'Nenhum consumo registrado hoje')}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}