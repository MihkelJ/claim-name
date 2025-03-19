import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { getOpcodeString } from '@/hooks/useFollowAddress';
import {
  extractAddressAndTag,
  getPendingTxListOps,
  truncateAddress,
  useTransactions,
} from 'ethereum-identity-kit';
import { MdPerson } from 'react-icons/md';
import { isAddress } from 'viem';

const ViewPendingTransactionsCard = () => {
  const { setTxModalOpen, pendingTxs } = useTransactions();

  if (pendingTxs.length === 0) return null;

  return (
    <Card className="animate-fade-in">
      <CardHeader className="pb-6">
        <CardTitle className="text-base">Pending Transactions</CardTitle>
      </CardHeader>

      {getPendingTxListOps(pendingTxs).length > 0 && (
        <CardContent>
          {getPendingTxListOps(pendingTxs).map((tx) => {
            const { address } = extractAddressAndTag(tx.data);

            if (!address || !isAddress(address)) return null;

            return (
              <div
                key={address}
                className="flex items-center gap-2 justify-between"
              >
                <div className="flex items-center gap-2 text-lg">
                  <MdPerson />
                  {truncateAddress(address)}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  {getOpcodeString(tx.opcode)}
                </div>
              </div>
            );
          })}
        </CardContent>
      )}

      {pendingTxs.length > 0 && (
        <CardFooter className="flex justify-end">
          <Button
            size="sm"
            onClick={() => setTxModalOpen(true)}
          >
            Confirm {pendingTxs.length} Changes
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default ViewPendingTransactionsCard;
