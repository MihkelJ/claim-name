import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import CONSTANTS from '@/constants';
import { QRCodeSVG } from 'qrcode.react';
import { useState } from 'react';
import { FiCopy, FiLoader, FiX } from 'react-icons/fi';
import { MdVerified } from 'react-icons/md';
import { Address } from 'viem';

interface FollowStatusCardProps {
  isLoading: boolean;
  isFollowing?: boolean;
  address?: Address;
}

const ViewFollowStatusCard = ({ isLoading, isFollowing, address }: FollowStatusCardProps) => {
  const [copied, setCopied] = useState(false);
  const followProtocolUrl = `${window.location.origin}/${address}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(followProtocolUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="space-y-4">
      <Card className="animate-fade-in">
        <CardHeader className="pb-6">
          <div className="flex justify-between items-center">
            <CardTitle className="text-base">
              {isLoading ? 'Checking Membership' : isFollowing ? 'Verified Member' : 'Not a Member'}
            </CardTitle>
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

              <div className="flex gap-2 w-full mx-auto justify-center">
                <Button
                  onClick={handleCopyLink}
                  variant="outline"
                  className="min-w-[44px]"
                >
                  <FiCopy className={copied ? 'text-green-500' : ''} />
                  {copied ? 'Copied!' : 'Copy Link'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ViewFollowStatusCard;
