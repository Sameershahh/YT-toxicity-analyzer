import { Loader2 } from "lucide-react"

export function AnalyzingLoader() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="text-center space-y-6">
        <div className="flex justify-center">
          <div className="relative w-16 h-16">
            <Loader2 className="h-16 w-16 animate-spin text-primary" />
          </div>
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-foreground">Analyzing comments...</h2>
          <p className="text-muted-foreground">This may take a few moments</p>
        </div>
      </div>
    </div>
  )
}
