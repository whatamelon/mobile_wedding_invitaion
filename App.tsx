import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Calendar, Clock, Phone, MessageCircle, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { FadeInUp, PopIn } from './components/AnimationWrapper';
import HitCounter from './components/HitCounter';
import LazyImage from './components/LazyImage';
import { 
  GROOM_NAME, BRIDE_NAME, WEDDING_DATE, WEDDING_TIME, 
  LOCATION_NAME, LOCATION_ADDRESS,
  WEDDING_IMAGES, BEHIND_IMAGES
} from './constants';

// Fixed Image Data to ensure consistent navigation
const WEDDING_PHOTOS = WEDDING_IMAGES.map(img => `/images/${img}`);
const GALLERY_PHOTOS = BEHIND_IMAGES.map(img => `/images/${img}`);

const App: React.FC = () => {
  const [isCopied, setIsCopied] = useState(false);
  
  // Lightbox State
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [calendarModalOpen, setCalendarModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentImageSet, setCurrentImageSet] = useState<string[]>([]);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  
  // Refs for thumbnail scrolling
  const thumbnailContainerRef = useRef<HTMLDivElement>(null);
  const thumbnailRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(LOCATION_ADDRESS);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Helper Functions for Calendar
  const handleGoogleCalendar = () => {
    const title = `${GROOM_NAME} & ${BRIDE_NAME} 결혼식`;
    const description = "저희 두 사람의 새로운 시작을 함께 축복해 주세요.";
    const location = `${LOCATION_NAME} (${LOCATION_ADDRESS})`;
    // 화면에 표시된 2026-03-21 14:00 기준
    const startDate = "20260321T140000";
    const endDate = "20260321T160000"; // 2시간 예정
    
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${startDate}/${endDate}&details=${encodeURIComponent(description)}&location=${encodeURIComponent(location)}`;
    window.open(url, '_blank');
  };

  const handleDownloadCalendar = () => {
    const title = `${GROOM_NAME} & ${BRIDE_NAME} 결혼식`;
    const description = "저희 두 사람의 새로운 시작을 함께 축복해 주세요.";
    const location = `${LOCATION_NAME} (${LOCATION_ADDRESS})`;
    const startDate = "20260321T140000";
    const endDate = "20260321T160000";

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'BEGIN:VEVENT',
      `DTSTART:${startDate}`,
      `DTEND:${endDate}`,
      `SUMMARY:${title}`,
      `DESCRIPTION:${description}`,
      `LOCATION:${location}`,
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'wedding_invitation.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
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

  // Scroll active thumbnail to center
  useEffect(() => {
    if (lightboxOpen && thumbnailRefs.current[currentImageIndex]) {
      thumbnailRefs.current[currentImageIndex]?.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest'
      });
    }
  }, [currentImageIndex, lightboxOpen]);

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
              src="./public/images/main.jpg" 
              alt="Wedding Couple" 
              className="w-full h-full object-cover opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-white/90" />
          </motion.div>

          <div className="absolute inset-0 z-10 flex flex-col justify-between p-8 pb-16">
            <div className="text-center space-y-4 translate-y-10">
              <FadeInUp delay={0.4}>
                <h1 className="text-4xl flex w-fit text-center mx-auto font-english text-gray-800 leading-tight">
                  {GROOM_NAME}
                  <span className="text-3xl text-[#88A874] font-english my-auto flex items-center">&</span>
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
        <section className="py-20 px-8 text-center bg-white">
          <FadeInUp>
            <div className="mb-8">
              <span className="text-[#88A874] text-xl">❝</span>
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
        <section className="py-20 px-6 bg-[#F5F9F2]">
          <FadeInUp>
            <div className="text-left mb-6">
              <h3 className="text-2xl font-serif-kr font-bold text-gray-800 leading-snug">저희의 부모님이세요.</h3>
            </div>
            <div className="bg-white py-8 px-2 rounded-3xl shadow-sm border border-[#E6F0E6]">
              <div className="flex items-center justify-center">
                <div className="text-center w-1/2 border-r border-gray-100">
                  <span className="text-gray-400 text-xs block mb-2">신랑측 혼주</span>
                  <div className="text-gray-800 font-serif-kr">
                    <div className="mb-1">
                      <span className="font-bold">홍국조</span> · <span className="font-bold">이소희</span>
                    </div>
                    <div>
                      <span className="text-gray-400 text-xs mr-1">의 아들</span>
                      <span className="text-xl font-bold text-gray-900">{GROOM_NAME.slice(1)}</span>
                    </div>
                  </div>
                </div>
                <div className="text-center w-1/2">
                  <span className="text-gray-400 text-xs block mb-2">신부측 혼주</span>
                  <div className="text-gray-800 font-serif-kr">
                    <div className="mb-1">
                      <span className="font-bold">서용남</span> · <span className="font-bold">박민희</span>
                    </div>
                    <div>
                      <span className="text-gray-400 text-xs mr-1">의 딸</span>
                      <span className="text-xl font-bold text-gray-900">{BRIDE_NAME.slice(1)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </FadeInUp>
        </section>

        {/* Calendar Section (Visual Only) */}
        <section className="py-20 px-6 bg-white">
           <FadeInUp>
             <div className="text-left mb-8">
               <h3 className="text-2xl font-serif-kr font-bold text-gray-800 leading-snug">이때가 결혼식날이랍니다.</h3>
            </div>
            
            <div className="text-center mb-8">
                 <p className="text-[#88A874] font-english text-xs tracking-[0.3em] mb-3 uppercase">We Are Getting Married</p>
                 <h2 className="text-xl font-serif-kr text-gray-800 mb-2">2026. 03. 21 토요일 오후 2시</h2>
               </div>
             <div className="bg-gray-50 rounded-2xl p-4 w-full max-w-[340px] mx-auto">
               <div className="grid grid-cols-7 gap-2 text-center text-sm text-gray-500 font-serif-kr">
                 <div className="text-red-400 py-1">일</div><div className="py-1">월</div><div className="py-1">화</div><div className="py-1">수</div><div className="py-1">목</div><div className="py-1">금</div><div className="py-1">토</div>
                 {/* Week 1 */}
                 <div className="text-red-400 py-1">1</div><div className="py-1">2</div><div className="py-1">3</div><div className="py-1">4</div><div className="py-1">5</div><div className="py-1">6</div><div className="py-1">7</div>
                 {/* Week 2 */}
                 <div className="text-red-400 py-1">8</div><div className="py-1">9</div><div className="py-1">10</div><div className="py-1">11</div><div className="py-1">12</div><div className="py-1">13</div><div className="py-1">14</div>
                 {/* Week 3 */}
                 <div className="text-red-400 py-1">15</div><div className="py-1">16</div><div className="py-1">17</div><div className="py-1">18</div><div className="py-1">19</div><div className="py-1">20</div>
                 <div className="flex items-center justify-center">
                   <div className="relative w-8 h-8 flex-shrink-0 flex items-center justify-center">
                     <span className="relative z-10 text-white font-bold pt-[1px]">21</span>
                     <motion.div 
                      layoutId="day-circle"
                      className="absolute inset-0 bg-[#88A874] rounded-full z-0"
                     />
                   </div>
                 </div>
                 {/* Week 4 */}
                 <div className="text-red-400 py-1">22</div><div className="py-1">23</div><div className="py-1">24</div><div className="py-1">25</div><div className="py-1">26</div><div className="py-1">27</div><div className="py-1">28</div>
                 {/* Week 5 */}
                 <div className="text-red-400 py-1">29</div><div className="py-1">30</div><div className="py-1">31</div>
               </div>
             </div>
             <div className="my-4">
              <Countdown targetDate="2026-03-21T14:00:00" />
              
              <div className="flex justify-center mt-8">
                <button 
                  onClick={() => setCalendarModalOpen(true)}
                  className="bg-[#F6F6F6] text-gray-600 px-6 py-3 rounded-full text-xs font-bold shadow-sm active:scale-95 flex items-center gap-2 transition-all hover:bg-gray-100 hover:text-[#88A874]"
                >
                  <Calendar size={14} /> 캘린더에 일정 추가하기
                </button>
              </div>
            </div>
          </FadeInUp>
       </section>

        {/* Wedding Photo Grid (New Section) */}
        <section className="bg-white">
          <FadeInUp>
            <div className="pt-20 pb-6 px-6 text-left">
              <h3 className="text-2xl font-serif-kr font-bold text-gray-800 leading-snug">저희 한번 보고 가실래요?</h3>
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
                  <LazyImage 
                    src={src} 
                    alt={`Wedding Photo ${i + 1}`} 
                  />
                </motion.div>
              ))}
            </div>
          </FadeInUp>
        </section>

        {/* Location Info */}
        <section className="py-20 mt-20 px-6 bg-white">
          <FadeInUp>
            <div className="text-left mb-8">
              <h3 className="text-2xl font-serif-kr font-bold text-gray-800 leading-snug">여기가 결혼식장이랍니다.</h3>
              <p className="text-gray-500 mt-3 text-lg font-medium">{LOCATION_NAME}</p>
              <p className="text-gray-400 text-sm">{LOCATION_ADDRESS}</p>
              
              <div className="mt-4 flex justify-start gap-2">
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
                   <MapPin className="w-4 h-4 text-[#88A874]" /> 네이버 지도로 보기
                 </a>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-2xl">
                <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#8EB4C9]"/> 자차 이용시
                </h4>
                <p className="text-sm text-gray-600 pl-4">
                  주차 <strong>가능합니다.</strong><br/>
                  교회 내 주차장을 이용하실 수 있습니다.
                </p>
              </div>

              <div className="bg-gray-50 p-6 rounded-2xl">
                <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#88A874]"/> 대중교통 이용시
                </h4>
                <div className="mt-2">
                  <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="px-4 py-3 border-b border-gray-50 flex justify-between items-center hover:bg-gray-50 transition-colors">
                      <span className="font-bold text-gray-800">판교역</span>
                      <SubwayBadge name="신분당" color="#D4003B" />
                    </div>
                    <div className="px-4 py-3 border-b border-gray-50 flex justify-between items-center hover:bg-gray-50 transition-colors">
                      <span className="font-bold text-gray-800">수내역</span>
                      <SubwayBadge name="수인분당" color="#FABE00" textColor="#333" />
                    </div>
                    <div className="px-4 py-3 flex justify-between items-center hover:bg-gray-50 transition-colors">
                      <span className="font-bold text-gray-800">정자역</span>
                      <div className="flex gap-1">
                        <SubwayBadge name="신분당" color="#D4003B" />
                        <SubwayBadge name="수인분당" color="#FABE00" textColor="#333" />
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 mt-2 text-center">
                    역에서 택시 이용시 기본요금 거리로 예상됩니다. 양해부탁드립니다.
                  </p>
                </div>
              </div>
            </div>
          </FadeInUp>
        </section>

        {/* Notices - Updated to Light Theme */}
        <section className="py-20 px-6 bg-white border-t border-gray-100">
          <FadeInUp>
            <div className="text-left mb-8">
              <h3 className="text-2xl font-serif-kr font-bold text-gray-800 leading-snug">중요한 소식 알려드립니다.</h3>
            </div>
            
            <div className="space-y-6">
              <div className="bg-gray-50 p-8 rounded-3xl text-center">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-[#88A874] shadow-sm mx-auto mb-4">
                  <MessageCircle size={20} />
                </div>
                <h4 className="font-bold text-lg text-gray-800 mb-2 font-serif-kr">축하 화환은 정중히 사절합니다</h4>
                <div className="w-8 h-[1px] bg-gray-200 mx-auto my-4" />
                <p className="text-gray-600 text-sm leading-loose font-serif-kr">
                  보내주시는 축하의 마음만 감사히 받겠습니다.<br/>
                  공간 사용의 이유로 화환은 정중히 사절하오니<br/>
                  너른 양해 부탁드립니다.
                </p>
              </div>

              <div className="bg-gray-50 p-8 rounded-3xl text-center">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-[#8EB4C9] shadow-sm mx-auto mb-4">
                   <Clock size={20} />
                </div>
                <h4 className="font-bold text-lg text-gray-800 mb-2 font-serif-kr">식사 안내</h4>
                <div className="w-8 h-[1px] bg-gray-200 mx-auto my-4" />
                <p className="text-gray-600 text-sm leading-loose font-serif-kr">
                  식사는 <strong>오후 1시 30분부터</strong><br/>
                  3층 식당에서 준비되어 있습니다.<br/>
                  맛있는 식사와 함께 즐거운 시간 보내시길 바랍니다.
                </p>
              </div>
            </div>
          </FadeInUp>
        </section>

        {/* Gallery Preview (Moved to Bottom) */}
        <section className="py-20 bg-gray-50">
          <div className="px-6 mb-8 text-left">
            <h3 className="text-2xl font-serif-kr font-bold text-gray-800 leading-snug">마지막으로 한번 더<br/>보고 가실래요?</h3>
          </div>
          <div className="flex overflow-x-auto gap-4 px-6 pb-8 no-scrollbar snap-x">
            {GALLERY_PHOTOS.map((src, i) => (
              <motion.div 
                key={i}
                className="flex-shrink-0 w-64 aspect-[3/4] rounded-2xl overflow-hidden shadow-md snap-center cursor-pointer"
                whileTap={{ scale: 0.98 }}
                onClick={() => openLightbox(i, GALLERY_PHOTOS)}
              >
                <LazyImage 
                  src={src} 
                  alt={`Gallery ${i}`} 
                />
              </motion.div>
            ))}
          </div>
        </section>

        {/* Share & Footer */}
        <section className="pt-20 pb-40 px-6 bg-white text-center">
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

        {/* Calendar Modal */}
        <AnimatePresence>
          {calendarModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
              onClick={() => setCalendarModalOpen(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                className="bg-white rounded-2xl w-full max-w-[320px] overflow-hidden shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6 pb-4 text-center">
                  <h3 className="text-lg font-bold text-gray-800 mb-1">일정 추가</h3>
                  <p className="text-xs text-gray-400">사용하시는 캘린더를 선택해주세요</p>
                </div>
                <div className="px-4 pb-4 space-y-2">
                  <button
                    onClick={() => {
                      handleDownloadCalendar();
                      setCalendarModalOpen(false);
                    }}
                    className="w-full py-3.5 px-4 rounded-xl bg-gray-50 text-gray-700 text-sm font-bold flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors"
                  >
                    <AppleIcon /> iPhone 캘린더
                  </button>
                  <button
                    onClick={() => {
                      handleDownloadCalendar();
                      setCalendarModalOpen(false);
                    }}
                    className="w-full py-3.5 px-4 rounded-xl bg-gray-50 text-gray-700 text-sm font-bold flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors"
                  >
                    <div className="text-[#3DDC84]"><AndroidIcon /></div> Android 캘린더
                  </button>
                  <button
                    onClick={() => {
                      handleGoogleCalendar();
                      setCalendarModalOpen(false);
                    }}
                    className="w-full py-3.5 px-4 rounded-xl bg-gray-50 text-gray-700 text-sm font-bold flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors"
                  >
                    <div className="text-[#EA4335]"><GoogleIcon /></div> Google 캘린더
                  </button>
                </div>
                <div className="border-t border-gray-100">
                  <button
                    onClick={() => setCalendarModalOpen(false)}
                    className="w-full py-4 text-center text-sm text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-colors"
                  >
                    취소
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

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
                  {currentImageIndex + 1} / {currentImageSet.length}
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
                    {currentImageSet.map((src, i) => (
                      <button
                        key={i}
                        ref={(el) => { thumbnailRefs.current[i] = el; }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentImageIndex(i);
                        }}
                        className={`relative flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                          currentImageIndex === i 
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
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const TimeUnit = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center mx-2 sm:mx-3">
      <div className="relative">
        <span 
          className={`block text-2xl sm:text-3xl font-english font-light tabular-nums ${label === 'DAYS' ? 'text-[#88A874] font-medium' : 'text-gray-800'}`}
        >
          {value < 10 && label !== 'DAYS' ? `0${value}` : value}
        </span>
      </div>
      <span className="text-[10px] sm:text-[10px] text-gray-400 font-english tracking-[0.15em] mt-1 uppercase">{label}</span>
    </div>
  );

  return (
    <div className="flex justify-center items-start bg-gray-50/50 py-5 rounded-2xl border border-gray-100 mx-auto max-w-[340px]">
      <TimeUnit value={timeLeft.days} label="DAYS" />
      <span className="text-gray-300 pt-1 text-xl font-light">:</span>
      <TimeUnit value={timeLeft.hours} label="HOUR" />
      <span className="text-gray-300 pt-1 text-xl font-light">:</span>
      <TimeUnit value={timeLeft.minutes} label="MIN" />
      <span className="text-gray-300 pt-1 text-xl font-light">:</span>
      <TimeUnit value={timeLeft.seconds} label="SEC" />
    </div>
  );
};



// Helper Component for Subway Line Badge
const SubwayBadge = ({ name, color, textColor = 'white' }: { name: string, color: string, textColor?: string }) => (
  <span 
    style={{ backgroundColor: color, color: textColor }}
    className="inline-flex items-center justify-center px-2 py-0.5 rounded-full text-[10px] font-bold whitespace-nowrap shadow-sm"
  >
    {name}
  </span>
);

// Icons
const AppleIcon = () => (
  <svg className="w-4 h-4 fill-current" viewBox="0 0 384 512" xmlns="http://www.w3.org/2000/svg">
    <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-54.5-74.3-61.7-91.8zM248.3 74.2c-21.5-25.5-18.1-64.5-17.7-65.9 19.5-4.7 55.2 16.4 73.1 46.1 18.7 24.8 21 60.9 21 60.9-25.8 2.7-52.2-12.9-76.4-41.1z"/>
  </svg>
);

const AndroidIcon = () => (
  <svg className="w-4 h-4 fill-current" viewBox="0 0 576 512" xmlns="http://www.w3.org/2000/svg">
    <path d="M420.55,301.93a24,24,0,1,1,24-24,24,24,0,0,1-24,24m-265.1,0a24,24,0,1,1,24-24,24,24,0,0,1-24,24m273.7-144.48,47.94-83a10,10,0,1,0-17.27-10h0l-48.54,84.07a301.25,301.25,0,0,0-246.56,0L116.18,64.45a10,10,0,1,0-17.27,10h0l47.94,83C64.53,202.22,8.24,285.55,0,384H576c-8.24-98.45-64.54-181.78-146.85-226.55"/>
  </svg>
);

const GoogleIcon = () => (
  <svg className="w-4 h-4 fill-current" viewBox="0 0 488 512" xmlns="http://www.w3.org/2000/svg">
    <path d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"/>
  </svg>
);

export default App;