"use client"

import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { SearchFilters, type FiltersState } from "@/components/search-filters"
import { StudioCard } from "@/components/studio-card"
import { PhotographerCard } from "@/components/photographer-card"
import { apiClient } from "@/lib/api-client"
import { Button } from "@/components/ui/button"

interface Partner {
  _id: string
  companyName: string
  banner?: string
  avgRating?: number
  specializations?: string[]
  servingLocations?: string[]
  services?: Array<{
    basePrice: number
    name: string
    description: string
  }>
  partnerType?: string
  projectStats?: {
    total: number
  }
  user?: {
    username: string
    profilePic: string
  }
  experienceYears?: number
  totalReviews?: number
  verified?: boolean
  portfolio?: string[]
}

// Error Display Component
function ErrorDisplay({ error, onRetry }: { error: string; onRetry?: () => void }) {
  return (
    <div className="text-center py-12">
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 max-w-md mx-auto">
        <h3 className="text-lg font-medium text-red-800 dark:text-red-200 mb-2">Unable to Load Search Results</h3>
        <p className="text-red-600 dark:text-red-300 text-sm mb-4">{error}</p>
        {onRetry && (
          <Button
            onClick={onRetry}
            variant="outline"
            size="sm"
            className="border-red-300 text-red-700 hover:bg-red-50 dark:border-red-700 dark:text-red-300 dark:hover:bg-red-900/30"
          >
            Try Again
          </Button>
        )}
      </div>
    </div>
  )
}

export default function SearchResultsPage() {
  const searchParams = useSearchParams()
  const city = searchParams.get("city") || ""
  const specialization = searchParams.get("specialization") || ""

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [partners, setPartners] = useState<Partner[]>([])
  const [filters, setFilters] = useState<FiltersState>({ budget: 100, rating: 5, types: [] })

  useEffect(() => {
    async function fetchResults() {
      try {
        setLoading(true)
        setError("")

        console.log("Fetching search results for:", { city, specialization })

        const result = await apiClient.getPartners({
          location: city,
          specialization: specialization,
          page: 1,
          limit: 20,
          sortBy: "avgRating",
          sortOrder: "desc",
        })

        if (result.success && result.data?.partners) {
          setPartners(result.data.partners)
          console.log("Successfully loaded search results:", result.data.partners.length)
        } else {
          throw new Error(result.message || "No search results found")
        }
      } catch (err: any) {
        const errorMessage = err.message || "Failed to fetch search results"
        console.error("Search API failed:", errorMessage)
        setError(`Server Error: ${errorMessage}`)
        setPartners([])
      } finally {
        setLoading(false)
      }
    }

    if (city || specialization) {
      fetchResults()
    }
  }, [city, specialization])

  // Apply client-side filters
  const filtered = partners.filter((p) => {
    // Rating filter (>= selected)
    if (p.avgRating && p.avgRating < filters.rating) return false

    // Type filter
    if (filters.types.length) {
      if (!p.partnerType || !filters.types.map((t) => t.toLowerCase()).includes(p.partnerType.toLowerCase())) {
        return false
      }
    }

    // Budget filter: slider 0-100 maps to price range
    if (p.services && p.services.length > 0) {
      const maxAllowed = 10000 + (filters.budget / 100) * (1000000 - 10000)
      if (p.services[0].basePrice > maxAllowed) return false
    }

    return true
  })

  // Transform partner data for display components
  const transformToPhotographer = (partner: Partner) => ({
    id: partner._id,
    name: partner.companyName,
    image: partner.user?.profilePic || partner.banner || "/placeholder.svg",
    price: partner.services?.[0]?.basePrice
      ? `₹${partner.services[0].basePrice.toLocaleString()}`
      : "Contact for pricing",
    location: partner.servingLocations?.[0] || "Location not specified",
    specialty:
      partner.specializations?.[0]?.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase()) || "Photography",
    experience: `${partner.experienceYears || 0} years`,
    rating: partner.avgRating?.toFixed(1) || "4.0",
    isFavorite: Boolean(partner.avgRating && partner.avgRating >= 4.5),
    verified: partner.verified,
  })

  const transformToStudio = (partner: Partner) => ({
    id: partner._id,
    name: partner.companyName,
    image: partner.banner || partner.portfolio?.[0] || "/placeholder.svg",
    rating: partner.avgRating?.toFixed(1) || "4.0",
    location: partner.servingLocations?.join(", ") || "Multiple locations",
    specialties:
      partner.specializations?.map((s) => s.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())) || [],
    photographers: partner.projectStats?.total || 0,
    isFavorite: Boolean(partner.avgRating && partner.avgRating >= 4.5),
    price: partner.services?.[0]?.basePrice?.toLocaleString(),
  })

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 flex gap-8">
      {/* Sidebar Filters */}
      <div className="hidden lg:block w-60 flex-shrink-0">
        <SearchFilters filters={filters} onChange={setFilters} />
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-1 text-gray-900 dark:text-white">Search Results</h1>
          <p className="text-gray-600 dark:text-gray-300">
            {city && (
              <span>
                City: <b>{city}</b>
              </span>
            )}
            {city && specialization && <span> | </span>}
            {specialization && (
              <span>
                Specialization: <b>{specialization.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}</b>
              </span>
            )}
            {!city && !specialization && <span>All results</span>}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {loading ? "Loading..." : `${filtered.length} results found`}
          </p>
        </div>

        <Tabs defaultValue="photographers" className="w-full">
          <TabsList>
            <TabsTrigger value="photographers">Photographers</TabsTrigger>
            <TabsTrigger value="studios">Studios</TabsTrigger>
          </TabsList>

          {/* Photographers Tab */}
          <TabsContent value="photographers">
            {loading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, idx) => (
                  <Skeleton key={idx} className="h-72 w-full" />
                ))}
              </div>
            )}

            {error && <ErrorDisplay error={error} onRetry={() => window.location.reload()} />}

            {!loading && !error && filtered.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400">No photographers found matching your criteria.</p>
              </div>
            )}

            {!loading && !error && filtered.length > 0 && (
              <div className="grid gap-6 [grid-template-columns:repeat(auto-fit,minmax(260px,1fr))]">
                {filtered.map((partner) => {
                  const photographerData = transformToPhotographer(partner)
                  return <PhotographerCard key={partner._id} {...photographerData} />
                })}
              </div>
            )}
          </TabsContent>

          {/* Studios Tab */}
          <TabsContent value="studios">
            {loading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, idx) => (
                  <Skeleton key={idx} className="h-72 w-full" />
                ))}
              </div>
            )}

            {error && <ErrorDisplay error={error} onRetry={() => window.location.reload()} />}

            {!loading && !error && filtered.filter((p) => p.partnerType === "studio").length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400">No studios found matching your criteria.</p>
              </div>
            )}

            {!loading && !error && (
              <div className="grid gap-6 [grid-template-columns:repeat(auto-fit,minmax(260px,1fr))]">
                {filtered
                  .filter((p) => p.partnerType === "studio")
                  .map((partner) => {
                    const studioData = transformToStudio(partner)
                    return <StudioCard key={partner._id} {...studioData} />
                  })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
