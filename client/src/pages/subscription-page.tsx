import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Star, Check, X, CreditCard, Shield, Zap, Users, Brain, Activity, Trophy } from "lucide-react";

// Make sure to call `loadStripe` outside of a component's render to avoid
// recreating the `Stripe` object on every render.
if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const SubscriptionForm = ({ clientSecret }: { clientSecret: string }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.origin + "/subscription?success=true",
      },
    });

    if (error) {
      toast({
        title: "Erro no Pagamento",
        description: error.message,
        variant: "destructive",
      });
    }

    setIsProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <Button 
        type="submit" 
        disabled={!stripe || isProcessing}
        className="w-full mt-6 bg-emerald-500 hover:bg-emerald-600 text-white"
      >
        {isProcessing ? "Processando..." : "Confirmar Pagamento"}
      </Button>
    </form>
  );
};

export default function SubscriptionPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [clientSecret, setClientSecret] = useState("");
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  // Check subscription status
  const { data: subscriptionStatus, isLoading } = useQuery({
    queryKey: ['/api/subscription-status'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/subscription-status');
      return response.json();
    },
  });

  // Create subscription mutation
  const createSubscriptionMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/create-subscription');
      return response.json();
    },
    onSuccess: (data) => {
      setClientSecret(data.clientSecret);
      setShowPaymentForm(true);
      queryClient.invalidateQueries({ queryKey: ['/api/subscription-status'] });
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: "Não foi possível criar a assinatura. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  // Cancel subscription mutation
  const cancelSubscriptionMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/cancel-subscription');
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Assinatura Cancelada",
        description: "Sua assinatura foi cancelada com sucesso.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/subscription-status'] });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Não foi possível cancelar a assinatura. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  // Check for success parameter in URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('success') === 'true') {
      toast({
        title: "Pagamento Realizado!",
        description: "Sua assinatura foi ativada com sucesso!",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/subscription-status'] });
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [toast, queryClient]);

  const handleCreateSubscription = () => {
    createSubscriptionMutation.mutate();
  };

  const handleCancelSubscription = () => {
    if (window.confirm('Tem certeza que deseja cancelar sua assinatura?')) {
      cancelSubscriptionMutation.mutate();
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#0a0f1c] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0f1c] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Star className="w-8 h-8 text-emerald-500" />
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">
              LifeTrek Premium Club
            </h1>
          </div>
          <p className="text-lg text-slate-600 dark:text-gray-400 max-w-2xl mx-auto mb-6">
            Transforme sua jornada de saúde com acesso exclusivo a recursos premium, análises avançadas e suporte personalizado
          </p>
          <div className="flex items-center justify-center gap-6 text-sm text-slate-500 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>5.000+ membros ativos</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-500" />
              <span>4.9/5 avaliação</span>
            </div>
          </div>
        </div>

        {/* Pricing Plans */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {/* Basic Plan */}
          <Card className="bg-white dark:bg-[#1a2127] border border-gray-200 dark:border-gray-700 relative">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-xl text-slate-800 dark:text-white">Básico</CardTitle>
              <CardDescription>Para iniciantes na jornada</CardDescription>
              <div className="text-3xl font-bold text-slate-900 dark:text-white mt-4">
                Gratuito
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500" />
                  <span className="text-sm">Rastreamento básico de atividades</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500" />
                  <span className="text-sm">Dashboard principal</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500" />
                  <span className="text-sm">3 exames médicos por mês</span>
                </div>
                <div className="flex items-center gap-2">
                  <X className="w-4 h-4 text-red-500" />
                  <span className="text-sm text-slate-500">Análises com IA</span>
                </div>
              </div>
              <Button variant="outline" className="w-full" disabled>
                Plano Atual
              </Button>
            </CardContent>
          </Card>

          {/* Premium Plan */}
          <Card className="bg-white dark:bg-[#1a2127] border-2 border-emerald-500 relative transform scale-105">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-1">
                Mais Popular
              </Badge>
            </div>
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-xl text-slate-800 dark:text-white">Premium</CardTitle>
              <CardDescription>Para resultados acelerados</CardDescription>
              <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mt-4">
                R$ 29,90
                <span className="text-sm font-normal text-slate-500">/mês</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500" />
                  <span className="text-sm">Tudo do plano Básico</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500" />
                  <span className="text-sm">Análises avançadas com IA</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500" />
                  <span className="text-sm">Exames médicos ilimitados</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500" />
                  <span className="text-sm">Planos de saúde personalizados</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500" />
                  <span className="text-sm">Biblioteca de vídeos premium</span>
                </div>
              </div>
              <Button 
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white"
                onClick={handleCreateSubscription}
                disabled={createSubscriptionMutation.isPending}
              >
                {createSubscriptionMutation.isPending ? "Processando..." : "Assinar Premium"}
              </Button>
            </CardContent>
          </Card>

          {/* Pro Plan */}
          <Card className="bg-white dark:bg-[#1a2127] border border-gray-200 dark:border-gray-700 relative">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-xl text-slate-800 dark:text-white">Profissional</CardTitle>
              <CardDescription>Para profissionais da saúde</CardDescription>
              <div className="text-3xl font-bold text-slate-900 dark:text-white mt-4">
                R$ 79,90
                <span className="text-sm font-normal text-slate-500">/mês</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500" />
                  <span className="text-sm">Tudo do plano Premium</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500" />
                  <span className="text-sm">Dashboard para múltiplos pacientes</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500" />
                  <span className="text-sm">Relatórios profissionais</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500" />
                  <span className="text-sm">API para integração</span>
                </div>
              </div>
              <Button variant="outline" className="w-full">
                Em breve
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Premium Features Grid */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white text-center mb-8">
            Recursos Exclusivos Premium
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-700/50">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-blue-500/10 dark:bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Brain className="w-6 h-6 text-blue-500" />
                </div>
                <h3 className="font-semibold text-slate-800 dark:text-white mb-2">IA Avançada</h3>
                <p className="text-sm text-slate-600 dark:text-gray-400">
                  Análises inteligentes que aprendem com seus hábitos e oferecem recomendações personalizadas
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 border-emerald-200 dark:border-emerald-700/50">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-emerald-500/10 dark:bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Activity className="w-6 h-6 text-emerald-500" />
                </div>
                <h3 className="font-semibold text-slate-800 dark:text-white mb-2">Monitoramento 360°</h3>
                <p className="text-sm text-slate-600 dark:text-gray-400">
                  Acompanhamento completo de atividades, sono, nutrição e bem-estar mental
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-700/50">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-purple-500/10 dark:bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trophy className="w-6 h-6 text-purple-500" />
                </div>
                <h3 className="font-semibold text-slate-800 dark:text-white mb-2">Conquistas & Metas</h3>
                <p className="text-sm text-slate-600 dark:text-gray-400">
                  Sistema de gamificação que torna sua jornada de saúde mais motivante e divertida
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Current Status */}
        {subscriptionStatus && (
          <Card className="mt-8 bg-white dark:bg-[#1a2127] border border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Status da Assinatura
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <Badge 
                    variant={subscriptionStatus.isActive ? "default" : "secondary"}
                    className={subscriptionStatus.isActive ? "bg-emerald-500 hover:bg-emerald-600" : ""}
                  >
                    {subscriptionStatus.isActive ? "Ativa" : "Inativa"}
                  </Badge>
                  {subscriptionStatus.currentPeriodEnd && (
                    <p className="text-sm text-slate-600 dark:text-gray-400 mt-2">
                      {subscriptionStatus.isActive 
                        ? `Renovação em: ${new Date(subscriptionStatus.currentPeriodEnd).toLocaleDateString()}`
                        : `Expirou em: ${new Date(subscriptionStatus.currentPeriodEnd).toLocaleDateString()}`
                      }
                    </p>
                  )}
                </div>
                {subscriptionStatus.isActive && (
                  <Button 
                    variant="outline" 
                    onClick={handleCancelSubscription}
                    disabled={cancelSubscriptionMutation.isPending}
                    className="border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    {cancelSubscriptionMutation.isPending ? "Cancelando..." : "Cancelar Assinatura"}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Payment Form */}
        {showPaymentForm && clientSecret && (
          <Card className="mt-8 bg-white dark:bg-[#1a2127] border border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle>Finalizar Assinatura</CardTitle>
              <CardDescription>
                Complete seu pagamento para ativar a assinatura premium
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <SubscriptionForm clientSecret={clientSecret} />
              </Elements>
            </CardContent>
          </Card>
        )}

        {/* Security & Trust */}
        <div className="mt-12 text-center">
          <div className="flex items-center justify-center gap-8 text-sm text-slate-500 dark:text-gray-400 mb-6">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <span>Pagamento 100% seguro</span>
            </div>
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              <span>Processado pelo Stripe</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              <span>Ativação instantânea</span>
            </div>
          </div>
          <p className="text-xs text-slate-400 dark:text-gray-500">
            Seus dados são protegidos com criptografia SSL de 256 bits. Não armazenamos informações de cartão de crédito.
          </p>
        </div>
      </div>
    </div>
  );
}