import { useQuery } from '@tanstack/react-query';
import { Address } from 'viem';

export interface Root {
  following: Following[];
}

export interface Following {
  version: number;
  record_type: string;
  data: string;
  address: Address;
}

const getMembers = async (addressOrEns: string) => {
  const response = await fetch(
    `https://api.ethfollow.xyz/api/v1/users/${addressOrEns}/following?cache=fresh`,
  );
  return response.json() as Promise<Root>;
};

const useMembers = (addressOrEns: string) => {
  return useQuery({
    queryKey: ['members', addressOrEns],
    queryFn: () => getMembers(addressOrEns),
  });
};

export default useMembers;
