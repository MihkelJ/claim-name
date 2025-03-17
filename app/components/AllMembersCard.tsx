import ListUserCard from '@/components/ListUserCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CONSTANTS from '@/constants';
import useMembers from '@/hooks/useMembers';

const AllMembersCard = () => {
  const { data: members } = useMembers(CONSTANTS.ENS_DOMAIN);

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
          />
        ))}
      </CardContent>
    </Card>
  );
};

export default AllMembersCard;
