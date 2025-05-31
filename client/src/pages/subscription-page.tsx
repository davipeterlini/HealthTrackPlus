import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Crown, Check, X, CreditCard, Shield, Zap, Star } from "lucide-react";
import { useTranslation } from "react-i18next";

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
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      <Button 
        type="submit" 
        disabled={!stripe || isProcessing}
        className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3"
      >
        {isProcessing ? (
          <div className="flex items-center gap-2">
            <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
            Processando...
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4" />
            Assinar por $19.99/mês
          </div>
        )}
      </Button>
    </form>
  );
};

export default function SubscriptionPage() {
  const { t } = useTranslation();
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
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Crown className="w-8 h-8 text-emerald-500" />
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">
              Health & Wellness Premium
            </h1>
          </div>
          <p className="text-lg text-slate-600 dark:text-gray-400 max-w-2xl mx-auto">
            Desbloqueie o potencial completo do seu bem-estar com acesso total a todas as funcionalidades premium
          </p>
        </div>

        {/* Current Status */}
        {subscriptionStatus && (
          <Card className="mb-8 bg-white dark:bg-[#1a2127] border border-gray-200 dark:border-gray-700">
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
                  {subscriptionStatus.endDate && (
                    <p className="text-sm text-slate-600 dark:text-gray-400 mt-2">
                      {subscriptionStatus.isActive ? "Próxima cobrança:" : "Expira em:"} {" "}
                      {new Date(subscriptionStatus.endDate).toLocaleDateString('pt-BR')}
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Features */}
          <Card className="bg-white dark:bg-[#1a2127] border border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="w-5 h-5 text-emerald-500" />
                Funcionalidades Premium
              </CardTitle>
              <CardDescription>
                Tudo que você precisa para uma vida mais saudável
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                  <span className="text-sm">Análise completa de exames médicos com IA</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                  <span className="text-sm">Planos de saúde personalizados</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                  <span className="text-sm">Monitoramento avançado de atividades</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                  <span className="text-sm">Gestão completa de jejum intermitente</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                  <span className="text-sm">Clube de vídeos de bem-estar</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                  <span className="text-sm">Insights de saúde contextuais com IA</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                  <span className="text-sm">Monitoramento de sono e estresse</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                  <span className="text-sm">Gestão de medicamentos e suplementos</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                  <span className="text-sm">Saúde feminina e rastreamento de fertilidade</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                  <span className="text-sm">Suporte prioritário</span>
                </div>
              </div>

              <Separator />

              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-2">
                  <span className="text-3xl font-bold text-slate-900 dark:text-white">$19.99</span>
                  <span className="text-slate-600 dark:text-gray-400">/mês</span>
                </div>
                <p className="text-sm text-slate-600 dark:text-gray-400">
                  Cancele a qualquer momento
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Payment */}
          <Card className="bg-white dark:bg-[#1a2127] border border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-emerald-500" />
                {subscriptionStatus?.isActive ? "Assinatura Ativa" : "Assinar Agora"}
              </CardTitle>
              <CardDescription>
                {subscriptionStatus?.isActive 
                  ? "Você já tem acesso a todas as funcionalidades premium"
                  : "Comece sua jornada premium hoje mesmo"
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              {subscriptionStatus?.isActive ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Crown className="w-8 h-8 text-emerald-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                    Você é um membro Premium!
                  </h3>
                  <p className="text-slate-600 dark:text-gray-400">
                    Aproveite todas as funcionalidades exclusivas do aplicativo.
                  </p>
                </div>
              ) : showPaymentForm && clientSecret ? (
                <Elements stripe={stripePromise} options={{ clientSecret }}>
                  <SubscriptionForm clientSecret={clientSecret} />
                </Elements>
              ) : (
                <div className="space-y-4">
                  <Button 
                    onClick={handleCreateSubscription}
                    disabled={createSubscriptionMutation.isPending}
                    className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3"
                  >
                    {createSubscriptionMutation.isPending ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                        Preparando...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Crown className="w-4 h-4" />
                        Assinar Premium
                      </div>
                    )}
                  </Button>
                  
                  <div className="text-center text-xs text-slate-500 dark:text-gray-500">
                    <p>Pagamento seguro processado pelo Stripe</p>
                    <p>SSL 256-bit • Dados protegidos</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}