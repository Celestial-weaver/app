"use client"

import { useState } from "react"
import {
  Calendar as CalendarIcon,
  MapPin,
  Phone,
  MessageSquare,
  Camera,
  DollarSign,
  Users,
  Heart,
  User,
  Zap,
  Building,
  Package,
  Shirt,
} from "lucide-react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

interface CreateLeadFormData {
  message: string
  contactMethod: string
  serviceType: string
  eventDate: Date | undefined
  budgetMin: string
  budgetMax: string
  currency: string
  location: string
  priority: string
  source: string
}

const serviceTypes = [
  { value: "Wedding Photography", icon: Heart, description: "Capture your special day" },
  { value: "Pre-Wedding Photography", icon: Users, description: "Beautiful couple shoots" },
  { value: "Engagement Photography", icon: Heart, description: "Celebrate your engagement" },
  { value: "Portrait Photography", icon: User, description: "Professional portraits" },
  { value: "Event Photography", icon: Zap, description: "Corporate & social events" },
  { value: "Corporate Photography", icon: Building, description: "Business & professional" },
  { value: "Product Photography", icon: Package, description: "Commercial product shots" },
  { value: "Fashion Photography", icon: Shirt, description: "Style & fashion shoots" },
]

const contactMethods = [
  { value: "whatsapp", label: "WhatsApp", icon: MessageSquare, description: "Quick messaging" },
  { value: "phone", label: "Phone Call", icon: Phone, description: "Direct conversation" },
  { value: "email", label: "Email", icon: MessageSquare, description: "Detailed communication" },
  { value: "instagram", label: "Instagram", icon: Camera, description: "Social media" },
]

const sources = [
  { value: "website", label: "Website", icon: Camera },
  { value: "instagram", label: "Instagram", icon: Camera },
  { value: "facebook", label: "Facebook", icon: Users },
  { value: "referral", label: "Referral", icon: Users },
  { value: "google", label: "Google Search", icon: Camera },
  { value: "advertisement", label: "Advertisement", icon: Zap },
]

interface CreateLeadDialogProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  onSubmit?: (data: CreateLeadFormData) => void
}

export default function CreateLeadDialog({ open, onOpenChange, onSubmit }: CreateLeadDialogProps) {
  const [formData, setFormData] = useState<CreateLeadFormData>({
    message: "",
    contactMethod: "",
    serviceType: "",
    eventDate: undefined,
    budgetMin: "",
    budgetMax: "",
    currency: "INR",
    location: "",
    priority: "medium",
    source: "website",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [locations] = useState<string[]>(
    [
      "Ahmedabad",
      "Bangalore",
      "Bengaluru",
      "Chandigarh",
      "Chennai",
      "Delhi",
      "Delihi",
      "Greater Noida",
      "Gurgaon",
      "Hyderabad",
      "Jaipur",
      "Kochi",
      "Kolkata",
      "Lucknow",
      "Mumbai",
      "Noida",
      "Noshhsbs",
      "Pune",
      "Wedding",
    ].sort(),
  )

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.serviceType) newErrors.serviceType = "Service type is required"
    if (!formData.eventDate) newErrors.eventDate = "Event date is required"
    if (!formData.location.trim()) newErrors.location = "Location is required"
    if (!formData.budgetMin) newErrors.budgetMin = "Minimum budget is required"
    if (!formData.budgetMax) newErrors.budgetMax = "Maximum budget is required"
    if (!formData.contactMethod) newErrors.contactMethod = "Contact method is required"
    if (!formData.message.trim()) newErrors.message = "Message is required"

    if (formData.budgetMin && formData.budgetMax && Number(formData.budgetMin) >= Number(formData.budgetMax)) {
      newErrors.budgetMax = "Maximum budget must be greater than minimum"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      const leadData = {
        message: formData.message,
        contactMethod: formData.contactMethod,
        serviceType: formData.serviceType,
        eventDate: formData.eventDate?.toISOString(),
        budget: {
          min: Number.parseInt(formData.budgetMin),
          max: Number.parseInt(formData.budgetMax),
          currency: formData.currency,
        },
        location: formData.location,
        priority: formData.priority,
        source: formData.source,
        status: "new",
      }

      const response = await fetch("https://pixisphere-backend-t2l9.onrender.com/api/v1/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(leadData),
      })

      if (response.ok) {
        setFormData({
          message: "",
          contactMethod: "",
          serviceType: "",
          eventDate: undefined,
          budgetMin: "",
          budgetMax: "",
          currency: "INR",
          location: "",
          priority: "medium",
          source: "website",
        })
        setErrors({})
        onSubmit?.(formData)
        onOpenChange?.(false)
        alert("Lead created successfully!")
      } else {
        throw new Error("Failed to create lead")
      }
    } catch (error) {
      console.error("Error creating lead:", error)
      alert("Failed to create lead. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const updateFormData = (field: keyof CreateLeadFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const getSelectedService = () => {
    return serviceTypes.find((service) => service.value === formData.serviceType)
  }

  const getSelectedContact = () => {
    return contactMethods.find((method) => method.value === formData.contactMethod)
  }

  const ServiceIcon = getSelectedService()?.icon
  const ContactIcon = getSelectedContact()?.icon

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button
          size="lg"
          className="gap-2 w-full bg-gray-600 hover:bg-gray-700 text-white text-sm py-2"
        >
          <MessageSquare className="w-4 h-4" />
          Let's Connect
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full max-w-4xl max-h-[95vh] p-0 gap-0 overflow-hidden">
        {/* Header */}
        <DialogHeader className="px-6 py-4 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-muted rounded-lg">
                <Camera className="w-5 h-5" />
              </div>
              <div>
                <DialogTitle className="text-xl font-semibold">Create Photography Inquiry</DialogTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Let's find the perfect photographer for your special moments
                </p>
              </div>
            </div>
            <Badge variant="secondary">
              <Users className="w-3 h-3 mr-1" />
              Trusted by 10k+ clients
            </Badge>
          </div>
        </DialogHeader>

        <div className="overflow-y-auto max-h-[calc(95vh-120px)]">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Service Type */}
            <div className="space-y-2">
              <Label>Service Type</Label>
              <Select
                value={formData.serviceType}
                onValueChange={(value) => updateFormData("serviceType", value)}
              >
                <SelectTrigger className={cn(errors.serviceType && "border-destructive")}>
                  <SelectValue placeholder="Select a service" />
                </SelectTrigger>
                <SelectContent>
                  {serviceTypes.map((service) => (
                    <SelectItem key={service.value} value={service.value}>
                      <div className="flex items-center gap-2">
                        <service.icon className="w-4 h-4" />
                        {service.value}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.serviceType && <p className="text-xs text-destructive">{errors.serviceType}</p>}
            </div>

            {/* Event Date */}
            <div className="space-y-2">
              <Label>Event Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.eventDate && "text-muted-foreground",
                      errors.eventDate && "border-destructive",
                    )}
                  >
                    {formData.eventDate ? (
                      format(formData.eventDate, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={formData.eventDate}
                    onSelect={(date) => updateFormData("eventDate", date)}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {errors.eventDate && <p className="text-xs text-destructive">{errors.eventDate}</p>}
            </div>

            {/* Location */}
            <div className="space-y-2">
              <Label>Location</Label>
              <Select
                value={formData.location}
                onValueChange={(value) => updateFormData("location", value)}
              >
                <SelectTrigger className={cn(errors.location && "border-destructive")}>
                  <SelectValue placeholder="Select a city" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map((city) => (
                    <SelectItem key={city} value={city}>{city}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.location && <p className="text-xs text-destructive">{errors.location}</p>}
            </div>

            {/* Budget */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Budget Min (₹)</Label>
                <Input
                  type="number"
                  value={formData.budgetMin}
                  onChange={(e) => updateFormData("budgetMin", e.target.value)}
                  className={cn(errors.budgetMin && "border-destructive")}
                />
                {errors.budgetMin && <p className="text-xs text-destructive">{errors.budgetMin}</p>}
              </div>
              <div className="space-y-2">
                <Label>Budget Max (₹)</Label>
                <Input
                  type="number"
                  value={formData.budgetMax}
                  onChange={(e) => updateFormData("budgetMax", e.target.value)}
                  className={cn(errors.budgetMax && "border-destructive")}
                />
                {errors.budgetMax && <p className="text-xs text-destructive">{errors.budgetMax}</p>}
              </div>
            </div>

            {/* Preferred Contact Method */}
            <div className="space-y-2">
              <Label>Preferred Contact Method</Label>
              <Select
                value={formData.contactMethod}
                onValueChange={(value) => updateFormData("contactMethod", value)}
              >
                <SelectTrigger className={cn(errors.contactMethod && "border-destructive")}>
                  <SelectValue placeholder="Select a method" />
                </SelectTrigger>
                <SelectContent>
                  {contactMethods.map((method) => (
                    <SelectItem key={method.value} value={method.value}>
                      <method.icon className="w-4 h-4 mr-2" />
                      {method.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.contactMethod && <p className="text-xs text-destructive">{errors.contactMethod}</p>}
            </div>

            {/* Additional Message */}
            <div className="space-y-2">
              <Label>Message to Photographer</Label>
              <Textarea
                placeholder="Tell us more about your event and requirements..."
                value={formData.message}
                onChange={(e) => updateFormData("message", e.target.value)}
                className={cn(errors.message && "border-destructive")}
              />
              {errors.message && <p className="text-xs text-destructive">{errors.message}</p>}
            </div>

            {/* Submit */}
            <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Inquiry"}
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
} 