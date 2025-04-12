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
        <div className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {title && !hideTitle && (
              <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">{title}</h1>
            )}
            
            <div className={`${title && !hideTitle ? 'mt-6' : 'mt-0'}`}>
              {children}
            </div>
          </div>
        </div>
      </main>
      
      <MobileNav />
    </div>
  );
}
