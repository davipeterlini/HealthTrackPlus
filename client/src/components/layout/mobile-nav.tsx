import { Link, useLocation } from "wouter";
import { 
  LayoutDashboard,
  FileText,
  Activity,
  Utensils,
  Video
} from "lucide-react";

export function MobileNav() {
  const [location] = useLocation();
  
  const navItems = [
    { path: "/", label: "Home", icon: LayoutDashboard },
    { path: "/exams", label: "Exams", icon: FileText },
    { path: "/activity", label: "Activity", icon: Activity },
    { path: "/nutrition", label: "Nutrition", icon: Utensils },
    { path: "/videos", label: "Videos", icon: Video }
  ];
  
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 shadow-lg z-10">
      <div className="grid grid-cols-5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.path;
          
          return (
            <div key={item.path} className="flex justify-center">
              <Link href={item.path} className={`flex flex-col items-center py-3 ${
                isActive 
                  ? 'text-primary dark:text-primary-foreground font-medium' 
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}>
                <Icon className="h-5 w-5" />
                <span className="text-xs mt-1">{item.label}</span>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
