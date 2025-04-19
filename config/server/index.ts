import CONSTANTS from '@/constants';
import { JustaName } from '@justaname.id/sdk';
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
