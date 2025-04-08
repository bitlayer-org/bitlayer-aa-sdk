# Bitlayer Account Abstraction SDK

A [viem](https://viem.sh)-based SDK that enables seamless interactions with
ERC-4337 Smart Accounts on Bitlayer.

## Overview

This package provides core functionality for interacting with
Account Abstraction (ERC-4337) on Bitlayer. It allows developers
to easily integrate Smart Account capabilities into their
applications with gas sponsorship support.

## Installation

```bash
npm install @bitlayer/aa-sdk
# or
yarn add @bitlayer/aa-sdk
# or
pnpm add @bitlayer/aa-sdk
```

## Usage

### Configuration Setup

First, prepare the configuration and a signer for the SDK:

```typescript
import { createWalletClient, custom, encodeFunctionData, EIP1193Provider } from 'viem';
import { btr } from 'viem/chains';
import {
  bitlayer,
  createSmartAccountClient,
  sendUserOperationWithSponsorContext,
  PaymasterSponsorTypeNative,
  WalletClientSigner,
} from '@bitlayer/aa-sdk';

// SDK configuration
const config = {
  bundlerUrl: 'https://...', // Bundler endpoint
  paymasterUrl: 'https://...', // Paymaster endpoint
  paymasterAddress: '0x', // Paymaster contract address
  apiKey: '...', // API key for authentication
  factoryAddress: '0x', // Light Account factory address by default
};

// Connect a wallet
const walletAddress = '0x...'; // EOA address
const provider: EIP1193Provider; // Your wallet provider

const walletClient = createWalletClient({
  account: walletAddress,
  chain,
  transport: custom(provider),
});

const signer = new WalletClientSigner(walletClient as WalletClient, 'json-rpc');
```

> **Note**: If you're using `wagmi`, you can simply use the `useWalletClient`
> hook or the `getWalletClient` function to obtain the wallet client.

### Initializing the Smart Account Client

```typescript
const client = await createSmartAccountClient({
  chain: btr,
  config,
  signer,
  transport: bitlayer({
    bundlerUrl: config.bundlerUrl,
    paymasterUrl: config.paymasterUrl,
  }),
});
```

### Sending User Operations

After initializing the client, you can use it to send user operations
with gas sponsorship:

```typescript
const hash = await sendUserOperationWithSponsorContext(client, {
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
There are 4 complete examples in the `examples` directory:

1. Using the SDK with [wagmi](https://wagmi.sh/) [🔗](../../examples/with-wagmi)
2. Using the SDK with [Privy](https://www.privy.io/) [🔗](../../examples/with-privy)
3. Using the SDK with [Particle Connectkit](https://developers.particle.network/guides/wallet-as-a-service/waas/connect/web-quickstart) [🔗](../../examples/with-particle)
4. Using the SDK with [wagmi](https://wagmi.sh/) and [Particle Auth](https://developers.particle.network/api-reference/auth/introduction) [🔗](../../examples/with-particle-wagmi)

## Support

For questions and support, join our
[Discord community](https://discord.gg/bitlayer) or open an
issue on GitHub.
