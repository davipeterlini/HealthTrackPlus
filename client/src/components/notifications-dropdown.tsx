import { useState } from "react";
import { useTranslation } from 'react-i18next';
import { BellIcon, Check, X, AlertTriangle, Info, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Notification {
  id: string;
  type: 'info' | 'warning' | 'success' | 'error';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

// Dados de exemplo para as notificações
const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'info',
    title: 'Lembrete de Hidratação',
    message: 'Você ainda não atingiu sua meta de água hoje. Beba mais 2 copos.',
    timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 min atrás
    read: false
  },
  {
    id: '2',
    type: 'success',
    title: 'Meta de Passos Atingida',
    message: 'Parabéns! Você completou 10.000 passos hoje.',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 horas atrás
    read: false
  },
  {
    id: '3',
    type: 'warning',
    title: 'Medicação Pendente',
    message: 'Não se esqueça de tomar o Omeprazol às 20:00.',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 horas atrás
    read: true
  },
  {
    id: '4',
    type: 'info',
    title: 'Novo Conteúdo Disponível',
    message: 'Confira o novo vídeo sobre meditação mindfulness.',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 dia atrás
    read: true
  }
];

export function NotificationsDropdown() {
  const { t } = useTranslation();
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);

  const unreadCount = notifications.filter(n => !n.read).length;

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

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'error':
        return <X className="h-4 w-4 text-red-500" />;
      default:
        return <Info className="h-4 w-4 text-blue-500" />;
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
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="relative h-8 w-8 md:h-9 md:w-9 text-slate-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-gray-300"
        >
          <BellIcon className="h-4 w-4 md:h-5 md:w-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-semibold text-slate-800 dark:text-white">
            {t('notifications.title', 'Notificações')}
          </h3>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={markAllAsRead}
              className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
            >
              Marcar todas como lidas
            </Button>
          )}
        </div>

        <ScrollArea className="max-h-96">
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-slate-500 dark:text-gray-400">
              <BellIcon className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Nenhuma notificação</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-gray-700">
              {notifications.map((notification) => (
                <div 
                  key={notification.id}
                  className={`p-4 hover:bg-slate-50 dark:hover:bg-gray-800 transition-colors ${
                    !notification.read ? 'bg-blue-50 dark:bg-blue-900/10' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-0.5">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <p className={`text-sm font-medium ${
                            !notification.read 
                              ? 'text-slate-900 dark:text-white' 
                              : 'text-slate-700 dark:text-gray-300'
                          }`}>
                            {notification.title}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">
                            {notification.message}
                          </p>
                          <p className="text-xs text-slate-400 dark:text-gray-500 mt-2">
                            {formatTime(notification.timestamp)}
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          {!notification.read && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => markAsRead(notification.id)}
                              className="h-6 w-6 p-0 text-slate-400 hover:text-blue-600"
                            >
                              <Check className="h-3 w-3" />
                            </Button>
                          )}
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => removeNotification(notification.id)}
                            className="h-6 w-6 p-0 text-slate-400 hover:text-red-600"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        {notifications.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <div className="p-2">
              <Button 
                variant="ghost" 
                className="w-full justify-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
              >
                Ver todas as notificações
              </Button>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}