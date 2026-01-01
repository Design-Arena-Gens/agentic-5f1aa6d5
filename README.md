# NextPlay AI Business Automation

Full-stack Next.js application that detects customer intent and triggers automation flows for sales, support, payments, and call scheduling using OpenAI GPT‑4o mini.

## Features

- Intent detection across chat, email, and call channels
- Adaptive response generation with dedicated flows for sales, support, payments, Gmail replies, and call scheduling
- Tailwind-powered dashboard with canned templates and response history
- API-first architecture ready for integrations

## Quick Start

```bash
cd nextplay-ai
npm install
cp .env.example .env.local   # add your OpenAI key
npm run dev
```

Then open `http://localhost:3000` to use the automation console.

## Configuration

Set the following environment variable (local `.env.local` or Vercel project settings):

- `OPENAI_API_KEY` – required for all AI automation flows.

## Deployment

The project ships with Next.js 14 (App Router) and is optimized for Vercel:

```bash
npm run build
npm run start  # or deploy to Vercel
```

Use the provided `vercel deploy --prod` command once your environment variables are configured.
