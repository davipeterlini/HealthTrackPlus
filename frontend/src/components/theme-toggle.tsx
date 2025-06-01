
import { useTheme } from "@/hooks/use-theme";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      onClick={toggleTheme}
      variant="ghost"
      size="icon"
      className="responsive-button-icon transition-all border-blue-200 dark:border-gray-600 bg-blue-600 hover:bg-blue-700 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-full"
    >
      {theme === "dark" ? (
        <Sun className="responsive-icon text-white" />
      ) : (
        <Moon className="responsive-icon text-white" />
      )}
    </Button>
  );
}
