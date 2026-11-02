/**
 * src/context/useFinance.js
 * Dedicated custom hook for accessing FinanceContext.
 */

import { useContext } from 'react';
import { FinanceContext } from './FinanceContextCore';

export function useFinance() {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
}

export default useFinance;
