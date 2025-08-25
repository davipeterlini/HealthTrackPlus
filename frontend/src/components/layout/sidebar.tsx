import React from 'react';
import { cn } from '../../lib/utils';

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  isOpen?: boolean;
  onClose?: () => void;
  isMobile?: boolean;
}

export function Sidebar({ 
  children,
  className,
  isOpen = true,
  onClose,
  isMobile = false,
  ...props
}: SidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={onClose}
        />
      )}
    
      <aside 
        className={cn(
          'h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800',
          'flex flex-col',
          {
            // Mobile sidebar
            'fixed inset-y-0 left-0 z-30 w-64 transform transition-transform duration-200 ease-in-out': isMobile,
            'translate-x-0': isMobile && isOpen,
            '-translate-x-full': isMobile && !isOpen,
            
            // Desktop sidebar
            'w-64 sticky top-0': !isMobile,
          },
          className
        )}
        {...props}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-800">
          <span className="text-lg font-bold text-gray-900 dark:text-white">HealthTrackPlus</span>
          {isMobile && (
            <button 
              onClick={onClose}
              className="p-2 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M18 6 6 18"/>
                <path d="m6 6 12 12"/>
              </svg>
            </button>
          )}
        </div>
        
        <div className="flex-1 overflow-y-auto py-4 px-4">
          {children}
        </div>
      </aside>
    </>
  );
}