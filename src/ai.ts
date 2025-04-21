import { fetchPageInfo } from "./url";

const responseFormat = {
    type: 'json_schema',
    json_schema: {
        type: 'object',
        properties: {
            title: {
                type: 'string',
            },
            summary: {
                type: 'string',
            },
            tags: {
                type: 'array',
                items: {
                    'type': 'string',
                },
            },
        },
        required: [
            "title",
            "summary",
            "tags",
        ],
    },
}

function getSystemPrompt() {
    return `You can generate webpage overviews in structured format. A user will provide a page title and metadata. You will then generate an appropriate title for the page. You will also write a concise summary (max 250 words) based on the page description. You will also provide relevant single-word tags that categorize the page.`;
}

function createUserPrompt(title: string, metaTags: Record<string, string>) {
    // Create a prompt for the AI model
    const metadata = Object.entries(metaTags)
        .map(([key, value]) => `${key}: ${value}`)
        .join('; ');

    const prompt = `I have a webpage with the following metadata: Title: ${title}; ${metadata}`;
    return prompt;
}

export async function generateSummary(env: Env, url: string) {
    const systemPrompt: string = getSystemPrompt();

    const { title, metaTags } = await fetchPageInfo(url);
    const userPrompt = createUserPrompt(title, metaTags);

    const chatOptions = {
        messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
        ],
        response_format: responseFormat,
    };
    const result = await env.AI.run('@cf/meta/llama-3-8b-instruct', chatOptions)
    return result;
}