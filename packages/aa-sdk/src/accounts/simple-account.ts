import {
  getEntryPoint,
  SimpleAccountAbi_v7,
  SimpleAccountFactoryAbi,
  toSmartContractAccount,
} from '@aa-sdk/core';
import { concatHex, encodeFunctionData } from 'viem';
import type { SmartAccountSigner, SmartContractAccount } from '@aa-sdk/core';
import type { Address, Chain, Hex, SignTypedDataParameters, Transport } from 'viem';

export type CreateSimpleAccountParams<
  TTransport extends Transport = Transport,
  TChain extends Chain | undefined = Chain | undefined,
  TSigner extends SmartAccountSigner = SmartAccountSigner,
> = {
  transport: TTransport;
  chain: TChain;
  signer: TSigner;
  factoryAddress: Address;
  accountAddress?: Address;
  salt?: bigint;
};

export function createSimpleAccount<
  TTransport extends Transport = Transport,
  TChain extends Chain = Chain,
  TSigner extends SmartAccountSigner = SmartAccountSigner,
>({
  transport,
  chain,
  signer,
  factoryAddress,
  accountAddress,
  salt = 0n,
}: CreateSimpleAccountParams<TTransport, TChain, TSigner>): Promise<SmartContractAccount> {
  const getAccountInitCode = async () => {
    return concatHex([
      factoryAddress,
      encodeFunctionData({
        abi: SimpleAccountFactoryAbi,
        functionName: 'createAccount',
        args: [await signer.getAddress(), salt],
      }),
    ]);
  };

  const getDummySignature = async () => {
    return '0xfffffffffffffffffffffffffffffff0000000000000000000000000000000007aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa1c' as Hex;
  };

  return toSmartContractAccount({
    source: 'SimpleAccount',
    transport,
    chain,
    entryPoint: getEntryPoint(chain),
    accountAddress,
    getAccountInitCode,
    getDummySignature,
    encodeExecute: async ({ target, data, value }) => {
      return encodeFunctionData({
        abi: SimpleAccountAbi_v7,
        functionName: 'execute',
        args: [target, value ?? 0n, data],
      });
    },
    encodeBatchExecute: async (txs) => {
      const [targets, values, datas] = txs.reduce(
        (accum, curr) => {
          accum[0].push(curr.target);
          accum[1].push(curr.value ?? 0n);
          accum[2].push(curr.data);

          return accum;
        },
        [[], [], []] as [Address[], bigint[], Hex[]],
      );
      return encodeFunctionData({
        abi: SimpleAccountAbi_v7,
        functionName: 'executeBatch',
        args: [targets, values, datas],
      });
    },
    signUserOperationHash: async (uoHash: Hex): Promise<Hex> => {
      return await signer.signMessage({ raw: uoHash });
    },
    signMessage: async ({ message }): Promise<Hex> => {
      return signer.signMessage(message);
    },
    signTypedData: async (typedData): Promise<Hex> => {
      return signer.signTypedData(typedData as unknown as SignTypedDataParameters);
    },
  });
}
