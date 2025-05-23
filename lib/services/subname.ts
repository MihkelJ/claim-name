import { justanameClient } from '@/config/server';
import CONSTANTS from '@/constants';
import { FollowerState, SubnameRoot } from '@/types/subname';
import assert from 'assert';
import { mainnet } from 'viem/chains';

/**
 * Checks if a user follows the top domain
 */
export async function fetchFollowerState(
  userAddress?: string,
  followedAddress?: string,
): Promise<FollowerState> {
  assert(userAddress, 'Address is required');
  assert(followedAddress, 'Address of members source is required');

  const url = new URL(
    `https://api.ethfollow.xyz/api/v1/users/${userAddress}/${followedAddress}/followerState`,
  );
  url.searchParams.append('cache', 'fresh');

  const response = await fetch(url.toString());

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to fetch follower state: ${response.status} ${errorText}`);
  }

  return (await response.json()) as FollowerState;
}

/**
 * Gets the subdomains for a given address
 */
export async function getFollowerSubdomains(address?: string): Promise<SubnameRoot> {
  assert(Boolean(address), 'Address is required');

  const response = await fetch(
    `https://api.justaname.id/ens/v1/subname/address?address=${address}&chainId=${mainnet.id}&cache=fresh`,
  );

  return response.json();
}

/**
 * Checks if a user already has a subname registered
 */
export async function checkExistingSubname(address: string): Promise<boolean> {
  const subnames = await justanameClient.subnames.getSubnamesByAddress({
    address: address,
    chainId: mainnet.id,
    coinType: 60,
    isClaimed: true,
  });

  return subnames.subnames.some((sub) => sub.ens.endsWith(CONSTANTS.ENS_DOMAIN));
}

/**
 * Registers a new subname
 */
export async function registerSubname(params: {
  username: string;
  message: string;
  signature: string;
  address: string;
  text?: Record<string, string>;
  addresses?: Record<string, string>;
  contentHash?: string;
}) {
  const { username, message, signature, address, text, addresses, contentHash } = params;

  return await justanameClient.subnames.addSubname(
    {
      username,
      chainId: mainnet.id,
      text,
      addresses,
      contentHash,
    },
    {
      xSignature: signature,
      xAddress: address,
      xMessage: message,
    },
  );
}

/**
 * Revokes a subname
 */
export async function revokeSubname(params: {
  username: string;
  message: string;
  signature: string;
  address: string;
}): Promise<{ success: boolean; message: string }> {
  const { username, message, signature, address } = params;

  try {
    const response = await justanameClient.subnames.revokeSubname(
      {
        username,
        chainId: mainnet.id,
      },
      {
        xSignature: signature,
        xAddress: address,
        xMessage: message,
      },
    );

    return {
      success: true,
      message: 'Subname successfully revoked',
      ...response,
    };
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Failed to revoke subname');
  }
}
