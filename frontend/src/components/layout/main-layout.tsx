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
    <div className="responsive-page-layout bg-slate-50 dark:bg-gray-900">
      <Header />
      
      <main className="responsive-page-content responsive-vh pb-16 xs:pb-0">
        <div className="responsive-section">
          <div className={fullWidth ? "responsive-container" : "responsive-content-container"}>
            {title && !hideTitle && (
              <h1 className="responsive-title-lg text-slate-800 dark:text-gray-100 responsive-mb">{title}</h1>
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
