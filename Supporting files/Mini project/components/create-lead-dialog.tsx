"use client"

import type React from "react"
import { useState } from "react"
import {
  Calendar,
  MapPin,
  Phone,
  MessageSquare,
  Camera,
  DollarSign,
  Plus,
  Clock,
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
        <Button size="lg" className="gap-2">
          <Plus className="w-4 h-4" />
          Create New Inquiry
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
            {/* Service Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="w-4 h-4" />
                  Photography Service
                </CardTitle>
                <CardDescription>Choose the type of photography service you need</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Service Type *</Label>
                  <Select value={formData.serviceType} onValueChange={(value) => updateFormData("serviceType", value)}>
                    <SelectTrigger className={cn("h-12", errors.serviceType && "border-destructive")}>
                      <SelectValue placeholder="Select your photography service">
                        {getSelectedService() && (
                          <div className="flex items-center gap-2">
                            {ServiceIcon && <ServiceIcon className="w-4 h-4" />}
                            <div className="text-left">
                              <div className="font-medium">{getSelectedService()?.value}</div>
                              <div className="text-xs text-muted-foreground">{getSelectedService()?.description}</div>
                            </div>
                          </div>
                        )}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {serviceTypes.map((service) => {
                        const Icon = service.icon
                        return (
                          <SelectItem key={service.value} value={service.value} className="h-12">
                            <div className="flex items-center gap-2">
                              <Icon className="w-4 h-4" />
                              <div>
                                <div className="font-medium">{service.value}</div>
                                <div className="text-xs text-muted-foreground">{service.description}</div>
                              </div>
                            </div>
                          </SelectItem>
                        )
                      })}
                    </SelectContent>
                  </Select>
                  {errors.serviceType && <p className="text-sm text-destructive">{errors.serviceType}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Event Date *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full h-12 justify-start text-left font-normal",
                            !formData.eventDate && "text-muted-foreground",
                            errors.eventDate && "border-destructive",
                          )}
                        >
                          <Calendar className="mr-2 h-4 w-4" />
                          <div>
                            {formData.eventDate ? (
                              <>
                                <div className="font-medium">{format(formData.eventDate, "EEEE, MMMM dd")}</div>
                                <div className="text-xs text-muted-foreground">
                                  {format(formData.eventDate, "yyyy")}
                                </div>
                              </>
                            ) : (
                              <span>Select your event date</span>
                            )}
                          </div>
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
                    {errors.eventDate && <p className="text-sm text-destructive">{errors.eventDate}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Event Location *</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
                      <Select value={formData.location} onValueChange={(value) => updateFormData("location", value)}>
                        <SelectTrigger className={cn("pl-10 h-12", errors.location && "border-destructive")}>
                          <SelectValue placeholder="Choose your city" />
                        </SelectTrigger>
                        <SelectContent>
                          {locations.map((location) => (
                            <SelectItem key={location} value={location}>
                              {location}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    {errors.location && <p className="text-sm text-destructive">{errors.location}</p>}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Budget & Contact */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Budget Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    Budget Range
                  </CardTitle>
                  <CardDescription>Set your photography budget range</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">From *</Label>
                      <Input
                        type="number"
                        placeholder="15,000"
                        value={formData.budgetMin}
                        onChange={(e) => updateFormData("budgetMin", e.target.value)}
                        className={cn("h-10", errors.budgetMin && "border-destructive")}
                      />
                      {errors.budgetMin && <p className="text-xs text-destructive">{errors.budgetMin}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">To *</Label>
                      <Input
                        type="number"
                        placeholder="25,000"
                        value={formData.budgetMax}
                        onChange={(e) => updateFormData("budgetMax", e.target.value)}
                        className={cn("h-10", errors.budgetMax && "border-destructive")}
                      />
                      {errors.budgetMax && <p className="text-xs text-destructive">{errors.budgetMax}</p>}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Currency</Label>
                    <Select value={formData.currency} onValueChange={(value) => updateFormData("currency", value)}>
                      <SelectTrigger className="h-10">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="INR">Indian Rupee (₹)</SelectItem>
                        <SelectItem value="USD">US Dollar ($)</SelectItem>
                        <SelectItem value="EUR">Euro (€)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Contact Preferences
                  </CardTitle>
                  <CardDescription>How would you like us to reach you?</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Preferred Contact Method *</Label>
                    <Select
                      value={formData.contactMethod}
                      onValueChange={(value) => updateFormData("contactMethod", value)}
                    >
                      <SelectTrigger className={cn("h-12", errors.contactMethod && "border-destructive")}>
                        <SelectValue placeholder="Choose contact method">
                          {getSelectedContact() && (
                            <div className="flex items-center gap-2">
                              {ContactIcon && <ContactIcon className="w-4 h-4" />}
                              <div className="text-left">
                                <div className="font-medium">{getSelectedContact()?.label}</div>
                                <div className="text-xs text-muted-foreground">{getSelectedContact()?.description}</div>
                              </div>
                            </div>
                          )}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {contactMethods.map((method) => {
                          const Icon = method.icon
                          return (
                            <SelectItem key={method.value} value={method.value} className="h-12">
                              <div className="flex items-center gap-2">
                                <Icon className="w-4 h-4" />
                                <div>
                                  <div className="font-medium">{method.label}</div>
                                  <div className="text-xs text-muted-foreground">{method.description}</div>
                                </div>
                              </div>
                            </SelectItem>
                          )
                        })}
                      </SelectContent>
                    </Select>
                    {errors.contactMethod && <p className="text-sm text-destructive">{errors.contactMethod}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">How did you find us?</Label>
                    <Select value={formData.source} onValueChange={(value) => updateFormData("source", value)}>
                      <SelectTrigger className="h-10">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {sources.map((source) => {
                          const Icon = source.icon
                          return (
                            <SelectItem key={source.value} value={source.value}>
                              <div className="flex items-center gap-2">
                                <Icon className="w-4 h-4" />
                                <span>{source.label}</span>
                              </div>
                            </SelectItem>
                          )
                        })}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Message */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Tell Us About Your Vision
                </CardTitle>
                <CardDescription>Share your photography requirements and preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Describe your requirements *</Label>
                  <Textarea
                    placeholder="Tell us about your vision, style preferences, specific requirements, or any questions you have. The more details you provide, the better we can match you with the perfect photographer..."
                    value={formData.message}
                    onChange={(e) => updateFormData("message", e.target.value)}
                    rows={4}
                    className={cn("resize-none", errors.message && "border-destructive")}
                  />
                  {errors.message && <p className="text-sm text-destructive">{errors.message}</p>}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>We typically respond within 2 hours</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Separator />

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange?.(false)}
                disabled={isSubmitting}
                className="flex-1 sm:flex-none"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} className="flex-1">
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                    Creating Your Inquiry...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-plus w-4 h-4"><path d="M5 12h14"></path><path d="M12 5v14"></path></svg>Submit Shoot Inquiry
                  </div>
                )}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
