import type React from "react"
import { Camera, Users, MapPin, Award } from "lucide-react"

interface StatCardProps {
  icon: React.ReactNode
  value: string
  label: string
}

function StatCard({ icon, value, label }: StatCardProps) {
  return (
    <div className="text-center">
      <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
        {icon}
      </div>
      <div className="text-3xl font-normal text-gray-900 dark:text-white mb-1">{value}</div>
      <div className="text-sm text-gray-600 dark:text-gray-400">{label}</div>
    </div>
  )
}

interface StatsSectionProps {
  photographers: number | string;
  clients: number | string;
  cities: number | string;
  satisfaction: number | string;
}

export function StatsSection({ photographers, clients, cities, satisfaction }: StatsSectionProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
      <StatCard
        icon={<Camera className="h-6 w-6 text-gray-600 dark:text-gray-300" />}
        value={String(photographers)}
        label="Verified Photographers"
      />
      <StatCard
        icon={<Users className="h-6 w-6 text-gray-600 dark:text-gray-300" />}
        value={String(clients)}
        label="Happy Clients"
      />
      <StatCard
        icon={<MapPin className="h-6 w-6 text-gray-600 dark:text-gray-300" />}
        value={String(cities)}
        label="Cities Covered"
      />
      <StatCard
        icon={<Award className="h-6 w-6 text-gray-600 dark:text-gray-300" />}
        value={String(satisfaction)}
        label="Satisfaction Rate"
      />
    </div>
  )
}
