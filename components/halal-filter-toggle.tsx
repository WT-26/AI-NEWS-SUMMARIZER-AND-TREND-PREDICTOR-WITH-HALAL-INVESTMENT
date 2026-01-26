"use client"

import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"

interface HalalFilterToggleProps {
  enabled: boolean
  onToggle: (enabled: boolean) => void
}

export function HalalFilterToggle({ enabled, onToggle }: HalalFilterToggleProps) {
  return (
    <Button
      variant="outline"
      onClick={() => onToggle(!enabled)}
      className={`gap-2 ${enabled ? "border-emerald-500 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-600" : ""}`}
    >
      <Check className={`h-4 w-4 ${enabled ? "text-emerald-500" : ""}`} />
      Halal Filter
    </Button>
  )
}
