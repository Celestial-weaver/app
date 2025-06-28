"use client"

import { useEffect, useState } from "react"
import { apiClient } from "@/lib/api-client"
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react"

export function ApiStatus() {
  const [status, setStatus] = useState<"checking" | "online" | "offline">("checking")

  useEffect(() => {
    async function checkApiHealth() {
      try {
        await apiClient.healthCheck()
        setStatus("online")
      } catch (error) {
        setStatus("offline")
        console.error("API health check failed:", error)
      }
    }

    checkApiHealth()

    // Check every 30 seconds
    const interval = setInterval(checkApiHealth, 30000)
    return () => clearInterval(interval)
  }, [])

  if (status === "checking") {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Loader2 className="h-4 w-4 animate-spin" />
        Connecting to API...
      </div>
    )
  }

  if (status === "offline") {
    return (
      <div className="flex items-center gap-2 text-sm text-red-500">
        <AlertCircle className="h-4 w-4" />
        API Offline
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2 text-sm text-green-500">
      <CheckCircle className="h-4 w-4" />
      API Online
    </div>
  )
}
