import React, { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppState } from './types';
import UploadView from './components/UploadView';
import ProcessingView from './components/ProcessingView';
import ResultView from './components/ResultView';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  
  // Use a ref to keep track of drag enter/leave events to prevent flickering
  // when dragging over child elements.
  const dragCounter = useRef(0);

  // Background Color Mapping based on State
  const getBackgroundColor = () => {
    switch (appState) {
      case AppState.DRAGGING:
        return '#333333'; // Dark Grey for focus
      case AppState.PROCESSING:
        return '#111111'; // Deep Black for immersive processing
      case AppState.RESULT:
        return '#F3F3F3'; // Off-white result
      case AppState.IDLE:
      default:
        return '#FFDE00'; // Whisk Safety Yellow
    }
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (appState !== AppState.IDLE && appState !== AppState.RESULT) return;

    if (e.type === 'dragenter') {
      dragCounter.current += 1;
      if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
        setDragActive(true);
        if (appState === AppState.IDLE) setAppState(AppState.DRAGGING);
      }
    } else if (e.type === 'dragleave') {
      dragCounter.current -= 1;
      if (dragCounter.current === 0) {
        setDragActive(false);
        if (appState === AppState.DRAGGING) setAppState(AppState.IDLE);
      }
    }
  }, [appState]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Reset drag state
    setDragActive(false);
    dragCounter.current = 0;
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    } else {
        // If dropped invalid item, revert state
        if (appState === AppState.DRAGGING) setAppState(AppState.IDLE);
    }
  }, [appState]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (uploadedFile: File) => {
    setFile(uploadedFile);
    setAppState(AppState.PROCESSING);
  };

  const handleProcessingComplete = () => {
    setAppState(AppState.RESULT);
  };

  const handleReset = () => {
    setFile(null);
    setAppState(AppState.IDLE);
    dragCounter.current = 0;
  };

  return (
    <motion.div 
      className="relative w-screen h-screen overflow-hidden"
      animate={{ backgroundColor: getBackgroundColor() }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {/* Animated Grain Overlay - Positioned absolutely to cover screen */}
      <div className="bg-grain" />

      {/* WeTransfer-style Layout: Left Card, Fixed */}
      <div className="relative z-10 h-full w-full flex items-center justify-center md:justify-start md:pl-24 lg:pl-32">
        
        <motion.div
          layout
          initial={{ opacity: 0, y: 20 }}
          animate={{ 
            opacity: 1, 
            y: 0,
            scale: dragActive ? 1.05 : 1,
            width: appState === AppState.RESULT ? '600px' : '440px' 
          }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className={`
            bg-white rounded-[2rem] shadow-2xl overflow-hidden
            border border-black relative
            mx-4 md:mx-0
          `}
        >
          <AnimatePresence mode="wait">
            {appState === AppState.IDLE || appState === AppState.DRAGGING ? (
              <motion.div
                key="upload"
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <UploadView isDragging={dragActive} onFileSelect={handleFileSelect} />
              </motion.div>
            ) : appState === AppState.PROCESSING ? (
              <motion.div
                key="processing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <ProcessingView onComplete={handleProcessingComplete} />
              </motion.div>
            ) : (
              <motion.div
                key="result"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <ResultView file={file} onReset={handleReset} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Decorative Background Text (WeTransfer Vibe) */}
        {appState === AppState.IDLE && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="absolute right-12 bottom-12 text-right hidden md:block select-none"
          >
            <h2 className="text-6xl font-mono font-bold tracking-tighter text-black opacity-10 mix-blend-overlay">
              ISOLATE.
              <br />
              CREATE.
              <br />
              REPEAT.
            </h2>
          </motion.div>
        )}
      </div>

      {/* Overlay for Drag State - Visual feedback only, prevents pointer events on underlying elements */}
      <AnimatePresence>
        {dragActive && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="absolute inset-0 pointer-events-none bg-black/10 z-20" 
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default App;