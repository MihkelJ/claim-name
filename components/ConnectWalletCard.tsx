import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import CONSTANTS from '@/constants';
import { useConnectModal } from '@rainbow-me/rainbowkit';

const ConnectWalletCard = () => {
  const { openConnectModal } = useConnectModal();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Get Started</CardTitle>
        <CardDescription>
          Connect your account to get your new {CONSTANTS.ENS_DOMAIN} subdomain
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button
          className="w-full"
          onClick={openConnectModal}
        >
          Connect Wallet
        </Button>
      </CardContent>
    </Card>
  );
};

export default ConnectWalletCard;
