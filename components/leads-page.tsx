"use client"

import { useState, useEffect } from "react"
import { Search, Filter, SortDesc, X, Users, ChevronDown, ChevronUp } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LeadsTable } from "@/components/leads-table"
import { LeadDetailPanel } from "@/components/lead-detail-panel"
import { LeadsUpload } from "@/components/leads-upload"
import { Pagination } from "@/components/pagination"
import { LoadingSkeleton } from "@/components/loading-skeleton"
import { useLeads } from "@/hooks/use-leads"
import type { Lead, Opportunity } from "@/types"

interface LeadsPageProps {
  onCreateOpportunity: (lead: Lead, amount?: number) => Promise<Opportunity>
}

export function LeadsPage({ onCreateOpportunity }: LeadsPageProps) {
  const {
    leads,
    allLeads,
    loading,
    error,
    hasData,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    page,
    pageSize,
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
    totalLeads,
    filteredCount,
    currentPageStart,
    currentPageEnd,
  } = useLeads()

  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [isUploadSectionCollapsed, setIsUploadSectionCollapsed] = useState(false)

  // Auto-collapse upload section when data is first loaded
  useEffect(() => {
    if (hasData && !isUploadSectionCollapsed) {
      // Small delay to let user see the data was loaded
      const timer = setTimeout(() => {
        setIsUploadSectionCollapsed(true)
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [hasData, isUploadSectionCollapsed])

  const handleLeadClick = (lead: Lead) => {
    setSelectedLead(lead)
  }

  const handleLeadUpdate = async (id: string, updates: Partial<Lead>) => {
    await updateLead(id, updates)
    // Update selected lead if it's the one being edited
    if (selectedLead?.id === id) {
      setSelectedLead({ ...selectedLead, ...updates })
    }
  }

  const handleConvertLead = async (lead: Lead, amount?: number) => {
    const opportunity = await onCreateOpportunity(lead, amount)
    // Update lead status to qualified after conversion
    await updateLead(lead.id, { status: "qualified" })
    setSelectedLead(null)
    return opportunity
  }

  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "new", label: "New" },
    { value: "contacted", label: "Contacted" },
    { value: "qualified", label: "Qualified" },
    { value: "unqualified", label: "Unqualified" },
  ]

  const sortOptions = [
    { value: "score", label: "Score" },
    { value: "name", label: "Name" },
    { value: "company", label: "Company" },
    { value: "createdAt", label: "Date Created" },
  ]

  const hasActiveFilters = searchTerm || statusFilter !== "all" || sortBy !== "score" || sortOrder !== "desc" || pageSize !== 100

  if (loading) {
    return (
      <div className="space-y-6">
        <LeadsUpload 
          onFileUpload={loadLeadsFromFile}
          onClearLeads={clearLeads}
          loading={loading}
          error={error}
          hasData={hasData}
        />
        <LoadingSkeleton />
      </div>
    )
  }

  // Empty state - no leads loaded yet
  if (!hasData && !loading) {
    return (
      <div className="space-y-6">
        <LeadsUpload 
          onFileUpload={loadLeadsFromFile}
          onClearLeads={clearLeads}
          loading={loading}
          error={error}
          hasData={hasData}
        />
        
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center py-8">
              <Users className="h-12 w-12 text-muted-foreground" />
              <div>
                <h3 className="text-lg font-semibold">No leads loaded</h3>
                <p className="text-muted-foreground">Upload a JSON file to get started with managing your leads.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Upload Component - Collapsible when data is loaded */}
      {hasData ? (
        <Card>
          <CardHeader 
            className="cursor-pointer transition-colors hover:bg-muted/50" 
            onClick={() => setIsUploadSectionCollapsed(!isUploadSectionCollapsed)}
          >
            <CardTitle className="flex items-center justify-between">
              <span>Manage Leads</span>
              {isUploadSectionCollapsed ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronUp className="h-4 w-4" />
              )}
            </CardTitle>
          </CardHeader>
          {!isUploadSectionCollapsed && (
            <CardContent>
              <LeadsUpload 
                onFileUpload={loadLeadsFromFile}
                onClearLeads={clearLeads}
                loading={loading}
                error={error}
                hasData={hasData}
              />
            </CardContent>
          )}
        </Card>
      ) : (
        <LeadsUpload 
          onFileUpload={loadLeadsFromFile}
          onClearLeads={clearLeads}
          loading={loading}
          error={error}
          hasData={hasData}
        />
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalLeads}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Filtered Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Qualified Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{allLeads.filter((lead) => lead.status === "qualified").length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {/* Search */}
            <div className="md:col-span-2 lg:col-span-1 xl:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or company..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as any)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sort By */}
            <Select value={sortBy} onValueChange={(value) => setSortBy(value as any)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Items per page */}
            <Select value={pageSize?.toString() || "100"} onValueChange={(value) => setPageSize(Number(value))}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Items per page" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="100">100 per page</SelectItem>
                <SelectItem value="50">50 per page</SelectItem>
                <SelectItem value="20">20 per page</SelectItem>
                <SelectItem value="10">10 per page</SelectItem>
              </SelectContent>
            </Select>

            {/* Actions Column */}
            <div className="flex items-center gap-2">
              {/* Sort Order */}
              <Button
                variant="outline"
                onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                className="flex items-center gap-2 flex-1"
              >
                <SortDesc className={`h-4 w-4 transition-transform ${sortOrder === "asc" ? "rotate-180" : ""}`} />
                {sortOrder === "desc" ? "Desc" : "Asc"}
              </Button>

              {/* Clear Filters */}
              {hasActiveFilters && (
                <Button variant="ghost" onClick={clearFilters} className="flex items-center gap-2">
                  <X className="h-4 w-4" />
                  Clear
                </Button>
              )}
            </div>
          </div>

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 mt-4">
              {searchTerm && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Search: "{searchTerm}"
                  <X
                    className="h-3 w-3 cursor-pointer hover:bg-muted-foreground/20 rounded"
                    onClick={() => setSearchTerm("")}
                  />
                </Badge>
              )}
              {statusFilter !== "all" && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Status: {statusOptions.find((opt) => opt.value === statusFilter)?.label}
                  <X
                    className="h-3 w-3 cursor-pointer hover:bg-muted-foreground/20 rounded"
                    onClick={() => setStatusFilter("all")}
                  />
                </Badge>
              )}
              {(sortBy !== "score" || sortOrder !== "desc") && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Sort: {sortOptions.find((opt) => opt.value === sortBy)?.label} ({sortOrder})
                  <X
                    className="h-3 w-3 cursor-pointer hover:bg-muted-foreground/20 rounded"
                    onClick={() => {
                      setSortBy("score")
                      setSortOrder("desc")
                    }}
                  />
                </Badge>
              )}
              {pageSize !== 100 && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Page Size: {pageSize}
                  <X
                    className="h-3 w-3 cursor-pointer hover:bg-muted-foreground/20 rounded"
                    onClick={() => setPageSize(100)}
                  />
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Leads Table */}
      <LeadsTable leads={leads} loading={loading} error={error} hasData={hasData} onLeadClick={handleLeadClick} />

      {/* Pagination */}
      {hasData && (totalPages > 1 || pageSize < 100) && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          pageSize={pageSize}
          totalItems={filteredCount}
          currentPageStart={currentPageStart}
          currentPageEnd={currentPageEnd}
          hasNextPage={hasNextPage}
          hasPrevPage={hasPrevPage}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
          onFirstPage={goToFirstPage}
          onLastPage={goToLastPage}
          onNextPage={goToNextPage}
          onPrevPage={goToPrevPage}
        />
      )}

      {/* Lead Detail Panel */}
      {selectedLead && (
        <LeadDetailPanel
          lead={selectedLead}
          onClose={() => setSelectedLead(null)}
          onUpdate={handleLeadUpdate}
          onConvert={handleConvertLead}
        />
      )}
    </div>
  )
}
