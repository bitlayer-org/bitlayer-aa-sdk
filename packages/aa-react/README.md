# Bitlayer Account Abstraction SDK for React

A [viem](https://viem.sh)-based SDK that enables seamless interactions with
ERC-4337 Smart Accounts on Bitlayer.

## Overview

This package contains hooks for integrating with Account Abstraction (ERC-4337)
on Bitlayer. It allows developers to easily integrate Smart Account capabilities
into their applications with gas sponsorship support.

## Installation

```bash
npm install @bitlayer/aa-sdk @bitlayer/aa-react
# or
yarn add @bitlayer/aa-sdk @bitlayer/aa-react
# or
pnpm add @bitlayer/aa-sdk @bitlayer/aa-react
```

## Usage

### Configuration Setup

First, prepare the configuration and a wallet client:

```typescript
import { createWalletClient, custom, encodeFunctionData, EIP1193Provider } from 'viem';
import { btr } from 'viem/chains';

// SDK configuration
const config = {
  bundlerUrl: 'https://...', // Bundler endpoint
  paymasterUrl: 'https://...', // Paymaster endpoint
  paymasterAddress: '0x', // Paymaster contract address
  apiKey: '...', // API key for authentication
  factoryAddress: '0x', // Smart Account factory address
  accountType: 'lightAccount', // Account type, lightAccount by default
};

// Connect a wallet
const walletAddress = '0x...'; // EOA address
const provider: EIP1193Provider; // Your wallet provider

const walletClient = createWalletClient({
  account: walletAddress,
  chain,
  transport: custom(provider),
});
```

### Initializing the Smart Account Client

In your component, you can use the `useSmartAccountClient` hook to create a
Smart Account client:

```typescript
import { useSmartAccountClient } from '@bitlayer/aa-react';

const config = {
  bundlerUrl: 'https://...', // Bundler endpoint
  paymasterUrl: 'https://...', // Paymaster endpoint
  paymasterAddress: '0x', // Paymaster contract address
  apiKey: '...', // API key for authentication
  factoryAddress: '0x', // Smart Account factory address
  accountType: 'lightAccount', // Account type, lightAccount by default
} satisfies SmartAccountConfig;

const { client } = useSmartAccountClient(config, {
  chain,
  walletClient,
});
```

> It is recommended to use a React Context to store the smart account client
> so that it can be accessed throughout your application. You can find sample
> Context Provider and hooks in the `examples` directory.

### Sending User Operations

```typescript
import { useSmartAccountClient } from '@bitlayer/aa-react';

const { sendAsync, isPending } = useSponsorUserOperation({ client });

const hash = await sendAsync({
  transaction: {
    type: 'single',
    data: {
      account: client.account,
      chain: btr,
      to: nftContractAddress,
      data: encodeFunctionData({
        abi: abi,
        functionName: 'mint',
        args: [client.account.address],
      }),
    },
  },
  sponsorContext: {
    type: PaymasterSponsorTypeNative, // free gas
    token: '0x',
  },
});
```

## Examples

For a more comprehensive understanding of how to use the SDK,
There are some examples in the `examples` directory:

1. Using the SDK with [wagmi](https://wagmi.sh/) [🔗](../../examples/with-wagmi)
2. Using the SDK with [Privy](https://www.privy.io/) [🔗](../../examples/with-privy)
3. Using the SDK with [Particle Connectkit](https://developers.particle.network/guides/wallet-as-a-service/waas/connect/web-quickstart)
   [🔗](../../examples/with-particle)
4. Using the SDK with [wagmi](https://wagmi.sh/) and [Particle Auth](https://developers.particle.network/api-reference/auth/introduction)
   [🔗](../../examples/with-particle-wagmi)

## Support

For questions and support, join our
[Discord community](https://discord.gg/bitlayer) or open an
issue on GitHub.
