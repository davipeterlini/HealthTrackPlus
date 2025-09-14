import React, { useState, useEffect, memo } from "react";

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  loading?: "lazy" | "eager";
  objectFit?: "cover" | "contain" | "fill" | "none" | "scale-down";
  objectPosition?: string;
  fallbackSrc?: string;
  placeholderColor?: string;
  onLoad?: () => void;
  onError?: () => void;
}

/**
 * OptimizedImage component with lazy loading, blur-up effect, and fallback support
 */
const OptimizedImage = memo(({
  src,
  alt,
  width,
  height,
  className = "",
  loading = "lazy",
  objectFit = "cover",
  objectPosition = "center",
  fallbackSrc = "",
  placeholderColor = "#e2e8f0",
  onLoad,
  onError
}: OptimizedImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [imgSrc, setImgSrc] = useState<string>("");
  const [error, setError] = useState(false);

  // Use IntersectionObserver for more efficient lazy loading
  useEffect(() => {
    if (!src) return;

    const handleImageLoading = () => {
      const img = new Image();
      
      img.onload = () => {
        setImgSrc(src);
        setIsLoaded(true);
        if (onLoad) onLoad();
      };
      
      img.onerror = () => {
        setError(true);
        if (fallbackSrc) {
          setImgSrc(fallbackSrc);
          setIsLoaded(true);
        }
        if (onError) onError();
      };

      img.src = src;
    };

    if (loading === "eager") {
      handleImageLoading();
    } else {
      // Lazy load with IntersectionObserver
      const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          handleImageLoading();
          observer.disconnect();
        }
      }, {
        rootMargin: "200px", // Start loading when image is 200px away from viewport
      });

      const element = document.getElementById(`optimized-img-${src.split("/").pop()}`);
      if (element) observer.observe(element);

      return () => observer.disconnect();
    }
  }, [src, fallbackSrc, loading, onLoad, onError]);

  const uniqueId = src.split("/").pop();

  const containerStyle: React.CSSProperties = {
    position: "relative",
    overflow: "hidden",
    backgroundColor: placeholderColor,
    width: width ? `${width}px` : "100%",
    height: height ? `${height}px` : "auto",
  };

  const imgStyle: React.CSSProperties = {
    objectFit,
    objectPosition,
    width: "100%",
    height: "100%",
    transition: "opacity 0.3s, filter 0.3s",
    opacity: isLoaded ? 1 : 0,
    filter: isLoaded ? "none" : "blur(10px)",
  };

  return (
    <div 
      style={containerStyle} 
      className={className}
      id={`optimized-img-${uniqueId}`}
    >
      {imgSrc && (
        <img
          src={imgSrc}
          alt={alt}
          style={imgStyle}
        />
      )}
      {error && !fallbackSrc && (
        <div className="flex items-center justify-center w-full h-full text-gray-400 text-sm">
          {alt || "Image not available"}
        </div>
      )}
    </div>
  );
});

OptimizedImage.displayName = "OptimizedImage";

export { OptimizedImage };