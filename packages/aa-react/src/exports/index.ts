// hooks
export type {
  UseSmartAccountOptions as UseSmartAccountParams,
  UseSmartAccountReturnValue,
} from '../hooks/use-smart-account-client.js';
export { useSmartAccountClient } from '../hooks/use-smart-account-client.js';

export type { UseSponsorUserOperationParams } from '../hooks/use-sponsor-user-op.js';
export { useSponsorUserOperation } from '../hooks/use-sponsor-user-op.js';

export { useSmartAccountConfig } from '../hooks/use-smart-account-config.js';

// provider
export { type SmartAccountConfigContextData, SmartAccountConfigContext } from '../context.js';
export { SmartAccountConfigProvider } from '../provider.jsx';
export type { SmartAccountConfig, AccountType } from '../types.js';
