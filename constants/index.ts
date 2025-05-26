import { SUPPORTED_CHAINS } from './chains';

const ENABLED_TOKEN_SYMBOLS = process.env.NEXT_PUBLIC_ENABLED_TOKEN_SYMBOLS?.split(',') || [];

if (ENABLED_TOKEN_SYMBOLS === undefined) {
  throw new Error('NEXT_PUBLIC_ENABLED_TOKEN_SYMBOLS is not set');
}

const CONSTANTS = {
  APP_NAME: process.env.NEXT_PUBLIC_APP_NAME!,
  WALLET_CONNECT_PROJECT_ID: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID!,

  APP_DOMAIN: process.env.NEXT_PUBLIC_APP_DOMAIN!,
  APP_ORIGIN: process.env.NEXT_PUBLIC_APP_ORIGIN!,

  ENS_DOMAIN: process.env.NEXT_PUBLIC_ENS_DOMAIN!,
  ENS_API_KEY: process.env.NEXT_PUBLIC_ENS_API_KEY!,

  MAINNET_RPC_URL: process.env.NEXT_PUBLIC_MAINNET_RPC_URL || 'https://eth.blockrazor.xyz',

  MEMBERS_ONLY: process.env.NEXT_PUBLIC_MEMBERS_ONLY === 'true',

  ENABLED_TOKEN_SYMBOLS: process.env.NEXT_PUBLIC_ENABLED_TOKEN_SYMBOLS?.split(',') || [],
  ENABLED_CHAIN_IDS:
    process.env.NEXT_PUBLIC_ENABLED_CHAIN_IDS?.split(',') ||
    Object.values(SUPPORTED_CHAINS).map((chain) => chain.id.toString()),

  COMMUNITY_CONFIG_RECORD_KEY: 'me.yodl.community',
};

export default CONSTANTS;
