// hooks
export type {
  UseSmartAccountOptions as UseSmartAccountParams,
  UseSmartAccountReturnValue,
} from '../hooks/use-smart-account-client.js';
export { useSmartAccountClient } from '../hooks/use-smart-account-client.js';

export type { UseSponsorUserOperationParams } from '../hooks/use-sponsor-user-op.js';
export { useSponsorUserOperation } from '../hooks/use-sponsor-user-op.js';

export { useSmartAccountConfig } from '../hooks/use-smart-account-config.js';
export { useSmartAccount } from '../hooks/use-smart-account.js';

// provider
export {
  type SmartAccountConfigContextData,
  SmartAccountConfigContext,
  type SmartAccountContextData,
  SmartAccountContext,
} from '../context.js';
export { SmartAccountConfigProvider, SmartAccountProvider } from '../provider.js';
export type { SmartAccountConfig, AccountType } from '../types.js';
