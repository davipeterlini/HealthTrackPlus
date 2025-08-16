import React from 'react';
import { cn } from '../../lib/utils';

interface MobileNavItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  active?: boolean;
}

export function MobileNavItem({ icon, label, href, active = false }: MobileNavItemProps) {
  return (
    <a
      href={href}
      className={cn(
        'flex flex-col items-center justify-center',
        'text-xs font-medium',
        active 
          ? 'text-blue-600 dark:text-blue-400'
          : 'text-gray-600 dark:text-gray-400'
      )}
    >
      <div className={cn(
        'rounded-lg p-1 mb-1',
        active 
          ? 'bg-blue-100 dark:bg-blue-900/30'
          : 'bg-transparent'
      )}>
        {icon}
      </div>
      <span>{label}</span>
    </a>
  );
}

interface MobileNavProps {
  className?: string;
}

export function MobileNav({ className }: MobileNavProps) {
  return (
    <div className={cn(
      'fixed bottom-0 left-0 right-0 z-10',
      'bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800',
      'px-4 py-2',
      className
    )}>
      <div className="flex items-center justify-between">
        <MobileNavItem 
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="7" height="9" x="3" y="3" rx="1" />
              <rect width="7" height="5" x="14" y="3" rx="1" />
              <rect width="7" height="9" x="14" y="12" rx="1" />
              <rect width="7" height="5" x="3" y="16" rx="1" />
            </svg>
          }
          label="Dashboard"
          href="/dashboard"
          active
        />
        <MobileNavItem 
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
          }
          label="Activity"
          href="/activity"
        />
        <MobileNavItem 
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.414A2 2 0 0 0 19.414 6L14 .586A2 2 0 0 0 12.586 0H8a2 2 0 0 0-2 2z" />
              <path d="M14 3v4a1 1 0 0 0 1 1h4" />
            </svg>
          }
          label="Exams"
          href="/exams"
        />
        <MobileNavItem 
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          }
          label="Settings"
          href="/settings"
        />
      </div>
    </div>
  );
}