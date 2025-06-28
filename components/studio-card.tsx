import type React from "react"
import { Star, MapPin, Users, Heart } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface StudioCardProps {
  id?: string
  name: string
  image: string
  rating: string
  location: string
  specialties: string[]
  photographers: number
  isFavorite: boolean
  price?: string
}

export function StudioCard({
  id,
  name,
  image,
  rating,
  location,
  specialties,
  photographers,
  isFavorite,
  price,
}: StudioCardProps) {
  const body = (
    <Card className="flex-shrink-0 w-80 group cursor-pointer border-0 shadow-sm hover:shadow-lg transition-all duration-300 dark:bg-gray-800 dark:border-gray-700 overflow-hidden">
      <div className="relative">
        <img
          src={image || "/placeholder.svg?height=240&width=320"}
          alt={name}
          className="w-full h-48 sm:h-52 lg:h-48 object-cover"
          onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
            e.currentTarget.src = "/placeholder.svg?height=240&width=320"
          }}
        />
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-3 right-3 h-8 w-8 rounded-full bg-white/80 hover:bg-white dark:bg-gray-800/80 dark:hover:bg-gray-800"
        >
          <Heart
            className={`h-4 w-4 ${isFavorite ? "fill-red-500 text-red-500" : "text-gray-600 dark:text-gray-300"}`}
          />
        </Button>
      </div>

      <CardContent className="p-4">
        <div className="space-y-3">
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white text-lg leading-tight text-truncate-2">
              {name}
            </h3>
            <div className="flex items-center gap-1 mt-1">
              <MapPin className="h-3 w-3 text-gray-400" />
              <span className="text-sm text-gray-500 dark:text-gray-400 truncate">{location}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-1">
            {specialties.slice(0, 2).map((specialty, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {specialty}
              </Badge>
            ))}
            {specialties.length > 2 && (
              <Badge variant="outline" className="text-xs">
                +{specialties.length - 2}
              </Badge>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">{rating}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-3 w-3 text-gray-400" />
              <span className="text-xs text-gray-500 dark:text-gray-400">{photographers} photographers</span>
            </div>
          </div>

          <div className="pt-2 border-t border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                {price ? (
                  <>
                    <span className="text-lg font-bold text-gray-900 dark:text-white">₹{price}</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">per day</span>
                  </>
                ) : (
                  <span className="text-sm text-gray-500 dark:text-gray-400">Contact for pricing</span>
                )}
              </div>
              <Button
                size="sm"
                className="bg-gray-900 hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
              >
                View Studio
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  if (id) {
    return <Link href={`/partnerProfile/${id}`}>{body}</Link>
  }
  return body
}
