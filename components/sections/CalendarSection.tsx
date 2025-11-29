import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar } from 'lucide-react';
import { FadeInUp } from '../AnimationWrapper';
import { GROOM_NAME, BRIDE_NAME, LOCATION_NAME, LOCATION_ADDRESS } from '../../constants';

// Helper Components
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

const CalendarSection: React.FC = () => {
  const [calendarModalOpen, setCalendarModalOpen] = useState(false);

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

  return (
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
   </section>
  );
};

export default CalendarSection;

