import { createContext, useContext } from 'react';
import type { OpenLoopContextValue } from './types';

export const OpenLoopContext = createContext<OpenLoopContextValue | null>(null);

export function useOpenLoop(): OpenLoopContextValue {
  const context = useContext(OpenLoopContext);
  if (!context) {
    throw new Error('useOpenLoop must be used inside an OpenLoopProvider.');
  }
  return context;
}
