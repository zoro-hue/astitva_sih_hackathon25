// Advanced pathfinding algorithms for railway route optimization
export interface GraphNode {
  id: string
  name: string
  coordinates: { x: number; y: number }
  type: "station" | "junction" | "depot"
  capacity: number
  operationalStatus: "active" | "maintenance" | "closed"
}

export interface GraphEdge {
  from: string
  to: string
  distance: number
  baseTime: number
  currentCongestion: number
  maxSpeed: number
  trackCondition: number // 0-1 scale
  maintenanceWindow?: { start: string; end: string }
  cost: number
}

export interface PathResult {
  path: string[]
  totalDistance: number
  totalTime: number
  totalCost: number
  efficiency: number
  congestionFactor: number
  alternativePaths?: PathResult[]
}

export type HeuristicFunction = (current: GraphNode, goal: GraphNode) => number

export class DijkstraPathfinder {
  private nodes: Map<string, GraphNode>
  private edges: Map<string, GraphEdge[]>

  constructor(nodes: GraphNode[], edges: GraphEdge[]) {
    this.nodes = new Map(nodes.map((node) => [node.id, node]))
    this.edges = new Map()

    // Build adjacency list
    edges.forEach((edge) => {
      if (!this.edges.has(edge.from)) {
        this.edges.set(edge.from, [])
      }
      if (!this.edges.has(edge.to)) {
        this.edges.set(edge.to, [])
      }
      this.edges.get(edge.from)!.push(edge)
      // Add reverse edge for bidirectional travel
      this.edges.get(edge.to)!.push({
        ...edge,
        from: edge.to,
        to: edge.from,
      })
    })
  }

  findOptimalPath(
    startId: string,
    endId: string,
    optimizationCriteria: "time" | "distance" | "cost" | "efficiency" = "time",
  ): PathResult | null {
    const distances = new Map<string, number>()
    const previous = new Map<string, string | null>()
    const visited = new Set<string>()
    const unvisited = new Set(this.nodes.keys())

    // Initialize distances
    for (const nodeId of this.nodes.keys()) {
      distances.set(nodeId, nodeId === startId ? 0 : Number.POSITIVE_INFINITY)
      previous.set(nodeId, null)
    }

    while (unvisited.size > 0) {
      // Find unvisited node with minimum distance
      const current = Array.from(unvisited).reduce((min, nodeId) =>
        distances.get(nodeId)! < distances.get(min)! ? nodeId : min,
      )

      if (distances.get(current) === Number.POSITIVE_INFINITY) break
      if (current === endId) break

      unvisited.delete(current)
      visited.add(current)

      // Update distances to neighbors
      const neighbors = this.edges.get(current) || []
      for (const edge of neighbors) {
        if (visited.has(edge.to)) continue

        const weight = this.calculateDynamicWeight(edge, optimizationCriteria)
        const newDistance = distances.get(current)! + weight

        if (newDistance < distances.get(edge.to)!) {
          distances.set(edge.to, newDistance)
          previous.set(edge.to, current)
        }
      }
    }

    return this.reconstructPath(startId, endId, previous, distances, optimizationCriteria)
  }

  private calculateDynamicWeight(edge: GraphEdge, criteria: string): number {
    const congestionMultiplier = 1 + edge.currentCongestion * 0.5
    const conditionMultiplier = 2 - edge.trackCondition // Poor condition increases weight

    switch (criteria) {
      case "time":
        return edge.baseTime * congestionMultiplier * conditionMultiplier
      case "distance":
        return edge.distance
      case "cost":
        return edge.cost * congestionMultiplier
      case "efficiency":
        return (edge.baseTime + edge.cost * 0.1) * congestionMultiplier * conditionMultiplier
      default:
        return edge.baseTime * congestionMultiplier
    }
  }

  private reconstructPath(
    startId: string,
    endId: string,
    previous: Map<string, string | null>,
    distances: Map<string, number>,
    criteria: string,
  ): PathResult | null {
    if (distances.get(endId) === Number.POSITIVE_INFINITY) return null

    const path: string[] = []
    let current = endId
    let totalDistance = 0
    let totalTime = 0
    let totalCost = 0

    while (current !== null) {
      path.unshift(current)
      const prev = previous.get(current)
      if (prev) {
        const edge = this.edges.get(prev)?.find((e) => e.to === current)
        if (edge) {
          totalDistance += edge.distance
          totalTime += edge.baseTime * (1 + edge.currentCongestion * 0.5)
          totalCost += edge.cost
        }
      }
      current = prev
    }

    const avgCongestion = path.length > 1 ? this.calculateAverageCongestion(path) : 0

    return {
      path,
      totalDistance,
      totalTime,
      totalCost,
      efficiency: this.calculateEfficiency(totalTime, totalDistance, totalCost),
      congestionFactor: avgCongestion,
    }
  }

  private calculateAverageCongestion(path: string[]): number {
    let totalCongestion = 0
    let edgeCount = 0

    for (let i = 0; i < path.length - 1; i++) {
      const edge = this.edges.get(path[i])?.find((e) => e.to === path[i + 1])
      if (edge) {
        totalCongestion += edge.currentCongestion
        edgeCount++
      }
    }

    return edgeCount > 0 ? totalCongestion / edgeCount : 0
  }

  private calculateEfficiency(time: number, distance: number, cost: number): number {
    // Efficiency score based on time/distance ratio and cost factor
    const timeEfficiency = distance / time // km/min
    const costEfficiency = distance / cost // km/unit cost
    return Math.round((timeEfficiency * 0.7 + costEfficiency * 0.3) * 100)
  }
}

export class AStarPathfinder {
  private nodes: Map<string, GraphNode>
  private edges: Map<string, GraphEdge[]>
  private heuristic: HeuristicFunction

  constructor(nodes: GraphNode[], edges: GraphEdge[], heuristic?: HeuristicFunction) {
    this.nodes = new Map(nodes.map((node) => [node.id, node]))
    this.edges = new Map()

    // Build adjacency list
    edges.forEach((edge) => {
      if (!this.edges.has(edge.from)) {
        this.edges.set(edge.from, [])
      }
      if (!this.edges.has(edge.to)) {
        this.edges.set(edge.to, [])
      }
      this.edges.get(edge.from)!.push(edge)
      this.edges.get(edge.to)!.push({
        ...edge,
        from: edge.to,
        to: edge.from,
      })
    })

    // Default heuristic: Euclidean distance
    this.heuristic = heuristic || this.euclideanDistance
  }

  findOptimalPath(
    startId: string,
    endId: string,
    optimizationCriteria: "time" | "distance" | "cost" | "efficiency" = "time",
  ): PathResult | null {
    const openSet = new Set([startId])
    const closedSet = new Set<string>()

    const gScore = new Map<string, number>()
    const fScore = new Map<string, number>()
    const previous = new Map<string, string | null>()

    // Initialize scores
    for (const nodeId of this.nodes.keys()) {
      gScore.set(nodeId, nodeId === startId ? 0 : Number.POSITIVE_INFINITY)
      fScore.set(
        nodeId,
        nodeId === startId
          ? this.heuristic(this.nodes.get(startId)!, this.nodes.get(endId)!)
          : Number.POSITIVE_INFINITY,
      )
      previous.set(nodeId, null)
    }

    while (openSet.size > 0) {
      // Find node in openSet with lowest fScore
      const current = Array.from(openSet).reduce((min, nodeId) =>
        fScore.get(nodeId)! < fScore.get(min)! ? nodeId : min,
      )

      if (current === endId) {
        return this.reconstructAStarPath(startId, endId, previous, gScore, optimizationCriteria)
      }

      openSet.delete(current)
      closedSet.add(current)

      // Examine neighbors
      const neighbors = this.edges.get(current) || []
      for (const edge of neighbors) {
        if (closedSet.has(edge.to)) continue

        const tentativeGScore = gScore.get(current)! + this.calculateDynamicWeight(edge, optimizationCriteria)

        if (!openSet.has(edge.to)) {
          openSet.add(edge.to)
        } else if (tentativeGScore >= gScore.get(edge.to)!) {
          continue
        }

        previous.set(edge.to, current)
        gScore.set(edge.to, tentativeGScore)
        fScore.set(edge.to, tentativeGScore + this.heuristic(this.nodes.get(edge.to)!, this.nodes.get(endId)!))
      }
    }

    return null // No path found
  }

  private euclideanDistance(current: GraphNode, goal: GraphNode): number {
    const dx = current.coordinates.x - goal.coordinates.x
    const dy = current.coordinates.y - goal.coordinates.y
    return Math.sqrt(dx * dx + dy * dy)
  }

  private manhattanDistance(current: GraphNode, goal: GraphNode): number {
    const dx = Math.abs(current.coordinates.x - goal.coordinates.x)
    const dy = Math.abs(current.coordinates.y - goal.coordinates.y)
    return dx + dy
  }

  private calculateDynamicWeight(edge: GraphEdge, criteria: string): number {
    const congestionMultiplier = 1 + edge.currentCongestion * 0.5
    const conditionMultiplier = 2 - edge.trackCondition

    switch (criteria) {
      case "time":
        return edge.baseTime * congestionMultiplier * conditionMultiplier
      case "distance":
        return edge.distance
      case "cost":
        return edge.cost * congestionMultiplier
      case "efficiency":
        return (edge.baseTime + edge.cost * 0.1) * congestionMultiplier * conditionMultiplier
      default:
        return edge.baseTime * congestionMultiplier
    }
  }

  private reconstructAStarPath(
    startId: string,
    endId: string,
    previous: Map<string, string | null>,
    gScore: Map<string, number>,
    criteria: string,
  ): PathResult | null {
    const path: string[] = []
    let current = endId
    let totalDistance = 0
    let totalTime = 0
    let totalCost = 0

    while (current !== null) {
      path.unshift(current)
      const prev = previous.get(current)
      if (prev) {
        const edge = this.edges.get(prev)?.find((e) => e.to === current)
        if (edge) {
          totalDistance += edge.distance
          totalTime += edge.baseTime * (1 + edge.currentCongestion * 0.5)
          totalCost += edge.cost
        }
      }
      current = prev
    }

    const avgCongestion = path.length > 1 ? this.calculateAverageCongestion(path) : 0

    return {
      path,
      totalDistance,
      totalTime,
      totalCost,
      efficiency: this.calculateEfficiency(totalTime, totalDistance, totalCost),
      congestionFactor: avgCongestion,
    }
  }

  private calculateAverageCongestion(path: string[]): number {
    let totalCongestion = 0
    let edgeCount = 0

    for (let i = 0; i < path.length - 1; i++) {
      const edge = this.edges.get(path[i])?.find((e) => e.to === path[i + 1])
      if (edge) {
        totalCongestion += edge.currentCongestion
        edgeCount++
      }
    }

    return edgeCount > 0 ? totalCongestion / edgeCount : 0
  }

  private calculateEfficiency(time: number, distance: number, cost: number): number {
    const timeEfficiency = distance / time
    const costEfficiency = distance / cost
    return Math.round((timeEfficiency * 0.7 + costEfficiency * 0.3) * 100)
  }
}

export class MultiObjectivePathfinder {
  private dijkstra: DijkstraPathfinder
  private aStar: AStarPathfinder

  constructor(nodes: GraphNode[], edges: GraphEdge[]) {
    this.dijkstra = new DijkstraPathfinder(nodes, edges)
    this.aStar = new AStarPathfinder(nodes, edges)
  }

  findOptimalPaths(
    startId: string,
    endId: string,
    weights: { time: number; distance: number; cost: number; efficiency: number } = {
      time: 0.4,
      distance: 0.2,
      cost: 0.2,
      efficiency: 0.2,
    },
  ): PathResult[] {
    const criteria: Array<"time" | "distance" | "cost" | "efficiency"> = ["time", "distance", "cost", "efficiency"]

    const results: PathResult[] = []

    // Get paths optimized for each criterion
    for (const criterion of criteria) {
      const dijkstraResult = this.dijkstra.findOptimalPath(startId, endId, criterion)
      const aStarResult = this.aStar.findOptimalPath(startId, endId, criterion)

      if (dijkstraResult) {
        results.push({
          ...dijkstraResult,
          efficiency: this.calculateWeightedScore(dijkstraResult, weights),
        })
      }

      if (aStarResult && !this.isDuplicatePath(aStarResult, results)) {
        results.push({
          ...aStarResult,
          efficiency: this.calculateWeightedScore(aStarResult, weights),
        })
      }
    }

    // Sort by weighted efficiency score
    return results.sort((a, b) => b.efficiency - a.efficiency).slice(0, 3)
  }

  private calculateWeightedScore(
    result: PathResult,
    weights: { time: number; distance: number; cost: number; efficiency: number },
  ): number {
    // Normalize values (assuming reasonable ranges)
    const normalizedTime = Math.max(0, 100 - result.totalTime / 10) // Assume max 1000 minutes
    const normalizedDistance = Math.max(0, 100 - result.totalDistance / 50) // Assume max 5000 km
    const normalizedCost = Math.max(0, 100 - result.totalCost / 100) // Assume max 10000 cost units
    const normalizedEfficiency = result.efficiency

    return (
      normalizedTime * weights.time +
      normalizedDistance * weights.distance +
      normalizedCost * weights.cost +
      normalizedEfficiency * weights.efficiency
    )
  }

  private isDuplicatePath(newPath: PathResult, existingPaths: PathResult[]): boolean {
    return existingPaths.some(
      (existing) =>
        existing.path.length === newPath.path.length &&
        existing.path.every((node, index) => node === newPath.path[index]),
    )
  }
}

export class BidirectionalPathfinder {
  private nodes: Map<string, GraphNode>
  private edges: Map<string, GraphEdge[]>

  constructor(nodes: GraphNode[], edges: GraphEdge[]) {
    this.nodes = new Map(nodes.map((node) => [node.id, node]))
    this.edges = new Map()

    edges.forEach((edge) => {
      if (!this.edges.has(edge.from)) {
        this.edges.set(edge.from, [])
      }
      if (!this.edges.has(edge.to)) {
        this.edges.set(edge.to, [])
      }
      this.edges.get(edge.from)!.push(edge)
      this.edges.get(edge.to)!.push({
        ...edge,
        from: edge.to,
        to: edge.from,
      })
    })
  }

  findOptimalPath(
    startId: string,
    endId: string,
    optimizationCriteria: "time" | "distance" | "cost" | "efficiency" = "time",
  ): PathResult | null {
    // Initialize forward and backward searches
    const forwardDistances = new Map<string, number>()
    const backwardDistances = new Map<string, number>()
    const forwardPrevious = new Map<string, string | null>()
    const backwardPrevious = new Map<string, string | null>()
    const forwardVisited = new Set<string>()
    const backwardVisited = new Set<string>()

    // Initialize distances
    for (const nodeId of this.nodes.keys()) {
      forwardDistances.set(nodeId, nodeId === startId ? 0 : Number.POSITIVE_INFINITY)
      backwardDistances.set(nodeId, nodeId === endId ? 0 : Number.POSITIVE_INFINITY)
      forwardPrevious.set(nodeId, null)
      backwardPrevious.set(nodeId, null)
    }

    const forwardQueue = [startId]
    const backwardQueue = [endId]
    let meetingPoint: string | null = null
    let bestDistance = Number.POSITIVE_INFINITY

    while (forwardQueue.length > 0 || backwardQueue.length > 0) {
      // Forward search step
      if (forwardQueue.length > 0) {
        const current = this.getMinDistanceNode(forwardQueue, forwardDistances)
        if (current && forwardDistances.get(current)! < bestDistance) {
          forwardVisited.add(current)

          if (backwardVisited.has(current)) {
            const totalDistance = forwardDistances.get(current)! + backwardDistances.get(current)!
            if (totalDistance < bestDistance) {
              bestDistance = totalDistance
              meetingPoint = current
            }
          }

          this.expandNode(current, forwardDistances, forwardPrevious, forwardQueue, optimizationCriteria)
        }
      }

      // Backward search step
      if (backwardQueue.length > 0) {
        const current = this.getMinDistanceNode(backwardQueue, backwardDistances)
        if (current && backwardDistances.get(current)! < bestDistance) {
          backwardVisited.add(current)

          if (forwardVisited.has(current)) {
            const totalDistance = forwardDistances.get(current)! + backwardDistances.get(current)!
            if (totalDistance < bestDistance) {
              bestDistance = totalDistance
              meetingPoint = current
            }
          }

          this.expandNode(current, backwardDistances, backwardPrevious, backwardQueue, optimizationCriteria, true)
        }
      }

      if (meetingPoint && (forwardQueue.length === 0 || backwardQueue.length === 0)) {
        break
      }
    }

    if (!meetingPoint) return null

    return this.reconstructBidirectionalPath(
      startId,
      endId,
      meetingPoint,
      forwardPrevious,
      backwardPrevious,
      optimizationCriteria,
    )
  }

  private getMinDistanceNode(queue: string[], distances: Map<string, number>): string | null {
    if (queue.length === 0) return null

    let minIndex = 0
    for (let i = 1; i < queue.length; i++) {
      if (distances.get(queue[i])! < distances.get(queue[minIndex])!) {
        minIndex = i
      }
    }

    return queue.splice(minIndex, 1)[0]
  }

  private expandNode(
    current: string,
    distances: Map<string, number>,
    previous: Map<string, string | null>,
    queue: string[],
    criteria: string,
    reverse = false,
  ): void {
    const neighbors = this.edges.get(current) || []

    for (const edge of neighbors) {
      const neighbor = reverse ? edge.from : edge.to
      const weight = this.calculateDynamicWeight(edge, criteria)
      const newDistance = distances.get(current)! + weight

      if (newDistance < distances.get(neighbor)!) {
        distances.set(neighbor, newDistance)
        previous.set(neighbor, current)

        if (!queue.includes(neighbor)) {
          queue.push(neighbor)
        }
      }
    }
  }

  private calculateDynamicWeight(edge: GraphEdge, criteria: string): number {
    const congestionMultiplier = 1 + edge.currentCongestion * 0.5
    const conditionMultiplier = 2 - edge.trackCondition

    switch (criteria) {
      case "time":
        return edge.baseTime * congestionMultiplier * conditionMultiplier
      case "distance":
        return edge.distance
      case "cost":
        return edge.cost * congestionMultiplier
      case "efficiency":
        return (edge.baseTime + edge.cost * 0.1) * congestionMultiplier * conditionMultiplier
      default:
        return edge.baseTime * congestionMultiplier
    }
  }

  private reconstructBidirectionalPath(
    startId: string,
    endId: string,
    meetingPoint: string,
    forwardPrevious: Map<string, string | null>,
    backwardPrevious: Map<string, string | null>,
    criteria: string,
  ): PathResult {
    // Build forward path
    const forwardPath: string[] = []
    let current = meetingPoint
    while (current !== null) {
      forwardPath.unshift(current)
      current = forwardPrevious.get(current) || null
    }

    // Build backward path
    const backwardPath: string[] = []
    current = backwardPrevious.get(meetingPoint) || null
    while (current !== null) {
      backwardPath.push(current)
      current = backwardPrevious.get(current) || null
    }

    // Combine paths
    const fullPath = [...forwardPath, ...backwardPath]

    // Calculate metrics
    let totalDistance = 0
    let totalTime = 0
    let totalCost = 0

    for (let i = 0; i < fullPath.length - 1; i++) {
      const edge = this.edges.get(fullPath[i])?.find((e) => e.to === fullPath[i + 1])
      if (edge) {
        totalDistance += edge.distance
        totalTime += edge.baseTime * (1 + edge.currentCongestion * 0.5)
        totalCost += edge.cost
      }
    }

    const avgCongestion = this.calculateAverageCongestion(fullPath)

    return {
      path: fullPath,
      totalDistance,
      totalTime,
      totalCost,
      efficiency: this.calculateEfficiency(totalTime, totalDistance, totalCost),
      congestionFactor: avgCongestion,
    }
  }

  private calculateAverageCongestion(path: string[]): number {
    let totalCongestion = 0
    let edgeCount = 0

    for (let i = 0; i < path.length - 1; i++) {
      const edge = this.edges.get(path[i])?.find((e) => e.to === path[i + 1])
      if (edge) {
        totalCongestion += edge.currentCongestion
        edgeCount++
      }
    }

    return edgeCount > 0 ? totalCongestion / edgeCount : 0
  }

  private calculateEfficiency(time: number, distance: number, cost: number): number {
    const timeEfficiency = distance / time
    const costEfficiency = distance / cost
    return Math.round((timeEfficiency * 0.7 + costEfficiency * 0.3) * 100)
  }
}
