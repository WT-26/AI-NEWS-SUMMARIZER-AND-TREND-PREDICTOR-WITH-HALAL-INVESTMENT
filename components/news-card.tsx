"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Sparkles,
  ExternalLink,
  Calendar,
  Clock,
  DollarSign,
  Target,
  Brain,
  Info,
} from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

interface NewsCardProps {
  news: {
    id: string
    company: string
    ticker: string
    headline: string
    source: string
    sourceIcon: string
    url: string
    publishedAt: string
    category: string
    isHalal: boolean
    price: number
    priceChange: number
    summary: string[]
  }
  isFavorite: boolean
  onToggleFavorite: (ticker: string) => void
}

interface SentimentAnalysis {
  sentiment: "bullish" | "bearish" | "neutral"
  confidence: number
  summary: string
  buyRange: string
  shortTermBuyRange: string
  longTermBuyRange: string
  keyPoints: string[]
  analysisTimestamp: string
  contextExplanation: string
}

/**
 * Set this to true if you want to demo the UI without any API.
 * - true  => Generate button fills the UI with mock analysis (based on the example).
 * - false => Generate button will call /api/analyze-sentiment (and use mock if it fails).
 */
const USE_MOCK_ONLY = true

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n))
}

function formatUSD(n: number) {
  return `$${n.toFixed(2)}`
}

/**
 * Creates a realistic mock analysis based on the "record-breaking earnings" example.
 * If the headline looks negative (miss, decline, cut, lawsuit...), it returns bearish.
 */
function buildMockAnalysis(news: NewsCardProps["news"]): SentimentAnalysis {
  const h = news.headline.toLowerCase()

  const bearishKeywords = [
    "miss",
    "missed",
    "decline",
    "down",
    "falls",
    "drop",
    "plunge",
    "cut guidance",
    "guidance cut",
    "weak",
    "lawsuit",
    "investigation",
    "recall",
    "fraud",
    "layoff",
    "layoffs",
    "profit warning",
  ]

  const bullishKeywords = [
    "record",
    "record-breaking",
    "beats",
    "beat expectations",
    "exceed",
    "exceeds",
    "surge",
    "strong",
    "growth",
    "all-time high",
    "raises guidance",
    "upgrade",
  ]

  const isBearish = bearishKeywords.some((k) => h.includes(k))
  const isBullish = bullishKeywords.some((k) => h.includes(k))

  let sentiment: "bullish" | "bearish" | "neutral" = "neutral"
  if (isBearish && !isBullish) sentiment = "bearish"
  else if (isBullish && !isBearish) sentiment = "bullish"
  else if (isBullish && isBearish) sentiment = "neutral" // mixed headline

  // Confidence: more confident when clear positive/negative words exist
  const confidence =
    sentiment === "bullish" ? 0.82 : sentiment === "bearish" ? 0.78 : 0.62

  // Buy range logic (simple + presentable for FYP demo):
  // - Bullish: short-term near current price; long-term slightly lower (pullback).
  // - Bearish: short-term lower; long-term even lower.
  // - Neutral: tight range around current.
  const price = news.price
  const shortLow =
    sentiment === "bullish"
      ? price * 0.98
      : sentiment === "bearish"
      ? price * 0.93
      : price * 0.985
  const shortHigh =
    sentiment === "bullish"
      ? price * 1.01
      : sentiment === "bearish"
      ? price * 0.97
      : price * 1.005

  const longLow =
    sentiment === "bullish"
      ? price * 0.94
      : sentiment === "bearish"
      ? price * 0.88
      : price * 0.96
  const longHigh =
    sentiment === "bullish"
      ? price * 0.995
      : sentiment === "bearish"
      ? price * 0.95
      : price * 0.99

  const shortTermBuyRange = `${formatUSD(shortLow)} – ${formatUSD(shortHigh)}`
  const longTermBuyRange = `${formatUSD(longLow)} – ${formatUSD(longHigh)}`
  const buyRange = `${shortTermBuyRange} | ${longTermBuyRange}`

  const bullishSignals = [
    "Headline indicates strong performance (e.g., record results / exceeded expectations).",
    "Positive demand signal suggests continued momentum.",
    "Improving margins/recurring revenue (if mentioned) strengthens long-term outlook.",
    "Market sentiment likely to react positively to strong earnings tone.",
  ]

  const bearishSignals = [
    "Headline indicates negative pressure (e.g., missed earnings / weak guidance).",
    "Potential downside risk as investors reassess valuation and growth.",
    "Regulatory/legal or operational issues can reduce confidence and demand.",
    "Short-term volatility may increase after negative catalysts.",
  ]

  const neutralSignals = [
    "Headline appears mixed or informational with no strong directional cue.",
    "Market reaction may depend on details beyond the headline (guidance, margins, macro).",
    "Price movement may be limited unless new catalyst emerges.",
  ]

  const keyPoints =
    sentiment === "bullish"
      ? [
          `Bullish signal from headline tone (strong/positive outcome).`,
          `Confidence is high because the headline contains clear positive keywords.`,
          `Short-term buy range focuses on small pullbacks after news-driven moves.`,
          `Long-term buy range targets deeper support to manage volatility.`,
        ]
      : sentiment === "bearish"
      ? [
          `Bearish signal from headline tone (risk/weakness indicated).`,
          `Confidence is moderate-high due to negative keywords in the headline.`,
          `Short-term range is set lower to reduce downside risk.`,
          `Long-term range is more conservative for safer entries during drawdowns.`,
        ]
      : [
          `Neutral sentiment due to mixed/unclear headline signals.`,
          `Confidence is moderate because headline alone is ambiguous.`,
          `Ranges are tighter, assuming limited directional movement.`,
          `Wait for clearer catalyst or confirmation before larger position sizing.`,
        ]

  const contextExplanation =
    sentiment === "bullish"
      ? `Bullish means the news is likely to support positive market sentiment. In this case, the headline suggests strong business performance (e.g., record-breaking results / exceeded expectations), which often boosts investor confidence. The confidence score reflects how clear the positive wording is. The short-term buy range is nearer to the current price (for small pullbacks), while the long-term buy range is lower to manage volatility and improve risk-to-reward.`
      : sentiment === "bearish"
      ? `Bearish means the news is likely to create negative market sentiment. The headline suggests weakness or risk (e.g., missed expectations, declining revenue, guidance cuts, or legal/regulatory issues), which can pressure the stock. The confidence score reflects how strongly the headline implies downside risk. Buy ranges are placed lower to reduce the chance of buying into a continued drop.`
      : `Neutral means the headline does not strongly indicate upward or downward movement. The news may be mixed or require more details to judge market impact. The confidence score is moderate because the headline alone is not decisive. Buy ranges remain closer to the current price, assuming limited movement unless a new catalyst appears.`

  const summary =
    sentiment === "bullish"
      ? `Overall sentiment is bullish. The headline suggests strong company performance and likely positive investor reaction. Consider waiting for minor pullbacks for short-term entries, and aim for deeper support zones for long-term positioning.`
      : sentiment === "bearish"
      ? `Overall sentiment is bearish. The headline suggests negative pressure or risk, which may increase volatility and downside. More conservative entry ranges are recommended to manage risk.`
      : `Overall sentiment is neutral. The headline lacks a clear directional signal; market reaction may depend on details beyond the headline. A cautious approach is recommended.`

  // If you want the exact Apple example numbers:
  // AAPL $185.92 => Short: ~$182–$187, Long: ~$175–$185
  // We approximate that with the percentage logic above, but you can hardcode if needed.
  let finalShort = shortTermBuyRange
  let finalLong = longTermBuyRange
  if (news.ticker.toUpperCase() === "AAPL" && sentiment === "bullish") {
    finalShort = "$182.00 – $187.00"
    finalLong = "$175.00 – $185.00"
  }

  return {
    sentiment,
    confidence,
    summary,
    buyRange: `${finalShort} | ${finalLong}`,
    shortTermBuyRange: finalShort,
    longTermBuyRange: finalLong,
    keyPoints,
    analysisTimestamp: new Date().toLocaleString(),
    contextExplanation,
  }
}

export function NewsCard({ news }: NewsCardProps) {
  const [expanded, setExpanded] = useState(false)
  const [analysis, setAnalysis] = useState<SentimentAnalysis | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showTemplate, setShowTemplate] = useState(false)

  const analyzeSentiment = async () => {
    setIsAnalyzing(true)
    setError(null)

    // If you want UI-demo only, skip API and just fill mock.
    if (USE_MOCK_ONLY) {
      setTimeout(() => {
        setAnalysis(buildMockAnalysis(news))
        setIsAnalyzing(false)
      }, 650) // small delay so you can see "Generating..."
      return
    }

    // Otherwise try the API. If it fails, fall back to mock so UI still works.
    try {
      const response = await fetch("/api/analyze-sentiment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          headline: news.headline,
          company: news.company,
          ticker: news.ticker,
        }),
      })

      const data = await response.json()

      if (!response.ok || !data.sentiment) {
        throw new Error(data.error || "Failed to analyze sentiment")
      }

      // Ensure required fields exist (fallback gracefully)
      const safeConfidence = clamp(Number(data.confidence ?? 0.7), 0, 1)

      setAnalysis({
        sentiment: data.sentiment,
        confidence: safeConfidence,
        summary: data.summary ?? "—",
        buyRange: data.buyRange ?? "—",
        shortTermBuyRange: data.shortTermBuyRange ?? data.buyRange ?? "—",
        longTermBuyRange: data.longTermBuyRange ?? data.buyRange ?? "—",
        keyPoints: Array.isArray(data.keyPoints) ? data.keyPoints : [],
        analysisTimestamp: data.analysisTimestamp ?? new Date().toLocaleString(),
        contextExplanation: data.contextExplanation ?? "",
      })
    } catch (err) {
      console.error("Failed to analyze sentiment:", err)
      setError(err instanceof Error ? err.message : "Failed to analyze sentiment")

      // Fallback to mock so your interface still shows meaningful content
      setAnalysis(buildMockAnalysis(news))
    } finally {
      setIsAnalyzing(false)
    }
  }

  const getSentimentIcon = (sentiment: string) => {
    if (sentiment === "bullish") return <TrendingUp className="h-5 w-5" />
    if (sentiment === "bearish") return <TrendingDown className="h-5 w-5" />
    return <Minus className="h-5 w-5" />
  }

  const getSentimentColor = (sentiment: string) => {
    if (sentiment === "bullish") return "text-emerald-600 bg-emerald-50 border-emerald-200"
    if (sentiment === "bearish") return "text-red-600 bg-red-50 border-red-200"
    return "text-muted-foreground bg-muted border-border"
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }

  const formatFullDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  }

  const TemplatePanel = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          <h4 className="font-semibold text-lg">AI Analysis</h4>

          {analysis ? (
            <Badge variant="secondary" className="gap-1">
              <Sparkles className="h-3.5 w-3.5" />
              Live Result
            </Badge>
          ) : (
            <Badge variant="outline" className="gap-1">
              <Info className="h-3.5 w-3.5" />
              Template View
            </Badge>
          )}

          {isAnalyzing && (
            <Badge variant="secondary" className="gap-1">
              <Sparkles className="h-3.5 w-3.5" />
              Generating...
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Clock className="h-3.5 w-3.5" />
          Analysis timestamp:{" "}
          {analysis?.analysisTimestamp ? (
            <span>{analysis.analysisTimestamp}</span>
          ) : isAnalyzing ? (
            <Skeleton className="h-3 w-28" />
          ) : (
            <span>—</span>
          )}
        </div>
      </div>

      {/* Generate button */}
      {!analysis && (
        <div className="flex items-center gap-2 flex-wrap">
          <Button onClick={analyzeSentiment} disabled={isAnalyzing} className="gap-2">
            <Sparkles className="h-4 w-4" />
            {isAnalyzing ? "Generating..." : "Generate AI Analysis"}
          </Button>
          <p className="text-xs text-muted-foreground">
            {USE_MOCK_ONLY
              ? "(Demo mode: this fills the UI with example data — no API needed.)"
              : "(API mode: calls /api/analyze-sentiment. Falls back to example if API fails.)"}
          </p>
        </div>
      )}

      {/* Panel Content */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Sentiment */}
        <div className="rounded-lg border p-4 bg-muted/20">
          <div className="flex items-center gap-2 mb-3">
            <Target className="h-4 w-4 text-primary" />
            <h5 className="font-semibold text-sm uppercase tracking-wide">Sentiment analysis</h5>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between gap-3">
              <span className="text-muted-foreground">Bullish / Bearish / Neutral</span>
              {analysis ? (
                <Badge className={`${getSentimentColor(analysis.sentiment)} border px-3 py-1`}>
                  <span className="flex items-center gap-2">
                    {getSentimentIcon(analysis.sentiment)}
                    {analysis.sentiment.toUpperCase()}
                  </span>
                </Badge>
              ) : isAnalyzing ? (
                <Skeleton className="h-4 w-24" />
              ) : (
                <span>—</span>
              )}
            </div>

            <div className="flex items-center justify-between gap-3">
              <span className="text-muted-foreground">Confidence score</span>
              {analysis ? (
                <span className="font-semibold">{Math.round(analysis.confidence * 100)}%</span>
              ) : isAnalyzing ? (
                <Skeleton className="h-4 w-16" />
              ) : (
                <span>—</span>
              )}
            </div>
          </div>
        </div>

        {/* Stock Price */}
        <div className="rounded-lg border p-4 bg-muted/20">
          <div className="flex items-center gap-2 mb-3">
            <DollarSign className="h-4 w-4 text-primary" />
            <h5 className="font-semibold text-sm uppercase tracking-wide">Stock price</h5>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between gap-3">
              <span className="text-muted-foreground">Current stock price</span>
              <span className="font-mono font-semibold">${news.price.toFixed(2)}</span>
            </div>

            <div className="flex items-center justify-between gap-3">
              <span className="text-muted-foreground">Change percentage</span>
              <span className={`font-mono font-semibold ${news.priceChange >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                {news.priceChange >= 0 ? "+" : ""}
                {news.priceChange.toFixed(2)}%
              </span>
            </div>
          </div>
        </div>

        {/* Buy Ranges */}
        <div className="rounded-lg border p-4 bg-muted/20 md:col-span-2">
          <div className="flex items-center gap-2 mb-3">
            <Target className="h-4 w-4 text-primary" />
            <h5 className="font-semibold text-sm uppercase tracking-wide">Buy range suggestions</h5>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 text-sm">
            <div className="flex items-center justify-between gap-3">
              <span className="text-muted-foreground">Short-term (1–4 weeks)</span>
              {analysis ? (
                <span className="font-mono font-semibold">{analysis.shortTermBuyRange || analysis.buyRange}</span>
              ) : isAnalyzing ? (
                <Skeleton className="h-4 w-32" />
              ) : (
                <span>—</span>
              )}
            </div>

            <div className="flex items-center justify-between gap-3">
              <span className="text-muted-foreground">Long-term (3–12 months)</span>
              {analysis ? (
                <span className="font-mono font-semibold">{analysis.longTermBuyRange || analysis.buyRange}</span>
              ) : isAnalyzing ? (
                <Skeleton className="h-4 w-32" />
              ) : (
                <span>—</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Summary + Key Points when analysis exists */}
      {analysis && (
        <div className="space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <h5 className="font-semibold">AI Summary</h5>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">{analysis.summary}</p>
          </div>

          {analysis.keyPoints?.length > 0 && (
            <div>
              <h5 className="font-semibold mb-2">Key Points</h5>
              <ul className="space-y-2">
                {analysis.keyPoints.map((point, index) => (
                  <li key={index} className="text-sm text-muted-foreground flex gap-2">
                    <span className="text-primary font-bold">{index + 1}.</span>
                    <span className="flex-1">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <Info className="h-4 w-4 text-blue-600 mt-0.5 shrink-0" />
              <div>
                <h5 className="font-semibold text-sm text-blue-800 mb-1">Understanding This Analysis</h5>
                <p className="text-xs text-blue-700 leading-relaxed">
                  {analysis.contextExplanation ||
                    "This AI analysis is based on the headline tone and likely market reaction. Buy ranges are reference levels only."}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sentiment Explanation (always shown) */}
      <div className="rounded-lg border p-4 bg-muted/10">
        <div className="flex items-center gap-2 mb-2">
          <Info className="h-4 w-4 text-primary" />
          <h5 className="font-semibold text-sm">How to interpret the sentiment</h5>
        </div>

        <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
          <p>
            The system labels the news impact as{" "}
            <span className="font-medium text-foreground">Bullish</span>,{" "}
            <span className="font-medium text-foreground">Bearish</span>, or{" "}
            <span className="font-medium text-foreground">Neutral</span> based on headline wording and implied market
            reaction.
          </p>

          <div className="grid gap-3 md:grid-cols-3">
            <div className="rounded-md border bg-background p-3">
              <p className="font-semibold text-foreground mb-1">Bullish</p>
              <p className="text-xs">
                Positive signals like record earnings, growth, strong demand, or upgraded outlook. Often supports upward
                momentum.
              </p>
            </div>

            <div className="rounded-md border bg-background p-3">
              <p className="font-semibold text-foreground mb-1">Bearish</p>
              <p className="text-xs">
                Negative signals like missed earnings, guidance cuts, legal/regulatory issues, or declining revenue.
                Often increases downside risk.
              </p>
            </div>

            <div className="rounded-md border bg-background p-3">
              <p className="font-semibold text-foreground mb-1">Neutral</p>
              <p className="text-xs">
                Mixed/unclear signals or informational updates with limited directional impact unless a new catalyst
                appears.
              </p>
            </div>
          </div>

          <div className="rounded-md border bg-background p-3">
            <p className="font-semibold text-foreground mb-1">Confidence score</p>
            <p className="text-xs">
              Higher confidence means clearer headline signals. Lower confidence means the wording is ambiguous or mixed.
            </p>
          </div>

          <div className="rounded-md border bg-background p-3">
            <p className="font-semibold text-foreground mb-1">Buy range suggestions</p>
            <p className="text-xs">
              Short-term ranges target small pullbacks near current price. Long-term ranges aim closer to stronger support
              to manage volatility. These are reference levels, not guaranteed profit targets.
            </p>
          </div>

          <p className="text-xs italic">
            Note: Always verify with additional sources and risk management. This output is informational and not
            financial advice.
          </p>
        </div>
      </div>

      {/* Disclaimer */}
      <p className="text-xs text-muted-foreground italic text-center pt-2 border-t">
        This analysis is for informational purposes only and does not constitute financial advice.
      </p>
    </div>
  )

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-4">
        <div className="flex flex-col gap-4">
          {/* Top row */}
          <div className="flex items-center gap-3 flex-wrap">
            <span className="font-mono font-bold text-sm">{news.ticker}</span>

            <div className="flex items-center gap-1.5">
              <span className="font-mono font-semibold text-sm">${news.price.toFixed(2)}</span>
              <span
                className={`flex items-center gap-0.5 text-xs font-medium ${
                  news.priceChange >= 0 ? "text-emerald-600" : "text-red-600"
                }`}
              >
                {news.priceChange >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {Math.abs(news.priceChange).toFixed(2)}%
              </span>
            </div>

            {news.isHalal && (
              <Badge variant="outline" className="text-emerald-600 border-emerald-300 bg-emerald-50 text-xs">
                Halal ✓
              </Badge>
            )}

            <span className="text-sm text-muted-foreground">{formatDate(news.publishedAt)}</span>
          </div>

          {/* Headline */}
          <h3 className="text-lg font-semibold leading-tight text-balance">{news.headline}</h3>

          {/* Source + date */}
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="bg-primary/10 text-primary border-0 gap-1.5">
              {news.sourceIcon} {news.source}
            </Badge>
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Calendar className="h-3.5 w-3.5" />
              {formatFullDate(news.publishedAt)}
            </div>
          </div>

          {/* Key points + button */}
          <div className="flex flex-col lg:flex-row gap-4 pt-2">
            <div className="flex-1 border-l-4 border-primary/30 pl-4">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Key Points:</p>
              <ul className="space-y-1.5">
                {news.summary.map((point, index) => (
                  <li key={index} className="text-sm text-foreground/80 flex gap-2 leading-relaxed">
                    <span className="text-muted-foreground shrink-0">-</span>
                    <span className="flex-1">{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:w-56 shrink-0">
              <Button
                onClick={() => {
                  setExpanded(!expanded)
                  setShowTemplate(true)
                  setError(null)
                  setAnalysis(null)
                  setIsAnalyzing(false)
                }}
                className="w-full gap-2"
              >
                <Sparkles className="h-4 w-4" />
                View AI Analysis
              </Button>
            </div>
          </div>

          {/* Read more */}
          <div className="pt-2">
            <a
              href={news.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
            >
              Read more
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </CardHeader>

      {expanded && (
        <CardContent className="pt-0">
          <div className="border-t pt-4">
            {showTemplate && <TemplatePanel />}

            {error && (
              <div className="text-center py-4">
                <p className="text-sm text-destructive mb-3">{error}</p>
                <div className="flex items-center justify-center gap-2">
                  <Button variant="outline" size="sm" onClick={analyzeSentiment} disabled={isAnalyzing}>
                    Try Again
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setError(null)
                      setAnalysis(buildMockAnalysis(news))
                    }}
                  >
                    Use Example Data
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  )
}
