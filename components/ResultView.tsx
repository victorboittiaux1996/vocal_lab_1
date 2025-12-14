import React, { useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';
import { motion } from 'framer-motion';

interface ResultViewProps {
  file: File | null;
  onReset: () => void;
}

const ResultView: React.FC<ResultViewProps> = ({ file, onReset }) => {
  const containerRefVocals = useRef<HTMLDivElement>(null);
  const containerRefInst = useRef<HTMLDivElement>(null);
  const wavesurferVocals = useRef<WaveSurfer | null>(null);
  const wavesurferInst = useRef<WaveSurfer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState('0:00');
  const [currentTime, setCurrentTime] = useState('0:00');

  useEffect(() => {
    if (!containerRefVocals.current || !containerRefInst.current || !file) return;

    const audioUrl = URL.createObjectURL(file);

    // Initialize Vocals Waveform (Yellow)
    wavesurferVocals.current = WaveSurfer.create({
      container: containerRefVocals.current,
      waveColor: '#E5E7EB',
      progressColor: '#FFDE00', // Whisk Yellow
      cursorColor: 'transparent',
      barWidth: 3,
      barRadius: 3,
      barGap: 3,
      height: 60,
      url: audioUrl,
      normalize: true,
    });

    // Initialize Instrumental Waveform (Black)
    wavesurferInst.current = WaveSurfer.create({
      container: containerRefInst.current,
      waveColor: '#E5E7EB',
      progressColor: '#111111', // Black
      cursorColor: 'transparent',
      barWidth: 3,
      barRadius: 3,
      barGap: 3,
      height: 60,
      url: audioUrl, // In a real app, this would be a different URL
      normalize: true,
    });

    // Sync Logic
    const onReady = () => {
        const d = wavesurferVocals.current?.getDuration() || 0;
        setDuration(formatTime(d));
    };

    const onAudioProcess = (t: number) => {
        setCurrentTime(formatTime(t));
    };
    
    // Sync interaction
    wavesurferVocals.current.on('interaction', () => {
        const time = wavesurferVocals.current?.getCurrentTime() || 0;
        wavesurferInst.current?.setTime(time);
    });
    
    wavesurferInst.current.on('interaction', () => {
        const time = wavesurferInst.current?.getCurrentTime() || 0;
        wavesurferVocals.current?.setTime(time);
    });

    wavesurferVocals.current.on('ready', onReady);
    wavesurferVocals.current.on('timeupdate', onAudioProcess);
    
    // Simulate slight offset in waveform shape for visual distinction
    // Real app would load different files
    wavesurferInst.current.setVolume(0.5); 

    return () => {
      wavesurferVocals.current?.destroy();
      wavesurferInst.current?.destroy();
    };
  }, [file]);

  const togglePlay = () => {
    if (wavesurferVocals.current && wavesurferInst.current) {
      wavesurferVocals.current.playPause();
      wavesurferInst.current.playPause();
      setIsPlaying(!isPlaying);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full p-6 md:p-8"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-mono font-bold text-xl">RESULT_ANALYSIS</h2>
        <button 
            onClick={onReset}
            className="text-xs font-mono underline hover:text-whiskYellow bg-black text-white px-2 py-1 rounded"
        >
            NEW_FILE
        </button>
      </div>

      {/* Vocals Track */}
      <div className="mb-6 group">
        <div className="flex justify-between font-mono text-xs mb-2 text-gray-500">
            <span className="bg-whiskYellow text-black px-2 py-0.5 rounded-sm border border-black font-bold">VOCALS.wav</span>
            <span>MUTE [M]</span>
        </div>
        <div ref={containerRefVocals} className="relative rounded-lg overflow-hidden bg-gray-50" />
      </div>

      {/* Instrumental Track */}
      <div className="mb-8 group">
         <div className="flex justify-between font-mono text-xs mb-2 text-gray-500">
            <span className="bg-black text-white px-2 py-0.5 rounded-sm font-bold">INSTRUMENTAL.wav</span>
            <span>SOLO [S]</span>
        </div>
        <div ref={containerRefInst} className="relative rounded-lg overflow-hidden bg-gray-50" />
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between border-t border-gray-200 pt-6">
        <div className="font-mono text-xl tracking-widest tabular-nums w-24">
            {currentTime}
        </div>

        <button 
            onClick={togglePlay}
            className="w-16 h-16 rounded-full bg-whiskYellow border-2 border-black flex items-center justify-center hover:scale-105 active:scale-95 transition-transform shadow-lg"
        >
            {isPlaying ? (
                <div className="flex gap-1.5">
                    <div className="w-1.5 h-5 bg-black rounded-full" />
                    <div className="w-1.5 h-5 bg-black rounded-full" />
                </div>
            ) : (
                <div className="w-0 h-0 border-l-[14px] border-l-black border-y-[9px] border-y-transparent ml-1" />
            )}
        </button>

        <div className="font-mono text-xl tracking-widest tabular-nums w-24 text-right text-gray-400">
            {duration}
        </div>
      </div>

      {/* Download Actions */}
      <div className="mt-8 flex gap-3 justify-center">
         <button className="px-6 py-2 border border-gray-300 rounded-full font-mono text-xs hover:border-black hover:bg-gray-50 transition-colors">
            DOWNLOAD_STEMS.ZIP
         </button>
      </div>
    </motion.div>
  );
};

export default ResultView;