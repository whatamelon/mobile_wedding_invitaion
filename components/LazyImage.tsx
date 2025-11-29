import React from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/opacity.css';

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
}

const LazyImage: React.FC<LazyImageProps> = ({ src, alt, className, ...props }) => {
  return (
    <div 
      className={`w-full h-full bg-gray-100 relative overflow-hidden ${className || ''}`}
    >
      <LazyLoadImage
        alt={alt}
        src={src}
        effect="opacity"
        className="w-full h-full object-cover"
        wrapperClassName="w-full h-full block"
        threshold={300} // Load images 300px before they appear for smoother scrolling
        placeholderSrc="data:image/gif;base64,R0lGODlhAQABAIAAAMLCwgAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==" // simple gray placeholder
        {...props}
      />
    </div>
  );
};

export default LazyImage;
