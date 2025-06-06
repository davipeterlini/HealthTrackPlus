
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity } from "@shared/schema";
import { Smartphone, Watch, Camera, MapPin, Share } from "lucide-react";
import { useNativeHealth } from "../../hooks/use-native-health";
import { useToast } from "@/hooks/use-toast";

interface FitnessIntegrationsProps {
  onConnect: (provider: string) => void;
}

export function FitnessIntegrations({ onConnect }: FitnessIntegrationsProps) {
  const { 
    isNative, 
    deviceInfo, 
    connectToAppleHealth, 
    connectToGoogleFit,
    captureHealthPhoto,
    getCurrentLocation,
    shareHealthData,
    vibrate
  } = useNativeHealth();
  const { toast } = useToast();

  const handleNativeConnect = async (provider: string) => {
    await vibrate();
    
    if (provider === "Apple Health") {
      const connected = await connectToAppleHealth();
      if (connected) {
        toast({
          title: "Conectado ao Apple Health",
          description: "Dados de saúde sincronizados com sucesso!",
        });
      }
    } else if (provider === "Google Fit") {
      const connected = await connectToGoogleFit();
      if (connected) {
        toast({
          title: "Conectado ao Google Fit",
          description: "Dados de atividade sincronizados com sucesso!",
        });
      }
    }
    
    onConnect(provider);
  };

  const handleCapturePhoto = async () => {
    try {
      const photo = await captureHealthPhoto();
      toast({
        title: "Foto capturada",
        description: "Foto de atividade salva com sucesso!",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível capturar a foto",
        variant: "destructive"
      });
    }
  };

  const handleGetLocation = async () => {
    try {
      const position = await getCurrentLocation();
      toast({
        title: "Localização obtida",
        description: `Lat: ${position.coords.latitude.toFixed(4)}, Lng: ${position.coords.longitude.toFixed(4)}`,
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível obter a localização",
        variant: "destructive"
      });
    }
  };

  const handleShare = async () => {
    try {
      await shareHealthData({ steps: 8456, calories: 1850 });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível compartilhar",
        variant: "destructive"
      });
    }
  };

  const providers = [
    {
      name: "Google Fit",
      icon: <Smartphone className="h-5 w-5" />,
      connected: false,
      available: !isNative || deviceInfo?.platform === 'android'
    },
    {
      name: "Apple Health",
      icon: <Watch className="h-5 w-5" />,
      connected: false,
      available: !isNative || deviceInfo?.platform === 'ios'
    }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Connect Fitness Apps</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {providers.map((provider) => (
              <div key={provider.name} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  {provider.icon}
                  <div>
                    <span>{provider.name}</span>
                    {!provider.available && (
                      <div className="text-xs text-gray-500">Não disponível neste dispositivo</div>
                    )}
                  </div>
                </div>
                <Button
                  variant={provider.connected ? "outline" : "default"}
                  onClick={() => handleNativeConnect(provider.name)}
                  disabled={!provider.available}
                >
                  {provider.connected ? "Connected" : "Connect"}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {isNative && (
        <Card>
          <CardHeader>
            <CardTitle>Recursos Nativos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                variant="outline"
                onClick={handleCapturePhoto}
                className="flex flex-col items-center p-4 h-auto"
              >
                <Camera className="h-6 w-6 mb-2" />
                <span>Capturar Foto</span>
              </Button>
              
              <Button
                variant="outline"
                onClick={handleGetLocation}
                className="flex flex-col items-center p-4 h-auto"
              >
                <MapPin className="h-6 w-6 mb-2" />
                <span>Localização</span>
              </Button>
              
              <Button
                variant="outline"
                onClick={handleShare}
                className="flex flex-col items-center p-4 h-auto"
              >
                <Share className="h-6 w-6 mb-2" />
                <span>Compartilhar</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
