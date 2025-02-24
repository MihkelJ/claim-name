import { usernameSchema } from './username';
import { isAddress, isHex } from 'viem';
import { z } from 'zod';

export const addSubnameSchema = z.object({
  username: usernameSchema,
  message: z.string().min(1, 'Message is required'),
  signature: z.string().min(1, 'Signature is required').refine(isHex, 'Invalid signature'),
  address: z.string().min(1, 'Address is required').refine(isAddress, 'Invalid address'),
  text: z.record(z.string()).optional(),
  addresses: z.record(z.string()).optional(),
  contentHash: z.string().optional(),
});
