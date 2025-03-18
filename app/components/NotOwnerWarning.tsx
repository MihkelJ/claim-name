import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CONSTANTS from '@/constants';

export function NotOwnerWarning() {
  return (
    <Card className="animate-fade-in">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Share this to {CONSTANTS.ENS_DOMAIN}</CardTitle>
      </CardHeader>

      <CardContent className="pt-0">
        <p>
          Please share this to the {CONSTANTS.ENS_DOMAIN} administrator to manage your subdomain
          membership.
        </p>
      </CardContent>
    </Card>
  );
}
