
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity } from "@shared/schema";
import { Smartphone, Watch } from "lucide-react";

interface FitnessIntegrationsProps {
  onConnect: (provider: string) => void;
}

export function FitnessIntegrations({ onConnect }: FitnessIntegrationsProps) {
  const providers = [
    {
      name: "Google Fit",
      icon: <Smartphone className="h-5 w-5" />,
      connected: false
    },
    {
      name: "Apple Health",
      icon: <Watch className="h-5 w-5" />,
      connected: false
    }
  ];

  return (
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
                <span>{provider.name}</span>
              </div>
              <Button
                variant={provider.connected ? "outline" : "default"}
                onClick={() => onConnect(provider.name)}
              >
                {provider.connected ? "Connected" : "Connect"}
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
