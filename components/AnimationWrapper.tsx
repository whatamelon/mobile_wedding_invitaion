import React from 'react';
import { motion } from 'framer-motion';

interface AnimationWrapperProps {
  children?: React.ReactNode;
  delay?: number;
  className?: string;
}

export const FadeInUp = ({ children, delay = 0, className = "" }: AnimationWrapperProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ 
        type: "spring", 
        stiffness: 100, 
        damping: 20, 
        delay: delay 
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export const PopIn = ({ children, delay = 0, className = "" }: AnimationWrapperProps) => {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      whileInView={{ scale: 1, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ 
        type: "spring", 
        stiffness: 260, 
        damping: 20, 
        delay: delay 
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};