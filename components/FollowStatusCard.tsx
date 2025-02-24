import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import CONSTANTS from '@/constants';
import { QRCodeSVG } from 'qrcode.react';
import { FiLoader, FiShare, FiX } from 'react-icons/fi';
import { MdVerified } from 'react-icons/md';
import { Address } from 'viem';

interface FollowStatusCardProps {
  isLoading: boolean;
  isFollowing?: boolean;
  address?: Address;
}

export function FollowStatusCard({ isLoading, isFollowing, address }: FollowStatusCardProps) {
  const followProtocolUrl = `https://ethfollow.xyz/${address}`;

  const handleFollowShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Follow on Ethereum Follow Protocol',
          text: 'Follow this account to become a member',
          url: followProtocolUrl,
        });
      } catch {
        // User cancelled or share failed, fall back to opening the URL
        window.open(followProtocolUrl, '_blank', 'noopener,noreferrer');
      }
    } else {
      // Share API not supported, fall back to opening the URL
      window.open(followProtocolUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="space-y-4">
      <Card className="animate-fade-in">
        <CardHeader className="pb-6">
          <div className="flex justify-between items-center">
            <CardTitle className="text-base">Verified Member</CardTitle>
            {isLoading ? (
              <FiLoader className="size-6 animate-spin" />
            ) : isFollowing ? (
              <MdVerified className="size-6 text-blue-500" />
            ) : (
              <FiX className="size-6 text-red-500" />
            )}
          </div>
        </CardHeader>
      </Card>

      {!isLoading && !isFollowing && (
        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle>Follow Required</CardTitle>
            <CardDescription>
              {CONSTANTS.ENS_DOMAIN} needs to follow this account on Ethereum Follow Protocol to
              become a member. Scan the QR code below or click the button to follow.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center gap-4">
              <div className="bg-white p-4 rounded-lg w-full flex justify-center">
                <QRCodeSVG
                  value={followProtocolUrl}
                  size={300}
                  className="w-full h-auto max-w-[300px]"
                />
              </div>
              <Button
                onClick={handleFollowShare}
                className="w-full sm:w-auto"
              >
                <FiShare className="mr-2" />
                Open or Share Follow Page
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
