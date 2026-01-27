"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { NewsDashboard } from "@/components/news-dashboard"
import AuthButtonsClient from "@/components/ui/auth-buttons-client"
import { auth } from "@/lib/auth"
import { Sparkles, Search, TrendingUp, ShieldCheck } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

export default function HomeDashboardPage() {
  const router = useRouter()

  useEffect(() => {
    if (!auth.isLoggedIn()) router.replace("/")
  }, [router])

  return (
    <div className="min-h-screen relative bg-gradient-to-b from-slate-50 via-white to-slate-50">
      {/* Premium glow */}
      <div className="absolute inset-x-0 top-0 -z-10 h-[380px] bg-gradient-to-r from-sky-200 via-indigo-200 to-fuchsia-200 blur-3xl opacity-60" />
      <div className="absolute inset-x-0 top-28 -z-10 h-[260px] bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.95),transparent_55%)]" />

      {/* Top strip */}
      <div className="relative overflow-hidden border-b bg-gradient-to-r from-sky-600 via-indigo-600 to-fuchsia-600">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_25%_15%,white,transparent_50%)]" />
        <div className="container mx-auto px-4 max-w-7xl py-2">
          <div className="relative flex items-center justify-between gap-3 text-white">
            <div className="flex items-center gap-2 text-sm">
              <Sparkles className="h-4 w-4" />
              <span className="font-medium">AI Market Insights</span>
              <span className="hidden sm:inline opacity-80">• sentiment • buy range • halal filter</span>
            </div>

            <div className="hidden md:flex items-center gap-2">
              <Badge className="bg-white/15 text-white border border-white/20">
                <TrendingUp className="h-3.5 w-3.5 mr-1" />
                Live Updates
              </Badge>
              <Badge className="bg-white/15 text-white border border-white/20">
                <ShieldCheck className="h-3.5 w-3.5 mr-1" />
                Halal Screening
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-white/75 backdrop-blur-md">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex items-center justify-between h-16 gap-3">
            {/* Left: icon only */}
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-sky-600 to-indigo-600 text-white shadow-sm">
                <Sparkles className="h-5 w-5" />
              </div>

              {/* subtle chips */}
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

            {/* Center: search bar */}
            <div className="hidden md:flex flex-1 max-w-xl">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <Input
                  placeholder="Search ticker, company, or topic…"
                  className="pl-10 rounded-xl bg-white/70 border-slate-200 focus-visible:ring-slate-300"
                />
              </div>
            </div>

            {/* Right */}
            <AuthButtonsClient />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 max-w-7xl py-8">
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="text-sm text-slate-600">
            <span className="font-medium text-slate-900">Today’s feed</span> • curated headlines with AI insights and filters.
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge className="rounded-full bg-white/70 text-slate-700 border border-slate-200">
              Updated: just now
            </Badge>
            <Badge className="rounded-full bg-white/70 text-slate-700 border border-slate-200">
              Mode: Demo (UI-only)
            </Badge>
          </div>
        </div>

        <NewsDashboard />
      </main>

      <footer className="container mx-auto px-4 max-w-7xl pb-8">
        <p className="text-center text-xs text-slate-500">
          This dashboard provides informational insights only and does not constitute financial advice.
        </p>
      </footer>
    </div>
  )
}
