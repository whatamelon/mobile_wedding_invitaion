import React from 'react';
import LazyImage from '../LazyImage';
import { BEHIND_IMAGES } from '../../constants';

const GALLERY_PHOTOS = BEHIND_IMAGES.map(img => `/images/behind_select/${img}`);

interface GalleryPreviewProps {
  onImageClick: (index: number, images: string[]) => void;
}

const GalleryPreview: React.FC<GalleryPreviewProps> = ({ onImageClick }) => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="px-6 mb-8 text-left">
        <h3 className="text-2xl font-serif-kr font-bold text-gray-800 leading-snug">마지막으로 한번 더<br/>보고 가실래요?</h3>
      </div>
      <div className="flex overflow-x-auto gap-4 px-6 pb-8 no-scrollbar snap-x">
        {GALLERY_PHOTOS.map((src, i) => (
          <div 
            key={i}
            className="flex-shrink-0 w-64 aspect-[3/4] rounded-2xl overflow-hidden shadow-md snap-center cursor-pointer active:scale-98 transition-transform"
            onClick={() => onImageClick(i, GALLERY_PHOTOS)}
          >
            <LazyImage 
              src={src} 
              alt={`Gallery ${i}`} 
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default GalleryPreview;
