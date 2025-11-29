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
         color: ['#F472B6', '#EC4899', '#DB2777', '#BE185D', '#9D174D'][Math.floor(Math.random() * 5)]
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
        Fixed to bottom of VIEWPORT, but constrained to mobile width (max-w-[480px]) 
        and centered horizontally. This ensures the button appears inside the "phone" 
        on PC screens, rather than the far corner of the monitor.
      */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] h-0 z-50 overflow-visible pointer-events-none">
        
        {/* Floating Action Button */}
        <motion.button 
          onClick={handleClick}
          className="absolute bottom-6 right-6 pointer-events-auto outline-none"
          whileTap={{ scale: 0.8 }}
          animate={isExploding ? { 
            y: [0, -15, 0],
            transition: { repeat: Infinity, duration: 0.4, ease: "easeInOut" } 
          } : {}}
        >
          <div className="bg-white/90 backdrop-blur-md shadow-2xl rounded-full px-4 py-2 flex items-center gap-2 border-2 border-pink-200 hover:border-pink-400 transition-colors">
            <Heart 
              className={`w-4 h-4 text-pink-500 fill-pink-500 ${isExploding ? 'animate-ping' : 'animate-pulse'}`} 
            />
            <span className="text-xs font-medium text-gray-600 whitespace-nowrap">
              축하해주신 분들 : <span className="text-pink-600 font-bold text-sm ml-1">{count.toLocaleString()}</span>
            </span>
          </div>
        </motion.button>

        {/* Heart Explosion Overlay - Centered in Viewport */}
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