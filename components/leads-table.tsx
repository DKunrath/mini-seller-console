"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertCircle, Users, TrendingUp } from "lucide-react"
import { formatDate } from "@/utils/validation"
import type { Lead } from "@/types"

interface LeadsTableProps {
  leads: Lead[]
  loading: boolean
  error: string | null
  hasData: boolean
  onLeadClick: (lead: Lead) => void
}

export function LeadsTable({ leads, loading, error, hasData, onLeadClick }: LeadsTableProps) {
  const getStatusColor = (status: Lead["status"]) => {
    switch (status) {
      case "new":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200"
      case "contacted":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
      case "qualified":
        return "bg-green-100 text-green-800 hover:bg-green-200"
      case "unqualified":
        return "bg-red-100 text-red-800 hover:bg-red-200"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200"
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600 font-semibold"
    if (score >= 75) return "text-yellow-600 font-semibold"
    return "text-red-600 font-semibold"
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
                </div>
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-4 w-16" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center space-x-2 text-destructive">
            <AlertCircle className="h-5 w-5" />
            <span>{error}</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (leads.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center py-8">
            <Users className="h-12 w-12 text-muted-foreground" />
            <div>
              <h3 className="text-lg font-semibold">
                {hasData ? "No leads found" : "No leads loaded"}
              </h3>
              <p className="text-muted-foreground">
                {hasData 
                  ? "Try adjusting your search criteria or clear the filters."
                  : "Upload a JSON file to start managing your leads."
                }
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-border bg-muted/50">
              <tr>
                <th className="text-left p-4 font-semibold">Lead</th>
                <th className="text-left p-4 font-semibold">Company</th>
                <th className="text-left p-4 font-semibold">Source</th>
                <th className="text-left p-4 font-semibold">Score</th>
                <th className="text-left p-4 font-semibold">Status</th>
                <th className="text-left p-4 font-semibold">Created</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr
                  key={lead.id}
                  className="border-b border-border hover:bg-muted/50 cursor-pointer transition-colors"
                  onClick={() => onLeadClick(lead)}
                >
                  <td className="p-4">
                    <div>
                      <div className="font-medium">{lead.name}</div>
                      <div className="text-sm text-muted-foreground">{lead.email}</div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="font-medium">{lead.company}</div>
                  </td>
                  <td className="p-4">
                    <Badge variant="outline">{lead.source}</Badge>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                      <span className={getScoreColor(lead.score)}>{lead.score}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <Badge className={getStatusColor(lead.status)} variant="secondary">
                      {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                    </Badge>
                  </td>
                  <td className="p-4 text-sm text-muted-foreground">{formatDate(lead.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
