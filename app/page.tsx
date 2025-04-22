'use client';

import ConnectWalletCard from '../components/ConnectWalletCard';
import { RegistrationForm } from '../components/RegistrationForm';
import { WalletCard } from '../components/WalletCard';
import type { SubnameRoot } from '../types/subname';
import AddAddressInputCard from '@/components/AddAddressInputCard';
import ENSProfileHeader from '@/components/ENSProfileHeader';
import ViewFollowStatusCard from '@/components/FollowStatusCard';
import MembershipInviteCard from '@/components/MembershipInviteCard';
import ViewPendingTransactionsCard from '@/components/PendingTransactionsCard';
import { RegisteredSubdomainSuccess } from '@/components/RegisteredSubdomainSuccess';
import { SubnameManagementForm } from '@/components/SubnameManagementForm';
import ViewAllMembersCard from '@/components/ViewAllMembersCard';
import ViewAllSubdomainHolders from '@/components/ViewAllSubdomainHolders';
import { justanameClientFrontend, publicClient } from '@/config/client';
import CONSTANTS from '@/constants';
import { fetchFollowerState, getFollowerSubdomains } from '@/lib/services/subname';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { Address, isAddressEqual } from 'viem';
import { useAccount } from 'wagmi';

export default function SubnameRegistrationPage() {
  const { address } = useAccount();

  const { data: membersSource } = useQuery({
    queryKey: ['membersSource'],
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
        const membersSourceEns = configJson?.members_source;

        if (!membersSourceEns || typeof membersSourceEns !== 'string') {
          throw new Error('Invalid members source in configuration');
        }

        const membersSourceAddress = await publicClient.getEnsAddress({
          name: membersSourceEns,
        });

        return { ens: membersSourceEns, address: membersSourceAddress as Address };
      } catch (error) {
        console.error('Error fetching members source:', error);
        throw error;
      }
    },
    enabled: CONSTANTS.MEMBERS_ONLY,
  });

  const {
    data: followerState,
    isLoading: isLoadingFollowerStatus,
    isFetched: isFetchedFollowerState,
  } = useQuery({
    queryKey: ['followerState', address, membersSource],
    queryFn: async () => {
      try {
        if (!membersSource) {
          throw new Error('Members source not available');
        }

        // Fetch the follower state using the resolved address
        return await fetchFollowerState(address, membersSource.address);
      } catch (error) {
        console.error('Error fetching follower state:', error);
        throw error;
      }
    },
    enabled: !!address && !!membersSource,
  });

  const { data: subnameData, isLoading: isLoadingSubname } = useQuery<SubnameRoot>({
    queryKey: ['subnames', address],
    queryFn: async () => await getFollowerSubdomains(address),
    enabled: !!address,
  });

  const existingSubname = subnameData?.result.data.subnames.find((subname) =>
    subname.ens.endsWith(CONSTANTS.ENS_DOMAIN),
  );

  const hasRegisteredSubname = !!existingSubname;

  const isAdmin = useMemo(() => {
    console.log(membersSource?.address, address);
    return address && membersSource?.address
      ? isAddressEqual(membersSource.address, address)
      : false;
  }, [address, membersSource?.address]);

  // Render helper functions
  const renderOwnerContent = () => {
    if (!isAdmin || !address || !membersSource) return null;

    return (
      <>
        <AddAddressInputCard />
        <ViewAllMembersCard members_source={membersSource.address} />
        <ViewAllSubdomainHolders />
        <ViewPendingTransactionsCard />
      </>
    );
  };

  const renderFollowerContent = () => {
    if (!address || isAdmin) return null;

    if (isLoadingSubname) {
      return <div className="p-4 bg-white rounded-lg shadow">Loading subname data...</div>;
    }

    if (!isFetchedFollowerState && CONSTANTS.MEMBERS_ONLY) {
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
        {CONSTANTS.MEMBERS_ONLY && (
          <ViewFollowStatusCard
            isLoading={isLoadingFollowerStatus}
            isFollowing={followerState?.state.follow}
          />
        )}

        {!hasRegisteredSubname && CONSTANTS.MEMBERS_ONLY && followerState?.state.follow && (
          <RegistrationForm />
        )}

        {!hasRegisteredSubname && !CONSTANTS.MEMBERS_ONLY && <RegistrationForm />}

        {CONSTANTS.MEMBERS_ONLY && !followerState?.state.follow && (
          <MembershipInviteCard address={address} />
        )}

        {hasRegisteredSubname && (
          <>
            <RegisteredSubdomainSuccess />
            <SubnameManagementForm existingSubname={existingSubname} />
            {/* <RevokeSubnameCard subname={existingSubname?.ens} /> */}
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
            isOwner={isAdmin}
            address={address}
            subdomain={existingSubname?.ens}
          />
        )}

        {renderFollowerContent()}
        {renderOwnerContent()}
      </div>
    </main>
  );
}
