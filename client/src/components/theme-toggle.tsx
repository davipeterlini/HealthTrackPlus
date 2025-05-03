
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
      className="h-7 w-7 xxs:h-8 xxs:w-8 sm:h-10 sm:w-10 md:h-11 md:w-11 lg:h-12 lg:w-12 transition-all border-blue-200 dark:border-gray-600 bg-blue-600 hover:bg-blue-700 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-full"
    >
      {theme === "dark" ? (
        <Sun className="h-3.5 w-3.5 xxs:h-4 xxs:w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 lg:h-7 lg:w-7 text-white" />
      ) : (
        <Moon className="h-3.5 w-3.5 xxs:h-4 xxs:w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 lg:h-7 lg:w-7 text-white" />
      )}
    </Button>
  );
}
