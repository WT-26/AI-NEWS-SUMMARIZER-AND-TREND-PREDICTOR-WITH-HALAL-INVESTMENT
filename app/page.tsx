import Link from "next/link"
import { Sparkles, LineChart, ShieldCheck, Radar, Newspaper, ArrowRight, CheckCircle2 } from "lucide-react"
import AuthButtonsClient from "@/components/ui/auth-buttons-client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function WelcomePage() {
  return (
    <div className="min-h-screen relative bg-gradient-to-b from-slate-50 via-white to-slate-50">
      {/* Bright hero glow */}
      <div className="absolute inset-x-0 top-0 -z-10 h-[420px] bg-gradient-to-r from-sky-200 via-indigo-200 to-fuchsia-200 blur-3xl opacity-70" />
      <div className="absolute inset-x-0 top-24 -z-10 h-[320px] bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.9),transparent_55%)]" />

      {/* Top banner */}
      <div className="relative overflow-hidden py-2.5 text-center text-sm text-white bg-gradient-to-r from-sky-600 via-indigo-600 to-fuchsia-600">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_30%_20%,white,transparent_45%)]" />
        <div className="relative">
          Financial News AI — summarize news, analyze sentiment, and get buy-range signals in seconds.
        </div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-white/70 backdrop-blur-md supports-[backdrop-filter]:bg-white/60">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-sky-600 to-indigo-600 text-white shadow-sm">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h1 className="font-semibold text-lg leading-tight text-slate-900">Financial News AI</h1>
                <p className="text-xs text-slate-500">AI Summarizer • Sentiment • Buy Range</p>
              </div>
            </div>

            {/* Login / Sign up UI */}
            <AuthButtonsClient />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 max-w-7xl py-10">
        {/* Hero */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          <div className="max-w-xl">
            <Badge className="rounded-full px-3 py-1 bg-white/70 text-slate-700 border border-slate-200">
              Built for faster investment decisions
            </Badge>

            <h2 className="mt-4 text-5xl font-bold tracking-tight text-slate-900">
              News → AI summary → sentiment signal.
            </h2>

            <p className="mt-4 text-lg text-slate-600 leading-relaxed">
              Financial News AI helps you quickly understand market-moving headlines with
              <span className="font-medium text-slate-900"> AI-generated summaries</span>, sentiment (Bullish/Bearish/Neutral),
              and <span className="font-medium text-slate-900">buy range suggestions</span>.
              Includes a Halal compliance filter for Shariah-focused investors.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                asChild
                className="rounded-xl shadow-sm bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700"
              >
                <Link href="/home">
                  Go to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>

              <Button asChild variant="outline" className="rounded-xl bg-white/60">
                <Link href="/home">Explore (login required)</Link>
              </Button>
            </div>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-slate-700">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                Headline summarization & key points
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                Sentiment with confidence score
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                Buy range suggestions (short/long)
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                Halal compliance filtering
              </div>
            </div>
          </div>

          {/* Right: Preview panel (fake dashboard-style card) */}
          <Card className="rounded-2xl border-slate-200/60 bg-white/70 backdrop-blur shadow-sm overflow-hidden">
            <div className="p-5 border-b bg-gradient-to-r from-sky-50 to-indigo-50">
              <p className="text-sm font-semibold text-slate-800">Live Preview</p>
              <p className="text-xs text-slate-500">How AI analysis looks on the dashboard</p>
            </div>

            <CardContent className="p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <p className="font-mono font-semibold text-slate-900">AAPL</p>
                  <p className="text-xs text-slate-500">Apple Inc.</p>
                </div>
                <Badge className="bg-emerald-100 text-emerald-700 border border-emerald-200">
                  Bullish • 78%
                </Badge>
              </div>

              <div className="rounded-xl border bg-white p-4">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                  AI Summary
                </p>
                <p className="text-sm text-slate-700 leading-relaxed">
                  Strong earnings expectations and positive guidance indicate improving demand.
                  Market sentiment favors continued upside momentum in the short term.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border bg-white p-4">
                  <p className="text-xs text-slate-500">Short-term buy range</p>
                  <p className="mt-1 font-mono font-bold text-slate-900">$182 – $186</p>
                </div>
                <div className="rounded-xl border bg-white p-4">
                  <p className="text-xs text-slate-500">Long-term buy range</p>
                  <p className="mt-1 font-mono font-bold text-slate-900">$175 – $180</p>
                </div>
              </div>

              <div className="rounded-xl border bg-gradient-to-r from-sky-50 to-indigo-50 p-4">
                <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2">
                  Sentiment Explanation
                </p>
                <p className="text-sm text-slate-700">
                  Bullish due to positive earnings outlook, strong product demand signals,
                  and supportive market tone. Watch for macro risk and upcoming guidance updates.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Features */}
        <div className="mt-12">
          <h3 className="text-xl font-semibold text-slate-900">What you’ll get</h3>
          <p className="mt-1 text-sm text-slate-600">
            A dashboard that turns noisy financial headlines into clean, actionable insights.
          </p>

          <div className="mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="rounded-2xl border-slate-200/60 bg-white/70 backdrop-blur shadow-sm">
              <CardContent className="p-5">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-600 to-indigo-600 text-white flex items-center justify-center">
                  <Newspaper className="h-5 w-5" />
                </div>
                <p className="mt-3 font-semibold text-slate-900">Smart Summaries</p>
                <p className="mt-1 text-sm text-slate-600">
                  Key points extracted from headlines to save time.
                </p>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-slate-200/60 bg-white/70 backdrop-blur shadow-sm">
              <CardContent className="p-5">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-600 text-white flex items-center justify-center">
                  <Radar className="h-5 w-5" />
                </div>
                <p className="mt-3 font-semibold text-slate-900">Sentiment Signals</p>
                <p className="mt-1 text-sm text-slate-600">
                  Bullish/Bearish/Neutral with confidence score.
                </p>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-slate-200/60 bg-white/70 backdrop-blur shadow-sm">
              <CardContent className="p-5">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-fuchsia-600 text-white flex items-center justify-center">
                  <LineChart className="h-5 w-5" />
                </div>
                <p className="mt-3 font-semibold text-slate-900">Buy Range</p>
                <p className="mt-1 text-sm text-slate-600">
                  Short-term and long-term buy range suggestions.
                </p>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-slate-200/60 bg-white/70 backdrop-blur shadow-sm">
              <CardContent className="p-5">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white flex items-center justify-center">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <p className="mt-3 font-semibold text-slate-900">Halal Filter</p>
                <p className="mt-1 text-sm text-slate-600">
                  Filter news by Shariah-compliant tickers.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* How it works */}
        <div className="mt-12 rounded-2xl border border-slate-200/60 bg-white/70 backdrop-blur shadow-sm p-6">
          <h3 className="text-xl font-semibold text-slate-900">How it works</h3>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-xl border bg-white p-4">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Step 1</p>
              <p className="mt-1 font-semibold text-slate-900">Browse curated news</p>
              <p className="mt-1 text-sm text-slate-600">
                Pull market headlines and company tickers from sources.
              </p>
            </div>
            <div className="rounded-xl border bg-white p-4">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Step 2</p>
              <p className="mt-1 font-semibold text-slate-900">Run AI analysis</p>
              <p className="mt-1 text-sm text-slate-600">
                Get summary, sentiment signal, confidence, and key points.
              </p>
            </div>
            <div className="rounded-xl border bg-white p-4">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Step 3</p>
              <p className="mt-1 font-semibold text-slate-900">Act with clarity</p>
              <p className="mt-1 text-sm text-slate-600">
                Review buy ranges + explanations to support decisions.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-10 pb-6 text-center text-xs text-slate-500">
          This platform provides informational insights only and does not constitute financial advice.
        </div>
      </main>
    </div>
  )
}
