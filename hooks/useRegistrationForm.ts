import CONSTANTS from '@/constants';
import { SUPPORTED_CHAINS } from '@/constants/chains';
import { usernameSchema } from '@/lib/schemas/username';
import { useBaseForm } from '@/lib/utils/useBaseForm';
import { useAddSubname, useIsSubnameAvailable } from '@justaname.id/react';
import { useDebounce } from '@uidotdev/usehooks';
import { mainnet } from 'viem/chains';
import { z } from 'zod';

const registrationSchema = z.object({
  username: usernameSchema,
});

type RegistrationFormData = z.infer<typeof registrationSchema>;

export function useRegistrationForm() {
  const { addSubname } = useAddSubname();

  const { form, handleError, error } = useBaseForm<RegistrationFormData>({
    schema: registrationSchema,
    defaultValues: {
      username: undefined,
    },
  });

  const username = form.watch('username');
  const debouncedUsername = useDebounce(username, 500);

  const isSubnameAvailable = useIsSubnameAvailable({
    username: debouncedUsername,
  });

  const handleSubmit = form.handleSubmit(async (data) => {
    try {
      const textConfig: Record<string, string> = {};

      // Only add me.yodl config if either chains or tokens are available
      if (CONSTANTS.ENABLED_CHAIN_IDS.length > 0 || CONSTANTS.ENABLED_TOKEN_SYMBOLS.length > 0) {
        const yodlConfig: Record<string, string> = {};

        if (
          CONSTANTS.ENABLED_CHAIN_IDS.length > 0 &&
          CONSTANTS.ENABLED_CHAIN_IDS.length !== Object.values(SUPPORTED_CHAINS).length
        ) {
          yodlConfig.chains = CONSTANTS.ENABLED_CHAIN_IDS.join(',');
        } else {
        }

        if (CONSTANTS.ENABLED_TOKEN_SYMBOLS.length > 0) {
          yodlConfig.tokens = CONSTANTS.ENABLED_TOKEN_SYMBOLS.join(',');
        }

        textConfig['me.yodl'] = JSON.stringify(yodlConfig);
      }

      await addSubname({
        ensDomain: CONSTANTS.ENS_DOMAIN,
        username: data.username.toLowerCase(),
        text: textConfig,
        chainId: mainnet.id,
      });
      window.location.reload();
    } catch (error) {
      handleError(error);
    }
  });

  return {
    form,
    isSubmitting: form.formState.isSubmitting,
    error: form.formState.errors.username?.message || error,
    handleSubmit,
    isSubnameAvailable,
    debouncedUsername,
  };
}
