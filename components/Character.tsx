"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface CharacterProps {
  isTalking: boolean;
  mood: "happy" | "angry" | "sarcastic" | "roast" | "surprised" | "giggling";
  onTouch: (part: string) => void;
  onSlap: () => void;
}
const Character: React.FC<CharacterProps> = ({ isTalking, mood, onTouch, onSlap }) => {
  const [activePart, setActivePart] = useState<string | null>(null);
  const [showSlap, setShowSlap] = useState(false);
  const clickCountRef = useRef(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handleInteraction = (part: string, e: React.MouseEvent) => {
    e.stopPropagation();

    clickCountRef.current += 1;

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      const count = clickCountRef.current;
      clickCountRef.current = 0;

      if (count === 1) {
        setActivePart(part);
        onTouch(part);
        setTimeout(() => setActivePart(null), 1500);
      } else if (count >= 2) {
        setShowSlap(true);
        onSlap();
        setTimeout(() => setShowSlap(false), 1500);
      }
    }, 250);
  };

  const isAngry = mood === "angry" || mood === "roast";
  const isHappy = mood === "happy" || mood === "giggling";
  const isSurprised = mood === "surprised";

  return (
    <div className="relative w-80 h-96 cursor-pointer select-none">
      <motion.div
        className="w-full h-full relative"
        animate={
          isAngry
            ? { x: [0, -4, 4, -4, 4, 0], scale: 1.02 }
            : isTalking
              ? { scale: [1, 1.03, 1], y: [0, -3, 0] }
              : { y: [0, -5, 0] }
        }
        transition={
          isAngry
            ? { duration: 0.3, repeat: Infinity }
            : { duration: 2, repeat: Infinity, ease: "easeInOut" }
        }
      >
        <svg
          viewBox="0 0 300 400"
          className="w-full h-full drop-shadow-2xl overflow-visible"
        >
          <defs>
            <radialGradient id="tomFur" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#9ca3af" />
              <stop offset="80%" stopColor="#6b7280" />
              <stop offset="100%" stopColor="#4b5563" />
            </radialGradient>
            <radialGradient id="tomBelly" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#f3f4f6" />
              <stop offset="100%" stopColor="#d1d5db" />
            </radialGradient>
            <radialGradient id="earInner" cx="50%" cy="80%" r="50%">
              <stop offset="0%" stopColor="#fca5a5" />
              <stop offset="100%" stopColor="#f87171" />
            </radialGradient>
          </defs>

          {/* Tail */}
          <motion.path
            d="M 200,320 Q 250,300 240,250 Q 230,200 260,180"
            fill="none"
            stroke="url(#tomFur)"
            strokeWidth="20"
            strokeLinecap="round"
            animate={{ rotate: isHappy ? [0, 10, -10, 0] : [0, 3, -3, 0] }}
            transition={{ repeat: Infinity, duration: isHappy ? 1 : 2 }}
            style={{ transformOrigin: "200px 320px" }}
          />

          {/* Body / Belly */}
          <motion.g
            onClick={(e) => handleInteraction("belly", e)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            style={{ transformOrigin: "150px 250px" }}
            className="cursor-pointer"
          >
            <rect
              x="80"
              y="150"
              width="140"
              height="180"
              rx="70"
              fill="url(#tomFur)"
            />
            <ellipse cx="150" cy="260" rx="50" ry="60" fill="url(#tomBelly)" />
          </motion.g>

          {/* Left Foot */}
          <motion.g
            onClick={(e) => handleInteraction("foot_left", e)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            style={{ transformOrigin: "110px 340px" }}
            className="cursor-pointer"
          >
            <ellipse
              cx="110"
              cy="340"
              rx="25"
              ry="15"
              fill="#f3f4f6"
              stroke="#4b5563"
              strokeWidth="2"
            />
            <circle cx="95" cy="340" r="4" fill="#fca5a5" />
            <circle cx="110" cy="335" r="4" fill="#fca5a5" />
            <circle cx="125" cy="340" r="4" fill="#fca5a5" />
            <ellipse cx="110" cy="345" rx="10" ry="6" fill="#fca5a5" />
          </motion.g>

          {/* Right Foot */}
          <motion.g
            onClick={(e) => handleInteraction("foot_right", e)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            style={{ transformOrigin: "190px 340px" }}
            className="cursor-pointer"
          >
            <ellipse
              cx="190"
              cy="340"
              rx="25"
              ry="15"
              fill="#f3f4f6"
              stroke="#4b5563"
              strokeWidth="2"
            />
            <circle cx="175" cy="340" r="4" fill="#fca5a5" />
            <circle cx="190" cy="335" r="4" fill="#fca5a5" />
            <circle cx="205" cy="340" r="4" fill="#fca5a5" />
            <ellipse cx="190" cy="345" rx="10" ry="6" fill="#fca5a5" />
          </motion.g>

          {/* Left Arm/Paw */}
          <motion.g
            onClick={(e) => handleInteraction("paw_left", e)}
            animate={
              activePart === "paw_left" ? { rotate: -130 } : { rotate: 0 }
            }
            transition={{ type: "spring", bounce: 0.5 }}
            style={{ transformOrigin: "90px 200px" }}
            className="cursor-pointer"
          >
            <path
              d="M 90,200 Q 50,220 60,270 Q 70,280 80,270"
              fill="url(#tomFur)"
              stroke="#4b5563"
              strokeWidth="2"
            />
            <circle
              cx="68"
              cy="275"
              r="12"
              fill="#f3f4f6"
              stroke="#4b5563"
              strokeWidth="2"
            />
          </motion.g>

          {/* Right Arm/Paw */}
          <motion.g
            onClick={(e) => handleInteraction("paw_right", e)}
            animate={
              activePart === "paw_right" ? { rotate: 130 } : { rotate: 0 }
            }
            transition={{ type: "spring", bounce: 0.5 }}
            style={{ transformOrigin: "210px 200px" }}
            className="cursor-pointer"
          >
            <path
              d="M 210,200 Q 250,220 240,270 Q 230,280 220,270"
              fill="url(#tomFur)"
              stroke="#4b5563"
              strokeWidth="2"
            />
            <circle
              cx="232"
              cy="275"
              r="12"
              fill="#f3f4f6"
              stroke="#4b5563"
              strokeWidth="2"
            />
          </motion.g>

          {/* Head */}
          <motion.g
            onClick={(e) => handleInteraction("head", e)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{ transformOrigin: "150px 100px" }}
            className="cursor-pointer"
          >
            {/* Left Ear */}
            <motion.path
              d="M 80,70 L 60,10 Q 90,20 110,40 Z"
              fill="url(#tomFur)"
              stroke="#4b5563"
              strokeWidth="2"
              animate={
                isAngry
                  ? { rotate: -40, x: -10, y: 20 }
                  : activePart === "head"
                    ? { rotate: -15 }
                    : { rotate: 0 }
              }
              style={{ transformOrigin: "80px 70px" }}
            />
            <motion.path
              d="M 85,65 L 68,20 Q 90,28 105,45 Z"
              fill="url(#earInner)"
              animate={
                isAngry
                  ? { rotate: -40, x: -10, y: 20 }
                  : activePart === "head"
                    ? { rotate: -15 }
                    : { rotate: 0 }
              }
              style={{ transformOrigin: "80px 70px" }}
            />

            {/* Right Ear */}
            <motion.path
              d="M 220,70 L 240,10 Q 210,20 190,40 Z"
              fill="url(#tomFur)"
              stroke="#4b5563"
              strokeWidth="2"
              animate={
                isAngry
                  ? { rotate: 40, x: 10, y: 20 }
                  : activePart === "head"
                    ? { rotate: 15 }
                    : { rotate: 0 }
              }
              style={{ transformOrigin: "220px 70px" }}
            />
            <motion.path
              d="M 215,65 L 232,20 Q 210,28 195,45 Z"
              fill="url(#earInner)"
              animate={
                isAngry
                  ? { rotate: 40, x: 10, y: 20 }
                  : activePart === "head"
                    ? { rotate: 15 }
                    : { rotate: 0 }
              }
              style={{ transformOrigin: "220px 70px" }}
            />

            {/* Face */}
            <ellipse
              cx="150"
              cy="110"
              rx="80"
              ry="70"
              fill="url(#tomFur)"
              stroke="#4b5563"
              strokeWidth="3"
            />

            {/* Cheeks/Muzzle */}
            <ellipse cx="125" cy="135" rx="25" ry="18" fill="#f3f4f6" />
            <ellipse cx="175" cy="135" rx="25" ry="18" fill="#f3f4f6" />

            {/* Eyes */}
            <motion.g
              animate={
                activePart === "head" || mood === "giggling"
                  ? { scaleY: 0.1 }
                  : { scaleY: 1 }
              }
              style={{ transformOrigin: "150px 95px" }}
            >
              {/* Left Eye */}
              <g>
                <circle
                  cx="115"
                  cy="95"
                  r="22"
                  fill="white"
                  stroke="#374151"
                  strokeWidth="2"
                />
                <motion.circle
                  cx={isSurprised ? 115 : 118}
                  cy={isSurprised ? 95 : 95}
                  r={isAngry ? 8 : isSurprised ? 12 : 14}
                  fill={isAngry ? "#fbbf24" : "#10b981"}
                />
                <circle cx="115" cy="95" r="6" fill="#111827" />
                <circle cx="122" cy="90" r="4" fill="white" />
                <circle cx="110" cy="100" r="2" fill="white" />
                {isAngry && (
                  <path
                    d="M 90,80 L 140,95"
                    stroke="#374151"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                )}
              </g>

              {/* Right Eye */}
              <g>
                <circle
                  cx="185"
                  cy="95"
                  r="22"
                  fill="white"
                  stroke="#374151"
                  strokeWidth="2"
                />
                <motion.circle
                  cx={isSurprised ? 185 : 182}
                  cy={isSurprised ? 95 : 95}
                  r={isAngry ? 8 : isSurprised ? 12 : 14}
                  fill={isAngry ? "#fbbf24" : "#10b981"}
                />
                <circle cx="185" cy="95" r="6" fill="#111827" />
                <circle cx="178" cy="90" r="4" fill="white" />
                <circle cx="190" cy="100" r="2" fill="white" />
                {isAngry && (
                  <path
                    d="M 210,80 L 160,95"
                    stroke="#374151"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                )}
              </g>
            </motion.g>

            {/* Nose */}
            <path d="M 143,125 Q 150,130 157,125 L 150,135 Z" fill="#fca5a5" />

            {/* Mouth */}
            <motion.path
              d={
                isTalking || isSurprised
                  ? "M 140,145 Q 150,170 160,145 Z"
                  : isAngry
                    ? "M 135,155 Q 150,145 165,155"
                    : "M 135,145 Q 150,160 165,145"
              }
              fill={isTalking || isSurprised ? "#ef4444" : "none"}
              stroke="#374151"
              strokeWidth="3"
              strokeLinecap="round"
              animate={
                isTalking
                  ? {
                      d: [
                        "M 140,145 Q 150,170 160,145 Z",
                        "M 140,145 Q 150,150 160,145 Z",
                      ],
                    }
                  : {}
              }
              transition={{ repeat: Infinity, duration: 0.2 }}
            />
            {/* Tongue/Teeth when talking */}
            {isTalking && !isAngry && !isSurprised && (
              <motion.path d="M 145,145 L 155,145 L 150,152 Z" fill="#ffffff" />
            )}
            {/* Fangs when angry */}
            {isTalking && isAngry && (
              <motion.g>
                <path d="M 142,145 L 148,145 L 145,155 Z" fill="#ffffff" />
                <path d="M 158,145 L 152,145 L 155,155 Z" fill="#ffffff" />
              </motion.g>
            )}

            {/* Whiskers */}
            <g stroke="#d1d5db" strokeWidth="2" strokeLinecap="round">
              <motion.line
                x1="90"
                y1="130"
                x2="40"
                y2="120"
                animate={isTalking ? { rotate: [0, 2, -2, 0] } : {}}
                style={{ transformOrigin: "90px 130px" }}
              />
              <motion.line
                x1="90"
                y1="135"
                x2="35"
                y2="135"
                animate={isTalking ? { rotate: [0, 3, -3, 0] } : {}}
                style={{ transformOrigin: "90px 135px" }}
              />
              <motion.line
                x1="90"
                y1="140"
                x2="40"
                y2="150"
                animate={isTalking ? { rotate: [0, -2, 2, 0] } : {}}
                style={{ transformOrigin: "90px 140px" }}
              />

              <motion.line
                x1="210"
                y1="130"
                x2="260"
                y2="120"
                animate={isTalking ? { rotate: [0, -2, 2, 0] } : {}}
                style={{ transformOrigin: "210px 130px" }}
              />
              <motion.line
                x1="210"
                y1="135"
                x2="265"
                y2="135"
                animate={isTalking ? { rotate: [0, -3, 3, 0] } : {}}
                style={{ transformOrigin: "210px 135px" }}
              />
              <motion.line
                x1="210"
                y1="140"
                x2="260"
                y2="150"
                animate={isTalking ? { rotate: [0, 2, -2, 0] } : {}}
                style={{ transformOrigin: "210px 140px" }}
              />
            </g>
          </motion.g>
        </svg>

        {/* Reaction Effects */}
        <AnimatePresence>
          {activePart && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5, y: 0 }}
              animate={{ opacity: 1, scale: 1.5, y: -30 }}
              exit={{ opacity: 0, scale: 2, y: -60 }}
              className="absolute top-10 left-1/2 -translate-x-1/2 text-5xl pointer-events-none drop-shadow-md z-10"
            >
              {activePart === "head"
                ? "💖"
                : activePart === "belly"
                  ? "✨"
                  : activePart.includes("foot")
                    ? "😹"
                    : "👋"}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Slap Hit Effect */}
        <AnimatePresence>
          {showSlap && (
            <motion.div
              initial={{ opacity: 0, scale: 0.2, x: 40, y: -20, rotate: -30 }}
              animate={{ opacity: 1, scale: 1.5, rotate: 10 }}
              exit={{ opacity: 0, scale: 2, rotate: 45 }}
              className="absolute top-4 right-4 text-5xl pointer-events-none drop-shadow-lg z-20"
            >
              💥
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default Character;
