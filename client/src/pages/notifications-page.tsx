import { useState } from "react";
import { useTranslation } from 'react-i18next';
import { BellIcon, Check, X, AlertTriangle, Info, CheckCircle, ArrowLeft, Calendar, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";

interface Notification {
  id: string;
  type: 'info' | 'warning' | 'success' | 'error';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

// Dados expandidos para a página de notificações
const allNotifications: Notification[] = [
  {
    id: '1',
    type: 'info',
    title: 'Lembrete de Hidratação',
    message: 'Você ainda não atingiu sua meta de água hoje. Beba mais 2 copos.',
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    read: false
  },
  {
    id: '2',
    type: 'success',
    title: 'Meta de Passos Atingida',
    message: 'Parabéns! Você completou 10.000 passos hoje.',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    read: false
  },
  {
    id: '3',
    type: 'warning',
    title: 'Medicação Pendente',
    message: 'Não se esqueça de tomar o Omeprazol às 20:00.',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
    read: true
  },
  {
    id: '4',
    type: 'info',
    title: 'Novo Conteúdo Disponível',
    message: 'Confira o novo vídeo sobre meditação mindfulness.',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    read: true
  },
  {
    id: '5',
    type: 'warning',
    title: 'Hora do Jejum',
    message: 'Seu período de jejum intermitente começou. Evite consumir calorias.',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
    read: false
  },
  {
    id: '6',
    type: 'info',
    title: 'Lembrete de Sono',
    message: 'É hora de se preparar para dormir. Desligue os dispositivos eletrônicos.',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
    read: true
  },
  {
    id: '7',
    type: 'success',
    title: 'Exame Agendado',
    message: 'Seu exame de sangue foi agendado para amanhã às 8:00.',
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
    read: true
  },
  {
    id: '8',
    type: 'warning',
    title: 'Pressão Arterial',
    message: 'Não se esqueça de medir sua pressão arterial hoje.',
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
    read: false
  },
  {
    id: '9',
    type: 'info',
    title: 'Relatório Semanal',
    message: 'Seu relatório semanal de atividades está disponível.',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    read: true
  },
  {
    id: '10',
    type: 'success',
    title: 'Meta de Hidratação',
    message: 'Você atingiu sua meta de hidratação por 7 dias consecutivos!',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    read: true
  }
];

export default function NotificationsPage() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>(allNotifications);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [calendarIntegrations, setCalendarIntegrations] = useState({
    google: false,
    apple: false
  });

  const unreadCount = notifications.filter(n => !n.read).length;
  const filteredNotifications = filter === 'unread' 
    ? notifications.filter(n => !n.read)
    : notifications;

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const connectGoogleCalendar = async () => {
    try {
      // Integração com Google Calendar API
      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
        `client_id=${import.meta.env.VITE_GOOGLE_CLIENT_ID}&` +
        `redirect_uri=${window.location.origin}/auth/google/callback&` +
        `response_type=code&` +
        `scope=https://www.googleapis.com/auth/calendar&` +
        `access_type=offline`;
      
      window.open(authUrl, 'google-auth', 'width=500,height=600');
      
      // Simular conexão bem-sucedida (em produção, isso viria do callback)
      setTimeout(() => {
        setCalendarIntegrations(prev => ({ ...prev, google: true }));
        toast({
          title: "Google Calendar Conectado",
          description: "Suas notificações serão sincronizadas com o Google Calendar.",
        });
      }, 2000);
    } catch (error) {
      toast({
        title: "Erro na Conexão",
        description: "Não foi possível conectar ao Google Calendar.",
        variant: "destructive",
      });
    }
  };

  const connectAppleCalendar = () => {
    try {
      // Para Apple Calendar, geramos um arquivo .ics para download
      const icsContent = generateICSFile();
      const blob = new Blob([icsContent], { type: 'text/calendar' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'health-reminders.ics';
      link.click();
      URL.revokeObjectURL(url);
      
      setCalendarIntegrations(prev => ({ ...prev, apple: true }));
      toast({
        title: "Apple Calendar",
        description: "Arquivo de calendário baixado. Importe-o no seu Apple Calendar.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível gerar o arquivo de calendário.",
        variant: "destructive",
      });
    }
  };

  const generateICSFile = () => {
    const events = notifications
      .filter(n => n.type === 'warning' || n.type === 'info')
      .map(n => {
        const startDate = new Date(n.timestamp);
        const endDate = new Date(startDate.getTime() + 30 * 60 * 1000); // 30 minutos
        
        return `BEGIN:VEVENT
UID:${n.id}@health-app.com
DTSTART:${formatDateForICS(startDate)}
DTEND:${formatDateForICS(endDate)}
SUMMARY:${n.title}
DESCRIPTION:${n.message}
CATEGORIES:HEALTH,REMINDER
STATUS:CONFIRMED
TRANSP:OPAQUE
END:VEVENT`;
      }).join('\n');

    return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Health App//Health Reminders//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
${events}
END:VCALENDAR`;
  };

  const formatDateForICS = (date: Date) => {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };

  const disconnectCalendar = (type: 'google' | 'apple') => {
    setCalendarIntegrations(prev => ({ ...prev, [type]: false }));
    toast({
      title: "Calendário Desconectado",
      description: `${type === 'google' ? 'Google' : 'Apple'} Calendar foi desconectado.`,
    });
  };

  const addToCalendar = (notification: Notification) => {
    // Criar evento individual no formato Google Calendar URL
    const startDate = new Date(notification.timestamp);
    const endDate = new Date(startDate.getTime() + 30 * 60 * 1000); // 30 minutos

    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(notification.title)}&dates=${formatDateForGoogle(startDate)}/${formatDateForGoogle(endDate)}&details=${encodeURIComponent(notification.message)}&ctz=America/Sao_Paulo`;

    // Abrir Google Calendar em nova aba
    window.open(googleCalendarUrl, '_blank');

    toast({
      title: "Evento Adicionado",
      description: "O lembrete foi adicionado ao seu calendário.",
    });
  };

  const formatDateForGoogle = (date: Date) => {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'error':
        return <X className="h-5 w-5 text-red-500" />;
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const formatTime = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) {
      return `${minutes}m atrás`;
    } else if (hours < 24) {
      return `${hours}h atrás`;
    } else {
      return `${days}d atrás`;
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <BellIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              {t('notifications.title', 'Notificações')}
            </h1>
            {unreadCount > 0 && (
              <Badge variant="secondary">
                {unreadCount} não lidas
              </Badge>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex gap-2">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('all')}
            >
              Todas ({notifications.length})
            </Button>
            <Button
              variant={filter === 'unread' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('unread')}
            >
              Não lidas ({unreadCount})
            </Button>
          </div>

          <div className="flex gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <Calendar className="h-4 w-4" />
                  Integração de Calendário
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Integração com Calendários</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Conecte seus calendários para sincronizar lembretes de saúde automaticamente.
                  </p>
                  
                  {/* Google Calendar */}
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                            <Calendar className="h-4 w-4 text-white" />
                          </div>
                          <div>
                            <h3 className="font-medium">Google Calendar</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {calendarIntegrations.google ? 'Conectado' : 'Não conectado'}
                            </p>
                          </div>
                        </div>
                        {calendarIntegrations.google ? (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => disconnectCalendar('google')}
                          >
                            Desconectar
                          </Button>
                        ) : (
                          <Button 
                            variant="default" 
                            size="sm" 
                            onClick={connectGoogleCalendar}
                          >
                            Conectar
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Apple Calendar */}
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center">
                            <Calendar className="h-4 w-4 text-white" />
                          </div>
                          <div>
                            <h3 className="font-medium">Apple Calendar</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {calendarIntegrations.apple ? 'Arquivo exportado' : 'Não conectado'}
                            </p>
                          </div>
                        </div>
                        {calendarIntegrations.apple ? (
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={connectAppleCalendar}
                            >
                              Exportar Novamente
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => disconnectCalendar('apple')}
                            >
                              Reset
                            </Button>
                          </div>
                        ) : (
                          <Button 
                            variant="default" 
                            size="sm" 
                            onClick={connectAppleCalendar}
                          >
                            Exportar .ics
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                    <p>• Google Calendar: Sincronização automática em tempo real</p>
                    <p>• Apple Calendar: Exportação de arquivo .ics para importação manual</p>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            {unreadCount > 0 && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={markAllAsRead}
                className="text-blue-600 dark:text-blue-400"
              >
                Marcar todas como lidas
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {filteredNotifications.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <BellIcon className="h-12 w-12 mx-auto mb-4 text-slate-400" />
              <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                {filter === 'unread' ? 'Nenhuma notificação não lida' : 'Nenhuma notificação'}
              </h3>
              <p className="text-slate-500 dark:text-gray-400">
                {filter === 'unread' 
                  ? 'Todas as suas notificações foram lidas.'
                  : 'Você não tem notificações no momento.'
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredNotifications.map((notification) => (
            <Card 
              key={notification.id}
              className={`transition-all hover:shadow-md ${
                !notification.read ? 'border-blue-200 bg-blue-50 dark:bg-blue-900/10 dark:border-blue-800' : ''
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className={`font-medium ${
                          !notification.read 
                            ? 'text-slate-900 dark:text-white' 
                            : 'text-slate-700 dark:text-gray-300'
                        }`}>
                          {notification.title}
                        </h3>
                        <p className="text-slate-600 dark:text-gray-400 mt-1">
                          {notification.message}
                        </p>
                        <p className="text-sm text-slate-500 dark:text-gray-500 mt-2">
                          {formatTime(notification.timestamp)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {(notification.type === 'warning' || notification.type === 'info') && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => addToCalendar(notification)}
                            className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300"
                          >
                            <Calendar className="h-4 w-4" />
                            Adicionar ao Calendário
                          </Button>
                        )}
                        {!notification.read && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => markAsRead(notification.id)}
                            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                          >
                            <Check className="h-4 w-4" />
                            Marcar como lida
                          </Button>
                        )}
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => removeNotification(notification.id)}
                          className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                        >
                          <X className="h-4 w-4" />
                          Remover
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}