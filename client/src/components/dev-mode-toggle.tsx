import { useDevMode } from "@/hooks/use-dev-mode";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export function DevModeToggle() {
  const { skipAuth, toggleSkipAuth } = useDevMode();

  return (
    <div className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 p-3 shadow-lg rounded-lg border z-50 flex items-center gap-2">
      <Switch 
        id="dev-mode" 
        checked={skipAuth}
        onCheckedChange={toggleSkipAuth}
      />
      <Label htmlFor="dev-mode" className="text-sm font-medium cursor-pointer">
        Pular autenticação (Dev Mode)
      </Label>
    </div>
  );
}