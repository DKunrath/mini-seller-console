export interface Lead {
  id: string
  name: string
  company: string
  email: string
  source: string
  score: number
  status: "new" | "contacted" | "qualified" | "unqualified"
  createdAt: string
}

export interface Opportunity {
  id: string
  name: string
  stage: "new" | "open" | "proposal" | "negotiation" | "closed-won" | "closed-lost"
  amount?: number
  accountName: string
  createdAt: string
  leadId?: string
}

export type LeadStatus = Lead["status"]
export type OpportunityStage = Opportunity["stage"]
