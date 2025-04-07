import React from 'react';
import { useTranslation } from 'react-i18next';
import { Code } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDevMode } from '@/hooks/use-dev-mode';
import DevModeDialog from '@/components/dev-mode/dev-mode-dialog';

const DevModeButton: React.FC = () => {
  const { t } = useTranslation();
  const { isEnabled } = useDevMode();
  const [dialogOpen, setDialogOpen] = React.useState(false);

  return (
    <>
      <Button
        variant="default"
        size="default"
        onClick={() => setDialogOpen(true)}
        className="bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center gap-2 px-4 shadow-md"
      >
        <Code className="h-4 w-4" />
        <span>devMode.{isEnabled ? 'on' : 'off'}</span>
      </Button>

      <DevModeDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </>
  );
};

export default DevModeButton;