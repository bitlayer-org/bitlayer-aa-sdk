// accounts
export type { CreateSimpleAccountParams } from '../accounts/simple-account.js';
export { createSimpleAccount } from '../accounts/simple-account.js';

export type { CreateLightAccountParams, LightAccountVersion } from '../accounts/light-account.js';
export { createLightAccount } from '../accounts/light-account.js';

// re-exporting from @aa-sdk/core
export type { SmartContractAccount } from '@aa-sdk/core';

// actions
export type {
  CreatePaymasterActionsConfig,
  GetSupportedTokenParams,
  GetSponsorUserOpParams,
  PaymasterActions,
  PaymasterClient,
  PaymasterRpcSchema,
  PaymasterSponsorContext,
  PaymasterSponsorType,
  PaymasterSponsorUserOpResponse,
  PaymasterSupportedToken,
  PaymasterSupportedTokensResponse,
  PaymasterTokenType,
} from '../actions/paymaster.js';
export {
  createPaymasterActions,
  createPaymasterClientFromSmartAccountClient,
  PaymasterSponsorTypeNative,
  PaymasterSponsorTypePrefund,
  PaymasterSponsorTypePostfund,
} from '../actions/paymaster.js';

export type {
  SendUserOperationWithSponsorContextParams,
  ShouldAttemptSponsorshipFunc,
  UserOperationStruct,
} from '../actions/user-op.js';
export { sendUserOperationWithSponsorContext } from '../actions/user-op.js';

export type { UserOperationContext } from '@aa-sdk/core';

// clients
export type {
  AccountType,
  CreateSmartAccountClientParams,
  SmartAccountClient,
  SmartAccountConfig,
} from '../client.js';
export { createSmartAccountClient } from '../client.js';

export { WalletClientSigner, type SmartAccountSigner } from '@aa-sdk/core';

// transports
export { bitlayer } from '../transports/bitlayer.js';
export type { BitlayerTransportOptions } from '../transports/bitlayer.js';
