import React from 'react';
import { SmartAccountConfigContext } from '../context.js';

export function useSmartAccountConfig() {
  const context = React.useContext(SmartAccountConfigContext);
  if (!context) {
    throw new Error('useSmartAccountConfig must be used within a SmartAccountConfigProvider');
  }
  return context.config;
}
