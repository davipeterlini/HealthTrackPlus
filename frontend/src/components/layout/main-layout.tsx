import { Header } from "./header";
import { MobileNav } from "./mobile-nav";
import { SimpleMedicalChat } from "@/components/medical-chat/simple-medical-chat";
import { ReactNode } from "react";

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
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-gray-900">
      <Header />
      
      <main className="flex-1 w-full py-4 sm:py-6 md:py-8 pb-16 md:pb-0">
        <div className="my-4 md:my-8">
          <div className={fullWidth ? "w-full px-4 sm:px-6 md:px-8 mx-auto" : "w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8"}>
            {title && !hideTitle && (
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-800 dark:text-gray-100 mb-6 md:mb-8">{title}</h1>
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
