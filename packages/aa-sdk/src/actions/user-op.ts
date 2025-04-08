import type { Chain, SendTransactionParameters, Transport } from 'viem';
import type { SmartAccountClient } from '../client.js';
import type { PaymasterSponsorContext, PaymasterSupportedTokensResponse } from './paymaster.js';
import type {
  BuildTransactionParameters,
  SmartContractAccount,
  UserOperationContext,
  UserOperationStruct_v6,
  UserOperationStruct_v7,
} from '@aa-sdk/core';

export type UserOperationStruct = UserOperationStruct_v6 | UserOperationStruct_v7;

export type ShouldAttemptSponsorshipFunc = (
  userOp: UserOperationStruct,
  supportedTokens: PaymasterSupportedTokensResponse,
) => Promise<boolean | undefined>;

export type TransactionParams<TAccount, TContext> =
  | { type: 'single'; data: SendTransactionParameters }
  | { type: 'batch'; data: BuildTransactionParameters<TAccount, TContext> };

export interface SendUserOperationWithSponsorContextParams<
  TAccount extends SmartContractAccount | undefined = SmartContractAccount | undefined,
  TContext extends UserOperationContext | undefined = UserOperationContext | undefined,
> {
  transaction: TransactionParams<TAccount, TContext>;
  sponsorContext: PaymasterSponsorContext;
  waitRetries?: {
    maxRetries: number;
    intervalMs: number;
    multiplier: number;
  };
  shouldAttemptSponsorship?: ShouldAttemptSponsorshipFunc;
}

export async function sendUserOperationWithSponsorContext<
  TTransport extends Transport = Transport,
  TChain extends Chain | undefined = Chain | undefined,
  TAccount extends SmartContractAccount | undefined = SmartContractAccount | undefined,
  TContext extends UserOperationContext | undefined = UserOperationContext | undefined,
>(
  client: SmartAccountClient<TTransport, TChain>,
  params: SendUserOperationWithSponsorContextParams<TAccount, TContext>,
) {
  if (!client || !client.account) {
    throw new Error('Smart account not ready');
  }

  const {
    transaction,
    sponsorContext,
    shouldAttemptSponsorship,
    waitRetries = {
      maxRetries: 10,
      intervalMs: 5000,
      multiplier: 1.5,
    },
  } = params;

  let userOp: UserOperationStruct;
  if (transaction.type === 'single') {
    userOp = await client.buildUserOperationFromTx(transaction.data);
  } else if (transaction.type === 'batch') {
    const result = await client.buildUserOperationFromTxs(transaction.data);
    userOp = result.uoStruct;
  } else {
    throw new Error('Invalid transaction type');
  }

  const supportedTokens = await client.getSupportedTokens(userOp);
  if (supportedTokens.freeGas || supportedTokens.tokens.length > 0) {
    let shouldSponsor = true;

    if (shouldAttemptSponsorship) {
      const result = await shouldAttemptSponsorship(userOp, supportedTokens);
      shouldSponsor = result !== false; // true or undefined will proceed with sponsorship
    }

    if (shouldSponsor) {
      const paymasterResponse = await client.getSponsorUserOp(userOp, sponsorContext);
      userOp = {
        ...userOp,
        ...paymasterResponse,
      };
    }
  }

  const request = await client.signUserOperation({
    account: client.account,
    uoStruct: userOp,
  });

  const userOpHash = await client.sendRawUserOperation(
    request,
    client.account.getEntryPoint().address,
  );

  const txHash = await client.waitForUserOperationTransaction({
    hash: userOpHash,
    retries: waitRetries,
  });
  return txHash;
}
