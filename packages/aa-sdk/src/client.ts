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

export interface SmartAccountConfig {
  bundlerUrl: string;
  paymasterUrl: string;
  paymasterAddress: Address;
  apiKey: string;
  factoryAddress: Address;
  factoryVersion?: string;
}

export type CreateSmartAccountClientParams<
  TTransport extends Transport = Transport,
  TChain extends Chain | undefined = Chain,
  TAccount extends SmartContractAccount | undefined = SmartContractAccount | undefined,
  TSigner extends SmartAccountSigner = SmartAccountSigner,
> = {
  chain: TChain;
  transport: TTransport;
  signer: TSigner;
  config: SmartAccountConfig;
  account?: TAccount;
};

export type SmartAccountClient<
  TTransport extends Transport = Transport,
  TChain extends Chain | undefined = Chain | undefined,
  TAccount extends SmartContractAccount | undefined = SmartContractAccount | undefined,
> = SmartAccountClientCore<
  TTransport,
  TChain,
  TAccount,
  SmartAccountClientActions<Chain, SmartContractAccount> & PaymasterActions
>;

export function createSmartAccountClient<
  TTransport extends Transport = Transport,
  TChain extends Chain | undefined = Chain | undefined,
  TAccount extends SmartContractAccount | undefined = SmartContractAccount | undefined,
  TSigner extends SmartAccountSigner = SmartAccountSigner,
>(
  args: CreateSmartAccountClientParams<TTransport, TChain, TAccount, TSigner>,
): Promise<SmartAccountClient<TTransport, TChain, TAccount>>;

export async function createSmartAccountClient({
  chain,
  config,
  signer,
  transport,
  account,
}: CreateSmartAccountClientParams) {
  const { apiKey, paymasterAddress, factoryAddress, factoryVersion = 'v1.1.0' } = config;

  if (!chain) {
    throw new Error('Missing required parameter: chain');
  }

  if (!account) {
    account = await createLightAccount({
      chain,
      transport,
      signer,
      factoryAddress,
      version: factoryVersion as LightAccountVersion<'LightAccount'>,
    });
  }

  return createSmartAccountClientCore({
    account,
    chain,
    transport,
    gasEstimator: gasEstimator(),
  }).extend(
    createPaymasterActions({
      apiKey: apiKey,
      address: paymasterAddress,
    }),
  );
}
