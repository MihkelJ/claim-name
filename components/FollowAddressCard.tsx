'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Scanner } from '@yudiel/react-qr-scanner';
import { formatListOpsTransaction, truncateAddress, useTransactions } from 'ethereum-identity-kit';
import { QrCode, X } from 'lucide-react';
import { useState } from 'react';
import { MdPerson } from 'react-icons/md';
import { isAddress } from 'viem';
import { useAccount } from 'wagmi';

/**
 * Opcodes for list operations
 */
export const Opcode = {
  ANY: 0,
  FOLLOW: 1,
  UNFOLLOW: 2,
  TAG: 3,
  UNTAG: 4,
} as const;

export type ListOpcode = (typeof Opcode)[keyof typeof Opcode];

export function FollowAddressCard() {
  const { address: connectedAddress } = useAccount();
  const { addListOpsTransaction, setTxModalOpen, pendingTxs, nonce, selectedChainId } =
    useTransactions();

  const [scannerActive, setScannerActive] = useState(false);

  const toggleScanner = () => {
    setScannerActive(!scannerActive);
  };

  const handleQrScan = (address: string) => {
    // Remove 01010101 prefix if present
    const cleanAddress = address.replace(/^0x01010101/, '0x');

    if (!isAddress(cleanAddress)) throw new Error('Invalid address');
    if (!connectedAddress) throw new Error('No connected address');

    addListOpsTransaction(
      formatListOpsTransaction({
        listOps: [
          {
            opcode: Opcode.FOLLOW,
            data: cleanAddress,
          },
        ],
        chainId: selectedChainId,
        nonce,
        connectedAddress,
      }),
    );
  };

  return (
    <Card className="animate-fade-in">
      <CardHeader className="pb-6">
        <div className="flex justify-between items-center">
          <CardTitle className="text-base">Follow Address</CardTitle>
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

      <CardContent>
        {pendingTxs.map((tx) => {
          const address = tx.args[1][0];
          const cleanAddress = address.replace(/^0x01010101/, '0x');
          console.log(tx);
          return (
            <div
              key={cleanAddress}
              className="flex items-center gap-2 justify-between"
            >
              <div className="flex items-center gap-2 text-lg">
                <MdPerson />
                {truncateAddress(cleanAddress)}
              </div>
            </div>
          );
        })}
      </CardContent>

      <CardFooter className="flex justify-end">
        <Button onClick={() => setTxModalOpen(true)}>
          pending {pendingTxs.length} transactions
        </Button>
      </CardFooter>
    </Card>
  );
}
