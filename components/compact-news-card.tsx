"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, ExternalLink, Sparkles, TrendingDown, TrendingUp } from "lucide-react"

type CompactNewsCardProps = {
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
  onOpenAnalysis: (id: string) => void
}

function formatDate(dateString: string) {
  const d = new Date(dateString)
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" })
}

export function CompactNewsCard({ news, onOpenAnalysis }: CompactNewsCardProps) {
  return (
    <Card className="hover:shadow-sm transition-shadow">
      <CardHeader className="pb-2">
        {/* Top row */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-xs">{news.ticker}</span>
            <span className="font-mono text-xs text-slate-600">${news.price.toFixed(2)}</span>

            <span
              className={`text-xs font-medium flex items-center gap-1 ${
                news.priceChange >= 0 ? "text-emerald-600" : "text-red-600"
              }`}
            >
              {news.priceChange >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {news.priceChange >= 0 ? "+" : ""}
              {news.priceChange.toFixed(2)}%
            </span>
          </div>

          <div className="flex items-center gap-2">
            {news.isHalal ? (
              <Badge className="text-[11px] bg-emerald-50 text-emerald-700 border border-emerald-200">
                ✅ Halal
              </Badge>
            ) : (
              <Badge className="text-[11px] bg-red-50 text-red-700 border border-red-200">
                ❌ Non-Halal
              </Badge>
            )}
          </div>
        </div>

        {/* Headline */}
        <p className="mt-2 text-sm font-semibold leading-snug line-clamp-2">
          {news.headline}
        </p>

        {/* Source + date */}
        <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
          <span className="truncate">
            {news.sourceIcon} {news.source}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {formatDate(news.publishedAt)}
          </span>
        </div>
      </CardHeader>

      <CardContent className="pt-0 space-y-3">
        {/* Small key points (1-2 only, smaller) */}
        <ul className="text-xs text-slate-600 space-y-1">
          {(news.summary ?? []).slice(0, 2).map((s, idx) => (
            <li key={idx} className="line-clamp-1">
              • {s}
            </li>
          ))}
        </ul>

        {/* Bottom actions */}
        <div className="flex items-center justify-between gap-2 pt-1">
          <a
            href={news.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-primary inline-flex items-center gap-1 hover:underline"
          >
            Read <ExternalLink className="h-3 w-3" />
          </a>

          <Button
            size="sm"
            className="h-8 text-xs px-3 rounded-lg gap-1"
            onClick={() => onOpenAnalysis(news.id)}
          >
            <Sparkles className="h-3.5 w-3.5" />
            AI Analysis
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
