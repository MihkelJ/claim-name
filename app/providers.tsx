'use client';

import CONSTANTS from '@/constants';
import { JustaNameProvider, JustaNameProviderConfig } from '@justaname.id/react';
import { connectorsForWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';
import {
  argentWallet,
  braveWallet,
  coinbaseWallet,
  imTokenWallet,
  injectedWallet,
  ledgerWallet,
  metaMaskWallet,
  okxWallet,
  phantomWallet,
  rabbyWallet,
  safeWallet,
  trustWallet,
  walletConnectWallet,
} from '@rainbow-me/rainbowkit/wallets';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TransactionModal, TransactionProvider } from 'ethereum-identity-kit';
import 'ethereum-identity-kit/css';
import { ThemeProvider } from 'next-themes';
import { createConfig, http, WagmiProvider } from 'wagmi';
import { base, mainnet, sepolia } from 'wagmi/chains';

export const queryClient = new QueryClient();

const connectors = connectorsForWallets(
  [
    {
      groupName: 'Suggested',
      wallets: [coinbaseWallet],
    },

    {
      groupName: 'Other',
      wallets: [
        rabbyWallet,
        phantomWallet,
        walletConnectWallet,
        injectedWallet,
        metaMaskWallet,
        trustWallet,
        ledgerWallet,
        okxWallet,
        braveWallet,
        argentWallet,
        safeWallet,
        imTokenWallet,
      ],
    },
  ],
  {
    appName: CONSTANTS.APP_NAME,
    projectId: CONSTANTS.WALLET_CONNECT_PROJECT_ID,
  },
);

const config = createConfig({
  chains: [mainnet, sepolia, base],
  transports: {
    [mainnet.id]: http(),
    [base.id]: http(),
    [sepolia.id]: http(),
  },
  connectors,
  ssr: true,
});

const justaNameConfig: JustaNameProviderConfig = {
  networks: [
    {
      chainId: mainnet.id,
      providerUrl: CONSTANTS.MAINNET_RPC_URL,
    },
  ],
  ensDomains: [
    {
      chainId: mainnet.id,
      ensDomain: CONSTANTS.ENS_DOMAIN,
    },
  ],
  config: {
    domain: CONSTANTS.APP_DOMAIN,
    origin: CONSTANTS.APP_ORIGIN,
    subnameChallengeTtl: 10 * 60 * 1000, // 10 minutes
  },
};

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider modalSize="compact">
          <JustaNameProvider config={justaNameConfig}>
            <ThemeProvider
              attribute="class"
              enableSystem
              disableTransitionOnChange
            >
              <TransactionProvider batchTransactions={true}>
                <TransactionModal />
                {children}
              </TransactionProvider>
            </ThemeProvider>
          </JustaNameProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
