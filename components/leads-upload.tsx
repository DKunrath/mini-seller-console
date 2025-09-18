"use client"

import { useRef } from "react"
import { Upload, FileText, Download, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface LeadsUploadProps {
  onFileUpload: (file: File) => Promise<void>
  onClearLeads?: () => void
  loading: boolean
  error: string | null
  hasData: boolean
}

export function LeadsUpload({ onFileUpload, onClearLeads, loading, error, hasData }: LeadsUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      onFileUpload(file)
    }
    // Reset input to allow selecting the same file again
    event.target.value = ""
  }

  const downloadSampleFile = () => {
    const sampleData = [
      {
        "id": "lead-001",
        "name": "John Smith",
        "company": "TechCorp Inc",
        "email": "john.smith@techcorp.com",
        "source": "Website",
        "score": 85,
        "status": "new",
        "createdAt": "2024-01-15T10:30:00Z"
      },
      {
        "id": "lead-002",
        "name": "Sarah Johnson",
        "company": "Digital Solutions",
        "email": "sarah.j@digitalsol.com",
        "source": "LinkedIn",
        "score": 92,
        "status": "contacted",
        "createdAt": "2024-01-14T14:20:00Z"
      }
    ]

    const blob = new Blob([JSON.stringify(sampleData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'sample-leads.json'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          {hasData ? "Manage Leads" : "Upload Leads"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button
            onClick={handleFileSelect}
            disabled={loading}
            className="flex items-center gap-2"
            variant={hasData ? "outline" : "default"}
          >
            <FileText className="h-4 w-4" />
            {loading ? "Uploading..." : hasData ? "Upload New File" : "Select JSON File"}
          </Button>

          <Button
            onClick={downloadSampleFile}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Download Sample
          </Button>
        </div>

        {hasData && onClearLeads && (
          <Button
            onClick={onClearLeads}
            variant="destructive"
            className="w-full flex items-center gap-2"
            disabled={loading}
          >
            <Trash2 className="h-4 w-4" />
            Clear All Leads
          </Button>
        )}

        <div className="text-sm text-muted-foreground space-y-2">
          <p><strong>File Requirements:</strong></p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>JSON format with array of lead objects</li>
            <li>Maximum file size: 5MB</li>
            <li>Required fields: id, name, company, email, source, score, status, createdAt</li>
            <li>Status values: "new", "contacted", "qualified", "unqualified"</li>
            <li>Score range: 0-100</li>
          </ul>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleFileChange}
          className="hidden"
        />
      </CardContent>
    </Card>
  )
}