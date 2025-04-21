# 🔍 URL Analyzer

A powerful Cloudflare Worker that extracts and analyzes web page content using AI.

![Banner Image](./.github/img/banner.jpg)

## ✨ Features

- 🔐 Secure API key authentication
- 🌐 Fetches and processes any HTML web page
- 🤖 Uses AI model to generate insightful analysis
- 📝 Produces concise summaries (max 250 words)
- 🏷️ Auto-generates relevant tags for easy categorization
- ⚡ Lightning fast processing via Cloudflare's edge network

## 📋 API Response

```json
{
  "url": "https://example.com",
  "title": "Generated page title",
  "summary": "A concise summary of the page content...",
  "tags": ["technology", "information", "example"]
}
```

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or newer)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/)
- [Cloudflare account](https://dash.cloudflare.com/sign-up)

### Installation

1. Clone this repository:

   ```bash
   git clone https://github.com/3n3a/ai-url-info.git
   cd ai-url-info
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Generate a secure API key:

   ```bash
   openssl rand -hex 32
   ```

4. Create a `.dev.vars` file for local development:

   ```
   API_KEY=your-generated-api-key
   ```

5. Configure your `wrangler.toml`:

   ```toml
   name = "url-analyzer"
   main = "src/index.ts"
   compatibility_date = "2023-10-30"

   [ai]
   binding = "AI"
   ```

### Development

Start a local development server:

```bash
npm run dev
```

### Deployment

Deploy to Cloudflare:

```bash
npm run deploy
```

Set your production API key as a secret:

```bash
npx wrangler secret put API_KEY
```

## 📝 Usage

Send a POST request to your Worker URL:

```bash
curl -X POST http://localhost:8787 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-api-key" \
  -d '{"url": "https://example.com"}'
```

### Using with JavaScript

```javascript
const response = await fetch("http://localhost:8787", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: "Bearer your-api-key",
  },
  body: JSON.stringify({
    url: "https://example.com",
  }),
});

const data = await response.json();
console.log(data);
```

## ⚙️ Configuration Options

| Environment Variable | Description                                |
| -------------------- | ------------------------------------------ |
| `API_KEY`            | Secret key for authenticating API requests |

## 🛠️ Technical Implementation

This project uses:

- [Cloudflare Workers](https://workers.cloudflare.com/) for serverless edge execution
- [Workers AI](https://developers.cloudflare.com/workers-ai/) for machine learning capabilities

## 📜 License

MIT License - See [LICENSE](LICENSE) for details.

## 🤝 Contributing

Contributions welcome! Please feel free to submit a Pull Request.

---

Made with ❤️ using Cloudflare Workers AI
