import { z } from 'zod';

/**
 * Schema for individual user tag objects
 */
export const UserTagSchema = z.object({
  label: z.string().min(1, 'Label is required'),
  value: z
    .string()
    .min(1, 'Value is required')
    .regex(/^[a-z0-9-]+$/, {
      message: 'Value must contain only lowercase letters, numbers, and hyphens',
    }),
});

/**
 * Schema for the USER_TAGS array
 */
export const UserTagsSchema = z.array(UserTagSchema).min(1, 'At least one user tag is required');

/**
 * Type for user tag after validation
 */
export type UserTag = z.infer<typeof UserTagSchema>;

/**
 * Type for user tags array after validation
 */
export type UserTags = z.infer<typeof UserTagsSchema>;

/**
 * Validates and parses USER_TAGS from environment variable
 * @param envValue - The raw environment variable value
 * @returns Parsed and validated user tags array
 */
export const parseUserTags = (envValue?: string): UserTags => {
  if (!envValue) {
    return [];
  }

  try {
    const parsed = JSON.parse(envValue);
    return UserTagsSchema.parse(parsed);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Invalid USER_TAGS format:', error.errors);
      throw new Error(`Invalid USER_TAGS format: ${error.errors.map((e) => e.message).join(', ')}`);
    }
    console.error('Failed to parse USER_TAGS JSON:', error);
    throw new Error('Failed to parse USER_TAGS JSON');
  }
};
