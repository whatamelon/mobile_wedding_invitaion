import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';

interface Particle {
  id: number;
  x: number;
  y: number;
  scale: number;
  rotation: number;
  color: string;
}

const HitCounter: React.FC = () => {
  const [count, setCount] = useState(1240);
  const [isExploding, setIsExploding] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const intervalRef = useRef<number | null>(null);

  // Simulate hitting an API / Fake live counter
  useEffect(() => {
    const randomIncrement = Math.floor(Math.random() * 5) + 1;
    const timer = setTimeout(() => {
      setCount(prev => prev + randomIncrement);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleClick = () => {
    setCount(prev => prev + 1);
    
    // Start animation sequence
    setIsExploding(true);
    const startTime = Date.now();

    // Helper to spawn a particle
    const spawnParticle = () => {
       const id = Date.now() + Math.random();
       setParticles(prev => [...prev, {
         id,
         x: (Math.random() - 0.5) * 250, // Horizontal spread
         y: (Math.random() - 0.5) * 250, // Vertical spread around center
         scale: Math.random() * 1.2 + 0.8,
         rotation: Math.random() * 360,
         color: ['#88A874', '#A4C639', '#8EB4C9', '#A0C3D2', '#94AC7F'][Math.floor(Math.random() * 5)]
       }]);

       // Cleanup particle after animation
       setTimeout(() => {
         setParticles(prev => prev.filter(p => p.id !== id));
       }, 1000);
    };

    // Loop for 3 seconds to generate hearts
    // Clear previous interval if exists to prevent overlapping storms (optional, but safer)
    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = window.setInterval(() => {
      if (Date.now() - startTime > 3000) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setIsExploding(false);
        return;
      }
      // Spawn a burst each tick
      spawnParticle();
      spawnParticle();
      spawnParticle();
    }, 100);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <>
      {/* 
        Layout Wrapper: 
        Fixed to bottom of VIEWPORT, full width (max-w-[480px]), acting as a bottom bar.
      */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] z-50">
        
        {/* Full Width Bottom Action Bar */}
        <motion.button 
          onClick={handleClick}
          className="w-full bg-white/95 backdrop-blur-xl border-t border-[#E6F0E6] shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.1)] py-4 pb-8 flex items-center justify-center gap-2 active:bg-[#F5F9F2] transition-colors"
          whileTap={{ scale: 0.98 }}
          animate={isExploding ? { 
            backgroundColor: ["rgba(255, 255, 255, 0.95)", "rgba(245, 249, 242, 0.95)", "rgba(255, 255, 255, 0.95)"],
            transition: { repeat: Infinity, duration: 0.4, ease: "easeInOut" } 
          } : {}}
        >
            <Heart 
              className={`w-5 h-5 text-[#88A874] fill-[#88A874] ${isExploding ? 'animate-ping' : 'animate-pulse'}`} 
            />
            <span className="text-lg font-bold text-gray-800 font-serif-kr">
              축하의 마음 전하기 <span className="text-[#88A874] ml-1">{count.toLocaleString()}</span>
            </span>
        </motion.button>

        {/* Heart Explosion Overlay */}
        {/* Using bottom-[50vh] lifts the origin to the center of the screen */}
        <div className="absolute bottom-[50vh] left-1/2 -translate-x-1/2 w-0 h-0 overflow-visible">
           <AnimatePresence>
             {particles.map(particle => (
               <motion.div
                 key={particle.id}
                 initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                 animate={{ 
                   opacity: [1, 1, 0], 
                   scale: particle.scale,
                   x: particle.x, 
                   y: particle.y - 150, // Move upwards
                   rotate: particle.rotation 
                 }}
                 exit={{ opacity: 0 }}
                 transition={{ duration: 1, ease: "easeOut" }}
                 className="absolute w-8 h-8 pointer-events-none"
               >
                 <Heart className="w-full h-full fill-current drop-shadow-lg" style={{ color: particle.color }} />
               </motion.div>
             ))}
           </AnimatePresence>
        </div>
      </div>
    </>
  );
};

export default HitCounter;