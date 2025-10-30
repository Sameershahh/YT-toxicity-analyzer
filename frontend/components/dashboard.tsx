"use client"

import { useState, useEffect } from "react"
import { SummaryCards } from "./summary-cards"
import { ChartsSection } from "./charts-section"
import { CommentsTable } from "./comments-table"
import { InsightsSection } from "./insights-section"
import { AnalyzingLoader } from "./analyzing-loader"

export function Dashboard() {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [hasAnalyzed, setHasAnalyzed] = useState(false)
  const [data, setData] = useState<any | null>(null)

  // Listen for updates from Navbar
  useEffect(() => {
    const saved = localStorage.getItem("ytAnalysis")
    if (saved) {
      setData(JSON.parse(saved))
      setHasAnalyzed(true)
    }

    const handleUpdate = () => {
      const newData = localStorage.getItem("ytAnalysis")
      if (newData) {
        setData(JSON.parse(newData))
        setHasAnalyzed(true)
        setIsAnalyzing(false)
      }
    }

    const handleStart = () => {
      setIsAnalyzing(true)
      setHasAnalyzed(false)
    }

    window.addEventListener("ytAnalysisUpdated", handleUpdate)
    window.addEventListener("ytAnalysisStarted", handleStart)

    return () => {
      window.removeEventListener("ytAnalysisUpdated", handleUpdate)
      window.removeEventListener("ytAnalysisStarted", handleStart)
    }
  }, [])

  // Show loader while analyzing
  if (isAnalyzing) return <AnalyzingLoader />

  //  Show "Ready" message before analysis
  if (!hasAnalyzed || !data) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <div className="text-6xl"></div>
          <h2 className="text-2xl font-bold text-foreground">Ready to Analyze</h2>
          <p className="text-muted-foreground max-w-md">
            Enter a YouTube video URL in the navbar and click "Analyze" to get started with toxicity analysis.
          </p>
        </div>
      </div>
    )
  }

  //  Show actual data from backend
  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
      <SummaryCards data={data.summary || {}} />
      <ChartsSection data={data.charts || {}} />
      <CommentsTable comments={data.comments || []} />
      <InsightsSection data={data.insights || {}} />
    </div>
  )
}
