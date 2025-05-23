import { zodResolver } from '@hookform/resolvers/zod';
import { DefaultValues, FieldValues, useForm } from 'react-hook-form';
import { z } from 'zod';

interface UseBaseFormProps<T extends FieldValues> {
  schema: z.ZodSchema;
  defaultValues: DefaultValues<T>;
  onError?: (error: unknown) => void;
}

export function useBaseForm<T extends FieldValues>({
  schema,
  defaultValues,
  onError,
}: UseBaseFormProps<T>) {
  const form = useForm<T>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const handleError = (error: unknown) => {
    console.error('Form submission error:', error);
    if (onError) {
      onError(error);
    } else {
      // Get actual error message if available
      const errorMessage =
        error instanceof Error ? error.message : 'An error occurred. Please try again.';

      form.setError('root', {
        type: 'manual',
        message: errorMessage,
      });
    }
  };

  return {
    form,
    isSubmitting: form.formState.isSubmitting,
    error: form.formState.errors.root?.message,
    handleError,
  };
}
