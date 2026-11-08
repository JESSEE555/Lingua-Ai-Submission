/* Lingua AI — OpenAI proxy (Cloudflare Worker).
   The real key lives in the worker secret OPENAI_API_KEY, never in the site.
   Set ALLOWED_ORIGIN to your site origin, e.g. https://yourname.github.io */
const ALLOWED_PATHS = {
  '/v1/chat/completions': { models: ['gpt-4o-mini'], maxBody: 60000 },
  '/v1/audio/transcriptions': { models: null, maxBody: 6000000 },
  '/v1/audio/speech': { models: ['gpt-4o-mini-tts', 'tts-1'], maxBody: 8000 }
};
function cors(origin){
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    'Vary': 'Origin'
  };
}
export default {
  async fetch(request, env){
    const allowed = (env.ALLOWED_ORIGIN || '').split(',').map(s => s.trim()).filter(Boolean);
    const reqOrigin = request.headers.get('Origin') || '';
    const okOrigin = allowed.includes(reqOrigin) || allowed.includes('*');
    const origin = okOrigin ? reqOrigin || '*' : allowed[0] || 'null';
    const headers = cors(origin);
    if(request.method === 'OPTIONS') return new Response(null, { status: 204, headers });
    if(!okOrigin) return new Response('Origin not allowed', { status: 403, headers });
    if(request.method !== 'POST') return new Response('POST only', { status: 405, headers });
    if(!env.OPENAI_API_KEY) return new Response('Worker has no OPENAI_API_KEY secret', { status: 500, headers });

    const path = new URL(request.url).pathname;
    const rule = ALLOWED_PATHS[path];
    if(!rule) return new Response('Not found', { status: 404, headers });
    const len = parseInt(request.headers.get('Content-Length') || '0', 10);
    if(len > rule.maxBody) return new Response('Too large', { status: 413, headers });

    const ct = request.headers.get('Content-Type') || '';
    let body;
    if(ct.includes('application/json')){
      let j;
      try{ j = await request.json(); }catch(e){ return new Response('Bad JSON', { status: 400, headers }); }
      if(rule.models && !rule.models.includes(j.model)) return new Response('Model not allowed', { status: 400, headers });
      if(path === '/v1/chat/completions') j.max_tokens = Math.min(j.max_tokens || 1500, 1800);
      if(path === '/v1/audio/speech' && String(j.input || '').length > 1200) return new Response('Text too long', { status: 413, headers });
      body = JSON.stringify(j);
    } else {
      body = request.body; // multipart audio upload
    }
    const up = await fetch('https://api.openai.com' + path, {
      method: 'POST',
      headers: Object.assign({ 'Authorization': 'Bearer ' + env.OPENAI_API_KEY }, ct ? { 'Content-Type': ct } : {}),
      body
    });
    const out = new Headers(headers);
    out.set('Content-Type', up.headers.get('Content-Type') || 'application/json');
    return new Response(up.body, { status: up.status, headers: out });
  }
};
