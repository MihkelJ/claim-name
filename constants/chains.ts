import { base } from 'viem/chains';
import { gnosis } from 'viem/chains';
import { arbitrum, optimism } from 'viem/chains';
import { polygon } from 'viem/chains';
import { mainnet } from 'viem/chains';

export const CHAIN_SHORT_NAMES = {
  eth: 1,
  oeth: 10,
  op: 10,
  bsc: 56,
  pol: 137,
  gno: 100,
  arb1: 42161,
  base: 8453,
} as const;

export const SUPPORTED_CHAINS = [mainnet, polygon, arbitrum, optimism, gnosis, base] as const;
