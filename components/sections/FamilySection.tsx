import React from 'react';
import { FadeInUp } from '../AnimationWrapper';
import { GROOM_NAME, BRIDE_NAME } from '../../constants';

const FamilySection: React.FC = () => {
  return (
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
  );
};

export default FamilySection;

