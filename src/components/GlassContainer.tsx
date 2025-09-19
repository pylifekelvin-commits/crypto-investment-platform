import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../utils/cn';

interface GlassContainerProps {
  children: React.ReactNode;
  className?: string;
  opacity?: number;
  blur?: number;
  animationDelay?: number;
  hover?: boolean;
}

const GlassContainer: React.FC<GlassContainerProps> = ({
  children,
  className = '',
  opacity = 0.15,
  blur = 20,
  animationDelay = 0,
  hover = false,
}) => {
  const containerVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.95 
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        delay: animationDelay,
        ease: [0.4, 0, 0.2, 1]
      }
    }
  };

  const hoverVariants = hover ? {
    hover: {
      scale: 1.02,
      y: -5,
      transition: {
        duration: 0.2,
        ease: "easeOut"
      }
    }
  } : {};

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      whileHover={hover ? "hover" : undefined}
      className={cn(
        "relative overflow-hidden",
        className
      )}
      style={{
        background: `rgba(255, 255, 255, ${opacity})`,
        backdropFilter: `blur(${blur}px)`,
        WebkitBackdropFilter: `blur(${blur}px)`,
        border: '1px solid rgba(255, 255, 255, 0.2)',
        borderRadius: '24px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
      }}
    >
      {/* Gradient border effect */}
      <div 
        className="absolute inset-0 rounded-3xl"
        style={{
          background: 'linear-gradient(145deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
          mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          maskComposite: 'xor',
          WebkitMaskComposite: 'xor',
          padding: '1px',
        }}
      />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
      
      {/* Subtle inner glow */}
      <div 
        className="absolute inset-0 rounded-3xl opacity-50"
        style={{
          background: 'radial-gradient(circle at 50% 0%, rgba(255,255,255,0.1) 0%, transparent 50%)',
        }}
      />
    </motion.div>
  );
};

export default GlassContainer;