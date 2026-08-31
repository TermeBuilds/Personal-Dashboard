// Both providers below offer a real free tier (no credit card required):
// - Groq (console.groq.com)      -> fast, hosts Llama 3 models
// - OpenRouter (openrouter.ai)   -> has free-tier DeepSeek models
//
// Neither of these is literally "ChatGPT" (OpenAI has no permanent free API),
// so we label them honestly in the UI as two independent free assistants.

const GROQ_KEY = import.meta.env.VITE_GROQ_API_KEY
const OPENROUTER_KEY = import.meta.env.VITE_OPENROUTER_API_KEY

export const assistants = {
  groq: {
    id: 'groq',
    label: 'دستیار ۱ (Groq · Llama 3)',
    labelEn: 'Assistant 1 (Groq · Llama 3)',
    configured: Boolean(GROQ_KEY),
  },
  deepseek: {
    id: 'deepseek',
    label: 'دستیار ۲ (DeepSeek)',
    labelEn: 'Assistant 2 (DeepSeek)',
    configured: Boolean(OPENROUTER_KEY),
  },
}

export async function askAssistant(assistantId, messages) {
  if (assistantId === 'groq') return askGroq(messages)
  if (assistantId === 'deepseek') return askOpenRouterDeepSeek(messages)
  throw new Error('Unknown assistant')
}

async function askGroq(messages) {
  if (!GROQ_KEY) throw new Error('MISSING_KEY')
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${GROQ_KEY}`,
    },
    body: JSON.stringify({
      model: 'llama-3.1-8b-instant',
      messages,
      max_tokens: 500,
    }),
  })
  if (!res.ok) throw new Error(`API_ERROR_${res.status}`)
  const data = await res.json()
  return data.choices[0].message.content
}

async function askOpenRouterDeepSeek(messages) {
  if (!OPENROUTER_KEY) throw new Error('MISSING_KEY')
  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${OPENROUTER_KEY}`,
    },
    body: JSON.stringify({
      model: 'deepseek/deepseek-chat-v3.1:free',
      messages,
      max_tokens: 500,
    }),
  })
  if (!res.ok) throw new Error(`API_ERROR_${res.status}`)
  const data = await res.json()
  return data.choices[0].message.content
}
