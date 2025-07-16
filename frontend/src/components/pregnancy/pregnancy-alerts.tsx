import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Bell, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  X, 
  Eye, 
  Calendar,
  Pill,
  FileText,
  Heart,
  Filter
} from 'lucide-react';

export function PregnancyAlerts() {
  const { t } = useTranslation();
  const [selectedType, setSelectedType] = useState<string>('all');

  // Mock data para alertas - será substituído por dados reais da API
  const alertsData = [
    {
      id: 1,
      userId: 1,
      alertType: 'exam_reminder',
      alertDate: '2024-01-28',
      message: 'Lembrete: Exame de sangue agendado para amanhã (29/01) às 08:00 no Laboratório Central.',
      read: false,
      dismissed: false,
      priority: 'high',
      relatedExamId: 2,
      createdAt: '2024-01-27T10:00:00Z'
    },
    {
      id: 2,
      userId: 1,
      alertType: 'vitamin_reminder',
      alertDate: '2024-01-27',
      message: 'Você não tomou sua vitamina de Ferro hoje. Lembre-se de tomar às 14:00.',
      read: false,
      dismissed: false,
      priority: 'medium',
      relatedVitaminId: 2,
      createdAt: '2024-01-27T14:30:00Z'
    },
    {
      id: 3,
      userId: 1,
      alertType: 'abnormal_results',
      alertDate: '2024-01-25',
      message: 'Resultados do exame de urina mostram presença de proteína. Consulte seu médico.',
      read: true,
      dismissed: false,
      priority: 'urgent',
      relatedExamId: 4,
      createdAt: '2024-01-25T16:00:00Z'
    },
    {
      id: 4,
      userId: 1,
      alertType: 'follow_up_needed',
      alertDate: '2024-01-26',
      message: 'Acompanhamento necessário: Repetir exame de urina em 1 semana devido aos resultados anteriores.',
      read: false,
      dismissed: false,
      priority: 'high',
      relatedExamId: 4,
      createdAt: '2024-01-26T09:00:00Z'
    },
    {
      id: 5,
      userId: 1,
      alertType: 'exam_overdue',
      alertDate: '2024-01-24',
      message: 'Exame em atraso: Teste de tolerância à glicose estava agendado para 23/01.',
      read: true,
      dismissed: false,
      priority: 'urgent',
      relatedExamId: 3,
      createdAt: '2024-01-24T12:00:00Z'
    },
    {
      id: 6,
      userId: 1,
      alertType: 'vitamin_reminder',
      alertDate: '2024-01-27',
      message: 'Hora de tomar Ácido Fólico - 400mcg. Lembrete para às 20:00.',
      read: true,
      dismissed: false,
      priority: 'medium',
      relatedVitaminId: 1,
      createdAt: '2024-01-27T20:00:00Z'
    }
  ];

  const alertTypes = [
    { id: 'all', label: 'Todos', icon: Bell },
    { id: 'exam_reminder', label: 'Lembretes de Exames', icon: Calendar },
    { id: 'exam_overdue', label: 'Exames em Atraso', icon: Clock },
    { id: 'abnormal_results', label: 'Resultados Anormais', icon: AlertTriangle },
    { id: 'follow_up_needed', label: 'Acompanhamento', icon: FileText },
    { id: 'vitamin_reminder', label: 'Lembretes de Vitaminas', icon: Pill }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'Urgente';
      case 'high': return 'Alta';
      case 'medium': return 'Média';
      case 'low': return 'Baixa';
      default: return priority;
    }
  };

  const getAlertTypeLabel = (type: string) => {
    switch (type) {
      case 'exam_reminder': return 'Lembrete de Exame';
      case 'exam_overdue': return 'Exame em Atraso';
      case 'abnormal_results': return 'Resultados Anormais';
      case 'follow_up_needed': return 'Acompanhamento Necessário';
      case 'vitamin_reminder': return 'Lembrete de Vitamina';
      default: return type;
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'exam_reminder': return Calendar;
      case 'exam_overdue': return Clock;
      case 'abnormal_results': return AlertTriangle;
      case 'follow_up_needed': return FileText;
      case 'vitamin_reminder': return Pill;
      default: return Bell;
    }
  };

  const filteredAlerts = alertsData.filter(alert => 
    selectedType === 'all' || alert.alertType === selectedType
  );

  const unreadAlerts = filteredAlerts.filter(alert => !alert.read);
  const readAlerts = filteredAlerts.filter(alert => alert.read && !alert.dismissed);

  const markAsRead = (alertId: number) => {
    // Aqui seria chamada a API para marcar como lido
    console.log(`Marking alert ${alertId} as read`);
  };

  const dismissAlert = (alertId: number) => {
    // Aqui seria chamada a API para descartar
    console.log(`Dismissing alert ${alertId}`);
  };

  const markAllAsRead = () => {
    // Aqui seria chamada a API para marcar todos como lidos
    console.log('Marking all alerts as read');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">{t('pregnancy.alerts.title')}</h2>
          <p className="text-muted-foreground">
            Acompanhe lembretes e notificações importantes
          </p>
        </div>
        {unreadAlerts.length > 0 && (
          <Button onClick={markAllAsRead} variant="outline" className="w-full sm:w-auto">
            <CheckCircle className="h-4 w-4 mr-2" />
            Marcar Todos como Lidos
          </Button>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium">Não Lidos</span>
              </div>
            </div>
            <div className="mt-2">
              <p className="text-2xl font-bold text-red-600">{unreadAlerts.length}</p>
              <p className="text-sm text-muted-foreground">alertas</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <span className="text-sm font-medium">Urgentes</span>
              </div>
            </div>
            <div className="mt-2">
              <p className="text-2xl font-bold text-red-600">
                {alertsData.filter(alert => alert.priority === 'urgent' && !alert.dismissed).length}
              </p>
              <p className="text-sm text-muted-foreground">alertas</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-orange-600" />
                <span className="text-sm font-medium">Alta Prioridade</span>
              </div>
            </div>
            <div className="mt-2">
              <p className="text-2xl font-bold text-orange-600">
                {alertsData.filter(alert => alert.priority === 'high' && !alert.dismissed).length}
              </p>
              <p className="text-sm text-muted-foreground">alertas</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-sm font-medium">Total</span>
              </div>
            </div>
            <div className="mt-2">
              <p className="text-2xl font-bold">
                {alertsData.filter(alert => !alert.dismissed).length}
              </p>
              <p className="text-sm text-muted-foreground">alertas ativos</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto">
        {alertTypes.map((type) => {
          const Icon = type.icon;
          const count = alertsData.filter(alert => 
            (selectedType === 'all' || alert.alertType === type.id) && !alert.dismissed
          ).length;
          
          return (
            <Button
              key={type.id}
              variant={selectedType === type.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedType(type.id)}
              className="whitespace-nowrap"
            >
              <Icon className="h-4 w-4 mr-2" />
              {type.label}
              {count > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {count}
                </Badge>
              )}
            </Button>
          );
        })}
      </div>

      {/* Unread Alerts */}
      {unreadAlerts.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Bell className="h-5 w-5 text-red-600" />
            Alertas Não Lidos ({unreadAlerts.length})
          </h3>
          <div className="space-y-3">
            {unreadAlerts.map((alert) => {
              const Icon = getAlertIcon(alert.alertType);
              return (
                <Card key={alert.id} className="border-l-4 border-l-red-500 bg-red-50">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Icon className="h-5 w-5 text-red-600" />
                          <Badge variant="outline" className={getPriorityColor(alert.priority)}>
                            {getPriorityLabel(alert.priority)}
                          </Badge>
                          <Badge variant="secondary">
                            {getAlertTypeLabel(alert.alertType)}
                          </Badge>
                        </div>
                        <p className="text-sm font-medium mb-1">{alert.message}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(alert.createdAt).toLocaleDateString('pt-BR')} às {new Date(alert.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => markAsRead(alert.id)}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Marcar como Lido
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => dismissAlert(alert.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Read Alerts */}
      {readAlerts.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Alertas Lidos ({readAlerts.length})
          </h3>
          <div className="space-y-3">
            {readAlerts.map((alert) => {
              const Icon = getAlertIcon(alert.alertType);
              return (
                <Card key={alert.id} className="opacity-75 hover:opacity-100 transition-opacity">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Icon className="h-5 w-5 text-muted-foreground" />
                          <Badge variant="outline" className={getPriorityColor(alert.priority)}>
                            {getPriorityLabel(alert.priority)}
                          </Badge>
                          <Badge variant="secondary">
                            {getAlertTypeLabel(alert.alertType)}
                          </Badge>
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        </div>
                        <p className="text-sm mb-1">{alert.message}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(alert.createdAt).toLocaleDateString('pt-BR')} às {new Date(alert.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => dismissAlert(alert.id)}
                        >
                          <X className="h-4 w-4 mr-1" />
                          Descartar
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* No Alerts */}
      {filteredAlerts.length === 0 && (
        <div className="text-center py-8">
          <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">
            {selectedType === 'all' 
              ? 'Nenhum alerta ativo no momento.' 
              : `Nenhum alerta do tipo "${alertTypes.find(t => t.id === selectedType)?.label}" encontrado.`}
          </p>
        </div>
      )}

      {/* Alert Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-primary" />
            Resumo de Alertas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-blue-600">
                {alertsData.filter(alert => alert.alertType === 'exam_reminder' && !alert.dismissed).length}
              </p>
              <p className="text-sm text-muted-foreground">Lembretes de Exames</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">
                {alertsData.filter(alert => alert.alertType === 'vitamin_reminder' && !alert.dismissed).length}
              </p>
              <p className="text-sm text-muted-foreground">Lembretes de Vitaminas</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-red-600">
                {alertsData.filter(alert => alert.alertType === 'abnormal_results' && !alert.dismissed).length}
              </p>
              <p className="text-sm text-muted-foreground">Resultados Anormais</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-orange-600">
                {alertsData.filter(alert => alert.alertType === 'follow_up_needed' && !alert.dismissed).length}
              </p>
              <p className="text-sm text-muted-foreground">Acompanhamento</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}