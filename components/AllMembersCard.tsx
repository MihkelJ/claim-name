import ListUserCard from '@/components/ListUserCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import CONSTANTS from '@/constants';
import useMembers from '@/hooks/useMembers';
import { useTransactions } from 'ethereum-identity-kit';
import { useAccount } from 'wagmi';

const AllMembersCard = () => {
  const { address } = useAccount();
  const { data: members } = useMembers(CONSTANTS.ENS_DOMAIN);
  const { setTxModalOpen, pendingTxs } = useTransactions();

  return (
    <Card className="animate-fade-in">
      <CardHeader className="pb-6">
        <div className="flex justify-between items-center">
          <CardTitle className="text-base">All Members</CardTitle>
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
      {pendingTxs.length > 0 && (
        <CardFooter className="flex justify-end">
          <Button
            size="sm"
            onClick={() => setTxModalOpen(true)}
          >
            Confirm Changes
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default AllMembersCard;
