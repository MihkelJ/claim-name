import CONSTANTS from '@/constants';
import { addSubnameSchema } from '@/lib/schemas/subname';
import { checkExistingSubname, fetchFollowerState, registerSubname } from '@/lib/services/subname';
import { handleApiError, parseRequestBody } from '@/lib/utils/api';
import { NextRequest } from 'next/server';

/**
 * POST endpoint to add a new subname.
 *
 * This endpoint handles:
 * 1. Request validation using the add schema
 * 2. Checking follower state and existing subnames
 * 3. Subname registration through the subname service
 * 4. Error handling and response formatting
 */
export async function POST(req: NextRequest) {
  try {
    // 1. Validate request body
    const validatedRequest = await parseRequestBody(req, addSubnameSchema);
    const { username, message, signature, address, text, addresses, contentHash } =
      validatedRequest;

    // 2. Check follower state
    const isFollowing = await fetchFollowerState(address);
    if (!isFollowing) {
      throw new Error('You must follow the top domain to register a subdomain');
    }

    // 3. Check for existing subname
    const hasExistingSubname = await checkExistingSubname(address);
    if (hasExistingSubname) {
      throw new Error(`Already claimed ${CONSTANTS.ENS_DOMAIN} subname`);
    }

    // 4. Register new subname
    const result = await registerSubname({
      username,
      message,
      signature,
      address,
      text,
      addresses,
      contentHash,
    });

    return Response.json(result);
  } catch (error) {
    return handleApiError(error);
  }
}
