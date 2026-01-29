"use client"

import { useMemo, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { NewsCard } from "@/components/news-card"

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

type NewsDashboardProps = {
  /** search controlled by your HEADER (top search bar) */
  searchQuery?: string
  /** halal filter controlled by your HEADER button/toggle */
  halalOnly?: boolean
}

export function NewsDashboard({ searchQuery = "", halalOnly = false }: NewsDashboardProps) {
  const [news] = useState(mockNewsData)
  const [favoriteStocks, setFavoriteStocks] = useState<string[]>([])

  const toggleFavorite = (ticker: string) => {
    setFavoriteStocks((prev) => (prev.includes(ticker) ? prev.filter((t) => t !== ticker) : [...prev, ticker]))
  }

  const filteredNews = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    return news.filter((item) => {
      const matchesHalal = halalOnly ? item.isHalal : true
      const matchesSearch = q
        ? item.company.toLowerCase().includes(q) || item.ticker.toLowerCase().includes(q)
        : true
      return matchesHalal && matchesSearch
    })
  }, [news, searchQuery, halalOnly])

  const Feed = ({ items }: { items: typeof filteredNews }) => (
    <div className="grid gap-4">
      {items.map((item) => (
        <NewsCard
          key={item.id}
          news={item}
          isFavorite={favoriteStocks.includes(item.ticker)}
          onToggleFavorite={toggleFavorite}
        />
      ))}
    </div>
  )

  return (
    <div className="space-y-5">
      {/* Tabs (more premium) */}
      <Tabs defaultValue="all" className="w-full">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <TabsList className="rounded-xl bg-white/70 border border-slate-200 shadow-sm p-1">
            <TabsTrigger value="all" className="rounded-lg px-3">
              All News
            </TabsTrigger>
            <TabsTrigger value="earnings" className="rounded-lg px-3">
              Earnings
            </TabsTrigger>
            <TabsTrigger value="market" className="rounded-lg px-3">
              Market Updates
            </TabsTrigger>
            <TabsTrigger value="dividends" className="rounded-lg px-3">
              Dividends
            </TabsTrigger>
          </TabsList>

          {/* Optional: show result count (nice + professional) */}
          <div className="text-xs text-slate-500">
            Showing <span className="font-medium text-slate-900">{filteredNews.length}</span> articles
          </div>
        </div>

        <TabsContent value="all" className="mt-6">
          <Feed items={filteredNews} />
        </TabsContent>

        <TabsContent value="earnings" className="mt-6">
          <Feed items={filteredNews.filter((i) => i.category === "earnings")} />
        </TabsContent>

        <TabsContent value="market" className="mt-6">
          <Feed items={filteredNews.filter((i) => i.category === "market")} />
        </TabsContent>

        <TabsContent value="dividends" className="mt-6">
          <Feed items={filteredNews.filter((i) => i.category === "dividends")} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
