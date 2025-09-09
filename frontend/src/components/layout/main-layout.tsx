import { Header } from "./header";
import { MobileNav } from "./mobile-nav";
import { SimpleMedicalChat } from "@/components/medical-chat/simple-medical-chat";
import { ReactNode } from "react";
import { useResponsive } from "@/hooks/use-responsive";

interface MainLayoutProps {
  children: ReactNode;
  title?: string; // Tornando o título opcional
  hideTitle?: boolean; // Adicionando opção para esconder o título
  fullWidth?: boolean; // Opção para conteúdo em largura total
}

export function MainLayout({ 
  children, 
  title, 
  hideTitle = false,
  fullWidth = false 
}: MainLayoutProps) {
  const { 
    isMobile, 
    getContainer, 
    getContentHeight, 
    getFontSize, 
    getSpacingClass 
  } = useResponsive();

  // Determine appropriate container class based on fullWidth prop
  const containerClass = getContainer(fullWidth ? 'full' : 'content');
  
  // Get appropriate content height with bottom nav adjustment
  const contentHeightClass = getContentHeight(isMobile);
  
  // Get appropriate title and spacing classes
  const titleClass = getFontSize('title-lg');
  const titleSpacingClass = getSpacingClass('m', 'b');

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-gray-900">
      <Header />
      
      <main className={`flex-1 w-full py-4 xs:py-5 sm:py-6 md:py-8 ${contentHeightClass} pb-16 xs:pb-0`}>
        <div className="my-3 xs:my-4 sm:my-5 md:my-8">
          <div className={containerClass}>
            {title && !hideTitle && (
              <h1 className={`${titleClass} text-slate-800 dark:text-gray-100 ${titleSpacingClass}`}>{title}</h1>
            )}
            
            <div className={`${title && !hideTitle ? '' : 'mt-0'}`}>
              {children}
            </div>
          </div>
        </div>
      </main>
      
      <MobileNav />
      <SimpleMedicalChat />
    </div>
  );
}
