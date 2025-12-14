export enum AppState {
  IDLE = 'IDLE',
  DRAGGING = 'DRAGGING',
  PROCESSING = 'PROCESSING',
  RESULT = 'RESULT',
}

export interface ProcessingStep {
  id: number;
  message: string;
  status: 'pending' | 'active' | 'completed';
}

export const ANIMATION_TRANSITION = {
  type: "spring",
  stiffness: 300,
  damping: 30
};
