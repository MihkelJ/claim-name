import LoadingSpinner from './ui/LoadingSpinner';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { justanameClientFrontend } from '@/config/client';
import CONSTANTS from '@/constants';
import { SubnameResponse } from '@justaname.id/sdk/index';
import { useQuery } from '@tanstack/react-query';
import { Address, useFollowButton } from 'ethereum-identity-kit';
import { isAddress } from 'viem';
import { useAccount } from 'wagmi';

const ViewAllSubdomainHolders = () => {
  const { data: subdomains, isFetched } = useQuery({
    queryKey: ['subdomains'],
    queryFn: () =>
      justanameClientFrontend.subnames.getSubnamesByEnsDomain({
        ensDomain: CONSTANTS.ENS_DOMAIN,
        chainId: 1,
        limit: 100,
      }),
  });

  return (
    <Card className="animate-fade-in">
      <CardHeader className="pb-6">
        <div className="flex justify-between items-center">
          <CardTitle className="text-base">All Subdomain Holders</CardTitle>
          {!isFetched && <LoadingSpinner />}
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        {subdomains?.data.map((subdomain) => {
          const lookupAddress = subdomain.records.coins.find((coin) => coin.id === 60)?.value;

          if (!lookupAddress || !isAddress(lookupAddress)) return null;

          return (
            <ListSubdomainHolder
              key={subdomain.ens}
              subdomain={subdomain}
              lookupAddress={lookupAddress}
            />
          );
        })}
      </CardContent>
    </Card>
  );
};

const ListSubdomainHolder = ({
  subdomain,
  lookupAddress,
}: {
  subdomain: SubnameResponse;
  lookupAddress: Address;
}) => {
  const { address: connectedAddress } = useAccount();

  const { buttonText, handleAction } = useFollowButton({
    lookupAddress,
    connectedAddress,
  });

  return (
    <div className="flex items-center gap-2 justify-between">
      <div className="flex flex-col">
        <div className="text-base font-medium">{subdomain.ens}</div>
        <div className="text-xs gap-1 text-muted-foreground flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-3 w-3 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          {subdomain.claimedAt ? new Date(subdomain.claimedAt).toLocaleString() : 'Not claimed'}
        </div>
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

export default ViewAllSubdomainHolders;
