"use client"

import { useState, useEffect } from "react"
import { useHydration } from "./use-hydration"
import type { Opportunity, Lead } from "@/types"

export function useOpportunities() {
  const isHydrated = useHydration()
  
  // Initialize opportunities from localStorage immediately, with fallback for SSR
  const [opportunities, setOpportunities] = useState<Opportunity[]>(() => {
    if (typeof window === 'undefined') return []
    try {
      const storedOpportunities = window.localStorage.getItem("opportunities-data")
      return storedOpportunities ? JSON.parse(storedOpportunities) : []
    } catch (error) {
      console.error("Error loading opportunities from localStorage:", error)
      return []
    }
  })

  // Ensure opportunities are loaded after hydration if not already loaded
  useEffect(() => {
    if (!isHydrated || opportunities.length > 0) return
    
    try {
      const storedOpportunities = window.localStorage.getItem("opportunities-data")
      if (storedOpportunities) {
        setOpportunities(JSON.parse(storedOpportunities))
      }
    } catch (error) {
      console.error("Error loading opportunities from localStorage:", error)
    }
  }, [isHydrated, opportunities.length])

  // Save opportunities to localStorage whenever they change
  useEffect(() => {
    try {
      window.localStorage.setItem("opportunities-data", JSON.stringify(opportunities))
    } catch (error) {
      console.error("Error saving opportunities to localStorage:", error)
    }
  }, [opportunities])

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

  const deleteOpportunity = async (id: string) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 300))

      setOpportunities((prev) => prev.filter((opp) => opp.id !== id))

      return true
    } catch (err) {
      throw new Error("Failed to delete opportunity")
    }
  }

  const clearOpportunities = () => {
    setOpportunities([])
    
    // Also clear from localStorage
    try {
      window.localStorage.removeItem("opportunities-data")
    } catch (error) {
      console.error("Error clearing opportunities from localStorage:", error)
    }
  }

  return {
    opportunities,
    createOpportunity,
    updateOpportunity,
    deleteOpportunity,
    clearOpportunities,
  }
}
