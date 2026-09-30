import React, { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Users,
  User,
  HeartPulse,
  Sparkles,
  Plus,
  RotateCcw,
  ShieldAlert,
  Info,
  ChevronRight,
  Maximize2,
  Minimize2,
  Activity,
  Flame,
} from 'lucide-react'
import { GlassCard } from '../ui/GlassCard'
import { AnimatedButton } from '../ui/AnimatedButton'
import { FamilyMemberDetailCard } from './FamilyMemberDetailCard'
import { FamilyMemberModal } from './FamilyMemberModal'
import {
  INITIAL_FAMILY_MEMBERS,
  type FamilyMember,
  type FamilyRelation,
} from '../../types/familyTree'
import { useNotifications } from '../../contexts/NotificationContext'
import { cn } from '../../utils/cn'

const FAMILY_TREE_STORAGE_KEY = 'ayucase_family_tree_v10'

export interface FamilyHealthTreeGraphProps {
  className?: string
}

export const FamilyHealthTreeGraph: React.FC<FamilyHealthTreeGraphProps> = ({ className }) => {
  const { notifySuccess, notifyInfo } = useNotifications()

  // Members state with localStorage persistence
  const [members, setMembers] = useState<FamilyMember[]>(() => {
    try {
      const stored = localStorage.getItem(FAMILY_TREE_STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed) && parsed.length > 0) return parsed
      }
    } catch (e) {
      console.warn('Failed to parse family tree from localStorage', e)
    }
    return INITIAL_FAMILY_MEMBERS
  })

  // Selected member for detail card
  const [selectedMemberId, setSelectedMemberId] = useState<string>('fam-patient')

  // Hovered member ID
  const [hoveredMemberId, setHoveredMemberId] = useState<string | null>(null)

  // Filter / Highlight toggle
  const [highlightMigraines, setHighlightMigraines] = useState<boolean>(true)

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [editingMember, setEditingMember] = useState<FamilyMember | null>(null)

  // Fullscreen expansion toggle
  const [isExpanded, setIsExpanded] = useState<boolean>(false)

  // Persist state
  useEffect(() => {
    try {
      localStorage.setItem(FAMILY_TREE_STORAGE_KEY, JSON.stringify(members))
    } catch (e) {
      console.warn('Failed to persist family tree', e)
    }
  }, [members])

  const selectedMember =
    members.find((m) => m.id === selectedMemberId) ||
    members.find((m) => m.isPatient) ||
    members[0]

  // Add or Edit member handler
  const handleSaveMember = (savedData: Partial<FamilyMember>) => {
    if (editingMember) {
      // Edit
      setMembers((prev) =>
        prev.map((m) => (m.id === editingMember.id ? ({ ...m, ...savedData } as FamilyMember) : m))
      )
      notifySuccess('Family Member Updated', `"${savedData.name}" has been updated.`)
    } else {
      // Add
      const newMember = savedData as FamilyMember
      setMembers((prev) => [...prev, newMember])
      setSelectedMemberId(newMember.id)
      notifySuccess('Family Member Added', `"${newMember.name}" added to the tree.`)
    }
    setEditingMember(null)
  }

  // Remove member handler
  const handleRemoveMember = (id: string) => {
    const target = members.find((m) => m.id === id)
    if (!target || target.isPatient) return

    setMembers((prev) => prev.filter((m) => m.id !== id))
    setSelectedMemberId('fam-patient')
    notifyInfo('Member Removed', `"${target.name}" removed from the family tree.`)
  }

  // Reset to initial baseline
  const handleReset = () => {
    setMembers(INITIAL_FAMILY_MEMBERS)
    setSelectedMemberId('fam-patient')
    notifyInfo('Tree Reset', 'Family health tree reset to initial intake baseline.')
  }

  // Dynamic layout coordinates for SVG 800x520
  // Tier 1: Grandparents (y: 80)
  // Tier 2: Parents (y: 240)
  // Tier 3: Patient & Siblings (y: 410)
  const nodeLayout = useMemo(() => {
    const layout: Record<string, { x: number; y: number; r: number }> = {}

    // Group members by generation
    const gen1 = members.filter((m) => m.generation === 1)
    const gen2 = members.filter((m) => m.generation === 2)
    const gen3 = members.filter((m) => m.generation === 3 || (!m.generation && !m.isPatient))

    // Position Gen 1 (Grandparents)
    gen1.forEach((m, i) => {
      const step = 800 / (gen1.length + 1)
      layout[m.id] = { x: Math.round(step * (i + 1)), y: 80, r: 30 }
    })

    // Position Gen 2 (Parents)
    gen2.forEach((m, i) => {
      const step = 800 / (gen2.length + 1)
      layout[m.id] = { x: Math.round(step * (i + 1)), y: 240, r: 34 }
    })

    // Position Gen 3 (Patient & Siblings)
    gen3.forEach((m, i) => {
      const step = 800 / (gen3.length + 1)
      layout[m.id] = { x: Math.round(step * (i + 1)), y: 410, r: m.isPatient ? 42 : 32 }
    })

    return layout
  }, [members])

  // Computed links between generations
  const pedigreeLinks = useMemo(() => {
    const links: Array<{ sourceId: string; targetId: string; isMaternal: boolean }> = []

    // Connect Maternal Grandparents -> Mother
    const mother = members.find((m) => m.relation === 'Parent' && m.lineageSide === 'Maternal')
    const father = members.find((m) => m.relation === 'Parent' && m.lineageSide === 'Paternal')
    const patient = members.find((m) => m.isPatient)
    const siblings = members.filter((m) => m.relation === 'Sibling')

    if (mother) {
      members
        .filter((m) => m.generation === 1 && m.lineageSide === 'Maternal')
        .forEach((gm) => {
          links.push({ sourceId: gm.id, targetId: mother.id, isMaternal: true })
        })
    }

    if (father) {
      members
        .filter((m) => m.generation === 1 && m.lineageSide === 'Paternal')
        .forEach((gp) => {
          links.push({ sourceId: gp.id, targetId: father.id, isMaternal: false })
        })
    }

    // Connect Parents -> Patient & Siblings
    if (mother && patient) {
      links.push({ sourceId: mother.id, targetId: patient.id, isMaternal: true })
    }
    if (father && patient) {
      links.push({ sourceId: father.id, targetId: patient.id, isMaternal: false })
    }

    siblings.forEach((sib) => {
      if (mother) links.push({ sourceId: mother.id, targetId: sib.id, isMaternal: true })
      if (father) links.push({ sourceId: father.id, targetId: sib.id, isMaternal: false })
    })

    return links
  }, [members])

  return (
    <GlassCard
      variant="elevated"
      className={cn(
        'p-5 sm:p-7 space-y-6 border border-slate-200/90 dark:border-slate-800 transition-all relative overflow-hidden',
        isExpanded ? 'fixed inset-4 z-50 overflow-y-auto bg-slate-950/95 p-6 backdrop-blur-xl' : '',
        className
      )}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-500" />
            <h3 className="font-black text-lg sm:text-xl text-slate-900 dark:text-slate-100 tracking-tight">
              Interactive Family Health Tree
            </h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              Generational Pedigree
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Multigenerational visual map connecting patient-reported health patterns across Grandparents, Parents, Siblings, and Patient.
          </p>
        </div>

        {/* Toolbar Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => setHighlightMigraines(!highlightMigraines)}
            className={cn(
              'px-2.5 py-1.5 rounded-lg text-xs font-bold border transition-colors flex items-center gap-1.5',
              highlightMigraines
                ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30'
                : 'bg-white/70 dark:bg-slate-800/70 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
            )}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Highlight Migraines</span>
          </button>

          <AnimatedButton
            variant="secondary"
            size="sm"
            leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
            onClick={handleReset}
          >
            Reset
          </AnimatedButton>

          <AnimatedButton
            variant="primary"
            size="sm"
            leftIcon={<Plus className="w-3.5 h-3.5" />}
            onClick={() => {
              setEditingMember(null)
              setIsModalOpen(true)
            }}
          >
            Add Member
          </AnimatedButton>

          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-800/70 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
            title={isExpanded ? 'Collapse' : 'Expand full screen'}
          >
            {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mandatory Non-Inferential Genetic Notice */}
      <div className="p-3 rounded-xl bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/25 text-amber-800 dark:text-amber-200 text-xs flex items-start gap-2.5">
        <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <span className="leading-snug">
          <strong>Non-Inferential Clinical Safety Protocol:</strong> The Family Health Tree records
          subjective, patient-reported relative health details for pedigree documentation.{' '}
          <strong>AyuCase does NOT infer genetic risks</strong>, calculate hereditary probabilities,
          or predict disease inheritance.
        </span>
      </div>

      {/* Tree Canvas & Member Detail Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* SVG Family Tree Canvas (8 cols) — Visually matching Case Constellation */}
        <div className="lg:col-span-8 bg-slate-950 rounded-2xl p-2 sm:p-4 border border-slate-800/90 shadow-2xl relative select-none overflow-hidden">
          {/* Constellation Starfield Backdrop */}
          <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:20px_20px] opacity-40 pointer-events-none" />

          {/* SVG Canvas */}
          <svg viewBox="0 0 800 520" className="w-full h-auto max-h-[520px] select-none touch-none">
            <defs>
              {/* Radial gradient for Center Patient Node */}
              <radialGradient id="patientTreeGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="70%" stopColor="#047857" />
                <stop offset="100%" stopColor="#064e3b" />
              </radialGradient>

              {/* Radial gradient for Migraine-positive relatives */}
              <radialGradient id="migraineNodeGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#f43f5e" />
                <stop offset="70%" stopColor="#be123c" />
                <stop offset="100%" stopColor="#881337" />
              </radialGradient>

              {/* Radial gradient for General relatives */}
              <radialGradient id="generalNodeGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#1e293b" />
                <stop offset="100%" stopColor="#0f172a" />
              </radialGradient>

              {/* Glow filter */}
              <filter id="treeGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Generational guide level lines */}
            <g className="guides-layer opacity-20 pointer-events-none">
              <line x1="40" y1="80" x2="760" y2="80" stroke="#475569" strokeDasharray="3 6" />
              <line x1="40" y1="240" x2="760" y2="240" stroke="#475569" strokeDasharray="3 6" />
              <line x1="40" y1="410" x2="760" y2="410" stroke="#475569" strokeDasharray="3 6" />
            </g>

            {/* Generation Tier Labels */}
            <text x="50" y="70" fill="#64748b" fontSize="10" fontWeight="bold" letterSpacing="0.08em">
              GRANDPARENTS
            </text>
            <text x="50" y="230" fill="#64748b" fontSize="10" fontWeight="bold" letterSpacing="0.08em">
              PARENTS
            </text>
            <text x="50" y="400" fill="#64748b" fontSize="10" fontWeight="bold" letterSpacing="0.08em">
              PATIENT & SIBLINGS
            </text>

            {/* Glowing Pedigree Link Lines */}
            <g className="links-layer">
              {pedigreeLinks.map((link, index) => {
                const sPos = nodeLayout[link.sourceId]
                const tPos = nodeLayout[link.targetId]
                if (!sPos || !tPos) return null

                const isConnectedToSelected =
                  selectedMemberId === link.sourceId || selectedMemberId === link.targetId
                const isHovered =
                  hoveredMemberId === link.sourceId || hoveredMemberId === link.targetId

                // Calculate bezier curve between vertical generations
                const midY = (sPos.y + tPos.y) / 2
                const d = `M ${sPos.x} ${sPos.y} C ${sPos.x} ${midY}, ${tPos.x} ${midY}, ${tPos.x} ${tPos.y}`

                return (
                  <path
                    key={`link-${index}`}
                    d={d}
                    fill="none"
                    stroke={
                      isConnectedToSelected
                        ? '#10b981'
                        : isHovered
                        ? '#38bdf8'
                        : link.isMaternal
                        ? '#f43f5e'
                        : '#334155'
                    }
                    strokeWidth={isConnectedToSelected ? 2.5 : isHovered ? 2 : 1.2}
                    strokeDasharray={isConnectedToSelected ? '5 5' : undefined}
                    className={cn(
                      'transition-all duration-300',
                      isConnectedToSelected && 'animate-dash'
                    )}
                    opacity={isConnectedToSelected ? 1 : isHovered ? 0.9 : 0.4}
                  />
                )
              })}
            </g>

            {/* Family Member Nodes */}
            <g className="nodes-layer">
              {members.map((member) => {
                const pos = nodeLayout[member.id]
                if (!pos) return null

                const isSelected = selectedMemberId === member.id
                const isHovered = hoveredMemberId === member.id
                const hasMigraine = member.hasMigraineHistory && highlightMigraines

                return (
                  <g
                    key={member.id}
                    className="cursor-pointer group"
                    onClick={() => setSelectedMemberId(member.id)}
                    onMouseEnter={() => setHoveredMemberId(member.id)}
                    onMouseLeave={() => setHoveredMemberId(null)}
                  >
                    {/* Glowing outer halo if active or hovered */}
                    {(isSelected || isHovered) && (
                      <circle
                        cx={pos.x}
                        cy={pos.y}
                        r={pos.r + 9}
                        fill="none"
                        stroke={member.isPatient ? '#34d399' : hasMigraine ? '#f43f5e' : '#38bdf8'}
                        strokeWidth="2"
                        className="animate-pulse opacity-75"
                      />
                    )}

                    {/* Patient outer dashed spinning orbit ring */}
                    {member.isPatient && (
                      <circle
                        cx={pos.x}
                        cy={pos.y}
                        r={pos.r + 14}
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="1.5"
                        strokeDasharray="4 4"
                        className="animate-spin-slow opacity-60"
                      />
                    )}

                    {/* Node Core Circle */}
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r={pos.r}
                      fill={
                        member.isPatient
                          ? 'url(#patientTreeGrad)'
                          : hasMigraine
                          ? 'url(#migraineNodeGrad)'
                          : 'url(#generalNodeGrad)'
                      }
                      stroke={
                        isSelected
                          ? '#ffffff'
                          : hasMigraine
                          ? '#fb7185'
                          : member.isPatient
                          ? '#6ee7b7'
                          : '#475569'
                      }
                      strokeWidth={isSelected ? 3 : 1.5}
                      filter={member.isPatient ? 'url(#treeGlow)' : undefined}
                      className="transition-all duration-200 group-hover:stroke-white"
                    />

                    {/* Migraine Indicator Dot on top of node */}
                    {hasMigraine && !member.isPatient && (
                      <circle cx={pos.x} cy={pos.y - pos.r + 4} r={3} fill="#f43f5e" />
                    )}

                    {/* Node Text: Name */}
                    <text
                      x={pos.x}
                      y={pos.y - (member.isPatient ? 4 : 2)}
                      textAnchor="middle"
                      fill="#ffffff"
                      fontSize={member.isPatient ? '11' : '9.5'}
                      fontWeight="bold"
                      className="pointer-events-none select-none tracking-tight"
                    >
                      {member.name.split(' ')[0]}
                    </text>

                    {/* Node Text: Relation */}
                    <text
                      x={pos.x}
                      y={pos.y + (member.isPatient ? 10 : 9)}
                      textAnchor="middle"
                      fill={member.isPatient ? '#a7f3d0' : '#94a3b8'}
                      fontSize={member.isPatient ? '8.5' : '7.5'}
                      fontWeight="600"
                      className="pointer-events-none select-none"
                    >
                      {member.isPatient ? 'PATIENT' : member.relation}
                    </text>
                  </g>
                )
              })}
            </g>
          </svg>

          {/* Quick HUD legend badge */}
          <div className="absolute bottom-3 left-3 px-3 py-1.5 rounded-full bg-slate-900/90 border border-slate-700 text-[10px] text-slate-300 font-mono flex items-center gap-3">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Patient</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              <span>Migraine History</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-slate-400" />
              <span>General Relative</span>
            </span>
          </div>
        </div>

        {/* Side Information Panel (4 cols) — Glass Information Card */}
        <div className="lg:col-span-4 space-y-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedMember.id}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.2 }}
            >
              <FamilyMemberDetailCard
                member={selectedMember}
                onEdit={(m) => {
                  setEditingMember(m)
                  setIsModalOpen(true)
                }}
                onRemove={handleRemoveMember}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Add / Edit Family Member Modal */}
      <FamilyMemberModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingMember(null)
        }}
        onSave={handleSaveMember}
        initialMember={editingMember}
      />
    </GlassCard>
  )
}
