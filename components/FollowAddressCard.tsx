'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useFollowAddress } from '@/hooks/useFollowAddress';
import { Scanner } from '@yudiel/react-qr-scanner';
import { Check, QrCode, X } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import { isAddress } from 'viem';

export function FollowAddressCard() {
  const { followAddress } = useFollowAddress();
  const [isQrScannerActive, setIsQrScannerActive] = useState(false);
  const [feedbackStatus, setFeedbackStatus] = useState({
    isVisible: false,
    isSuccessful: true,
  });

  // Memoize feedback styles to prevent recalculation on each render
  const feedbackStyleOptions = useMemo(
    () => ({
      successStyle: 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300',
      errorStyle: 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300',
    }),
    [],
  );

  const toggleQrScanner = useCallback(() => {
    setIsQrScannerActive((prevState) => !prevState);
    setFeedbackStatus((prevState) => ({ ...prevState, isVisible: false }));
  }, []);

  const displayTemporaryFeedback = useCallback((isSuccessful: boolean) => {
    setFeedbackStatus({ isVisible: true, isSuccessful });

    // Clear feedback after delay
    const feedbackTimeoutId = setTimeout(() => {
      setFeedbackStatus((prevState) => ({ ...prevState, isVisible: false }));
    }, 1500);

    // Clean up timeout if component unmounts
    return () => clearTimeout(feedbackTimeoutId);
  }, []);

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

      displayTemporaryFeedback(isAddressFound);
    },
    [followAddress, displayTemporaryFeedback],
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
          <div className="w-full h-full aspect-square">
            <Scanner onScan={(result) => handleQrCodeScan(result[0].rawValue)} />
          </div>
        </CardContent>
      )}

      {feedbackStatus.isVisible && (
        <CardContent>
          <div
            className={`flex items-center gap-2 p-2 rounded-lg ${
              feedbackStatus.isSuccessful
                ? feedbackStyleOptions.successStyle
                : feedbackStyleOptions.errorStyle
            }`}
          >
            {feedbackStatus.isSuccessful ? (
              <Check className="h-4 w-4" />
            ) : (
              <X className="h-4 w-4" />
            )}
            <span className="text-sm">
              {feedbackStatus.isSuccessful ? 'Address added!' : 'Invalid QR code'}
            </span>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
