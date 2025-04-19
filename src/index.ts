import { createWorkersAI } from 'workers-ai-provider';
import { generateObject } from 'ai';
import { unknown, z } from 'zod';

// Define the environment variables type
type Env = {
  AI: any;
  API_KEY: string;
};

type RequestSchema = {
  url: string;
};

// Define the response schema
const responseSchema = z.object({
  url: z.string(),
  title: z.string(),
  summary: z.string().max(250),
  tags: z.array(z.string())
});

// Helper class to extract meta data using HTMLRewriter
class MetaHandler {
  metaTags: Record<string, string>;

  constructor() {
    this.metaTags = {};
  }

  element(element: Element) {
    const allowedNames = ["title", "description", "og:title", "og:description", "X:title", "X:description", "og:site_name"];
    const name = element.getAttribute('name') || element.getAttribute('property');
    const content = element.getAttribute('content');
    if (name && allowedNames.includes(name) && content) {
      this.metaTags[name] = content;
    }
  }

  text(text: Text) {

  }
}

class TitleHandler {
  title: string;

  constructor() {
    this.title = '';
  }

  text(text: Text) {
    if (!text.lastInTextNode) {
      this.title += text.text;
    }
  }
}

// Helper function to extract meta data from HTML using HTMLRewriter
async function extractMetaData(html: string): Promise<{ title: string; metaTags: Record<string, string> }> {
  const titleHandler = new TitleHandler();
  const metaHandler = new MetaHandler();
  const rewriter = new HTMLRewriter()
    .on('title', titleHandler)
    .on('meta', metaHandler);

  // Create a response object from the HTML string to process with HTMLRewriter
  const response = new Response(html);
  await rewriter.transform(response).text();

  return { title: titleHandler.title, metaTags: metaHandler.metaTags };
}

export default {
  async fetch(request: Request, env: Env) {
    // Check if the request method is POST
    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    // Check if the API key is present and valid
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ') || authHeader.substring(7) !== env.API_KEY) {
      return new Response('Unauthorized', { status: 401 });
    }

    try {
      // Parse the request body
      const requestBody: RequestSchema = await request.json();
      const { url } = requestBody;

      if (!url) {
        return new Response('URL is required', { status: 400 });
      }

      // Fetch the URL
      const response = await fetch(url);
      if (!response.ok) {
        return new Response(`Failed to fetch URL: ${response.statusText}`, { status: 502 });
      }

      // Check if content type is HTML
      const contentType = response.headers.get('Content-Type') || '';
      if (!contentType.includes('text/html')) {
        return new Response('URL must point to an HTML page', { status: 400 });
      }

      // Get the HTML content
      const html = await response.text();

      // Extract meta data
      const { title, metaTags } = await extractMetaData(html);

      // Create a prompt for the AI model
      const metadata = Object.entries(metaTags)
        .map(([key, value]) => `${key}: ${value}`)
        .join('\n');

      const prompt = `
I have a webpage with the following metadata:
Title: ${title}
${metadata}

Based on this information, please:
1. Generate an appropriate title for the page
2. Write a concise summary (max 250 words) of what the page contains
3. Provide relevant single-word tags that categorize the page content

Return only the requested information in a structured format.
`;

      // Initialize Workers AI
      const workersai = createWorkersAI({ binding: env.AI })
      // Generate the analysis
      const result = await generateObject({
        model: workersai('@cf/mistral/mistral-7b-instruct-v0.1'),
        prompt: prompt,
        schema: responseSchema,
      })

      // Prepare the final response
      const finalResponse = {
        url: url,
        title: result.object.title,
        summary: result.object.summary,
        tags: result.object.tags
      }

      return Response.json(finalResponse);
    } catch (error) {
      console.error('Error processing request:', error);
      return new Response(`Error processing request: ${(error as Error).message}`, { status: 500 });
    }
  },
};
