'use client';

import { Button } from './ui/button';
import { MultiSelect } from './ui/multi-select';
import CONSTANTS from '@/constants';
import { getFollowerSubdomains } from '@/lib/services/subname';
import { SubnameRoot } from '@/types/subname';
import { useQuery } from '@tanstack/react-query';
import {
  getPendingTxAddressesAndTags,
  listOpAddTag,
  truncateAddress,
  useFollowButton,
  useTransactions,
} from 'ethereum-identity-kit';
import { useCallback, useMemo } from 'react';
import { MdPerson } from 'react-icons/md';
import { Address } from 'viem';

const OPTIONS = [
  { label: 'Architect', value: 'architect' },
  { label: 'Explorer', value: 'explorer' },
  { label: 'Enthusiast', value: 'enthusiast' },
  { label: 'Admin', value: 'admin' },
  { label: 'Core Team', value: 'core-team' },
];

const ListUserCard = ({ address, ownerAddress }: { address: Address; ownerAddress: Address }) => {
  const { addListOpsTransaction, pendingTxs, removeListOpsTransaction } = useTransactions();

  const { buttonText, handleAction } = useFollowButton({
    lookupAddress: address,
    connectedAddress: ownerAddress,
  });

  const { data: subnameData } = useQuery<SubnameRoot>({
    queryKey: ['subnames', address],
    queryFn: async () => await getFollowerSubdomains(address),
    enabled: !!address,
  });

  const existingSubname = useMemo(() => {
    return subnameData?.result.data.subnames.find((subname) =>
      subname.ens.endsWith(CONSTANTS.ENS_DOMAIN),
    );
  }, [subnameData]);

  const userValue = useMemo(() => {
    return getPendingTxAddressesAndTags(pendingTxs)
      .filter((tx) => tx.address === address)
      .map((tx) => tx.tag);
  }, [pendingTxs, address]);

  const handleValueChange = useCallback(
    (value: string[]) => {
      const userTags = getPendingTxAddressesAndTags(pendingTxs).filter(
        (tx) => tx.address === address,
      );

      // Clean state for the address, remove all the tags
      // TODO: also check if the tag is already set and only add if it's not (this is a bit tricky because we need to check the existing tags)
      removeListOpsTransaction(userTags.map((o) => listOpAddTag(o.address, o.tag).data));

      // Then add the new options
      addListOpsTransaction(value.map((option) => listOpAddTag(address, option)));
    },
    [pendingTxs, address, removeListOpsTransaction, addListOpsTransaction],
  );

  const displayName = useMemo(
    () => existingSubname?.ens || truncateAddress(address),
    [existingSubname, address],
  );

  return (
    <div className="flex items-center gap-2 justify-between">
      <div className="flex items-center gap-2 text-lg">
        <MdPerson />
        {displayName}
      </div>
      <div className="flex items-center gap-2">
        <MultiSelect
          options={OPTIONS}
          value={userValue}
          onValueChange={handleValueChange}
          placeholder="Add tags..."
          searchable={true}
        />
        <Button
          size="sm"
          variant="outline"
          onClick={handleAction}
        >
          {buttonText}
        </Button>
      </div>
    </div>
  );
};

export default ListUserCard;
