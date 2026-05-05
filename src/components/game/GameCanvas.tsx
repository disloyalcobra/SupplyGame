"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GameNode, GameEdge, NodeType, NODE_META } from "@/lib/levelData";
import { tryConnect, isLevelComplete, getDemandSatisfaction, recalculateFlows } from "@/lib/gameLogic";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { MousePointer2, Move, ZoomIn, ZoomOut, AlertCircle, Info } from "lucide-react";

interface GameCanvasProps {
  nodes: GameNode[];
  onScoreChange: (delta: number) => void;
  onError: () => void;
  onLevelComplete: (edges: GameEdge[]) => void;
}

interface FeedbackMessage {
  id: number;
  text: string;
  type: "success" | "error" | "warning";
  x: number;
  y: number;
}

let feedbackIdCounter = 0;

export function GameCanvas({ nodes, onScoreChange, onError, onLevelComplete }: GameCanvasProps) {
  // Inicializamos dividiendo los nodos
  const [placedNodes, setPlacedNodes] = useState<GameNode[]>([]);
  const [sidebarNodes, setSidebarNodes] = useState<GameNode[]>([]);
  
  useEffect(() => {
    // Al cargar, solo FACTORY y CUSTOMER van al mapa por defecto.
    const initialPlaced = nodes.filter(
      (n) => n.type === NodeType.FACTORY || n.type === NodeType.CUSTOMER
    );
    const initialSidebar = nodes.filter(
      (n) => n.type !== NodeType.FACTORY && n.type !== NodeType.CUSTOMER
    );
    
    // Asignar posiciones iniciales seguras en el lienzo si no tienen (aunque las del nivel ya traen x,y)
    // Para simplificar, respetamos sus x,y del nivel.
    setPlacedNodes(initialPlaced);
    setSidebarNodes(initialSidebar);
    setEdges([]);
    setSelectedNodeId(null);
    setCompleted(false);
  }, [nodes]);

  const [edges, setEdges] = useState<GameEdge[]>([]);
  const [feedbacks, setFeedbacks] = useState<FeedbackMessage[]>([]);
  const [completed, setCompleted] = useState(false);

  // Audio Refs
  const audioPopup = useRef<HTMLAudioElement | null>(null);
  const audioError = useRef<HTMLAudioElement | null>(null);
  const audioWin = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      audioPopup.current = new Audio("/sonidos/popup.mp3");
      audioError.current = new Audio("/sonidos/error.mp3");
      audioWin.current = new Audio("/sonidos/win.mp3");
    }
  }, []);

  const playSound = useCallback((type: "popup" | "error" | "win") => {
    try {
      let audio: HTMLAudioElement | null = null;
      if (type === "popup") audio = audioPopup.current;
      if (type === "error") audio = audioError.current;
      if (type === "win") audio = audioWin.current;
      
      if (audio) {
        audio.currentTime = 0;
        audio.play().catch(e => console.warn("Audio play prevented:", e));
      }
    } catch (e) {
      // ignore
    }
  }, []);

  // Interaction States
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [movingNodeId, setMovingNodeId] = useState<string | null>(null);

  const svgRef = useRef<SVGSVGElement>(null);
  const ptrDownPos = useRef({ x: 0, y: 0 });
  const isDraggingRef = useRef(false);

  const getSVGCoords = useCallback((clientX: number, clientY: number) => {
    const svg = svgRef.current;
    if (!svg) return { x: 0, y: 0 };
    const pt = svg.createSVGPoint();
    pt.x = clientX;
    pt.y = clientY;
    const ctm = svg.getScreenCTM();
    if (!ctm) return { x: 0, y: 0 };
    const mapped = pt.matrixTransform(ctm.inverse());
    return { x: mapped.x, y: mapped.y };
  }, []);

  const addFeedback = (text: string, type: FeedbackMessage["type"], x: number, y: number) => {
    const id = feedbackIdCounter++;
    setFeedbacks((prev) => [...prev, { id, text, type, x, y }]);
    setTimeout(() => {
      setFeedbacks((prev) => prev.filter((f) => f.id !== id));
    }, 2000);
  };

  // --- Drag and Drop desde Sidebar ---
  const handleDragStartSidebar = (e: React.DragEvent, node: GameNode) => {
    e.dataTransfer.setData("application/json", JSON.stringify(node));
  };

  const handleDropSVG = (e: React.DragEvent) => {
    e.preventDefault();
    if (completed) return;
    const data = e.dataTransfer.getData("application/json");
    if (!data) return;

    try {
      const node: GameNode = JSON.parse(data);
      const coords = getSVGCoords(e.clientX, e.clientY);
      
      setSidebarNodes((prev) => prev.filter((n) => n.id !== node.id));
      setPlacedNodes((prev) => [...prev, { ...node, x: coords.x, y: coords.y }]);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDragOverSVG = (e: React.DragEvent) => {
    e.preventDefault();
  };

  // --- Mover nodos en el canvas y detectar clics ---
  const handleNodePointerDown = (e: React.PointerEvent, nodeId: string) => {
    if (completed) return;
    e.stopPropagation();
    
    // Ceder control del evento al puntero para tracking
    (e.target as Element).setPointerCapture(e.pointerId);

    setMovingNodeId(nodeId);
    ptrDownPos.current = { x: e.clientX, y: e.clientY };
    isDraggingRef.current = false;
  };

  const handleSVGPointerMove = (e: React.PointerEvent) => {
    if (movingNodeId) {
      const dx = e.clientX - ptrDownPos.current.x;
      const dy = e.clientY - ptrDownPos.current.y;
      
      // Si se mueve más de 3px en la pantalla, consideramos que es un "arrastre"
      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
        isDraggingRef.current = true;
      }

      if (isDraggingRef.current) {
        const pt = getSVGCoords(e.clientX, e.clientY);
        setPlacedNodes((prev) =>
          prev.map((n) => (n.id === movingNodeId ? { ...n, x: pt.x, y: pt.y } : n))
        );
      }
    }
  };

  const handleSVGPointerUp = (e: React.PointerEvent) => {
    setMovingNodeId(null);
  };

  const handleNodePointerUp = (e: React.PointerEvent, nodeId: string) => {
    if (completed) return;
    e.stopPropagation();
    (e.target as Element).releasePointerCapture(e.pointerId);

    if (!isDraggingRef.current) {
      // Fue un clic rápido (no un arrastre)
      handleNodeClick(nodeId);
    }
    setMovingNodeId(null);
    isDraggingRef.current = false;
  };

  // --- Lógica de Conexión (Clic en Origen -> Clic en Destino) ---
  const handleNodeClick = (nodeId: string) => {
    if (!selectedNodeId) {
      // Seleccionar primer nodo
      setSelectedNodeId(nodeId);
    } else if (selectedNodeId === nodeId) {
      // Deseleccionar si se hace clic en el mismo
      setSelectedNodeId(null);
    } else {
      // Intentar conectar
      const fromNode = placedNodes.find((n) => n.id === selectedNodeId);
      const toNode = placedNodes.find((n) => n.id === nodeId);

      if (fromNode && toNode) {
        const result = tryConnect(fromNode, toNode, edges, placedNodes);

        if (result.valid && result.newEdge) {
          let newEdges = [...edges, result.newEdge];
          newEdges = recalculateFlows(placedNodes, newEdges);
          setEdges(newEdges);
          onScoreChange(100);
          addFeedback(`✅ +100 Conectado`, "success", toNode.x, toNode.y - 50);
          
          if (isLevelComplete(nodes, placedNodes, newEdges) && !completed) {
            setCompleted(true);
            playSound("win");
            setTimeout(() => onLevelComplete(newEdges), 800);
          } else {
            playSound("popup");
          }
        } else {
          playSound("error");
          onScoreChange(-50);
          onError();
          addFeedback(result.errorMsg ?? "❌ Error", "error", toNode.x, toNode.y - 50);
        }
      }
      setSelectedNodeId(null);
    }
  };

  const removeEdge = (from: string, to: string) => {
    if (completed) return;
    setEdges((prev) => {
      const filtered = prev.filter((e) => !(e.from === from && e.to === to));
      return recalculateFlows(placedNodes, filtered);
    });
  };

  // Ayudante para regresar un nodo al sidebar (opcional: doble clic o botón)
  const returnNodeToSidebar = (node: GameNode) => {
    if (completed || node.type === NodeType.FACTORY || node.type === NodeType.CUSTOMER) return;
    // Eliminar conexiones relacionadas
    setEdges((prev) => {
      const filtered = prev.filter((e) => e.from !== node.id && e.to !== node.id);
      return recalculateFlows(placedNodes.filter(n => n.id !== node.id), filtered);
    });
    setPlacedNodes((prev) => prev.filter((n) => n.id !== node.id));
    setSidebarNodes((prev) => [...prev, node]);
    if (selectedNodeId === node.id) setSelectedNodeId(null);
  };

  return (
    <div className="relative w-full h-full flex bg-[#f4f4f4]">
      {/* --- Sidebar Izquierdo --- */}
      <aside className="w-72 bg-[#d4d4d4] border-r-2 border-[#747474] shadow-sm z-20 flex flex-col shrink-0">
        <div className="p-4 border-b-2 border-slate-100 bg-slate-50">
          <h3 className="font-black text-slate-700 uppercase tracking-widest text-sm flex items-center gap-2">
            <Move size={16} className="text-primary" /> Inventario
          </h3>
          <p className="text-xs text-slate-500 mt-1 font-medium">Arrastra los nodos hacia el mapa.</p>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {sidebarNodes.length === 0 ? (
            <div className="text-center p-6 border-2 border-dashed border-slate-200 rounded-xl">
              <span className="text-2xl block mb-2">🎉</span>
              <p className="text-xs font-bold text-slate-400 uppercase">Todos los nodos<br/>en el mapa</p>
            </div>
          ) : (
            sidebarNodes.map((node) => {
              const meta = NODE_META[node.type];
              return (
                <div
                  key={node.id}
                  draggable
                  onDragStart={(e) => handleDragStartSidebar(e, node)}
                  className="bg-white border-2 border-slate-200 rounded-xl p-3 flex items-center gap-3 cursor-grab hover:border-primary hover:shadow-md transition-all active:cursor-grabbing"
                >
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 overflow-hidden bg-slate-100 border-2" style={{ borderColor: meta.color }}>
                    <img src={meta.image} alt={meta.label} className="w-full h-full object-cover" draggable={false} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-700 leading-tight">{node.name}</h4>
                    <p className="text-xs text-slate-400 font-bold mt-0.5">{meta.label}</p>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="p-4 border-t-2 border-slate-100 bg-slate-50 space-y-2">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Controles</p>
          <div className="flex items-start gap-2 text-xs font-medium text-slate-600">
            <MousePointer2 size={14} className="shrink-0 mt-0.5" />
            <p><strong>Clic origen + Clic destino</strong> para conectar nodos.</p>
          </div>
          <div className="flex items-start gap-2 text-xs font-medium text-slate-600">
            <ZoomIn size={14} className="shrink-0 mt-0.5" />
            <p><strong>Rueda de ratón</strong> para acercar o alejar el mapa.</p>
          </div>
        </div>
      </aside>

      {/* --- Área del Mapa SVG --- */}
      <main className="flex-1 relative overflow-hidden bg-[#f4f4f4]">
        <TransformWrapper
          panning={{ disabled: !!movingNodeId }}
          wheel={{ step: 0.05 }}
          minScale={0.15}
          maxScale={4}
          initialScale={0.6}
          limitToBounds={false}
          initialPositionX={50}
          initialPositionY={50}
        >
          <TransformComponent wrapperClass="w-full h-full" contentClass="w-[3000px] h-[2000px]">
            <svg
              ref={svgRef}
              width={3000}
              height={3000}
              className="bg-[radial-gradient(#747474_2px,transparent_2px)] [background-size:32px_32px]"
              onDrop={handleDropSVG}
              onDragOver={handleDragOverSVG}
              onPointerMove={handleSVGPointerMove}
              onPointerUp={handleSVGPointerUp}
              onPointerLeave={handleSVGPointerUp}
            >
              <defs>
                <filter id="neonGlowSelect" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur1" />
                  <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur2" />
                  <feMerge>
                    <feMergeNode in="blur2" />
                    <feMergeNode in="blur1" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <filter id="neonGlowSuccess" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur1" />
                  <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur2" />
                  <feMerge>
                    <feMergeNode in="blur2" />
                    <feMergeNode in="blur1" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <clipPath id="squareClip">
                  <rect x="-34" y="-34" width="68" height="68" rx="12" />
                </clipPath>
              </defs>

              {/* --- Edges (Conexiones) --- */}
              {edges.map((edge) => {
                const from = placedNodes.find((n) => n.id === edge.from);
                const to = placedNodes.find((n) => n.id === edge.to);
                if (!from || !to) return null;

                const midX = (from.x + to.x) / 2;
                const midY = (from.y + to.y) / 2;

                return (
                  <g key={`${edge.from}-${edge.to}`}>
                    <motion.line
                      x1={from.x} y1={from.y}
                      x2={to.x} y2={to.y}
                      stroke="#0ba15f"
                      strokeWidth={5}
                      strokeDasharray="12 6"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                    />
                    <circle
                      cx={midX} cy={midY} r={18}
                      fill="white"
                      stroke="#0ba15f"
                      strokeWidth={3}
                      className="cursor-pointer hover:fill-red-50 hover:stroke-red-500 transition-colors"
                      onClick={(e) => { e.stopPropagation(); removeEdge(edge.from, edge.to); }}
                    />
                    <text
                      x={midX} y={midY + 1}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontSize={12}
                      fontWeight="bold"
                      fill="#0ba15f"
                      className="cursor-pointer select-none pointer-events-none"
                    >
                      {edge.flow}
                    </text>
                  </g>
                );
              })}

              {/* --- Línea de selección activa --- */}
              {selectedNodeId && (() => {
                const selNode = placedNodes.find(n => n.id === selectedNodeId);
                if (!selNode) return null;
                // Dibujamos un anillo resaltado alrededor del nodo seleccionado
                return (
                  <circle
                    cx={selNode.x}
                    cy={selNode.y}
                    r={45}
                    fill="none"
                    stroke="#aa00ff"
                    strokeWidth={4}
                    strokeDasharray="6 6"
                    className="animate-spin-slow origin-center"
                    style={{ transformOrigin: `${selNode.x}px ${selNode.y}px` }}
                  />
                );
              })()}

              {/* --- Nodos --- */}
              {placedNodes.map((node) => {
                const meta = NODE_META[node.type];
                const satisfaction = getDemandSatisfaction(node, edges);
                const isDemandNode = (node.demand != null && node.demand > 0) || node.type === NodeType.WAREHOUSE;
                const isSatisfied = isDemandNode && satisfaction >= 100;
                const isSelected = selectedNodeId === node.id;

                return (
                  <g
                    key={node.id}
                    transform={`translate(${node.x}, ${node.y})`}
                    onPointerDown={(e) => handleNodePointerDown(e, node.id)}
                    onPointerUp={(e) => handleNodePointerUp(e, node.id)}
                    onDoubleClick={() => returnNodeToSidebar(node)}
                    className="cursor-grab active:cursor-grabbing"
                  >
                    {/* Anillo de demanda */}
                    {isDemandNode && (
                      <rect
                        x={-42}
                        y={-42}
                        width={84}
                        height={84}
                        rx={16}
                        fill="none"
                        stroke={isSatisfied ? "#0ba15f" : "#afafaf"}
                        strokeWidth={6}
                        filter={isSatisfied ? "url(#neonGlowSuccess)" : undefined}
                      />
                    )}

                    {/* Cuerpo del nodo (Contorno + Imagen) */}
                    <rect
                      x={-34}
                      y={-34}
                      width={68}
                      height={68}
                      rx={12}
                      fill="white"
                      stroke={isSelected ? "#aa00ff" : isSatisfied ? "#0ba15f" : meta.color}
                      strokeWidth={isSelected || isSatisfied ? 5 : 3}
                      filter={isSelected ? "url(#neonGlowSelect)" : isSatisfied ? "url(#neonGlowSuccess)" : undefined}
                      style={{ filter: (!isSelected && !isSatisfied) ? "drop-shadow(0 6px 12px rgba(0,0,0,0.15))" : undefined }}
                      className="transition-all duration-300"
                    />

                    {/* Imagen SVG circular */}
                    <image
                      href={meta.image}
                      x="-34"
                      y="-34"
                      width="68"
                      height="68"
                      clipPath="url(#squareClip)"
                      preserveAspectRatio="xMidYMid slice"
                      className="select-none pointer-events-none"
                    />

                    {/* Etiqueta y Progreso */}
                    <g transform="translate(0, 45)">
                      <foreignObject x={-65} y={0} width={130} height={60} className="pointer-events-none">
                        <div className="flex flex-col items-center text-center">
                          <div className="bg-white/90 border border-[#d4d4d4] rounded-lg px-2 py-1 shadow-sm w-full">
                            <p className="text-[10px] font-black text-[#333333] leading-[1.1] uppercase">
                              {node.name}
                            </p>
                          </div>
                          {isDemandNode && (
                            <div className={`text-[11px] font-black mt-0.5 ${isSatisfied ? "text-[#0ba15f]" : "text-[#747474]"}`}>
                              {satisfaction}%
                            </div>
                          )}
                        </div>
                      </foreignObject>
                    </g>

                    {/* Badge de Capacidad */}
                    {node.capacity > 0 && (
                      <g transform="translate(24, -24)">
                        <rect x={-16} y={-10} width={32} height={20} rx={10} fill={meta.color} stroke="white" strokeWidth={2} />
                        <text textAnchor="middle" dominantBaseline="middle" fontSize={10} fontWeight="bold" fill="white" className="select-none pointer-events-none">
                          {node.capacity}
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}

              {/* --- Feedbacks flotantes --- */}
              <AnimatePresence>
                {feedbacks.map((fb) => (
                  <motion.text
                    key={fb.id}
                    x={fb.x}
                    y={fb.y}
                    textAnchor="middle"
                    fontSize={15}
                    fontWeight="black"
                    fill={fb.type === "success" ? "#0ba15f" : fb.type === "error" ? "#cb0617" : "#e3c800"}
                    initial={{ opacity: 1, y: fb.y }}
                    animate={{ opacity: 0, y: fb.y - 50 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.5 }}
                    className="select-none pointer-events-none"
                    style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))" }}
                  >
                    {fb.text}
                  </motion.text>
                ))}
              </AnimatePresence>
            </svg>
          </TransformComponent>
        </TransformWrapper>
        
        {/* Panel de Demanda Inferior Derecho */}
        <div className="absolute bottom-6 right-6 bg-[#d4d4d4]/95 backdrop-blur-md rounded-2xl border-2 border-[#747474] p-5 shadow-xl space-y-3 max-w-[240px] pointer-events-none z-10">
          <div className="flex items-center gap-2 border-b-2 border-slate-100 pb-2">
            <Info size={16} className="text-primary" />
            <p className="text-sm font-black uppercase tracking-widest text-slate-700">Progreso</p>
          </div>
          {nodes
            .filter((n) => (n.demand && n.demand > 0) || n.type === NodeType.WAREHOUSE)
            .map((n) => {
              const sat = getDemandSatisfaction(n, edges);
              return (
                <div key={n.id} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold text-slate-600">
                    <span>{n.name.length > 16 ? n.name.slice(0, 15) + "…" : n.name}</span>
                    <span className={sat >= 100 ? "text-primary" : "text-slate-400"}>{sat}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500 ease-out"
                      style={{
                        width: `${sat}%`,
                        background: sat >= 100 ? "#0ba15f" : sat > 50 ? "#e3c800" : "#cb0617",
                      }}
                    />
                  </div>
                </div>
              );
            })}
        </div>
      </main>
    </div>
  );
}
