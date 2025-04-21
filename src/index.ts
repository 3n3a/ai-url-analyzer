import { ResponseSchema } from "./types/ResponseSchema";
import { RequestSchema } from "./types/RequestSchema";
import { isValidApiKey } from "./auth";
import { generateSummary } from "./ai";
import { WebError } from "./error";

// Define the environment variables type
type Env = {
  AI: Ai;
  API_KEY: string;
};

export default {
  async fetch(request: Request, env: Env) {
    // Check if the request method is POST
    if (request.method !== 'POST') {
      return new WebError('Method not allowed', { status: 405 });
    }

    // Check if the API key is present and valid
    const authHeader = request.headers.get('Authorization');
    if (isValidApiKey(authHeader, env)) {
      return new WebError('Unauthorized', { status: 401 });
    }

    try {
      // Parse the request body
      const requestBody: RequestSchema = await request.json();
      const { url } = requestBody;

      if (!url) {
        throw new WebError('URL is required', { status: 400 });
      }

      const result = await generateSummary(env, url);

      // use weird hack to get the result into form
      const parsed: { response: ResponseSchema } = JSON.parse(JSON.stringify(result));
      console.log('parsed', JSON.stringify(parsed))

      return Response.json({
        url: url,
        ...parsed.response,
      })
    } catch (error) {
      let errorJson = { message: '' };
      let errorStatus = 500;
      console.error('Error processing request:', error);
      if (error instanceof WebError) {
        errorJson.message = error.message;
        errorStatus = error.additionalInfo.status;
      } else {
        errorJson.message = `Error processing request: ${(error as Error).message}`;
        errorStatus = 500;
      }
      return Response.json(errorJson, { status: errorStatus })
    }
  },
};
