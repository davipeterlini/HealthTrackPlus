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
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { 
  FileText, 
  Plus, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  Calendar as CalendarIcon,
  MapPin,
  User,
  Bell,
  Upload,
  Download,
  Eye,
  Edit
} from 'lucide-react';

export function PregnancyExams() {
  const { t } = useTranslation();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedExam, setSelectedExam] = useState<any>(null);

  // Mock data para exames - será substituído por dados reais da API
  const examsData = [
    {
      id: 1,
      examName: 'Ultrassom Morfológico',
      examType: 'ultrasound',
      scheduledDate: '2024-01-25',
      completedDate: '2024-01-25',
      location: 'Clínica São Lucas',
      doctorName: 'Dr. Silva',
      status: 'completed',
      priority: 'high',
      alertEnabled: true,
      alertDaysBefore: 3,
      abnormalResults: false,
      requiresFollowUp: false,
      notes: 'Desenvolvimento normal do feto',
      results: {
        findings: 'Feto em desenvolvimento adequado',
        measurements: 'Dentro dos padrões normais',
        recommendations: 'Continuar pré-natal regular'
      }
    },
    {
      id: 2,
      examName: 'Exame de Sangue - Hemograma',
      examType: 'blood_test',
      scheduledDate: '2024-01-30',
      completedDate: null,
      location: 'Laboratório Central',
      doctorName: 'Dr. Silva',
      status: 'scheduled',
      priority: 'normal',
      alertEnabled: true,
      alertDaysBefore: 2,
      abnormalResults: false,
      requiresFollowUp: false,
      notes: 'Verificar níveis de ferro e hemoglobina'
    },
    {
      id: 3,
      examName: 'Teste de Tolerância à Glicose',
      examType: 'glucose_test',
      scheduledDate: '2024-02-05',
      completedDate: null,
      location: 'Hospital Santa Maria',
      doctorName: 'Dr. Silva',
      status: 'scheduled',
      priority: 'high',
      alertEnabled: true,
      alertDaysBefore: 5,
      abnormalResults: false,
      requiresFollowUp: false,
      notes: 'Teste para diabetes gestacional'
    },
    {
      id: 4,
      examName: 'Exame de Urina',
      examType: 'urine_test',
      scheduledDate: '2024-01-20',
      completedDate: '2024-01-20',
      location: 'Laboratório Central',
      doctorName: 'Dr. Silva',
      status: 'completed',
      priority: 'normal',
      alertEnabled: true,
      alertDaysBefore: 1,
      abnormalResults: true,
      requiresFollowUp: true,
      notes: 'Detectada presença de proteína - necessário acompanhamento',
      results: {
        findings: 'Proteína presente na urina',
        measurements: 'Proteína: 150mg/dL',
        recommendations: 'Repetir em 1 semana'
      }
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'scheduled': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'missed': return 'bg-red-100 text-red-800 border-red-200';
      case 'rescheduled': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'normal': return 'bg-green-100 text-green-800 border-green-200';
      case 'low': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getExamTypeLabel = (type: string) => {
    switch (type) {
      case 'ultrasound': return 'Ultrassom';
      case 'blood_test': return 'Exame de Sangue';
      case 'urine_test': return 'Exame de Urina';
      case 'glucose_test': return 'Teste de Glicose';
      default: return type;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed': return 'Concluído';
      case 'scheduled': return 'Agendado';
      case 'missed': return 'Perdido';
      case 'rescheduled': return 'Reagendado';
      default: return status;
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'Urgente';
      case 'high': return 'Alta';
      case 'normal': return 'Normal';
      case 'low': return 'Baixa';
      default: return priority;
    }
  };

  const getUpcomingExams = () => {
    const today = new Date();
    return examsData.filter(exam => 
      exam.status === 'scheduled' && 
      new Date(exam.scheduledDate) >= today
    ).sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime());
  };

  const getCompletedExams = () => {
    return examsData.filter(exam => exam.status === 'completed')
      .sort((a, b) => new Date(b.completedDate || b.scheduledDate).getTime() - new Date(a.completedDate || a.scheduledDate).getTime());
  };

  const getExamsWithAlerts = () => {
    return examsData.filter(exam => 
      exam.abnormalResults || 
      exam.requiresFollowUp ||
      (exam.status === 'scheduled' && exam.priority === 'urgent')
    );
  };

  const getDaysUntilExam = (examDate: string) => {
    const today = new Date();
    const exam = new Date(examDate);
    const diffTime = exam.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">{t('pregnancy.exams.title')}</h2>
          <p className="text-muted-foreground">{t('pregnancy.exams.description')}</p>
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              {t('pregnancy.exams.add_exam')}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{t('pregnancy.exams.add_exam')}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="examName">{t('pregnancy.exams.exam_name')}</Label>
                <Input id="examName" placeholder="Ex: Ultrassom Morfológico" />
              </div>
              <div>
                <Label htmlFor="examType">{t('pregnancy.exams.exam_type')}</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ultrasound">Ultrassom</SelectItem>
                    <SelectItem value="blood_test">Exame de Sangue</SelectItem>
                    <SelectItem value="urine_test">Exame de Urina</SelectItem>
                    <SelectItem value="glucose_test">Teste de Glicose</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>{t('pregnancy.exams.scheduled_date')}</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? format(selectedDate, 'PPP', { locale: ptBR }) : 'Selecionar data'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <Label htmlFor="location">{t('pregnancy.exams.location')}</Label>
                <Input id="location" placeholder="Ex: Clínica São Lucas" />
              </div>
              <div>
                <Label htmlFor="doctorName">{t('pregnancy.exams.doctor_name')}</Label>
                <Input id="doctorName" placeholder="Ex: Dr. Silva" />
              </div>
              <div>
                <Label htmlFor="priority">Prioridade</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar prioridade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Baixa</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="high">Alta</SelectItem>
                    <SelectItem value="urgent">Urgente</SelectItem>
                  </SelectContent>
                </Select>
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

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium">Próximos</span>
              </div>
            </div>
            <div className="mt-2">
              <p className="text-2xl font-bold">{getUpcomingExams().length}</p>
              <p className="text-sm text-muted-foreground">agendados</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-sm font-medium">Concluídos</span>
              </div>
            </div>
            <div className="mt-2">
              <p className="text-2xl font-bold">{getCompletedExams().length}</p>
              <p className="text-sm text-muted-foreground">este mês</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <span className="text-sm font-medium">Alertas</span>
              </div>
            </div>
            <div className="mt-2">
              <p className="text-2xl font-bold">{getExamsWithAlerts().length}</p>
              <p className="text-sm text-muted-foreground">requer atenção</p>
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
                {examsData.filter(exam => exam.alertEnabled).length}
              </p>
              <p className="text-sm text-muted-foreground">ativos</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts Section */}
      {getExamsWithAlerts().length > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-800">
              <AlertTriangle className="h-5 w-5" />
              Exames que Requerem Atenção
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {getExamsWithAlerts().map((exam) => (
                <div key={exam.id} className="bg-white rounded-lg p-3 border border-orange-200">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium">{exam.examName}</h4>
                      <p className="text-sm text-muted-foreground">
                        {exam.location} - {exam.doctorName}
                      </p>
                      {exam.abnormalResults && (
                        <Badge variant="destructive" className="mt-1">
                          Resultados Anormais
                        </Badge>
                      )}
                      {exam.requiresFollowUp && (
                        <Badge variant="outline" className="mt-1 ml-2">
                          Acompanhamento Necessário
                        </Badge>
                      )}
                    </div>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      Ver Detalhes
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upcoming Exams */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Próximos Exames
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {getUpcomingExams().map((exam) => {
              const daysUntil = getDaysUntilExam(exam.scheduledDate);
              return (
                <div key={exam.id} className="border rounded-lg p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">{exam.examName}</h3>
                        <Badge variant="outline" className={getPriorityColor(exam.priority)}>
                          {getPriorityLabel(exam.priority)}
                        </Badge>
                        <Badge className={getStatusColor(exam.status)}>
                          {getStatusLabel(exam.status)}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <CalendarIcon className="h-4 w-4" />
                          {new Date(exam.scheduledDate).toLocaleDateString('pt-BR')}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {exam.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          {exam.doctorName}
                        </div>
                        <div className="flex items-center gap-1">
                          <FileText className="h-4 w-4" />
                          {getExamTypeLabel(exam.examType)}
                        </div>
                      </div>
                      {exam.notes && (
                        <p className="text-sm text-muted-foreground mt-2">{exam.notes}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-center">
                        <div className="text-lg font-bold text-primary">
                          {daysUntil > 0 ? daysUntil : 'Hoje'}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {daysUntil > 0 ? (daysUntil === 1 ? 'dia' : 'dias') : ''}
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-1" />
                        Editar
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Completed Exams */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Exames Concluídos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {getCompletedExams().map((exam) => (
              <div key={exam.id} className="border rounded-lg p-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold">{exam.examName}</h3>
                      <Badge className={getStatusColor(exam.status)}>
                        {getStatusLabel(exam.status)}
                      </Badge>
                      {exam.abnormalResults && (
                        <Badge variant="destructive">
                          Resultados Anormais
                        </Badge>
                      )}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <CalendarIcon className="h-4 w-4" />
                        {new Date(exam.completedDate || exam.scheduledDate).toLocaleDateString('pt-BR')}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {exam.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {exam.doctorName}
                      </div>
                      <div className="flex items-center gap-1">
                        <FileText className="h-4 w-4" />
                        {getExamTypeLabel(exam.examType)}
                      </div>
                    </div>
                    {exam.notes && (
                      <p className="text-sm text-muted-foreground mt-2">{exam.notes}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      Ver Resultados
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-1" />
                      Baixar
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}