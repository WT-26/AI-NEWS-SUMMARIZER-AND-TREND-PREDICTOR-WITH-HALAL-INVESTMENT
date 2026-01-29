"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { NewsDashboard } from "@/components/news-dashboard"
import AuthButtonsClient from "@/components/ui/auth-buttons-client"
import { auth } from "@/lib/auth"
import { Sparkles, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export default function HomeDashboardPage() {
  const router = useRouter()

  // Header controls
  const [searchQuery, setSearchQuery] = useState("")
  const [halalOnly, setHalalOnly] = useState(false)

  useEffect(() => {
    if (!auth.isLoggedIn()) router.replace("/")
  }, [router])

  return (
    <div className="min-h-screen relative app-gradient">
      {/* Optional glow — keep light */}
      <div className="absolute inset-x-0 top-0 -z-10 h-[320px] bg-gradient-to-r from-sky-200 via-indigo-200 to-fuchsia-200 blur-3xl opacity-25" />
      <div className="absolute inset-x-0 top-20 -z-10 h-[220px] bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.9),transparent_60%)] opacity-40" />

      {/* Top strip (keep it slim) */}
      <div className="relative overflow-hidden border-b bg-gradient-to-r from-sky-600 via-indigo-600 to-fuchsia-600">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_25%_15%,white,transparent_50%)]" />
        <div className="container mx-auto px-4 max-w-7xl py-2">
          <div className="relative flex items-center justify-between text-white gap-3">
            <div className="flex items-center gap-2 text-sm">
              <Sparkles className="h-4 w-4" />
              <span className="font-medium">AI Market Insights</span>
              <span className="hidden sm:inline opacity-80">• summaries • sentiment • buy range • halal</span>
            </div>

            {/* Keep right side minimal */}
            <div className="hidden md:flex items-center gap-2">
              <Badge className="bg-white/15 text-white border border-white/20">News</Badge>
              <Badge className="bg-white/15 text-white border border-white/20">Screening</Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-md">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex items-center justify-between h-16 gap-3">
            {/* Left: brand mark + feature chips */}
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-sky-600 to-indigo-600 text-white shadow-sm">
                <Sparkles className="h-5 w-5" />
              </div>

              <div className="hidden lg:flex items-center gap-2">
                <Badge variant="secondary" className="bg-white/70 border border-slate-200 text-slate-700">
                  Summaries
                </Badge>
                <Badge variant="secondary" className="bg-white/70 border border-slate-200 text-slate-700">
                  Sentiment
                </Badge>
                <Badge variant="secondary" className="bg-white/70 border border-slate-200 text-slate-700">
                  Buy Range
                </Badge>
              </div>
            </div>

            {/* Middle: search (wired to dashboard) */}
            <div className="hidden md:flex flex-1 max-w-xl">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search ticker, company, or topic…"
                  className="pl-10 rounded-xl bg-white/70 border-slate-200 focus-visible:ring-slate-300"
                />
              </div>
            </div>

            {/* Right: halal toggle + auth */}
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant={halalOnly ? "default" : "outline"}
                onClick={() => setHalalOnly((v) => !v)}
                className="rounded-xl"
              >
                {halalOnly ? "Halal Only: ON" : "Halal Only"}
              </Button>

              <AuthButtonsClient />
            </div>
          </div>

          {/* Mobile search row */}
          <div className="md:hidden pb-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search ticker, company, or topic…"
                className="pl-10 rounded-xl bg-white/80 border-slate-200"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 max-w-7xl py-7">
        {/* Small, professional context line (no demo badges) */}
        <div className="mb-5 flex items-center justify-between">
          <p className="text-sm text-slate-600">
            <span className="font-medium text-slate-900">Today’s feed</span> — curated headlines with AI insights.
          </p>
        </div>

        {/* Pass header controls down */}
        <NewsDashboard searchQuery={searchQuery} halalOnly={halalOnly} />
      </main>

      <footer className="container mx-auto px-4 max-w-7xl pb-8">
        <p className="text-center text-xs text-slate-500">
          This dashboard provides informational insights only and does not constitute financial advice.
        </p>
      </footer>
    </div>
  )
}
