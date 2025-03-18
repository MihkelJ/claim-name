'use client';

import { FollowStatusCard } from '../components/FollowStatusCard';
import RevokeSubnameCard from '../components/RevokeSubnameCard';
import { WalletCard } from '../components/WalletCard';
import type { SubnameRoot } from '../types/subname';
import AllMembersCard from './components/AllMembersCard';
import { DisconnectedState } from './components/DisconnectedState';
import { RegistrationForm } from './components/RegistrationForm';
import { SubnameManagementForm } from './components/SubnameManagementForm';
import ENSProfileHeader from '@/components/ENSProfileHeader';
import { FollowAddressCard } from '@/components/FollowAddressCard';
import CONSTANTS from '@/constants';
import { fetchFollowerState, getFollowerSubdomains } from '@/lib/services/subname';
import { useQuery } from '@tanstack/react-query';
import { isAddressEqual } from 'viem';
import { useAccount } from 'wagmi';

export default function SubnameRegistrationPage() {
  const { address } = useAccount();

  const { data: followerState, isLoading: isLoadingFollowerStatus } = useQuery({
    queryKey: ['followerState', address],
    queryFn: async () => await fetchFollowerState(address),
    enabled: !!address,
  });

  const { data: subnameData, isLoading: isLoadingSubnameData } = useQuery<SubnameRoot>({
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

        {!isOwner && address && (
          <>
            <FollowStatusCard
              isLoading={isLoadingFollowerStatus}
              isFollowing={followerState?.state.follow}
              address={address}
            />

            {followerState?.state.follow && !hasRegisteredSubname && <RegistrationForm />}

            {hasRegisteredSubname && <SubnameManagementForm existingSubname={existingSubname} />}

            {hasRegisteredSubname && <RevokeSubnameCard subname={existingSubname?.ens} />}
          </>
        )}

        {isOwner && address && (
          <>
            <FollowAddressCard />
            <AllMembersCard />
          </>
        )}
      </div>
    </main>
  );
}
