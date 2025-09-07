import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Plus, CheckCircle, Calendar, Clock, AlertCircle, Stethoscope } from 'lucide-react';

interface BabyVaccinationsProps {
  babyId: number;
}

export function BabyVaccinations({ babyId }: BabyVaccinationsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [editingVaccination, setEditingVaccination] = useState(null);

  // Mock data - cronograma de vacinação brasileiro
  const vaccinations = [
    {
      id: 1,
      vaccineName: 'BCG',
      scheduledDate: '2024-01-15',
      administeredDate: '2024-01-15',
      administered: true,
      location: 'Maternidade',
      doctorName: 'Dr. Silva',
      notes: 'Aplicada logo após o nascimento'
    },
    {
      id: 2,
      vaccineName: 'Hepatite B',
      scheduledDate: '2024-01-15',
      administeredDate: '2024-01-15',
      administered: true,
      location: 'Maternidade',
      doctorName: 'Dr. Silva',
      notes: 'Primeira dose aplicada'
    },
    {
      id: 3,
      vaccineName: 'Pentavalente (1ª dose)',
      scheduledDate: '2024-03-15',
      administeredDate: '2024-03-15',
      administered: true,
      location: 'Posto de Saúde',
      doctorName: 'Dra. Santos',
      notes: 'Bebê chorou, mas se acalmou rapidamente'
    },
    {
      id: 4,
      vaccineName: 'VIP (1ª dose)',
      scheduledDate: '2024-03-15',
      administeredDate: '2024-03-15',
      administered: true,
      location: 'Posto de Saúde',
      doctorName: 'Dra. Santos',
      notes: 'Aplicada junto com a Pentavalente'
    },
    {
      id: 5,
      vaccineName: 'Rotavírus (1ª dose)',
      scheduledDate: '2024-03-15',
      administeredDate: '2024-03-15',
      administered: true,
      location: 'Posto de Saúde',
      doctorName: 'Dra. Santos',
      notes: 'Vacina oral'
    },
    {
      id: 6,
      vaccineName: 'Pentavalente (2ª dose)',
      scheduledDate: '2024-05-15',
      administeredDate: '2024-05-15',
      administered: true,
      location: 'Posto de Saúde',
      doctorName: 'Dra. Santos',
      notes: 'Sem reações adversas'
    },
    {
      id: 7,
      vaccineName: 'VIP (2ª dose)',
      scheduledDate: '2024-05-15',
      administeredDate: '2024-05-15',
      administered: true,
      location: 'Posto de Saúde',
      doctorName: 'Dra. Santos',
      notes: 'Aplicada conforme cronograma'
    },
    {
      id: 8,
      vaccineName: 'Rotavírus (2ª dose)',
      scheduledDate: '2024-05-15',
      administeredDate: '2024-05-15',
      administered: true,
      location: 'Posto de Saúde',
      doctorName: 'Dra. Santos',
      notes: 'Vacina oral - segunda dose'
    },
    {
      id: 9,
      vaccineName: 'Pentavalente (3ª dose)',
      scheduledDate: '2024-07-15',
      administered: false,
      location: 'Posto de Saúde',
      notes: 'Agendada para próxima semana'
    },
    {
      id: 10,
      vaccineName: 'VIP (3ª dose)',
      scheduledDate: '2024-07-15',
      administered: false,
      location: 'Posto de Saúde',
      notes: 'Agendada junto com Pentavalente'
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsOpen(false);
    setEditingVaccination(null);
  };

  const getVaccinationStatus = (vaccination: any) => {
    if (vaccination.administered) {
      return { status: 'completed', color: 'bg-green-50 text-green-700', icon: CheckCircle };
    }
    
    const scheduledDate = new Date(vaccination.scheduledDate);
    const today = new Date();
    const daysDiff = Math.ceil((scheduledDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysDiff < 0) {
      return { status: 'overdue', color: 'bg-red-50 text-red-700', icon: AlertCircle };
    } else if (daysDiff <= 7) {
      return { status: 'upcoming', color: 'bg-yellow-50 text-yellow-700', icon: Clock };
    } else {
      return { status: 'scheduled', color: 'bg-blue-50 text-blue-700', icon: Calendar };
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Aplicada';
      case 'overdue': return 'Atrasada';
      case 'upcoming': return 'Próxima';
      case 'scheduled': return 'Agendada';
      default: return 'Pendente';
    }
  };

  const completedVaccinations = vaccinations.filter(v => v.administered).length;
  const totalVaccinations = vaccinations.length;
  const completionRate = (completedVaccinations / totalVaccinations) * 100;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Vacinação</h3>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Vacina
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingVaccination ? 'Editar Vacina' : 'Adicionar Nova Vacina'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="vaccineName">Nome da Vacina</Label>
                <Input 
                  id="vaccineName" 
                  placeholder="Ex: BCG, Hepatite B"
                  required 
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="scheduledDate">Data Agendada</Label>
                  <Input 
                    id="scheduledDate" 
                    type="date" 
                    required 
                  />
                </div>
                <div>
                  <Label htmlFor="administeredDate">Data Aplicada</Label>
                  <Input 
                    id="administeredDate" 
                    type="date" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="location">Local</Label>
                  <Input 
                    id="location" 
                    placeholder="Ex: Posto de Saúde"
                  />
                </div>
                <div>
                  <Label htmlFor="doctorName">Médico/Enfermeiro</Label>
                  <Input 
                    id="doctorName" 
                    placeholder="Ex: Dr. Silva"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="batchNumber">Lote</Label>
                <Input 
                  id="batchNumber" 
                  placeholder="Número do lote da vacina"
                />
              </div>

              <div>
                <Label htmlFor="sideEffects">Efeitos Colaterais</Label>
                <Input 
                  id="sideEffects" 
                  placeholder="Ex: Febre baixa, irritabilidade"
                />
              </div>

              <div>
                <Label htmlFor="notes">Observações</Label>
                <Textarea 
                  id="notes" 
                  placeholder="Observações sobre a vacinação..."
                  rows={3}
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingVaccination ? 'Salvar' : 'Adicionar'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Vaccination Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Stethoscope className="h-5 w-5" />
            Progresso da Vacinação
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Vacinas aplicadas</span>
              <span className="text-sm text-gray-600">
                {completedVaccinations} de {totalVaccinations}
              </span>
            </div>
            <Progress value={completionRate} className="h-2" />
            <div className="text-xs text-gray-500">
              {completionRate.toFixed(0)}% do cronograma completo
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{completedVaccinations}</div>
                <div className="text-sm text-green-600">Aplicadas</div>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {vaccinations.filter(v => !v.administered).length}
                </div>
                <div className="text-sm text-blue-600">Pendentes</div>
              </div>
              <div className="text-center p-3 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">
                  {vaccinations.filter(v => {
                    const { status } = getVaccinationStatus(v);
                    return status === 'upcoming';
                  }).length}
                </div>
                <div className="text-sm text-yellow-600">Próximas</div>
              </div>
              <div className="text-center p-3 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">
                  {vaccinations.filter(v => {
                    const { status } = getVaccinationStatus(v);
                    return status === 'overdue';
                  }).length}
                </div>
                <div className="text-sm text-red-600">Atrasadas</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Vaccination Schedule */}
      <div className="space-y-4">
        <h4 className="font-medium">Cronograma de Vacinação</h4>
        {vaccinations.map((vaccination) => {
          const { status, color, icon: StatusIcon } = getVaccinationStatus(vaccination);
          return (
            <Card key={vaccination.id}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    <StatusIcon className="h-5 w-5 text-gray-500" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-medium">{vaccination.vaccineName}</h5>
                      <Badge variant="outline" className={color}>
                        {getStatusText(status)}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-2">
                      <div>
                        <span className="font-medium">Agendada:</span> {' '}
                        {new Date(vaccination.scheduledDate).toLocaleDateString()}
                      </div>
                      {vaccination.administeredDate && (
                        <div>
                          <span className="font-medium">Aplicada:</span> {' '}
                          {new Date(vaccination.administeredDate).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                    
                    {vaccination.location && (
                      <div className="text-sm text-gray-600 mb-1">
                        <span className="font-medium">Local:</span> {vaccination.location}
                      </div>
                    )}
                    
                    {vaccination.doctorName && (
                      <div className="text-sm text-gray-600 mb-1">
                        <span className="font-medium">Aplicada por:</span> {vaccination.doctorName}
                      </div>
                    )}
                    
                    {vaccination.notes && (
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Observações:</span> {vaccination.notes}
                      </div>
                    )}
                    
                    <div className="mt-2 flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => {
                          setEditingVaccination(vaccination);
                          setIsOpen(true);
                        }}
                      >
                        Editar
                      </Button>
                      {!vaccination.administered && (
                        <Button size="sm" variant="outline">
                          Marcar como Aplicada
                        </Button>
                      )}
                    </div>
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