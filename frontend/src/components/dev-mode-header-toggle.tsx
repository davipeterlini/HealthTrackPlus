import { useDevMode } from "@/hooks/use-dev-mode";
import { Switch } from "@/components/ui/switch";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Code2 } from "lucide-react";

export function DevModeHeaderToggle() {
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
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className={`h-8 w-8 md:h-9 md:w-9 ${
            skipAuth 
              ? 'text-emerald-600 dark:text-emerald-400' 
              : 'text-slate-500 dark:text-gray-400'
          } hover:text-slate-700 dark:hover:text-gray-300`}
        >
          <Code2 className="h-4 w-4 md:h-5 md:w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem className="flex items-center justify-between">
          <span className="text-sm">Modo Desenvolvedor</span>
          <Switch 
            checked={skipAuth}
            onCheckedChange={handleToggle}
          />
        </DropdownMenuItem>
        <DropdownMenuItem disabled className="text-xs text-muted-foreground">
          Pula autenticação para desenvolvimento
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}