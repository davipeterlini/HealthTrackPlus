import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Camera, Calendar } from 'lucide-react';

interface BabyMeasurementsProps {
  babyId: number;
}

export function BabyMeasurements({ babyId }: BabyMeasurementsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [editingMeasurement, setEditingMeasurement] = useState(null);

  // Mock data - será substituído por dados reais da API
  const measurements = [
    {
      id: 1,
      date: '2024-06-15',
      ageInDays: 180,
      weight: 6500,
      height: 65,
      headCircumference: 42,
      notes: 'Consulta de rotina - desenvolvimento normal',
      measuredBy: 'Pediatra',
      photoUrl: null
    },
    {
      id: 2,
      date: '2024-05-15',
      ageInDays: 150,
      weight: 6200,
      height: 64,
      headCircumference: 41,
      notes: 'Vacinação - bebê estava bem',
      measuredBy: 'Enfermeira',
      photoUrl: null
    },
    {
      id: 3,
      date: '2024-04-15',
      ageInDays: 120,
      weight: 5800,
      height: 63,
      headCircumference: 40,
      notes: 'Consulta de acompanhamento',
      measuredBy: 'Pediatra',
      photoUrl: null
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Implementar lógica de salvamento
    setIsOpen(false);
    setEditingMeasurement(null);
  };

  const formatAge = (days: number) => {
    const months = Math.floor(days / 30);
    const remainingDays = days % 30;
    return `${months}m ${remainingDays}d`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Medições e Crescimento</h3>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Medição
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingMeasurement ? 'Editar Medição' : 'Nova Medição'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date">Data</Label>
                  <Input 
                    id="date" 
                    type="date" 
                    defaultValue={new Date().toISOString().split('T')[0]}
                    required 
                  />
                </div>
                <div>
                  <Label htmlFor="measuredBy">Medido por</Label>
                  <Input 
                    id="measuredBy" 
                    placeholder="Ex: Pediatra, Pais"
                    defaultValue="Pais"
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="weight">Peso (kg)</Label>
                  <Input 
                    id="weight" 
                    type="number" 
                    step="0.1" 
                    placeholder="Ex: 6.5"
                    required 
                  />
                </div>
                <div>
                  <Label htmlFor="height">Altura (cm)</Label>
                  <Input 
                    id="height" 
                    type="number" 
                    placeholder="Ex: 65"
                    required 
                  />
                </div>
                <div>
                  <Label htmlFor="headCircumference">Perímetro Cefálico (cm)</Label>
                  <Input 
                    id="headCircumference" 
                    type="number" 
                    placeholder="Ex: 42"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="notes">Observações</Label>
                <Textarea 
                  id="notes" 
                  placeholder="Observações sobre a medição..."
                  rows={3}
                />
              </div>
              <div className="flex items-center gap-2">
                <Button type="button" variant="outline" size="sm">
                  <Camera className="h-4 w-4 mr-2" />
                  Adicionar Foto
                </Button>
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingMeasurement ? 'Salvar' : 'Adicionar'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {measurements.map((measurement) => (
          <Card key={measurement.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">
                    {new Date(measurement.date).toLocaleDateString()}
                  </span>
                  <Badge variant="outline">
                    {formatAge(measurement.ageInDays)}
                  </Badge>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => {
                    setEditingMeasurement(measurement);
                    setIsOpen(true);
                  }}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="grid grid-cols-3 gap-4 mb-3">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {(measurement.weight / 1000).toFixed(1)}
                  </div>
                  <div className="text-sm text-blue-600">kg</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {measurement.height}
                  </div>
                  <div className="text-sm text-green-600">cm</div>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {measurement.headCircumference}
                  </div>
                  <div className="text-sm text-purple-600">cm</div>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Medido por:</span>
                  <span className="text-gray-600">{measurement.measuredBy}</span>
                </div>
                {measurement.notes && (
                  <div>
                    <span className="font-medium">Observações:</span>
                    <p className="text-gray-600 mt-1">{measurement.notes}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}