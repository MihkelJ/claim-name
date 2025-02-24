import { z } from 'zod';

export const usernameSchema = z
  .string()
  .min(3, 'Username must be at least 3 characters long')
  .max(32, 'Username must be less than 32 characters')
  .regex(/^[a-zA-Z0-9-]+$/, 'Username can only contain letters, numbers, and hyphens');

export type Username = z.infer<typeof usernameSchema>;
