"use client"

import { useState, useMemo, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Star, MapPin, Camera, Filter, X, ArrowLeft, SlidersHorizontal } from "lucide-react"
import { PhotographerCard } from "@/components/photographer-card"
import { StudioCard } from "@/components/studio-card"
import { usePartners } from "@/hooks/use-api-data"
import { PhotographerSkeleton } from "@/components/skeleton-loader"
import Link from "next/link"

interface SearchFilters {
  location?: string
  specialization?: string
  partnerType?: string
  minRating?: number
  minPrice?: number
  maxPrice?: number
  sortBy?: string
  sortOrder?: "asc" | "desc"
}

function SearchResultsContent() {
  const searchParams = useSearchParams()
  const router = useRouter()

  // Get initial filters from URL with safe defaults
  const initialFilters: SearchFilters = {
    location: searchParams.get("location") || undefined,
    specialization: searchParams.get("specialization") || undefined,
    partnerType: searchParams.get("partnerType") || undefined,
    minRating: searchParams.get("minRating") ? Number(searchParams.get("minRating")) : undefined,
    minPrice: searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : undefined,
    maxPrice: searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined,
    sortBy: searchParams.get("sortBy") || "avgRating",
    sortOrder: (searchParams.get("sortOrder") as "asc" | "desc") || "desc",
  }

  const [filters, setFilters] = useState<SearchFilters>(initialFilters)
  const [activeTab, setActiveTab] = useState("all")
  const [budgetRange, setBudgetRange] = useState([10000, 1000000])
  const [ratingFilter, setRatingFilter] = useState<number | null>(null)
  const [typeFilters, setTypeFilters] = useState<string[]>([])
  const [showMobileFilters, setShowMobileFilters] = useState(false)

  // Use the custom hook to fetch partners
  const { partners, loading, error, pagination } = usePartners(filters)

  // Deduplicate partners by their unique _id to avoid rendering duplicates that
  // trigger React "duplicate key" warnings when mapping over the list.
  const uniquePartners = useMemo(() => {
    if (!partners || partners.length === 0) return []
    const map = new Map<string, (typeof partners)[number]>()
    partners.forEach((p) => {
      if (p && p._id && !map.has(p._id)) {
        map.set(p._id, p)
      }
    })
    return Array.from(map.values())
  }, [partners])

  // Filter partners by tab with safe array operations
  const getFilteredPartners = () => {
    const safePartners = uniquePartners
    if (activeTab === "all") return safePartners
    if (activeTab === "photographers") return safePartners.filter((p) => p.partnerType !== "studio")
    if (activeTab === "studios") return safePartners.filter((p) => p.partnerType === "studio")
    return safePartners
  }

  const filteredPartners = getFilteredPartners()

  const formatSpecialization = (spec: string) => {
    if (!spec) return ""
    return spec.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
  }

  const updateURL = (newFilters: SearchFilters) => {
    const params = new URLSearchParams()
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params.set(key, value.toString())
      }
    })
    router.push(`/search-results?${params.toString()}`, { scroll: false })
  }

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    updateURL(newFilters)
  }

  const clearFilters = () => {
    const clearedFilters: SearchFilters = {
      sortBy: "avgRating",
      sortOrder: "desc",
    }
    setFilters(clearedFilters)
    setBudgetRange([10000, 1000000])
    setRatingFilter(null)
    setTypeFilters([])
    updateURL(clearedFilters)
  }

  const toggleTypeFilter = (type: string) => {
    setTypeFilters((prev) => (prev.includes(type) ? prev.filter((t) => t !== type) : [type]))
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Mobile Header */}
      <header className="lg:hidden border-b border-gray-100 dark:border-gray-800 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/">
              <Button variant="ghost" size="sm" className="p-2">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-lg font-semibold text-gray-900 dark:text-white">Search Results</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {loading ? "Loading..." : `${filteredPartners.length} found`}
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="flex items-center gap-2"
          >
            <SlidersHorizontal className="h-4 w-4" />
            <span>Filters</span>
          </Button>
        </div>
      </header>

      {/* Desktop Header */}
      <header className="hidden lg:block border-b border-gray-100 dark:border-gray-800 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-semibold text-gray-900 dark:text-white">
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
          </nav>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="text-gray-600 dark:text-gray-300">
              Sign in
            </Button>
            <Button
              size="sm"
              className="bg-gray-900 hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
            >
              Join now
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto">
        <div className="flex">
          {/* Mobile Filters Overlay */}
          {showMobileFilters && (
            <div className="lg:hidden fixed inset-0 z-50 bg-black/50" onClick={() => setShowMobileFilters(false)}>
              <div
                className="bg-white dark:bg-gray-900 w-full max-w-sm h-full overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-900">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Filters</h3>
                    <Button variant="ghost" size="sm" onClick={() => setShowMobileFilters(false)}>
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                </div>

                <div className="p-4 space-y-6">
                  {/* Budget Filter */}
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-4">Budget</h4>
                    <div className="space-y-4">
                      <div className="px-2">
                        <input
                          type="range"
                          min={10000}
                          max={1000000}
                          step={5000}
                          value={budgetRange[0]}
                          onChange={(e) => setBudgetRange([Number(e.target.value), budgetRange[1]])}
                          className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-gray-900 dark:accent-white"
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>₹10K</span>
                          <span>₹10L</span>
                        </div>
                      </div>
                      <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                        <span>₹{budgetRange[0].toLocaleString()}</span>
                        <span>₹{budgetRange[1].toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Rating Filter */}
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-4">Rating</h4>
                    <div className="space-y-2">
                      {[5, 4, 3, 2, 1].map((rating) => (
                        <button
                          key={rating}
                          onClick={() => setRatingFilter(ratingFilter === rating ? null : rating)}
                          className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                            ratingFilter === rating
                              ? "bg-gray-100 dark:bg-gray-700"
                              : "hover:bg-gray-50 dark:hover:bg-gray-800"
                          }`}
                        >
                          <div className="flex">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-600 dark:text-gray-400">& up</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Type Filter */}
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-4">Type</h4>
                    <div className="space-y-3">
                      {["Studios", "Agencies", "Freelance"].map((type) => (
                        <button
                          key={type}
                          onClick={() => toggleTypeFilter(type.toLowerCase())}
                          className={`w-full text-left px-4 py-3 rounded-full border transition-colors ${
                            typeFilters.includes(type.toLowerCase())
                              ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900 border-gray-900 dark:border-white"
                              : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-500"
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Apply Filters Button */}
                  <div className="pt-4 sticky bottom-0 bg-white dark:bg-gray-900">
                    <Button
                      onClick={() => setShowMobileFilters(false)}
                      className="w-full bg-gray-900 hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
                    >
                      Apply Filters ({filteredPartners.length} results)
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Desktop Sidebar Filters */}
          <div className="hidden lg:block w-80 shrink-0 px-6 py-8">
            <div className="sticky top-24">
              <Card className="border-0 shadow-sm dark:bg-gray-800">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center gap-2">
                      <Filter className="h-5 w-5" />
                      Filter
                    </h3>
                    <Button variant="ghost" size="sm" onClick={clearFilters} className="text-sm">
                      Clear all
                    </Button>
                  </div>

                  {/* Budget Filter */}
                  <div className="mb-8">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-4 flex items-center justify-between">
                      <span>Budget</span>
                      <span className="text-sm text-gray-500">≤ ₹{budgetRange[1].toLocaleString()}</span>
                    </h4>
                    <div className="px-2">
                      <input
                        type="range"
                        min={10000}
                        max={1000000}
                        step={5000}
                        value={budgetRange[1]}
                        onChange={(e) => setBudgetRange([budgetRange[0], Number(e.target.value)])}
                        className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-gray-900 dark:accent-white"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-2">
                        <span>10K</span>
                        <span>10L</span>
                      </div>
                    </div>
                  </div>

                  {/* Rating Filter */}
                  <div className="mb-8">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-4 flex items-center justify-between">
                      <span>Rating</span>
                      {ratingFilter && <span className="text-sm text-gray-500">≤ {ratingFilter}★</span>}
                    </h4>
                    <div className="px-2">
                      <input
                        type="range"
                        min={1}
                        max={5}
                        step={1}
                        value={ratingFilter || 5}
                        onChange={(e) => setRatingFilter(Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-gray-900 dark:accent-white"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-2">
                        <span>1☆</span>
                        <span>5☆</span>
                      </div>
                    </div>
                  </div>

                  {/* Type Filter */}
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-4">Type</h4>
                    <div className="flex flex-col gap-3">
                      {["Studios", "Agencies", "Freelance"].map((type) => (
                        <button
                          key={type}
                          onClick={() => toggleTypeFilter(type.toLowerCase())}
                          className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                            typeFilters.includes(type.toLowerCase())
                              ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900"
                              : "text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 px-4 lg:px-6 py-4 lg:py-8">
            {/* Desktop Results Header */}
            <div className="hidden lg:block mb-6">
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                Search Results
                {filters.location && <span className="text-gray-600 dark:text-gray-400"> in {filters.location}</span>}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {loading ? "Loading..." : `${filteredPartners.length} results found`}
              </p>
            </div>

            {/* Active Filters */}
            {(filters.location || filters.specialization || ratingFilter || typeFilters.length > 0) && (
              <div className="flex flex-wrap gap-2 mb-6">
                {filters.location && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {filters.location}
                    <button onClick={() => handleFilterChange("location", undefined)}>
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                {filters.specialization && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Camera className="h-3 w-3" />
                    {formatSpecialization(filters.specialization)}
                    <button onClick={() => handleFilterChange("specialization", undefined)}>
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                {ratingFilter && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Star className="h-3 w-3" />
                    {ratingFilter}+ stars
                    <button onClick={() => setRatingFilter(null)}>
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                {typeFilters.map((type) => (
                  <Badge key={type} variant="secondary" className="flex items-center gap-1">
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                    <button onClick={() => toggleTypeFilter(type)}>
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
              <TabsList className="grid w-full grid-cols-3 max-w-md">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="photographers">Photographers</TabsTrigger>
                <TabsTrigger value="studios">Studios</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="mt-6">
                {loading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <PhotographerSkeleton key={i} />
                    ))}
                  </div>
                ) : error ? (
                  <div className="text-center py-12">
                    <p className="text-gray-600 dark:text-gray-400">{error}</p>
                  </div>
                ) : filteredPartners.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-600 dark:text-gray-400">No results found. Try adjusting your filters.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                    {filteredPartners.map((partner) => (
                      <div key={partner._id}>
                        {partner.partnerType === "studio" ? (
                          <StudioCard
                            id={partner._id}
                            name={partner.companyName}
                            image={partner.banner || partner.portfolio?.[0] || "/placeholder.svg?height=200&width=300"}
                            rating={partner.avgRating?.toFixed(1) || "4.0"}
                            location={partner.servingLocations?.join(", ") || "Multiple locations"}
                            specialties={partner.specializations?.map((s) => formatSpecialization(s)) || []}
                            photographers={partner.projectStats?.total || 0}
                            isFavorite={(partner.avgRating || 0) >= 4.5}
                            price={partner.services?.[0]?.basePrice?.toLocaleString()}
                          />
                        ) : (
                          <PhotographerCard
                            id={partner._id}
                            name={partner.companyName}
                            image={
                              partner.user?.profilePic ||
                              partner.banner ||
                              partner.portfolio?.[0] ||
                              "/placeholder.svg?height=200&width=300"
                            }
                            price={
                              partner.services?.[0]?.basePrice
                                ? `₹${partner.services[0].basePrice.toLocaleString()}`
                                : "Contact for pricing"
                            }
                            location={partner.servingLocations?.[0] || "Location not specified"}
                            specialty={
                              partner.specializations?.[0]
                                ? formatSpecialization(partner.specializations[0])
                                : "Photography"
                            }
                            experience={`${partner.experienceYears || 0} years`}
                            rating={partner.avgRating?.toFixed(1) || "4.0"}
                            isFavorite={(partner.avgRating || 0) >= 4.5}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="photographers" className="mt-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                  {filteredPartners
                    .filter((p) => p.partnerType !== "studio")
                    .map((partner) => (
                      <PhotographerCard
                        key={partner._id}
                        id={partner._id}
                        name={partner.companyName}
                        image={
                          partner.user?.profilePic ||
                          partner.banner ||
                          partner.portfolio?.[0] ||
                          "/placeholder.svg?height=200&width=300"
                        }
                        price={
                          partner.services?.[0]?.basePrice
                            ? `₹${partner.services[0].basePrice.toLocaleString()}`
                            : "Contact for pricing"
                        }
                        location={partner.servingLocations?.[0] || "Location not specified"}
                        specialty={
                          partner.specializations?.[0]
                            ? formatSpecialization(partner.specializations[0])
                            : "Photography"
                        }
                        experience={`${partner.experienceYears || 0} years`}
                        rating={partner.avgRating?.toFixed(1) || "4.0"}
                        isFavorite={(partner.avgRating || 0) >= 4.5}
                      />
                    ))}
                </div>
              </TabsContent>

              <TabsContent value="studios" className="mt-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                  {filteredPartners
                    .filter((p) => p.partnerType === "studio")
                    .map((partner) => (
                      <StudioCard
                        id={partner._id}
                        key={partner._id}
                        name={partner.companyName}
                        image={partner.banner || partner.portfolio?.[0] || "/placeholder.svg?height=200&width=300"}
                        rating={partner.avgRating?.toFixed(1) || "4.0"}
                        location={partner.servingLocations?.join(", ") || "Multiple locations"}
                        specialties={partner.specializations?.map((s) => formatSpecialization(s)) || []}
                        photographers={partner.projectStats?.total || 0}
                        isFavorite={(partner.avgRating || 0) >= 4.5}
                        price={partner.services?.[0]?.basePrice?.toLocaleString()}
                      />
                    ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function SearchResults() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading search results...</p>
          </div>
        </div>
      }
    >
      <SearchResultsContent />
    </Suspense>
  )
}
