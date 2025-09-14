import React from "react";
import LoadingSpinner from "./loading-spinner";

type LoadingScreenProps = {
  message?: string;
};

const LoadingScreen: React.FC<LoadingScreenProps> = React.memo(({ 
  message = "Carregando...",
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] p-4">
      <LoadingSpinner size="lg" className="mb-4" />
      <p className="text-md text-slate-600 dark:text-gray-400 animate-pulse">{message}</p>
    </div>
  );
});

export default LoadingScreen;