import { addSubnameSchema } from '@/lib/schemas/subname';
import { revokeSubname } from '@/lib/services/subname';
import { handleApiError, parseRequestBody } from '@/lib/utils/api';
import { NextRequest } from 'next/server';

/**
 * Schema for validating revoke subname requests.
 * We reuse the base subname schema but only include
 * the fields required for revocation.
 */
const revokeSubnameSchema = addSubnameSchema.pick({
  username: true,
  address: true,
  signature: true,
  message: true,
});

/**
 * POST endpoint to revoke a subname.
 *
 * This endpoint handles:
 * 1. Request validation using the revoke schema
 * 2. Subname revocation through the subname service
 * 3. Error handling and response formatting
 */
export async function POST(req: NextRequest) {
  try {
    const validatedRequest = await parseRequestBody(req, revokeSubnameSchema);
    const result = await revokeSubname(validatedRequest);
    return Response.json(result);
  } catch (error) {
    return handleApiError(error);
  }
}
