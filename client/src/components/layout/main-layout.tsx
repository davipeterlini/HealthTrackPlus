import { Header } from "./header";
import { MobileNav } from "./mobile-nav";
import { ReactNode } from "react";

interface MainLayoutProps {
  children: ReactNode;
  title: string;
}

export function MainLayout({ children, title }: MainLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-grow pb-16 md:pb-0">
        <div className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
            
            <div className="mt-6">
              {children}
            </div>
          </div>
        </div>
      </main>
      
      <MobileNav />
    </div>
  );
}
