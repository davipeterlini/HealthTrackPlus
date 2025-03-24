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
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-10">
      <div className="grid grid-cols-5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.path;
          
          return (
            <Link key={item.path} href={item.path}>
              <a className={`flex flex-col items-center py-3 ${
                isActive ? 'text-primary' : 'text-gray-500'
              }`}>
                <Icon className="h-5 w-5" />
                <span className="text-xs mt-1">{item.label}</span>
              </a>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
