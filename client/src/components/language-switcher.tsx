
import { useTranslation } from 'react-i18next';
import { Button } from './ui/button';
import { Languages } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

export function LanguageSwitcher() {
  const { i18n } = useTranslation();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9"
        >
          <Languages className="h-4 w-4" />
          <span className="sr-only">
            {i18n.language === 'pt' ? 'Mudar idioma' : 'Change language'}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => i18n.changeLanguage('pt')}
          className={i18n.language === 'pt' ? 'bg-accent' : ''}
        >
          Português (PT)
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => i18n.changeLanguage('en')}
          className={i18n.language === 'en' ? 'bg-accent' : ''}
        >
          English (EN)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
