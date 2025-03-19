'use client';

import { InfoCard } from '../../components/InfoCard';
import ConnectWalletCard from '@/components/ConnectWalletCard';
import ENSProfileHeader from '@/components/ENSProfileHeader';
import { WalletCard } from '@/components/WalletCard';
import CONSTANTS from '@/constants';
import { useFollowAddress } from '@/hooks/useFollowAddress';
import { fetchFollowerState, getFollowerSubdomains } from '@/lib/services/subname';
import { SubnameRoot } from '@/types/subname';
import { useQuery } from '@tanstack/react-query';
import { extractAddressAndTag, getPendingTxListOps, useTransactions } from 'ethereum-identity-kit';
import { useRouter } from 'next/navigation';
import { Address, isAddress, isAddressEqual } from 'viem';
import { useAccount } from 'wagmi';

export default function SubnameViewPage({ params }: { params: { address: Address } }) {
  const { address: connectedAddress } = useAccount();
  const router = useRouter();

  const { followAddress } = useFollowAddress();
  const { pendingTxs, setTxModalOpen } = useTransactions();

  const {
    data: followerState,
    isLoading: isLoadingFollowerStatus,
    isFetched,
  } = useQuery({
    queryKey: ['followerState', connectedAddress],
    queryFn: async () => await fetchFollowerState(connectedAddress),
    enabled: !!connectedAddress,
  });

  const { data: subnameData } = useQuery<SubnameRoot>({
    queryKey: ['subnames', connectedAddress],
    queryFn: async () => await getFollowerSubdomains(connectedAddress),
    enabled: !!connectedAddress,
  });

  const existingSubname = subnameData?.result.data.subnames.find((subname) =>
    subname.ens.endsWith(CONSTANTS.ENS_DOMAIN),
  );

  const hasRegisteredSubname = !!existingSubname;
  const isOwner =
    connectedAddress && followerState?.addressFollower && !isLoadingFollowerStatus
      ? isAddressEqual(followerState?.addressFollower, connectedAddress)
      : false;

  const isPending = getPendingTxListOps(pendingTxs).some((tx) => {
    const { address } = extractAddressAndTag(tx.data);

    if (!address || !isAddress(address)) return false;

    return isAddressEqual(address, params.address);
  });

  if (!params.address || !isAddress(params.address)) {
    return <div>No address</div>;
  }

  return (
    <main className="container mx-auto px-4 min-h-screen py-10">
      <div className="max-w-3xl mx-auto space-y-6">
        <ENSProfileHeader />

        {!connectedAddress && <ConnectWalletCard />}

        {connectedAddress && (
          <WalletCard
            isOwner={isOwner}
            address={connectedAddress}
          />
        )}

        {!isOwner && isFetched && !hasRegisteredSubname && (
          <InfoCard
            title={`Share this to ${CONSTANTS.ENS_DOMAIN}`}
            description={`Please share this to the ${CONSTANTS.ENS_DOMAIN} administrator to manage your subdomain membership.`}
            action={{
              label: 'Share',
              onClick: () => {
                navigator.clipboard.writeText(`https://${CONSTANTS.ENS_DOMAIN}/${params.address}`);
              },
            }}
          />
        )}

        {hasRegisteredSubname && !isOwner && (
          <InfoCard
            title="You have a subdomain"
            description="You can manage your subdomain membership in the home page."
            action={{
              label: 'Manage',
              onClick: () => {
                router.push(`/`);
              },
            }}
          />
        )}

        {isOwner && (
          <InfoCard
            title={isPending ? 'Adding member...' : 'You can add this address as member'}
            description="You can manage your subdomain membership in the home page."
            action={{
              label: isPending ? 'Complete' : 'Add Member',
              onClick: () => {
                if (isPending) {
                  setTxModalOpen(true);
                } else {
                  followAddress(params.address);
                }
              },
            }}
          />
        )}
      </div>
    </main>
  );
}
