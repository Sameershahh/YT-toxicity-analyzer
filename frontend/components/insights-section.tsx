"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface InsightsSectionProps {
  data: any
}

export function InsightsSection({ data }: InsightsSectionProps) {
  const insights = data?.insights ? data.insights : data ?? {}
  const topToxicWords = insights?.topToxicWords ?? []
  const sentimentSummary = insights?.sentimentSummary ?? insights?.suggestion ?? "No insights yet."

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Top Toxic Words */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-base font-semibold">Top Toxic Words</CardTitle>
        </CardHeader>
        <CardContent>
          {topToxicWords.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {topToxicWords.map((word: string, index: number) => (
                <span
                  key={index}
                  className="px-3 py-1.5 bg-red-500/20 text-red-400 border border-red-500/30 rounded-full text-sm font-medium"
                >
                  {word}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-10">No toxic words found yet.</p>
          )}
        </CardContent>
      </Card>

      {/* Sentiment Summary */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-base font-semibold">Sentiment Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-foreground leading-relaxed text-sm">{sentimentSummary}</p>
        </CardContent>
      </Card>
    </div>
  )
}
