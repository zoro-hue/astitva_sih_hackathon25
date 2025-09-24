"use client"

import { useState, useEffect } from "react"
import { Bell, Settings, Search, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

export function DashboardHeader() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [activeIncidents, setActiveIncidents] = useState(3)

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <header className="border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">RC</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Railway Control Center</h1>
                <p className="text-sm text-muted-foreground">Operations Dashboard</p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2">
              <Search className="w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search trains, stations..." className="w-64" />
            </div>

            <div className="text-right">
              <div className="text-sm font-medium text-foreground">
                {currentTime.toLocaleTimeString("en-IN", {
                  timeZone: "Asia/Kolkata",
                  hour12: false,
                })}
              </div>
              <div className="text-xs text-muted-foreground">{currentTime.toLocaleDateString("en-IN")}</div>
            </div>

            <Button variant="outline" size="sm" className="relative bg-transparent">
              <Bell className="w-4 h-4" />
              {activeIncidents > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-2 -right-2 w-5 h-5 p-0 flex items-center justify-center text-xs"
                >
                  {activeIncidents}
                </Badge>
              )}
            </Button>

            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4" />
            </Button>

            <Button variant="outline" size="sm" className="md:hidden bg-transparent">
              <Menu className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
