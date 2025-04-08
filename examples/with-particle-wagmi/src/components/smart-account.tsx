import { ReactNode } from 'react';
import { SmartAccountConfigProvider, useSmartAccountClient } from '@bitlayer/aa-react';
import { useAccount, useWalletClient } from 'wagmi';
import { SmartAccountContext } from '@/hooks/smart-account';

function InnerProvider({ children }: { children?: ReactNode }) {
  const { chain } = useAccount();
  const { data: walletClient } = useWalletClient();
  const { client } = useSmartAccountClient({
    chain,
    walletClient,
  });
  return (
    <SmartAccountContext.Provider value={{ client, walletClient }}>
      {children}
    </SmartAccountContext.Provider>
  );
}

export function SmartAccountProvider({ children }: { children?: ReactNode }) {
  return (
    <SmartAccountConfigProvider
      config={{
        bundlerUrl: import.meta.env.VITE_4337_BUNDLER_URL,
        paymasterUrl: import.meta.env.VITE_4337_PAYMASTER_URL,
        paymasterAddress: import.meta.env.VITE_4337_PAYMASTER_ADDRESS,
        apiKey: import.meta.env.VITE_4337_PROJECT_APIKEY,
        factoryAddress: import.meta.env.VITE_4337_FACTORY_ADDRESS,
        factoryVersion: import.meta.env.VITE_4337_FACTORY_VERSION,
        accountType: import.meta.env.VITE_4337_ACCOUNT_TYPE,
      }}
    >
      <InnerProvider>{children}</InnerProvider>
    </SmartAccountConfigProvider>
  );
}
