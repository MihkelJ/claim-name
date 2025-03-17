import CONSTANTS from '@/constants';
import { getFollowerSubdomains } from '@/lib/services/subname';
import { SubnameRoot } from '@/types/subname';
import { useQuery } from '@tanstack/react-query';
import { truncateAddress } from 'ethereum-identity-kit';
import { MdPerson } from 'react-icons/md';
import { Address } from 'viem';

const ListUserCard = ({ address }: { address: Address }) => {
  const { data: subnameData } = useQuery<SubnameRoot>({
    queryKey: ['subnames', address],
    queryFn: async () => await getFollowerSubdomains(address),
    enabled: !!address,
  });

  const existingSubname = subnameData?.result.data.subnames.find((subname) =>
    subname.ens.endsWith(CONSTANTS.ENS_DOMAIN),
  );

  return (
    <div className="flex items-center gap-2">
      <MdPerson />
      {existingSubname?.ens || truncateAddress(address)}
    </div>
  );
};

export default ListUserCard;
