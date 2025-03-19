import LoadingSpinner from './ui/LoadingSpinner';
import ListUserCard from '@/components/ListUserCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CONSTANTS from '@/constants';
import useMembers from '@/hooks/useMembers';
import { useAccount } from 'wagmi';

const ViewAllMembersCard = () => {
  const { address } = useAccount();
  const { data: members, isFetched } = useMembers(CONSTANTS.ENS_DOMAIN);

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
    </Card>
  );
};

export default ViewAllMembersCard;
