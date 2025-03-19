import LoadingSpinner from './ui/LoadingSpinner';
import ListUserCard from '@/components/ListUserCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import CONSTANTS from '@/constants';
import { getOpcodeString } from '@/hooks/useFollowAddress';
import useMembers from '@/hooks/useMembers';
import {
  extractAddressAndTag,
  getPendingTxListOps,
  truncateAddress,
  useTransactions,
} from 'ethereum-identity-kit';
import { MdPerson } from 'react-icons/md';
import { isAddress } from 'viem';
import { useAccount } from 'wagmi';

const AllMembersCard = () => {
  const { address } = useAccount();
  const { data: members, isFetched } = useMembers(CONSTANTS.ENS_DOMAIN);
  const { setTxModalOpen, pendingTxs } = useTransactions();

  return (
    <Card className="animate-fade-in">
      <CardHeader className="pb-6">
        <div className="flex justify-between items-center">
          <CardTitle className="text-base">All Members</CardTitle>
          {!isFetched && <LoadingSpinner />}
        </div>
      </CardHeader>

      <CardContent>
        {members?.following.map((member) => (
          <ListUserCard
            key={member.address}
            address={member.address}
            ownerAddress={address!}
          />
        ))}
      </CardContent>

      {getPendingTxListOps(pendingTxs).length > 0 && (
        <CardContent>
          <p className="text-sm text-muted-foreground mb-2">Pending Transactions</p>
          {getPendingTxListOps(pendingTxs).map((tx) => {
            const { address } = extractAddressAndTag(tx.data);

            if (!address || !isAddress(address)) return null;

            return (
              <div
                key={address}
                className="flex items-center gap-2 justify-between"
              >
                <div className="flex items-center gap-2 text-lg">
                  <MdPerson />
                  {truncateAddress(address)}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  {getOpcodeString(tx.opcode)}
                </div>
              </div>
            );
          })}
        </CardContent>
      )}

      {pendingTxs.length > 0 && (
        <CardFooter className="flex justify-end">
          <Button
            size="sm"
            onClick={() => setTxModalOpen(true)}
          >
            Confirm {pendingTxs.length} Changes
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default AllMembersCard;
