"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageSquare, AlertTriangle, ThumbsUp, Minus } from "lucide-react"

interface SummaryProps {
  data: any
}

export function SummaryCards({ data }: SummaryProps) {
  // Accept either the whole payload or the nested summary object
  const s = data?.summary ? data.summary : data ?? {}

  const totalComments = s?.totalComments ?? 0
  const toxicityRatio = s?.toxicityRatio ?? 0
  const positiveComments = s?.positiveComments ?? 0
  const neutralComments = s?.neutralComments ?? 0

  const cards = [
    {
      title: "Total Comments",
      value: totalComments.toLocaleString(),
      icon: MessageSquare,
      accentColor: "#2196f3",
    },
    {
      title: "Toxicity Ratio",
      value: `${Number(toxicityRatio).toFixed(1)}%`,
      icon: AlertTriangle,
      accentColor: "#ff0000",
    },
    {
      title: "Positive Comments",
      value: `${Number(positiveComments).toFixed(1)}%`,
      icon: ThumbsUp,
      accentColor: "#4caf50",
    },
    {
      title: "Neutral Comments",
      value: `${Number(neutralComments).toFixed(1)}%`,
      icon: Minus,
      accentColor: "#9e9e9e",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <Card key={card.title} className="border-border bg-card hover:bg-card/80 transition-colors">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                {card.title}
              </CardTitle>
              <div className="p-2 rounded-md" style={{ backgroundColor: `${card.accentColor}20` }}>
                <card.icon className="h-4 w-4" style={{ color: card.accentColor }} />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{card.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
