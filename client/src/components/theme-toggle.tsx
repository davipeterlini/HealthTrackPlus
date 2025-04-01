import { useTheme } from "@/hooks/use-theme";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const { t } = useTranslation();

  return (
    <Button
      onClick={toggleTheme}
      variant="outline"
      size="sm"
      className="flex items-center gap-2 px-3 h-9 border-2 transition-all bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"
    >
      {theme === "dark" ? (
        <>
          <Sun className="h-4 w-4 text-yellow-500" />
          <span className="text-sm font-medium">{t("Light Mode")}</span>
        </>
      ) : (
        <>
          <Moon className="h-4 w-4 text-indigo-600" />
          <span className="text-sm font-medium">{t("Dark Mode")}</span>
        </>
      )}
    </Button>
  );
}