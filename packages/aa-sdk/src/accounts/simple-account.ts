import {
  getEntryPoint,
  SimpleAccountAbi_v6,
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
  TSimpleAccountVersion extends SimpleAccountVersion = 'v0.7',
> = {
  transport: TTransport;
  chain: TChain;
  signer: TSigner;
  factoryAddress: Address;
  accountAddress?: Address;
  version?: TSimpleAccountVersion;
  salt?: bigint;
};

export type SimpleAccountVersion = 'v0.6' | 'v0.7';

export const defaultSimpleAccountVersion = (): SimpleAccountVersion => 'v0.7';

export function createSimpleAccount<
  TTransport extends Transport = Transport,
  TChain extends Chain = Chain,
  TSigner extends SmartAccountSigner = SmartAccountSigner,
  TSimpleAccountVersion extends SimpleAccountVersion = 'v0.7',
>({
  transport,
  chain,
  signer,
  factoryAddress,
  accountAddress,
  version = defaultSimpleAccountVersion() as TSimpleAccountVersion,
  salt = 0n,
}: CreateSimpleAccountParams<
  TTransport,
  TChain,
  TSigner,
  TSimpleAccountVersion
>): Promise<SmartContractAccount> {
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

  const accountAbi = version === 'v0.6' ? SimpleAccountAbi_v6 : SimpleAccountAbi_v7;

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
        abi: accountAbi,
        functionName: 'execute',
        args: [target, value ?? 0n, data],
      });
    },
    encodeBatchExecute: async (txs) => {
      if (version === 'v0.6') {
        const [targets, datas] = txs.reduce(
          (accum, curr) => {
            accum[0].push(curr.target);
            accum[1].push(curr.data);

            return accum;
          },
          [[], []] as [Address[], Hex[]],
        );
        return encodeFunctionData({
          abi: accountAbi,
          functionName: 'executeBatch',
          args: [targets, datas],
        });
      }

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
        abi: accountAbi,
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
