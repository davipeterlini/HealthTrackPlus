import React, { useState, useEffect, useMemo } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  BarChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  AreaChart,
  Area
} from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

// Types for chart configuration
export interface ChartProps {
  data: any[];
  type: 'line' | 'bar' | 'pie' | 'radar' | 'area';
  title?: string;
  description?: string;
  height?: number | string;
  width?: number | string;
  colors?: string[];
  dataKeys: string[];
  xAxisKey?: string;
  labelKey?: string;
  formatter?: (value: any) => string;
  legendPosition?: 'top' | 'right' | 'bottom' | 'left';
  stacked?: boolean;
  showGrid?: boolean;
  children?: React.ReactNode;
  className?: string;
  rounded?: boolean;
  animate?: boolean;
  tooltip?: boolean;
  showDots?: boolean;
  innerRadius?: number;
  outerRadius?: number;
}

// Default color palette
const DEFAULT_COLORS = [
  '#4F86C6', // Blue
  '#4AB58E', // Green
  '#E57254', // Coral
  '#8B68C1', // Purple
  '#EAB464', // Amber
  '#5AC8FA', // Light Blue
  '#EC6B9C', // Pink
  '#66BB6A', // Light Green
  '#FF8A65', // Light Orange
  '#7986CB', // Indigo
];

export function EnhancedChart({
  data,
  type,
  title,
  description,
  height = 300,
  width = '100%',
  colors = DEFAULT_COLORS,
  dataKeys,
  xAxisKey = 'name',
  labelKey,
  formatter,
  legendPosition = 'bottom',
  stacked = false,
  showGrid = true,
  children,
  className = '',
  rounded = true,
  animate = true,
  tooltip = true,
  showDots = true,
  innerRadius = 0,
  outerRadius = 80
}: ChartProps) {
  // Prepare chart data for animation
  const [animatedData, setAnimatedData] = useState<any[]>([]);
  
  // Setup animation effect
  useEffect(() => {
    if (animate) {
      setAnimatedData([]);
      const timer = setTimeout(() => {
        setAnimatedData(data);
      }, 100);
      
      return () => clearTimeout(timer);
    } else {
      setAnimatedData(data);
    }
  }, [data, animate]);

  // Determine legend layout based on position
  const legendProps = useMemo(() => {
    switch (legendPosition) {
      case 'top': return { layout: 'horizontal', verticalAlign: 'top', align: 'center' };
      case 'right': return { layout: 'vertical', verticalAlign: 'middle', align: 'right' };
      case 'bottom': return { layout: 'horizontal', verticalAlign: 'bottom', align: 'center' };
      case 'left': return { layout: 'vertical', verticalAlign: 'middle', align: 'left' };
      default: return { layout: 'horizontal', verticalAlign: 'bottom', align: 'center' };
    }
  }, [legendPosition]);

  // Render chart based on type
  const renderChart = () => {
    switch (type) {
      case 'line':
        return (
          <LineChart 
            data={animatedData} 
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            {showGrid && <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />}
            <XAxis 
              dataKey={xAxisKey} 
              tick={{ fontSize: 12 }} 
              axisLine={{ stroke: '#e0e0e0' }}
              tickLine={false}
            />
            <YAxis 
              tick={{ fontSize: 12 }} 
              axisLine={{ stroke: '#e0e0e0' }}
              tickLine={false}
            />
            {tooltip && <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white', 
                borderRadius: 'var(--chart-tooltip-radius)',
                boxShadow: 'var(--shadow-md)',
                border: 'none',
              }} 
              formatter={formatter}
            />}
            <Legend {...legendProps} />
            {dataKeys.map((key, index) => (
              <Line 
                key={key}
                type="monotone" 
                dataKey={key} 
                stroke={colors[index % colors.length]} 
                strokeWidth={2}
                dot={showDots ? { r: 4, strokeWidth: 2, fill: 'white' } : false}
                activeDot={{ r: 6, strokeWidth: 0 }}
                isAnimationActive={animate}
              />
            ))}
          </LineChart>
        );
        
      case 'bar':
        return (
          <BarChart
            data={animatedData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            {showGrid && <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />}
            <XAxis 
              dataKey={xAxisKey} 
              tick={{ fontSize: 12 }} 
              axisLine={{ stroke: '#e0e0e0' }}
              tickLine={false}
            />
            <YAxis 
              tick={{ fontSize: 12 }} 
              axisLine={{ stroke: '#e0e0e0' }}
              tickLine={false}
            />
            {tooltip && <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white', 
                borderRadius: 'var(--chart-tooltip-radius)',
                boxShadow: 'var(--shadow-md)',
                border: 'none',
              }} 
              formatter={formatter}
            />}
            <Legend {...legendProps} />
            {dataKeys.map((key, index) => (
              <Bar 
                key={key} 
                dataKey={key} 
                fill={colors[index % colors.length]} 
                stackId={stacked ? "stack" : undefined}
                radius={rounded ? [4, 4, 0, 0] : [0, 0, 0, 0]}
                isAnimationActive={animate}
              />
            ))}
          </BarChart>
        );
        
      case 'pie':
        return (
          <PieChart>
            <Pie
              data={animatedData}
              dataKey={dataKeys[0]}
              nameKey={labelKey || xAxisKey}
              cx="50%"
              cy="50%"
              innerRadius={innerRadius}
              outerRadius={outerRadius}
              isAnimationActive={animate}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              labelLine={false}
            >
              {animatedData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={colors[index % colors.length]}
                />
              ))}
            </Pie>
            <Legend {...legendProps} />
            {tooltip && <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white', 
                borderRadius: 'var(--chart-tooltip-radius)',
                boxShadow: 'var(--shadow-md)',
                border: 'none',
              }} 
              formatter={formatter}
            />}
          </PieChart>
        );
        
      case 'radar':
        return (
          <RadarChart outerRadius={90} data={animatedData}>
            <PolarGrid stroke="#e0e0e0" />
            <PolarAngleAxis dataKey={labelKey || xAxisKey} tick={{ fontSize: 12 }} />
            <PolarRadiusAxis tick={{ fontSize: 12 }} axisLine={false} />
            {dataKeys.map((key, index) => (
              <Radar
                key={key}
                name={key}
                dataKey={key}
                stroke={colors[index % colors.length]}
                fill={colors[index % colors.length]}
                fillOpacity={0.6}
                isAnimationActive={animate}
              />
            ))}
            <Legend {...legendProps} />
            {tooltip && <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white', 
                borderRadius: 'var(--chart-tooltip-radius)',
                boxShadow: 'var(--shadow-md)',
                border: 'none',
              }} 
              formatter={formatter}
            />}
          </RadarChart>
        );
        
      case 'area':
        return (
          <AreaChart
            data={animatedData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            {showGrid && <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />}
            <XAxis 
              dataKey={xAxisKey} 
              tick={{ fontSize: 12 }} 
              axisLine={{ stroke: '#e0e0e0' }}
              tickLine={false}
            />
            <YAxis 
              tick={{ fontSize: 12 }} 
              axisLine={{ stroke: '#e0e0e0' }}
              tickLine={false}
            />
            {tooltip && <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white', 
                borderRadius: 'var(--chart-tooltip-radius)',
                boxShadow: 'var(--shadow-md)',
                border: 'none',
              }} 
              formatter={formatter}
            />}
            <Legend {...legendProps} />
            {dataKeys.map((key, index) => (
              <Area
                key={key}
                type="monotone"
                dataKey={key}
                stroke={colors[index % colors.length]}
                fill={colors[index % colors.length]}
                fillOpacity={0.3}
                strokeWidth={2}
                isAnimationActive={animate}
                activeDot={{ r: 6, strokeWidth: 0 }}
              />
            ))}
          </AreaChart>
        );
        
      default:
        return null;
    }
  };

  return (
    <Card className={`overflow-hidden ${className}`} style={{ borderRadius: 'var(--card-border-radius)' }}>
      {title && (
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
          {description && <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>}
        </CardHeader>
      )}
      <CardContent>
        <div style={{ width, height }}>
          <ResponsiveContainer>
            {renderChart()}
          </ResponsiveContainer>
        </div>
        {children}
      </CardContent>
    </Card>
  );
}