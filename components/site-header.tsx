"use client"

import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"
import UserAuthButtons from "@/components/user-auth-buttons"

export default function SiteHeader() {
  return (
    <header className="border-b border-gray-100 dark:border-gray-800 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">
          Pixisphere
        </Link>
        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="/#photographers"
            className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            Photographers
          </Link>
          <Link
            href="/#studios"
            className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            Studios
          </Link>
          <Link
            href="/#how-it-works"
            className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            How it works
          </Link>
          <Link
            href="/#pricing"
            className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            Pricing
          </Link>
          <Link
            href="/#blog"
            className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            Blog
          </Link>
        </nav>
        <div className="flex items-center gap-2 sm:gap-4">
          <ThemeToggle />
          <UserAuthButtons />
        </div>
      </div>
    </header>
  )
} 