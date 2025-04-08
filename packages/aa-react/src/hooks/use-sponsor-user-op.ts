import { useMutation } from '@tanstack/react-query';
import type { Chain, Transport } from 'viem';
import {
  type SmartAccountClient,
  type SmartContractAccount,
  type SendUserOperationWithSponsorContextParams,
  type UserOperationContext,
  sendUserOperationWithSponsorContext,
} from '@bitlayer/aa-sdk';

export interface UseSponsorUserOperationParams<
  transport extends Transport = Transport,
  chain extends Chain | undefined = Chain | undefined,
> {
  client?: SmartAccountClient<transport, chain>;
}

export const useSponsorUserOperation = <
  TAccount extends SmartContractAccount | undefined = SmartContractAccount | undefined,
  TContext extends UserOperationContext | undefined = UserOperationContext | undefined,
>({ client }: UseSponsorUserOperationParams = {}) => {
  const { mutate, mutateAsync, ...mutation } = useMutation({
    mutationFn: async (params: SendUserOperationWithSponsorContextParams<TAccount, TContext>) => {
      if (!client || !client.account) {
        throw new Error('Smart account not ready');
      }
      return sendUserOperationWithSponsorContext(client, params);
    },
  });

  return {
    send: mutate,
    sendAsync: mutateAsync,
    ...mutation,
  };
};
