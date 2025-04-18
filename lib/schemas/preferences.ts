import { CHAIN_SHORT_NAMES, SUPPORTED_CHAINS } from '@/constants/chains';
import { z } from 'zod';

// TODO: move to utils
export const chainIdToShortName = (chainId: number): string | undefined => {
  const entries = Object.entries(CHAIN_SHORT_NAMES);
  const found = entries.find(([, id]) => id === chainId);
  return found ? found[0] : undefined;
};

// TODO: move to utils
export const isValidNumber = (value?: string | null | number): boolean => {
  if (!value) return false;
  const num = Number(value);

  return !isNaN(num) && value.toString().trim() !== '';
};

// TODO: move to utils
export function resolveChainIdOrShortName(chainIdOrShortName: string): number | undefined {
  if (isValidNumber(chainIdOrShortName)) {
    return Number(chainIdOrShortName);
  } else {
    const key = chainIdOrShortName.toLowerCase();
    return key in CHAIN_SHORT_NAMES
      ? CHAIN_SHORT_NAMES[key as keyof typeof CHAIN_SHORT_NAMES]
      : undefined;
  }
}

// TODO: move to utils
export const stringUtils = {
  arrayToCommaString: (array: string[] | number[]) => array.join(','),
  commaStringToArray: (commaString: string) => commaString.split(',').map((item) => item.trim()),
};

/**
 * Validates token configurations.
 * Accepts array of token symbols or comma-separated string.
 * Always returns array of strings.
 */
const TokenConfigSchema = z.preprocess((input) => {
  if (typeof input === 'string') return stringUtils.commaStringToArray(input);
  return input;
}, z.array(z.string()));

/**
 * Validates chain configurations.
 * Accepts chain IDs or short names as array or comma-separated string.
 * Returns array of valid, supported chain IDs.
 */
const ChainConfigSchema = z.preprocess(
  (input) => {
    if (Array.isArray(input)) return input;
    if (typeof input === 'string') return stringUtils.commaStringToArray(input);
    return input;
  },
  z.array(z.union([z.string(), z.number()])).transform((chains) =>
    chains
      .map((chain) => {
        if (typeof chain === 'string') {
          return resolveChainIdOrShortName(chain);
        }
        return chain;
      })
      .filter(
        (id): id is (typeof SUPPORTED_CHAINS)[number]['id'] =>
          id !== undefined && SUPPORTED_CHAINS.some((chain: { id: number }) => chain.id === id),
      ),
  ),
);

/**
 * Converts preferences object to text format for storage.
 * Formats chains and tokens as comma-separated strings.
 */
export const convertPreferencesToText = (preferences: { chains?: number[]; tokens?: string[] }) => {
  const processedChains = preferences.chains
    ?.map((chain: number) => chainIdToShortName(chain))
    .filter(Boolean) as string[];

  const formattedPreferences: Record<string, string | undefined> = {
    tokens: preferences.tokens ? stringUtils.arrayToCommaString(preferences.tokens) : undefined,
    chains:
      processedChains && processedChains.length > 0
        ? stringUtils.arrayToCommaString(processedChains)
        : undefined,
  };

  Object.keys(formattedPreferences).forEach((key) => {
    if (formattedPreferences[key] === undefined) {
      delete formattedPreferences[key];
    }
  });

  return JSON.stringify(formattedPreferences);
};

/**
 * Main schema for validating preferences.
 * Returns normalized object with chains and tokens.
 */
export const PreferencesSchema = z.preprocess(
  (input) => {
    try {
      if (typeof input === 'string' && input.trim() !== '') {
        return JSON.parse(input);
      }
      return input;
    } catch (error) {
      console.error('Failed to parse preferences JSON:', error);
      return {};
    }
  },
  z
    .object({
      chains: ChainConfigSchema.optional(),
      tokens: TokenConfigSchema.optional(),
    })
    .catchall(z.unknown())
    .transform((data) => {
      return {
        chains: data.chains ?? [],
        tokens: data.tokens ?? [],
      };
    }),
);

/**
 * Type for preferences after validation and transformation.
 */
export type Preferences = z.infer<typeof PreferencesSchema>;

/**
 * Schema for validating preferences submission.
 * Expects chain IDs as numbers and token symbols as strings.
 */
export const SubmitPreferencesSchema = z
  .object({
    chains: z
      .array(z.number())
      .transform((chains) =>
        chains.filter((id) => SUPPORTED_CHAINS.some((chain: { id: number }) => chain.id === id)),
      )
      .optional(),
    tokens: z
      .array(z.string())
      .transform((tokens) => tokens.filter((token) => token.trim() !== ''))
      .optional(),
  })
  .catchall(z.unknown());

export type SubmitPreferencesInput = z.input<typeof SubmitPreferencesSchema>;
export type SubmitPreferencesOutput = z.output<typeof SubmitPreferencesSchema>;
