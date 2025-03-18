import { listOpAddListRecord, useTransactions } from 'ethereum-identity-kit';
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

export function useFollowAddress() {
  const { address: connectedAddress } = useAccount();
  const { addListOpsTransaction, pendingTxs } = useTransactions();

  const followAddress = (address: string) => {
    if (!isAddress(address)) throw new Error('Invalid address');
    if (!connectedAddress) throw new Error('No connected address');

    addListOpsTransaction([listOpAddListRecord(address)]);
  };

  return {
    followAddress,
    pendingTxs,
  };
}
