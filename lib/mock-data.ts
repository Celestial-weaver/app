export const mockPartners = [
  {
    _id: "1",
    companyName: "Stellar Photography Studio",
    specializations: ["wedding_photography", "portrait_photography"],
    experienceYears: 8,
    avgRating: 4.9,
    totalReviews: 156,
    verified: true,
    partnerType: "studio",
    servingLocations: ["Mumbai", "Pune", "Nashik"],
    partnerLocations: [
      {
        city: "Mumbai",
        state: "Maharashtra",
        coordinates: { lat: 19.076, lng: 72.8777 },
      },
    ],
    portfolio: [
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
    ],
    banner: "/placeholder.svg?height=200&width=800",
    socialLinks: {
      website: "https://stellarphotography.com",
      instagram: "stellar_photography",
    },
    projectStats: {
      total: 200,
      completed: 195,
      ongoing: 5,
    },
    services: [
      {
        serviceId: "wedding_basic",
        name: "Wedding Photography - Basic",
        description: "Complete wedding day coverage with edited photos",
        basePrice: 75000,
        priceUnit: "per_day",
      },
      {
        serviceId: "wedding_premium",
        name: "Wedding Photography - Premium",
        description: "Premium wedding coverage with videography",
        basePrice: 125000,
        priceUnit: "per_day",
      },
    ],
    user: {
      username: "stellar_photo",
      profilePic: "/placeholder.svg?height=100&width=100",
    },
    completionRate: 97.5,
    hasLocationPricing: true,
    createdAt: "2022-03-15T10:30:00.000Z",
  },
  {
    _id: "2",
    companyName: "Moments Captured",
    specializations: ["event_photography", "corporate_photography"],
    experienceYears: 5,
    avgRating: 4.7,
    totalReviews: 89,
    verified: true,
    partnerType: "solo",
    servingLocations: ["Delhi", "Gurgaon", "Noida"],
    partnerLocations: [
      {
        city: "Delhi",
        state: "Delhi",
        coordinates: { lat: 28.6139, lng: 77.209 },
      },
    ],
    portfolio: [
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
    ],
    banner: "/placeholder.svg?height=200&width=800",
    socialLinks: {
      website: "https://momentscaptured.in",
      instagram: "moments_captured_delhi",
    },
    projectStats: {
      total: 120,
      completed: 115,
      ongoing: 5,
    },
    services: [
      {
        serviceId: "event_basic",
        name: "Event Photography",
        description: "Professional event coverage",
        basePrice: 25000,
        priceUnit: "per_event",
      },
    ],
    user: {
      username: "moments_photographer",
      profilePic: "/placeholder.svg?height=100&width=100",
    },
    completionRate: 95.8,
    hasLocationPricing: false,
    createdAt: "2023-01-20T14:15:00.000Z",
  },
  {
    _id: "3",
    companyName: "Creative Lens Studio",
    specializations: ["fashion_photography", "commercial_photography"],
    experienceYears: 12,
    avgRating: 4.8,
    totalReviews: 203,
    verified: true,
    partnerType: "studio",
    servingLocations: ["Bangalore", "Chennai", "Hyderabad"],
    partnerLocations: [
      {
        city: "Bangalore",
        state: "Karnataka",
        coordinates: { lat: 12.9716, lng: 77.5946 },
      },
    ],
    portfolio: [
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
    ],
    banner: "/placeholder.svg?height=200&width=800",
    socialLinks: {
      website: "https://creativelens.studio",
      instagram: "creative_lens_studio",
      facebook: "creativelenstudio",
    },
    projectStats: {
      total: 350,
      completed: 340,
      ongoing: 10,
    },
    services: [
      {
        serviceId: "fashion_shoot",
        name: "Fashion Photography",
        description: "Professional fashion and model photography",
        basePrice: 50000,
        priceUnit: "per_shoot",
      },
      {
        serviceId: "commercial_shoot",
        name: "Commercial Photography",
        description: "Product and commercial photography",
        basePrice: 35000,
        priceUnit: "per_shoot",
      },
    ],
    user: {
      username: "creative_lens",
      profilePic: "/placeholder.svg?height=100&width=100",
    },
    completionRate: 97.1,
    hasLocationPricing: true,
    createdAt: "2021-08-10T09:45:00.000Z",
  },
]

export const mockStats = {
  totalPartners: 156,
  averageRating: 4.3,
  locationsServed: 45,
  specializations: 12,
  totalProjects: 2847,
}

export const mockFilterOptions = {
  locations: ["Mumbai", "Delhi", "Bangalore", "Chennai", "Pune", "Hyderabad", "Kolkata", "Ahmedabad"],
  specializations: [
    "wedding_photography",
    "portrait_photography",
    "event_photography",
    "commercial_photography",
    "fashion_photography",
    "landscape_photography",
  ],
  partnerTypes: ["studio", "solo", "firm", "partnership"],
  ratingRanges: [
    { _id: "4.5+", count: 45 },
    { _id: "4.0+", count: 78 },
    { _id: "3.5+", count: 102 },
    { _id: "3.0+", count: 125 },
  ],
  priceRanges: [
    { _id: "Under ₹10,000", count: 15 },
    { _id: "₹10,000 - ₹25,000", count: 32 },
    { _id: "₹25,000 - ₹50,000", count: 48 },
    { _id: "₹50,000 - ₹1,00,000", count: 35 },
    { _id: "₹1,00,000+", count: 26 },
  ],
}
