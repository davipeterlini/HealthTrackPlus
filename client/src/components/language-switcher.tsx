
import { useTranslation } from 'react-i18next';
import { Button } from './ui/button';
import { Languages } from 'lucide-react';

export function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'pt' ? 'en' : 'pt';
    i18n.changeLanguage(newLang);
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-9 w-9"
      onClick={toggleLanguage}
    >
      <Languages className="h-4 w-4" />
      <span className="sr-only">
        {i18n.language === 'pt' ? 'Change to English' : 'Mudar para Português'}
      </span>
    </Button>
  );
}
