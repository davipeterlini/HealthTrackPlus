import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  Brain, 
  X, 
  Lightbulb, 
  TrendingUp, 
  Clock, 
  Target, 
  Sparkles,
  ChevronRight,
  AlertCircle,
  CheckCircle
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { apiRequest } from "@/lib/queryClient";

interface ContextualTip {
  id: string;
  type: 'reminder' | 'suggestion' | 'warning' | 'achievement';
  title: string;
  message: string;
  category: 'hydration' | 'activity' | 'sleep' | 'nutrition' | 'mental_health';
  priority: 'low' | 'medium' | 'high';
  triggerCondition: string;
  actionable: boolean;
  actions?: Array<{
    label: string;
    action: string;
    primary?: boolean;
  }>;
  timestamp: string;
  contextData: any;
}

interface ContextualTipsOverlayProps {
  currentPage?: string;
  userActivity?: any;
}

export function ContextualTipsOverlay({ 
  currentPage = 'dashboard', 
  userActivity 
}: ContextualTipsOverlayProps) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [showOverlay, setShowOverlay] = useState(false);
  const [showTipHistory, setShowTipHistory] = useState(false);
  const [activeTip, setActiveTip] = useState<ContextualTip | null>(null);
  const [dismissedTips, setDismissedTips] = useState<string[]>([]);
  const [tipHistory, setTipHistory] = useState<ContextualTip[]>([]);

  // Fetch contextual tips based on current context
  const { data: contextualTips, isLoading } = useQuery({
    queryKey: ['/api/ai-tips/contextual', currentPage, userActivity],
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: 5 * 60 * 1000, // Refresh every 5 minutes
  });

  // Generate new contextual tip mutation
  const generateTipMutation = useMutation({
    mutationFn: (context: any) => apiRequest('/api/ai-tips/generate', {
      method: 'POST',
      body: JSON.stringify({
        context: {
          currentPage,
          userActivity,
          timeOfDay: new Date().getHours(),
          lastActivity: context.lastActivity,
          userPreferences: context.userPreferences
        }
      })
    }),
    onSuccess: (newTip) => {
      if (newTip && !dismissedTips.includes(newTip.id)) {
        setActiveTip(newTip);
        setShowOverlay(true);
        setTipHistory(prev => [newTip, ...prev.slice(0, 9)]); // Keep last 10 tips
      }
      queryClient.invalidateQueries({ queryKey: ['/api/ai-tips/contextual'] });
    }
  });

  // Mark tip as actioned
  const actionTipMutation = useMutation({
    mutationFn: (data: { tipId: string; action: string }) => 
      apiRequest('/api/ai-tips/action', {
        method: 'POST',
        body: JSON.stringify(data)
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/ai-tips/contextual'] });
    }
  });

  // Auto-show tips based on context
  useEffect(() => {
    if (contextualTips && contextualTips.length > 0) {
      const highPriorityTips = contextualTips.filter(
        (tip: ContextualTip) => 
          tip.priority === 'high' && 
          !dismissedTips.includes(tip.id)
      );
      
      if (highPriorityTips.length > 0) {
        const tip = highPriorityTips[0];
        setActiveTip(tip);
        setShowOverlay(true);
        setTipHistory(prev => [tip, ...prev.slice(0, 9)]);
      }
    }
  }, [contextualTips, dismissedTips]);

  // Auto-dismiss low priority tips after delay
  useEffect(() => {
    if (activeTip && activeTip.priority === 'low') {
      const timer = setTimeout(() => {
        setShowOverlay(false);
        setActiveTip(null);
      }, 8000); // 8 seconds for low priority
      
      return () => clearTimeout(timer);
    }
  }, [activeTip]);

  const handleDismissTip = (tipId: string) => {
    setDismissedTips(prev => [...prev, tipId]);
    setShowOverlay(false);
    setActiveTip(null);
  };

  const handleTipAction = (action: string) => {
    if (activeTip) {
      actionTipMutation.mutate({
        tipId: activeTip.id,
        action: action
      });
      
      // Handle specific actions
      switch (action) {
        case 'hydrate_now':
          // Could trigger water intake logging
          break;
        case 'start_workout':
          // Could navigate to activity page
          break;
        case 'meditation_break':
          // Could start meditation timer
          break;
        case 'sleep_reminder':
          // Could set sleep notification
          break;
      }
      
      setShowOverlay(false);
      setActiveTip(null);
    }
  };

  const getTipIcon = (type: string) => {
    switch (type) {
      case 'reminder':
        return <Clock className="h-5 w-5 text-blue-500" />;
      case 'suggestion':
        return <Lightbulb className="h-5 w-5 text-yellow-500" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'achievement':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      default:
        return <Brain className="h-5 w-5 text-purple-500" />;
    }
  };

  const getTipBackground = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 border-red-200 dark:border-red-700';
      case 'medium':
        return 'bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 border-yellow-200 dark:border-yellow-700';
      case 'low':
        return 'bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-700';
      default:
        return 'bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-800 dark:to-slate-800 border-gray-200 dark:border-gray-700';
    }
  };

  if (isLoading || !activeTip) {
    return null;
  }

  return (
    <>
      {/* Floating Tip Indicator */}
      {!showOverlay && activeTip && (
        <div 
          className="fixed bottom-20 md:bottom-6 right-4 z-50 cursor-pointer transform transition-transform hover:scale-110"
          onClick={() => {
            setShowOverlay(true);
            setShowTipHistory(true);
          }}
        >
          <div className="relative">
            <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow">
              <Brain className="h-6 w-6 md:h-7 md:w-7 text-white" />
            </div>
            <div className={`absolute -top-1 -right-1 w-5 h-5 ${
              activeTip.priority === 'high' ? 'bg-red-500' : 
              activeTip.priority === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'
            } rounded-full flex items-center justify-center animate-pulse`}>
              <span className="text-xs text-white font-bold">
                {tipHistory.length}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Main Overlay Dialog */}
      <Dialog open={showOverlay} onOpenChange={(open) => {
        setShowOverlay(open);
        if (!open) {
          setShowTipHistory(false);
        }
      }}>
        <DialogContent className={`w-[95vw] max-w-md mx-auto ${getTipBackground(activeTip.priority)} border-2 shadow-2xl rounded-2xl overflow-hidden`}>
          <DialogHeader className="pb-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3 flex-1">
                <div className="flex-shrink-0">
                  {getTipIcon(activeTip.type)}
                </div>
                <DialogTitle className="text-base md:text-lg font-semibold text-gray-800 dark:text-white leading-tight">
                  {activeTip.title}
                </DialogTitle>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <Badge 
                  variant={activeTip.priority === 'high' ? 'destructive' : activeTip.priority === 'medium' ? 'default' : 'secondary'}
                  className={`text-xs font-medium px-2 py-1 ${
                    activeTip.priority === 'high' ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300' :
                    activeTip.priority === 'medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300' :
                    'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                  }`}
                >
                  {activeTip.priority.toUpperCase()}
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    handleDismissTip(activeTip.id);
                    setShowTipHistory(false);
                  }}
                  className="h-8 w-8 p-0 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full"
                >
                  <X className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                </Button>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-4">
              <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                {activeTip.message}
              </p>

              {activeTip.contextData && (
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50 dark:border-gray-600/50">
                  <h4 className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-3">
                    {t('aiTips.context', 'CONTEXTO')}
                  </h4>
                  <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    {activeTip.contextData.currentActivity && (
                      <p className="flex items-start gap-2">
                        <span className="text-gray-400">•</span>
                        <span><strong>{t('aiTips.currentActivity', 'Atividade atual')}:</strong> {activeTip.contextData.currentActivity}</span>
                      </p>
                    )}
                    {activeTip.contextData.timeBasedInsight && (
                      <p className="flex items-start gap-2">
                        <span className="text-gray-400">•</span>
                        <span>{activeTip.contextData.timeBasedInsight}</span>
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            {activeTip.actions && activeTip.actions.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  {t('aiTips.suggestedActions', 'AÇÕES SUGERIDAS')}
                </h4>
                <div className="flex flex-col gap-2">
                  {activeTip.actions.map((action, index) => (
                    <Button
                      key={index}
                      variant={action.primary ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleTipAction(action.action)}
                      className={`justify-between h-12 px-4 rounded-xl font-medium transition-all ${
                        action.primary 
                          ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl' 
                          : 'border-2 border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                      }`}
                      disabled={actionTipMutation.isPending}
                    >
                      <span className="text-sm">{action.label}</span>
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="flex justify-between items-center pt-4 border-t border-gray-200/50 dark:border-gray-600/50">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDismissTip(activeTip.id)}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg px-3 py-2"
              >
                {t('aiTips.dismiss', 'Dispensar')}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => generateTipMutation.mutate({})}
                disabled={generateTipMutation.isPending}
                className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg px-3 py-2 font-medium"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                {t('aiTips.moreTips', 'Mais Dicas')}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Tips History Sidebar (Optional) */}
      {tipHistory.length > 0 && showTipHistory && (
        <div className="fixed top-4 md:top-20 right-4 z-40 w-[90vw] md:w-80">
          <Card className="max-h-[70vh] md:max-h-96 overflow-hidden shadow-2xl border-0 rounded-2xl backdrop-blur-sm bg-white/95 dark:bg-gray-900/95">
            <div className="p-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-sm md:text-base">
                  {t('aiTips.recentTips', 'Dicas Recentes')}
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowTipHistory(false)}
                  className="h-8 w-8 p-0 text-white hover:bg-white/20 rounded-full"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="max-h-80 overflow-y-auto">
              {tipHistory.slice(0, 5).map((tip, index) => (
                <div 
                  key={tip.id}
                  className="p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                  onClick={() => {
                    setActiveTip(tip);
                    setShowOverlay(true);
                  }}
                >
                  <div className="flex items-center gap-3 mb-2">
                    {getTipIcon(tip.type)}
                    <span className="text-sm font-medium truncate text-gray-800 dark:text-gray-200 flex-1">{tip.title}</span>
                    <Badge 
                      variant={tip.priority === 'high' ? 'destructive' : 'secondary'}
                      className="text-xs"
                    >
                      {tip.priority}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed mb-1">{tip.message}</p>
                  <span className="text-xs text-gray-400 dark:text-gray-500">
                    {new Date(tip.timestamp).toLocaleTimeString('pt-BR', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </>
  );
}