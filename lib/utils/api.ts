import { NextRequest } from 'next/server';
import { z } from 'zod';

/**
 * Creates a standardized error response for API endpoints
 */
export const createErrorResponse = (message: string, status = 400) => {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
};

/**
 * Handles API errors and converts them to a standardized format
 */
export function handleApiError(error: unknown): Response {
  const isKnownError = error instanceof Error;
  const errorMessage = isKnownError ? error.message : 'An unexpected error occurred';
  const statusCode = isKnownError ? 400 : 500;

  return createErrorResponse(errorMessage, statusCode);
}

/**
 * Validates and parses the request body using a Zod schema
 */
export async function parseRequestBody<T>(req: NextRequest, schema: z.ZodSchema<T>): Promise<T> {
  try {
    const requestBody = await req.json();
    const validationResult = schema.safeParse(requestBody);

    if (!validationResult.success) {
      const [firstError] = validationResult.error.errors;
      throw new Error(firstError?.message || 'Invalid request data');
    }

    return validationResult.data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to parse request body');
  }
}
