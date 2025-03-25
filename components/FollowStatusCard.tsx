import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FiLoader, FiX } from 'react-icons/fi';
import { MdVerified } from 'react-icons/md';

interface FollowStatusCardProps {
  isLoading: boolean;
  isFollowing?: boolean;
}

const ViewFollowStatusCard = ({ isLoading, isFollowing }: FollowStatusCardProps) => {
  return (
    <div className="space-y-4">
      <Card className="animate-fade-in">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-base">Membership Status</CardTitle>
            {isLoading ? (
              <FiLoader className="size-6 animate-spin" />
            ) : isFollowing ? (
              <MdVerified className="size-6 text-blue-500" />
            ) : (
              <FiX className="size-6 text-red-500" />
            )}
          </div>
        </CardHeader>
        <CardContent>
          <CardDescription>
            {isLoading
              ? 'Checking membership status...'
              : isFollowing
                ? 'Verified Member'
                : 'Not a Member'}
          </CardDescription>
        </CardContent>
      </Card>
    </div>
  );
};

export default ViewFollowStatusCard;
