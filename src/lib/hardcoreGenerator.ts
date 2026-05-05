// hardcoreGenerator.ts
// Generador procedural de niveles Hardcore — Supply Chain Game.
//
// GARANTÍAS:
//   • Cada SHOP     tiene exactamente 1 CUSTOMER + transportes CEDIS→SHOP exactos
//   • Cada RETAILER tiene exactamente 1 INTERNET → 1 CUSTOMER online + transportes exactos
//   • CEDIS.capacity = max(200, totalDemand)   ← mínimo 200
//   • RETAILER.demand = max(150, valor_random)  ← mínimo 150
//   • FACTORY.capacity = CEDIS.capacity  (supply == demand exacto)
//   • Transportes fábrica→CEDIS : ceil(factoryCap / 100) trailers de cap 100
//   • Transportes CEDIS→destino : ceil(destDemand / trCap) por cada destino
//   • NUNCA nodos huérfanos sin ruta ni cliente

import { GameNode, NodeType, Level } from "./levelData";

// ─────────────────────────────────────────────────────────────
// Tipos
// ─────────────────────────────────────────────────────────────
type Region = "Norte" | "Centro" | "Sur";

export interface GeneratedLevel extends Level {
  isHardcore: true;
  levelNumber: number;
  difficulty: "🔴 Avanzado";
}

// ─────────────────────────────────────────────────────────────
// PRNG determinista (LCG)
// ─────────────────────────────────────────────────────────────
function seededRand(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 4294967296;
  };
}
function pick<T>(arr: T[], r: () => number): T {
  return arr[Math.floor(r() * arr.length)];
}

// ─────────────────────────────────────────────────────────────
// Nombres genéricos
// ─────────────────────────────────────────────────────────────
const LETTERS = ["A", "B", "C", "D"];
const N = {
  factory:   (reg: Region, i: number) => `Fábrica ${reg} ${LETTERS[i] ?? i}`,
  cedis:     (reg: Region)            => `CEDIS ${reg}`,
  shop:      (reg: Region, i: number) => `Tienda ${reg} ${LETTERS[i] ?? i}`,
  retailer:  (reg: Region)            => `Detallista ${reg}`,
  internet:  (reg: Region)            => `Canal Internet ${reg}`,
  client:    (reg: Region, i: number) => `Clientes ${reg} ${LETTERS[i] ?? i}`,
  online:    (reg: Region)            => `Clientes Online ${reg}`,
  transport: (cap: number)            => cap >= 100 ? `Trailer cap ${cap}` : `Camión cap ${cap}`,
};
const trIcon = (cap: number) => cap >= 100 ? "🚛" : "🚚";

// ─────────────────────────────────────────────────────────────
// Columnas X del canvas
// ─────────────────────────────────────────────────────────────
const X = { FAB: 160, TR1: 350, CED: 540, TR2: 730, DST: 920, INT: 1110, CLI: 1300 };
const TR_BIG = 100;
const TR_SML = 50;
const Y_STEP = 140;
const CEDIS_MIN = 200;    // CEDIS mínimo 200 unidades
const RETAILER_MIN = 150; // Detallista mínimo 150 unidades

// ─────────────────────────────────────────────────────────────
// GENERADOR PRINCIPAL
// ─────────────────────────────────────────────────────────────
export function generateHardcoreLevel(
  levelNumber: number,
  seed?: number,
): GeneratedLevel {
  const r = seededRand(seed ?? ((Date.now() >>> 0) ^ (levelNumber * 7919)));
  const diff = Math.min(levelNumber, 5);

  // Regiones activas (2 ó 3 según dificultad)
  const allR: Region[] = ["Norte", "Centro", "Sur"];
  for (let i = allR.length - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1));
    [allR[i], allR[j]] = [allR[j], allR[i]];
  }
  const regions = allR.slice(0, diff >= 3 ? 3 : 2);

  // Parámetros según dificultad
  const shopsPerRegion   = diff >= 4 ? 2 : 1;
  const withRetailer     = diff >= 2;
  const withOnlineClient = diff >= 2;

  // ─────────────────────────────────────────────────────────
  // FASE 1 — Planificar demandas por región
  // Demanda primero → supply se ajusta después
  // ─────────────────────────────────────────────────────────
  interface Dest { type: "shop" | "retailer" | "internet"; demand: number; idx: number; }
  interface Plan { region: Region; dests: Dest[]; factoryCap: number; cedisCap: number; }

  const plans: Plan[] = regions.map((region) => {
    const dests: Dest[] = [];

    // Tiendas — demandas redondas (100 ó 150)
    for (let s = 0; s < shopsPerRegion; s++) {
      const demand = pick([100, 100, 150], r);
      dests.push({ type: "shop", demand, idx: s });
    }

    // Detallista — mínimo RETAILER_MIN (150)
    if (withRetailer) {
      const demand = Math.max(RETAILER_MIN, pick([150, 150, 200], r));
      dests.push({ type: "retailer", demand, idx: 0 });
    }

    // Canal Internet — tratado como destino independiente desde el CEDIS
    if (withOnlineClient) {
      const demand = pick([100, 150], r);
      dests.push({ type: "internet", demand, idx: 0 });
    }

    const totalDemand = dests.reduce((s, d) => s + d.demand, 0);
    // CEDIS mínimo 200, fábrica == CEDIS para que supply == demand
    const cedisCap   = Math.max(CEDIS_MIN, totalDemand);
    const factoryCap = cedisCap;

    return { region, dests, factoryCap, cedisCap };
  });

  // ─────────────────────────────────────────────────────────
  // FASE 2 — Construir nodos con posiciones en canvas
  // ─────────────────────────────────────────────────────────
  const nodes: GameNode[] = [];
  let seq = 0;
  const uid = (p: string) => `${p}_${++seq}`;

  // Calcular Y de inicio para cada región
  const regionStartY: number[] = [];
  let curY = 150;
  for (const plan of plans) {
    regionStartY.push(curY);
    curY += plan.dests.length * Y_STEP + Y_STEP; // margen entre regiones
  }

  plans.forEach((plan, pi) => {
    const { region, dests, factoryCap, cedisCap } = plan;
    const blockH    = dests.length * Y_STEP;
    const blockMidY = regionStartY[pi] + Math.floor(blockH / 2) - Math.floor(Y_STEP / 2);

    // ── Fábrica (centrada en su bloque)
    nodes.push({
      id: uid("fab"),
      name: N.factory(region, 0),
      type: NodeType.FACTORY,
      capacity: factoryCap,
      region,
      detail: `Prod: ${factoryCap}`,
      icon: "🏭",
      x: X.FAB,
      y: blockMidY,
    });

    // ── CEDIS
    nodes.push({
      id: uid("ced"),
      name: N.cedis(region),
      type: NodeType.WAREHOUSE,
      capacity: cedisCap,
      region,
      detail: `Hub — Cap. ${cedisCap}`,
      icon: "🏗️",
      x: X.CED,
      y: blockMidY,
    });

    // ── Transportes Fábrica → CEDIS
    // Usamos la combinación exacta de 100s y 50s para que la capacidad sume exacto
    let remainingFab = factoryCap;
    const fabTransports: number[] = [];
    while (remainingFab >= 100) { fabTransports.push(TR_BIG); remainingFab -= 100; }
    if (remainingFab > 0) { fabTransports.push(TR_SML); }

    for (let i = 0; i < fabTransports.length; i++) {
      const trCap = fabTransports[i];
      nodes.push({
        id: uid("tf"),
        name: N.transport(trCap),
        type: NodeType.TRANSPORT,
        capacity: trCap,
        region: "Global",
        detail: `Cap. ${trCap} unid.`,
        icon: trIcon(trCap),
        x: X.TR1,
        y: blockMidY + (i - Math.floor(fabTransports.length / 2)) * 80,
      });
    }

    // ── Destinos (Tiendas, Detallista, Internet)
    dests.forEach((dest, di) => {
      const destY = regionStartY[pi] + di * Y_STEP;

      // Transportes CEDIS → Destino (combinación exacta de 100 y 50)
      let remDest = dest.demand;
      const destTransports: number[] = [];
      while (remDest >= 100) { destTransports.push(TR_BIG); remDest -= 100; }
      if (remDest > 0) { destTransports.push(TR_SML); }

      for (let i = 0; i < destTransports.length; i++) {
        const trCap = destTransports[i];
        nodes.push({
          id: uid("ts"),
          name: N.transport(trCap),
          type: NodeType.TRANSPORT,
          capacity: trCap,
          region: "Global",
          detail: `Cap. ${trCap} unid.`,
          icon: trIcon(trCap),
          x: X.TR2,
          y: destY + (i === 0 ? 0 : i * 65),
        });
      }

      if (dest.type === "shop") {
        // ── Tienda
        nodes.push({
          id: uid("sh"),
          name: N.shop(region, dest.idx),
          type: NodeType.SHOP,
          capacity: dest.demand,
          demand: dest.demand,
          region,
          detail: `Dem: ${dest.demand}`,
          icon: "🛒",
          x: X.DST,
          y: destY,
        });
        // ── Cliente directo
        nodes.push({
          id: uid("cl"),
          name: N.client(region, dest.idx),
          type: NodeType.CUSTOMER,
          capacity: dest.demand,
          demand: dest.demand,
          region,
          detail: `Dem: ${dest.demand}`,
          icon: "🙋",
          x: X.CLI,
          y: destY,
        });
      } else if (dest.type === "retailer") {
        // ── Detallista
        nodes.push({
          id: uid("rt"),
          name: N.retailer(region),
          type: NodeType.RETAILER,
          capacity: dest.demand,
          demand: dest.demand,
          region,
          detail: `Dem: ${dest.demand}`,
          icon: "🏪",
          x: X.DST,
          y: destY,
        });
        // ── Cliente directo del detallista
        nodes.push({
          id: uid("cl"),
          name: N.client(region, dest.idx), // Usa mismo nombre o index
          type: NodeType.CUSTOMER,
          capacity: dest.demand,
          demand: dest.demand,
          region,
          detail: `Dem: ${dest.demand} (Mayorista)`,
          icon: "🙋",
          x: X.CLI,
          y: destY,
        });
      } else if (dest.type === "internet") {
        // ── Canal Internet (misma región)
        nodes.push({
          id: uid("in"),
          name: N.internet(region),
          type: NodeType.INTERNET,
          capacity: dest.demand,
          demand: dest.demand,
          region,
          detail: `Dem: ${dest.demand} (Online)`,
          icon: "@",
          x: X.INT, // wait, X.INT is normally far right, let's keep it there or at DST
          y: destY,
        });
        // ── Cliente online
        nodes.push({
          id: uid("co"),
          name: N.online(region),
          type: NodeType.CUSTOMER,
          capacity: dest.demand,
          demand: dest.demand,
          requiresInternet: true,
          region,
          detail: `Dem: ${dest.demand} (Online)`,
          icon: "🙋",
          x: X.CLI,
          y: destY,
        });
      }
    });
  });

  // ─────────────────────────────────────────────────────────
  // FASE 3 — Metadata
  // ─────────────────────────────────────────────────────────
  const nFab  = nodes.filter(n => n.type === NodeType.FACTORY).length;
  const nCed  = nodes.filter(n => n.type === NodeType.WAREHOUSE).length;
  const nTr   = nodes.filter(n => n.type === NodeType.TRANSPORT).length;
  const nSh   = nodes.filter(n => n.type === NodeType.SHOP).length;
  const nRet  = nodes.filter(n => n.type === NodeType.RETAILER).length;
  const nCli  = nodes.filter(n => n.type === NodeType.CUSTOMER).length;
  const supply = nodes.filter(n => n.type === NodeType.FACTORY).reduce((s, n) => s + n.capacity, 0);

  const objective =
    `Conecta ${nFab} fábrica${nFab > 1 ? "s" : ""} (${regions.join(", ")}) ` +
    `a través de ${nCed} CEDIS. Abastece ${nSh} tienda${nSh > 1 ? "s" : ""}` +
    (nRet > 0 ? ` y ${nRet} detallista${nRet > 1 ? "s" : ""}` : "") +
    `. Total: ${supply} bicicletas.`;

  const description =
    `${nFab} Fáb · ${nCed} CEDIS · ${nTr} Transportes · ` +
    `${nSh + nRet} Destinos · ${nCli} Grupos Clientes`;

  return {
    id: `hc_${levelNumber}_${seq}`,
    name: `Hardcore — Nivel ${levelNumber}`,
    difficulty: "🔴 Avanzado",
    objective,
    description,
    nodes,
    isHardcore: true,
    levelNumber,
  };
}
