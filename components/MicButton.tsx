"use client";

import React from 'react';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface MicButtonProps {
  isConnected: boolean;
  isConnecting: boolean;
  onToggle: () => void;
}

const MicButton: React.FC<MicButtonProps> = ({ isConnected, isConnecting, onToggle }) => {
  return (
    <div className="flex flex-col items-center gap-4">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onToggle}
        disabled={isConnecting}
        className={`relative w-24 h-24 rounded-full flex items-center justify-center shadow-lg transition-colors ${
          isConnected
            ? 'bg-red-500 hover:bg-red-600'
            : 'bg-blue-600 hover:bg-blue-700'
        } ${isConnecting ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {isConnecting ? (
          <Loader2 className="w-10 h-10 text-white animate-spin" />
        ) : isConnected ? (
          <MicOff className="w-10 h-10 text-white" />
        ) : (
          <Mic className="w-10 h-10 text-white" />
        )}

        {isConnected && (
          <motion.div
            layoutId="ripple"
            initial={{ scale: 0.8, opacity: 0.5 }}
            animate={{ scale: 1.5, opacity: 0 }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="absolute inset-0 bg-red-400 rounded-full"
          />
        )}
      </motion.button>
      <span className="text-sm font-medium text-slate-600">
        {isConnecting ? 'Connecting...' : isConnected ? 'Tap to Stop Talking' : 'Tap to Start Talking'}
      </span>
    </div>
  );
};

export default MicButton;
