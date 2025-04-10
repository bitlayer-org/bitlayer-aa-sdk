import React from 'react';
import type { WalletClient } from 'viem';
import type { SmartAccountClient } from '@bitlayer/aa-sdk';
import { SmartAccountConfigContext, SmartAccountContext } from './context.js';
import type { SmartAccountConfig } from './types.js';

export function SmartAccountConfigProvider({
  config,
  children,
}: {
  config: SmartAccountConfig;
  children?: React.ReactNode;
}) {
  return (
    <SmartAccountConfigContext.Provider value={{ config }}>
      {children}
    </SmartAccountConfigContext.Provider>
  );
}

export type SmartAccountProviderProps = {
  config: {
    client?: SmartAccountClient;
    walletClient?: WalletClient;
  };
  children?: React.ReactNode;
};

export function SmartAccountProvider({ config, children }: SmartAccountProviderProps) {
  const { client, walletClient } = config;
  return (
    <SmartAccountContext.Provider
      value={{
        client,
        walletClient,
      }}
    >
      {children}
    </SmartAccountContext.Provider>
  );
}
