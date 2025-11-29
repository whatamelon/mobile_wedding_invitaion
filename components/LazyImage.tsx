import React, { useState, useEffect, useRef } from 'react';

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
}

const LazyImage: React.FC<LazyImageProps> = ({ src, alt, className, ...props }) => {
  const [isInView, setIsInView] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // When the image comes into view
        if (entries[0].isIntersecting) {
          setIsInView(true);
          observer.disconnect(); // Stop observing once triggered
        }
      },
      { 
        rootMargin: '50px', // Load images 50px before they appear in viewport
        threshold: 0.1 
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      if (observer) observer.disconnect();
    };
  }, []);

  return (
    <div 
      ref={imgRef} 
      className={`w-full h-full bg-gray-100 relative overflow-hidden ${className || ''}`}
    >
      {isInView && (
        <img
          src={src}
          alt={alt}
          className={`w-full h-full object-cover transition-opacity duration-500 ease-in-out ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setIsLoaded(true)}
          {...props}
        />
      )}
    </div>
  );
};

export default LazyImage;

