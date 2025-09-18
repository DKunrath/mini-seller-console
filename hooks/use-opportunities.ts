"use client"

import { useState } from "react"
import type { Opportunity, Lead } from "@/types"

export function useOpportunities() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([])

  const createOpportunity = async (lead: Lead, amount?: number) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      const newOpportunity: Opportunity = {
        id: `opp-${Date.now()}`,
        name: `${lead.company} - ${lead.name}`,
        stage: "new",
        amount,
        accountName: lead.company,
        createdAt: new Date().toISOString(),
        leadId: lead.id,
      }

      setOpportunities((prev) => [...prev, newOpportunity])
      return newOpportunity
    } catch (err) {
      throw new Error("Failed to create opportunity")
    }
  }

  const updateOpportunity = async (id: string, updates: Partial<Opportunity>) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      setOpportunities((prev) => prev.map((opp) => (opp.id === id ? { ...opp, ...updates } : opp)))

      return true
    } catch (err) {
      throw new Error("Failed to update opportunity")
    }
  }

  return {
    opportunities,
    createOpportunity,
    updateOpportunity,
  }
}
