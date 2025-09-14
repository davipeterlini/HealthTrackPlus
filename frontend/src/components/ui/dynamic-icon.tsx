import React, { useState, useEffect } from 'react';
import { loadIcon } from '@/utils/dynamic-import';
import { LucideProps } from 'lucide-react';

interface DynamicIconProps extends Omit<LucideProps, 'ref'> {
  name: string;
  fallback?: React.ReactNode;
  onLoad?: () => void;
  onError?: () => void;
}

/**
 * DynamicIcon component that loads Lucide icons on demand to reduce bundle size
 */
export const DynamicIcon = React.memo(({
  name,
  fallback = null,
  onLoad,
  onError,
  ...props
}: DynamicIconProps) => {
  const [IconComponent, setIconComponent] = useState<React.ComponentType<LucideProps> | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    setIconComponent(null);
    setError(false);
    
    loadIcon(name)
      .then(Icon => {
        if (typeof Icon === 'function' || typeof Icon === 'object') {
          setIconComponent(() => Icon as React.ComponentType<LucideProps>);
          if (onLoad) onLoad();
        } else {
          setError(true);
          if (onError) onError();
        }
      })
      .catch(() => {
        setError(true);
        if (onError) onError();
      });
  }, [name, onLoad, onError]);

  if (error || !IconComponent) {
    return <>{fallback}</>;
  }

  return <IconComponent {...props} />;
});

DynamicIcon.displayName = 'DynamicIcon';