import React from 'react';
import { SmartAccountConfigContext } from './context.js';
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
