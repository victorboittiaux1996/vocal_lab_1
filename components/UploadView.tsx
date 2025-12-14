import React from 'react';
import { motion } from 'framer-motion';

interface UploadViewProps {
  isDragging: boolean;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const UploadView: React.FC<UploadViewProps> = ({ isDragging, onFileSelect }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="flex flex-col items-center justify-center text-center p-8 min-h-[400px]"
    >
      <div className="relative mb-8 group">
        {/* Animated Scribble Icon */}
        <motion.svg
          width="120"
          height="120"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          animate={{
            rotate: isDragging ? 10 : 0,
            scale: isDragging ? 1.1 : 1,
          }}
          transition={{ type: "spring", stiffness: 200, damping: 10 }}
        >
          <path
            d="M20 50C20 30 30 20 50 20C70 20 80 30 80 50C80 70 70 80 50 80C30 80 20 70 20 50Z"
            stroke="black"
            strokeWidth="2"
            strokeDasharray="4 4"
            className="opacity-20"
          />
          <motion.path
            d="M30 60C30 60 40 30 50 30C60 30 70 50 70 60C70 70 60 75 50 75C40 75 30 70 30 60Z"
            stroke="black"
            strokeWidth="3"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }}
          />
          <motion.circle 
             cx="75" cy="25" r="4" fill="#FFDE00" stroke="black" strokeWidth="1"
             animate={{ y: [0, -5, 0] }}
             transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.svg>
      </div>

      <h1 className="text-4xl font-mono font-bold tracking-tighter mb-4 text-whiskBlack">
        VOCAL_LAB_v1
      </h1>
      
      <p className="font-mono text-sm text-gray-500 mb-8 max-w-[280px]">
        DROP AUDIO TO ISOLATE STEMS.
        <br />
        <span className="text-xs opacity-50">SUPPORTS MP3, WAV, FLAC</span>
      </p>

      {/* Manual Upload Button styled as Industrial Pill */}
      <label className="cursor-pointer group relative">
        <input 
          type="file" 
          accept="audio/*" 
          className="hidden" 
          onChange={onFileSelect}
        />
        <div className="absolute inset-0 bg-black translate-y-1 translate-x-1 rounded-full transition-transform group-hover:translate-x-1.5 group-hover:translate-y-1.5" />
        <div className="relative bg-white border border-black px-8 py-3 rounded-full font-mono font-bold text-sm hover:-translate-y-0.5 hover:-translate-x-0.5 transition-transform flex items-center gap-2">
          <span>SELECT_FILE</span>
          <span className="bg-whiskYellow w-2 h-2 rounded-full border border-black"></span>
        </div>
      </label>
    </motion.div>
  );
};

export default UploadView;