import { MultiSelect, MultiSelectProps } from './ui/multi-select';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import CONSTANTS from '@/constants';
import { useSubnameKeysForm } from '@/hooks/useSubnameKeysForm';
import type { Subname } from '@/types/subname';
import { getChain, tokenlist } from '@yodlpay/tokenlists';
import Image from 'next/image';
import { useEffect, useMemo } from 'react';
import { FiLoader, FiSave } from 'react-icons/fi';

interface SubnameManagementFormProps {
  existingSubname: Subname;
}

export function SubnameManagementForm({ existingSubname }: SubnameManagementFormProps) {
  const {
    form: subnameKeysForm,
    handleSubmit: handleSubnameKeysUpdate,
    isSubmitting: isUpdatingSubnameKeys,
    error: subnameKeysError,
    isRecordsFetching: isLoadingSubnameRecords,
  } = useSubnameKeysForm({ ens: existingSubname?.ens });

  const visibleTokens = useMemo(() => {
    // First, filter tokens by enabled symbols and chains
    const filteredTokens = tokenlist.filter((token) => {
      // Check if token symbol is enabled
      const isSymbolEnabled =
        CONSTANTS.ENABLED_TOKEN_SYMBOLS.length > 0 &&
        CONSTANTS.ENABLED_TOKEN_SYMBOLS.includes(token.symbol);

      // Check if chain ID is enabled
      const isChainEnabled =
        CONSTANTS.ENABLED_CHAIN_IDS.length > 0 &&
        CONSTANTS.ENABLED_CHAIN_IDS.includes(token.chainId.toString());

      return isSymbolEnabled && isChainEnabled;
    });

    // Then handle duplicates by keeping only one token per symbol
    // (preferring the first occurrence of each symbol)
    const symbolMap = new Map();
    return filteredTokens.filter((token) => {
      if (symbolMap.has(token.symbol)) return false;
      symbolMap.set(token.symbol, true);
      return true;
    });
  }, []);

  const selectableChains = useMemo<MultiSelectProps['options']>(() => {
    // Get unique chain IDs first
    const uniqueChainIds = [...new Set(tokenlist.map((token) => token.chainId))];

    // Filter by enabled chain IDs
    const filteredChainIds = uniqueChainIds.filter(
      (chainId) =>
        CONSTANTS.ENABLED_CHAIN_IDS.length === 0 ||
        CONSTANTS.ENABLED_CHAIN_IDS.includes(chainId.toString()),
    );

    return filteredChainIds
      .map(getChain)
      .filter((chain): chain is NonNullable<typeof chain> => chain?.logoUri != null)
      .map((chain) => ({
        label: chain.chainName,
        value: chain.chainId.toString(),
        icon: function ChainIcon({ className }: { className?: string }) {
          return (
            <Image
              src={chain.logoUri}
              alt={chain.chainName}
              width={20}
              height={20}
              className={className}
            />
          );
        },
      }));
  }, []);

  useEffect(() => {
    if (selectableChains.length === 1) {
      const singleChainValue = selectableChains[0].value;
      subnameKeysForm.setValue('chains', [Number(singleChainValue)]);
    } else if (selectableChains.length > 1) {
      // Set initial value to all chains
      const allChainValues = selectableChains.map((chain) => Number(chain.value));
      subnameKeysForm.setValue('chains', allChainValues);
    }
  }, [selectableChains, subnameKeysForm]);

  const selectedTokens = subnameKeysForm.watch('tokens') || [];
  const selectedChains = subnameKeysForm.watch('chains') || [];

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle>Payment Preferences</CardTitle>
        <CardDescription>
          Configure which tokens you&apos;d like to receive for {existingSubname?.ens}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubnameKeysUpdate}>
          <div className="space-y-4">
            {selectableChains.length > 1 && (
              <MultiSelect
                options={selectableChains}
                value={selectedChains.map(String)}
                onValueChange={(value) => {
                  // If no chains are selected, use all chains
                  const chainsToUse =
                    value.length === 0 ? selectableChains.map((chain) => chain.value) : value;
                  subnameKeysForm.setValue('chains', chainsToUse.map(Number));
                }}
                searchable={false}
                loading={isLoadingSubnameRecords}
                disabled={isLoadingSubnameRecords}
              />
            )}
            <div className="flex flex-col gap-3">
              {visibleTokens.map((token) => (
                <TokenListItem
                  key={token.address}
                  tokenInfo={token}
                  isSelected={selectedTokens.includes(token.symbol)}
                  onClick={(symbol) => {
                    const currentTokens = [...selectedTokens];
                    if (currentTokens.includes(symbol)) {
                      subnameKeysForm.setValue(
                        'tokens',
                        currentTokens.filter((t) => t !== symbol),
                      );
                    } else {
                      subnameKeysForm.setValue('tokens', [...currentTokens, symbol]);
                    }
                  }}
                />
              ))}
            </div>

            {subnameKeysError && <p className="text-sm text-red-500">{subnameKeysError}</p>}

            <Button
              type="submit"
              className="w-full"
              disabled={isUpdatingSubnameKeys || isLoadingSubnameRecords}
            >
              {isUpdatingSubnameKeys || isLoadingSubnameRecords ? (
                <FiLoader className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <FiSave className="w-4 h-4 mr-2" />
              )}
              {isUpdatingSubnameKeys
                ? 'Submitting...'
                : isLoadingSubnameRecords
                  ? 'Loading...'
                  : 'Submit Changes'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

const TokenListItem = ({
  isSelected = false,
  onClick = () => {},
  tokenInfo,
  imageSize = 28,
}: {
  isSelected?: boolean;
  onClick?: (symbol: string) => void;
  tokenInfo: (typeof tokenlist)[number];
  imageSize?: number;
}) => {
  const tokenChains = useMemo(() => {
    return [
      ...new Set(
        tokenlist
          .filter((token) => token.symbol === tokenInfo.symbol)
          .map((token) => token.chainId)
          .map(getChain),
      ),
    ];
  }, [tokenInfo.symbol]);

  return (
    <Card
      className={`cursor-pointer transition-all py-2.5 px-4 duration-150 no-scrollbar ${isSelected ? 'ring-1 ring-violet-500 shadow-md' : 'hover:shadow-md'}`}
      onClick={() => onClick(tokenInfo.symbol)}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Image
            width={imageSize}
            height={imageSize}
            src={tokenInfo.logoUri!}
            alt={`${tokenInfo.name} logo`}
            className="rounded-full shadow-sm"
          />
          <div className="flex flex-col">
            <p className="text-base font-medium leading-tight">{tokenInfo.name}</p>
            <p className="text-sm text-gray-500">{tokenInfo.symbol}</p>
          </div>
        </div>

        <div className="flex -space-x-2">
          {tokenChains.map((chain) => {
            if (!chain?.logoUri) return null;
            return (
              <Image
                key={chain.chainId}
                src={chain.logoUri}
                alt={`${chain.chainName} logo`}
                width={20}
                height={20}
                className="rounded-full border border-white"
              />
            );
          })}
        </div>
      </div>
    </Card>
  );
};
