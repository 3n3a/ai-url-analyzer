import { WebError } from "./error";
import { extractMetaData } from "./metadata";

export async function fetchPageInfo(url: string) {
    // Fetch the URL
    const response = await fetch(url);
    if (!response.ok) {
        throw new WebError(`Failed to fetch URL: ${response.statusText}`, { status: 502 });
    }

    // Check if content type is HTML
    const contentType = response.headers.get('Content-Type') || '';
    if (!contentType.includes('text/html')) {
        throw new WebError('URL must point to an HTML page', { status: 400 });
    }

    // Get the HTML content
    const html = await response.text();

    // Extract meta data
    const { title, metaTags } = await extractMetaData(html);
    return { title, metaTags };
}