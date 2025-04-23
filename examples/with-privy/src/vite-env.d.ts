/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_4337_BUNDLER_URL: string;
  readonly VITE_4337_PAYMASTER_URL: string;

  readonly VITE_4337_ENTRY_POINT_ADDRESS: `0x${string}`;
  readonly VITE_4337_PAYMASTER_ADDRESS: `0x${string}`;

  readonly VITE_4337_FACTORY_ADDRESS: `0x${string}`;
  readonly VITE_4337_ACCOUNT_TYPE: 'lightAccount' | 'simpleAccount' | undefined;
  readonly VITE_4337_ACCOUNT_VERSION: 'v1.1.0' | 'v2.0.0' | 'v0.6' | 'v0.7' | undefined;

  readonly VITE_4337_PROJECT_APIKEY: string;

  readonly VITE_NFT_CONTRACT_ADDRESS: `0x${string}`;
  readonly VITE_SPONSOR_TOKEN_ADDRESS: `0x${string}`;

  readonly VITE_PRIVY_APPID: string;
}
