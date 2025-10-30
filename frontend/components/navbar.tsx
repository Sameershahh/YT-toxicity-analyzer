"use client"

import { useState } from "react"
import { Menu, User, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import axios from "axios"

interface NavbarProps {
  onMenuClick: () => void
}

export function Navbar({ onMenuClick }: NavbarProps) {
  const [videoUrl, setVideoUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleAnalyze = async () => {
    if (!videoUrl.trim() || (!videoUrl.includes("youtube.com") && !videoUrl.includes("youtu.be"))) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid YouTube video URL.",
        variant: "destructive",
      })
      return
    }

    window.dispatchEvent(new Event("ytAnalysisStarted"))
    setLoading(true)

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/predict/"
      const { data } = await axios.post(API_URL, { url: videoUrl })

      if (!data || typeof data !== "object") throw new Error("Invalid response from backend")

      localStorage.setItem("ytAnalysis", JSON.stringify(data))
      window.dispatchEvent(new Event("ytAnalysisUpdated"))

      toast({
        title: "Analysis Complete",
        description: "YouTube comments analyzed successfully.",
      })
    } catch (err: any) {
      console.error("❌ Error analyzing video:", err)
      toast({
        title: "Analysis Failed",
        description: err.response?.data?.detail || "Backend connection failed.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleAnalyze()
  }

  return (
    <nav className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur-sm">
      <div className="flex items-center justify-between px-6 py-4 gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onMenuClick} className="lg:hidden text-foreground hover:bg-secondary">
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
              <span className="text-white font-bold text-sm">YT</span>
            </div>
            <h1 className="text-sm font-semibold hidden sm:block text-foreground">
              YT Toxicity Analyzer
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-1 max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Paste YouTube URL..."
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              onKeyDown={handleKeyPress}
              disabled={loading}
              className="pl-9 bg-secondary border-border text-foreground placeholder:text-muted-foreground"
            />
          </div>
          <Button
            onClick={handleAnalyze}
            disabled={loading}
            className="bg-primary hover:bg-primary/90 text-white font-semibold whitespace-nowrap"
          >
            {loading ? "Analyzing..." : "Analyze"}
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="text-foreground hover:bg-secondary">
            <User className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </nav>
  )
}
