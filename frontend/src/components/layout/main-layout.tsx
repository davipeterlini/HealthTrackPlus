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
    <div className="flex flex-col min-h-[100vh] h-full max-w-full overflow-x-hidden bg-slate-50 dark:bg-gray-900">
      <Header />
      
      <main className={`flex-1 w-full max-w-full overflow-x-hidden py-2 xxs:py-3 xs:py-4 sm:py-5 ${contentHeightClass} pb-16 xs:pb-0`}>
        <div className="mb-2 xxs:mb-3 xs:mb-4 w-full max-w-full overflow-x-hidden">
          <div className={`${containerClass} max-w-full overflow-x-hidden box-border`}>
            {title && !hideTitle && (
              <h1 className={`${titleClass} text-slate-800 dark:text-gray-100 ${titleSpacingClass} break-words`}>{title}</h1>
            )}
            
            <div className={`${title && !hideTitle ? '' : 'mt-0'} w-full max-w-full overflow-x-hidden box-border`}>
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
