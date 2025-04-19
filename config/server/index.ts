import CONSTANTS from '@/constants';
import { primaryName } from '@justaname.id/hybrid-primary-name';
import { JustaName } from '@justaname.id/sdk';
import { createPublicClient, http } from 'viem';
import { mainnet } from 'viem/chains';

// Only for server actions
export const justanameClient = JustaName.init({
  networks: [
    {
      chainId: mainnet.id,
      providerUrl: CONSTANTS.MAINNET_RPC_URL,
    },
  ],
  ensDomains: [
    {
      ensDomain: CONSTANTS.ENS_DOMAIN,
      apiKey: CONSTANTS.ENS_API_KEY,
      chainId: mainnet.id,
    },
  ],
});

export const privateClient = createPublicClient({
  chain: mainnet,
  transport: http(CONSTANTS.MAINNET_RPC_URL),
}).extend(primaryName());
