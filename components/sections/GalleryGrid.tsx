import React from 'react';
import { FadeInUp } from '../AnimationWrapper';
import LazyImage from '../LazyImage';
import { WEDDING_IMAGES } from '../../constants';

const WEDDING_PHOTOS = WEDDING_IMAGES.map(img => `/images/wedding_select/${img}`);

interface GalleryGridProps {
  onImageClick: (index: number, images: string[]) => void;
}

const GalleryGrid: React.FC<GalleryGridProps> = ({ onImageClick }) => {
  return (
    <section className="bg-white">
      <FadeInUp>
        <div className="pt-20 pb-6 px-6 text-left">
          <h3 className="text-2xl font-serif-kr font-bold text-gray-800 leading-snug">저희 한번 보고 가실래요?</h3>
        </div>
        {/* 3 Columns, 1px Gap, 21 Photos */}
        <div className="grid grid-cols-3 gap-[2px]">
          {WEDDING_PHOTOS.map((src, i) => (
            <div 
              key={i} 
              className="aspect-square relative overflow-hidden bg-gray-100 cursor-pointer"
              onClick={() => onImageClick(i, WEDDING_PHOTOS)}
            >
              <LazyImage 
                src={src} 
                alt={`Wedding Photo ${i + 1}`} 
              />
            </div>
          ))}
        </div>
      </FadeInUp>
    </section>
  );
};

export default GalleryGrid;
