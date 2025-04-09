import { ReactNode, useMemo } from 'react';
import { SmartAccountConfig, useSmartAccountClient } from '@bitlayer/aa-react';
import { SmartAccountContext } from '@/hooks/smart-account';
import { useAccount, useWallets } from '@particle-network/connectkit';

export function SmartAccountProvider({ children }: { children?: ReactNode }) {
  const { chain } = useAccount();
  const [primaryWallet] = useWallets();

  const walletClient = useMemo(() => {
    if (!primaryWallet) {
      return undefined;
    }
    return primaryWallet.getWalletClient();
  }, [primaryWallet]);

  const config = {
    bundlerUrl: import.meta.env.VITE_4337_BUNDLER_URL,
    paymasterUrl: import.meta.env.VITE_4337_PAYMASTER_URL,
    paymasterAddress: import.meta.env.VITE_4337_PAYMASTER_ADDRESS,
    apiKey: import.meta.env.VITE_4337_PROJECT_APIKEY,
    factoryAddress: import.meta.env.VITE_4337_FACTORY_ADDRESS,
    factoryVersion: import.meta.env.VITE_4337_FACTORY_VERSION,
    accountType: import.meta.env.VITE_4337_ACCOUNT_TYPE,
  } satisfies SmartAccountConfig;

  const { client } = useSmartAccountClient(config, {
    chain,
    walletClient,
  });

  return (
    <SmartAccountContext.Provider value={{ client, walletClient }}>
      {children}
    </SmartAccountContext.Provider>
  );
}
