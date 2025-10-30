"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Comment {
  id: number
  text: string
  label: "Positive" | "Neutral" | "Toxic"
  confidence: number
  user: string
}

interface CommentsTableProps {
  comments?: Comment[] | null
}

export function CommentsTable({ comments }: CommentsTableProps) {
  const safeComments = comments ?? []

  const getLabelColor = (label: string) => {
    switch (label) {
      case "Positive":
        return "bg-green-500/20 text-green-400 border border-green-500/30"
      case "Toxic":
        return "bg-red-500/20 text-red-400 border border-red-500/30"
      case "Neutral":
        return "bg-gray-500/20 text-gray-400 border border-gray-500/30"
      default:
        return "bg-gray-500/20 text-gray-400"
    }
  }

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-base font-semibold">Recent Comments</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          {safeComments.length > 0 ? (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-4 px-4 font-semibold text-muted-foreground text-xs uppercase tracking-wide">
                    Comment
                  </th>
                  <th className="text-left py-4 px-4 font-semibold text-muted-foreground text-xs uppercase tracking-wide">
                    Label
                  </th>
                  <th className="text-left py-4 px-4 font-semibold text-muted-foreground text-xs uppercase tracking-wide">
                    Confidence
                  </th>
                  <th className="text-left py-4 px-4 font-semibold text-muted-foreground text-xs uppercase tracking-wide">
                    User
                  </th>
                </tr>
              </thead>
              <tbody>
                {safeComments.map((comment, idx) => (
                  <tr
                    key={comment.id}
                    className={`border-b border-border hover:bg-secondary/50 transition-colors ${
                      idx % 2 === 0 ? "bg-background/30" : ""
                    }`}
                  >
                    <td className="py-4 px-4">
                      <p className="line-clamp-2 text-foreground text-sm">{comment.text}</p>
                    </td>
                    <td className="py-4 px-4">
                      <Badge className={`${getLabelColor(comment.label)} font-medium`}>
                        {comment.label}
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-semibold text-foreground">
                        {(comment.confidence * 100).toFixed(0)}%
                      </span>
                    </td>
                    <td className="py-4 px-4 text-muted-foreground text-sm">{comment.user}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-10">
              No comments to display yet.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
