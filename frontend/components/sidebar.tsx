"use client"

import { LayoutDashboard, FileText, Settings, HelpCircle, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface SidebarProps {
  isOpen: boolean
  onToggle: () => void
}

export function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "#" },
    { icon: FileText, label: "Reports", href: "#" },
    { icon: Settings, label: "Settings", href: "#" },
    { icon: HelpCircle, label: "Help", href: "#" },
  ]

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={onToggle} />}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 h-screen w-64 border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-transform duration-300 z-40 lg:relative lg:translate-x-0 flex flex-col",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-sidebar-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
              <span className="text-white font-bold text-sm">YT</span>
            </div>
            <h2 className="text-sm font-semibold">YT Toxicity</h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onToggle} className="lg:hidden text-foreground">
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {menuItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-2.5 rounded-md text-sm font-medium transition-colors",
                "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                item.label === "Dashboard" &&
                  "bg-sidebar-accent text-sidebar-accent-foreground border-l-2 border-sidebar-primary",
              )}
            >
              <item.icon className="h-4 w-4" />
              <span>{item.label}</span>
            </a>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-sidebar-border text-xs text-muted-foreground">
          <p>v1.0.0</p>
        </div>
      </aside>
    </>
  )
}
