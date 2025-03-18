import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAccountModal } from '@rainbow-me/rainbowkit';
import { IoWalletOutline } from 'react-icons/io5';

interface WalletCardProps {
  address: string;
  isOwner: boolean;
}

export function WalletCard({ address, isOwner }: WalletCardProps) {
  const { openAccountModal } = useAccountModal();

  return (
    <Card
      className="animate-fade-in cursor-pointer hover:bg-secondary/50 transition-colors"
      onClick={openAccountModal}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Wallet Connection</CardTitle>
          <IoWalletOutline className="h-3.5 w-3.5 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Connected:</span>
            <span className="text-xs font-mono bg-secondary px-2 py-1 rounded-md">
              {`${address.slice(0, 6)}...${address.slice(-4)}`}
            </span>
            {isOwner && (
              <Badge
                variant="success"
                className="text-xs"
              >
                Owner
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
