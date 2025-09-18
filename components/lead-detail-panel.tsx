"use client"

import { useState } from "react"
import { X, Mail, Building, Calendar, TrendingUp, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { validateEmail, formatDate } from "@/utils/validation"
import type { Lead, Opportunity } from "@/types"

interface LeadDetailPanelProps {
  lead: Lead
  onClose: () => void
  onUpdate: (id: string, updates: Partial<Lead>) => Promise<void>
  onConvert: (lead: Lead, amount?: number) => Promise<Opportunity>
}

export function LeadDetailPanel({ lead, onClose, onUpdate, onConvert }: LeadDetailPanelProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedLead, setEditedLead] = useState(lead)
  const [isLoading, setIsLoading] = useState(false)
  const [convertAmount, setConvertAmount] = useState("")
  const [showConvertForm, setShowConvertForm] = useState(false)
  const { toast } = useToast()

  const hasChanges = JSON.stringify(editedLead) !== JSON.stringify(lead)

  const handleSave = async () => {
    if (!validateEmail(editedLead.email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsLoading(true)
      await onUpdate(lead.id, {
        email: editedLead.email,
        status: editedLead.status,
      })
      setIsEditing(false)
      toast({
        title: "Lead Updated",
        description: "Lead information has been successfully updated.",
      })
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update lead. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    setEditedLead(lead)
    setIsEditing(false)
  }

  const handleConvert = async () => {
    try {
      setIsLoading(true)
      const amount = convertAmount ? Number.parseFloat(convertAmount) : undefined
      await onConvert(lead, amount)
      toast({
        title: "Lead Converted",
        description: "Lead has been successfully converted to an opportunity.",
      })
      onClose()
    } catch (error) {
      toast({
        title: "Conversion Failed",
        description: "Failed to convert lead. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
      setShowConvertForm(false)
    }
  }

  const getStatusColor = (status: Lead["status"]) => {
    switch (status) {
      case "new":
        return "bg-blue-100 text-blue-800"
      case "contacted":
        return "bg-yellow-100 text-yellow-800"
      case "qualified":
        return "bg-green-100 text-green-800"
      case "unqualified":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600"
    if (score >= 75) return "text-yellow-600"
    return "text-red-600"
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-end z-50">
      <div className="bg-background w-full max-w-md h-full overflow-y-auto shadow-xl">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Lead Details</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Lead Info Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{lead.name}</span>
                <Badge className={getStatusColor(lead.status)} variant="secondary">
                  {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Building className="h-4 w-4 text-muted-foreground" />
                <span>{lead.company}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{lead.email}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>{formatDate(lead.createdAt)}</span>
              </div>
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                <span className={`font-semibold ${getScoreColor(lead.score)}`}>Score: {lead.score}</span>
              </div>
              <div className="flex items-center space-x-2">
                <ExternalLink className="h-4 w-4 text-muted-foreground" />
                <Badge variant="outline">{lead.source}</Badge>
              </div>
            </CardContent>
          </Card>

          <Separator />

          {/* Edit Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Edit Lead</span>
                {!isEditing && (
                  <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                    Edit
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={editedLead.email}
                  onChange={(e) => setEditedLead({ ...editedLead, email: e.target.value })}
                  disabled={!isEditing}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={editedLead.status}
                  onValueChange={(value) => setEditedLead({ ...editedLead, status: value as Lead["status"] })}
                  disabled={!isEditing}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="contacted">Contacted</SelectItem>
                    <SelectItem value="qualified">Qualified</SelectItem>
                    <SelectItem value="unqualified">Unqualified</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {isEditing && (
                <div className="flex space-x-2">
                  <Button onClick={handleSave} disabled={!hasChanges || isLoading} className="flex-1">
                    {isLoading ? "Saving..." : "Save"}
                  </Button>
                  <Button variant="outline" onClick={handleCancel} className="flex-1 bg-transparent">
                    Cancel
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Separator />

          {/* Convert to Opportunity */}
          <Card>
            <CardHeader>
              <CardTitle>Convert to Opportunity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {!showConvertForm ? (
                <Button
                  onClick={() => setShowConvertForm(true)}
                  className="w-full"
                  disabled={lead.status === "unqualified"}
                >
                  Convert Lead
                </Button>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="amount">Expected Amount (Optional)</Label>
                    <Input
                      id="amount"
                      type="number"
                      placeholder="Enter amount in USD"
                      value={convertAmount}
                      onChange={(e) => setConvertAmount(e.target.value)}
                    />
                  </div>
                  <div className="flex space-x-2">
                    <Button onClick={handleConvert} disabled={isLoading} className="flex-1">
                      {isLoading ? "Converting..." : "Convert"}
                    </Button>
                    <Button variant="outline" onClick={() => setShowConvertForm(false)} className="flex-1">
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
