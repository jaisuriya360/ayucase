import React from 'react'
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  AlertCircle,
  Activity,
  HelpCircle,
  FileCheck2,
  MinusCircle,
} from 'lucide-react'
import { cn } from '../../utils/cn'

export type AyuStatusType =
  | 'success'
  | 'healthy'
  | 'active'
  | 'in_progress'
  | 'pending'
  | 'attention'
  | 'warning'
  | 'error'
  | 'unavailable'
  | 'reviewed'

interface AyuStatusConfig {
  label: string
  icon: React.ComponentType<{ className?: string }>
  badgeVariant: 'emerald' | 'teal' | 'cyan' | 'amber' | 'rose' | 'slate' | 'indigo'
  textColor: string
  dotColor: string
}

const STATUS_CONFIGS: Record<AyuStatusType, AyuStatusConfig> = {
  success: {
    label: 'Completed',
    icon: CheckCircle2,
    badgeVariant: 'emerald',
    textColor: 'text-emerald-700 dark:text-emerald-400',
    dotColor: 'bg-emerald-500',
  },
  healthy: {
    label: 'Healthy / Normal',
    icon: CheckCircle2,
    badgeVariant: 'emerald',
    textColor: 'text-emerald-700 dark:text-emerald-400',
    dotColor: 'bg-emerald-500',
  },
  active: {
    label: 'Active',
    icon: Activity,
    badgeVariant: 'teal',
    textColor: 'text-teal-700 dark:text-teal-400',
    dotColor: 'bg-teal-500',
  },
  in_progress: {
    label: 'In Progress',
    icon: Clock,
    badgeVariant: 'cyan',
    textColor: 'text-cyan-700 dark:text-cyan-400',
    dotColor: 'bg-cyan-500',
  },
  pending: {
    label: 'Pending Action',
    icon: Clock,
    badgeVariant: 'amber',
    textColor: 'text-amber-700 dark:text-amber-400',
    dotColor: 'bg-amber-500',
  },
  attention: {
    label: 'Attention Needed',
    icon: AlertTriangle,
    badgeVariant: 'amber',
    textColor: 'text-amber-700 dark:text-amber-400',
    dotColor: 'bg-amber-500',
  },
  warning: {
    label: 'Clinical Warning',
    icon: AlertTriangle,
    badgeVariant: 'rose',
    textColor: 'text-rose-700 dark:text-rose-400',
    dotColor: 'bg-rose-500',
  },
  error: {
    label: 'Action Required',
    icon: AlertCircle,
    badgeVariant: 'rose',
    textColor: 'text-rose-700 dark:text-rose-400',
    dotColor: 'bg-rose-500',
  },
  unavailable: {
    label: 'Not Recorded',
    icon: HelpCircle,
    badgeVariant: 'slate',
    textColor: 'text-slate-600 dark:text-slate-400',
    dotColor: 'bg-slate-400',
  },
  reviewed: {
    label: 'Clinically Reviewed',
    icon: FileCheck2,
    badgeVariant: 'indigo',
    textColor: 'text-indigo-700 dark:text-indigo-400',
    dotColor: 'bg-indigo-500',
  },
}

export interface AyuStatusProps {
  status: AyuStatusType
  label?: string
  size?: 'sm' | 'md'
  showIcon?: boolean
  className?: string
}

export const AyuStatus: React.FC<AyuStatusProps> = ({
  status,
  label,
  size = 'md',
  showIcon = true,
  className,
}) => {
  const config = STATUS_CONFIGS[status] || STATUS_CONFIGS.pending
  const displayLabel = label || config.label
  const Icon = config.icon

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 font-medium select-none shrink-0',
        size === 'sm' ? 'text-xs' : 'text-sm',
        config.textColor,
        className
      )}
      role="status"
      aria-label={`Status: ${displayLabel}`}
    >
      {showIcon && <Icon className={cn('shrink-0', size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4')} />}
      <span className="truncate">{displayLabel}</span>
    </span>
  )
}
