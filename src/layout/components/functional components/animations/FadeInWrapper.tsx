import React, { Children } from 'react'
import { AnimatePresence, motion, type Variants } from 'motion/react'

export interface FadeInWrapperProps{
  className?: string,
  direction?: 'Left' | 'Right' | 'Up' | 'Down'
  distance?: number,
  duration?: number,
  children: React.ReactNode
}

export default function FadeInWrapper({
    className, 
    children, 
    direction="Left", 
    distance = 10, 
    duration = 0.8
  }:FadeInWrapperProps) {
  const isHorizontal = direction === "Left" || direction === "Right";
  const multiplier = (direction === "Left" || direction === "Up") ? 1 : -1;
  const moveValue = distance * multiplier;

  const variants: Variants = {
    initial: {
      opacity: 0,
      x: isHorizontal ? moveValue : 0,
      y: !isHorizontal ? moveValue : 0,
    },
    animate : {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration: duration,
        ease: "easeInOut"
      }
    },
    exit: {
      opacity: 0,
      x: isHorizontal ? moveValue : 0,
      y: !isHorizontal ? moveValue : 0,
      transition: { 
        duration: 0.2 
      }
    }
  }
  return (
    <AnimatePresence>
      <motion.div 
        className={className}
        variants={variants}
        initial="initial"
        animate="animate"
        exit={'exit'}
        >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
