import React, { useState, useMemo, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  User,
  Quote,
  FileText,
  Clock,
  Stethoscope,
  BookOpen,
  Users,
  Pill,
  HelpCircle,
  Sparkles,
  Info,
  Maximize2,
  Minimize2,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react'
import { CONSTELLATION_NODES, type ConstellationNodeData } from '../../types/intelligence'
import { GlassCard } from '../ui/GlassCard'
import { cn } from '../../utils/cn'

export interface CaseConstellationGraphProps {
  className?: string
  initialActiveNodeId?: string
  onSelectNode?: (nodeId: string) => void
}

interface NodePosition {
  id: string
  x: number
  y: number
  radius: number
}

export const CaseConstellationGraph: React.FC<CaseConstellationGraphProps> = ({
  className,
  initialActiveNodeId = 'patient',
  onSelectNode,
}) => {
  const [activeNodeId, setActiveNodeId] = useState<string>(initialActiveNodeId)
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null)
  const [isExpanded, setIsExpanded] = useState<boolean>(false)

  // Touch & Viewport Controls (Zoom & Pan)
  const [zoomLevel, setZoomLevel] = useState<number>(1)
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 })
  const isDraggingRef = useRef<boolean>(false)
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 })
  const initialPinchDistRef = useRef<number | null>(null)
  const initialZoomRef = useRef<number>(1)

  const handleZoomIn = () => setZoomLevel((z) => Math.min(2.2, Number((z + 0.25).toFixed(2))))
  const handleZoomOut = () => setZoomLevel((z) => Math.max(0.65, Number((z - 0.25).toFixed(2))))
  const handleResetView = () => {
    setZoomLevel(1)
    setPanOffset({ x: 0, y: 0 })
    setActiveNodeId('patient')
    if (onSelectNode) onSelectNode('patient')
  }

  // Touch gesture handlers for mobile
  const handleTouchStart = (e: React.TouchEvent<SVGSVGElement>) => {
    if (e.touches.length === 1) {
      isDraggingRef.current = true
      dragStartRef.current = {
        x: e.touches[0].clientX - panOffset.x,
        y: e.touches[0].clientY - panOffset.y,
      }
    } else if (e.touches.length === 2) {
      isDraggingRef.current = false
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      )
      initialPinchDistRef.current = dist
      initialZoomRef.current = zoomLevel
    }
  }

  const handleTouchMove = (e: React.TouchEvent<SVGSVGElement>) => {
    if (e.touches.length === 1 && isDraggingRef.current) {
      setPanOffset({
        x: e.touches[0].clientX - dragStartRef.current.x,
        y: e.touches[0].clientY - dragStartRef.current.y,
      })
    } else if (e.touches.length === 2 && initialPinchDistRef.current !== null) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      )
      const factor = dist / initialPinchDistRef.current
      const newZoom = Math.min(2.2, Math.max(0.65, initialZoomRef.current * factor))
      setZoomLevel(Number(newZoom.toFixed(2)))
    }
  }

  const handleTouchEnd = () => {
    isDraggingRef.current = false
    initialPinchDistRef.current = null
  }

  // Mouse pan handlers for desktop testing
  const handleMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    // Only drag if left click on canvas background (not clicking node directly)
    if ((e.target as HTMLElement).tagName === 'svg' || (e.target as HTMLElement).tagName === 'rect') {
      isDraggingRef.current = true
      dragStartRef.current = {
        x: e.clientX - panOffset.x,
        y: e.clientY - panOffset.y,
      }
    }
  }

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (isDraggingRef.current) {
      setPanOffset({
        x: e.clientX - dragStartRef.current.x,
        y: e.clientY - dragStartRef.current.y,
      })
    }
  }

  const handleMouseUp = () => {
    isDraggingRef.current = false
  }

  // 8 orbital nodes around center
  const orbitalNodeIds = useMemo(
    () => [
      'statements',
      'documents',
      'timeline',
      'consultations',
      'history',
      'family',
      'medications',
      'unknown',
    ],
    []
  )

  // Layout coordinates for SVG 800x600 viewBox
  const centerX = 400
  const centerY = 300
  const orbitRadiusX = 280
  const orbitRadiusY = 190

  // Calculate orbital node coordinates
  const nodePositions: Record<string, NodePosition> = useMemo(() => {
    const pos: Record<string, NodePosition> = {
      patient: { id: 'patient', x: centerX, y: centerY, radius: 46 },
    }

    orbitalNodeIds.forEach((id, index) => {
      // Offset starting angle so it aligns symmetrically
      const angle = (index * 2 * Math.PI) / orbitalNodeIds.length - Math.PI / 2
      const x = Math.round(centerX + orbitRadiusX * Math.cos(angle))
      const y = Math.round(centerY + orbitRadiusY * Math.sin(angle))
      pos[id] = { id, x, y, radius: 34 }
    })

    return pos
  }, [orbitalNodeIds])

  // Explicit edges between nodes
  const edges = useMemo(() => {
    const list: Array<{ source: string; target: string; isPrimary: boolean }> = []

    // Center connected to all 8 nodes
    orbitalNodeIds.forEach((id) => {
      list.push({ source: 'patient', target: id, isPrimary: true })
    })

    // Domain cross-links
    list.push({ source: 'statements', target: 'history', isPrimary: false })
    list.push({ source: 'statements', target: 'timeline', isPrimary: false })
    list.push({ source: 'documents', target: 'medications', isPrimary: false })
    list.push({ source: 'documents', target: 'timeline', isPrimary: false })
    list.push({ source: 'consultations', target: 'timeline', isPrimary: false })
    list.push({ source: 'consultations', target: 'documents', isPrimary: false })
    list.push({ source: 'history', target: 'family', isPrimary: false })
    list.push({ source: 'family', target: 'unknown', isPrimary: false })

    return list
  }, [orbitalNodeIds])

  const activeNode = CONSTELLATION_NODES[activeNodeId] || CONSTELLATION_NODES['patient']

  const handleNodeClick = (nodeId: string) => {
    setActiveNodeId(nodeId)
    if (onSelectNode) {
      onSelectNode(nodeId)
    }
  }

  // Helper to get Lucide icon for each node
  const renderNodeIcon = (type: string, classNameStr: string) => {
    switch (type) {
      case 'user':
        return <User className={classNameStr} />
      case 'quote':
        return <Quote className={classNameStr} />
      case 'file':
        return <FileText className={classNameStr} />
      case 'clock':
        return <Clock className={classNameStr} />
      case 'stethoscope':
        return <Stethoscope className={classNameStr} />
      case 'book':
        return <BookOpen className={classNameStr} />
      case 'users':
        return <Users className={classNameStr} />
      case 'pill':
        return <Pill className={classNameStr} />
      case 'alert':
      default:
        return <HelpCircle className={classNameStr} />
    }
  }

  // Determine if an edge is active
  const isEdgeConnectedToActive = (edge: { source: string; target: string }) => {
    return edge.source === activeNodeId || edge.target === activeNodeId
  }

  return (
    <GlassCard
      variant="elevated"
      className={cn(
        'p-4 sm:p-7 space-y-5 border border-slate-200/90 dark:border-slate-800 transition-all relative overflow-hidden',
        isExpanded ? 'fixed inset-2 sm:inset-4 z-50 overflow-y-auto bg-slate-950/95 p-4 sm:p-6 backdrop-blur-xl' : '',
        className
      )}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-cyan-500 animate-spin-slow" />
            <h3 className="font-black text-lg sm:text-xl text-slate-900 dark:text-slate-100 tracking-tight">
              Case Constellation
            </h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
              Interactive Topology Graph
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Holistic relationship network centered around the patient narrative. Pinch or use touch buttons to zoom and pan.
          </p>
        </div>

        {/* Graph Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Touch Zoom Buttons */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800/80 rounded-lg p-0.5 border border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={handleZoomIn}
              className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-white dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-sm transition-colors"
              title="Zoom In"
              aria-label="Zoom in graph"
            >
              +
            </button>
            <span className="px-1.5 text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400 min-w-[32px] text-center">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              type="button"
              onClick={handleZoomOut}
              className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-white dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-sm transition-colors"
              title="Zoom Out"
              aria-label="Zoom out graph"
            >
              -
            </button>
          </div>

          <button
            type="button"
            onClick={handleResetView}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-800/70 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 flex items-center gap-1.5 transition-colors"
            title="Reset position and zoom"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>

          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-800/70 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
            title={isExpanded ? 'Collapse' : 'Expand full view'}
            aria-label={isExpanded ? 'Collapse view' : 'Expand view'}
          >
            {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Graph & Info Panel Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* SVG Interactive Constellation Canvas (8 cols) */}
        <div className="lg:col-span-8 bg-slate-950 rounded-2xl p-2 sm:p-4 border border-slate-800/90 shadow-2xl relative select-none overflow-hidden">
          {/* Subtle Background Starfield Grid */}
          <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:20px_20px] opacity-40 pointer-events-none" />

          {/* SVG Canvas with Touch & Mouse Pan/Zoom */}
          <svg
            viewBox="0 0 800 600"
            className="w-full h-auto max-h-[540px] drop-shadow-md select-none touch-none cursor-grab active:cursor-grabbing"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onTouchCancel={handleTouchEnd}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <defs>
              {/* Radial gradient for Center Patient Node */}
              <radialGradient id="patientCenterGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="70%" stopColor="#047857" />
                <stop offset="100%" stopColor="#064e3b" />
              </radialGradient>

              {/* Radial gradient for Orbital Nodes */}
              <radialGradient id="orbitalNodeGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#1e293b" />
                <stop offset="100%" stopColor="#0f172a" />
              </radialGradient>

              {/* Glow filter */}
              <filter id="glowEffect" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Transform Group for Zoom & Pan gestures */}
            <g
              transform={`translate(${panOffset.x}, ${panOffset.y}) scale(${zoomLevel})`}
              style={{
                transformOrigin: '400px 300px',
                transition: isDraggingRef.current ? 'none' : 'transform 0.15s ease-out',
              }}
            >
              {/* Orbit guide ring ellipse */}
              <ellipse
                cx={centerX}
                cy={centerY}
                rx={orbitRadiusX}
                ry={orbitRadiusY}
                fill="none"
                stroke="#334155"
                strokeWidth="1.2"
                strokeDasharray="4 8"
                className="opacity-50"
              />

              {/* Inner secondary guide ring */}
              <ellipse
                cx={centerX}
                cy={centerY}
                rx={orbitRadiusX * 0.55}
                ry={orbitRadiusY * 0.55}
                fill="none"
                stroke="#1e293b"
                strokeWidth="1"
                strokeDasharray="2 6"
                className="opacity-40"
              />

              {/* Edges / Relationship Connections */}
              <g className="edges-layer">
                {edges.map((edge, index) => {
                  const sourcePos = nodePositions[edge.source]
                  const targetPos = nodePositions[edge.target]
                  if (!sourcePos || !targetPos) return null

                  const isConnected = isEdgeConnectedToActive(edge)
                  const isHovered =
                    hoveredNodeId === edge.source || hoveredNodeId === edge.target

                  return (
                    <line
                      key={`edge-${index}`}
                      x1={sourcePos.x}
                      y1={sourcePos.y}
                      x2={targetPos.x}
                      y2={targetPos.y}
                      stroke={
                        isConnected
                          ? '#10b981'
                          : isHovered
                          ? '#38bdf8'
                          : edge.isPrimary
                          ? '#334155'
                          : '#1e293b'
                      }
                      strokeWidth={isConnected ? 3 : isHovered ? 2 : 1.2}
                      strokeDasharray={isConnected ? '6 6' : undefined}
                      className={cn(
                        'transition-all duration-300',
                        isConnected && 'animate-dash'
                      )}
                      opacity={isConnected ? 1 : isHovered ? 0.9 : 0.45}
                    />
                  )
                })}
              </g>

              {/* Orbital Nodes */}
              <g className="nodes-layer">
                {orbitalNodeIds.map((id) => {
                  const pos = nodePositions[id]
                  const nodeData = CONSTELLATION_NODES[id]
                  if (!pos || !nodeData) return null

                  const isSelected = activeNodeId === id
                  const isHovered = hoveredNodeId === id
                  const isConnected =
                    activeNode.connectedNodeIds.includes(id) ||
                    (activeNodeId === 'patient' && true)

                  const isUnknown = id === 'unknown'

                  return (
                    <g
                      key={id}
                      className="cursor-pointer group"
                      onClick={() => handleNodeClick(id)}
                      onMouseEnter={() => setHoveredNodeId(id)}
                      onMouseLeave={() => setHoveredNodeId(null)}
                    >
                      {/* Glowing outer pulse for active/hovered */}
                      {(isSelected || isHovered) && (
                        <circle
                          cx={pos.x}
                          cy={pos.y}
                          r={pos.radius + 8}
                          fill="none"
                          stroke={isUnknown ? '#f43f5e' : '#10b981'}
                          strokeWidth="2"
                          className="animate-pulse opacity-75"
                        />
                      )}

                      {/* Node Background Circle */}
                      <circle
                        cx={pos.x}
                        cy={pos.y}
                        r={pos.radius}
                        fill="url(#orbitalNodeGrad)"
                        stroke={
                          isSelected
                            ? isUnknown
                              ? '#f43f5e'
                              : '#10b981'
                            : isConnected
                            ? '#0284c7'
                            : '#475569'
                        }
                        strokeWidth={isSelected ? 3 : 1.5}
                        className="transition-all duration-200 group-hover:stroke-cyan-400"
                      />

                      {/* Inner status accent dot */}
                      <circle
                        cx={pos.x}
                        cy={pos.y - 12}
                        r={3}
                        fill={isUnknown ? '#f43f5e' : '#10b981'}
                      />

                      {/* Label inside node */}
                      <text
                        x={pos.x}
                        y={pos.y + 4}
                        textAnchor="middle"
                        fill={isSelected ? '#ffffff' : '#cbd5e1'}
                        fontSize="9.5"
                        fontWeight="bold"
                        className="pointer-events-none select-none tracking-tight"
                      >
                        {nodeData.label.split(' ')[0]}
                      </text>
                      <text
                        x={pos.x}
                        y={pos.y + 15}
                        textAnchor="middle"
                        fill={isSelected ? '#38bdf8' : '#94a3b8'}
                        fontSize="8"
                        fontWeight="600"
                        className="pointer-events-none select-none"
                      >
                        {nodeData.label.split(' ').slice(1).join(' ')}
                      </text>
                    </g>
                  )
                })}

                {/* Center PATIENT Node */}
                {(() => {
                  const centerPos = nodePositions['patient']
                  const isSelected = activeNodeId === 'patient'

                  return (
                    <g
                      className="cursor-pointer group"
                      onClick={() => handleNodeClick('patient')}
                      onMouseEnter={() => setHoveredNodeId('patient')}
                      onMouseLeave={() => setHoveredNodeId(null)}
                    >
                      {/* Animated Pulsing Ring */}
                      <circle
                        cx={centerPos.x}
                        cy={centerPos.y}
                        r={centerPos.radius + 12}
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="1.5"
                        strokeDasharray="4 4"
                        className="animate-spin-slow opacity-60"
                      />

                      {/* Glowing Core */}
                      <circle
                        cx={centerPos.x}
                        cy={centerPos.y}
                        r={centerPos.radius}
                        fill="url(#patientCenterGrad)"
                        stroke={isSelected ? '#a7f3d0' : '#34d399'}
                        strokeWidth={isSelected ? 4 : 2}
                        filter="url(#glowEffect)"
                        className="transition-all"
                      />

                      {/* Center text */}
                      <text
                        x={centerPos.x}
                        y={centerPos.y - 4}
                        textAnchor="middle"
                        fill="#ffffff"
                        fontSize="12"
                        fontWeight="900"
                        letterSpacing="0.08em"
                        className="pointer-events-none select-none"
                      >
                        PATIENT
                      </text>
                      <text
                        x={centerPos.x}
                        y={centerPos.y + 12}
                        textAnchor="middle"
                        fill="#d1fae5"
                        fontSize="9"
                        fontWeight="bold"
                        className="pointer-events-none select-none"
                      >
                        Aarav Chen
                      </text>
                    </g>
                  )
                })()}
              </g>
            </g>
          </svg>

          {/* Floating On-Canvas Touch Controls (Bottom Right) */}
          <div className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-slate-900/90 backdrop-blur-md p-1 rounded-xl border border-slate-700/80 shadow-lg z-10">
            <button
              type="button"
              onClick={handleZoomIn}
              className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 active:bg-slate-600 text-white font-bold text-base flex items-center justify-center transition-colors"
              title="Touch Zoom In"
              aria-label="Touch zoom in"
            >
              +
            </button>
            <button
              type="button"
              onClick={handleZoomOut}
              className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 active:bg-slate-600 text-white font-bold text-base flex items-center justify-center transition-colors"
              title="Touch Zoom Out"
              aria-label="Touch zoom out"
            >
              -
            </button>
            <button
              type="button"
              onClick={handleResetView}
              className="px-2.5 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 active:bg-slate-600 text-slate-300 font-bold text-xs flex items-center justify-center gap-1 transition-colors"
              title="Reset Zoom and Pan"
              aria-label="Reset zoom and pan"
            >
              <RefreshCw className="w-3 h-3" />
              <span className="hidden sm:inline">1:1</span>
            </button>
          </div>

          {/* Quick interactive hint badge */}
          <div className="absolute bottom-3 left-3 hidden sm:flex px-3 py-1 rounded-full bg-slate-900/90 border border-slate-700 text-[10px] text-slate-300 font-mono items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span>Pinch, drag or tap nodes to focus connections</span>
          </div>

          {/* Mobile Thumb-Friendly Node Selector Bar */}
          <div className="mt-3 lg:hidden flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none snap-x">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 shrink-0 mr-1">
              Nodes:
            </span>
            <button
              type="button"
              onClick={() => handleNodeClick('patient')}
              className={cn(
                'px-3 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all border snap-center',
                activeNodeId === 'patient'
                  ? 'bg-emerald-500 text-white border-emerald-400 shadow-sm'
                  : 'bg-slate-800/90 text-slate-300 border-slate-700'
              )}
            >
              Patient Core
            </button>
            {orbitalNodeIds.map((id) => {
              const n = CONSTELLATION_NODES[id]
              const isSel = activeNodeId === id
              return (
                <button
                  key={`mobile-${id}`}
                  type="button"
                  onClick={() => handleNodeClick(id)}
                  className={cn(
                    'px-3 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all border snap-center',
                    isSel
                      ? id === 'unknown'
                        ? 'bg-rose-500 text-white border-rose-400 shadow-sm'
                        : 'bg-cyan-500 text-white border-cyan-400 shadow-sm'
                      : 'bg-slate-800/90 text-slate-300 border-slate-700'
                  )}
                >
                  {n.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Side Information Panel (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeNode.id}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.2 }}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 space-y-4 shadow-sm"
            >
              {/* Panel Header */}
              <div className="flex items-start justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                    {activeNode.category}
                  </span>
                  <h4 className="text-base font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    {renderNodeIcon(activeNode.iconType, 'w-4 h-4 text-emerald-500')}
                    <span>{activeNode.label}</span>
                  </h4>
                </div>
                <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[10px] font-bold text-slate-600 dark:text-slate-300">
                  {activeNode.detailsCount}
                </span>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {activeNode.description}
              </p>

              {/* Clinical Items List */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold uppercase text-slate-400 block tracking-wider">
                  Associated Record Items ({activeNode.clinicalItems.length})
                </span>

                <div className="space-y-2">
                  {activeNode.clinicalItems.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 text-xs space-y-1"
                    >
                      <div className="font-bold text-slate-800 dark:text-slate-200">
                        {item.label}
                      </div>
                      <div className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
                        {item.value}
                      </div>
                      {item.sourceBadge && (
                        <div className="pt-1 border-t border-slate-200/60 dark:border-slate-700/40 text-[10px] font-mono text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                          <Info className="w-2.5 h-2.5" />
                          <span>{item.sourceBadge}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Connected Relationships Quick Links */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">
                  Connected Nodes ({activeNode.connectedNodeIds.length})
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {activeNode.connectedNodeIds.map((cId) => {
                    const cNode = CONSTELLATION_NODES[cId]
                    if (!cNode) return null
                    return (
                      <button
                        key={cId}
                        type="button"
                        onClick={() => handleNodeClick(cId)}
                        className="px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:text-emerald-400 border border-slate-200 dark:border-slate-700 text-[10px] font-bold text-slate-600 dark:text-slate-300 transition-colors flex items-center gap-1"
                      >
                        <span>{cNode.label}</span>
                        <ChevronRight className="w-2.5 h-2.5" />
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Patient Voice Safeguard Reminder */}
              <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-800 dark:text-emerald-300 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span className="leading-snug">
                  <strong>Patient Voice Safeguard:</strong> All clinical nodes are grounded directly in the patient's recorded narrative or validated documents.
                </span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </GlassCard>
  )
}
