import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { 
  Pill, 
  Plus, 
  Clock, 
  CheckCircle, 
  X, 
  Bell, 
  AlertTriangle,
  Calendar,
  User,
  Heart
} from 'lucide-react';

export function PregnancyVitamins() {
  const { t } = useTranslation();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedVitamin, setSelectedVitamin] = useState<any>(null);

  // Mock data para vitaminas - será substituído por dados reais da API
  const vitaminsData = [
    {
      id: 1,
      vitaminName: 'Ácido Fólico',
      dosage: '400mcg',
      frequency: 'Diariamente',
      startDate: '2024-01-15',
      endDate: '2024-12-15',
      prescribedBy: 'Dr. Silva',
      importance: 'essential',
      category: 'prenatal',
      reminderEnabled: true,
      reminderTimes: ['08:00', '20:00'],
      active: true,
      notes: 'Essencial para prevenção de defeitos do tubo neural'
    },
    {
      id: 2,
      vitaminName: 'Ferro',
      dosage: '60mg',
      frequency: 'Diariamente',
      startDate: '2024-02-01',
      endDate: '2024-11-01',
      prescribedBy: 'Dr. Silva',
      importance: 'essential',
      category: 'specific_deficiency',
      reminderEnabled: true,
      reminderTimes: ['14:00'],
      active: true,
      notes: 'Para prevenção de anemia'
    },
    {
      id: 3,
      vitaminName: 'Cálcio',
      dosage: '1000mg',
      frequency: 'Diariamente',
      startDate: '2024-03-01',
      endDate: '2024-10-01',
      prescribedBy: 'Dr. Silva',
      importance: 'recommended',
      category: 'general_health',
      reminderEnabled: false,
      reminderTimes: ['12:00'],
      active: true,
      notes: 'Para desenvolvimento dos ossos do bebê'
    },
    {
      id: 4,
      vitaminName: 'Vitamina D',
      dosage: '2000 UI',
      frequency: 'Diariamente',
      startDate: '2024-01-20',
      endDate: '2024-12-20',
      prescribedBy: 'Dr. Silva',
      importance: 'recommended',
      category: 'general_health',
      reminderEnabled: true,
      reminderTimes: ['10:00'],
      active: true,
      notes: 'Para absorção de cálcio'
    }
  ];

  const vitaminLogs = [
    { id: 1, vitaminId: 1, date: '2024-01-16', time: '08:00', taken: true },
    { id: 2, vitaminId: 1, date: '2024-01-16', time: '20:00', taken: true },
    { id: 3, vitaminId: 2, date: '2024-01-16', time: '14:00', taken: false, notes: 'Esqueci' },
    { id: 4, vitaminId: 3, date: '2024-01-16', time: '12:00', taken: true },
    { id: 5, vitaminId: 4, date: '2024-01-16', time: '10:00', taken: true }
  ];

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case 'essential': return 'bg-red-100 text-red-800 border-red-200';
      case 'recommended': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'optional': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'prenatal': return 'bg-purple-100 text-purple-800';
      case 'specific_deficiency': return 'bg-orange-100 text-orange-800';
      case 'general_health': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const markVitaminTaken = (vitaminId: number) => {
    // Aqui seria chamada a API para marcar a vitamina como tomada
    console.log(`Marking vitamin ${vitaminId} as taken`);
  };

  const toggleVitaminReminder = (vitaminId: number) => {
    // Aqui seria chamada a API para alternar o lembrete
    console.log(`Toggling reminder for vitamin ${vitaminId}`);
  };

  const getTodaysVitamins = () => {
    return vitaminsData.filter(vitamin => vitamin.active);
  };

  const getVitaminStatus = (vitaminId: number) => {
    const todayLogs = vitaminLogs.filter(log => 
      log.vitaminId === vitaminId && 
      log.date === new Date().toISOString().split('T')[0]
    );
    
    const vitamin = vitaminsData.find(v => v.id === vitaminId);
    if (!vitamin) return { taken: 0, total: 0 };

    return {
      taken: todayLogs.filter(log => log.taken).length,
      total: vitamin.reminderTimes.length
    };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">{t('pregnancy.vitamins.title')}</h2>
          <p className="text-muted-foreground">{t('pregnancy.vitamins.description')}</p>
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              {t('pregnancy.vitamins.add_vitamin')}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{t('pregnancy.vitamins.add_vitamin')}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="vitaminName">{t('pregnancy.vitamins.vitamin_name')}</Label>
                <Input id="vitaminName" placeholder="Ex: Ácido Fólico" />
              </div>
              <div>
                <Label htmlFor="dosage">{t('pregnancy.vitamins.dosage')}</Label>
                <Input id="dosage" placeholder="Ex: 400mcg" />
              </div>
              <div>
                <Label htmlFor="frequency">{t('pregnancy.vitamins.frequency')}</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar frequência" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Diariamente</SelectItem>
                    <SelectItem value="twice_daily">2x ao dia</SelectItem>
                    <SelectItem value="weekly">Semanalmente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="importance">Importância</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar importância" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="essential">Essencial</SelectItem>
                    <SelectItem value="recommended">Recomendado</SelectItem>
                    <SelectItem value="optional">Opcional</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="prescribedBy">{t('pregnancy.vitamins.prescribed_by')}</Label>
                <Input id="prescribedBy" placeholder="Ex: Dr. Silva" />
              </div>
              <div>
                <Label htmlFor="notes">Observações</Label>
                <Textarea id="notes" placeholder="Observações adicionais" />
              </div>
              <div className="flex flex-col sm:flex-row gap-2 sm:justify-end">
                <Button variant="outline" onClick={() => setShowAddDialog(false)} className="w-full sm:w-auto">
                  {t('common.cancel')}
                </Button>
                <Button onClick={() => setShowAddDialog(false)} className="w-full sm:w-auto">
                  {t('common.add')}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Daily Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Pill className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium">Vitaminas Hoje</span>
              </div>
            </div>
            <div className="mt-2">
              <p className="text-2xl font-bold">
                {vitaminLogs.filter(log => log.taken && log.date === new Date().toISOString().split('T')[0]).length}
              </p>
              <p className="text-sm text-muted-foreground">
                de {vitaminLogs.filter(log => log.date === new Date().toISOString().split('T')[0]).length} tomadas
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium">Próxima Dose</span>
              </div>
            </div>
            <div className="mt-2">
              <p className="text-2xl font-bold">14:00</p>
              <p className="text-sm text-muted-foreground">Ferro - 60mg</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium">Lembretes</span>
              </div>
            </div>
            <div className="mt-2">
              <p className="text-2xl font-bold">
                {vitaminsData.filter(v => v.reminderEnabled).length}
              </p>
              <p className="text-sm text-muted-foreground">ativos</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Today's Vitamins */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Vitaminas de Hoje
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {getTodaysVitamins().map((vitamin) => {
              const status = getVitaminStatus(vitamin.id);
              return (
                <div key={vitamin.id} className="border rounded-lg p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">{vitamin.vitaminName}</h3>
                        <Badge className={getCategoryColor(vitamin.category)}>
                          {vitamin.category === 'prenatal' ? 'Pré-natal' : 
                           vitamin.category === 'specific_deficiency' ? 'Deficiência' : 
                           'Saúde Geral'}
                        </Badge>
                        <Badge variant="outline" className={getImportanceColor(vitamin.importance)}>
                          {vitamin.importance === 'essential' ? 'Essencial' : 
                           vitamin.importance === 'recommended' ? 'Recomendado' : 
                           'Opcional'}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        <span>{vitamin.dosage}</span>
                        <span>{vitamin.frequency}</span>
                        <span>Por {vitamin.prescribedBy}</span>
                      </div>
                      {vitamin.notes && (
                        <p className="text-sm text-muted-foreground mt-1">{vitamin.notes}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-center">
                        <div className="text-sm font-medium">
                          {status.taken}/{status.total}
                        </div>
                        <div className="text-xs text-muted-foreground">doses</div>
                      </div>
                      <Button
                        variant={status.taken >= status.total ? "default" : "outline"}
                        size="sm"
                        onClick={() => markVitaminTaken(vitamin.id)}
                        disabled={status.taken >= status.total}
                      >
                        {status.taken >= status.total ? (
                          <>
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Tomado
                          </>
                        ) : (
                          <>
                            <Plus className="h-4 w-4 mr-1" />
                            Tomar
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* All Vitamins */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-primary" />
            Todas as Vitaminas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {vitaminsData.map((vitamin) => (
              <div key={vitamin.id} className="border rounded-lg p-4">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold">{vitamin.vitaminName}</h3>
                      <Badge className={getCategoryColor(vitamin.category)}>
                        {vitamin.category === 'prenatal' ? 'Pré-natal' : 
                         vitamin.category === 'specific_deficiency' ? 'Deficiência' : 
                         'Saúde Geral'}
                      </Badge>
                      <Badge variant="outline" className={getImportanceColor(vitamin.importance)}>
                        {vitamin.importance === 'essential' ? 'Essencial' : 
                         vitamin.importance === 'recommended' ? 'Recomendado' : 
                         'Opcional'}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="font-medium">Dosagem:</span> {vitamin.dosage}
                      </div>
                      <div>
                        <span className="font-medium">Frequência:</span> {vitamin.frequency}
                      </div>
                      <div>
                        <span className="font-medium">Prescritor:</span> {vitamin.prescribedBy}
                      </div>
                      <div>
                        <span className="font-medium">Horários:</span> {vitamin.reminderTimes.join(', ')}
                      </div>
                    </div>
                    {vitamin.notes && (
                      <p className="text-sm text-muted-foreground mt-2">{vitamin.notes}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Switch
                        checked={vitamin.reminderEnabled}
                        onCheckedChange={() => toggleVitaminReminder(vitamin.id)}
                      />
                      <span className="text-sm text-muted-foreground">
                        {vitamin.reminderEnabled ? 'Lembrete ativo' : 'Lembrete inativo'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Weekly Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Progresso Semanal
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-green-600">85%</p>
              <p className="text-sm text-muted-foreground">Aderência</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-600">28</p>
              <p className="text-sm text-muted-foreground">Doses tomadas</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-red-600">5</p>
              <p className="text-sm text-muted-foreground">Doses perdidas</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-600">4</p>
              <p className="text-sm text-muted-foreground">Vitaminas ativas</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}