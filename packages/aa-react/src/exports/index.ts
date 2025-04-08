// hooks
export type {
  UseSmartAccountParams,
  UseSmartAccountReturnValue,
} from '../hooks/use-smart-account-client.js';
export { useSmartAccountClient } from '../hooks/use-smart-account-client.js';

export type { UseSponsorUserOperationParams } from '../hooks/use-sponsor-user-op.js';
export { useSponsorUserOperation } from '../hooks/use-sponsor-user-op.js';

// provider
export { type SmartAccountConfigContextData, SmartAccountConfigContext } from '../context.js';
export { SmartAccountConfigProvider } from '../provider.jsx';
export type { SmartAccountConfig, SmartAccountType } from '../types.js';
