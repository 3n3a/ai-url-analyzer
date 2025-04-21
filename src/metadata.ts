import { MetaHandler } from "./handlers/MetaHandler";
import { TitleHandler } from "./handlers/TitleHandler";

// Helper function to extract meta data from HTML using HTMLRewriter
export async function extractMetaData(html: string): Promise<{ title: string; metaTags: Record<string, string> }> {
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
