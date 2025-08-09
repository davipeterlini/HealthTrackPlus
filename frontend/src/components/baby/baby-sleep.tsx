import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Plus, Clock, Moon, Sun, Calendar } from 'lucide-react';

interface BabySleepProps {
  babyId: number;
}

export function BabySleep({ babyId }: BabySleepProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [sleepType, setSleepType] = useState('nap');

  // Mock data
  const sleepRecords = [
    {
      id: 1,
      date: '2024-06-15',
      startTime: '14:30',
      endTime: '16:00',
      duration: 90,
      sleepType: 'nap',
      location: 'crib',
      quality: 'peaceful',
      notes: 'Dormiu bem após o almoço'
    },
    {
      id: 2,
      date: '2024-06-14',
      startTime: '20:00',
      endTime: '06:30',
      duration: 630,
      sleepType: 'night_sleep',
      location: 'crib',
      quality: 'restless',
      notes: 'Acordou duas vezes durante a noite'
    },
    {
      id: 3,
      date: '2024-06-14',
      startTime: '10:30',
      endTime: '11:45',
      duration: 75,
      sleepType: 'nap',
      location: 'stroller',
      quality: 'peaceful',
      notes: 'Cochilo durante o passeio'
    }
  ];

  const sleepTypes = [
    { value: 'nap', label: 'Cochilo', icon: '😴' },
    { value: 'night_sleep', label: 'Sono Noturno', icon: '🌙' }
  ];

  const locations = [
    { value: 'crib', label: 'Berço' },
    { value: 'bed', label: 'Cama' },
    { value: 'car_seat', label: 'Cadeirinha do Carro' },
    { value: 'stroller', label: 'Carrinho' }
  ];

  const qualities = [
    { value: 'peaceful', label: 'Tranquilo', color: 'bg-green-50 text-green-700' },
    { value: 'restless', label: 'Agitado', color: 'bg-yellow-50 text-yellow-700' },
    { value: 'interrupted', label: 'Interrompido', color: 'bg-red-50 text-red-700' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsOpen(false);
  };

  const getSleepIcon = (type: string) => {
    return sleepTypes.find(t => t.value === type)?.icon || '😴';
  };

  const getSleepLabel = (type: string) => {
    return sleepTypes.find(t => t.value === type)?.label || type;
  };

  const getLocationLabel = (location: string) => {
    return locations.find(l => l.value === location)?.label || location;
  };

  const getQualityLabel = (quality: string) => {
    return qualities.find(q => q.value === quality)?.label || quality;
  };

  const getQualityColor = (quality: string) => {
    return qualities.find(q => q.value === quality)?.color || 'bg-gray-50 text-gray-700';
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const formatTime = (time: string) => {
    return new Date(`2024-01-01T${time}`).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Calculate today's sleep stats
  const todaySleep = sleepRecords.filter(record => record.date === '2024-06-15');
  const totalSleep = todaySleep.reduce((sum, record) => sum + record.duration, 0);
  const naps = todaySleep.filter(record => record.sleepType === 'nap').length;
  const nightSleep = todaySleep.filter(record => record.sleepType === 'night_sleep').length;
  const recommendedSleep = 14 * 60; // 14 hours in minutes
  const sleepPercentage = (totalSleep / recommendedSleep) * 100;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Sono</h3>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Registrar Sono
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Registrar Sono</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="sleepType">Tipo de Sono</Label>
                <Select value={sleepType} onValueChange={setSleepType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {sleepTypes.map((type) => (
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
                  <Label htmlFor="location">Local</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o local" />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.map((location) => (
                        <SelectItem key={location.value} value={location.value}>
                          {location.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startTime">Hora de Início</Label>
                  <Input 
                    id="startTime" 
                    type="time" 
                    required 
                  />
                </div>
                <div>
                  <Label htmlFor="endTime">Hora de Fim</Label>
                  <Input 
                    id="endTime" 
                    type="time" 
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="quality">Qualidade do Sono</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a qualidade" />
                  </SelectTrigger>
                  <SelectContent>
                    {qualities.map((quality) => (
                      <SelectItem key={quality.value} value={quality.value}>
                        {quality.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="notes">Observações</Label>
                <Input id="notes" placeholder="Observações sobre o sono..." />
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

      {/* Sleep Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Resumo do Sono - Hoje
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {formatDuration(totalSleep)}
              </div>
              <div className="text-sm text-blue-600">Total</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{naps}</div>
              <div className="text-sm text-green-600">Cochilos</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{nightSleep}</div>
              <div className="text-sm text-purple-600">Sono Noturno</div>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                {sleepPercentage.toFixed(0)}%
              </div>
              <div className="text-sm text-orange-600">Meta Diária</div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Meta diária de sono: {formatDuration(recommendedSleep)}</span>
              <span>{formatDuration(totalSleep)} / {formatDuration(recommendedSleep)}</span>
            </div>
            <Progress value={Math.min(sleepPercentage, 100)} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Sleep Records */}
      <div className="space-y-4">
        <h4 className="font-medium">Histórico de Sono</h4>
        {sleepRecords.map((record) => (
          <Card key={record.id}>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="text-2xl">
                  {getSleepIcon(record.sleepType)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-medium">{getSleepLabel(record.sleepType)}</h5>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Clock className="h-3 w-3" />
                      {formatTime(record.startTime)} - {record.endTime ? formatTime(record.endTime) : 'Em andamento'}
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-2">
                    <Badge variant="outline">
                      {formatDuration(record.duration)}
                    </Badge>
                    <Badge variant="outline">
                      {getLocationLabel(record.location)}
                    </Badge>
                    <Badge variant="outline" className={getQualityColor(record.quality)}>
                      {getQualityLabel(record.quality)}
                    </Badge>
                  </div>
                  
                  {record.notes && (
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Observações:</span> {record.notes}
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