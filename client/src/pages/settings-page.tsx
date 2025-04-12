import React from 'react';
import { useTranslation } from 'react-i18next';
import { MainLayout } from '@/components/layout/main-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/hooks/use-theme';
import { LanguageSwitcher } from '@/components/language-switcher';
import { ThemeToggle } from '@/components/theme-toggle';
import { useDevMode } from '@/hooks/use-dev-mode';
import { ArrowLeft, Check, Globe, Moon, Palette, Save, Shield, User } from 'lucide-react';

export default function SettingsPage() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { skipAuth, toggleSkipAuth } = useDevMode();
  
  return (
    <MainLayout>
      <div className="container py-6 max-w-4xl mx-auto">
        <Button 
          variant="outline" 
          size="sm"
          className="mb-6"
          onClick={() => window.history.back()}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t('common.back')}
        </Button>
        
        <h1 className="text-3xl font-bold mb-6">{t('navigation.settings')}</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <Card className="h-full bg-gray-50 dark:bg-[#1a2127] shadow-sm border-0">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Palette className="mr-2 h-5 w-5" />
                  {t('settings.appearance')}
                </CardTitle>
                <CardDescription>
                  {t('settings.appearanceDescription')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="theme">{t('settings.theme')}</Label>
                    <div className="flex items-center justify-between py-2">
                      <div className="flex items-center">
                        <Moon className="mr-2 h-4 w-4" />
                        <span>{t('settings.darkMode')}</span>
                      </div>
                      <ThemeToggle />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="md:col-span-1">
            <Card className="h-full bg-gray-50 dark:bg-[#1a2127] shadow-sm border-0">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Globe className="mr-2 h-5 w-5" />
                  {t('settings.language')}
                </CardTitle>
                <CardDescription>
                  {t('settings.languageDescription')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="language">{t('settings.selectLanguage')}</Label>
                    <div className="py-2">
                      <LanguageSwitcher />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="md:col-span-1">
            <Card className="h-full bg-gray-50 dark:bg-[#1a2127] shadow-sm border-0">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="mr-2 h-5 w-5" />
                  {t('settings.devMode')}
                </CardTitle>
                <CardDescription>
                  {t('settings.devModeDescription')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-2">
                    <div className="flex flex-col">
                      <span className="font-medium">{t('settings.skipAuth')}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {t('settings.skipAuthDescription')}
                      </span>
                    </div>
                    <Switch 
                      checked={skipAuth}
                      onCheckedChange={setSkipAuth}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}