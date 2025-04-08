import type { SmartAccountConfig as OriginSmartAccountConfig } from '@bitlayer/aa-sdk';
import type { Address } from 'viem';

export type SmartAccountType = 'lightAccount' | 'simpleAccount';

export type SmartAccountConfig = OriginSmartAccountConfig & {
  accountType?: SmartAccountType;
  accountAddress?: Address;
};
