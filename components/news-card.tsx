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
  analysisTimestamp: string
  contextExplanation: string

  // AI Explanation
  explanationTitle: string
  explanationBullets: string[]
}

const USE_MOCK_ONLY = true

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n))
}

function formatUSD(n: number) {
  return `$${n.toFixed(2)}`
}

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
  else if (isBullish && isBearish) sentiment = "neutral"

  const confidence = sentiment === "bullish" ? 0.82 : sentiment === "bearish" ? 0.78 : 0.62

  const price = news.price
  const shortLow =
    sentiment === "bullish" ? price * 0.98 : sentiment === "bearish" ? price * 0.93 : price * 0.985
  const shortHigh =
    sentiment === "bullish" ? price * 1.01 : sentiment === "bearish" ? price * 0.97 : price * 1.005

  const longLow =
    sentiment === "bullish" ? price * 0.94 : sentiment === "bearish" ? price * 0.88 : price * 0.96
  const longHigh =
    sentiment === "bullish" ? price * 0.995 : sentiment === "bearish" ? price * 0.95 : price * 0.99

  let shortTermBuyRange = `${formatUSD(shortLow)} – ${formatUSD(shortHigh)}`
  let longTermBuyRange = `${formatUSD(longLow)} – ${formatUSD(longHigh)}`

  if (news.ticker.toUpperCase() === "AAPL" && sentiment === "bullish") {
    shortTermBuyRange = "$182.00 – $187.00"
    longTermBuyRange = "$175.00 – $185.00"
  }

  // ✅ NEW: Explanation section mock data
  let explanationTitle = "Why this is Neutral"
  let explanationBullets = [
    "Headline looks informational or mixed with no strong direction.",
    "Market reaction depends on deeper details (guidance, margins, macro).",
    "Confidence is lower because headline signals are not decisive.",
    "Ranges stay tighter because movement may be limited without a catalyst.",
  ]

  if (sentiment === "bullish") {
    explanationTitle = "Why this is Bullish"
    explanationBullets = [
      "Headline uses strong positive language (record / exceeds / strong growth).",
      "Positive earnings tone usually boosts investor confidence.",
      "Momentum often continues after strong results, but pullbacks can happen.",
      "Buy ranges target pullbacks to reduce the risk of chasing the price.",
    ]
  }

  if (sentiment === "bearish") {
    explanationTitle = "Why this is Bearish"
    explanationBullets = [
      "Headline implies weakness (miss / decline / guidance cut / risk).",
      "Negative catalysts often increase volatility and downside pressure.",
      "Investors may reduce exposure until clearer recovery signals appear.",
      "Buy ranges are placed lower to avoid entering too early during a drop.",
    ]
  }

  const contextExplanation =
    "This analysis is generated from headline tone and typical market reaction patterns. Buy ranges are reference levels only."

  const summary =
    sentiment === "bullish"
      ? "Overall sentiment is bullish. Consider small pullbacks for short-term entries, and deeper support zones for long-term positioning."
      : sentiment === "bearish"
      ? "Overall sentiment is bearish. Consider more conservative entries and tighter risk management due to downside volatility."
      : "Overall sentiment is neutral. Market reaction may depend on deeper details beyond the headline."

  return {
    sentiment,
    confidence,
    summary,
    buyRange: `${shortTermBuyRange} | ${longTermBuyRange}`,
    shortTermBuyRange,
    longTermBuyRange,
    analysisTimestamp: new Date().toLocaleString(),
    contextExplanation,

    explanationTitle,
    explanationBullets,
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

    if (USE_MOCK_ONLY) {
      setTimeout(() => {
        setAnalysis(buildMockAnalysis(news))
        setIsAnalyzing(false)
      }, 650)
      return
    }

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

      if (!response.ok || !data.sentiment) throw new Error(data.error || "Failed to analyze sentiment")

      const safeConfidence = clamp(Number(data.confidence ?? 0.7), 0, 1)

      setAnalysis({
        sentiment: data.sentiment,
        confidence: safeConfidence,
        summary: data.summary ?? "—",
        buyRange: data.buyRange ?? "—",
        shortTermBuyRange: data.shortTermBuyRange ?? data.buyRange ?? "—",
        longTermBuyRange: data.longTermBuyRange ?? data.buyRange ?? "—",
        analysisTimestamp: data.analysisTimestamp ?? new Date().toLocaleString(),
        contextExplanation: data.contextExplanation ?? "",

        // ✅ fallback if API doesn't provide explanation
        explanationTitle: data.explanationTitle ?? "AI Explanation",
        explanationBullets: Array.isArray(data.explanationBullets) ? data.explanationBullets : [],
      })
    } catch (err) {
      console.error("Failed to analyze sentiment:", err)
      setError(err instanceof Error ? err.message : "Failed to analyze sentiment")
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
    if (sentiment === "bullish") return "text-emerald-700 bg-emerald-50 border-emerald-200"
    if (sentiment === "bearish") return "text-red-700 bg-red-50 border-red-200"
    return "text-slate-700 bg-slate-50 border-slate-200"
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
      {/* Top row */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          <h4 className="font-semibold text-lg">AI Analysis</h4>

          {analysis ? (
            <Badge variant="secondary" className="gap-1">
              <Sparkles className="h-3.5 w-3.5" />
              Result
            </Badge>
          ) : (
            <Badge variant="outline" className="gap-1">
              <Info className="h-3.5 w-3.5" />
              Preview
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
          {analysis?.analysisTimestamp ? (
            <span>{analysis.analysisTimestamp}</span>
          ) : isAnalyzing ? (
            <Skeleton className="h-3 w-28" />
          ) : (
            <span>—</span>
          )}
        </div>
      </div>

      {!analysis && (
        <div className="flex items-center gap-2">
          <Button onClick={analyzeSentiment} disabled={isAnalyzing} className="gap-2">
            <Sparkles className="h-4 w-4" />
            {isAnalyzing ? "Generating..." : "Generate AI Analysis"}
          </Button>
        </div>
      )}

      {/* Main metrics */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border p-4 bg-muted/20">
          <div className="flex items-center gap-2 mb-3">
            <Target className="h-4 w-4 text-primary" />
            <h5 className="font-semibold text-sm uppercase tracking-wide">Sentiment</h5>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between gap-3">
              <span className="text-muted-foreground">Signal</span>
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
              <span className="text-muted-foreground">Confidence</span>
              {analysis ? <span className="font-semibold">{Math.round(analysis.confidence * 100)}%</span> : <span>—</span>}
            </div>
          </div>
        </div>

        <div className="rounded-xl border p-4 bg-muted/20">
          <div className="flex items-center gap-2 mb-3">
            <DollarSign className="h-4 w-4 text-primary" />
            <h5 className="font-semibold text-sm uppercase tracking-wide">Price</h5>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between gap-3">
              <span className="text-muted-foreground">Current</span>
              <span className="font-mono font-semibold">${news.price.toFixed(2)}</span>
            </div>

            <div className="flex items-center justify-between gap-3">
              <span className="text-muted-foreground">Change</span>
              <span className={`font-mono font-semibold ${news.priceChange >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                {news.priceChange >= 0 ? "+" : ""}
                {news.priceChange.toFixed(2)}%
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-xl border p-4 bg-muted/20 md:col-span-2">
          <div className="flex items-center gap-2 mb-3">
            <Target className="h-4 w-4 text-primary" />
            <h5 className="font-semibold text-sm uppercase tracking-wide">Buy Range</h5>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 text-sm">
            <div className="flex items-center justify-between gap-3">
              <span className="text-muted-foreground">Short-term</span>
              {analysis ? <span className="font-mono font-semibold">{analysis.shortTermBuyRange}</span> : <span>—</span>}
            </div>

            <div className="flex items-center justify-between gap-3">
              <span className="text-muted-foreground">Long-term</span>
              {analysis ? <span className="font-mono font-semibold">{analysis.longTermBuyRange}</span> : <span>—</span>}
            </div>
          </div>
        </div>
      </div>

      {/* Summary + explanation */}
      {analysis && (
        <div className="space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <h5 className="font-semibold">AI Summary</h5>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">{analysis.summary}</p>
          </div>

          {/*  NEW: AI Explanation */}
          {analysis.explanationBullets?.length > 0 && (
            <div className="rounded-xl border bg-white p-4">
              <h5 className="font-semibold mb-2">{analysis.explanationTitle}</h5>
              <ul className="space-y-2">
                {analysis.explanationBullets.map((b, i) => (
                  <li key={i} className="text-sm text-muted-foreground flex gap-2">
                    <span className="text-primary font-bold">{i + 1}.</span>
                    <span className="flex-1">{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Sentiment visual indicators note */}
          <div className="rounded-xl border bg-muted/10 p-4">
            <div className="flex items-start gap-2">
              <Info className="h-4 w-4 text-primary mt-0.5 shrink-0" />
              <div className="space-y-2">
                <p className="font-semibold text-sm">Sentiment Visual Indicators</p>

                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>
                    <span className="font-medium text-emerald-700">• Bullish:</span> Green icon/color
                  </li>
                  <li>
                    <span className="font-medium text-red-700">• Bearish:</span> Red icon/color
                  </li>
                  <li>
                    <span className="font-medium text-slate-700">• Neutral:</span> Gray icon/color
                  </li>
                </ul>

                <p className="text-sm text-muted-foreground">
                  System shows <span className="font-medium text-foreground">confidence percentage</span>.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-start gap-2">
              <Info className="h-4 w-4 text-blue-600 mt-0.5 shrink-0" />
              <div>
                <h5 className="font-semibold text-sm text-blue-800 mb-1">Note</h5>
                <p className="text-xs text-blue-700 leading-relaxed">
                  {analysis.contextExplanation ||
                    "This AI analysis is based on headline tone and likely market reaction. Buy ranges are reference levels only."}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <p className="text-[11px] text-muted-foreground text-center pt-2 border-t">
        Informational only — not financial advice.
      </p>
    </div>
  )

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-4">
        <div className="flex flex-col gap-4">
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

            {news.isHalal ? (
              <Badge className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200">
                ✅ Halal Compliant
              </Badge>
            ) : (
              <Badge className="text-xs bg-red-50 text-red-700 border border-red-200">
                ❌ Non-Halal
              </Badge>
            )}
            <span className="text-sm text-muted-foreground">{formatDate(news.publishedAt)}</span>
          </div>

          <h3 className="text-lg font-semibold leading-tight text-balance">{news.headline}</h3>

          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="bg-primary/10 text-primary border-0 gap-1.5">
              {news.sourceIcon} {news.source}
            </Badge>
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Calendar className="h-3.5 w-3.5" />
              {formatFullDate(news.publishedAt)}
            </div>
          </div>

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
