import LoadingSpinner from './ui/LoadingSpinner';
import ListUserCard from '@/components/ListUserCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CONSTANTS from '@/constants';
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

      <CardContent
        className="flex flex-col gap-4"
        hidden={CONSTANTS.USER_TAGS.length === 0}
      >
        <p className="text-sm text-muted-foreground">
          You can add tags to your members to help them be found by other members. Make sure to
          configure your members in the .env file.
        </p>
        <pre className="bg-muted p-4 rounded-md text-sm overflow-x-auto whitespace-pre-wrap break-words">
          <code>
            # .env {'\n'}
            NEXT_PUBLIC_USER_TAGS=
            {JSON.stringify(
              [
                { label: 'Architect', value: 'architect' },
                { label: 'Explorer', value: 'explorer' },
                { label: 'Enthusiast', value: 'enthusiast' },
                { label: 'Admin', value: 'admin' },
                { label: 'Core Team', value: 'core-team' },
              ],
              null,
              2,
            )}
            {'\n\n'}# Note: The JSON needs to be minified in the actual .env file
            {'\n'}# Value must contain only lowercase letters, numbers, and hyphens
          </code>
        </pre>
      </CardContent>

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
