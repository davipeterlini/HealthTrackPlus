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
        return 'bg-gradient-to-r from-red-50 to-orange-50 border-red-200';
      case 'medium':
        return 'bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-200';
      case 'low':
        return 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200';
      default:
        return 'bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200';
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
          className="fixed bottom-20 right-4 z-50 cursor-pointer animate-bounce"
          onClick={() => {
            setShowOverlay(true);
            setShowTipHistory(true);
          }}
        >
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-xs text-white font-bold">!</span>
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
        <DialogContent className={`max-w-md ${getTipBackground(activeTip.priority)} dark:bg-[#1a2127] dark:border-gray-700`}>
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getTipIcon(activeTip.type)}
                <DialogTitle className="text-lg font-semibold dark:text-white">
                  {activeTip.title}
                </DialogTitle>
              </div>
              <div className="flex items-center gap-2">
                <Badge 
                  variant={activeTip.priority === 'high' ? 'destructive' : 'secondary'}
                  className="text-xs"
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
                  className="h-6 w-6 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </DialogHeader>

          <CardContent className="p-0 space-y-4">
            <div className="space-y-3">
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                {activeTip.message}
              </p>

              {activeTip.contextData && (
                <div className="bg-white/60 dark:bg-gray-800/60 rounded-lg p-3 space-y-2">
                  <h4 className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                    {t('aiTips.context', 'Contexto')}
                  </h4>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {activeTip.contextData.currentActivity && (
                      <p>• {t('aiTips.currentActivity', 'Atividade atual')}: {activeTip.contextData.currentActivity}</p>
                    )}
                    {activeTip.contextData.timeBasedInsight && (
                      <p>• {activeTip.contextData.timeBasedInsight}</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            {activeTip.actions && activeTip.actions.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('aiTips.suggestedActions', 'Ações Sugeridas')}
                </h4>
                <div className="flex flex-col gap-2">
                  {activeTip.actions.map((action, index) => (
                    <Button
                      key={index}
                      variant={action.primary ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleTipAction(action.action)}
                      className="justify-between"
                      disabled={actionTipMutation.isPending}
                    >
                      <span>{action.label}</span>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="flex justify-between pt-2 border-t border-white/20">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDismissTip(activeTip.id)}
                className="text-gray-600"
              >
                {t('aiTips.dismiss', 'Dispensar')}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => generateTipMutation.mutate({})}
                disabled={generateTipMutation.isPending}
                className="text-purple-600"
              >
                <Sparkles className="h-4 w-4 mr-1" />
                {t('aiTips.moreTips', 'Mais Dicas')}
              </Button>
            </div>
          </CardContent>
        </DialogContent>
      </Dialog>

      {/* Tips History Sidebar (Optional) */}
      {tipHistory.length > 0 && showTipHistory && (
        <div className="fixed top-20 right-4 z-40">
          <Card className="w-64 max-h-96 overflow-hidden shadow-lg">
            <div className="p-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white">
              <h3 className="font-medium text-sm">
                {t('aiTips.recentTips', 'Dicas Recentes')}
              </h3>
            </div>
            <div className="max-h-80 overflow-y-auto">
              {tipHistory.slice(0, 5).map((tip, index) => (
                <div 
                  key={tip.id}
                  className="p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                  onClick={() => {
                    setActiveTip(tip);
                    setShowOverlay(true);
                  }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    {getTipIcon(tip.type)}
                    <span className="text-sm font-medium truncate">{tip.title}</span>
                  </div>
                  <p className="text-xs text-gray-600 line-clamp-2">{tip.message}</p>
                  <span className="text-xs text-gray-400 mt-1">
                    {new Date(tip.timestamp).toLocaleTimeString()}
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