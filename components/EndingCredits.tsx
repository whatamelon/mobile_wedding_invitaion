import React from 'react';
import { motion } from 'framer-motion';
import { THANKS_TO_NAMES } from '../constants';

const EndingCredits: React.FC = () => {
  return (
    <div className="bg-black text-white py-20 overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-black to-transparent z-10" />
      
      <div className="text-center mb-10 z-20 relative">
        <h3 className="font-english text-3xl text-yellow-500 mb-2">Special Thanks To</h3>
        <p className="text-gray-400 text-sm">함께해주신 소중한 분들</p>
      </div>

      <div className="h-[400px] flex justify-center items-center relative overflow-hidden">
        <motion.div
          className="flex flex-col items-center gap-4"
          animate={{
            y: [0, -1000] // Adjust based on content length
          }}
          transition={{
            repeat: Infinity,
            duration: 20,
            ease: "linear"
          }}
        >
          {/* Duplicate list for seamless loop effect */}
          {[...THANKS_TO_NAMES, ...THANKS_TO_NAMES].map((name, index) => (
            <span key={index} className="text-lg font-serif-kr text-gray-300">
              {name}
            </span>
          ))}
        </motion.div>
      </div>
      
      <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-black to-transparent z-10" />
    </div>
  );
};

export default EndingCredits;