"use client"

import { useState, useEffect, useMemo } from "react"
import { useDebounce } from "./use-debounce"
import { useLocalStorage } from "./use-local-storage"
import { useToast } from "./use-toast"
import type { Lead, LeadStatus } from "@/types"

interface LeadFilters {
  searchTerm: string
  statusFilter: LeadStatus | "all"
  sortBy: "score" | "name" | "company" | "createdAt"
  sortOrder: "asc" | "desc"
  page: number
  pageSize: number
}

export function useLeads() {
  // Initialize leads from localStorage if available
  const [leads, setLeads] = useState<Lead[]>(() => {
    try {
      const storedLeads = window.localStorage.getItem("leads-data")
      return storedLeads ? JSON.parse(storedLeads) : []
    } catch (error) {
      console.error("Error loading leads from localStorage:", error)
      return []
    }
  })
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Initialize hasData based on leads length
  const [hasData, setHasData] = useState(() => {
    try {
      const storedLeads = window.localStorage.getItem("leads-data")
      return storedLeads ? JSON.parse(storedLeads).length > 0 : false
    } catch (error) {
      return false
    }
  })
  
  const { toast } = useToast()

  // Save leads to localStorage whenever they change
  useEffect(() => {
    try {
      window.localStorage.setItem("leads-data", JSON.stringify(leads))
      setHasData(leads.length > 0)
    } catch (error) {
      console.error("Error saving leads to localStorage:", error)
    }
  }, [leads])

  // Initialize filters from localStorage if available
  const [filters, setFilters] = useState<LeadFilters>(() => {
    try {
      const storedFilters = window.localStorage.getItem("lead-filters")
      return storedFilters ? JSON.parse(storedFilters) : {
        searchTerm: "",
        statusFilter: "all",
        sortBy: "score",
        sortOrder: "desc",
        page: 1,
        pageSize: 100,
      }
    } catch (error) {
      console.error("Error loading filters from localStorage:", error)
      return {
        searchTerm: "",
        statusFilter: "all",
        sortBy: "score",
        sortOrder: "desc",
        page: 1,
        pageSize: 100,
      }
    }
  })

  // Save filters to localStorage whenever they change
  useEffect(() => {
    try {
      window.localStorage.setItem("lead-filters", JSON.stringify(filters))
    } catch (error) {
      console.error("Error saving filters to localStorage:", error)
    }
  }, [filters])

  const debouncedSearchTerm = useDebounce(filters.searchTerm, 300)

  // Filter and sort leads with debounced search
  const filteredAndSortedLeads = useMemo(() => {
    let filtered = leads

    // Apply search filter with debounced term
    if (debouncedSearchTerm) {
      const term = debouncedSearchTerm.toLowerCase()
      filtered = filtered.filter(
        (lead) => lead.name.toLowerCase().includes(term) || lead.company.toLowerCase().includes(term),
      )
    }

    // Apply status filter
    if (filters.statusFilter !== "all") {
      filtered = filtered.filter((lead) => lead.status === filters.statusFilter)
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: any = a[filters.sortBy]
      let bValue: any = b[filters.sortBy]

      if (filters.sortBy === "createdAt") {
        aValue = new Date(aValue).getTime()
        bValue = new Date(bValue).getTime()
      }

      if (typeof aValue === "string") {
        aValue = aValue.toLowerCase()
        bValue = bValue.toLowerCase()
      }

      let comparison = 0
      if (aValue < bValue) {
        comparison = -1
      } else if (aValue > bValue) {
        comparison = 1
      }

      return filters.sortOrder === "asc" ? comparison : -comparison
    })

    return filtered
  }, [leads, debouncedSearchTerm, filters.statusFilter, filters.sortBy, filters.sortOrder])

  // Paginate the filtered results
  const paginatedLeads = useMemo(() => {
    if (filteredAndSortedLeads.length === 0) {
      return []
    }
    const startIndex = (filters.page - 1) * filters.pageSize
    const endIndex = startIndex + filters.pageSize
    return filteredAndSortedLeads.slice(startIndex, endIndex)
  }, [filteredAndSortedLeads, filters.page, filters.pageSize, filters.sortBy, filters.sortOrder])

  // Calculate pagination info
  const totalPages = Math.ceil(filteredAndSortedLeads.length / filters.pageSize)
  const hasNextPage = filters.page < totalPages
  const hasPrevPage = filters.page > 1

  const updateLead = async (id: string, updates: Partial<Lead>) => {
    try {
      setLeads((prev) => prev.map((lead) => (lead.id === id ? { ...lead, ...updates } : lead)))

      // Simulate API call
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          // Simulate occasional failures for demo
          if (Math.random() < 0.1) {
            reject(new Error("Network error"))
          } else {
            resolve(true)
          }
        }, 500)
      })

      return true
    } catch (err) {
      setLeads((prev) => prev.map((lead) => (lead.id === id ? { ...lead, ...updates } : lead)))
      throw new Error("Failed to update lead")
    }
  }

  const loadLeadsFromFile = async (file: File) => {
    try {
      setLoading(true)
      setError(null)

      // Validate file type
      if (!file.name.endsWith('.json')) {
        throw new Error("Please select a valid JSON file")
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error("File size must be less than 5MB")
      }

      // Simulate loading delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const text = await file.text()
      const data = JSON.parse(text)

      // Validate data structure
      if (!Array.isArray(data)) {
        throw new Error("JSON file must contain an array of leads")
      }

      // Validate each lead object
      const validatedLeads: Lead[] = data.map((item: any, index: number) => {
        if (!item.id || !item.name || !item.company || !item.email || !item.source || 
            typeof item.score !== 'number' || !item.status || !item.createdAt) {
          throw new Error(`Invalid lead data at index ${index}. Missing required fields.`)
        }

        if (!['new', 'contacted', 'qualified', 'unqualified'].includes(item.status)) {
          throw new Error(`Invalid status "${item.status}" at index ${index}`)
        }

        if (item.score < 0 || item.score > 100) {
          throw new Error(`Invalid score "${item.score}" at index ${index}. Must be between 0-100.`)
        }

        return {
          id: String(item.id),
          name: String(item.name),
          company: String(item.company),
          email: String(item.email),
          source: String(item.source),
          score: Number(item.score),
          status: item.status as LeadStatus,
          createdAt: String(item.createdAt)
        }
      })

      setLeads(validatedLeads)
      
      toast({
        title: "Leads Loaded Successfully",
        description: `${validatedLeads.length} leads have been loaded from the file.`,
      })

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to load leads from file"
      setError(errorMessage)
      toast({
        title: "Upload Failed",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const clearLeads = () => {
    setLeads([])
    setError(null)
    clearFilters()
    
    // Also clear from localStorage
    try {
      window.localStorage.removeItem("leads-data")
    } catch (error) {
      console.error("Error clearing leads from localStorage:", error)
    }
    
    toast({
      title: "Leads Cleared",
      description: "All leads have been removed.",
    })
  }

  const setSearchTerm = (term: string) => {
    setFilters((prev) => ({ ...prev, searchTerm: term, page: 1 }))
  }

  const setStatusFilter = (status: LeadStatus | "all") => {
    setFilters((prev) => ({ ...prev, statusFilter: status, page: 1 }))
  }

  const setSortBy = (sortBy: LeadFilters["sortBy"]) => {
    setFilters((prev) => ({ ...prev, sortBy }))
  }

  const setSortOrder = (sortOrder: "asc" | "desc") => {
    setFilters((prev) => ({ ...prev, sortOrder }))
  }

  const setPage = (page: number) => {
    setFilters((prev) => ({ ...prev, page }))
  }

  const setPageSize = (pageSize: number) => {
    setFilters((prev) => ({ ...prev, pageSize, page: 1 }))
  }

  const goToNextPage = () => {
    if (hasNextPage) {
      setPage(filters.page + 1)
    }
  }

  const goToPrevPage = () => {
    if (hasPrevPage) {
      setPage(filters.page - 1)
    }
  }

  const goToFirstPage = () => {
    setPage(1)
  }

  const goToLastPage = () => {
    setPage(totalPages)
  }

  const clearFilters = () => {
    setFilters({
      searchTerm: "",
      statusFilter: "all",
      sortBy: "score",
      sortOrder: "desc",
      page: 1,
      pageSize: 100,
    })
  }

  return {
    leads: paginatedLeads,
    allLeads: filteredAndSortedLeads,
    loading,
    error,
    hasData,
    searchTerm: filters.searchTerm,
    setSearchTerm,
    statusFilter: filters.statusFilter,
    setStatusFilter,
    sortBy: filters.sortBy,
    setSortBy,
    sortOrder: filters.sortOrder,
    setSortOrder,
    page: filters.page,
    pageSize: filters.pageSize,
    setPage,
    setPageSize,
    totalPages,
    hasNextPage,
    hasPrevPage,
    goToNextPage,
    goToPrevPage,
    goToFirstPage,
    goToLastPage,
    updateLead,
    loadLeadsFromFile,
    clearLeads,
    clearFilters,
    totalLeads: leads.length,
    filteredCount: filteredAndSortedLeads.length,
    currentPageStart: (filters.page - 1) * filters.pageSize + 1,
    currentPageEnd: Math.min(filters.page * filters.pageSize, filteredAndSortedLeads.length),
  }
}
