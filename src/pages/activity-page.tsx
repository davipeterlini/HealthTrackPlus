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

export function ActivityPage() {
  const { isMobile, isTablet } = useResponsive();
  
  return (
    <>
      <MainLayout
        title="Activity"
        navItems={<NavMenu />}
      >
        <Container>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Activity Tracking</h1>
          
          <div className={`flex ${isMobile || isTablet ? 'flex-col' : 'flex-row'} gap-6 mb-6`}>
            <div className={`${isMobile || isTablet ? 'w-full' : 'w-2/3'}`}>
              <Card title="Weekly Activity">
                <div className="h-64 bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center">
                  <span className="text-gray-500 dark:text-gray-400">Activity Chart</span>
                </div>
              </Card>
            </div>
            
            <div className={`${isMobile || isTablet ? 'w-full' : 'w-1/3'}`}>
              <Card title="Activity Summary">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-300">Steps</span>
                    <span className="font-medium">8,742</span>
                  </div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded-full">
                    <div className="h-2 bg-blue-500 rounded-full" style={{ width: '70%' }}></div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-300">Distance</span>
                    <span className="font-medium">5.3 km</span>
                  </div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded-full">
                    <div className="h-2 bg-green-500 rounded-full" style={{ width: '65%' }}></div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-300">Active Minutes</span>
                    <span className="font-medium">42 min</span>
                  </div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded-full">
                    <div className="h-2 bg-orange-500 rounded-full" style={{ width: '50%' }}></div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
          
          <Grid 
            columns={{ 
              xs: 1, 
              md: 3 
            }}
            gap={6}
            className="mb-6"
          >
            <GridItem>
              <Card title="Steps">
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-500">8,742</div>
                  <div className="text-gray-500 dark:text-gray-400">Daily Goal: 10,000</div>
                </div>
              </Card>
            </GridItem>
            
            <GridItem>
              <Card title="Distance">
                <div className="text-center">
                  <div className="text-4xl font-bold text-green-500">5.3 km</div>
                  <div className="text-gray-500 dark:text-gray-400">Daily Goal: 8 km</div>
                </div>
              </Card>
            </GridItem>
            
            <GridItem>
              <Card title="Active Minutes">
                <div className="text-center">
                  <div className="text-4xl font-bold text-orange-500">42 min</div>
                  <div className="text-gray-500 dark:text-gray-400">Daily Goal: 60 min</div>
                </div>
              </Card>
            </GridItem>
          </Grid>
          
          <Card title="Activity Breakdown">
            <div className="space-y-4">
              <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
                    <path d="M19 5.93 19 19"></path>
                    <path d="m5 15.93 4-2 3 2 4-2"></path>
                    <path d="M19 13.93 19 19"></path>
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">Walking</h3>
                  <div className="text-sm text-gray-500 dark:text-gray-400">7:30 - 8:15 AM · 4.2 km</div>
                </div>
                <div className="text-right">
                  <div className="font-medium">45 min</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">3,240 steps</div>
                </div>
              </div>
              
              <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500">
                    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path>
                    <path d="M11 2a2 2 0 0 1 2 2c0 .6-.4 1-1 1.5-2 1.7-2 6.5 0 8 .6.5 1 .9 1 1.5a2 2 0 1 1-4 0c0-.6.4-1 1-1.5 2-1.5 2-6.3 0-8-.6-.5-1-.9-1-1.5a2 2 0 0 1 2-2Z"></path>
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">Yoga</h3>
                  <div className="text-sm text-gray-500 dark:text-gray-400">6:00 - 6:30 PM</div>
                </div>
                <div className="text-right">
                  <div className="font-medium">30 min</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">120 calories</div>
                </div>
              </div>
            </div>
          </Card>
        </Container>
      </MainLayout>
      
      {isMobile && <MobileNav />}
    </>
  );
}