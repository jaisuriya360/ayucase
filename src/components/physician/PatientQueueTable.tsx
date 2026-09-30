import React, { useState, useMemo, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Search,
  Filter,
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Sparkles,
  FileQuestion,
  User,
  ShieldCheck,
  ChevronRight,
  Activity,
  Calendar,
  X,
} from 'lucide-react'
import { GlassCard } from '../ui/GlassCard'
import { AnimatedButton } from '../ui/AnimatedButton'
import { EmptyState } from '../ui/EmptyState'
import { useDebounce } from '../../hooks/useDebounce'
import type {
  ClinicalCase,
  QueueFilterStatus,
  InformationStatus,
} from '../../types/clinicalCase'
import { formatDate } from '../../utils/formatters'
import { cn } from '../../utils/cn'

interface PatientQueueTableProps {
  cases: ClinicalCase[]
  activeFilter?: QueueFilterStatus
  onFilterChange?: (filter: QueueFilterStatus) => void
  onSelectCase?: (caseNumber: string) => void
  showTitle?: boolean
}

export const PatientQueueTable: React.FC<PatientQueueTableProps> = ({
  cases,
  activeFilter = 'All',
  onFilterChange,
  onSelectCase,
  showTitle = true,
}) => {
  const navigate = useNavigate()
  const searchInputRef = useRef<HTMLInputElement>(null)
  const [internalFilter, setInternalFilter] = useState<QueueFilterStatus>(activeFilter)
  const [searchQuery, setSearchQuery] = useState('')
  const debouncedSearch = useDebounce(searchQuery, 120)

  // Keyboard shortcut listener (/ to focus search, Esc to clear)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement !== searchInputRef.current && (e.target as HTMLElement).tagName !== 'INPUT' && (e.target as HTMLElement).tagName !== 'TEXTAREA') {
        e.preventDefault()
        searchInputRef.current?.focus()
      } else if (e.key === 'Escape' && document.activeElement === searchInputRef.current) {
        setSearchQuery('')
        searchInputRef.current?.blur()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Sync external filter if controlled
  const currentFilter = onFilterChange ? activeFilter : internalFilter

  const handleFilterClick = (filter: QueueFilterStatus) => {
    if (onFilterChange) {
      onFilterChange(filter)
    } else {
      setInternalFilter(filter)
    }
  }

  // Filter & Search logic
  const filteredCases = useMemo(() => {
    return cases.filter((c) => {
      // 1. Filter match
      const matchesFilter =
        currentFilter === 'All' || c.queueStatus === currentFilter

      // 2. Search match
      const q = debouncedSearch.toLowerCase().trim()
      const matchesSearch =
        !q ||
        c.patientName.toLowerCase().includes(q) ||
        c.fictionalCaseNumber.toLowerCase().includes(q) ||
        c.patientId.toLowerCase().includes(q) ||
        c.primaryCondition.toLowerCase().includes(q) ||
        c.chiefComplaint.toLowerCase().includes(q) ||
        c.informationStatus.toLowerCase().includes(q)

      return matchesFilter && matchesSearch
    })
  }, [cases, currentFilter, debouncedSearch])

  const handleAction = (c: ClinicalCase) => {
    if (onSelectCase) {
      onSelectCase(c.fictionalCaseNumber)
    } else {
      navigate(`/physician/case/${c.fictionalCaseNumber}`)
    }
  }

  // Status Badge Helper
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Priority Review':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
            Priority Review
          </span>
        )
      case 'New':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
            <Sparkles className="w-3 h-3" />
            New Intake
          </span>
        )
      case 'Pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
            <Clock className="w-3 h-3" />
            Pending Review
          </span>
        )
      case 'Completed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-3 h-3" />
            Completed
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
            {status}
          </span>
        )
    }
  }

  // Information Status Badge Helper
  const getInfoStatusBadge = (infoStatus: InformationStatus) => {
    switch (infoStatus) {
      case 'Differences Detected':
        return (
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span>Differences Detected</span>
          </div>
        )
      case 'Verified':
        return (
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            <span>Verified Complete</span>
          </div>
        )
      case 'Gaps Identified':
        return (
          <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400">
            <FileQuestion className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
            <span>Gaps Identified</span>
          </div>
        )
      case 'Ready for Physician':
        return (
          <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-600 dark:text-cyan-400">
            <Activity className="w-3.5 h-3.5 text-cyan-500 shrink-0" />
            <span>Ready for Review</span>
          </div>
        )
      case 'Pending Records':
        return (
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400">
            <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>Pending Records</span>
          </div>
        )
      default:
        return <span className="text-xs text-slate-400">{infoStatus}</span>
    }
  }

  const filterTabs: QueueFilterStatus[] = [
    'All',
    'New',
    'Pending',
    'Priority Review',
    'Completed',
  ]

  return (
    <div className="space-y-4">
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {showTitle && (
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Activity className="w-5 h-5 text-cyan-500" />
              <span>Patient Queue</span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
                {filteredCases.length} Cases
              </span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Live multi-parameter patient intake, completeness synthesis, and clinical prioritization
            </p>
          </div>
        )}

        {/* Search Bar with Keyboard Shortcut */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search patient, ID, condition, or status..."
            className="w-full pl-9 pr-14 py-2 rounded-xl text-xs sm:text-sm border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
          />
          {searchQuery ? (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('')
                searchInputRef.current?.focus()
              }}
              className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 absolute right-2.5 top-1/2 -translate-y-1/2"
              title="Clear search"
              aria-label="Clear search query"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : (
            <span className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 rounded border border-slate-200/80 dark:border-slate-700/80 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none select-none">
              /
            </span>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {filterTabs.map((tab) => {
          const isSelected = currentFilter === tab
          const count =
            tab === 'All'
              ? cases.length
              : cases.filter((c) => c.queueStatus === tab).length

          return (
            <button
              key={tab}
              type="button"
              onClick={() => handleFilterClick(tab)}
              className={cn(
                'px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 border cursor-pointer',
                isSelected
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-slate-900 dark:border-white shadow-sm'
                  : 'bg-white/60 dark:bg-slate-900/60 border-slate-200/80 dark:border-slate-800/80 text-slate-600 dark:text-slate-400 hover:border-cyan-500/40'
              )}
            >
              <span>{tab}</span>
              <span
                className={cn(
                  'px-1.5 py-0.2 rounded-md text-[10px] font-bold',
                  isSelected
                    ? 'bg-white/20 text-white dark:bg-slate-900/20 dark:text-slate-900'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                )}
              >
                {count}
              </span>
            </button>
          )
        })}
      </div>

      {/* Desktop & Tablet Table View (hidden on mobile) */}
      <GlassCard variant="default" className="hidden md:block p-0 overflow-hidden border border-slate-200 dark:border-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                <th className="py-3.5 px-4">Patient</th>
                <th className="py-3.5 px-3">Age</th>
                <th className="py-3.5 px-3">Status</th>
                <th className="py-3.5 px-3">Completeness</th>
                <th className="py-3.5 px-3">Information Status</th>
                <th className="py-3.5 px-3">Last Updated</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/70 dark:divide-slate-800/70 text-xs sm:text-sm">
              {filteredCases.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 px-4">
                    <EmptyState
                      icon={<Filter className="w-8 h-8 text-cyan-500" />}
                      title="No Matching Patients"
                      description={`No active clinical cases match "${debouncedSearch || currentFilter}".`}
                      actionLabel="Reset Filters & Search"
                      onAction={() => {
                        handleFilterClick('All')
                        setSearchQuery('')
                      }}
                      className="max-w-md mx-auto py-8"
                    />
                  </td>
                </tr>
              ) : (
                filteredCases.map((c) => {
                  return (
                    <tr
                      key={c.id}
                      onClick={() => handleAction(c)}
                      className="hover:bg-cyan-500/5 transition-colors cursor-pointer group"
                    >
                      {/* 1. Patient */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={cn(
                              'w-9 h-9 rounded-xl flex items-center justify-center text-white font-black text-sm shrink-0 shadow-sm',
                              c.avatarColor
                            )}
                          >
                            {c.patientName.charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="font-bold text-slate-900 dark:text-slate-100 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                                {c.patientName}
                              </span>
                              <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                                {c.fictionalCaseNumber}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-[200px] sm:max-w-xs">
                              {c.primaryCondition}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* 2. Age */}
                      <td className="py-3.5 px-3 text-slate-600 dark:text-slate-300 font-medium whitespace-nowrap">
                        {c.patientAge}y • {c.patientGender.charAt(0)}
                      </td>

                      {/* 3. Status */}
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        {getStatusBadge(c.queueStatus)}
                      </td>

                      {/* 4. Completeness */}
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        <div className="w-28 space-y-1">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="font-bold text-slate-900 dark:text-slate-100">
                              {c.completeness}%
                            </span>
                            <span className="text-[10px] text-slate-400">
                              {c.completeness >= 90 ? 'Synthesized' : 'Partial'}
                            </span>
                          </div>
                          <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                            <div
                              className={cn(
                                'h-full rounded-full transition-all duration-500',
                                c.completeness >= 90
                                  ? 'bg-emerald-500'
                                  : c.completeness >= 70
                                  ? 'bg-cyan-500'
                                  : 'bg-amber-500'
                              )}
                              style={{ width: `${c.completeness}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* 5. Information Status */}
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        {getInfoStatusBadge(c.informationStatus)}
                      </td>

                      {/* 6. Last Updated */}
                      <td className="py-3.5 px-3 text-slate-500 dark:text-slate-400 text-xs whitespace-nowrap">
                        {formatDate(c.lastUpdated)}
                      </td>

                      {/* 7. Action */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleAction(c)
                          }}
                          className="px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500 text-cyan-600 dark:text-cyan-400 hover:text-white border border-cyan-500/20 font-bold text-xs inline-flex items-center gap-1.5 transition-all shadow-sm"
                        >
                          <span>Review</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* Mobile Responsive Cards View (rendered on < md screens instead of shrinking table) */}
      <div className="md:hidden space-y-3">
        {filteredCases.length === 0 ? (
          <EmptyState
            icon={<Filter className="w-8 h-8 text-cyan-500" />}
            title="No Matching Patients"
            description={`No clinical cases match "${debouncedSearch || currentFilter}".`}
            actionLabel="Reset Filters & Search"
            onAction={() => {
              handleFilterClick('All')
              setSearchQuery('')
            }}
            className="py-8"
          />
        ) : (
          filteredCases.map((c) => (
            <GlassCard
              key={`mobile-card-${c.id}`}
              variant="interactive"
              onClick={() => handleAction(c)}
              className="p-4 space-y-3 border border-slate-200/90 dark:border-slate-800 shadow-sm"
            >
              {/* Top Row: Avatar, Name, Age, Status */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      'w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-sm shrink-0 shadow-sm',
                      c.avatarColor
                    )}
                  >
                    {c.patientName.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                        {c.patientName}
                      </span>
                      <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                        {c.fictionalCaseNumber}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-2">
                      <span>{c.patientAge} yrs • {c.patientGender}</span>
                    </div>
                  </div>
                </div>

                <div className="shrink-0">
                  {getStatusBadge(c.queueStatus)}
                </div>
              </div>

              {/* Primary Condition */}
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800/80 text-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                  Clinical Concern
                </span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {c.primaryCondition}
                </span>
              </div>

              {/* Status & Completeness Grid */}
              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-100 dark:border-slate-800">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Information Status
                  </span>
                  {getInfoStatusBadge(c.informationStatus)}
                </div>

                <div>
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Completeness
                    </span>
                    <span className="font-bold text-slate-900 dark:text-slate-100">
                      {c.completeness}%
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className={cn(
                        'h-full rounded-full transition-all duration-500',
                        c.completeness >= 90
                          ? 'bg-emerald-500'
                          : c.completeness >= 70
                          ? 'bg-cyan-500'
                          : 'bg-amber-500'
                      )}
                      style={{ width: `${c.completeness}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Card Footer: Last Updated & Action Button */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                <span className="text-slate-400 text-[11px] flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatDate(c.lastUpdated)}
                </span>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleAction(c)
                  }}
                  className="px-3.5 py-2 min-h-[44px] rounded-xl bg-cyan-500 text-white font-bold text-xs inline-flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
                  aria-label={`Open case review for ${c.patientName}`}
                >
                  <span>Review Case</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </GlassCard>
          ))
        )}
      </div>
    </div>
  )
}
