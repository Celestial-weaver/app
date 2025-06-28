import { notFound } from "next/navigation"
import ProfilePage from "@/components/profile-page"
import { apiClient, Partner } from "@/lib/api-client"

// Transform backend Partner -> ProfilePage consumable props
function mapPartnerToProfile(partner: Partner) {
  return {
    _id: partner._id,
    specializations: partner.specializations ?? [],
    portfolio: partner.portfolio?.length ? partner.portfolio : [partner.banner ?? "/placeholder.svg"],
    experienceYears: partner.experienceYears ?? 0,
    servingLocations: partner.servingLocations ?? [],
    avgRating: partner.avgRating ?? 0,
    totalReviews: partner.totalReviews ?? 0,
    verified: partner.verified ?? false,
    projectStats: partner.projectStats ?? { total: 0, completed: 0, ongoing: 0 },
    partnerLocations: (partner.partnerLocations ?? []).map((loc, idx) => ({
      city: loc.city ?? "",
      state: loc.state ?? "",
      coordinates: loc.coordinates ?? { lat: 0, lng: 0 },
      pinCodesServed: loc.pinCodesServed ?? [],
      _id: (loc as any)._id ?? `${partner._id}-loc-${idx}`,
    })),
    createdAt: partner.createdAt ?? "",
    companyName: partner.companyName ?? "Unknown",
    partnerType: partner.partnerType ?? "solo",
    socialLinks: partner.socialLinks ?? {},
    user: partner.user ?? { username: "", profilePic: null },
    services: partner.services ?? [],
    completionRate: partner.completionRate ?? 0,
    hasLocationPricing: partner.hasLocationPricing ?? false,
  }
}

export default async function PartnerProfileRoute({ params }: { params: { id: string } }) {
  // Fetch from backend
  const response = await apiClient.getPartner(params.id)

  if (!response.success || !response.data?.partner) {
    notFound()
  }

  const profileData = mapPartnerToProfile(response.data.partner)

  return <ProfilePage data={profileData} />
}
