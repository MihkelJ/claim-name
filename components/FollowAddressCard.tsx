'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useFollowAddress } from '@/hooks/useFollowAddress';
import { Scanner } from '@yudiel/react-qr-scanner';
import { QrCode, X } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { isAddress } from 'viem';

const AddressQRScanner = () => {
  const { followAddress } = useFollowAddress();
  const [isQrScannerActive, setIsQrScannerActive] = useState(false);
  const [scanResult, setScanResult] = useState({
    isScanned: false,
    isSuccessful: false,
  });

  // Reset scan result when scanner is toggled
  const toggleQrScanner = useCallback(() => {
    setIsQrScannerActive((prevState) => !prevState);
    setScanResult({ isScanned: false, isSuccessful: false });
  }, []);

  // Reset scan result after a delay
  useEffect(() => {
    if (scanResult.isScanned) {
      const resetTimeoutId = setTimeout(() => {
        setScanResult((prevState) => ({ ...prevState, isScanned: false }));
      }, 1500);

      return () => clearTimeout(resetTimeoutId);
    }
  }, [scanResult.isScanned]);

  const handleQrCodeScan = useCallback(
    (scannedContent: string) => {
      let isAddressFound = false;

      // Case 1: Direct Ethereum address
      if (isAddress(scannedContent)) {
        followAddress(scannedContent);
        isAddressFound = true;
      }
      // Case 2: URL with address as last path segment
      else if (scannedContent.startsWith(`${window.location.origin}/`)) {
        const extractedAddress = scannedContent.split('/').pop();
        if (extractedAddress && isAddress(extractedAddress)) {
          followAddress(extractedAddress);
          isAddressFound = true;
        }
      }
      // Case 3: Handle other potential formats (e.g., ENS names, etc.)
      // TODO: Implement additional address format handling

      setScanResult({ isScanned: true, isSuccessful: isAddressFound });
    },
    [followAddress],
  );

  return (
    <Card className="animate-fade-in">
      <CardHeader className="pb-6">
        <div className="flex justify-between items-center">
          <CardTitle className="text-base">Scan QR Code</CardTitle>
          <Button
            variant="outline"
            size="icon"
            onClick={toggleQrScanner}
            aria-label={isQrScannerActive ? 'Disable QR scanner' : 'Enable QR scanner'}
          >
            {isQrScannerActive ? <X className="h-4 w-4" /> : <QrCode className="h-4 w-4" />}
          </Button>
        </div>
      </CardHeader>

      {isQrScannerActive && (
        <CardContent>
          <div
            className={`w-full h-full aspect-square relative transition-all duration-300 ${
              scanResult.isScanned
                ? scanResult.isSuccessful
                  ? 'opacity-70 bg-green-100 dark:bg-green-900/20'
                  : 'opacity-70 bg-red-100 dark:bg-red-900/20'
                : ''
            }`}
          >
            <Scanner onScan={(result) => handleQrCodeScan(result[0].rawValue)} />
            {scanResult.isScanned && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="text-lg font-medium px-4 py-2 rounded-lg bg-white/80 dark:bg-black/80">
                  {scanResult.isSuccessful ? 'Address added!' : 'Invalid QR code'}
                </span>
              </div>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default AddressQRScanner;
