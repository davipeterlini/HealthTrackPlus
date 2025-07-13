import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Clock, Utensils, Calendar } from 'lucide-react';

interface BabyFeedingProps {
  babyId: number;
}

export function BabyFeeding({ babyId }: BabyFeedingProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [feedingType, setFeedingType] = useState('breastfeeding');

  // Mock data
  const feedings = [
    {
      id: 1,
      date: '2024-06-15',
      time: '08:30',
      feedingType: 'breastfeeding',
      duration: 25,
      side: 'both',
      notes: 'Mamou bem, ficou satisfeito'
    },
    {
      id: 2,
      date: '2024-06-15',
      time: '11:15',
      feedingType: 'bottle_formula',
      amount: 120,
      formula: 'Aptamil',
      notes: 'Tomou toda a mamadeira'
    },
    {
      id: 3,
      date: '2024-06-15',
      time: '14:00',
      feedingType: 'solid_food',
      foodDescription: 'Papinha de banana',
      notes: 'Primeira experiência com sólidos'
    }
  ];

  const feedingTypes = [
    { value: 'breastfeeding', label: 'Amamentação', icon: '🤱' },
    { value: 'bottle_formula', label: 'Mamadeira (Fórmula)', icon: '🍼' },
    { value: 'bottle_breast_milk', label: 'Mamadeira (Leite Materno)', icon: '🍼' },
    { value: 'solid_food', label: 'Alimento Sólido', icon: '🥄' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsOpen(false);
  };

  const getFeedingIcon = (type: string) => {
    return feedingTypes.find(t => t.value === type)?.icon || '🍼';
  };

  const getFeedingLabel = (type: string) => {
    return feedingTypes.find(t => t.value === type)?.label || type;
  };

  const formatTime = (time: string) => {
    return new Date(`2024-01-01T${time}`).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Alimentação</h3>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Registrar Alimentação
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Registrar Alimentação</DialogTitle>
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
                  <Label htmlFor="time">Hora</Label>
                  <Input 
                    id="time" 
                    type="time" 
                    defaultValue={new Date().toTimeString().slice(0, 5)}
                    required 
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="feedingType">Tipo de Alimentação</Label>
                <Select value={feedingType} onValueChange={setFeedingType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {feedingTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex items-center gap-2">
                          <span>{type.icon}</span>
                          {type.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {feedingType === 'breastfeeding' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="duration">Duração (minutos)</Label>
                    <Input id="duration" type="number" placeholder="25" />
                  </div>
                  <div>
                    <Label htmlFor="side">Lado</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="left">Esquerdo</SelectItem>
                        <SelectItem value="right">Direito</SelectItem>
                        <SelectItem value="both">Ambos</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {(feedingType === 'bottle_formula' || feedingType === 'bottle_breast_milk') && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="amount">Quantidade (ml)</Label>
                    <Input id="amount" type="number" placeholder="120" />
                  </div>
                  {feedingType === 'bottle_formula' && (
                    <div>
                      <Label htmlFor="formula">Fórmula</Label>
                      <Input id="formula" placeholder="Ex: Aptamil" />
                    </div>
                  )}
                </div>
              )}

              {feedingType === 'solid_food' && (
                <div>
                  <Label htmlFor="foodDescription">Descrição do Alimento</Label>
                  <Input id="foodDescription" placeholder="Ex: Papinha de banana" />
                </div>
              )}

              <div>
                <Label htmlFor="notes">Observações</Label>
                <Input id="notes" placeholder="Observações sobre a alimentação..." />
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">Registrar</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Today's Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Resumo de Hoje
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">6</div>
              <div className="text-sm text-blue-600">Refeições</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">3</div>
              <div className="text-sm text-green-600">Amamentações</div>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">2</div>
              <div className="text-sm text-orange-600">Mamadeiras</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">1</div>
              <div className="text-sm text-purple-600">Sólidos</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Feeding History */}
      <div className="space-y-4">
        <h4 className="font-medium">Histórico de Alimentações</h4>
        {feedings.map((feeding) => (
          <Card key={feeding.id}>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="text-2xl">
                  {getFeedingIcon(feeding.feedingType)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-medium">{getFeedingLabel(feeding.feedingType)}</h5>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Clock className="h-3 w-3" />
                      {formatTime(feeding.time)}
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-2">
                    {feeding.duration && (
                      <Badge variant="outline">
                        {feeding.duration} min
                      </Badge>
                    )}
                    {feeding.amount && (
                      <Badge variant="outline">
                        {feeding.amount} ml
                      </Badge>
                    )}
                    {feeding.side && (
                      <Badge variant="outline">
                        {feeding.side === 'both' ? 'Ambos os lados' : 
                         feeding.side === 'left' ? 'Lado esquerdo' : 'Lado direito'}
                      </Badge>
                    )}
                    {feeding.formula && (
                      <Badge variant="outline">
                        {feeding.formula}
                      </Badge>
                    )}
                  </div>
                  
                  {feeding.foodDescription && (
                    <div className="text-sm text-gray-600 mb-2">
                      <span className="font-medium">Alimento:</span> {feeding.foodDescription}
                    </div>
                  )}
                  
                  {feeding.notes && (
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Observações:</span> {feeding.notes}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}