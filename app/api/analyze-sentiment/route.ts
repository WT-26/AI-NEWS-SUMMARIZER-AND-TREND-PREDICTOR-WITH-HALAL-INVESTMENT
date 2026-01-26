import { generateText } from "ai"

export async function POST(request: Request) {
  try {
    const { headline, company, ticker } = await request.json()

    const prompt = `You are a financial analyst AI. Analyze this news headline and provide investment insights.

Company: ${company} (${ticker})
Headline: ${headline}

Provide your analysis in the following JSON format:
{
  "sentiment": "bullish" | "bearish" | "neutral",
  "confidence": 0.0-1.0,
  "summary": "2-3 sentence summary of the impact",
  "buyRange": "suggested price range like $150-$160 or wait for dip",
  "keyPoints": ["point 1", "point 2", "point 3"]
}

Be concise and actionable. Focus on investment implications.`

    const { text } = await generateText({
      model: "openai/gpt-4o-mini",
      prompt,
      temperature: 0.7,
    })

    // Extract JSON from the response
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error("Failed to parse AI response")
    }

    const analysis = JSON.parse(jsonMatch[0])

    return Response.json(analysis)
  } catch (error) {
    console.error("[v0] Sentiment analysis error:", error)
    return Response.json({ error: "Failed to analyze sentiment" }, { status: 500 })
  }
}
