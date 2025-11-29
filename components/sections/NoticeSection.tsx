import React from 'react';
import { Flower2, Utensils  } from 'lucide-react';
import { FadeInUp } from '../AnimationWrapper';

const NoticeSection: React.FC = () => {
  return (
    <section className="py-20 px-6 bg-white border-t border-gray-100">
      <FadeInUp>
        <div className="text-left mb-8">
          <h3 className="text-2xl font-serif-kr font-bold text-gray-800 leading-snug">중요한 소식 알려드립니다.</h3>
        </div>
        
        <div className="space-y-6">
          <div className="bg-gray-50 p-8 rounded-3xl text-center">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-[#88A874] shadow-sm mx-auto mb-4">
              <Flower2 size={20} />
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
               <Utensils size={20} />
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
  );
};

export default NoticeSection;

