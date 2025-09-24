"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Network } from "lucide-react"

interface NetworkNode {
  id: string
  name: string
  type: "station" | "junction" | "terminal"
  status: "operational" | "maintenance" | "disrupted"
  connections: string[]
  x: number
  y: number
}

export function NetworkTopology() {
  const [nodes, setNodes] = useState<NetworkNode[]>([])
  const [selectedNode, setSelectedNode] = useState<string | null>(null)

  useEffect(() => {
    // Mock network topology data localized to Iran network and reflect current incident statuses
    setNodes([
      {
        id: "TEH",
        name: "Tehran Central",
        type: "terminal",
        status: "operational",
        connections: ["QOM", "SEM"],
        x: 50,
        y: 30,
      },
      {
        id: "QOM",
        name: "Qom",
        type: "station",
        status: "operational",
        connections: ["TEH", "KAS"],
        x: 45,
        y: 45,
      },
      {
        id: "KAS",
        name: "Kashan",
        type: "station",
        status: "operational",
        connections: ["QOM", "ISF"],
        x: 48,
        y: 58,
      },
      {
        id: "ISF",
        name: "Isfahan Central",
        type: "terminal",
        status: "operational",
        connections: ["KAS"],
        x: 50,
        y: 70,
      },
      {
        id: "SEM",
        name: "Semnan",
        type: "station",
        status: "maintenance", // Tehran–Mashhad maintenance
        connections: ["TEH", "SHA"],
        x: 65,
        y: 35,
      },
      {
        id: "SHA",
        name: "Shahroud",
        type: "junction",
        status: "maintenance", // Tehran–Mashhad maintenance
        connections: ["SEM", "MSH"],
        x: 75,
        y: 38,
      },
      {
        id: "MSH",
        name: "Mashhad",
        type: "terminal",
        status: "operational",
        connections: ["SHA"],
        x: 85,
        y: 40,
      },
      {
        id: "ZAN",
        name: "Zanjan",
        type: "station",
        status: "disrupted", // Northwestern corridor monitoring/disruptions
        connections: ["TEH", "TBZ"],
        x: 55,
        y: 20,
      },
      {
        id: "TBZ",
        name: "Tabriz",
        type: "terminal",
        status: "disrupted",
        connections: ["ZAN"],
        x: 40,
        y: 18,
      },
    ])
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "operational":
        return "bg-green-500"
      case "maintenance":
        return "bg-yellow-500"
      case "disrupted":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getNodeSize = (type: string) => {
    switch (type) {
      case "terminal":
        return "w-4 h-4"
      case "junction":
        return "w-3 h-3"
      case "station":
        return "w-2 h-2"
      default:
        return "w-2 h-2"
    }
  }

  return (
    <Card className="h-80">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {/* Clarify region in title */}
          <Network className="w-5 h-5" />
          Network Topology - Iran Railway
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative h-48 bg-muted/20 rounded-lg overflow-hidden">
          {/* Connection lines */}
          <svg className="absolute inset-0 w-full h-full">
            {nodes.map((node) =>
              node.connections.map((connectionId) => {
                const connectedNode = nodes.find((n) => n.id === connectionId)
                if (!connectedNode) return null

                return (
                  <line
                    key={`${node.id}-${connectionId}`}
                    x1={`${node.x}%`}
                    y1={`${node.y}%`}
                    x2={`${connectedNode.x}%`}
                    y2={`${connectedNode.y}%`}
                    stroke="currentColor"
                    strokeWidth="1"
                    className="text-muted-foreground/30"
                  />
                )
              }),
            )}
          </svg>

          {/* Network nodes */}
          {nodes.map((node) => (
            <div
              key={node.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
              style={{ left: `${node.x}%`, top: `${node.y}%` }}
              onClick={() => setSelectedNode(selectedNode === node.id ? null : node.id)}
            >
              <div
                className={`${getNodeSize(node.type)} ${getStatusColor(node.status)} rounded-full border-2 border-background shadow-sm hover:scale-110 transition-transform`}
              />
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1">
                <div className="text-xs font-medium text-foreground whitespace-nowrap">{node.id}</div>
                {selectedNode === node.id && (
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 bg-popover border rounded-lg p-2 shadow-lg z-10 min-w-32">
                    <div className="text-xs font-medium">{node.name}</div>
                    <div className="text-xs text-muted-foreground capitalize">{node.type}</div>
                    <Badge variant="outline" className="text-xs mt-1">
                      {node.status}
                    </Badge>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between mt-4 text-xs">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <span>Operational</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-yellow-500 rounded-full" />
              <span>Maintenance</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-red-500 rounded-full" />
              <span>Disrupted</span>
            </div>
          </div>
          <div className="text-muted-foreground">{nodes.length} stations monitored</div>
        </div>
      </CardContent>
    </Card>
  )
}
