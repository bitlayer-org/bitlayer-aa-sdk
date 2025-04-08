import { useCallback, useContext, useEffect, useState } from 'react';
import type { Chain, CustomTransport, Transport, WalletClient } from 'viem';
import {
  bitlayer,
  createSimpleAccount,
  createSmartAccountClient,
  WalletClientSigner,
  type SmartAccountClient,
  type SmartContractAccount,
} from '@bitlayer/aa-sdk';
import { SmartAccountConfigContext } from '../context.js';

export interface UseSmartAccountParams<
  TTransport extends Transport = Transport,
  TChain extends Chain | undefined = Chain | undefined,
> {
  chain?: TChain;
  walletClient?: WalletClient<TTransport, TChain>;
}

export interface UseSmartAccountReturnValue<
  TTransport extends Transport = Transport,
  TChain extends Chain | undefined = Chain | undefined,
  TClient extends SmartAccountClient = SmartAccountClient<TTransport, TChain>,
> {
  client?: TClient;
  account?: SmartContractAccount;
  walletClient?: WalletClient<TTransport, TChain>;
  isLoading: boolean;
}

export function useSmartAccountClient<
  TTransport extends Transport = Transport,
  TChain extends Chain | undefined = Chain | undefined,
>(
  params: UseSmartAccountParams<TTransport, TChain> = {},
): UseSmartAccountReturnValue<TTransport, TChain> {
  const { config } = useContext(SmartAccountConfigContext);
  const { chain, walletClient } = params;

  const [smartAccountClient, setSmartAccountClient] = useState<
    SmartAccountClient<TTransport, TChain> | undefined
  >();
  const [smartAccount, setSmartAccount] = useState<SmartContractAccount | undefined>();
  const [isLoading, setIsLoading] = useState(true);

  const initSmartAccount = useCallback(
    async (walletClient: WalletClient<TTransport, TChain>, chain: TChain) => {
      if (!chain) {
        return;
      }

      setIsLoading(true);

      const signer = new WalletClientSigner(walletClient as WalletClient, 'json-rpc');
      const transport = bitlayer({ bundler: config.bundlerUrl, paymaster: config.paymasterUrl });

      let account: SmartContractAccount | undefined;
      if (config.accountType === 'simpleAccount') {
        account = await createSimpleAccount({
          chain,
          transport,
          signer,
          factoryAddress: config.factoryAddress,
        });
      }

      const client = await createSmartAccountClient<CustomTransport, TChain>({
        signer,
        chain,
        config,
        transport,
        account,
      });

      setSmartAccountClient(client);
      setSmartAccount(client.account);
      setIsLoading(false);
    },
    [setSmartAccount, setSmartAccountClient, config],
  );

  useEffect(() => {
    if (!walletClient || !chain) {
      return;
    }
    initSmartAccount(walletClient, chain);
  }, [walletClient, chain, initSmartAccount]);

  return {
    client: smartAccountClient,
    account: smartAccount,
    walletClient: walletClient,
    isLoading,
  };
}
