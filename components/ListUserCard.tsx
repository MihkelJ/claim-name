'use client';

import { Button } from './ui/button';
import CONSTANTS from '@/constants';
import { getFollowerSubdomains } from '@/lib/services/subname';
import { SubnameRoot } from '@/types/subname';
import { useQuery } from '@tanstack/react-query';
import { truncateAddress, useFollowButton } from 'ethereum-identity-kit';
import { MdPerson } from 'react-icons/md';
import { Address } from 'viem';

const ListUserCard = ({ address, ownerAddress }: { address: Address; ownerAddress: Address }) => {
  const { buttonText, handleAction } = useFollowButton({
    lookupAddress: address,
    connectedAddress: ownerAddress,
  });

  const { data: subnameData } = useQuery<SubnameRoot>({
    queryKey: ['subnames', address],
    queryFn: async () => await getFollowerSubdomains(address),
    enabled: !!address,
  });

  const existingSubname = subnameData?.result.data.subnames.find((subname) =>
    subname.ens.endsWith(CONSTANTS.ENS_DOMAIN),
  );

  return (
    <div className="flex items-center gap-2 justify-between">
      <div className="flex items-center gap-2 text-lg">
        <MdPerson />
        {existingSubname?.ens || truncateAddress(address)}
      </div>
      <Button
        size="sm"
        variant="outline"
        onClick={handleAction}
      >
        {buttonText}
      </Button>
    </div>
  );
};

export default ListUserCard;
