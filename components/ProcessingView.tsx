import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProcessingStep } from '../types';

interface ProcessingViewProps {
  onComplete: () => void;
}

const ProcessingView: React.FC<ProcessingViewProps> = ({ onComplete }) => {
  const [steps, setSteps] = useState<ProcessingStep[]>([
    { id: 1, message: 'INITIALIZING_CORE...', status: 'active' },
    { id: 2, message: 'ANALYZING_SPECTRUM...', status: 'pending' },
    { id: 3, message: 'ISOLATING_VOCALS...', status: 'pending' },
    { id: 4, message: 'RENDERING_WAVEFORMS...', status: 'pending' },
  ]);

  useEffect(() => {
    let currentStepIndex = 0;

    const interval = setInterval(() => {
      setSteps((prevSteps) => {
        const newSteps = [...prevSteps];
        
        // Mark current as completed
        if (currentStepIndex < newSteps.length) {
            newSteps[currentStepIndex].status = 'completed';
        }

        currentStepIndex++;

        // Mark next as active
        if (currentStepIndex < newSteps.length) {
            newSteps[currentStepIndex].status = 'active';
            return newSteps;
        } else {
            // All done
            clearInterval(interval);
            setTimeout(onComplete, 800); // Slight delay before finishing
            return newSteps;
        }
      });
    }, 1200); // 1.2s per step

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="flex flex-col justify-center p-12 min-h-[400px] w-full max-w-md mx-auto">
      <div className="mb-8 flex items-center gap-3">
        <motion.div
           animate={{ rotate: 360 }}
           transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
           className="w-6 h-6 border-2 border-black border-t-transparent rounded-full"
        />
        <span className="font-mono font-bold text-lg">PROCESSING_DATA</span>
      </div>

      <div className="flex flex-col gap-4 font-mono text-sm">
        <AnimatePresence>
          {steps.map((step) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ 
                opacity: step.status === 'pending' ? 0.3 : 1, 
                x: 0,
                color: step.status === 'active' ? '#000000' : (step.status === 'completed' ? '#9CA3AF' : '#D1D5DB')
              }}
              className="flex items-center gap-3"
            >
              <span className="text-whiskYellow font-bold">
                {step.status === 'completed' ? '✓' : '>'}
              </span>
              <span>{step.message}</span>
              {step.status === 'active' && (
                <motion.span
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                  className="w-2 h-4 bg-black inline-block ml-1"
                />
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ProcessingView;