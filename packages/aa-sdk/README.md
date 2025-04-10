# Bitlayer Account Abstraction SDK

A [viem](https://viem.sh)-based SDK that enables seamless interactions with
ERC-4337 Smart Accounts on Bitlayer.

## Overview

This package provides core functionality for interacting with Account Abstraction
(ERC-4337) on Bitlayer. It allows developers to easily integrate Smart Account
capabilities into their applications with gas sponsorship support.

## Installation

```bash
npm install @bitlayer/aa-sdk viem
# or
yarn add @bitlayer/aa-sdk viem
# or
pnpm add @bitlayer/aa-sdk viem
```

## Usage

### Configuration Setup

First, prepare the configuration and a signer for the SDK:

```typescript
import { createWalletClient, custom, encodeFunctionData, EIP1193Provider } from 'viem';
import { btr } from 'viem/chains';
import {
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

const signer = new WalletClientSigner(walletClient as WalletClient, 'json-rpc');
```

> **Note**: If you're using `wagmi`, you can simply use the `useWalletClient`
> hook or the `getWalletClient` function to obtain the wallet client.

### Initializing the Smart Account Client

```typescript
const client = await createSmartAccountClient({
  chain: btr,
  signer,
  ...config,
});
```

This client instance serves as your gateway to interact with ERC-4337 compliant
Smart Accounts on Bitlayer. The SDK supports two battle-tested account implementations:

- **Light Account** (`lightAccount`): A gas-efficient smart contract account
  developed by Alchemy, optimized for most dApp use cases.
- **Simple Account** (`simpleAccount`): The reference implementation from the
  Ethereum Foundation, offering standard ERC-4337 functionality.

By default, the SDK uses `lightAccount`. To switch to Simple Account, set the
`accountType` to `simpleAccount` in the configuration object:

```typescript
{
  // ...other properties
  factoryAddress: '0x...', // Simple Account factory address
  accountType: 'simpleAccount'
}
```

The initialized client provides methods to deploy your Smart Account,
estimate gas costs, and send user operations through the ERC-4337 bundler network.

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
There are some complete examples in the `examples` directory:

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
