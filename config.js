/* =====================================================================
   OpenAI configuration — EDIT THIS FILE YOURSELF, LOCALLY.

   NEVER put an OpenAI key in this file if the repo is public — OpenAI
   disables keys found on GitHub. For the hosted site use OPENAI_PROXY_URL
   (the key lives in the worker). OPENAI_API_KEY is for local testing only.
   ===================================================================== */

const OPENAI_API_KEY = "";

// PUBLIC HOSTING (GitHub Pages): paste your Cloudflare Worker URL here, e.g.
// "https://lingua-proxy.yourname.workers.dev". The worker holds the real key.
const OPENAI_PROXY_URL = "";  // <-- paste your worker URL between these quotes

// Models used across the site. gpt-4o-mini is inexpensive and fast — good default.
const OPENAI_CHAT_MODEL = "gpt-4o-mini";
const OPENAI_TRANSCRIBE_MODEL = "whisper-1";
const OPENAI_TTS_MODEL = "gpt-4o-mini-tts"; // newer model — supports style "instructions" below for a more expressive, human voice
const OPENAI_TTS_VOICE = "shimmer";  // try "ballad", "verse", "nova", or "fable" too — voice character is very much a matter of taste, worth A/B testing
const OPENAI_TTS_SPEED = 1.0;        // 1.0 = natural pace (brisk speeds like 1.08+ tend to read as clipped/robotic)
const OPENAI_TTS_INSTRUCTIONS = "Speak like a real person having a warm, casual conversation with a friend — natural conversational pacing with small pauses, slightly varied rhythm and pitch, genuine emotional warmth. Avoid the flat, evenly-paced, over-enunciated cadence of a typical AI assistant or announcer. Let energy rise and fall naturally rather than staying uniformly upbeat."
