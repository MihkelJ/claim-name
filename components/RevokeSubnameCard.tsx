import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import CONSTANTS from '@/constants';
import { useRevokeSubname } from '@justaname.id/react';
import { Loader2, TrashIcon } from 'lucide-react';

const RevokeSubnameCard = ({ subname }: { subname?: string }) => {
  const { revokeSubname, isRevokeSubnamePending } = useRevokeSubname();

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle>Revoke Subname</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>
          You are about to revoke your current subdomain. Once revoked, you can set a new subdomain.
        </CardDescription>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button
          variant="destructive"
          disabled={isRevokeSubnamePending}
          onClick={async () => {
            if (!subname) return;

            const username = subname.replace(`.${CONSTANTS.ENS_DOMAIN}`, '');

            await revokeSubname({
              ensDomain: CONSTANTS.ENS_DOMAIN,
              chainId: 1,
              username: username,
            });
            window.location.reload();
          }}
        >
          {isRevokeSubnamePending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <>
              Revoke <TrashIcon className="size-4" />
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default RevokeSubnameCard;
