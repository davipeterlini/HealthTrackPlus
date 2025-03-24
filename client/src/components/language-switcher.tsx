
import { useTranslation } from 'react-i18next';
import { Button } from './ui/button';

export function LanguageSwitcher() {
  const { i18n } = useTranslation();

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => i18n.changeLanguage('pt')}
        disabled={i18n.language === 'pt'}
      >
        PT
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => i18n.changeLanguage('en')}
        disabled={i18n.language === 'en'}
      >
        EN
      </Button>
    </div>
  );
}
