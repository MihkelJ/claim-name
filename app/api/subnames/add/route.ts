import { justanameClient, privateClient } from '@/config/server';
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
 * 2. Checking follower state (if MEMBERS_ONLY is enabled) and existing subnames
 * 3. Subname registration through the subname service
 * 4. Error handling and response formatting
 */
export async function POST(req: NextRequest) {
  try {
    // 1. Validate request body
    const validatedRequest = await parseRequestBody(req, addSubnameSchema);
    const { username, message, signature, address, text, addresses, contentHash } =
      validatedRequest;

    // 2. Check follower state (only if MEMBERS_ONLY is enabled)
    if (CONSTANTS.MEMBERS_ONLY) {
      // Fetch ENS records for the domain
      const records = await justanameClient.subnames.getRecords({
        ens: CONSTANTS.ENS_DOMAIN,
      });

      // Find the community configuration record
      const configRecord = records.records.texts.find((record) =>
        record.key.endsWith(CONSTANTS.COMMUNITY_CONFIG_RECORD_KEY),
      );

      if (!configRecord?.value) {
        throw new Error('Community configuration not found');
      }

      // Parse the configuration
      const configJson = JSON.parse(configRecord.value);
      const membersSource = configJson?.members_source;

      if (!membersSource || typeof membersSource !== 'string') {
        throw new Error('Invalid members source in configuration');
      }

      // Resolve the ENS name to get the address
      const followedAddress = await privateClient.getEnsResolver({
        name: membersSource,
      });

      // Fetch the follower state using the resolved address
      const followerState = await fetchFollowerState(address, followedAddress);
      if (!followerState.state.follow) {
        throw new Error('Membership of the community required');
      }
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
