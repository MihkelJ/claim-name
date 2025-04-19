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
import { SubnameManagementForm } from '@/components/SubnameManagementForm';
import ViewAllMembersCard from '@/components/ViewAllMembersCard';
import { justanameClientFrontend, publicClient } from '@/config/client';
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
    queryFn: async () => {
      try {
        // Fetch ENS records for the domain
        const records = await justanameClientFrontend.subnames.getRecords({
          ens: CONSTANTS.ENS_DOMAIN,
        });

        // Find the community configuration record
        const configRecord = records.records.texts.find((record) =>
          record.key.endsWith(CONSTANTS.COMMUNITY_CONFIG_RECORD_KEY),
        );

        if (!configRecord?.value) {
          throw new Error('Community configuration not found');
        }

        // Parse the configuration
        const configJson = JSON.parse(configRecord.value);
        const membersSource = configJson?.members_source;

        if (!membersSource || typeof membersSource !== 'string') {
          throw new Error('Invalid members source in configuration');
        }

        // Resolve the ENS name to get the address
        const followedAddress = await publicClient.getEnsResolver({
          name: membersSource,
        });

        // Fetch the follower state using the resolved address
        return await fetchFollowerState(address, followedAddress);
      } catch (error) {
        console.error('Error fetching follower state:', error);
        throw error;
      }
    },
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
            <SubnameManagementForm existingSubname={existingSubname} />
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
