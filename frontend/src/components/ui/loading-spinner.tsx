import React from "react";

type LoadingSpinnerProps = {
  size?: "sm" | "md" | "lg";
  color?: "primary" | "secondary" | "accent";
  className?: string;
};

const LoadingSpinner: React.FC<LoadingSpinnerProps> = React.memo(({ 
  size = "md",
  color = "primary",
  className = "",
}) => {
  // Size mappings
  const sizeClasses = {
    sm: "h-4 w-4 border-2",
    md: "h-8 w-8 border-3",
    lg: "h-12 w-12 border-4",
  };

  // Color mappings
  const colorClasses = {
    primary: "border-primary",
    secondary: "border-secondary",
    accent: "border-accent",
  };

  const spinnerSize = sizeClasses[size];
  const spinnerColor = colorClasses[color];

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div
        className={`${spinnerSize} ${spinnerColor} rounded-full border-t-transparent animate-spin`}
        role="status"
        aria-label="loading"
      />
    </div>
  );
});

export default LoadingSpinner;