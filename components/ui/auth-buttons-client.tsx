"use client"

import { useEffect, useState } from "react"
import { AuthButtons } from "@/components/auth-dialogs"

export default function AuthButtonsClient() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted) return null

  return <AuthButtons />
}
