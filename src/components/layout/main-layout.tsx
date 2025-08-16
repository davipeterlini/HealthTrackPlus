import React, { useState } from 'react';
import { Header } from './header';
import { Sidebar } from './sidebar';
import { Container } from '../ui/container';
import { useResponsive } from '../../hooks/use-responsive';

interface MainLayoutProps {
  children: React.ReactNode;
  title?: string;
  navItems?: React.ReactNode;
}

export function MainLayout({ 
  children, 
  title,
  navItems 
}: MainLayoutProps) {
  const { isMobile, isTablet } = useResponsive();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const openSidebar = () => setSidebarOpen(true);
  const closeSidebar = () => setSidebarOpen(false);
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <Header 
        title={title} 
        onMenuClick={openSidebar} 
      />
      
      <div className="flex">
        {/* Sidebar - Always rendered but may be hidden on mobile */}
        <Sidebar 
          isMobile={isMobile || isTablet}
          isOpen={isMobile || isTablet ? sidebarOpen : true}
          onClose={closeSidebar}
          className={isMobile || isTablet ? '' : 'relative'}
        >
          {navItems}
        </Sidebar>
        
        {/* Main Content */}
        <main className={`flex-1 ${isMobile ? 'w-full' : ''}`}>
          <Container 
            className="py-6"
            maxWidth={isMobile ? 'full' : 'xl'}
          >
            {children}
          </Container>
        </main>
      </div>
    </div>
  );
}