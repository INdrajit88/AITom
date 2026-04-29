"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CharacterProps {
  isTalking: boolean;
  mood: 'happy' | 'angry' | 'sarcastic' | 'roast';
  onSlap: () => void;
}

const Character: React.FC<CharacterProps> = ({ isTalking, mood, onSlap }) => {
  const [clickCount, setClickCount] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handleClick = () => {
    setClickCount((prev) => prev + 1);

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      setClickCount(0);
    }, 1000);

    if (clickCount + 1 >= 3) {
      onSlap();
      setClickCount(0);
    }
  };

  return (
    <div
      className="relative w-64 h-64 cursor-pointer select-none"
      onClick={handleClick}
    >
      <motion.div
        className="w-full h-full relative"
        animate={
          mood === 'angry' || mood === 'roast'
            ? { x: [0, -5, 5, -5, 5, 0] }
            : isTalking
              ? { scale: [1, 1.05, 1], y: [0, -5, 0] }
              : { y: [0, -10, 0] }
        }
        transition={
          mood === 'angry' || mood === 'roast'
            ? { duration: 0.2, repeat: Infinity }
            : { duration: 2, repeat: Infinity, ease: "easeInOut" }
        }
      >
        {/* Simple Stylized Character (Cat-like) */}
        <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-2xl">
          {/* Ears */}
          <path d="M40,60 L60,20 L90,50 Z" fill={mood === 'angry' ? '#ef4444' : '#60a5fa'} stroke="#1e3a8a" strokeWidth="4" />
          <path d="M160,60 L140,20 L110,50 Z" fill={mood === 'angry' ? '#ef4444' : '#60a5fa'} stroke="#1e3a8a" strokeWidth="4" />

          {/* Body/Head */}
          <circle cx="100" cy="110" r="80" fill={mood === 'angry' ? '#fecaca' : '#dbeafe'} stroke="#1e3a8a" strokeWidth="4" />

          {/* Eyes */}
          <motion.g animate={isTalking ? { scaleY: [1, 0.1, 1] } : {}} transition={{ repeat: Infinity, duration: 3, times: [0, 0.1, 0.2] }}>
            <circle cx="70" cy="100" r="10" fill="white" stroke="#1e3a8a" strokeWidth="2" />
            <circle cx="70" cy="100" r="5" fill="#1e3a8a" />

            <circle cx="130" cy="100" r="10" fill="white" stroke="#1e3a8a" strokeWidth="2" />
            <circle cx="130" cy="100" r="5" fill="#1e3a8a" />
          </motion.g>

          {/* Mouth */}
          <motion.path
            d={isTalking ? "M80,140 Q100,160 120,140" : "M80,140 Q100,150 120,140"}
            fill="none"
            stroke="#1e3a8a"
            strokeWidth="4"
            strokeLinecap="round"
            animate={isTalking ? { d: ["M80,140 Q100,160 120,140", "M80,140 Q100,140 120,140", "M80,140 Q100,160 120,140"] } : {}}
            transition={{ repeat: Infinity, duration: 0.2 }}
          />

          {/* Blush (if happy) */}
          {mood === 'happy' && (
            <>
              <circle cx="50" cy="120" r="8" fill="#fecdd3" opacity="0.6" />
              <circle cx="150" cy="120" r="8" fill="#fecdd3" opacity="0.6" />
            </>
          )}

          {/* Angry eyebrows */}
          {(mood === 'angry' || mood === 'roast') && (
            <>
              <path d="M55,85 L85,95" stroke="#1e3a8a" strokeWidth="4" strokeLinecap="round" />
              <path d="M145,85 L115,95" stroke="#1e3a8a" strokeWidth="4" strokeLinecap="round" />
            </>
          )}
        </svg>

        {/* Slap Effect */}
        <AnimatePresence>
          {clickCount > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5, x: 20, y: -20 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.5 }}
              className="absolute top-0 right-0 text-4xl"
            >
              💢
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default Character;
