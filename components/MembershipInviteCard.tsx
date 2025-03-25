import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import CONSTANTS from '@/constants';
import { QRCodeSVG } from 'qrcode.react';
import { useState } from 'react';
import { FiCopy } from 'react-icons/fi';
import { Address } from 'viem';

interface MembershipInviteCardProps {
  address?: Address;
}

const MembershipInviteCard = ({ address }: MembershipInviteCardProps) => {
  const [copied, setCopied] = useState(false);
  const followProtocolUrl = `${window.location.origin}/${address}`;
  const isMembersOnly = CONSTANTS.MEMBERS_ONLY;

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
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle>{isMembersOnly ? 'Follow Required' : 'Get verified'}</CardTitle>
        <CardDescription>
          {isMembersOnly
            ? `${CONSTANTS.ENS_DOMAIN} needs to follow this account on Ethereum Follow Protocol to become a member. Scan the QR code below or click the button to follow.`
            : `Share QR or link with your community lead to get verified`}
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
  );
};

export default MembershipInviteCard;
