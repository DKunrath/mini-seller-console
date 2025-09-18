"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LeadsPage } from "@/components/leads-page"
import { OpportunitiesPage } from "@/components/opportunities-page"
import { useOpportunities } from "@/hooks/use-opportunities"

export default function Home() {
  const [activeTab, setActiveTab] = useState("leads")
  const { opportunities, createOpportunity, updateOpportunity } = useOpportunities()

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-foreground">Mini Seller Console</h1>
          <p className="text-muted-foreground">Manage your leads and opportunities</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="leads">Leads</TabsTrigger>
            <TabsTrigger value="opportunities">Opportunities ({opportunities.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="leads" className="mt-6">
            <LeadsPage onCreateOpportunity={createOpportunity} />
          </TabsContent>

          <TabsContent value="opportunities" className="mt-6">
            <OpportunitiesPage opportunities={opportunities} onUpdateOpportunity={updateOpportunity} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
