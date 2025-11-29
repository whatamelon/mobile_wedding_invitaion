import React from 'react';
import { FadeInUp } from '../AnimationWrapper';

const InvitationSection: React.FC = () => {
  return (
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
  );
};

export default InvitationSection;

