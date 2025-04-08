import { createContext } from 'react';
import type { SmartAccountConfig } from './types.js';

export interface SmartAccountConfigContextData {
  config: SmartAccountConfig;
}

export const SmartAccountConfigContext = createContext({} as SmartAccountConfigContextData);
