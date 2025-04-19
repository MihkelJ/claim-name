import CONSTANTS from '@/constants';
import { primaryName } from '@justaname.id/hybrid-primary-name';
import { JustaName } from '@justaname.id/sdk';
import { createPublicClient, http } from 'viem';
import { mainnet } from 'viem/chains';

export const justanameClientFrontend = JustaName.init({
  networks: [
    {
      chainId: mainnet.id,
      providerUrl: CONSTANTS.MAINNET_RPC_URL,
    },
  ],
  ensDomains: [
    {
      ensDomain: CONSTANTS.ENS_DOMAIN,
      chainId: mainnet.id,
    },
  ],
});

export const publicClient = createPublicClient({
  chain: mainnet,
  transport: http(CONSTANTS.MAINNET_RPC_URL),
}).extend(primaryName());
