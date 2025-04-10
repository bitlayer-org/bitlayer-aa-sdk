import { createContext } from 'react';
import type { WalletClient } from 'viem';
import type { SmartAccountClient } from '@bitlayer/aa-sdk';
import type { SmartAccountConfig } from './types.js';

export interface SmartAccountConfigContextData {
  config: SmartAccountConfig;
}

export const SmartAccountConfigContext = createContext({} as SmartAccountConfigContextData);

export interface SmartAccountContextData {
  client?: SmartAccountClient;
  walletClient?: WalletClient;
}

export const SmartAccountContext = createContext({} as SmartAccountContextData);
