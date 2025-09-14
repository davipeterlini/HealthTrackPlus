import React from "react";
import { Card } from "@/components/ui/card";
import { Activity, Heart, Moon, Apple, Droplet, AlertCircle, 
  FileText, Brain, Pill, Calculator, Clock, BellIcon, Timer, Star, Baby } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";

interface StatCardProps {
  title: string;
  value: string | number;
  trend?: 'up' | 'down';
  changeText: string;
  iconBgColor: string;
  icon: React.ReactNode;
  trendPositive?: boolean;
}

export const StatCard = React.memo(({ 
  title, 
  value, 
  trend = 'up', 
  changeText, 
  iconBgColor, 
  icon, 
  trendPositive = true 
}: StatCardProps) => {
  return (
    <Card className="bg-white dark:bg-[#1a2127] border border-emerald-100 dark:border-0 p-1.5 xxs:p-2 xs:p-3 md:p-4 rounded-lg shadow-md w-full max-w-full overflow-hidden box-border">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-slate-600 dark:text-gray-400 mb-1 xxs:mb-1.5 responsive-text-sm">{title}</p>
          <h2 className="responsive-title-xl font-bold mb-1 xxs:mb-1.5">
            {value}
          </h2>
          <p className={`flex items-center responsive-text-sm ${trendPositive ? 'text-emerald-500 dark:text-emerald-400' : 'text-red-500 dark:text-red-400'}`}>
            <span className="mr-1">{trend === 'up' ? '↑' : '↓'}</span>
            {changeText}
          </p>
        </div>
        <div className={`${iconBgColor} p-1.5 xxs:p-2 xs:p-2.5 rounded-full shadow-sm`}>
          {icon}
        </div>
      </div>
    </Card>
  );
});

interface ModuleCardProps {
  title: string;
  path: string;
  description?: string;
  iconBgColor: string;
  icon: React.ReactNode;
  gradientColors: string;
}

export const ModuleCard = React.memo(({
  title,
  path,
  description,
  iconBgColor,
  icon,
  gradientColors
}: ModuleCardProps) => {
  return (
    <Link to={path}>
      <Card className={`p-3 sm:p-4 md:p-5 bg-gradient-to-br ${gradientColors} border-0 shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer`}>
        <div className="flex flex-col items-center text-center">
          <div className={`p-2 sm:p-3 mb-2 rounded-full ${iconBgColor}`}>
            {icon}
          </div>
          <h3 className="font-semibold text-sm sm:text-base text-slate-800 dark:text-white">{title}</h3>
          {description && <p className="text-xs text-slate-600 dark:text-gray-400 mt-0.5 hidden md:block">{description}</p>}
        </div>
      </Card>
    </Link>
  );
});

interface HydrationTrackerProps {
  waterAmount: number;
  waterGoal: number;
  waterPercentage: number;
  addWater: (amount: number) => void;
  removeWater: (amount: number) => void;
  hydrationTitle: string;
  goalLabel: string;
}

export const HydrationTracker = React.memo(({
  waterAmount,
  waterGoal,
  waterPercentage,
  addWater,
  removeWater,
  hydrationTitle,
  goalLabel
}: HydrationTrackerProps) => {
  return (
    <Card className="bg-white dark:bg-[#1a2127] border border-emerald-100 dark:border-0 p-2 xxs:p-3 xs:p-4 sm:p-5 shadow-md rounded-lg w-full max-w-full overflow-hidden box-border">
      <div className="flex justify-between items-center mb-2 xxs:mb-3 xs:mb-4">
        <Link to="/hydration" className="group">
          <h3 className="text-sm xxs:text-base xs:text-lg sm:text-xl font-semibold text-slate-800 dark:text-white group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors">{hydrationTitle}</h3>
        </Link>
        <div className="relative w-5 xxs:w-6 xs:w-8 h-4 xxs:h-5">
          <Droplet className="absolute h-4 w-4 xxs:h-5 xxs:w-5 text-blue-500 dark:text-blue-400 right-0" />
          <Droplet className="absolute h-3 w-3 xxs:h-4 xxs:w-4 text-teal-400 dark:text-teal-300 left-0 top-0.5" />
        </div>
      </div>
      
      <div className="space-y-2 xxs:space-y-3 xs:space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-slate-800 dark:text-white text-sm xxs:text-base xs:text-lg font-medium">{waterAmount} ml</span>
          <span className="text-slate-500 dark:text-gray-400 text-[10px] xxs:text-xs">{goalLabel}: {waterGoal} ml</span>
        </div>
        
        <div className="h-1.5 xxs:h-2 xs:h-2.5 w-full bg-slate-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-teal-400 dark:bg-teal-500 rounded-full transition-all duration-300" 
            style={{ width: `${waterPercentage}%` }}
          ></div>
        </div>
        
        <div className="flex justify-center gap-2 xxs:gap-2.5 xs:gap-3 mt-2 xxs:mt-3 xs:mt-4">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => removeWater(150)}
            className="border-teal-400 dark:border-teal-500 border bg-transparent hover:bg-teal-50 dark:hover:bg-teal-900/20 text-teal-500 dark:text-blue-400 rounded-full h-6 xxs:h-7 xs:h-8 px-1.5 xxs:px-2 xs:px-2.5"
          >
            <span className="text-teal-500 dark:text-blue-400 mr-0.5">−</span>
            <span className="text-teal-500 dark:text-blue-400 text-[10px] xxs:text-xs">150ml</span>
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => addWater(250)}
            className="border-blue-400 dark:border-blue-500 border bg-transparent hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-500 dark:text-blue-400 rounded-full h-6 xxs:h-7 xs:h-8 px-1.5 xxs:px-2 xs:px-2.5"
          >
            <span className="text-blue-500 dark:text-blue-400 mr-0.5">+</span>
            <span className="text-blue-500 dark:text-blue-400 text-[10px] xxs:text-xs">250ml</span>
          </Button>
        </div>
      </div>
    </Card>
  );
});

interface ExamAlertProps {
  id: string | number;
  name: string;
  date: string;
  status: string;
  getStatusColor: (status: string) => string;
}

export const ExamAlert = React.memo(({
  id,
  name,
  date,
  status,
  getStatusColor
}: ExamAlertProps) => {
  return (
    <div key={id} className={`flex justify-between items-center p-2 sm:p-3 rounded-lg border shadow-sm dark:border-0 ${getStatusColor(status)} dark:bg-[#2a3137]`}>
      <div className="flex items-start gap-2 sm:gap-3">
        <div className={`p-1.5 sm:p-2 rounded-full bg-white dark:bg-[#1a2127] shadow-sm`}>
          <FileText className={`h-3 w-3 sm:h-4 sm:w-4 ${status === "Critical" || status === "Low" ? "text-red-500" : status === "High" || status === "Attention" ? "text-amber-500" : "text-emerald-500"}`} />
        </div>
        <div>
          <p className="font-medium text-slate-800 dark:text-white text-[10px] xxs:text-xs xs:text-sm">{name}</p>
          <p className="text-[9px] xxs:text-[10px] xs:text-xs text-slate-600 dark:text-gray-400">{date}</p>
        </div>
      </div>
      <Badge variant="outline" className={`text-xs ${status === "Critical" || status === "Low" ? "border-red-200 text-red-500" : status === "High" || status === "Attention" ? "border-amber-200 text-amber-500" : "border-emerald-200 text-emerald-500"}`}>
        {status}
      </Badge>
    </div>
  );
});