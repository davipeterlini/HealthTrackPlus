import { useDevMode } from "@/hooks/use-dev-mode";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useLocation } from "wouter";

export function DevModeToggle() {
  const { skipAuth, toggleSkipAuth } = useDevMode();
  const [location, setLocation] = useLocation();

  const handleToggle = () => {
    const newSkipAuthValue = !skipAuth;
    toggleSkipAuth();
    
    // Se ativando o modo de desenvolvimento e estamos na página de autenticação,
    // redirecione para o dashboard
    if (newSkipAuthValue && location === "/auth") {
      setLocation("/dashboard");
    }
  };

  return (
    <div className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 p-3 shadow-lg rounded-lg border z-50 flex items-center gap-2">
      <Switch 
        id="dev-mode" 
        checked={skipAuth}
        onCheckedChange={handleToggle}
      />
      <Label htmlFor="dev-mode" className="text-sm font-medium cursor-pointer">
        Pular autenticação (Dev Mode)
      </Label>
    </div>
  );
}