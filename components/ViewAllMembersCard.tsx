import LoadingSpinner from './ui/LoadingSpinner';
import ListUserCard from '@/components/ListUserCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import useMembers from '@/hooks/useMembers';
import { Address } from 'viem';
import { useAccount } from 'wagmi';

const ViewAllMembersCard = ({ members_source }: { members_source: Address }) => {
  const { address } = useAccount();
  const { data: members, isFetched } = useMembers(members_source);

  const hasMembers = (members?.following?.length ?? 0) > 0;

  return (
    <Card className="animate-fade-in">
      <CardHeader className="pb-6">
        <div className="flex justify-between items-center">
          <CardTitle className="text-base">All Members</CardTitle>
          {!isFetched && <LoadingSpinner />}
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        {hasMembers &&
          members?.following?.map((member) => (
            <ListUserCard
              key={member.address}
              address={member.address}
              ownerAddress={address!}
            />
          ))}

        {!hasMembers && isFetched && (
          <div className="text-center text-sm text-muted-foreground">No members found</div>
        )}
      </CardContent>
    </Card>
  );
};

export default ViewAllMembersCard;
