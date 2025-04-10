import { Chain } from 'viem';
import useCopy from '@react-hook/copy';
import { CopyIcon } from '@radix-ui/react-icons';
import { buildExplorerAddressUrl, cn } from '@/lib/utils';

export const AddressLink = ({ chain, address = '' }: { chain?: Chain; address?: string }) => {
  const { copied, copy, reset } = useCopy(address);

  if (!address) {
    return null;
  }

  const handleClickCopy = () => {
    copy();
    setTimeout(reset, 1000);
  };

  return (
    <div className="flex gap-2">
      <a
        href={buildExplorerAddressUrl(chain, address)}
        target="_blank"
        rel="noreferrer"
        className="text-sm block underline font-mono w-fit hover:font-semibold"
      >
        {address}
      </a>
      <button
        className={cn('text-gray-400 hover:text-black', {
          'text-gray-200 hover:text-gray-200': copied,
        })}
        onClick={handleClickCopy}
      >
        <CopyIcon />
      </button>
    </div>
  );
};
