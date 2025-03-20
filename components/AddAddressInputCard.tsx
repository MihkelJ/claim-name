'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useFollowAddress } from '@/hooks/useFollowAddress';
import { Scanner } from '@yudiel/react-qr-scanner';
import { QrCode, X } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { isAddress } from 'viem';

const AddAddressInputCard = () => {
  const { followAddress } = useFollowAddress();

  const [address, setAddress] = useState('');
  const [error, setError] = useState('');
  const [isQrScannerActive, setIsQrScannerActive] = useState(false);
  const [scanResult, setScanResult] = useState({
    isScanned: false,
    isSuccessful: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (!isAddress(address)) {
        setError('Invalid Ethereum address');
        return;
      }

      followAddress(address);
      setAddress(''); // Clear input after successful submission
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to follow address');
    }
  };

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
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-base">Follow Address</CardTitle>
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

      {isQrScannerActive ? (
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
      ) : (
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Enter an Ethereum address or scan a QR code to add them as a member.
          </p>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-2"
          >
            <div className="flex gap-2">
              <Input
                placeholder="Enter Ethereum address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className={error ? 'border-red-500' : ''}
                autoComplete="off"
              />
              <Button type="submit">Follow</Button>
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
          </form>
        </CardContent>
      )}
    </Card>
  );
};

export default AddAddressInputCard;
