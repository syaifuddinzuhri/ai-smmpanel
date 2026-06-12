import Anthropic from '@anthropic-ai/sdk'

interface InsightPayload {
  period: string
  totalServices: number
  avgScore: number
  avgSuccess: number
  totalOrders: number
  riskyCount: number
  trendingCount: number
  topServices: { name: string; aiScore: number; successRate: number; orderCount: number; platform: string }[]
  riskyServices: { name: string; cancelRate: number; successRate: number }[]
  trendingServices: { name: string; trendPercent: number; platform: string }[]
}

function ruleBasedInsight(p: InsightPayload): string {
  const best = p.topServices[0]
  const trendTop = p.trendingServices[0]
  return (
    `Berdasarkan analisis ${p.totalServices} layanan dalam periode ${p.period}, ` +
    `layanan terbaik saat ini adalah "${best?.name}" dengan AI Score ${best?.aiScore}/100 dan success rate ${best?.successRate}%. ` +
    (trendTop ? `Tren naik tertinggi terdeteksi pada "${trendTop.name}" (+${trendTop.trendPercent}%). ` : '') +
    (p.riskyCount > 0
      ? `Terdapat ${p.riskyCount} layanan berisiko yang perlu diperhatikan.`
      : 'Semua layanan dalam kondisi baik.')
  )
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const body = await readBody<InsightPayload>(event)

  if (!config.anthropicApiKey) {
    return { insight: ruleBasedInsight(body), source: 'rule' }
  }

  const prompt = buildPrompt(body)

  try {
    const client = new Anthropic({ apiKey: config.anthropicApiKey })

    const stream = client.messages.stream({
      model: 'claude-opus-4-8',
      max_tokens: 512,
      thinking: { type: 'adaptive' },
      messages: [{ role: 'user', content: prompt }],
    })

    const message = await stream.finalMessage()
    const text = message.content
      .filter(b => b.type === 'text')
      .map(b => (b as { type: 'text'; text: string }).text)
      .join('')
      .trim()

    return { insight: text || ruleBasedInsight(body), source: 'llm' }
  } catch {
    return { insight: ruleBasedInsight(body), source: 'rule' }
  }
})

function buildPrompt(p: InsightPayload): string {
  const topList = p.topServices
    .slice(0, 3)
    .map((s, i) => `${i + 1}. ${s.name} — Score ${s.aiScore}, Success ${s.successRate}%, ${s.orderCount} order`)
    .join('\n')

  const trendList = p.trendingServices
    .slice(0, 3)
    .map(s => `- ${s.name} (+${s.trendPercent}%)`)
    .join('\n')

  const riskyList = p.riskyServices
    .slice(0, 3)
    .map(s => `- ${s.name} (cancel ${s.cancelRate}%, success ${s.successRate}%)`)
    .join('\n')

  return `Kamu adalah analis SMM panel AI. Berikan analisis singkat dan tajam dalam bahasa Indonesia (3–4 kalimat) berdasarkan data berikut. Langsung ke isi, tanpa pembuka formal.

Periode: ${p.period} | Total layanan: ${p.totalServices} | Avg AI Score: ${p.avgScore}/100 | Avg Success Rate: ${p.avgSuccess}% | Total order: ${p.totalOrders.toLocaleString('id-ID')} | Layanan trending: ${p.trendingCount} | Layanan berisiko: ${p.riskyCount}

Top 3 Layanan:
${topList}

${trendList ? `Trending Naik:\n${trendList}` : ''}

${riskyList ? `Layanan Berisiko:\n${riskyList}` : 'Tidak ada layanan berisiko.'}

Tulis insight yang actionable: sorot peluang dari layanan trending, peringatkan risiko jika ada, dan berikan satu rekomendasi strategis.`
}
