import React from 'react';
import { useTranslation } from 'react-i18next';
import { AlertTriangle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { useDevMode } from '@/hooks/use-dev-mode';

interface DevModeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DevModeDialog: React.FC<DevModeDialogProps> = ({ open, onOpenChange }) => {
  const { t } = useTranslation();
  const { isEnabled, bypassAuth, toggleBypassAuth, disableDevMode } = useDevMode();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-gray-900 text-white border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-white">{t('devMode.title')}</DialogTitle>
        </DialogHeader>
        
        <p className="text-gray-400 text-sm">{t('devMode.description')}</p>
        
        <div className="bg-red-950/50 border border-red-800 rounded-lg p-4 mt-2 flex items-start gap-3">
          <AlertTriangle className="text-red-500 h-5 w-5 mt-0.5 flex-shrink-0" />
          <div>
            <span className="text-red-400 font-medium">{t('devMode.warning')}</span>{' '}
            <span className="text-gray-300">{t('devMode.warningMessage')}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between py-2">
          <div className="space-y-0.5">
            <h4 className="text-white">{t('devMode.title')}</h4>
            <p className="text-gray-400 text-sm">{t('devMode.bypassAuth')}</p>
          </div>
          <Switch
            checked={bypassAuth}
            onCheckedChange={toggleBypassAuth}
            className="data-[state=checked]:bg-teal-500"
          />
        </div>
        
        <DialogFooter className="mt-2">
          <Button 
            variant="outline" 
            onClick={() => {
              disableDevMode();
              onOpenChange(false);
            }}
            className="border-gray-700 text-gray-200 hover:bg-gray-800"
          >
            {t('devMode.disable')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DevModeDialog;