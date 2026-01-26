"use client"

import { CardTitle } from "@/components/ui/card"
import { CardDescription } from "@/components/ui/card"
import { CardHeader } from "@/components/ui/card"
import { Card } from "@/components/ui/card"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search } from "lucide-react"
import { NewsCard } from "@/components/news-card"
import { HalalFilterToggle } from "@/components/halal-filter-toggle"
import { Input } from "@/components/ui/input"
import { Sparkles, TrendingUp, TrendingDown } from "lucide-react"

const mockNewsData = [
  {
    id: "1",
    company: "Apple Inc.",
    ticker: "AAPL",
    headline: "Apple announces record-breaking Q4 earnings, iPhone sales exceed expectations",
    source: "Financial Times",
    sourceIcon: "📰",
    url: "https://www.ft.com/apple-q4-earnings",
    publishedAt: "2024-01-15T10:30:00Z",
    category: "earnings",
    isHalal: true,
    price: 185.92,
    priceChange: 2.35,
    summary: [
      "Q4 revenue reaches $119.6 billion, up 2% year-over-year",
      "iPhone revenue grew 6% driven by strong iPhone 15 Pro demand",
      "Services business hits all-time high with $22.3 billion revenue",
      "Company maintains strong gross margin of 45.2%",
    ],
  },
  {
    id: "2",
    company: "Microsoft Corporation",
    ticker: "MSFT",
    headline: "Microsoft Cloud revenue surges 25% as AI adoption accelerates across enterprise",
    source: "Bloomberg",
    sourceIcon: "📊",
    url: "https://www.bloomberg.com/microsoft-cloud-ai",
    publishedAt: "2024-01-15T09:15:00Z",
    category: "earnings",
    isHalal: true,
    price: 412.78,
    priceChange: 3.87,
    summary: [
      "Azure and cloud services revenue increased 30% year-over-year",
      "AI services now contribute $3.2 billion in quarterly revenue",
      "Enterprise adoption of Copilot exceeds 40,000 organizations",
      "Operating margin expands to 47% as efficiency improvements continue",
    ],
  },
  {
    id: "3",
    company: "JPMorgan Chase",
    ticker: "JPM",
    headline: "JPMorgan reports strong Q4 results driven by investment banking recovery",
    source: "Reuters",
    sourceIcon: "📡",
    url: "https://www.reuters.com/jpmorgan-q4-results",
    publishedAt: "2024-01-15T08:45:00Z",
    category: "earnings",
    isHalal: false,
    price: 168.45,
    priceChange: 1.92,
    summary: [
      "Investment banking fees surge 35% as M&A activity rebounds",
      "Net income rises to $12.6 billion, beating analyst estimates",
      "Trading revenue remains strong with fixed income up 8%",
      "Management raises full-year 2024 guidance on improved outlook",
    ],
  },
  {
    id: "4",
    company: "Tesla Inc.",
    ticker: "TSLA",
    headline: "Tesla faces delivery challenges in China amid increased competition from local manufacturers",
    source: "Wall Street Journal",
    sourceIcon: "📈",
    url: "https://www.wsj.com/tesla-china-challenges",
    publishedAt: "2024-01-14T16:20:00Z",
    category: "market",
    isHalal: true,
    price: 238.52,
    priceChange: -2.18,
    summary: [
      "China deliveries down 12% quarter-over-quarter amid price pressure",
      "BYD and local competitors gain market share with aggressive pricing",
      "Tesla reduces prices by 5-8% across Model 3 and Model Y in China",
      "Company accelerates production of updated Model Y to boost demand",
    ],
  },
  {
    id: "5",
    company: "Saudi Aramco",
    ticker: "ARAMCO",
    headline: "Saudi Aramco maintains dividend despite oil price volatility, focuses on sustainability",
    source: "Arab News",
    sourceIcon: "🌍",
    url: "https://www.arabnews.com/aramco-dividend-sustainability",
    publishedAt: "2024-01-14T12:00:00Z",
    category: "dividends",
    isHalal: true,
    price: 28.45,
    priceChange: 0.75,
    summary: [
      "Quarterly dividend maintained at $0.27 per share despite price volatility",
      "Company invests $15 billion in carbon capture and renewable projects",
      "Oil production capacity expansion on track for 13 million bpd by 2027",
      "Free cash flow remains robust at $28.4 billion for the quarter",
    ],
  },
  {
    id: "6",
    company: "Nvidia Corporation",
    ticker: "NVDA",
    headline: "Nvidia GPU demand remains strong as AI infrastructure buildout continues globally",
    source: "CNBC",
    sourceIcon: "📺",
    url: "https://www.cnbc.com/nvidia-gpu-demand-ai",
    publishedAt: "2024-01-14T11:30:00Z",
    category: "market",
    isHalal: true,
    price: 521.67,
    priceChange: 5.24,
    summary: [
      "Data center revenue expected to exceed $18 billion this quarter",
      "H100 and H200 GPUs remain sold out through first half of 2024",
      "New AI chip customers include major cloud providers and enterprises",
      "Company guides for continued strong growth in AI infrastructure spend",
    ],
  },
]

export function NewsDashboard() {
  const [news, setNews] = useState(mockNewsData)
  const [halalFilterEnabled, setHalalFilterEnabled] = useState(false)
  const [favoriteStocks, setFavoriteStocks] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState("")

  const toggleFavorite = (ticker: string) => {
    setFavoriteStocks((prev) => (prev.includes(ticker) ? prev.filter((t) => t !== ticker) : [...prev, ticker]))
  }

  const filteredNews = news.filter((item) => {
    const matchesHalal = halalFilterEnabled ? item.isHalal : true
    const matchesSearch = searchQuery
      ? item.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.ticker.toLowerCase().includes(searchQuery.toLowerCase())
      : true
    return matchesHalal && matchesSearch
  })

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col gap-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-balance mb-2">Financial News AI</h1>
            <p className="text-muted-foreground text-lg">
              AI-powered sentiment analysis for smarter investment decisions
            </p>
          </div>
          <HalalFilterToggle enabled={halalFilterEnabled} onToggle={setHalalFilterEnabled} />
        </div>

        {/* Search Input */}
        <div className="relative max-w-xl">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by company name or ticker..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        </div>

      {/* News Feed */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">All News</TabsTrigger>
          <TabsTrigger value="earnings">Earnings</TabsTrigger>
          <TabsTrigger value="market">Market Updates</TabsTrigger>
          <TabsTrigger value="dividends">Dividends</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <div className="grid gap-4">
            {filteredNews.map((item) => (
              <NewsCard
                key={item.id}
                news={item}
                isFavorite={favoriteStocks.includes(item.ticker)}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="earnings" className="mt-6">
          <div className="grid gap-4">
            {filteredNews
              .filter((item) => item.category === "earnings")
              .map((item) => (
                <NewsCard
                  key={item.id}
                  news={item}
                  isFavorite={favoriteStocks.includes(item.ticker)}
                  onToggleFavorite={toggleFavorite}
                />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="market" className="mt-6">
          <div className="grid gap-4">
            {filteredNews
              .filter((item) => item.category === "market")
              .map((item) => (
                <NewsCard
                  key={item.id}
                  news={item}
                  isFavorite={favoriteStocks.includes(item.ticker)}
                  onToggleFavorite={toggleFavorite}
                />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="dividends" className="mt-6">
          <div className="grid gap-4">
            {filteredNews
              .filter((item) => item.category === "dividends")
              .map((item) => (
                <NewsCard
                  key={item.id}
                  news={item}
                  isFavorite={favoriteStocks.includes(item.ticker)}
                  onToggleFavorite={toggleFavorite}
                />
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
