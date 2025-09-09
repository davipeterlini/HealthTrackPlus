
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
      className="h-7 w-7 xxs:h-8 xxs:w-8 p-1.5 xxs:p-1.5 transition-all border-blue-200 dark:border-gray-600 bg-blue-600 hover:bg-blue-700 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-full"
    >
      {theme === "dark" ? (
        <Sun className="h-4 w-4 xxs:h-5 xxs:w-5 text-white" />
      ) : (
        <Moon className="h-4 w-4 xxs:h-5 xxs:w-5 text-white" />
      )}
    </Button>
  );
}
