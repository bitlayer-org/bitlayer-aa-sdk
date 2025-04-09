import { useCallback, useEffect, useState } from 'react';
import type { Chain, CustomTransport, Transport, WalletClient } from 'viem';
import {
  bitlayer,
  createSmartAccountClient,
  WalletClientSigner,
  type SmartAccountClient,
  type SmartAccountConfig,
  type SmartContractAccount,
} from '@bitlayer/aa-sdk';

export interface UseSmartAccountOptions<
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
  config: SmartAccountConfig,
  options: UseSmartAccountOptions<TTransport, TChain> = {},
): UseSmartAccountReturnValue<TTransport, TChain> {
  const { chain, walletClient } = options;

  const [smartAccountClient, setSmartAccountClient] = useState<
    SmartAccountClient<TTransport, TChain> | undefined
  >();
  const [smartAccount, setSmartAccount] = useState<SmartContractAccount | undefined>();
  const [isLoading, setIsLoading] = useState(true);

  const initSmartAccount = useCallback(
    async (
      config: SmartAccountConfig,
      walletClient: WalletClient<TTransport, TChain>,
      chain: TChain,
    ) => {
      if (!chain) {
        return;
      }

      setIsLoading(true);

      const signer = new WalletClientSigner(walletClient as WalletClient, 'json-rpc');
      const transport = bitlayer({ bundler: config.bundlerUrl, paymaster: config.paymasterUrl });

      const client = await createSmartAccountClient<CustomTransport, TChain>({
        signer,
        chain,
        transport,
        ...config,
      });

      setSmartAccountClient(client);
      setSmartAccount(client.account);
      setIsLoading(false);
    },
    [],
  );

  useEffect(() => {
    if (!walletClient || !chain) {
      return;
    }
    initSmartAccount(config, walletClient, chain);
  }, [walletClient, chain]);

  return {
    client: smartAccountClient,
    account: smartAccount,
    walletClient: walletClient,
    isLoading,
  };
}
