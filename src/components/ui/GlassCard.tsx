import React from 'react'
import { motion, type HTMLMotionProps } from 'framer-motion'
import { cn } from '../../utils/cn'

export interface GlassCardProps extends HTMLMotionProps<'div'> {
  variant?: 'default' | 'solid' | 'glass' | 'elevated' | 'interactive' | 'accent' | 'elder'
  glow?: 'none' | 'emerald' | 'indigo' | 'cyan' | 'teal'
  children: React.ReactNode
  className?: string
}

export const GlassCard: React.FC<GlassCardProps> = ({
  variant = 'default',
  glow = 'none',
  children,
  className,
  ...props
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'glass':
        return 'ayu-card-glass'
      case 'elevated':
        return 'ayu-card-elevated'
      case 'interactive':
        return 'ayu-card-solid glass-reflection ayu-card-interactive-sheen hover:border-emerald-500/50 dark:hover:border-cyan-500/50 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] transition-all duration-200 cursor-pointer'
      case 'accent':
        return 'ayu-card-solid border-l-4 border-l-emerald-600 dark:border-l-cyan-500'
      case 'elder':
        return 'bg-white dark:bg-slate-900 border-2 border-slate-900 dark:border-slate-300 shadow-md'
      case 'solid':
      case 'default':
      default:
        return 'ayu-card-solid'
    }
  }

  const getGlowStyles = () => {
    switch (glow) {
      case 'emerald':
        return 'glow-controlled-emerald'
      case 'teal':
        return 'glow-controlled-teal'
      case 'cyan':
        return 'glow-controlled-cyan'
      case 'indigo':
        return 'glow-indigo'
      default:
        return ''
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25 }}
      className={cn(
        'rounded-2xl p-5 sm:p-6 relative overflow-hidden',
        getVariantStyles(),
        getGlowStyles(),
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  )
}

