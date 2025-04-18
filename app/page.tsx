'use client';

import ConnectWalletCard from '../components/ConnectWalletCard';
import { RegistrationForm } from '../components/RegistrationForm';
import RevokeSubnameCard from '../components/RevokeSubnameCard';
import { WalletCard } from '../components/WalletCard';
import type { SubnameRoot } from '../types/subname';
import AddAddressInputCard from '@/components/AddAddressInputCard';
import ENSProfileHeader from '@/components/ENSProfileHeader';
import ViewFollowStatusCard from '@/components/FollowStatusCard';
import MembershipInviteCard from '@/components/MembershipInviteCard';
import ViewPendingTransactionsCard from '@/components/PendingTransactionsCard';
import ViewAllMembersCard from '@/components/ViewAllMembersCard';
import CONSTANTS from '@/constants';
import { fetchFollowerState, getFollowerSubdomains } from '@/lib/services/subname';
import { useQuery } from '@tanstack/react-query';
import { isAddressEqual } from 'viem';
import { useAccount } from 'wagmi';

export default function SubnameRegistrationPage() {
  const { address } = useAccount();

  const {
    data: followerState,
    isLoading: isLoadingFollowerStatus,
    isFetched: isFetchedFollowerState,
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
    address && followerState?.addressFollower && !isLoadingFollowerStatus
      ? isAddressEqual(followerState.addressFollower, address)
      : false;

  // Render helper functions
  const renderOwnerContent = () => {
    if (!isOwner || !address) return null;

    return (
      <>
        <AddAddressInputCard />
        <ViewAllMembersCard />
        <ViewPendingTransactionsCard />
      </>
    );
  };

  const renderFollowerContent = () => {
    if (!address || isOwner) return null;

    if (!isFetchedFollowerState) {
      // If owner, only show the FollowStatusCard but not the other follower content
      return (
        <ViewFollowStatusCard
          isLoading={isLoadingFollowerStatus}
          isFollowing={followerState?.state.follow}
        />
      );
    }

    return (
      <>
        <ViewFollowStatusCard
          isLoading={isLoadingFollowerStatus}
          isFollowing={followerState?.state.follow}
        />

        {!hasRegisteredSubname && CONSTANTS.MEMBERS_ONLY && followerState?.state.follow && (
          <RegistrationForm />
        )}
        {!hasRegisteredSubname && !CONSTANTS.MEMBERS_ONLY && <RegistrationForm />}

        {CONSTANTS.MEMBERS_ONLY && !followerState?.state.follow && (
          <MembershipInviteCard address={address} />
        )}
        {!CONSTANTS.MEMBERS_ONLY && hasRegisteredSubname && !followerState?.state.follow && (
          <MembershipInviteCard address={address} />
        )}

        {hasRegisteredSubname && (
          <>
            {/* <SubnameManagementForm existingSubname={existingSubname} /> */}
            <RevokeSubnameCard subname={existingSubname?.ens} />
          </>
        )}

        {}
      </>
    );
  };

  return (
    <main className="container mx-auto px-4 min-h-screen py-10">
      <div className="max-w-3xl mx-auto space-y-6">
        <ENSProfileHeader />

        {!address && <ConnectWalletCard />}

        {address && (
          <WalletCard
            isOwner={isOwner}
            address={address}
          />
        )}

        {renderFollowerContent()}
        {renderOwnerContent()}
      </div>
    </main>
  );
}
