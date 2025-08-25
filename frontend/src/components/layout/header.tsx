import React from 'react';
import { Container } from '../ui/container';
import { useResponsive } from '../../hooks/use-responsive';

interface HeaderProps {
  title?: string;
  onMenuClick?: () => void;
}

export function Header({ title = 'HealthTrackPlus', onMenuClick }: HeaderProps) {
  const { isMobile } = useResponsive();
  
  return (
    <header className="w-full bg-white dark:bg-gray-900 shadow-sm sticky top-0 z-10">
      <Container className="h-16 flex items-center justify-between">
        {isMobile && (
          <button 
            onClick={onMenuClick}
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
              <line x1="4" x2="20" y1="12" y2="12"/>
              <line x1="4" x2="20" y1="6" y2="6"/>
              <line x1="4" x2="20" y1="18" y2="18"/>
            </svg>
          </button>
        )}
        
        <div className="flex items-center">
          <span className="text-xl font-bold text-gray-900 dark:text-white">{title}</span>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Profile or other header icons can go here */}
          <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700"></div>
        </div>
      </Container>
    </header>
  );
}