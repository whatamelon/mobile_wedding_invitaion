import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Calendar, Clock, Phone, MessageCircle, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { FadeInUp, PopIn } from './components/AnimationWrapper';
import HitCounter from './components/HitCounter';
import { 
  GROOM_NAME, BRIDE_NAME, WEDDING_DATE, WEDDING_TIME, 
  LOCATION_NAME, LOCATION_ADDRESS 
} from './constants';

// Fixed Image Data to ensure consistent navigation
const WEDDING_PHOTOS = Array.from({ length: 21 }, (_, i) => `https://picsum.photos/800/1200?random=${100 + i}`);
const GALLERY_PHOTOS = Array.from({ length: 5 }, (_, i) => `https://picsum.photos/800/1200?random=${200 + i}`);

const App: React.FC = () => {
  const [isCopied, setIsCopied] = useState(false);
  
  // Lightbox State
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentImageSet, setCurrentImageSet] = useState<string[]>([]);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(LOCATION_ADDRESS);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Open Lightbox
  const openLightbox = (index: number, images: string[]) => {
    setCurrentImageSet(images);
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  // Close Lightbox
  const closeLightbox = () => {
    setLightboxOpen(false);
    setTouchStart(null);
    setTouchEnd(null);
  };

  // Navigation
  const showNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % currentImageSet.length);
  };

  const showPrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + currentImageSet.length) % currentImageSet.length);
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
    if (lightboxOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [lightboxOpen]);

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center">
      {/* Mobile Width Constraint Container */}
      <div className="w-full max-w-[480px] bg-white min-h-screen shadow-2xl relative overflow-hidden">
        
        {/* Hero Section */}
        <section className="relative h-[85vh] overflow-hidden">
          <motion.div 
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
            className="absolute inset-0 z-0"
          >
            <img 
              src="assets/main.jpg" 
              alt="Wedding Couple" 
              className="w-full h-full object-cover opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/90" />
          </motion.div>

          <div className="absolute inset-0 z-10 flex flex-col justify-between p-8 pb-16">
            <FadeInUp delay={0.2}>
              <div className="border border-white/50 backdrop-blur-sm bg-white/30 inline-block px-4 py-1 rounded-full">
                <p className="text-sm font-english tracking-widest text-gray-800">WEDDING INVITATION</p>
              </div>
            </FadeInUp>

            <div className="text-center space-y-4">
              <FadeInUp delay={0.4}>
                <h1 className="text-5xl font-english text-gray-800 leading-tight">
                  {GROOM_NAME}<br/>
                  <span className="text-3xl text-gray-500">&</span><br/>
                  {BRIDE_NAME}
                </h1>
              </FadeInUp>
              
              <FadeInUp delay={0.6}>
                <div className="w-12 h-[1px] bg-gray-400 mx-auto my-6" />
                <p className="text-lg font-serif-kr text-gray-700">
                  {WEDDING_DATE} {WEDDING_TIME}
                </p>
                <p className="text-sm text-gray-500 mt-1">{LOCATION_NAME}</p>
              </FadeInUp>
            </div>
          </div>
        </section>

        {/* Invitation Text */}
        <section className="py-16 px-8 text-center bg-white">
          <FadeInUp>
            <div className="mb-8">
              <span className="text-pink-500 text-xl">❝</span>
            </div>
            <h2 className="text-2xl font-serif-kr font-bold mb-8 leading-relaxed text-gray-800">
              서로가 서로에게<br/>
              가장 아름다운<br/>
              배경이 되겠습니다.
            </h2>
            <p className="text-gray-600 leading-loose font-serif-kr text-sm">
              같은 생각, 같은 마음으로<br/>
              지혜롭게 살겠습니다.<br/>
              저희 두 사람의 새로운 시작을<br/>
              함께 축복해 주시면 감사하겠습니다.
            </p>
          </FadeInUp>
        </section>

        {/* Family Info */}
        <section className="py-12 px-6 bg-pink-50/50">
          <FadeInUp>
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-pink-100">
              <div className="flex justify-between items-center mb-6">
                <div className="text-center w-full">
                  <span className="text-gray-400 text-xs block mb-1">신랑측 혼주</span>
                  <p className="text-gray-800 font-serif-kr">
                    <span className="font-bold">홍국조</span> · <span className="font-bold">이소희</span>
                    <span className="text-gray-400 text-xs ml-2">의 아들</span> 
                    <span className="text-xl font-bold ml-2 text-gray-900">{GROOM_NAME.slice(1)}</span>
                  </p>
                </div>
              </div>
              <div className="h-[1px] bg-gray-100 w-full mb-6" />
              <div className="flex justify-between items-center">
                <div className="text-center w-full">
                  <span className="text-gray-400 text-xs block mb-1">신부측 혼주</span>
                  <p className="text-gray-800 font-serif-kr">
                    <span className="font-bold">서용남</span> · <span className="font-bold">박민희</span>
                    <span className="text-gray-400 text-xs ml-2">의 딸</span>
                    <span className="text-xl font-bold ml-2 text-gray-900">{BRIDE_NAME.slice(1)}</span>
                  </p>
                </div>
              </div>
            </div>
          </FadeInUp>
        </section>

        {/* Calendar Section (Visual Only) */}
        <section className="py-16 px-6 bg-white">
           <FadeInUp>
             <h3 className="font-english text-3xl text-center text-gray-800 mb-2">March, 2025</h3>
             <p className="text-center text-gray-400 text-xs tracking-widest mb-8">THE WEDDING DAY</p>
             <div className="bg-gray-50 rounded-2xl p-6 max-w-xs mx-auto">
               <div className="grid grid-cols-7 gap-4 text-center text-sm text-gray-500 font-serif-kr">
                 <div className="text-red-400">일</div><div>월</div><div>화</div><div>수</div><div>목</div><div>금</div><div>토</div>
                 {/* Week 1 */}
                 <div></div><div></div><div></div><div></div><div></div><div></div><div>1</div>
                 {/* Week 2 */}
                 <div className="text-red-400">2</div><div>3</div><div>4</div><div>5</div><div>6</div><div>7</div><div>8</div>
                 {/* Week 3 */}
                 <div className="text-red-400">9</div><div>10</div><div>11</div><div>12</div><div>13</div><div>14</div><div>15</div>
                 {/* Week 4 */}
                 <div className="text-red-400">16</div><div>17</div><div>18</div><div>19</div><div>20</div>
                 <div className="relative">
                   <span className="relative z-10 text-white font-bold">21</span>
                   <motion.div 
                    layoutId="day-circle"
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-pink-400 rounded-full z-0"
                   />
                 </div>
                 <div>22</div>
                 {/* Week 5 */}
                 <div className="text-red-400">23</div><div>24</div><div>25</div><div>26</div><div>27</div><div>28</div><div>29</div>
                 {/* Week 6 */}
                 <div className="text-red-400">30</div><div>31</div>
               </div>
             </div>
             <div className="text-center mt-8">
               <p className="text-lg font-bold text-gray-800">2025년 3월 21일 금요일 오후 2시</p>
               <Countdown targetDate="2025-03-21T14:00:00" />
             </div>
           </FadeInUp>
        </section>

        {/* Wedding Photo Grid (New Section) */}
        <section className="bg-white">
          <FadeInUp>
            <div className="py-10 text-center">
              <h3 className="font-english text-3xl text-gray-800">Wedding Photo</h3>
              <p className="text-gray-400 text-xs mt-2 tracking-widest">OUR BEAUTIFUL MOMENTS</p>
            </div>
            {/* 3 Columns, 1px Gap, 21 Photos */}
            <div className="grid grid-cols-3 gap-[1px]">
              {WEDDING_PHOTOS.map((src, i) => (
                <motion.div 
                  key={i} 
                  className="aspect-square relative overflow-hidden bg-gray-100 cursor-pointer"
                  whileHover={{ scale: 1.02, zIndex: 10 }}
                  onClick={() => openLightbox(i, WEDDING_PHOTOS)}
                >
                  <img 
                    src={src} 
                    alt={`Wedding Photo ${i + 1}`} 
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </motion.div>
              ))}
            </div>
          </FadeInUp>
        </section>

        {/* Location Info */}
        <section className="py-16 px-6 bg-white">
          <FadeInUp>
            <div className="text-center mb-10">
              <span className="text-pink-500 font-bold tracking-widest text-xs uppercase mb-2 block">Location</span>
              <h3 className="text-2xl font-bold font-serif-kr text-gray-800">{LOCATION_NAME}</h3>
              <p className="text-gray-500 mt-2 text-sm">{LOCATION_ADDRESS}</p>
              
              <div className="mt-4 flex justify-center gap-2">
                <button 
                  onClick={handleCopyAddress}
                  className="bg-gray-100 text-gray-600 px-3 py-1 rounded-lg text-xs flex items-center gap-1 active:bg-gray-200 transition-colors"
                >
                  {isCopied ? "복사완료!" : "주소 복사하기"}
                </button>
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="w-full h-64 bg-gray-200 rounded-2xl overflow-hidden mb-8 relative group">
              <img src="https://picsum.photos/800/400?grayscale" className="w-full h-full object-cover opacity-60" alt="Map" />
              <div className="absolute inset-0 flex items-center justify-center">
                 <a 
                   href={`https://map.naver.com/v5/search/${LOCATION_ADDRESS}`} 
                   target="_blank" 
                   rel="noreferrer"
                   className="bg-white/90 backdrop-blur px-6 py-3 rounded-full shadow-lg font-bold text-gray-800 flex items-center gap-2 hover:scale-105 transition-transform"
                 >
                   <MapPin className="w-4 h-4 text-green-500" /> 네이버 지도로 보기
                 </a>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-2xl">
                <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500"/> 자차 이용시
                </h4>
                <p className="text-sm text-gray-600 pl-4">
                  주차: <strong>가능</strong><br/>
                  교회 내 주차장을 이용하실 수 있습니다.
                </p>
              </div>

              <div className="bg-gray-50 p-6 rounded-2xl">
                <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500"/> 대중교통 이용시
                </h4>
                <p className="text-sm text-gray-600 pl-4">
                  가까운 역: <strong>판교역, 수내역</strong><br/>
                  역에서 택시 이용시 기본요금 거리입니다.
                </p>
              </div>
            </div>
          </FadeInUp>
        </section>

        {/* Notices - Updated to Light Theme */}
        <section className="py-20 px-6 bg-white border-t border-gray-100">
          <FadeInUp>
            <div className="text-center mb-12">
              <span className="text-pink-500 font-bold tracking-widest text-xs uppercase mb-2 block">Information</span>
              <h3 className="font-english text-3xl text-gray-800">Notice</h3>
            </div>
            
            <div className="space-y-6">
              <div className="bg-gray-50 p-8 rounded-3xl text-center">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-pink-500 shadow-sm mx-auto mb-4">
                  <MessageCircle size={20} />
                </div>
                <h4 className="font-bold text-lg text-gray-800 mb-2 font-serif-kr">축하 화환 정중히 사절합니다</h4>
                <div className="w-8 h-[1px] bg-gray-200 mx-auto my-4" />
                <p className="text-gray-600 text-sm leading-loose font-serif-kr">
                  보내주시는 축하의 마음만 감사히 받겠습니다.<br/>
                  공간 사용의 이유로 화환은 정중히 사절하오니<br/>
                  너른 양해 부탁드립니다.
                </p>
              </div>

              <div className="bg-gray-50 p-8 rounded-3xl text-center">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-blue-500 shadow-sm mx-auto mb-4">
                   <Clock size={20} />
                </div>
                <h4 className="font-bold text-lg text-gray-800 mb-2 font-serif-kr">식사 안내</h4>
                <div className="w-8 h-[1px] bg-gray-200 mx-auto my-4" />
                <p className="text-gray-600 text-sm leading-loose font-serif-kr">
                  식사는 <strong>오후 1시 30분부터</strong><br/>
                  3층 식당에서 준비되어 있습니다.<br/>
                  맛있는 식사와 함께 즐거운 시간 보내세요.
                </p>
              </div>
            </div>
          </FadeInUp>
        </section>

        {/* Gallery Preview (Moved to Bottom) */}
        <section className="py-16 bg-gray-50">
          <div className="px-6 mb-8">
            <h3 className="font-english text-3xl text-gray-800">Gallery</h3>
            <p className="text-gray-500 text-sm mt-2">See more photos</p>
          </div>
          <div className="flex overflow-x-auto gap-4 px-6 pb-8 no-scrollbar snap-x">
            {GALLERY_PHOTOS.map((src, i) => (
              <motion.div 
                key={i}
                className="flex-shrink-0 w-64 aspect-[3/4] rounded-2xl overflow-hidden shadow-md snap-center cursor-pointer"
                whileTap={{ scale: 0.98 }}
                onClick={() => openLightbox(i, GALLERY_PHOTOS)}
              >
                <img 
                  src={src} 
                  alt={`Gallery ${i}`} 
                  className="w-full h-full object-cover"
                />
              </motion.div>
            ))}
          </div>
        </section>

        {/* Share & Footer */}
        <section className="py-20 px-6 bg-white text-center">
          <PopIn>
            <button className="w-full bg-[#fae100] text-[#3b1e1e] py-4 rounded-xl font-bold text-lg mb-4 flex items-center justify-center gap-2">
              <MessageCircle className="fill-[#3b1e1e]" /> 카카오톡으로 공유하기
            </button>
            <p className="text-gray-400 text-xs mt-8">
              © 2025 Seungho & Heeju. All rights reserved.
            </p>
          </PopIn>
        </section>

        {/* Floating Hit Counter */}
        <HitCounter />

        {/* Lightbox Overlay */}
        <AnimatePresence>
          {lightboxOpen && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 touch-none"
              onClick={closeLightbox}
            >
              <button 
                className="absolute top-4 right-4 text-white/70 p-2 z-50"
                onClick={closeLightbox}
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
                  key={currentImageIndex} // Key change triggers animation
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2 }}
                  src={currentImageSet[currentImageIndex]} 
                  alt="Gallery Detail" 
                  className="max-w-full max-h-[80vh] object-contain select-none"
                />

                {/* Next Button */}
                <button 
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-white/50 hover:text-white transition-colors z-10"
                  onClick={showNext}
                >
                  <ChevronRight size={40} />
                </button>

                {/* Image Counter */}
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/80 font-english text-sm tracking-widest">
                  {currentImageIndex + 1} / {currentImageSet.length}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};

// Helper Component for Countdown
const Countdown: React.FC<{ targetDate: string }> = ({ targetDate }) => {
  const calculateTimeLeft = () => {
    const difference = +new Date(targetDate) - +new Date();
    let timeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearTimeout(timer);
  });

  return (
    <div className="flex justify-center gap-3 mt-4 text-gray-500">
      <div className="bg-gray-100 rounded-lg p-2 w-12 flex flex-col items-center">
        <span className="font-bold text-lg text-pink-500">{timeLeft.days}</span>
        <span className="text-[10px]">DAYS</span>
      </div>
      <div className="bg-gray-100 rounded-lg p-2 w-12 flex flex-col items-center">
        <span className="font-bold text-lg text-gray-700">{timeLeft.hours}</span>
        <span className="text-[10px]">HRS</span>
      </div>
      <div className="bg-gray-100 rounded-lg p-2 w-12 flex flex-col items-center">
        <span className="font-bold text-lg text-gray-700">{timeLeft.minutes}</span>
        <span className="text-[10px]">MIN</span>
      </div>
      <div className="bg-gray-100 rounded-lg p-2 w-12 flex flex-col items-center">
        <span className="font-bold text-lg text-gray-700">{timeLeft.seconds}</span>
        <span className="text-[10px]">SEC</span>
      </div>
    </div>
  );
};

export default App;