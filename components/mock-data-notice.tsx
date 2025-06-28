"use client"

import { AlertTriangle, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface MockDataNoticeProps {
  show: boolean
  onDismiss: () => void
}

export function MockDataNotice({ show, onDismiss }: MockDataNoticeProps) {
  if (!show) return null

  return (
    <div className="bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-400 p-4 mb-6">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <AlertTriangle className="h-5 w-5 text-amber-400" />
        </div>
        <div className="ml-3 flex-1">
          <p className="text-sm text-amber-700 dark:text-amber-200">
            <strong>Demo Mode:</strong> We're currently showing sample data because the API is temporarily unavailable.
            The actual platform will display real photographers and studios from our database.
          </p>
        </div>
        <div className="ml-auto pl-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onDismiss}
            className="text-amber-700 dark:text-amber-200 hover:bg-amber-100 dark:hover:bg-amber-800"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
