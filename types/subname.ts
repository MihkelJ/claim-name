export interface FollowerState {
  addressUser: string;
  addressFollower: string;
  state: {
    follow: boolean;
    block: boolean;
    mute: boolean;
  };
}

export interface SubnameRoot {
  statusCode: number;
  result: {
    data: {
      subnames: Subname[];
    };
    error: Error;
  };
}

export interface Subname {
  ens: string;
  records: {
    texts: { key: string; value: string }[];
    coins: { id: number; value: string; name: string }[];
    contentHash: string;
    resolverAddress: string;
  };
  claimedAt: string;
  isClaimed: boolean;
  isJAN: boolean;
}
