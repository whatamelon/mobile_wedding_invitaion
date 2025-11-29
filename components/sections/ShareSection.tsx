import React from 'react';
import { MessageCircle } from 'lucide-react';
import { PopIn } from '../AnimationWrapper';

const ShareSection: React.FC = () => {
  return (
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
  );
};

export default ShareSection;

