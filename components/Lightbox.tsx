import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

interface LightboxProps {
  isOpen: boolean;
  onClose: () => void;
  images: string[];
  currentIndex: number;
  onIndexChange: (index: number) => void;
}

const Lightbox: React.FC<LightboxProps> = ({
  isOpen,
  onClose,
  images,
  currentIndex,
  onIndexChange,
}) => {
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  
  // Refs for thumbnail scrolling
  const thumbnailContainerRef = useRef<HTMLDivElement>(null);
  const thumbnailRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Navigation
  const showNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    onIndexChange((currentIndex + 1) % images.length);
  };

  const showPrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    onIndexChange((currentIndex - 1 + images.length) % images.length);
  };

  // Swipe Logic
  const minSwipeDistance = 50;
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };
  const onTouchMove = (e: React.TouchEvent) => setTouchEnd(e.targetTouches[0].clientX);
  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe) showNext();
    if (isRightSwipe) showPrev();
  };

  // Lock Body Scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Scroll active thumbnail to center
  useEffect(() => {
    if (isOpen && thumbnailRefs.current[currentIndex]) {
      thumbnailRefs.current[currentIndex]?.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest'
      });
    }
  }, [currentIndex, isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 touch-none"
          onClick={onClose}
        >
          <button 
            className="absolute top-4 right-4 text-white/70 p-2 z-50"
            onClick={onClose}
          >
            <X size={32} />
          </button>
          
          <div 
            className="w-full h-full flex items-center justify-center relative"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking image area
          >
            {/* Previous Button */}
            <button 
              className="absolute left-2 top-1/2 -translate-y-1/2 p-2 text-white/50 hover:text-white transition-colors z-10"
              onClick={showPrev}
            >
              <ChevronLeft size={40} />
            </button>

            {/* Main Image */}
            <motion.img 
              key={currentIndex} // Key change triggers animation
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
              src={images[currentIndex]} 
              alt="Gallery Detail" 
              className="max-w-full max-h-[70vh] object-contain select-none mb-20"
              draggable={false}
            />

            {/* Next Button */}
            <button 
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-white/50 hover:text-white transition-colors z-10"
              onClick={showNext}
            >
              <ChevronRight size={40} />
            </button>

            {/* Image Counter */}
            <div className="absolute top-6 left-1/2 -translate-x-1/2 text-white/80 font-english text-sm tracking-widest bg-black/20 px-3 py-1 rounded-full backdrop-blur-sm">
              {currentIndex + 1} / {images.length}
            </div>

            {/* Thumbnail Strip */}
            <div 
              className="absolute bottom-0 left-0 right-0 p-4 pb-8 bg-gradient-to-t from-black/90 to-transparent"
              onTouchStart={(e) => e.stopPropagation()}
              onTouchMove={(e) => e.stopPropagation()}
              onTouchEnd={(e) => e.stopPropagation()}
            >
              <div 
                className="flex gap-2 overflow-x-auto no-scrollbar px-4 justify-start md:justify-center"
                ref={thumbnailContainerRef}
              >
                {images.map((src, i) => (
                  <button
                    key={i}
                    ref={(el) => { thumbnailRefs.current[i] = el; }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onIndexChange(i);
                    }}
                    className={`relative flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                      currentIndex === i 
                        ? 'border-white scale-110 z-10 shadow-lg' 
                        : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img 
                      src={src} 
                      alt={`Thumbnail ${i + 1}`} 
                      className="w-full h-full object-cover"
                      draggable={false}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Lightbox;

