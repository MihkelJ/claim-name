'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useFollowAddress } from '@/hooks/useFollowAddress';
import { Scanner } from '@yudiel/react-qr-scanner';
import { Check, QrCode, X } from 'lucide-react';
import { useState } from 'react';
import { isAddress } from 'viem';

export function FollowAddressCard() {
  const { followAddress } = useFollowAddress();
  const [scannerActive, setScannerActive] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  const toggleScanner = () => {
    setScannerActive(!scannerActive);
    setShowFeedback(false);
  };

  const handleQrScan = (scannedString: string) => {
    // Good if it's just an address
    if (isAddress(scannedString)) {
      followAddress(scannedString);
    }

    // Good if it's a URL - `${window.location.origin}/${address}`
    if (scannedString.startsWith(`${window.location.origin}/`)) {
      const address = scannedString.split('/').pop();
      if (address && isAddress(address)) {
        followAddress(address);
      }
    }

    // TODO: handle other cases
    setShowFeedback(true);
    setTimeout(() => setShowFeedback(false), 1500);
  };

  return (
    <Card className="animate-fade-in">
      <CardHeader className="pb-6">
        <div className="flex justify-between items-center">
          <CardTitle className="text-base">Scan QR Code</CardTitle>
          <Button
            variant="outline"
            size="icon"
            onClick={toggleScanner}
            aria-label={scannerActive ? 'Disable QR scanner' : 'Enable QR scanner'}
          >
            {scannerActive ? <X className="h-4 w-4" /> : <QrCode className="h-4 w-4" />}
          </Button>
        </div>
      </CardHeader>

      {scannerActive && (
        <CardContent>
          <div className="w-full h-full aspect-square">
            <Scanner onScan={(result) => handleQrScan(result[0].rawValue)} />
          </div>
        </CardContent>
      )}

      {showFeedback && (
        <CardContent>
          <div className="flex items-center gap-2 p-2 bg-green-100 dark:bg-green-900/20 rounded-lg text-green-700 dark:text-green-300">
            <Check className="h-4 w-4" />
            <span className="text-sm">Added!</span>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
