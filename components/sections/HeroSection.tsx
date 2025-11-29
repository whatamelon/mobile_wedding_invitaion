import React from 'react';
import { motion } from 'framer-motion';
import { FadeInUp } from '../AnimationWrapper';
import { GROOM_NAME, BRIDE_NAME, WEDDING_DATE, WEDDING_TIME, LOCATION_NAME } from '../../constants';

const HeroSection: React.FC = () => {
  return (
    <section className="relative h-[85vh] overflow-hidden">
      <motion.div 
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
        className="absolute inset-0 z-0"
      >
        <img 
          src="/images/main.jpg" 
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
              <span className="text-3xl text-[#fb7185] font-english my-auto flex items-center">&</span>
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
  );
};

export default HeroSection;

