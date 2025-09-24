"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ClipboardList, Plus, Search } from "lucide-react"

interface WorkOrder {
  id: string
  orderNumber: string
  equipment: string
  description: string
  priority: "low" | "medium" | "high" | "critical"
  status: "open" | "assigned" | "in_progress" | "completed" | "cancelled"
  assignedTo: string
  createdDate: string
  dueDate: string
  estimatedHours: number
}

export function WorkOrderManagement() {
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  useEffect(() => {
    // Mock work orders data
    const mockWorkOrders: WorkOrder[] = [
      {
        id: "1",
        orderNumber: "WO-2024-001",
        equipment: "WAP7-30281",
        description: "Replace traction motor bearings",
        priority: "high",
        status: "in_progress",
        assignedTo: "Rajesh Kumar",
        createdDate: "2024-01-20",
        dueDate: "2024-01-25",
        estimatedHours: 8,
      },
      {
        id: "2",
        orderNumber: "WO-2024-002",
        equipment: "Signal-NDLS-001",
        description: "Replace LED signal modules",
        priority: "critical",
        status: "assigned",
        assignedTo: "Amit Singh",
        createdDate: "2024-01-22",
        dueDate: "2024-01-24",
        estimatedHours: 4,
      },
      {
        id: "3",
        orderNumber: "WO-2024-003",
        equipment: "Track-KM-100",
        description: "Emergency rail replacement",
        priority: "critical",
        status: "open",
        assignedTo: "",
        createdDate: "2024-01-25",
        dueDate: "2024-01-26",
        estimatedHours: 12,
      },
      {
        id: "4",
        orderNumber: "WO-2024-004",
        equipment: "Coach-ICF-2301",
        description: "Routine interior cleaning and inspection",
        priority: "low",
        status: "completed",
        assignedTo: "Priya Sharma",
        createdDate: "2024-01-18",
        dueDate: "2024-01-20",
        estimatedHours: 2,
      },
    ]

    setWorkOrders(mockWorkOrders)
  }, [])

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "destructive"
      case "high":
        return "destructive"
      case "medium":
        return "secondary"
      case "low":
        return "outline"
      default:
        return "outline"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "default"
      case "in_progress":
        return "secondary"
      case "assigned":
        return "outline"
      case "open":
        return "destructive"
      case "cancelled":
        return "outline"
      default:
        return "outline"
    }
  }

  const filteredWorkOrders = workOrders.filter((order) => {
    const matchesSearch =
      order.equipment.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || order.status === statusFilter

    return matchesSearch && matchesStatus
  })

  return (
    <Card className="h-80">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <ClipboardList className="w-5 h-5" />
          Work Orders
        </CardTitle>
        <Button variant="outline" size="sm">
          <Plus className="w-4 h-4 mr-1" />
          New Order
        </Button>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2 mb-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search work orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 text-xs"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2 py-1 text-xs border rounded"
          >
            <option value="all">All Status</option>
            <option value="open">Open</option>
            <option value="assigned">Assigned</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div className="space-y-2 max-h-44 overflow-y-auto">
          {filteredWorkOrders.map((order) => (
            <div
              key={order.id}
              className="flex items-start gap-3 p-2 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-xs">{order.orderNumber}</span>
                  <Badge variant={getPriorityColor(order.priority)} className="text-xs">
                    {order.priority.toUpperCase()}
                  </Badge>
                  <Badge variant={getStatusColor(order.status)} className="text-xs">
                    {order.status.replace("_", " ").toUpperCase()}
                  </Badge>
                </div>

                <div className="text-xs text-muted-foreground mb-1">
                  {order.equipment} • {order.description}
                </div>

                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>Due: {new Date(order.dueDate).toLocaleDateString()}</span>
                  <span>{order.estimatedHours}h</span>
                  {order.assignedTo && <span>Assigned: {order.assignedTo}</span>}
                </div>
              </div>

              <div className="flex flex-col gap-1">
                {order.status === "open" && (
                  <Button variant="outline" size="sm" className="text-xs bg-transparent">
                    Assign
                  </Button>
                )}
                {order.status === "assigned" && (
                  <Button variant="default" size="sm" className="text-xs">
                    Start
                  </Button>
                )}
                {order.status === "in_progress" && (
                  <Button variant="default" size="sm" className="text-xs">
                    Complete
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredWorkOrders.length === 0 && (
          <div className="text-center py-4 text-muted-foreground">
            <ClipboardList className="w-6 h-6 mx-auto mb-2 opacity-50" />
            <div className="text-xs">No work orders match your criteria</div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
