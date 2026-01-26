"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TrendingUp, TrendingDown, Minus, Sparkles, ExternalLink, Calendar, Clock, DollarSign, Target, Brain, Info } from "lucide-react"
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

export function NewsCard({ news, isFavorite, onToggleFavorite }: NewsCardProps) {
  const [expanded, setExpanded] = useState(false)
  const [analysis, setAnalysis] = useState<SentimentAnalysis | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (expanded && !analysis && !error) {
      analyzeSentiment()
    }
  }, [expanded])

  const analyzeSentiment = async () => {
    setIsAnalyzing(true)
    setError(null)
    setAnalysis(null)

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

      setAnalysis(data)
    } catch (error) {
      console.error("Failed to analyze sentiment:", error)
      setError(
        error instanceof Error ? error.message : "Unable to analyze sentiment at this time. Please try again later.",
      )
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

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-4">
        <div className="flex flex-col gap-4">
          {/* Top row: Ticker, Price, Halal badge, Date, Favorite */}
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

          {/* Source and date */}
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="bg-primary/10 text-primary border-0 gap-1.5">
              {news.sourceIcon} {news.source}
            </Badge>
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Calendar className="h-3.5 w-3.5" />
              {formatFullDate(news.publishedAt)}
            </div>
          </div>

          {/* Key Points and AI Analysis Button - Side by Side */}
          <div className="flex flex-col lg:flex-row gap-4 pt-2">
            {/* Key Points */}
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

            {/* AI Analysis Button */}
            <div className="lg:w-56 shrink-0">
              <Button
                onClick={() => setExpanded(!expanded)}
                className={`w-full gap-2 ${expanded ? "bg-primary" : "bg-primary"}`}
              >
                <Sparkles className="h-4 w-4" />
                AI Analysis
              </Button>
            </div>
          </div>

          {/* Read More Link */}
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
            {isAnalyzing ? (
              <div className="space-y-3">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            ) : error ? (
              <div className="text-center py-4">
                <p className="text-sm text-destructive mb-3">{error}</p>
                <Button variant="outline" size="sm" onClick={analyzeSentiment}>
                  Try Again
                </Button>
              </div>
            ) : analysis && analysis.sentiment ? (
              <div className="space-y-6">
                {/* Analysis Header with Timestamp */}
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-primary" />
                    <h4 className="font-semibold text-lg">AI Analysis</h4>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" />
                    Analysis performed: {analysis.analysisTimestamp || new Date().toLocaleString()}
                  </div>
                </div>

                {/* Sentiment Analysis Section */}
                <div className="bg-muted/30 rounded-lg p-4 border">
                  <div className="flex items-center gap-2 mb-3">
                    <Target className="h-4 w-4 text-primary" />
                    <h5 className="font-semibold text-sm uppercase tracking-wide">Sentiment Analysis</h5>
                  </div>
                  <div className="flex items-center gap-4 flex-wrap">
                    <Badge
                      className={`${getSentimentColor(analysis.sentiment)} flex items-center gap-2 px-4 py-2 text-sm font-semibold`}
                    >
                      {getSentimentIcon(analysis.sentiment)}
                      {analysis.sentiment.toUpperCase()}
                    </Badge>
                    <div className="flex flex-col">
                      <span className="text-xs text-muted-foreground">Confidence Score</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${analysis.sentiment === 'bullish' ? 'bg-emerald-500' : analysis.sentiment === 'bearish' ? 'bg-red-500' : 'bg-gray-500'}`}
                            style={{ width: `${Math.round(analysis.confidence * 100)}%` }}
                          />
                        </div>
                        <span className="font-semibold text-sm">{Math.round(analysis.confidence * 100)}%</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Current Stock Price Section */}
                <div className="bg-muted/30 rounded-lg p-4 border">
                  <div className="flex items-center gap-2 mb-3">
                    <DollarSign className="h-4 w-4 text-primary" />
                    <h5 className="font-semibold text-sm uppercase tracking-wide">Current Stock Price</h5>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-3xl font-mono font-bold">${news.price.toFixed(2)}</span>
                    <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                      news.priceChange >= 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {news.priceChange >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                      {news.priceChange >= 0 ? '+' : ''}{news.priceChange.toFixed(2)}%
                    </div>
                  </div>
                </div>

                {/* Buy Range Suggestions */}
                <div className="bg-muted/30 rounded-lg p-4 border">
                  <div className="flex items-center gap-2 mb-3">
                    <Target className="h-4 w-4 text-primary" />
                    <h5 className="font-semibold text-sm uppercase tracking-wide">Suggested Buy Ranges</h5>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-background rounded-lg p-3 border">
                      <p className="text-xs text-muted-foreground mb-1">Short-term (1-4 weeks)</p>
                      <p className="text-lg font-mono font-bold text-primary">{analysis.shortTermBuyRange || analysis.buyRange}</p>
                    </div>
                    <div className="bg-background rounded-lg p-3 border">
                      <p className="text-xs text-muted-foreground mb-1">Long-term (3-12 months)</p>
                      <p className="text-lg font-mono font-bold text-primary">{analysis.longTermBuyRange || analysis.buyRange}</p>
                    </div>
                  </div>
                </div>

                {/* AI Summary */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    <h5 className="font-semibold">AI Summary</h5>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{analysis.summary}</p>
                </div>

                {/* Key Points */}
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

                {/* Context Explanation */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <Info className="h-4 w-4 text-blue-600 mt-0.5 shrink-0" />
                    <div>
                      <h5 className="font-semibold text-sm text-blue-800 mb-1">Understanding This Analysis</h5>
                      <p className="text-xs text-blue-700 leading-relaxed">
                        {analysis.contextExplanation || "This AI analysis is based on the news headline and market sentiment. The suggested buy ranges are derived from technical analysis patterns and should be used as reference points only. Always conduct your own research and consider your risk tolerance before making investment decisions."}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Disclaimer */}
                <p className="text-xs text-muted-foreground italic text-center pt-2 border-t">
                  This analysis is for informational purposes only and does not constitute financial advice.
                </p>
              </div>
            ) : null}
          </div>
        </CardContent>
      )}
    </Card>
  )
}
