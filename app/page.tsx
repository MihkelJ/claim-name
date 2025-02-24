'use client';

import { FollowStatusCard } from '../components/FollowStatusCard';
import RevokeSubnameCard from '../components/RevokeSubnameCard';
import { WalletCard } from '../components/WalletCard';
import type { SubnameRoot } from '../types/subname';
import { DisconnectedState } from './components/DisconnectedState';
import { RegistrationForm } from './components/RegistrationForm';
import { SubnameManagementForm } from './components/SubnameManagementForm';
import ENSProfileHeader from '@/components/ENSProfileHeader';
import CONSTANTS from '@/constants';
import { checkFollowerState, getFollowerSubdomains } from '@/lib/services/subname';
import { useQuery } from '@tanstack/react-query';
import { useAccount } from 'wagmi';

export default function SubnameRegistrationPage() {
  const { address } = useAccount();

  const { data: isFollowing, isLoading: isLoadingFollowerStatus } = useQuery({
    queryKey: ['isFollowing', address],
    queryFn: async () => await checkFollowerState(address),
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

  return (
    <main className="container mx-auto px-4 min-h-screen py-10">
      <div className="max-w-3xl mx-auto space-y-6">
        <ENSProfileHeader />

        {address ? (
          <>
            <WalletCard address={address} />
            <FollowStatusCard
              isLoading={isLoadingFollowerStatus}
              isFollowing={isFollowing}
              address={address}
            />

            {isFollowing && !hasRegisteredSubname && <RegistrationForm />}

            {hasRegisteredSubname && <SubnameManagementForm existingSubname={existingSubname} />}

            {hasRegisteredSubname && <RevokeSubnameCard subname={existingSubname?.ens} />}
          </>
        ) : (
          <DisconnectedState />
        )}
      </div>
    </main>
  );
}
