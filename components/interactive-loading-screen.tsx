"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface LoadingStage {
  text: string
  progress: number
}

interface InteractiveLoadingScreenProps {
  stages?: LoadingStage[]
  stageDuration?: number
  onComplete?: () => void
  completionTitle?: string
  completionSubtitle?: string
  showProgress?: boolean
  showDots?: boolean
  className?: string
}

export default function InteractiveLoadingScreen({
  stages = [
    { text: "Loading...", progress: 25 },
    { text: "Preparing content...", progress: 50 },
    { text: "Almost ready...", progress: 75 },
    { text: "Complete!", progress: 100 },
  ],
  stageDuration = 1000,
  onComplete,
  completionTitle = "Ready",
  completionSubtitle = "Welcome to your experience",
  showProgress = true,
  showDots = true,
  className = "",
}: InteractiveLoadingScreenProps) {
  const [progress, setProgress] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const [loadingText, setLoadingText] = useState(stages[0]?.text || "Loading...")

  useEffect(() => {
    let currentStage = 0
    const interval = setInterval(() => {
      if (currentStage < stages.length) {
        setProgress(stages[currentStage].progress)
        setLoadingText(stages[currentStage].text)

        if (currentStage === stages.length - 1) {
          setTimeout(() => {
            setIsComplete(true)
            onComplete?.()
          }, 800)
        }

        currentStage++
      } else {
        clearInterval(interval)
      }
    }, stageDuration)

    return () => clearInterval(interval)
  }, [stages, stageDuration, onComplete])

  return (
    <div className={`min-h-screen bg-white flex items-center justify-center relative ${className}`}>
      <AnimatePresence mode="wait">
        {!isComplete ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center max-w-md mx-auto px-6"
          >
            <motion.div
              className="w-8 h-8 mx-auto mb-8 border-2 border-gray-200 border-t-gray-900 rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              aria-label="Loading"
            />
            <motion.h2
              key={loadingText}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-2xl font-normal text-gray-900 mb-8"
              aria-live="polite"
            >
              {loadingText}
            </motion.h2>
            <div className="w-64 bg-gray-100 rounded-full h-1 mb-4 overflow-hidden mx-auto">
              <motion.div
                className="h-full bg-gray-900 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                role="progressbar"
                aria-valuenow={progress}
                aria-valuemin={0}
                aria-valuemax={100}
              />
            </div>
            {showProgress && (
              <motion.p
                className="text-gray-500 text-sm font-normal"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                aria-live="polite"
              >
                {progress}%
              </motion.p>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="complete"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <motion.div
              className="w-12 h-12 mx-auto mb-6 bg-gray-900 rounded-full flex items-center justify-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              aria-label="Loading complete"
            >
              <motion.svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <motion.path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </motion.svg>
            </motion.div>
            <motion.h2
              className="text-2xl font-normal text-gray-900 mb-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {completionTitle}
            </motion.h2>
            <motion.p
              className="text-gray-500 text-base"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {completionSubtitle}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
      {!isComplete && showDots && (
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2">
          <div className="flex space-x-2">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 bg-gray-300 rounded-full"
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, delay: i * 0.2 }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
} 