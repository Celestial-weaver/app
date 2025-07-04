"use client"
import { Calendar, MapPin, Phone, MessageSquare, User, DollarSign, Clock, AlertCircle, Camera } from "lucide-react"
import { format } from "date-fns"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface Lead {
  _id: { $oid: string }
  clientId: { $oid: string }
  partnerId: { $oid: string }
  message: string
  status: string
  contactMethod: string
  serviceType: string
  eventDate: { $date: string }
  budget: {
    min: number
    max: number
    currency: string
  }
  location: string
  contactedAt: { $date: string }
  convertedAt: string | null
  closedAt: string | null
  notes: Array<{
    note: string
    addedBy: { $oid: string }
    addedAt: { $date: string }
  }>
  priority: string
  source: string
  deletedAt: string | null
  createdAt: { $date: string }
  updatedAt: { $date: string }
}

const sampleLead: Lead = {
  _id: { $oid: "68483083519458498e9bb0aa" },
  clientId: { $oid: "6848115262398c2fd050858d" },
  partnerId: { $oid: "68481f2762398c2fd0508777" },
  message: "Looking for a pre-wedding shoot package within a reasonable budget.",
  status: "new",
  contactMethod: "whatsapp",
  serviceType: "Pre-Wedding Photography",
  eventDate: { $date: "2025-07-15T00:00:00.000Z" },
  budget: {
    min: 15000,
    max: 25000,
    currency: "INR",
  },
  location: "Bangalore",
  contactedAt: { $date: "2025-06-10T12:00:00.000Z" },
  convertedAt: null,
  closedAt: null,
  notes: [
    {
      note: "Client prefers candid shots and outdoor locations.",
      addedBy: { $oid: "68481f2762398c2fd0508777" },
      addedAt: { $date: "2025-06-10T12:00:00.000Z" },
    },
  ],
  priority: "high",
  source: "website",
  deletedAt: null,
  createdAt: { $date: "2025-06-10T12:30:00.000Z" },
  updatedAt: { $date: "2025-06-10T12:30:00.000Z" },
}

interface LeadDialogProps {
  lead?: Lead
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function LeadDialog({ lead = sampleLead, open, onOpenChange }: LeadDialogProps) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "new":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100"
      case "contacted":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
      case "converted":
        return "bg-green-100 text-green-800 hover:bg-green-100"
      case "closed":
        return "bg-gray-100 text-gray-800 hover:bg-gray-100"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high":
        return "bg-red-100 text-red-800 hover:bg-red-100"
      case "medium":
        return "bg-orange-100 text-orange-800 hover:bg-orange-100"
      case "low":
        return "bg-green-100 text-green-800 hover:bg-green-100"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100"
    }
  }

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: currency,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "PPP")
  }

  const formatDateTime = (dateString: string) => {
    return format(new Date(dateString), "PPp")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline">View Lead Details</Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl font-bold">Lead Details</DialogTitle>
              <DialogDescription>Lead ID: {lead._id.$oid.slice(-8)}</DialogDescription>
            </div>
            <div className="flex gap-2">
              <Badge className={getStatusColor(lead.status)}>{lead.status.toUpperCase()}</Badge>
              <Badge className={getPriorityColor(lead.priority)}>
                <AlertCircle className="w-3 h-3 mr-1" />
                {lead.priority.toUpperCase()} PRIORITY
              </Badge>
            </div>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Service Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="w-5 h-5" />
                Service Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="font-medium">Service Type:</span>
                <Badge variant="secondary">{lead.serviceType}</Badge>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="font-medium">Event Date:</span>
                <span>{formatDate(lead.eventDate.$date)}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span className="font-medium">Location:</span>
                <span>{lead.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-muted-foreground" />
                <span className="font-medium">Budget:</span>
                <span>
                  {formatCurrency(lead.budget.min, lead.budget.currency)} -{" "}
                  {formatCurrency(lead.budget.max, lead.budget.currency)}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <span className="font-medium">Preferred Contact:</span>
                <Badge variant="outline" className="capitalize">
                  {lead.contactMethod}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">Source:</span>
                <Badge variant="outline" className="capitalize">
                  {lead.source}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="font-medium">Contacted At:</span>
                <span className="text-sm">{formatDateTime(lead.contactedAt.$date)}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Client Message */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Client Message
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground bg-muted p-4 rounded-lg">"{lead.message}"</p>
          </CardContent>
        </Card>

        {/* Notes Section */}
        {lead.notes.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {lead.notes.map((note, index) => (
                  <div key={index} className="flex gap-3">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="text-xs">{note.addedBy.$oid.slice(-2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm">{note.note}</p>
                      <p className="text-xs text-muted-foreground mt-1">{formatDateTime(note.addedAt.$date)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Timestamps */}
        <Card>
          <CardHeader>
            <CardTitle>Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Created:</span>
                <p className="text-muted-foreground">{formatDateTime(lead.createdAt.$date)}</p>
              </div>
              <div>
                <span className="font-medium">Last Updated:</span>
                <p className="text-muted-foreground">{formatDateTime(lead.updatedAt.$date)}</p>
              </div>
              {lead.convertedAt && (
                <div>
                  <span className="font-medium">Converted:</span>
                  <p className="text-muted-foreground">{formatDateTime(lead.convertedAt)}</p>
                </div>
              )}
              {lead.closedAt && (
                <div>
                  <span className="font-medium">Closed:</span>
                  <p className="text-muted-foreground">{formatDateTime(lead.closedAt)}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline">Add Note</Button>
          <Button variant="outline">Update Status</Button>
          <Button>Contact Client</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
s