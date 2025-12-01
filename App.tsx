import React, { useState } from 'react';
import HitCounter from './components/HitCounter';
import HeroSection from './components/sections/HeroSection';
import InvitationSection from './components/sections/InvitationSection';
import FamilySection from './components/sections/FamilySection';
import CalendarSection from './components/sections/CalendarSection';
import GalleryGrid from './components/sections/GalleryGrid';
import LocationSection from './components/sections/LocationSection';
import NoticeSection from './components/sections/NoticeSection';
import RsvpSection from './components/sections/RsvpSection';
import GalleryPreview from './components/sections/GalleryPreview';
import AccountSection from './components/sections/AccountSection';
import EndingCredits from './components/EndingCredits';
import Lightbox from './components/Lightbox';

const App: React.FC = () => {
  // Lightbox State
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentImageSet, setCurrentImageSet] = useState<string[]>([]);

  // Open Lightbox
  const openLightbox = (index: number, images: string[]) => {
    setCurrentImageSet(images);
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  // Close Lightbox
  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center">
      {/* Mobile Width Constraint Container */}
      <div className="w-full max-w-[480px] bg-white min-h-screen shadow-2xl relative overflow-hidden">
        
        <HeroSection />
        <InvitationSection />
        <FamilySection />
        <CalendarSection />
        <GalleryGrid onImageClick={openLightbox} />
        <LocationSection />
        <NoticeSection />
        <RsvpSection />
        <AccountSection />
        <GalleryPreview onImageClick={openLightbox} />
        <EndingCredits />

        {/* Floating Hit Counter */}
        <HitCounter />

        {/* Lightbox Overlay */}
        <Lightbox 
          isOpen={lightboxOpen}
          onClose={closeLightbox}
          images={currentImageSet}
          currentIndex={currentImageIndex}
          onIndexChange={setCurrentImageIndex}
        />

      </div>
    </div>
  );
};

export default App;
