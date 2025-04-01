import { useDevMode } from "@/hooks/use-dev-mode";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useLocation } from "wouter";
import Draggable from "react-draggable";
import { useState } from "react";
import { ChevronDown, ChevronUp, GripHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";

export function DevModeToggle() {
  const { skipAuth, toggleSkipAuth } = useDevMode();
  const [location, setLocation] = useLocation();
  const [isMinimized, setIsMinimized] = useState(false);

  const handleToggle = () => {
    const newSkipAuthValue = !skipAuth;
    toggleSkipAuth();
    
    // Se ativando o modo de desenvolvimento e estamos na página de autenticação,
    // redirecione para o dashboard
    if (newSkipAuthValue && location === "/auth") {
      setLocation("/dashboard");
    }
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  return (
    <Draggable handle=".drag-handle">
      <div className="fixed bottom-4 right-4 bg-white dark:bg-gray-900 shadow-lg rounded-lg border dark:border-gray-700 z-50 flex flex-col">
        <div className="drag-handle flex items-center justify-between p-2 cursor-move border-b dark:border-gray-700">
          <div className="flex items-center">
            <GripHorizontal className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
            <span className="text-xs font-medium dark:text-gray-100">Dev Mode</span>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-6 w-6 p-0" 
            onClick={toggleMinimize}
          >
            {isMinimized ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
        
        {!isMinimized && (
          <div className="p-3 flex items-center gap-2">
            <Switch 
              id="dev-mode" 
              checked={skipAuth}
              onCheckedChange={handleToggle}
            />
            <Label htmlFor="dev-mode" className="text-sm font-medium cursor-pointer dark:text-gray-100">
              Pular autenticação
            </Label>
          </div>
        )}
      </div>
    </Draggable>
  );
}