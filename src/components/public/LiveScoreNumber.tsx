import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface LiveScoreNumberProps {
  value: number;
  color?: string;
  className?: string;
  showDiff?: boolean;
}

export const LiveScoreNumber: React.FC<LiveScoreNumberProps> = ({
  value,
  color,
  className = '',
  showDiff = true,
}) => {
  const prevValueRef = useRef<number>(value);
  const [diff, setDiff] = useState<number | null>(null);
  const [isUpdated, setIsUpdated] = useState<boolean>(false);

  useEffect(() => {
    if (prevValueRef.current !== value) {
      const delta = value - prevValueRef.current;
      setDiff(delta);
      setIsUpdated(true);
      prevValueRef.current = value;

      const timer = setTimeout(() => {
        setIsUpdated(false);
        setDiff(null);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [value]);

  return (
    <div className="relative inline-flex items-center justify-end">
      {/* Floating Delta Badge when score changes */}
      {showDiff && (
        <AnimatePresence>
          {diff !== null && diff !== 0 && (
            <motion.span
              key={`diff-${value}`}
              initial={{ opacity: 0, y: 6, scale: 0.8 }}
              animate={{ opacity: 1, y: -16, scale: 1 }}
              exit={{ opacity: 0, y: -24, scale: 0.7 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className={`absolute -top-1 right-0 pointer-events-none text-[10px] font-black px-1.5 py-0.2 rounded-full shadow-sm select-none ${
                diff > 0
                  ? 'bg-emerald-500 text-white dark:bg-emerald-600'
                  : 'bg-red-500 text-white dark:bg-red-600'
              }`}
            >
              {diff > 0 ? `+${diff}` : `${diff}`}
            </motion.span>
          )}
        </AnimatePresence>
      )}

      {/* Animated Score Number with Smooth Fade-in and Scale-up */}
      <AnimatePresence mode="popLayout">
        <motion.span
          key={value}
          initial={{ opacity: 0.25, scale: 1.25, filter: 'blur(1px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          exit={{ opacity: 0, scale: 0.9, position: 'absolute' }}
          transition={{
            type: 'spring',
            stiffness: 380,
            damping: 24,
            mass: 0.8,
          }}
          className={`inline-block origin-right font-black transition-colors ${className}`}
          style={{
            color: color,
            textShadow: isUpdated ? `0 0 16px ${color || '#f59e0b'}80` : 'none',
          }}
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </div>
  );
};
