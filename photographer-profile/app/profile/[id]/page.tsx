import { notFound } from "next/navigation"
import ProfilePage from "@/components/profile-page"

// This would typically fetch data from your database
async function getProfileData(id: string) {
  // Mock data based on your sample - replace with actual database call
  const mockData = {
    _id: "e698d0d594b8ba2de92801f1",
    specializations: ["fashion_photography", "food_photography", "portrait_photography"],
    portfolio: [
      "https://picsum.photos/seed/e9367903a1327faf1813b174-0/800/600",
      "https://picsum.photos/seed/e9367903a1327faf1813b174-1/800/600",
      "https://picsum.photos/seed/e9367903a1327faf1813b174-2/800/600",
      "https://picsum.photos/seed/e9367903a1327faf1813b174-3/800/600",
    ],
    experienceYears: 6,
    servingLocations: ["Pune"],
    avgRating: 5,
    totalReviews: 104,
    verified: true,
    projectStats: {
      total: 37,
      completed: 31,
      ongoing: 6,
    },
    partnerLocations: [
      {
        city: "Pune",
        state: "Maharashtra",
        coordinates: {
          lat: 18.510569,
          lng: 73.878289,
        },
        pinCodesServed: ["411002", "411001"],
        _id: "e34684ef977150a70ade3714",
      },
    ],
    createdAt: "2024-11-29T18:00:05.000Z",
    companyName: "Creative Media",
    partnerType: "company",
    socialLinks: {
      website: "https://creativemedia.com",
      instagram: "https://instagram.com/creativemedia",
      facebook: "https://facebook.com/creativemedia",
      x: "https://x.com/creativemedia",
      pinterest: "",
      youtube: "",
    },
    user: {
      username: "eiravatimangal876@example.com",
      profilePic: "https://picsum.photos/seed/profile-pic/200/200",
    },
    services: [
      {
        serviceId: "2db103856c99f707d04e1490",
        name: "Fashion Shoot",
        description: "Professional fashion photography for brands and individuals",
        basePrice: 45000,
        priceUnit: "per_project",
      },
      {
        serviceId: "feb4972bb97c81286cb371ac",
        name: "Commercial Video",
        description: "High-quality commercial video production",
        basePrice: 70000,
        priceUnit: "per_project",
      },
    ],
    completionRate: 83.78378378378379,
    hasLocationPricing: true,
  }

  // In real implementation, you'd fetch from database using the id
  // const response = await fetch(`/api/profiles/${id}`)
  // if (!response.ok) return null
  // return response.json()

  return mockData
}

export default async function ProfilePageRoute({ params }: { params: { id: string } }) {
  const profileData = await getProfileData(params.id)

  if (!profileData) {
    notFound()
  }

  return <ProfilePage data={profileData} />
}
