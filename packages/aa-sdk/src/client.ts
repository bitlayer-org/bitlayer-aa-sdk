import {
  type SmartAccountClient as SmartAccountClientCore,
  type SmartAccountClientActions,
  type SmartContractAccount,
  createSmartAccountClient as createSmartAccountClientCore,
  type SmartAccountSigner,
} from '@aa-sdk/core';
import type { Address, Chain, Transport } from 'viem';
import { createLightAccount, type LightAccountVersion } from './accounts/light-account.js';
import { createPaymasterActions, type PaymasterActions } from './actions/paymaster.js';
import { gasEstimator } from './middlewares/gas-estimator.js';
import { createSimpleAccount, type SimpleAccountVersion } from './accounts/simple-account.js';
import { bitlayer } from './transports/bitlayer.js';

export type AccountType = 'simpleAccount' | 'lightAccount';

export interface SmartAccountConfig {
  bundlerUrl: string;
  paymasterUrl: string;
  paymasterAddress: Address;
  apiKey: string;
  factoryAddress: Address;
  accountVersion?: string;
  accountType?: AccountType;
  accountAddress?: Address;
}

export type CreateSmartAccountClientParams<
  TTransport extends Transport | undefined = Transport | undefined,
  TChain extends Chain | undefined = Chain,
  TAccount extends SmartContractAccount | undefined = SmartContractAccount | undefined,
  TSigner extends SmartAccountSigner = SmartAccountSigner,
> = {
  chain: TChain;
  transport: TTransport;
  signer: TSigner;
  account?: TAccount;
};

export type SmartAccountClient<
  TTransport extends Transport = Transport,
  TChain extends Chain | undefined = Chain | undefined,
  TAccount extends SmartContractAccount | undefined = SmartContractAccount | undefined,
> = SmartAccountClientCore<
  TTransport,
  TChain,
  NonNullable<TAccount>,
  SmartAccountClientActions<Chain, SmartContractAccount> & PaymasterActions
>;

export function createSmartAccountClient<
  TTransport extends Transport | undefined = Transport | undefined,
  TChain extends Chain | undefined = Chain | undefined,
  TAccount extends SmartContractAccount | undefined = SmartContractAccount | undefined,
  TSigner extends SmartAccountSigner = SmartAccountSigner,
>(
  config: CreateSmartAccountClientParams<TTransport, TChain, TAccount, TSigner> &
    SmartAccountConfig,
): Promise<SmartAccountClient<NonNullable<TTransport>, TChain, TAccount>>;

export async function createSmartAccountClient({
  transport,
  account,
  ...config
}: CreateSmartAccountClientParams & SmartAccountConfig) {
  const {
    chain,
    signer,

    apiKey,
    paymasterAddress,
    factoryAddress,
    accountVersion = 'v1.1.0',
    accountType = 'lightAccount',
    accountAddress,
  } = config;

  if (!chain) {
    throw new Error('Missing required parameter: chain');
  }

  if (!transport) {
    transport = bitlayer({
      paymaster: config.paymasterUrl,
      bundler: config.bundlerUrl,
    });
  }

  if (!account) {
    switch (accountType) {
      case 'simpleAccount':
        account = await createSimpleAccount({
          chain,
          transport,
          signer,
          factoryAddress,
          version: accountVersion as SimpleAccountVersion,
          accountAddress,
        });
        break;
      default:
        account = await createLightAccount({
          chain,
          transport,
          signer,
          factoryAddress,
          version: accountVersion as LightAccountVersion<'LightAccount'>,
          accountAddress,
        });
    }
  }

  const paymasterActions = createPaymasterActions({
    apiKey: apiKey,
    address: paymasterAddress,
  });

  return createSmartAccountClientCore({
    account,
    chain,
    transport,
    gasEstimator: gasEstimator(),
  }).extend(paymasterActions);
}
