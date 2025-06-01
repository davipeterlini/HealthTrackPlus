import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Crown, Lock, Zap } from "lucide-react";
import { Link } from "wouter";
import { useTranslation } from "react-i18next";

interface SubscriptionGuardProps {
  children: React.ReactNode;
  feature?: string;
  fallback?: React.ReactNode;
}

export function SubscriptionGuard({ children, feature = "Esta funcionalidade", fallback }: SubscriptionGuardProps) {
  const { t } = useTranslation();

  const { data: subscriptionStatus, isLoading } = useQuery({
    queryKey: ['/api/subscription-status'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/subscription-status');
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-[200px] flex items-center justify-center">
        <div className="animate-spin w-6 h-6 border-4 border-emerald-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  // If user has an active subscription, show the protected content
  if (subscriptionStatus?.isActive) {
    return <>{children}</>;
  }

  // If a custom fallback is provided, use it
  if (fallback) {
    return <>{fallback}</>;
  }

  // Default premium upgrade prompt
  return (
    <div className="min-h-[400px] flex items-center justify-center p-4">
      <Card className="max-w-md w-full bg-white dark:bg-[#1a2127] border border-gray-200 dark:border-gray-700">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Crown className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="flex items-center justify-center gap-2 text-slate-900 dark:text-white">
            <Lock className="w-5 h-5" />
            Conteúdo Premium
          </CardTitle>
          <CardDescription>
            {feature} está disponível apenas para assinantes premium
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="space-y-2">
            <p className="text-sm text-slate-600 dark:text-gray-400">
              Desbloqueie acesso completo a todas as funcionalidades avançadas de saúde e bem-estar.
            </p>
            <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-3">
              <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                ✨ Apenas $19.99/mês
              </p>
              <p className="text-xs text-emerald-600 dark:text-emerald-400">
                Cancele a qualquer momento
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Link href="/subscription">
              <Button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white">
                <Zap className="w-4 h-4 mr-2" />
                Assinar Premium
              </Button>
            </Link>
            <p className="text-xs text-slate-500 dark:text-gray-500">
              Pagamento seguro via Stripe
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Hook para verificar status da assinatura
export function useSubscriptionStatus() {
  return useQuery({
    queryKey: ['/api/subscription-status'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/subscription-status');
      return response.json();
    },
  });
}

// Hook para verificar se usuário é premium
export function useIsPremium() {
  const { data: subscriptionStatus } = useSubscriptionStatus();
  return subscriptionStatus?.isActive || false;
}