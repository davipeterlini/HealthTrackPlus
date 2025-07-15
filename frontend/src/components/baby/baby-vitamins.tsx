import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Pill, 
  Plus, 
  Calendar, 
  Clock, 
  AlertCircle, 
  CheckCircle,
  Edit,
  Trash2
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

interface BabyVitamin {
  id: number;
  vitaminName: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate?: string;
  prescribedBy?: string;
  instructions?: string;
  active: boolean;
  nextDose: string;
  completed: number;
  total: number;
}

interface BabyVitaminsProps {
  babyId: number;
}

export function BabyVitamins({ babyId }: BabyVitaminsProps) {
  const { t } = useTranslation();
  const [showAddDialog, setShowAddDialog] = useState(false);
  
  // Mock data - será substituído por dados reais da API
  const vitamins: BabyVitamin[] = [
    {
      id: 1,
      vitaminName: 'Vitamina D',
      dosage: '400 UI',
      frequency: 'daily',
      startDate: '2024-01-15',
      endDate: '2024-12-31',
      prescribedBy: 'Dr. Silva',
      instructions: 'Administrar pela manhã com o leite',
      active: true,
      nextDose: '08:00',
      completed: 30,
      total: 365
    },
    {
      id: 2,
      vitaminName: 'Ferro',
      dosage: '10mg',
      frequency: 'daily',
      startDate: '2024-02-01',
      prescribedBy: 'Dr. Silva',
      instructions: 'Longe das refeições',
      active: true,
      nextDose: '14:00',
      completed: 15,
      total: 90
    },
    {
      id: 3,
      vitaminName: 'Vitamina C',
      dosage: '25mg',
      frequency: 'daily',
      startDate: '2024-01-20',
      endDate: '2024-04-20',
      active: false,
      nextDose: '',
      completed: 90,
      total: 90
    }
  ];

  const activeVitamins = vitamins.filter(v => v.active);
  const completedVitamins = vitamins.filter(v => !v.active);

  const getFrequencyLabel = (frequency: string) => {
    switch (frequency) {
      case 'daily': return t('common.daily', 'Diário');
      case 'weekly': return t('common.weekly', 'Semanal');
      case 'monthly': return t('common.monthly', 'Mensal');
      default: return frequency;
    }
  };

  const handleAddVitamin = () => {
    // Implementar lógica para adicionar vitamina
    console.log('Adicionar vitamina');
    setShowAddDialog(false);
  };

  const handleMarkTaken = (vitaminId: number) => {
    // Implementar lógica para marcar vitamina como tomada
    console.log('Marcar vitamina como tomada:', vitaminId);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t('baby.vitamins')}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Controle as vitaminas e suplementos do bebê
          </p>
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button className="bg-yellow-500 hover:bg-yellow-600">
              <Plus className="h-4 w-4 mr-2" />
              {t('baby.add_vitamin')}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{t('baby.add_vitamin')}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="vitaminName">{t('baby.vitamin_name')}</Label>
                <Input id="vitaminName" placeholder="Ex: Vitamina D" />
              </div>
              <div>
                <Label htmlFor="dosage">{t('baby.dosage')}</Label>
                <Input id="dosage" placeholder="Ex: 400 UI" />
              </div>
              <div>
                <Label htmlFor="frequency">{t('baby.frequency')}</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a frequência" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Diário</SelectItem>
                    <SelectItem value="weekly">Semanal</SelectItem>
                    <SelectItem value="monthly">Mensal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startDate">{t('baby.start_date')}</Label>
                  <Input id="startDate" type="date" />
                </div>
                <div>
                  <Label htmlFor="endDate">{t('baby.end_date')}</Label>
                  <Input id="endDate" type="date" />
                </div>
              </div>
              <div>
                <Label htmlFor="instructions">Instruções</Label>
                <Textarea id="instructions" placeholder="Instruções de administração" />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                  {t('common.cancel')}
                </Button>
                <Button onClick={handleAddVitamin}>
                  {t('common.add')}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Vitaminas Ativas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Pill className="h-5 w-5 text-yellow-500" />
            Vitaminas Ativas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activeVitamins.map((vitamin) => (
              <div key={vitamin.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-lg">{vitamin.vitaminName}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {vitamin.dosage} • {getFrequencyLabel(vitamin.frequency)}
                    </p>
                    {vitamin.prescribedBy && (
                      <p className="text-sm text-gray-500">
                        Prescrito por: {vitamin.prescribedBy}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-green-600 border-green-600">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      {vitamin.completed}/{vitamin.total}
                    </Badge>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleMarkTaken(vitamin.id)}
                    >
                      <Clock className="h-4 w-4 mr-1" />
                      {vitamin.nextDose}
                    </Button>
                  </div>
                </div>
                
                <div className="mb-3">
                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                    <span>Progresso</span>
                    <span>{Math.round((vitamin.completed / vitamin.total) * 100)}%</span>
                  </div>
                  <Progress value={(vitamin.completed / vitamin.total) * 100} className="h-2" />
                </div>
                
                {vitamin.instructions && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      <AlertCircle className="h-4 w-4 inline mr-1" />
                      {vitamin.instructions}
                    </p>
                  </div>
                )}
              </div>
            ))}
            
            {activeVitamins.length === 0 && (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <Pill className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>Nenhuma vitamina ativa cadastrada</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Vitaminas Concluídas */}
      {completedVitamins.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Vitaminas Concluídas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {completedVitamins.map((vitamin) => (
                <div key={vitamin.id} className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold">{vitamin.vitaminName}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {vitamin.dosage} • {getFrequencyLabel(vitamin.frequency)}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-green-600 border-green-600">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Concluído
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}