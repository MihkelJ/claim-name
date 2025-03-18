'use client';

import { DisconnectedState } from '../components/DisconnectedState';
import { InfoCard } from '../components/InfoCard';
import ENSProfileHeader from '@/components/ENSProfileHeader';
import { WalletCard } from '@/components/WalletCard';
import CONSTANTS from '@/constants';
import { fetchFollowerState, getFollowerSubdomains } from '@/lib/services/subname';
import { SubnameRoot } from '@/types/subname';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { isAddressEqual } from 'viem';
import { useAccount } from 'wagmi';

export default function SubnameRegistrationPage() {
  const { address } = useAccount();
  const router = useRouter();

  const {
    data: followerState,
    isLoading: isLoadingFollowerStatus,
    isFetched,
  } = useQuery({
    queryKey: ['followerState', address],
    queryFn: async () => await fetchFollowerState(address),
    enabled: !!address,
  });

  const { data: subnameData } = useQuery<SubnameRoot>({
    queryKey: ['subnames', address],
    queryFn: async () => await getFollowerSubdomains(address),
    enabled: !!address,
  });

  const existingSubname = subnameData?.result.data.subnames.find((subname) =>
    subname.ens.endsWith(CONSTANTS.ENS_DOMAIN),
  );

  const hasRegisteredSubname = !!existingSubname;
  const isOwner =
    address && followerState?.addressUser && !isLoadingFollowerStatus
      ? isAddressEqual(followerState?.addressUser, address)
      : false;

  return (
    <main className="container mx-auto px-4 min-h-screen py-10">
      <div className="max-w-3xl mx-auto space-y-6">
        <ENSProfileHeader />

        {!address && <DisconnectedState />}

        {address && (
          <WalletCard
            isOwner={isOwner}
            address={address}
          />
        )}

        {!isOwner && isFetched && !hasRegisteredSubname && (
          <InfoCard
            title={`Share this to ${CONSTANTS.ENS_DOMAIN}`}
            description={`Please share this to the ${CONSTANTS.ENS_DOMAIN} administrator to manage your subdomain membership.`}
            action={{
              label: 'Share',
              onClick: () => {
                navigator.clipboard.writeText(`https://${CONSTANTS.ENS_DOMAIN}/${address}`);
              },
            }}
          />
        )}

        {hasRegisteredSubname && (
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
      </div>
    </main>
  );
}
