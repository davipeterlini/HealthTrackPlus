import React, { useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { HealthInsight } from '@shared/schema';
import { Activity, Heart, Apple, Brain, Microscope } from 'lucide-react';
import { VirtualizedGrid } from '@/components/ui/virtualized-list';

interface VirtualizedInsightsGridProps {
  insights: HealthInsight[];
  isLoading?: boolean;
  height?: number;
  columnCount?: number;
  rowHeight?: number;
}

export function VirtualizedInsightsGrid({
  insights,
  isLoading = false,
  height = 600,
  columnCount = 3,
  rowHeight = 220
}: VirtualizedInsightsGridProps) {
  
  // Get appropriate icon for insight category
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Cardiovascular":
        return <Heart className="h-5 w-5" />;
      case "Nutrition":
        return <Apple className="h-5 w-5" />;
      case "Metabolism":
        return <Activity className="h-5 w-5" />;
      case "Brain":
      case "Mental":
        return <Brain className="h-5 w-5" />;
      default:
        return <Microscope className="h-5 w-5" />;
    }
  };

  // Get appropriate color based on severity
  const getSeverityColor = (severity: string): string => {
    switch (severity) {
      case "critical":
        return "bg-red-50 text-red-600 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800";
      case "attention":
        return "bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800";
      case "normal":
      default:
        return "bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800";
    }
  };

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="responsive-grid-3 responsive-gap-y">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-4 animate-pulse bg-white dark:bg-[#1a2127] border-emerald-100 dark:border-[#2b353e] responsive-card">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 w-1/2 rounded mb-3"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 w-3/4 rounded mb-2"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 w-full rounded mb-2"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 w-5/6 rounded mb-4"></div>
            <div className="h-6 bg-gray-200 dark:bg-gray-700 w-1/3 rounded"></div>
          </Card>
        ))}
      </div>
    );
  }

  // Empty state
  if (insights.length === 0) {
    return (
      <Card className="p-6 text-center bg-white dark:bg-[#1a2127] border-emerald-100 dark:border-[#2b353e] responsive-card">
        <div className="mx-auto w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
          <Activity className="h-6 w-6 text-gray-500 dark:text-gray-400" />
        </div>
        <h3 className="responsive-title-sm mb-2 text-slate-800 dark:text-white">No insights yet</h3>
        <p className="responsive-text-sm text-slate-600 dark:text-slate-400 mb-4">
          Upload an exam to get personalized health insights
        </p>
      </Card>
    );
  }

  // Render an individual insight card
  const renderInsightCard = (insight: HealthInsight, index: number, isVisible: boolean) => {
    // If the item isn't currently visible, render a lightweight placeholder
    if (!isVisible) {
      return <div className="h-full" />;
    }

    return (
      <Card className="p-5 flex flex-col h-full bg-white dark:bg-[#1a2127] border-emerald-100 dark:border-[#2b353e] responsive-card">
        <div className="flex justify-between items-start responsive-mb-xs">
          <div className="flex items-center">
            <div className={`p-2 rounded-full ${insight.severity === 'normal' ? 'bg-emerald-50 dark:bg-emerald-900/20' : insight.severity === 'attention' ? 'bg-amber-50 dark:bg-amber-900/20' : 'bg-red-50 dark:bg-red-900/20'} mr-3`}>
              {getCategoryIcon(insight.category)}
            </div>
            <h3 className="responsive-text-md font-semibold text-slate-800 dark:text-white">{insight.title}</h3>
          </div>
          <Badge className={getSeverityColor(insight.severity)}>
            {insight.severity.charAt(0).toUpperCase() + insight.severity.slice(1)}
          </Badge>
        </div>
        <p className="responsive-text-sm text-slate-600 dark:text-slate-400 responsive-mb-xs">
          {insight.description}
        </p>
        <div className="mt-auto">
          <div className="responsive-text-xs text-slate-500 dark:text-slate-400 mb-1">
            Recommendation:
          </div>
          <p className="responsive-text-sm text-emerald-600 dark:text-emerald-400">
            {insight.recommendation}
          </p>
        </div>
      </Card>
    );
  };

  return (
    <VirtualizedGrid
      items={insights}
      height={height}
      columnCount={columnCount}
      rowHeight={rowHeight}
      renderItem={renderInsightCard}
      className="w-full"
      gridGap={16}
    />
  );
}