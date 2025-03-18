'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useFollowAddress } from '@/hooks/useFollowAddress';
import { Scanner } from '@yudiel/react-qr-scanner';
import { QrCode, X } from 'lucide-react';
import { useState } from 'react';

export function FollowAddressCard() {
  const { followAddress } = useFollowAddress();
  const [scannerActive, setScannerActive] = useState(false);

  const toggleScanner = () => {
    setScannerActive(!scannerActive);
  };

  const handleQrScan = (address: string) => {
    followAddress(address);
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
    </Card>
  );
}
