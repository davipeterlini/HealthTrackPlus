import React from 'react';
import { MainLayout } from '../components/layout/main-layout';
import { NavMenu } from '../components/layout/nav-menu';
import { MobileNav } from '../components/layout/mobile-nav';
import { Container } from '../components/ui/container';
import { Grid, GridItem } from '../components/ui/grid';
import { useResponsive } from '../hooks/use-responsive';

interface CardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

function Card({ title, children, className }: CardProps) {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 ${className}`}>
      <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">{title}</h2>
      {children}
    </div>
  );
}

export function DashboardPage() {
  const { isMobile } = useResponsive();
  
  return (
    <>
      <MainLayout
        title="Dashboard"
        navItems={<NavMenu />}
      >
        <Container>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Dashboard</h1>
          
          <Grid 
            columns={{ 
              xs: 1, 
              sm: 2, 
              lg: 3 
            }}
            gap={6}
            className="mb-8"
          >
            <GridItem>
              <Card title="Activity Summary">
                <div className="h-32 bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center">
                  <span className="text-gray-500 dark:text-gray-400">Activity Chart</span>
                </div>
              </Card>
            </GridItem>
            
            <GridItem>
              <Card title="Nutrition">
                <div className="h-32 bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center">
                  <span className="text-gray-500 dark:text-gray-400">Nutrition Chart</span>
                </div>
              </Card>
            </GridItem>
            
            <GridItem colSpan={{ xs: 1, sm: 2, lg: 1 }}>
              <Card title="Health Insights">
                <div className="h-32 bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center">
                  <span className="text-gray-500 dark:text-gray-400">Health Insights</span>
                </div>
              </Card>
            </GridItem>
          </Grid>
          
          <Grid 
            columns={{ 
              xs: 1, 
              lg: 2 
            }}
            gap={6}
          >
            <GridItem>
              <Card title="Recent Exams">
                <div className="space-y-4">
                  <div className="h-12 bg-gray-100 dark:bg-gray-700 rounded"></div>
                  <div className="h-12 bg-gray-100 dark:bg-gray-700 rounded"></div>
                  <div className="h-12 bg-gray-100 dark:bg-gray-700 rounded"></div>
                </div>
              </Card>
            </GridItem>
            
            <GridItem>
              <Card title="Upcoming Appointments">
                <div className="space-y-4">
                  <div className="h-12 bg-gray-100 dark:bg-gray-700 rounded"></div>
                  <div className="h-12 bg-gray-100 dark:bg-gray-700 rounded"></div>
                </div>
              </Card>
            </GridItem>
          </Grid>
        </Container>
      </MainLayout>
      
      {isMobile && <MobileNav />}
    </>
  );
}