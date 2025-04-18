import {
  PreferencesSchema,
  SubmitPreferencesInput,
  SubmitPreferencesSchema,
} from '@/lib/schemas/preferences';
import { useBaseForm } from '@/lib/utils/useBaseForm';
import { useRecords, useUpdateSubname } from '@justaname.id/react';
import { useMutation } from '@tanstack/react-query';
import { useEffect } from 'react';

export function useSubnameKeysForm({ ens }: { ens: string }) {
  const { updateSubname } = useUpdateSubname();
  // TODO: implement appending records to the form
  const { isRecordsFetching, records } = useRecords({
    ens,
  });

  const { form, handleError } = useBaseForm<SubmitPreferencesInput>({
    schema: SubmitPreferencesSchema,
    defaultValues: {
      chains: [],
      tokens: [],
    },
  });

  useEffect(() => {
    if (records) {
      const parsedRecords = PreferencesSchema.safeParse(
        JSON.parse(records.records.texts.find((record) => record.key === 'me.yodl')?.value || '{}'),
      );

      if (parsedRecords.success) {
        form.setValue('chains', parsedRecords.data.chains);
        form.setValue('tokens', parsedRecords.data.tokens);
      }
    }
  }, [form, records]);

  const mutation = useMutation({
    mutationFn: async (data: SubmitPreferencesInput) => {
      const text: Record<string, string> = {};

      if ((data.chains || []).length > 0) text.chains = data.chains!.join(',');
      if ((data.tokens || []).length > 0) text.tokens = data.tokens!.join(',');

      await updateSubname({
        ens,
        text: {
          'me.yodl': JSON.stringify(text),
        },
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
