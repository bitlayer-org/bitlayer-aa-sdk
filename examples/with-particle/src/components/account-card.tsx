import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Field, FieldList } from '@/components/ui/field';
import { useSmartAccount } from '@bitlayer/aa-react';
import { AddressLink } from './address-link';

export function AccountCard() {
  const { account, chain, eoaAccount } = useSmartAccount();

  const { data: isAccountDeployed } = useQuery({
    queryKey: ['smartAccount/isAccountDeployed', account?.address],
    queryFn: () => account?.isAccountDeployed(),
    enabled: !!account,
  });

  const { data: factoryAddress } = useQuery({
    queryKey: ['smartAccount/factoryAddress', account?.address],
    queryFn: () => account?.getFactoryAddress(),
    enabled: !!account,
  });

  return (
    <Card className="w-full lg:max-w-lg">
      <CardHeader>
        <CardTitle>Smart Account</CardTitle>
        <CardDescription>Smart account information.</CardDescription>
      </CardHeader>
      <CardContent>
        {account && chain && (
          <FieldList>
            <Field label="Chain ID" description={chain.name}>
              {chain.id}
            </Field>
            <Field
              label="Smart Account Address"
              description={isAccountDeployed ? 'Deployed' : 'Not deployed'}
            >
              <AddressLink chain={chain} address={account.address} />
            </Field>
            <Field label="Owner">
              <AddressLink chain={chain} address={eoaAccount?.address} />
            </Field>
            <Field label="EOA Address">
              <AddressLink chain={chain} address={eoaAccount?.address} />
            </Field>
            <Field label="Entry Point Address" description="Version 0.6">
              <AddressLink chain={chain} address={account.getEntryPoint().address} />
            </Field>
            <Field label="Factory Address" description={account.source}>
              <AddressLink chain={chain} address={factoryAddress} />
            </Field>
          </FieldList>
        )}
      </CardContent>
    </Card>
  );
}
