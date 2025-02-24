import { useBaseForm } from '@/lib/utils/useBaseForm';
import { useRecords, useUpdateSubname } from '@justaname.id/react';
import { useMutation } from '@tanstack/react-query';
import { useEffect } from 'react';
import { z } from 'zod';

const subnameKeysSchema = z.object({
  avatarKey: z.string().url('Avatar must be a valid URL').optional(),
  displayKey: z.string().optional(),
});

type SubnameKeysFormData = z.infer<typeof subnameKeysSchema>;

export function useSubnameKeysForm({ ens }: { ens: string }) {
  const { updateSubname } = useUpdateSubname();
  const { records, isRecordsFetching } = useRecords({
    ens,
  });

  const { form, handleError } = useBaseForm<SubnameKeysFormData>({
    schema: subnameKeysSchema,
    defaultValues: {
      avatarKey: '',
      displayKey: '',
    },
  });

  useEffect(() => {
    if (records) {
      form.setValue('avatarKey', records.sanitizedRecords.avatar);
      form.setValue('displayKey', records.sanitizedRecords.display);
    }
  }, [form, records]);

  const mutation = useMutation({
    mutationFn: async (data: SubnameKeysFormData) => {
      const text: Record<string, string> = {};
      if (data.displayKey) text.display = data.displayKey;
      if (data.avatarKey) text.avatar = data.avatarKey;

      await updateSubname({
        ens,
        text,
      });
    },
    onError: handleError,
  });

  const handleSubmit = form.handleSubmit((data) => mutation.mutate(data));

  return {
    form,
    isSubmitting: mutation.isPending,
    isRecordsFetching,
    error: form.formState.errors.root?.message,
    handleSubmit,
  };
}
