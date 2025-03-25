import { mainnet } from 'viem/chains';

const CONSTANTS = {
  APP_NAME: process.env.NEXT_PUBLIC_APP_NAME!,
  WALLET_CONNECT_PROJECT_ID: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID!,

  APP_DOMAIN: process.env.NEXT_PUBLIC_APP_DOMAIN!,
  APP_ORIGIN: process.env.NEXT_PUBLIC_APP_ORIGIN!,

  ENS_DOMAIN: process.env.NEXT_PUBLIC_ENS_DOMAIN!,
  ENS_API_KEY: process.env.NEXT_PUBLIC_ENS_API_KEY!,

  MAINNET_RPC_URL: process.env.NEXT_PUBLIC_MAINNET_RPC_URL || mainnet.rpcUrls.default.http[0],

  MEMBERS_ONLY: process.env.NEXT_PUBLIC_MEMBERS_ONLY === 'true',
};

export default CONSTANTS;
