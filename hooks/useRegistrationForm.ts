import CONSTANTS from '@/constants';
import { usernameSchema } from '@/lib/schemas/username';
import { useBaseForm } from '@/lib/utils/useBaseForm';
import { useAddSubname, useIsSubnameAvailable } from '@justaname.id/react';
import { useDebounce } from '@uidotdev/usehooks';
import { z } from 'zod';

const registrationSchema = z.object({
  username: usernameSchema,
});

type RegistrationFormData = z.infer<typeof registrationSchema>;

export function useRegistrationForm() {
  const { addSubname } = useAddSubname();

  const { form, handleError } = useBaseForm<RegistrationFormData>({
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
      await addSubname({
        ensDomain: CONSTANTS.ENS_DOMAIN,
        username: data.username.toLowerCase(),
      });
      window.location.reload();
    } catch (error) {
      handleError(error);
    }
  });

  return {
    form,
    isSubmitting: form.formState.isSubmitting,
    error: form.formState.errors.username?.message,
    handleSubmit,
    isSubnameAvailable,
    debouncedUsername,
  };
}
