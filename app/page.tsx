import { NewsDashboard } from "@/components/news-dashboard"
import { AuthButtons } from "@/components/auth-dialogs"
import { Sparkles } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Top Banner */}
      <div className="bg-primary text-primary-foreground py-2.5 text-center text-sm">
        Financial News AI powered by sentiment analysis - Get smarter investment insights
      </div>

      {/* Navigation Header */}
      <header className="border-b bg-background sticky top-0 z-50">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary text-primary-foreground">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h1 className="font-semibold text-lg leading-tight">Financial News</h1>
                <p className="text-xs text-muted-foreground">AI Analysis</p>
              </div>
            </div>

            <AuthButtons />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        <NewsDashboard />
      </main>
    </div>
  )
}
