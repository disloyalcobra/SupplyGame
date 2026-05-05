// gameLogic.ts
// Motor de validación basado en flujo para el Supply Chain Game.
// Implementa la lógica corregida descrita en Script.md y Logica.md.

import { GameNode, GameEdge, NodeType, CONNECTION_RULES } from "./levelData";

// ─────────────────────────────────────────────────────────────
// Validar si una conexión entre dos nodos es permitida por tipo
// ─────────────────────────────────────────────────────────────
export function isConnectionAllowed(fromNode: GameNode, toNode: GameNode): boolean {
  const allowed = CONNECTION_RULES[fromNode.type];
  return allowed.includes(toNode.type);
}

// ─────────────────────────────────────────────────────────────
// Validar que el flujo de un edge no supera la capacidad
// del nodo TRANSPORT origen
// ─────────────────────────────────────────────────────────────
export function validateFlow(edge: GameEdge, fromNode: GameNode): boolean {
  // Solo los nodos de tipo TRANSPORT tienen límite de flujo por arista
  if (fromNode.type === NodeType.TRANSPORT) {
    return edge.flow <= fromNode.capacity;
  }
  return true;
}

// ─────────────────────────────────────────────────────────────
// Calcular el flujo total que llega a un nodo
// (suma de flow de todos los edges que terminan en ese nodo)
// ─────────────────────────────────────────────────────────────
export function getTotalInput(nodeId: string, edges: GameEdge[]): number {
  return edges
    .filter(e => e.to === nodeId)
    .reduce((sum, e) => sum + e.flow, 0);
}

// ─────────────────────────────────────────────────────────────
// Condición de victoria:
// 1. TODOS los nodos CUSTOMER deben tener su demanda satisfecha.
// 2. TODOS los nodos SHOP y WAREHOUSE deben estar "llenos" (input >= demand/capacity).
// 3. Todos los nodos disponibles en el nivel deben haber sido colocados.
// ─────────────────────────────────────────────────────────────
export function isLevelComplete(
  allLevelNodes: GameNode[], // Todos los nodos que define el nivel
  placedNodes: GameNode[],   // Nodos que están en el mapa
  edges: GameEdge[]
): boolean {
  // 1. Verificar que todos los nodos del nivel estén en el mapa
  if (placedNodes.length < allLevelNodes.length) return false;

  // 2. Verificar Clientes (Demanda satisfecha)
  const customers = allLevelNodes.filter(n => n.type === NodeType.CUSTOMER);
  for (const customer of customers) {
    const incoming = getTotalInput(customer.id, edges);
    if (incoming < (customer.demand ?? 0)) return false;
  }

  // 3. Verificar Destinos (Debe haber llegado flujo igual a su demanda)
  const dests = allLevelNodes.filter(n => n.type === NodeType.SHOP || n.type === NodeType.RETAILER || n.type === NodeType.INTERNET);
  for (const dest of dests) {
    const incoming = getTotalInput(dest.id, edges);
    if (incoming < (dest.demand ?? 0)) return false;
  }

  // 4. Verificar CEDIS (Debe haber llegado flujo igual a su capacidad)
  const warehouses = allLevelNodes.filter(n => n.type === NodeType.WAREHOUSE);
  for (const wh of warehouses) {
    const incoming = getTotalInput(wh.id, edges);
    if (incoming < (wh.capacity || 0)) return false;
  }

  return true;
}

// ─────────────────────────────────────────────────────────────
// Función para verificar si un nodo tiene un ancestro de cierto tipo
// (Rastrea el origen de las bicicletas)
// ─────────────────────────────────────────────────────────────
export function hasAncestorOfType(nodeId: string, type: NodeType, nodes: GameNode[], edges: GameEdge[]): boolean {
  const incoming = edges.filter(e => e.to === nodeId);
  for (const edge of incoming) {
    const parent = nodes.find(n => n.id === edge.from);
    if (!parent) continue;
    if (parent.type === type) return true;
    if (hasAncestorOfType(parent.id, type, nodes, edges)) return true;
  }
  return false;
}

// ─────────────────────────────────────────────────────────────
// Obtener región heredada (rastrea hasta la fábrica de origen)
// ─────────────────────────────────────────────────────────────
export function getEffectiveRegion(nodeId: string, nodes: GameNode[], edges: GameEdge[]): string | undefined {
  const node = nodes.find(n => n.id === nodeId);
  if (!node) return undefined;
  if (node.type === NodeType.FACTORY) return node.region;

  const incomingEdge = edges.find(e => e.to === nodeId);
  if (incomingEdge) {
    return getEffectiveRegion(incomingEdge.from, nodes, edges);
  }
  return node.region;
}

// ─────────────────────────────────────────────────────────────
// Estado de satisfacción de demanda por nodo
// ─────────────────────────────────────────────────────────────
export function getDemandSatisfaction(
  node: GameNode,
  edges: GameEdge[]
): number {
  const target = node.type === NodeType.WAREHOUSE ? (node.capacity || 0) : (node.demand || 0);
  if (target === 0) return 100;
  const incoming = getTotalInput(node.id, edges);
  return Math.min(100, Math.round((incoming / target) * 100));
}

// ─────────────────────────────────────────────────────────────
// Intentar agregar una nueva conexión y validarla
// Retorna: { valid, errorMsg, newEdge }
// ─────────────────────────────────────────────────────────────
export interface ConnectionResult {
  valid: boolean;
  errorMsg?: string;
  newEdge?: GameEdge;
}

export function tryConnect(
  fromNode: GameNode,
  toNode: GameNode,
  existingEdges: GameEdge[],
  allNodes: GameNode[]
): ConnectionResult {
  // 1. Verificar conexión por tipo
  if (!isConnectionAllowed(fromNode, toNode)) {
    return { valid: false, errorMsg: `❌ No puedes conectar ${fromNode.type} → ${toNode.type}` };
  }

  // 1a. Verificar si el cliente requiere conexión a internet exclusiva
  if (toNode.type === NodeType.CUSTOMER && toNode.requiresInternet && fromNode.type !== NodeType.INTERNET) {
    return { valid: false, errorMsg: "❌ Estos clientes solo compran a través del Canal de Internet" };
  }

  // 1b. Reglas estrictas del TRANSPORTE (Origen y Destino únicos)
  if (fromNode.type === NodeType.TRANSPORT) {
    // Un transporte solo puede tener UNA salida
    const outgoing = existingEdges.filter(e => e.from === fromNode.id);
    if (outgoing.length >= 1) {
      return { valid: false, errorMsg: "❌ Este camión ya tiene un destino asignado. Usa otro camión." };
    }

    // Consistencia regional: si ya está conectado a una fábrica, el destino debe ser de la misma región
    const incomingEdge = existingEdges.find(e => e.to === fromNode.id);
    if (incomingEdge) {
      const sourceNode = allNodes.find(n => n.id === incomingEdge.from);
      const sourceRegion = sourceNode?.region;
      if (sourceRegion && toNode.region && sourceRegion !== "Global" && toNode.region !== "Global") {
        if (sourceRegion !== toNode.region) {
          return { valid: false, errorMsg: `❌ Conflicto Regional: este camión carga mercancía de ${sourceRegion}, no puede entregar en ${toNode.region}` };
        }
      }
    }
  }

  if (toNode.type === NodeType.TRANSPORT) {
    // Un transporte solo puede tener UNA entrada (no puede recibir de dos fábricas/nodos a la vez)
    const incoming = existingEdges.filter(e => e.to === toNode.id);
    if (incoming.length >= 1) {
      return { valid: false, errorMsg: "❌ Este transporte ya está cargado. Cada camión solo puede recibir mercancía de un origen." };
    }
  }

  // 1c. Validación regional solo al llegar al CLIENTE final o INTERNET
  if (toNode.type === NodeType.CUSTOMER || toNode.type === NodeType.INTERNET) {
    const effRegion = getEffectiveRegion(fromNode.id, allNodes, existingEdges) || fromNode.region;
    if (effRegion && toNode.region && effRegion !== "Global" && toNode.region !== "Global") {
      if (effRegion !== toNode.region) {
        return { valid: false, errorMsg: `❌ Conflicto Regional: ${effRegion} no puede abastecer a la región de ${toNode.region}` };
      }
    }
  }

  // 1d. Regla de Internet: Recibe mercancía a través de un Transporte
  if (toNode.type === NodeType.INTERNET) {
    if (fromNode.type !== NodeType.TRANSPORT) {
      return { valid: false, errorMsg: "❌ El Canal de Internet recibe mercancía a través de un Transporte" };
    }
  }


  // 2. Evitar duplicados
  const alreadyExists = existingEdges.some(e => e.from === fromNode.id && e.to === toNode.id);
  if (alreadyExists) return { valid: false, errorMsg: "⚠️ Esta conexión ya existe" };

  // 3. Evitar ciclos
  const wouldCreateCycle = existingEdges.some(e => e.from === toNode.id && e.to === fromNode.id);
  if (wouldCreateCycle) return { valid: false, errorMsg: "❌ Esta conexión crearía un ciclo" };

  // La asignación de flujos se delega a `recalculateFlows`
  const newEdge: GameEdge = { from: fromNode.id, to: toNode.id, flow: 0 };
  return { valid: true, newEdge };
}

// ─────────────────────────────────────────────────────────────
// Recalcular flujos de todo el sistema dinámicamente
// ─────────────────────────────────────────────────────────────
export function recalculateFlows(nodes: GameNode[], edges: GameEdge[]): GameEdge[] {
  const newEdges = edges.map(e => ({ ...e, flow: 0 }));

  // Topological sort
  const inDegree: Record<string, number> = {};
  const adj: Record<string, string[]> = {};
  nodes.forEach(n => { inDegree[n.id] = 0; adj[n.id] = []; });

  newEdges.forEach(e => {
    if (adj[e.from]) adj[e.from].push(e.to);
    if (inDegree[e.to] !== undefined) inDegree[e.to]++;
  });

  const queue: string[] = [];
  nodes.forEach(n => {
    if (inDegree[n.id] === 0) queue.push(n.id);
  });

  const incomingFlow: Record<string, number> = {};
  nodes.forEach(n => incomingFlow[n.id] = 0);

  const sortedNodes: string[] = [];
  while (queue.length > 0) {
    const currId = queue.shift()!;
    sortedNodes.push(currId);
    adj[currId].forEach(neighborId => {
      inDegree[neighborId]--;
      if (inDegree[neighborId] === 0) queue.push(neighborId);
    });
  }

  for (const nodeId of sortedNodes) {
    const node = nodes.find(n => n.id === nodeId)!;
    let available = node.type === NodeType.FACTORY
      ? node.capacity
      : Math.min(incomingFlow[node.id] || 0, node.capacity);

    const outEdges = newEdges.filter(e => e.from === nodeId);
    if (outEdges.length === 0) continue;

    const getEdgeCap = (edge: GameEdge) => {
      const target = nodes.find(n => n.id === edge.to)!;
      return target.type === NodeType.CUSTOMER ? (target.demand || 0) : target.capacity;
    };

    let remainingAvailable = available;
    let activeEdges = [...outEdges];

    while (remainingAvailable > 0 && activeEdges.length > 0) {
      const share = Math.floor(remainingAvailable / activeEdges.length);

      if (share === 0) {
        const e = activeEdges[0];
        e.flow += 1;
        remainingAvailable -= 1;
        if (e.flow >= getEdgeCap(e)) activeEdges.splice(0, 1);
        continue;
      }

      let flowAdded = false;
      for (let i = activeEdges.length - 1; i >= 0; i--) {
        const e = activeEdges[i];
        const cap = getEdgeCap(e);
        const space = cap - e.flow;

        if (space <= 0) {
          activeEdges.splice(i, 1);
        } else {
          const add = Math.min(share, space);
          e.flow += add;
          remainingAvailable -= add;
          flowAdded = true;
          if (e.flow >= cap) activeEdges.splice(i, 1);
        }
      }
      if (!flowAdded) break;
    }

    outEdges.forEach(e => {
      incomingFlow[e.to] = (incomingFlow[e.to] || 0) + e.flow;
    });
  }

  return newEdges;
}

// ─────────────────────────────────────────────────────────────
// Score basado en el porcentaje de demanda satisfecha
// ─────────────────────────────────────────────────────────────
export function calculateScore(
  nodes: GameNode[],
  edges: GameEdge[],
  timeSeconds: number,
  errorCount: number
): number {
  const customers = nodes.filter(n => n.type === NodeType.CUSTOMER);
  if (customers.length === 0) return 0;

  const avgSatisfaction =
    customers.reduce((sum, c) => sum + getDemandSatisfaction(c, edges), 0) /
    customers.length;

  const baseScore = Math.round(avgSatisfaction * 10); // máx 1000
  const timeBonus = Math.max(0, 300 - timeSeconds) * 2; // bonus si termina rápido
  const errorPenalty = errorCount * 50;

  return Math.max(0, baseScore + timeBonus - errorPenalty);
}
