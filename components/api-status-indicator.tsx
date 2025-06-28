"use client"

import { CheckCircle, XCircle } from "lucide-react"
import { useApiHealth } from "@/hooks/use-api-data"

export function ApiStatusIndicator() {
  const { isOnline } = useApiHealth()

  if (isOnline === null) return null

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div
        className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium ${
          isOnline
            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
            : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
        }`}
      >
        {isOnline ? (
          <>
            <CheckCircle className="h-4 w-4" />
            Live Data
          </>
        ) : (
          <>
            <XCircle className="h-4 w-4" />
            Demo Mode
          </>
        )}
      </div>
    </div>
  )
}
