import { Header } from "./header";
import { MobileNav } from "./mobile-nav";
import { ReactNode } from "react";

interface MainLayoutProps {
  children: ReactNode;
  title?: string; // Tornando o título opcional
  hideTitle?: boolean; // Adicionando opção para esconder o título
}

export function MainLayout({ children, title, hideTitle = false }: MainLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-800">
      <Header />
      
      <main className="flex-grow pb-16 md:pb-0">
        <div className="responsive-section">
          <div className="max-w-7xl mx-auto responsive-container">
            {title && !hideTitle && (
              <h1 className="responsive-title-lg text-gray-800 dark:text-gray-100">{title}</h1>
            )}
            
            <div className={`${title && !hideTitle ? 'responsive-mt' : 'mt-0'}`}>
              {children}
            </div>
          </div>
        </div>
      </main>
      
      <MobileNav />
    </div>
  );
}
