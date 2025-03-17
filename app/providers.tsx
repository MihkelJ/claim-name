'use client';

import CONSTANTS from '@/constants';
import { JustaNameProvider, JustaNameProviderConfig } from '@justaname.id/react';
import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TransactionProvider } from 'ethereum-identity-kit';
import 'ethereum-identity-kit/css';
import { ThemeProvider } from 'next-themes';
import { createConfig, http, WagmiProvider } from 'wagmi';
import { mainnet, sepolia } from 'wagmi/chains';

export const queryClient = new QueryClient();

const { connectors } = getDefaultWallets({
  appName: CONSTANTS.APP_NAME,
  projectId: CONSTANTS.WALLET_CONNECT_PROJECT_ID,
});

const config = createConfig({
  chains: [mainnet, sepolia],
  transports: {
    [mainnet.id]: http(),
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
              <TransactionProvider>{children}</TransactionProvider>
            </ThemeProvider>
          </JustaNameProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
