// Lightweight offline sentiment heuristic — no API key or internet needed.
// Not a real ML model; a transparent keyword-based approximation good enough
// to demo the concept. Swap with a real API (e.g. Hugging Face Inference)
// later if you want production-grade accuracy — see README.

const POSITIVE_WORDS = [
  // Persian
  'عالی', 'خوب', 'موفق', 'خوشحال', 'راحت', 'آسون', 'پیشرفت', 'انگیزه', 'قوی', 'کامل',
  'تمام', 'انجام شد', 'یاد گرفتم', 'دوست دارم', 'خوشم اومد', 'راضی',
  // English
  'great', 'good', 'success', 'happy', 'easy', 'progress', 'motivated', 'strong',
  'done', 'completed', 'learned', 'love', 'awesome', 'excellent', 'proud',
]

const NEGATIVE_WORDS = [
  // Persian
  'بد', 'سخت', 'خسته', 'ناراحت', 'استرس', 'مشکل', 'شکست', 'نتونستم', 'دیر', 'کمبود',
  'خرابه', 'نگران', 'اضطراب', 'کند', 'ضعیف', 'گیر کردم',
  // English
  'bad', 'hard', 'tired', 'sad', 'stress', 'problem', 'fail', 'failed', 'late',
  'stuck', 'worried', 'anxious', 'slow', 'weak', 'broken',
]

export function analyzeSentiment(text) {
  const lower = text.toLowerCase()
  let score = 0

  POSITIVE_WORDS.forEach((word) => {
    if (lower.includes(word)) score += 1
  })
  NEGATIVE_WORDS.forEach((word) => {
    if (lower.includes(word)) score -= 1
  })

  if (score > 0) return 'positive'
  if (score < 0) return 'negative'
  return 'neutral'
}

export const sentimentMeta = {
  positive: { emoji: '🙂', colorClass: 'text-signal-green', borderClass: 'border-signal-green/40' },
  negative: { emoji: '😕', colorClass: 'text-signal-red', borderClass: 'border-signal-red/40' },
  neutral: { emoji: '😐', colorClass: 'text-ink-500', borderClass: 'border-base-700' },
}
