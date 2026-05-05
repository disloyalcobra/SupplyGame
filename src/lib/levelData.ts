// levelData.ts
// Datos de todos los escenarios del juego Supply Chain Game
// Traduce el GDScript a TypeScript con lógica de flujo corregida.

export enum NodeType {
  FACTORY = "FACTORY",    // 🏭 Fábrica
  TRANSPORT = "TRANSPORT",  // 🚛 Transporte
  SHOP = "SHOP",       // 🛒 Tienda
  INTERNET = "INTERNET",   // @ Canal Internet
  WAREHOUSE = "WAREHOUSE",  // 🏗️ CEDIS
  RETAILER = "RETAILER",   // 🏪 Detallista
  CUSTOMER = "CUSTOMER",   // 🙋 Clientes
}

export const NODE_META: Record<NodeType, { icon: string; image: string; label: string; color: string; textColor: string }> = {
  [NodeType.FACTORY]: { icon: "🏭", image: "/imagenes/Fabrica.png", label: "Fábrica", color: "#cb0617", textColor: "#fff" },
  [NodeType.TRANSPORT]: { icon: "🚛", image: "/imagenes/Transporte.png", label: "Transporte", color: "#0c7eb0", textColor: "#fff" },
  [NodeType.SHOP]: { icon: "🛒", image: "/imagenes/Tienda.png", label: "Tienda", color: "#e3c800", textColor: "#fff" },
  [NodeType.INTERNET]: { icon: "@", image: "/imagenes/CanalInternet.png", label: "Canal Internet", color: "#aa00ff", textColor: "#fff" },
  [NodeType.WAREHOUSE]: { icon: "🏗️", image: "/imagenes/Almacen.png", label: "CEDIS", color: "#fa6800", textColor: "#fff" },
  [NodeType.RETAILER]: { icon: "🏪", image: "/imagenes/Detallista.png", label: "Detallista", color: "#de3493", textColor: "#fff" },
  [NodeType.CUSTOMER]: { icon: "🙋", image: "/imagenes/Clientes.png", label: "Clientes", color: "#0ba15f", textColor: "#fff" },
};

// Reglas de conexión globales (tipo_origen → tipos_destino_permitidos)
export const CONNECTION_RULES: Record<NodeType, NodeType[]> = {
  [NodeType.FACTORY]: [NodeType.TRANSPORT],
  [NodeType.TRANSPORT]: [NodeType.SHOP, NodeType.INTERNET, NodeType.WAREHOUSE, NodeType.RETAILER],
  [NodeType.SHOP]: [NodeType.CUSTOMER, NodeType.TRANSPORT],
  [NodeType.INTERNET]: [NodeType.CUSTOMER],
  [NodeType.WAREHOUSE]: [NodeType.TRANSPORT],
  [NodeType.RETAILER]: [NodeType.TRANSPORT, NodeType.CUSTOMER],
  [NodeType.CUSTOMER]: [],
};

export interface GameNode {
  id: string;
  name: string;
  type: NodeType;
  capacity: number;   // producción o capacidad de transporte
  demand?: number;    // demanda que debe satisfacerse (SHOP, CUSTOMER)
  requiresInternet?: boolean; // si es true, este cliente solo acepta conexiones de INTERNET
  region?: "Norte" | "Centro" | "Sur" | "Global"; // Etiqueta para validación regional
  detail: string;
  icon: string;
  // posición en el canvas
  x: number;
  y: number;
}

export interface GameEdge {
  from: string;
  to: string;
  flow: number; // flujo asignado en esta conexión
}

export interface Level {
  id: string;
  name: string;
  difficulty: "🟢 Básico" | "🟡 Intermedio" | "🔴 Avanzado";
  objective: string;
  description: string;
  nodes: GameNode[];
  // NOTA: valid_connections fue eliminado como condición de victoria.
  // La victoria se determina por satisfacción de demanda en nodos CUSTOMER.
}

// ──────────────────────────────────────────────
// NIVEL BÁSICO — ESCENARIO 1
// ──────────────────────────────────────────────
export const BASIC_1: Level = {
  id: "basic_1",
  name: "Básico — Escenario 1",
  difficulty: "🟢 Básico",
  objective: "Una fábrica produce 100 bicicletas. Usa 2 camiones (cap. 50 c/u) para abastecer 2 tiendas. Cada tienda tiene clientes que esperan sus bicicletas.",
  description: "1 Fábrica · 2 Transportes · 2 Tiendas · 2 Grupos de Clientes",
  nodes: [
    { id: "fab_centro", name: "Fabrica Centro", type: NodeType.FACTORY, capacity: 100, region: "Centro", detail: "Producción: 100 bicicletas", icon: "🏭", x: 80, y: 350 },
    { id: "trans_1", name: "Camión de carga cap 50", type: NodeType.TRANSPORT, capacity: 50, region: "Centro", detail: "Cap. 50 unid.", icon: "🚚", x: 280, y: 250 },
    { id: "trans_2", name: "Camión de carga cap 50", type: NodeType.TRANSPORT, capacity: 50, region: "Centro", detail: "Cap. 50 unid.", icon: "🚚", x: 280, y: 450 },
    { id: "shop_1", name: "Tienda Centro", type: NodeType.SHOP, capacity: 50, demand: 50, region: "Centro", detail: "50 bicicletas", icon: "🛒", x: 480, y: 250 },
    { id: "shop_2", name: "Tienda Centro 2", type: NodeType.SHOP, capacity: 50, demand: 50, region: "Centro", detail: "50 bicicletas", icon: "🛒", x: 480, y: 450 },
    { id: "client_centro", name: "Clientes Centro", type: NodeType.CUSTOMER, capacity: 50, demand: 50, region: "Centro", detail: "Demanda: 50 bicicletas", icon: "🙋", x: 480, y: 100 },
    { id: "trans_3", name: "Camión de carga cap 50", type: NodeType.TRANSPORT, capacity: 50, region: "Centro", detail: "Cap. 50 unid.", icon: "🚚", x: 680, y: 450 },
    { id: "internet_centro", name: "Canal Internet Centro", type: NodeType.INTERNET, capacity: 100, region: "Centro", detail: "Canal de venta online", icon: "@", x: 840, y: 350 },
    { id: "client_online", name: "Clientes Online Centro", type: NodeType.CUSTOMER, capacity: 50, demand: 50, region: "Centro", requiresInternet: true, detail: "Solo online", icon: "🙋", x: 840, y: 150 },

  ],
};

// ──────────────────────────────────────────────
// NIVEL BÁSICO — ESCENARIO 2
// ──────────────────────────────────────────────
export const BASIC_2: Level = {
  id: "basic_2",
  name: "Básico — Escenario 2",
  difficulty: "🟢 Básico",
  objective: "Dos fábricas (Centro + Norte, 100 c/u) con un camión cada una. Abastecen 2 tiendas con clientes esperando.",
  description: "2 Fábricas · 2 Transportes · 2 Tiendas · 2 Grupos de Clientes",
  nodes: [
    { id: "fab_centro", name: "Fabrica Centro", type: NodeType.FACTORY, capacity: 100, region: "Centro", detail: "Prod: 100", icon: "🏭", x: 80, y: 350 },
    { id: "fab_norte", name: "Fabrica Norte", type: NodeType.FACTORY, capacity: 100, region: "Norte", detail: "Prod: 100", icon: "🏭", x: 80, y: 550 },

    { id: "trans_c1", name: "Camión de carga cap 50", type: NodeType.TRANSPORT, capacity: 50, region: "Centro", detail: "Cap: 50", icon: "🚚", x: 280, y: 280 },
    { id: "trans_n1", name: "Camión de carga cap 50", type: NodeType.TRANSPORT, capacity: 50, region: "Norte", detail: "Cap: 50", icon: "🚚", x: 280, y: 480 },

    { id: "shop_centro", name: "Tienda Centro", type: NodeType.SHOP, capacity: 50, demand: 0, region: "Centro", detail: "Cap: 50", icon: "🛒", x: 480, y: 280 },
    { id: "shop_norte", name: "Tienda Norte", type: NodeType.SHOP, capacity: 50, demand: 0, region: "Norte", detail: "Cap: 50", icon: "🛒", x: 480, y: 480 },

    { id: "client_centro", name: "Clientes Centro", type: NodeType.CUSTOMER, capacity: 50, demand: 50, region: "Centro", detail: "Dem: 50", icon: "🙋", x: 480, y: 120 },
    { id: "client_norte", name: "Clientes Norte", type: NodeType.CUSTOMER, capacity: 25, demand: 25, region: "Norte", detail: "Dem: 25", icon: "🙋", x: 480, y: 620 },

    { id: "trans_n2", name: "Camión de carga cap 50", type: NodeType.TRANSPORT, capacity: 50, region: "Norte", detail: "Cap: 50", icon: "🚚", x: 680, y: 480 },
    { id: "int_norte", name: "Canal Internet Norte", type: NodeType.INTERNET, capacity: 25, region: "Norte", detail: "Online", icon: "@", x: 840, y: 350 },
    { id: "client_online_norte", name: "Clientes Online Norte", type: NodeType.CUSTOMER, capacity: 25, demand: 25, region: "Norte", requiresInternet: true, detail: "Solo online", icon: "🙋", x: 840, y: 150 },
  ],
};

// ──────────────────────────────────────────────
// NIVEL INTERMEDIO — ESCENARIO 1
// ──────────────────────────────────────────────
export const INTER_1: Level = {
  id: "inter_1",
  name: "Intermedio — Escenario 1",
  difficulty: "🟡 Intermedio",
  objective: "Fábrica Centro (150) + Norte (150). Cubre 3 tiendas con sus clientes usando 1 Trailer + 3 Camiones.",
  description: "2 Fábricas · 4 Transportes · 3 Tiendas · 3 Grupos de Clientes",
  nodes: [
    { id: "fab_centro", name: "Centro", type: NodeType.FACTORY, capacity: 150, region: "Centro", detail: "Producción: 150 bicicletas", icon: "🏭", x: 60, y: 200 },
    { id: "fab_norte", name: "Norte", type: NodeType.FACTORY, capacity: 150, region: "Norte", detail: "Producción: 150 bicicletas", icon: "🏭", x: 60, y: 400 },
    { id: "trailer_a1", name: "Trailer de carga cap 100", type: NodeType.TRANSPORT, capacity: 100, region: "Global", detail: "Cap. 100 unid.", icon: "🚛", x: 260, y: 120 },
    { id: "trailer_b1", name: "Trailer de carga cap 100", type: NodeType.TRANSPORT, capacity: 100, region: "Global", detail: "Cap. 100 unid.", icon: "🚛", x: 260, y: 120 },
    { id: "camion_a1", name: "Camión de carga cap 50", type: NodeType.TRANSPORT, capacity: 50, region: "Global", detail: "Cap. 50 unid.", icon: "🚚", x: 260, y: 300 },
    { id: "camion_b1", name: "Camión de carga cap 50", type: NodeType.TRANSPORT, capacity: 50, region: "Global", detail: "Cap. 50 unid.", icon: "🚚", x: 260, y: 460 },
    { id: "camion_c1", name: "Camión de carga cap 50", type: NodeType.TRANSPORT, capacity: 50, region: "Global", detail: "Cap. 50 unid. (última milla)", icon: "🚚", x: 480, y: 340 },
    { id: "shop_norte", name: "Tienda Norte", type: NodeType.SHOP, capacity: 150, region: "Norte", demand: 150, detail: "Necesita: 100 bicicletas", icon: "🛒", x: 480, y: 120 },
    { id: "shop_centro", name: "Tienda Centro", type: NodeType.SHOP, capacity: 50, region: "Centro", demand: 50, detail: "Necesita: 50 bicicletas", icon: "🛒", x: 480, y: 300 },
    { id: "shop_centro2", name: "Tienda Centro 2", type: NodeType.SHOP, capacity: 100, region: "Centro", demand: 100, detail: "Necesita: 100 bicicletas", icon: "🛒", x: 480, y: 460 },
    { id: "client_norte", name: "Clientes Norte", type: NodeType.CUSTOMER, capacity: 150, region: "Norte", demand: 150, detail: "Demanda: 100 bicicletas", icon: "🙋", x: 700, y: 120 },
    { id: "client_centro", name: "Clientes Centro", type: NodeType.CUSTOMER, capacity: 50, region: "Centro", demand: 50, detail: "Demanda: 50 bicicletas", icon: "🙋", x: 700, y: 340 },
    { id: "client_centro2", name: "Clientes Centro 2", type: NodeType.CUSTOMER, capacity: 50, region: "Centro", demand: 50, detail: "Demanda: 100 bicicletas", icon: "🙋", x: 700, y: 460 },
    { id: "client_online_centro", name: "Clientes Online centro", type: NodeType.CUSTOMER, capacity: 50, region: "Centro", demand: 50, requiresInternet: true, detail: "Solo online", icon: "🙋", x: 840, y: 150 },
    { id: "int_centro", name: "Canal Internet Centro", type: NodeType.INTERNET, capacity: 50, region: "Centro", detail: "Online", icon: "@", x: 840, y: 350 },
  ],
};
// ──────────────────────────────────────────────
// NIVEL INTERMEDIO — ESCENARIO 2
// ──────────────────────────────────────────────
export const INTER_2: Level = {
  id: "inter_2",
  name: "Intermedio — Escenario 2",
  difficulty: "🟡 Intermedio",
  objective: "Fábrica Centro (150) + Norte (100). Cubre 3 tiendas con sus clientes usando 1 Trailer + 3 Camiones.",
  description: "2 Fábricas · 4 Transportes · 3 Tiendas · 3 Grupos de Clientes",
  nodes: [
    { id: "fab_centro", name: "Centro", type: NodeType.FACTORY, capacity: 150, region: "Centro", detail: "Producción: 150 bicicletas", icon: "🏭", x: 60, y: 200 },
    { id: "fab_norte", name: "Norte", type: NodeType.FACTORY, capacity: 100, region: "Norte", detail: "Producción: 100 bicicletas", icon: "🏭", x: 60, y: 400 },
    { id: "trailer_a1", name: "Trailer de carga cap 100", type: NodeType.TRANSPORT, capacity: 100, region: "Global", detail: "Cap. 100 unid.", icon: "🚛", x: 260, y: 120 },
    { id: "trailer_b1", name: "Trailer de carga cap 100", type: NodeType.TRANSPORT, capacity: 100, region: "Global", detail: "Cap. 100 unid.", icon: "🚛", x: 260, y: 120 },
    { id: "trailer_c1", name: "Trailer de carga cap 100", type: NodeType.TRANSPORT, capacity: 100, region: "Global", detail: "Cap. 100 unid.", icon: "🚛", x: 260, y: 120 },
    { id: "camion_a1", name: "Camión de carga cap 50", type: NodeType.TRANSPORT, capacity: 50, region: "Global", detail: "Cap. 50 unid.", icon: "🚚", x: 260, y: 300 },
    { id: "camion_b1", name: "Camión de carga cap 50", type: NodeType.TRANSPORT, capacity: 50, region: "Global", detail: "Cap. 50 unid.", icon: "🚚", x: 260, y: 460 },
    { id: "camion_c1", name: "Camión de carga cap 50", type: NodeType.TRANSPORT, capacity: 50, region: "Global", detail: "Cap. 50 unid. (última milla)", icon: "🚚", x: 480, y: 340 },
    { id: "shop_norte", name: "Tienda Norte", type: NodeType.SHOP, capacity: 100, region: "Norte", demand: 100, detail: "Necesita: 100 bicicletas", icon: "🛒", x: 480, y: 120 },
    { id: "shop_centro", name: "Tienda Centro 1", type: NodeType.SHOP, capacity: 50, region: "Centro", demand: 50, detail: "Necesita: 50 bicicletas", icon: "🛒", x: 480, y: 300 },
    { id: "shop_centro2", name: "Tienda Centro 2", type: NodeType.SHOP, capacity: 100, region: "Centro", demand: 100, detail: "Necesita: 100 bicicletas", icon: "🛒", x: 480, y: 460 },
    { id: "client_centro", name: "Clientes Centro", type: NodeType.CUSTOMER, capacity: 50, region: "Centro", demand: 50, detail: "Demanda: 50 bicicletas", icon: "🙋", x: 700, y: 120 },
    { id: "client_online_centro", name: "Clientes Online centro", type: NodeType.CUSTOMER, capacity: 100, region: "Centro", demand: 100, requiresInternet: true, detail: "Solo online", icon: "🙋", x: 840, y: 150 },
    { id: "client_online_norte", name: "Clientes Online norte", type: NodeType.CUSTOMER, capacity: 100, region: "Norte", demand: 100, requiresInternet: true, detail: "Solo online", icon: "🙋", x: 840, y: 150 },
    { id: "int_centro", name: "Canal Internet Centro", type: NodeType.INTERNET, capacity: 100, region: "Centro", detail: "Online", icon: "@", x: 840, y: 350 },
    { id: "int_norte", name: "Canal Internet Norte", type: NodeType.INTERNET, capacity: 100, region: "Norte", detail: "Online", icon: "@", x: 840, y: 350 },
  ],
};

// ──────────────────────────────────────────────
// NIVEL INTERMEDIO — ESCENARIO 3
// ──────────────────────────────────────────────
export const INTER_3: Level = {
  id: "inter_3",
  name: "Intermedio — Escenario 3",
  difficulty: "🟡 Intermedio",
  objective: "Tres fábricas (Norte, Centro, Sur). Distribución multiregional compleja.",
  description: "3 Fábricas · 5 Transportes · 3 Tiendas · 3 Grupos de Clientes",
  nodes: [
    { id: "fab_n", name: "Fábrica Norte", type: NodeType.FACTORY, capacity: 150, region: "Norte", detail: "Prod: 150", icon: "🏭", x: 160, y: 150 },
    { id: "fab_c1", name: "Fábrica Centro 1", type: NodeType.FACTORY, capacity: 150, region: "Centro", detail: "Prod: 150", icon: "🏭", x: 160, y: 350 },
    { id: "fab_c2", name: "Fábrica Centro 2", type: NodeType.FACTORY, capacity: 100, region: "Centro", detail: "Prod: 100", icon: "🏭", x: 160, y: 550 },

    { id: "t_n", name: "Camión de carga cap 50", type: NodeType.TRANSPORT, capacity: 50, region: "Global", detail: "Cap: 50", icon: "🚛", x: 260, y: 150 },
    { id: "t_c1", name: "Camión de carga cap 50", type: NodeType.TRANSPORT, capacity: 50, region: "Global", detail: "Cap: 50", icon: "🚛", x: 260, y: 350 },
    { id: "t_c2", name: "Camión de carga cap 50", type: NodeType.TRANSPORT, capacity: 50, region: "Global", detail: "Cap: 50", icon: "🚛", x: 260, y: 550 },
    { id: "trailer_a1", name: "Trailer de carga cap 100", type: NodeType.TRANSPORT, capacity: 100, region: "Global", detail: "Cap. 100 unid.", icon: "🚛", x: 260, y: 120 },
    { id: "trailer_b1", name: "Trailer de carga cap 100", type: NodeType.TRANSPORT, capacity: 100, region: "Global", detail: "Cap. 100 unid.", icon: "🚛", x: 260, y: 120 },
    { id: "trailer_c1", name: "Trailer de carga cap 100", type: NodeType.TRANSPORT, capacity: 100, region: "Global", detail: "Cap. 100 unid.", icon: "🚛", x: 260, y: 120 },
    { id: "trailer_d1", name: "Trailer de carga cap 100", type: NodeType.TRANSPORT, capacity: 100, region: "Global", detail: "Cap. 100 unid.", icon: "🚛", x: 260, y: 120 },
    { id: "trailer_e1", name: "Trailer de carga cap 100", type: NodeType.TRANSPORT, capacity: 100, region: "Global", detail: "Cap. 100 unid.", icon: "🚛", x: 260, y: 120 },

    { id: "shop_n", name: "Tienda Norte", type: NodeType.SHOP, capacity: 150, region: "Norte", demand: 150, detail: "Cap: 150", icon: "🛒", x: 480, y: 150 },
    { id: "shop_c", name: "Tienda Centro 1", type: NodeType.SHOP, capacity: 150, region: "Centro", demand: 150, detail: "Cap: 150", icon: "🛒", x: 480, y: 350 },
    { id: "shop_c2", name: "Tienda Centro 2", type: NodeType.SHOP, capacity: 100, region: "Centro", demand: 100, detail: "Cap: 100", icon: "🛒", x: 480, y: 550 },

    { id: "client_n", name: "Clientes Norte", type: NodeType.CUSTOMER, capacity: 50, region: "Norte", demand: 50, detail: "Dem: 50", icon: "🙋", x: 1000, y: 100 },
    { id: "client_c1", name: "Clientes Centro 1", type: NodeType.CUSTOMER, capacity: 50, region: "Centro", demand: 50, detail: "Dem: 50", icon: "🙋", x: 1000, y: 200 },
    { id: "client_c2", name: "Clientes Centro 2", type: NodeType.CUSTOMER, capacity: 50, region: "Centro", demand: 50, detail: "Dem: 50", icon: "🙋", x: 1000, y: 300 },

    { id: "client_online_centro", name: "Clientes Online centro", type: NodeType.CUSTOMER, capacity: 150, region: "Centro", demand: 150, requiresInternet: true, detail: "Solo online", icon: "🙋", x: 1000, y: 400 },
    { id: "client_online_norte", name: "Clientes Online norte", type: NodeType.CUSTOMER, capacity: 100, region: "Norte", demand: 100, requiresInternet: true, detail: "Solo online", icon: "🙋", x: 1000, y: 500 },

    { id: "int_centro", name: "Canal Internet Centro", type: NodeType.INTERNET, capacity: 150, region: "Centro", detail: "Online", icon: "@", x: 840, y: 350 },
    { id: "int_norte", name: "Canal Internet Norte", type: NodeType.INTERNET, capacity: 100, region: "Norte", detail: "Online", icon: "@", x: 840, y: 500 },
  ],
};

// ──────────────────────────────────────────────
// NIVEL AVANZADO — ESCENARIO 1
// ──────────────────────────────────────────────
export const ADVANCED_1: Level = {
  id: "adv_1",
  name: "Avanzado — Escenario 1",
  difficulty: "🔴 Avanzado",
  objective: "Centro (1000) + Norte (500). CEDIS Santa Fé OBLIGATORIO. Toda la mercancía pasa por CEDIS. Satisface la demanda de tiendas y Walmart.",
  description: "2 Fábricas · CEDIS · 4 Transportes · 2 Tiendas · 1 Detallista · 3 Grupos Clientes",
  nodes: [
    { id: "fab_centro1", name: "Centro 1", type: NodeType.FACTORY, capacity: 200, region: "Centro", detail: "Producción: 200 bicicletas", icon: "🏭", x: 160, y: 200 },
    { id: "fab_centro2", name: "Centro 2", type: NodeType.FACTORY, capacity: 200, region: "Centro", detail: "Producción: 200 bicicletas", icon: "🏭", x: 160, y: 350 },
    { id: "fab_norte1", name: "Norte 1", type: NodeType.FACTORY, capacity: 100, region: "Norte", detail: "Producción: 500 bicicletas", icon: "🏭", x: 160, y: 500 },
    { id: "fab_norte2", name: "Norte 2", type: NodeType.FACTORY, capacity: 200, region: "Norte", detail: "Producción: 500 bicicletas", icon: "🏭", x: 160, y: 500 },
    { id: "trailer_a", name: "Camión de carga cap 100", type: NodeType.TRANSPORT, capacity: 100, region: "Global", detail: "Cap. 100 unid.", icon: "🚛", x: 260, y: 200 },
    { id: "trailer_b", name: "Camión de carga cap 100", type: NodeType.TRANSPORT, capacity: 100, region: "Global", detail: "Cap. 100 unid.", icon: "🚛", x: 260, y: 420 },
    { id: "cedis_centro", name: "CEDIS Centro", type: NodeType.WAREHOUSE, capacity: 400, region: "Centro", detail: "Hub OBLIGATORIO — Cap. 400 unid.", icon: "🏗️", x: 440, y: 300 },
    { id: "trailer_c", name: "Camión de carga cap 100", type: NodeType.TRANSPORT, capacity: 100, region: "Global", detail: "Cap. 100 unid.", icon: "🚛", x: 640, y: 160 },
    { id: "trailer_d", name: "Camión de carga cap 100", type: NodeType.TRANSPORT, capacity: 100, region: "Global", detail: "Cap. 100 unid.", icon: "🚛", x: 640, y: 160 },
    { id: "trailer_e", name: "Camión de carga cap 100", type: NodeType.TRANSPORT, capacity: 100, region: "Global", detail: "Cap. 100 unid.", icon: "🚛", x: 640, y: 160 },
    { id: "trailer_f", name: "Camión de carga cap 100", type: NodeType.TRANSPORT, capacity: 100, region: "Global", detail: "Cap. 100 unid.", icon: "🚛", x: 640, y: 420 },
    { id: "trailer_g", name: "Camión de carga cap 100", type: NodeType.TRANSPORT, capacity: 100, region: "Global", detail: "Cap. 100 unid.", icon: "🚛", x: 640, y: 420 },
    { id: "trailer_h", name: "Camión de carga cap 100", type: NodeType.TRANSPORT, capacity: 100, region: "Global", detail: "Cap. 100 unid.", icon: "🚛", x: 640, y: 420 },
    { id: "camion_a1", name: "Camión de carga cap 50", type: NodeType.TRANSPORT, capacity: 50, region: "Global", detail: "Cap. 50 unid.", icon: "🚚", x: 260, y: 460 },
    { id: "camion_b1", name: "Camión de carga cap 50", type: NodeType.TRANSPORT, capacity: 50, region: "Global", detail: "Cap. 50 unid.", icon: "🚚", x: 260, y: 460 },
    { id: "camion_c1", name: "Camión de carga cap 50", type: NodeType.TRANSPORT, capacity: 50, region: "Global", detail: "Cap. 50 unid.", icon: "🚚", x: 260, y: 460 },
    { id: "camion_d1", name: "Camión de carga cap 50", type: NodeType.TRANSPORT, capacity: 50, region: "Global", detail: "Cap. 50 unid.", icon: "🚚", x: 260, y: 460 },
    { id: "camion_e1", name: "Camión de carga cap 50", type: NodeType.TRANSPORT, capacity: 50, region: "Global", detail: "Cap. 50 unid.", icon: "🚚", x: 260, y: 460 },
    { id: "shop_centro", name: "Tienda Centro", type: NodeType.SHOP, capacity: 100, region: "Centro", demand: 100, detail: "Necesita: 100 bicicletas", icon: "🛒", x: 840, y: 100 },
    { id: "int_centro", name: "Canal Internet Centro", type: NodeType.INTERNET, capacity: 50, region: "Centro", detail: "Online", icon: "@", x: 840, y: 300 },
    { id: "int_norte", name: "Canal Internet Norte", type: NodeType.INTERNET, capacity: 50, region: "Norte", detail: "Online", icon: "@", x: 840, y: 400 },
    { id: "detallista_centro", name: "Detallista Centro", type: NodeType.RETAILER, capacity: 150, region: "Centro", demand: 150, detail: "Necesita: 150 bicicletas", icon: "🏪", x: 840, y: 500 },
    { id: "detallista_norte", name: "Detallista Norte", type: NodeType.RETAILER, capacity: 150, region: "Norte", demand: 150, detail: "Necesita: 150 bicicletas", icon: "🏪", x: 840, y: 600 },
    { id: "detallista_norte2", name: "Detallista Norte", type: NodeType.RETAILER, capacity: 150, region: "Norte", demand: 150, detail: "Necesita: 150 bicicletas", icon: "🏪", x: 840, y: 700 },
    { id: "client_centro1", name: "Clientes Centro 1", type: NodeType.CUSTOMER, capacity: 100, region: "Centro", demand: 100, detail: "Demanda: 100 bicicletas", icon: "🙋", x: 1000, y: 100 },
    { id: "client_norte", name: "Clientes Norte 1", type: NodeType.CUSTOMER, capacity: 50, region: "Norte", demand: 50, detail: "Demanda: 100 bicicletas", icon: "🙋", x: 1000, y: 200 },
    { id: "client_norte2", name: "Clientes Norte 2", type: NodeType.CUSTOMER, capacity: 100, region: "Norte", demand: 100, detail: "Demanda: 100 bicicletas", icon: "🙋", x: 1000, y: 200 },
    { id: "client_norte3", name: "Clientes Norte 3", type: NodeType.CUSTOMER, capacity: 100, region: "Norte", demand: 100, detail: "Demanda: 100 bicicletas", icon: "🙋", x: 1000, y: 200 },
    { id: "client_online_centro", name: "Clientes Online centro", type: NodeType.CUSTOMER, capacity: 50, region: "Centro", demand: 50, requiresInternet: true, detail: "Solo online", icon: "🙋", x: 1000, y: 300 },
    { id: "client_online_norte", name: "Clientes Online Norte", type: NodeType.CUSTOMER, capacity: 50, region: "Norte", demand: 50, requiresInternet: true, detail: "Solo online", icon: "🙋", x: 1000, y: 400 },
    { id: "client_centro2", name: "Clientes Centro 2", type: NodeType.CUSTOMER, capacity: 150, region: "Centro", demand: 150, detail: "Demanda: 150 bicicletas", icon: "🙋", x: 1000, y: 500 },
  ],
};

// ──────────────────────────────────────────────
// NIVEL AVANZADO — ESCENARIO 2
// ──────────────────────────────────────────────
export const ADVANCED_2: Level = {
  id: "adv_2",
  name: "Avanzado — Escenario 2",
  difficulty: "🔴 Avanzado",
  objective: "Satisface la gran demanda de los detallistas y clientes online regionales.",
  description: "3 Fábricas · 6 Transportes · 2 Detallistas · Canales Internet",
  nodes: [
    { id: "f_n", name: "Fabrica Norte 1", type: NodeType.FACTORY, capacity: 100, region: "Norte", detail: "Prod: 100", icon: "🏭", x: 160, y: 150 },
    { id: "f_c", name: "Fabrica Centro", type: NodeType.FACTORY, capacity: 250, region: "Centro", detail: "Prod: 250", icon: "🏭", x: 160, y: 350 },
    { id: "f_n2", name: "Fabrica Norte 2", type: NodeType.FACTORY, capacity: 100, region: "Norte", detail: "Prod: 100", icon: "🏭", x: 160, y: 550 },


    { id: "shop_c", name: "Tienda Centro", type: NodeType.SHOP, capacity: 100, region: "Centro", demand: 100, detail: "Cap: 150", icon: "🛒", x: 480, y: 350 },

    { id: "tr_1", name: "Trailer de carga cap 100", type: NodeType.TRANSPORT, capacity: 100, region: "Global", detail: "Cap: 100", icon: "🚛", x: 260, y: 100 },
    { id: "tr_2", name: "Trailer de carga cap 100", type: NodeType.TRANSPORT, capacity: 100, region: "Global", detail: "Cap: 100", icon: "🚛", x: 260, y: 300 },
    { id: "tr_3", name: "Trailer de carga cap 100", type: NodeType.TRANSPORT, capacity: 100, region: "Global", detail: "Cap: 100", icon: "🚛", x: 260, y: 500 },
    { id: "tr_4", name: "Trailer de carga cap 100", type: NodeType.TRANSPORT, capacity: 100, region: "Global", detail: "Cap: 100", icon: "🚛", x: 260, y: 500 },
    { id: "tr_5", name: "Trailer de carga cap 100", type: NodeType.TRANSPORT, capacity: 100, region: "Global", detail: "Cap: 100", icon: "🚛", x: 260, y: 500 },
    { id: "tr_6", name: "Trailer de carga cap 100", type: NodeType.TRANSPORT, capacity: 100, region: "Global", detail: "Cap: 100", icon: "🚛", x: 260, y: 500 },

    { id: "camion_a1", name: "Camión de carga cap 50", type: NodeType.TRANSPORT, capacity: 50, region: "Global", detail: "Cap. 50 unid.", icon: "🚚", x: 260, y: 460 },
    { id: "camion_b1", name: "Camión de carga cap 50", type: NodeType.TRANSPORT, capacity: 50, region: "Global", detail: "Cap. 50 unid.", icon: "🚚", x: 260, y: 460 },
    { id: "camion_c1", name: "Camión de carga cap 50", type: NodeType.TRANSPORT, capacity: 50, region: "Global", detail: "Cap. 50 unid.", icon: "🚚", x: 260, y: 460 },
    { id: "camion_d1", name: "Camión de carga cap 50", type: NodeType.TRANSPORT, capacity: 50, region: "Global", detail: "Cap. 50 unid.", icon: "🚚", x: 260, y: 460 },

    { id: "ret_c", name: "Detallista Norte", type: NodeType.RETAILER, capacity: 150, region: "Norte", demand: 150, detail: "Cap: 150", icon: "🏪", x: 500, y: 250 },

    { id: "int_c", name: "Internet Centro", type: NodeType.INTERNET, capacity: 50, region: "Centro", detail: "Online", icon: "@", x: 700, y: 350 },
    { id: "int_n", name: "Internet Norte", type: NodeType.INTERNET, capacity: 50, region: "Norte", detail: "Online", icon: "@", x: 700, y: 350 },


    { id: "cl_c_o", name: "Clientes Online Centro", type: NodeType.CUSTOMER, capacity: 50, region: "Centro", demand: 50, requiresInternet: true, detail: "Solo online", icon: "🙋", x: 1000, y: 150 },
    { id: "cl_n_o", name: "Clientes Online Norte", type: NodeType.CUSTOMER, capacity: 50, region: "Norte", demand: 50, requiresInternet: true, detail: "Solo online", icon: "🙋", x: 1000, y: 250 },
    { id: "cl_c1", name: "Clientes Centro", type: NodeType.CUSTOMER, capacity: 100, region: "Centro", demand: 100, detail: "Dem: 100", icon: "🙋", x: 1000, y: 350 },
    { id: "cl_n2", name: "Clientes Norte", type: NodeType.CUSTOMER, capacity: 100, region: "Norte", demand: 100, detail: "Dem: 100", icon: "🙋", x: 1000, y: 450 },

    { id: "cedis_centro", name: "CEDIS Centro", type: NodeType.WAREHOUSE, capacity: 250, region: "Centro", detail: "Hub OBLIGATORIO — Cap. 250 unid.", icon: "🏗️", x: 440, y: 300 },
    { id: "cedis_norte", name: "CEDIS Norte", type: NodeType.WAREHOUSE, capacity: 200, region: "Norte", detail: "Hub OBLIGATORIO — Cap. 200 unid.", icon: "🏗️", x: 440, y: 300 },


  ],
};

// ──────────────────────────────────────────────
// NIVEL AVANZADO — ESCENARIO 3
// ──────────────────────────────────────────────
export const ADVANCED_3: Level = {
  id: "adv_3",
  name: "Avanzado — Escenario 3",
  difficulty: "🔴 Avanzado",
  objective: "El desafío final. Integra CEDIS, detallistas y omnicanalidad total.",
  description: "Mega Cadena de Suministro",
  nodes: [
    { id: "f_n", name: "Fabrica Norte 1", type: NodeType.FACTORY, capacity: 200, region: "Norte", detail: "Prod: 100", icon: "🏭", x: 160, y: 150 },
    { id: "f_c", name: "Fabrica Centro", type: NodeType.FACTORY, capacity: 250, region: "Centro", detail: "Prod: 250", icon: "🏭", x: 160, y: 350 },
    { id: "f_n2", name: "Fabrica Norte 2", type: NodeType.FACTORY, capacity: 100, region: "Norte", detail: "Prod: 100", icon: "🏭", x: 160, y: 550 },

    { id: "shop_c1", name: "Tienda Centro 1", type: NodeType.SHOP, capacity: 100, region: "Centro", demand: 100, detail: "Cap: 150", icon: "🛒", x: 480, y: 150 },
    { id: "shop_c2", name: "Tienda Centro 2", type: NodeType.SHOP, capacity: 100, region: "Centro", demand: 100, detail: "Cap: 150", icon: "🛒", x: 480, y: 350 },
    { id: "shop_n1", name: "Tienda Norte", type: NodeType.SHOP, capacity: 50, region: "Norte", demand: 50, detail: "Cap: 150", icon: "🛒", x: 480, y: 550 },

    { id: "tr_1", name: "Trailer de carga cap 100", type: NodeType.TRANSPORT, capacity: 100, region: "Global", detail: "Cap: 100", icon: "🚛", x: 260, y: 100 },
    { id: "tr_2", name: "Trailer de carga cap 100", type: NodeType.TRANSPORT, capacity: 100, region: "Global", detail: "Cap: 100", icon: "🚛", x: 260, y: 300 },
    { id: "tr_3", name: "Trailer de carga cap 100", type: NodeType.TRANSPORT, capacity: 100, region: "Global", detail: "Cap: 100", icon: "🚛", x: 260, y: 500 },
    { id: "tr_4", name: "Trailer de carga cap 100", type: NodeType.TRANSPORT, capacity: 100, region: "Global", detail: "Cap: 100", icon: "🚛", x: 260, y: 500 },
    { id: "tr_5", name: "Trailer de carga cap 100", type: NodeType.TRANSPORT, capacity: 100, region: "Global", detail: "Cap: 100", icon: "🚛", x: 260, y: 500 },
    { id: "tr_6", name: "Trailer de carga cap 100", type: NodeType.TRANSPORT, capacity: 100, region: "Global", detail: "Cap: 100", icon: "🚛", x: 260, y: 500 },
    { id: "tr_7", name: "Trailer de carga cap 100", type: NodeType.TRANSPORT, capacity: 100, region: "Global", detail: "Cap: 100", icon: "🚛", x: 260, y: 500 },
    { id: "tr_8", name: "Trailer de carga cap 100", type: NodeType.TRANSPORT, capacity: 100, region: "Global", detail: "Cap: 100", icon: "🚛", x: 260, y: 500 },

    { id: "camion_a1", name: "Camión de carga cap 50", type: NodeType.TRANSPORT, capacity: 50, region: "Global", detail: "Cap. 50 unid.", icon: "🚚", x: 260, y: 460 },
    { id: "camion_b1", name: "Camión de carga cap 50", type: NodeType.TRANSPORT, capacity: 50, region: "Global", detail: "Cap. 50 unid.", icon: "🚚", x: 260, y: 460 },
    { id: "camion_c1", name: "Camión de carga cap 50", type: NodeType.TRANSPORT, capacity: 50, region: "Global", detail: "Cap. 50 unid.", icon: "🚚", x: 260, y: 460 },
    { id: "camion_d1", name: "Camión de carga cap 50", type: NodeType.TRANSPORT, capacity: 50, region: "Global", detail: "Cap. 50 unid.", icon: "🚚", x: 260, y: 460 },
    { id: "camion_e1", name: "Camión de carga cap 50", type: NodeType.TRANSPORT, capacity: 50, region: "Global", detail: "Cap. 50 unid.", icon: "🚚", x: 260, y: 460 },


    { id: "ret_c", name: "Detallista Norte", type: NodeType.RETAILER, capacity: 150, region: "Norte", demand: 150, detail: "Cap: 150", icon: "🏪", x: 500, y: 250 },

    { id: "int_c", name: "Internet Centro", type: NodeType.INTERNET, capacity: 50, region: "Centro", detail: "Online", icon: "@", x: 700, y: 350 },
    { id: "int_n", name: "Internet Norte", type: NodeType.INTERNET, capacity: 50, region: "Norte", detail: "Online", icon: "@", x: 700, y: 350 },


    { id: "cl_c_o", name: "Clientes Online Centro", type: NodeType.CUSTOMER, capacity: 50, region: "Centro", demand: 50, requiresInternet: true, detail: "Solo online", icon: "🙋", x: 1000, y: 100 },
    { id: "cl_n_o", name: "Clientes Online Norte", type: NodeType.CUSTOMER, capacity: 50, region: "Norte", demand: 50, requiresInternet: true, detail: "Solo online", icon: "🙋", x: 1000, y: 200 },
    { id: "cl_c1", name: "Clientes Centro 1", type: NodeType.CUSTOMER, capacity: 100, region: "Centro", demand: 100, detail: "Dem: 100", icon: "🙋", x: 1000, y: 300 },
    { id: "cl_c2", name: "Clientes Centro 2", type: NodeType.CUSTOMER, capacity: 100, region: "Centro", demand: 100, detail: "Dem: 100", icon: "🙋", x: 1000, y: 400 },
    { id: "cl_n1", name: "Clientes Norte 1", type: NodeType.CUSTOMER, capacity: 150, region: "Norte", demand: 150, detail: "Dem: 150", icon: "🙋", x: 1000, y: 500 },
    { id: "cl_n2", name: "Clientes Norte 2", type: NodeType.CUSTOMER, capacity: 50, region: "Norte", demand: 50, detail: "Dem: 50", icon: "🙋", x: 1000, y: 600 },

    { id: "cedis_centro", name: "CEDIS Centro", type: NodeType.WAREHOUSE, capacity: 250, region: "Centro", detail: "Hub OBLIGATORIO — Cap. 250 unid.", icon: "🏗️", x: 440, y: 300 },
    { id: "cedis_norte", name: "CEDIS Norte", type: NodeType.WAREHOUSE, capacity: 300, region: "Norte", detail: "Hub OBLIGATORIO — Cap. 300 unid.", icon: "🏗️", x: 440, y: 300 },

  ],
};

// Registro de todos los niveles
export const ALL_LEVELS: Level[] = [
  BASIC_1,
  BASIC_2,
  INTER_1,
  INTER_2,
  INTER_3,
  ADVANCED_1,
  ADVANCED_2,
  ADVANCED_3
];

export function getLevelById(id: string): Level {
  return ALL_LEVELS.find(l => l.id === id) ?? BASIC_1;
}
