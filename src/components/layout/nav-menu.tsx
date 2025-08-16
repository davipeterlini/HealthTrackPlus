import React from 'react';
import { cn } from '../../lib/utils';

interface NavItemProps {
  icon?: React.ReactNode;
  label: string;
  active?: boolean;
  href: string;
  onClick?: () => void;
}

export function NavItem({ 
  icon, 
  label, 
  active = false, 
  href,
  onClick
}: NavItemProps) {
  return (
    <a 
      href={href}
      onClick={(e) => {
        if (onClick) {
          e.preventDefault();
          onClick();
        }
      }}
      className={cn(
        'flex items-center px-3 py-2 rounded-md text-sm font-medium',
        'transition-colors duration-150',
        active 
          ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300'
          : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
      )}
    >
      {icon && <span className="mr-3">{icon}</span>}
      <span>{label}</span>
    </a>
  );
}

interface NavGroupProps {
  label: string;
  children: React.ReactNode;
}

export function NavGroup({ label, children }: NavGroupProps) {
  return (
    <div className="mb-6">
      <h3 className="px-3 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
        {label}
      </h3>
      <div className="space-y-1">
        {children}
      </div>
    </div>
  );
}

interface NavMenuProps {
  className?: string;
}

export function NavMenu({ className }: NavMenuProps) {
  // This is a sample navigation
  // Replace with your actual navigation items
  return (
    <nav className={cn('space-y-1', className)}>
      <NavGroup label="Health">
        <NavItem 
          label="Dashboard"
          href="/dashboard"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="7" height="9" x="3" y="3" rx="1" />
              <rect width="7" height="5" x="14" y="3" rx="1" />
              <rect width="7" height="9" x="14" y="12" rx="1" />
              <rect width="7" height="5" x="3" y="16" rx="1" />
            </svg>
          }
          active
        />
        <NavItem 
          label="Activity"
          href="/activity"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
          }
        />
        <NavItem 
          label="Nutrition"
          href="/nutrition"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
              <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
              <line x1="6" x2="6" y1="1" y2="4" />
              <line x1="10" x2="10" y1="1" y2="4" />
              <line x1="14" x2="14" y1="1" y2="4" />
            </svg>
          }
        />
      </NavGroup>
      
      <NavGroup label="Medical">
        <NavItem 
          label="Exams"
          href="/exams"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.414A2 2 0 0 0 19.414 6L14 .586A2 2 0 0 0 12.586 0H8a2 2 0 0 0-2 2z" />
              <path d="M14 3v4a1 1 0 0 0 1 1h4" />
              <path d="M9 12h6" />
              <path d="M9 16h6" />
            </svg>
          }
        />
        <NavItem 
          label="Medications"
          href="/medications"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m8 2 2 2-2 2 2 2-2 2 2 2" />
              <path d="M2 8h8" />
              <rect width="12" height="16" x="10" y="2" rx="2" />
              <path d="M14 6v4" />
              <path d="M16 8h-4" />
            </svg>
          }
        />
      </NavGroup>
      
      <NavGroup label="Account">
        <NavItem 
          label="Settings"
          href="/settings"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          }
        />
        <NavItem 
          label="Subscription"
          href="/subscription"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="20" height="14" x="2" y="5" rx="2" />
              <line x1="2" x2="22" y1="10" y2="10" />
            </svg>
          }
        />
      </NavGroup>
    </nav>
  );
}