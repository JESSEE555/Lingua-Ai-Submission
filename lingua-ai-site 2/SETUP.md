# Lingua AI — final setup (GitHub Pages + free AI proxy)

Why: a website on GitHub is public, so an OpenAI key can't live in it (anyone could copy it,
and OpenAI disables keys found on GitHub). Instead, a tiny Cloudflare Worker holds the key and
the site talks to the worker.

## 1. Create the worker (about 5 minutes, free)
1. Make a free account at https://dash.cloudflare.com → **Workers & Pages** → **Create** → **Create Worker**.
2. Name it `lingua-proxy` → **Deploy**, then **Edit code**.
3. Delete the sample code, paste the whole of `worker/worker.js`, click **Deploy**.
4. Worker page → **Settings → Variables and Secrets** → add:
   - **Secret** `OPENAI_API_KEY` = your OpenAI key (type it only here)
   - **Text** `ALLOWED_ORIGIN` = your site origin, e.g. `https://yourname.github.io`
     (no trailing slash, no repo name; separate several with commas, e.g. add `http://localhost:8000` for local testing)
5. Deploy again. Copy the worker URL, e.g. `https://lingua-proxy.yourname.workers.dev`.

## 2. Point the site at it
Open `config.js` and set:
    const OPENAI_PROXY_URL = "https://lingua-proxy.yourname.workers.dev";
Commit and push to GitHub. (No secret is in this file, so it's safe in a public repo.)

## 3. Check it
Open the site → Settings → the key box says "AI is connected through the site proxy".
Level test now generates AI questions; the Tutor, lessons, listening and speaking all use the AI.

## Notes
- Keep your OpenAI account's monthly spend limit low (platform.openai.com → Billing → Limits).
- The worker only accepts requests from your site's origin, only the models the site uses,
  and caps reply length.
- Local testing without the worker: leave OPENAI_PROXY_URL empty and paste a key in Settings (stays in your browser only).
- Firebase: add your GitHub Pages domain (yourname.github.io) under Authentication → Settings → Authorized domains,
  or Google sign-in will fail on the hosted site.
