import React, { useState } from 'react';
import { MapPin } from 'lucide-react';
import { FadeInUp } from '../AnimationWrapper';
import { LOCATION_NAME, LOCATION_ADDRESS } from '../../constants';

const SubwayBadge = ({ name, color, textColor = 'white' }: { name: string, color: string, textColor?: string }) => (
  <span 
    style={{ backgroundColor: color, color: textColor }}
    className="inline-flex items-center justify-center px-2 py-0.5 rounded-full text-[10px] font-bold whitespace-nowrap shadow-sm"
  >
    {name}
  </span>
);

const LocationSection: React.FC = () => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(LOCATION_ADDRESS);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
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
          <img src="/images/web/wooridle.webp" className="w-full h-full object-cover opacity-60" alt="Map" />
          <div className="absolute inset-0 flex items-center justify-center">
             <a 
               href={`https://map.naver.com/v5/search/${LOCATION_ADDRESS}`} 
               target="_blank" 
               rel="noreferrer"
               className="bg-white/90 backdrop-blur px-6 py-3 rounded-full shadow-lg font-bold text-gray-800 flex items-center gap-2 hover:scale-105 transition-transform"
             >
               <MapPin className="w-4 h-4 text-[#fb7185]" /> 네이버 지도로 보기
             </a>
          </div>
        </div>

        <div className="w-full rounded-2xl overflow-hidden mb-4 border border-gray-100">
          <img 
            src="/images/web/wooricc_map.png" 
            className="w-full h-auto" 
            alt="오시는 길 약도" 
          />
        </div>

        <div className="space-y-6">
          <div className="bg-gray-50 p-6 rounded-2xl">
            <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#a8a29e]"/> 자차 이용시
            </h4>
            <p className="text-sm text-gray-600 pl-4">
              주차 <strong>가능합니다.</strong><br/>
              교회 내 주차장을 이용하실 수 있습니다.
            </p>
          </div>

          <div className="bg-gray-50 p-6 rounded-2xl">
            <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#fb7185]"/> 대중교통 이용시
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
                역에서 택시 이용시 기본요금 거리로 예상됩니다.<br/> 당일 셔틀은 운영되지 않습니다. 너른 양해부탁드립니다.
              </p>
            </div>
          </div>
        </div>
      </FadeInUp>
    </section>
  );
};

export default LocationSection;

