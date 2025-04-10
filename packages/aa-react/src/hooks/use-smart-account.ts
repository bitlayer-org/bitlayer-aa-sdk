import React from 'react';
import { SmartAccountContext } from '../context.js';

export function useSmartAccount() {
  const context = React.useContext(SmartAccountContext);
  if (!context) {
    throw new Error('useSmartAccountConfig must be used within a SmartAccountConfigProvider');
  }

  const { client, walletClient } = context;
  return {
    account: client?.account,
    address: client?.account.address,
    chain: client?.chain,
    client,
    eoaAccount: walletClient?.account,
    eoaAddress: walletClient?.account?.address,
    walletClient,
  };
}
