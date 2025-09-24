"use client"

import useSWR from "swr"
import { useCallback, useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  Bar,
  Legend,
} from "recharts"
import { RefreshCw, Bookmark, CalendarClock, Download, CheckCircle2, AlertTriangle } from "lucide-react"

const fetcher = (url: string) => fetch(url).then((r) => r.text())

type Division = "All Divisions"
type Period = "Current Month (Sep 2024)"
type Comparison = "Month-over-Month"

export function PerformanceMetricsDashboard() {
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())
  const [division, setDivision] = useState<Division>("All Divisions")
  const [period, setPeriod] = useState<Period>("Current Month (Sep 2024)")
  const [comparison, setComparison] = useState<Comparison>("Month-over-Month")
  const [sourcesActive] = useState<number>(6)
  const [autoRefreshIn, setAutoRefreshIn] = useState<number>(300) // seconds

  const {
    data: brief,
    isLoading,
    mutate,
  } = useSWR("/data/performance-brief.txt", fetcher, {
    revalidateOnFocus: false,
  })

  const handleRefresh = useCallback(async () => {
    // Force SWR revalidation and update timestamp
    await mutate()
    setLastUpdated(new Date())
    setAutoRefreshIn(300)
  }, [mutate])

  // Auto refresh countdown
  useEffect(() => {
    const i = setInterval(() => {
      setAutoRefreshIn((s) => {
        if (s <= 1) {
          // auto refresh
          handleRefresh()
          return 300
        }
        return s - 1
      })
    }, 1000)
    return () => clearInterval(i)
  }, [handleRefresh])

  // KPI values based on pasted brief
  const kpis = useMemo(
    () => [
      {
        title: "Revenue Impact",
        value: "₹12.4",
        unit: "Crores",
        delta: "+8.7% vs last month",
        target: "Target: ₹15.0 Cr",
        status: "achieved" as const,
      },
      {
        title: "Operational Efficiency",
        value: "92.4",
        unit: "%",
        delta: "+5.2% vs last month",
        target: "Target: 95%",
        status: "on track" as const,
      },
      {
        title: "Delay Reduction",
        value: "28.7",
        unit: "%",
        delta: "+12.3% vs last month",
        target: "Target: 30%",
        status: "at risk" as const,
      },
      {
        title: "Cost Savings",
        value: "₹8.9",
        unit: "Crores",
        delta: "+2.1% vs last month",
        target: "Target: ₹10.0 Cr",
        status: "on track" as const,
      },
    ],
    [],
  )

  // Mock series for charts
  const performanceTrends = [
    { label: "Week 1", revenueCr: 10.9, efficiency: 90.8, delayRed: 24.3, savingsCr: 7.5 },
    { label: "Week 2", revenueCr: 11.5, efficiency: 91.2, delayRed: 26.8, savingsCr: 8.0 },
    { label: "Week 3", revenueCr: 12.1, efficiency: 92.0, delayRed: 27.6, savingsCr: 8.4 },
    { label: "Week 4", revenueCr: 12.4, efficiency: 92.4, delayRed: 28.7, savingsCr: 8.9 },
  ]

  const failureVsMaintenance = [
    { date: "Sep 01", failureProb: 0.28, maintenance: 0 },
    { date: "Sep 05", failureProb: 0.31, maintenance: 1 },
    { date: "Sep 10", failureProb: 0.27, maintenance: 0 },
    { date: "Sep 15", failureProb: 0.22, maintenance: 0 },
    { date: "Sep 20", failureProb: 0.19, maintenance: 1 },
    { date: "Sep 25", failureProb: 0.17, maintenance: 0 },
    { date: "Sep 30", failureProb: 0.16, maintenance: 0 },
  ]

  return (
    <div className="space-y-6">
      {/* Controls + Live Data */}
      <Card>
        <CardHeader className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle className="text-balance">Live Data</CardTitle>
            <CardDescription className="text-pretty">
              Last Updated: {lastUpdated.toLocaleDateString()}{" "}
              {lastUpdated.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </CardDescription>
          </div>

          <div className="flex flex-col gap-2 md:flex-row md:items-center">
            <div className="flex items-center gap-3">
              <div className="text-sm">
                <div className="text-muted-foreground">Division</div>
                <div className="font-medium">{division}</div>
              </div>
              <div className="text-sm">
                <div className="text-muted-foreground">Reporting Period</div>
                <div className="font-medium">{period}</div>
              </div>
              <div className="text-sm">
                <div className="text-muted-foreground">Comparison</div>
                <div className="font-medium">{comparison}</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="secondary" onClick={handleRefresh} aria-label="Refresh data">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button variant="ghost" aria-label="Bookmark report">
                <Bookmark className="h-4 w-4 mr-2" />
                Bookmark
              </Button>
              <Button variant="ghost" aria-label="Schedule report">
                <CalendarClock className="h-4 w-4 mr-2" />
                Schedule
              </Button>
              <Button variant="ghost" aria-label="Export report">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center justify-between gap-3">
          <div className="text-sm text-muted-foreground">Data Updated: 22/09/2024 18:00</div>
          <div className="text-sm">
            <span className="font-medium">{sourcesActive} Data Sources Active</span>
          </div>
          <div className="text-xs text-muted-foreground">
            Auto-refresh in {Math.floor(autoRefreshIn / 60)}m {autoRefreshIn % 60}s
          </div>
        </CardContent>
      </Card>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <Card key={kpi.title}>
            <CardHeader>
              <CardDescription className="uppercase tracking-wide">{kpi.status}</CardDescription>
              <CardTitle className="text-pretty">{kpi.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <div className="text-3xl font-semibold">{kpi.value}</div>
                <div className="text-muted-foreground">{kpi.unit}</div>
              </div>
              <div className="text-sm text-muted-foreground mt-1">{kpi.delta}</div>
              <div className="text-sm mt-2">{kpi.target}</div>
              <div className="mt-3 flex items-center gap-2">
                {kpi.status === "achieved" ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                ) : kpi.status === "at risk" ? (
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                ) : (
                  <CheckCircle2 className="h-4 w-4 text-blue-500" />
                )}
                <span className="text-xs text-muted-foreground">{kpi.status}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs with charts and brief section */}
      <Tabs defaultValue="trends" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="trends">Performance Trends</TabsTrigger>
          <TabsTrigger value="maintenance">Failure & Maintenance</TabsTrigger>
          <TabsTrigger value="brief">Brief (pasted)</TabsTrigger>
        </TabsList>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Key operational metrics over time</CardTitle>
              <CardDescription>Revenue, efficiency, delay reduction, and cost savings</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={360}>
                <LineChart data={performanceTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="label" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="revenueCr" name="Revenue (Cr)" stroke="#0ea5e9" strokeWidth={2} />
                  <Line type="monotone" dataKey="efficiency" name="Efficiency (%)" stroke="#22c55e" strokeWidth={2} />
                  <Line
                    type="monotone"
                    dataKey="delayRed"
                    name="Delay Reduction (%)"
                    stroke="#f59e0b"
                    strokeWidth={2}
                  />
                  <Line type="monotone" dataKey="savingsCr" name="Cost Savings (Cr)" stroke="#6366f1" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="maintenance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Failure Probability & Maintenance Schedule</CardTitle>
              <CardDescription>AI-driven predictions with maintenance overlay</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={360}>
                <AreaChart data={failureVsMaintenance}>
                  <defs>
                    <linearGradient id="failure" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.6} />
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0.05} />
                    </linearGradient>
                    <linearGradient id="maint" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.6} />
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[0, 1]} tickFormatter={(t) => `${Math.round(t * 100)}%`} />
                  <Tooltip
                    formatter={(v: number, k: string) =>
                      k === "maintenance"
                        ? [v ? "Scheduled" : "None", "Maintenance"]
                        : [`${Math.round(v * 100)}%`, "Failure Probability"]
                    }
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="failureProb"
                    name="Failure Probability"
                    stroke="#ef4444"
                    fill="url(#failure)"
                    strokeWidth={2}
                  />
                  <Bar dataKey="maintenance" name="Maintenance" fill="#22c55e" opacity={0.6} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="brief">
          <Card>
            <CardHeader>
              <CardTitle>Pasted Brief</CardTitle>
              <CardDescription>Direct content from pasted-text</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="h-48 rounded bg-muted animate-pulse" />
              ) : (
                <pre className="whitespace-pre-wrap text-sm leading-relaxed">{brief}</pre>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
