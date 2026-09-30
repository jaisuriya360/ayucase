import React from 'react'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { cn } from '../../utils/cn'
import { useAccessibility } from '../../contexts/AccessibilityContext'

export interface AnimatedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'glass' | 'elder'
  size?: 'sm' | 'md' | 'lg' | 'elder'
  isLoading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  children: React.ReactNode
  className?: string
  to?: string
}

export const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  children,
  className,
  disabled,
  to,
  type = 'button',
  ...props
}) => {
  const navigate = useNavigate()
  let reduceMotion = false
  try {
    const a11y = useAccessibility()
    reduceMotion = a11y.settings.reduceMotion
  } catch {
    // fallback if outside context
  }
  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-sm shadow-emerald-600/20 border border-emerald-500/30 dark:from-teal-600 dark:to-cyan-600 dark:hover:from-teal-500 dark:hover:to-cyan-500 dark:shadow-cyan-600/20 dark:border-cyan-500/30'
      case 'secondary':
        return 'bg-white hover:bg-slate-50 text-slate-800 border border-slate-200/90 shadow-sm dark:bg-[#0d1730] dark:hover:bg-[#121f42] dark:text-slate-100 dark:border-slate-700/80'
      case 'ghost':
        return 'bg-transparent hover:bg-slate-100/80 text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800/60 dark:hover:text-white'
      case 'danger':
        return 'bg-rose-600 hover:bg-rose-500 text-white shadow-sm shadow-rose-500/20 border border-rose-500/30'
      case 'glass':
        return 'bg-white/80 hover:bg-white text-slate-900 border border-slate-200/90 backdrop-blur-md shadow-sm dark:bg-[#0c152e]/80 dark:hover:bg-[#0c152e] dark:text-slate-100 dark:border-cyan-500/20'
      case 'elder':
        return 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold border-2 border-slate-950 shadow-[0_4px_0_0_#0f172a] active:shadow-none active:translate-y-1'
      default:
        return 'bg-emerald-600 hover:bg-emerald-500 text-white'
    }
  }

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-3 py-1.5 text-xs font-semibold rounded-lg'
      case 'md':
        return 'px-4 py-2 text-sm font-semibold rounded-xl'
      case 'lg':
        return 'px-6 py-2.5 text-base font-semibold rounded-xl'
      case 'elder':
        return 'px-8 py-4 text-xl font-bold rounded-2xl min-h-[58px] tracking-wide'
      default:
        return 'px-4 py-2 text-sm font-semibold rounded-xl'
    }
  }

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || isLoading) {
      e.preventDefault()
      return
    }
    if (to) {
      navigate(to)
    }
    if (props.onClick) {
      props.onClick(e)
    }
  }

  return (
    <motion.button
      type={type}
      whileHover={disabled || isLoading || reduceMotion ? undefined : { scale: 1.02 }}
      whileTap={disabled || isLoading || reduceMotion ? undefined : { scale: 0.98 }}
      disabled={disabled || isLoading}
      onClick={handleClick}
      className={cn(
        'inline-flex items-center justify-center gap-2.5 transition-colors cursor-pointer select-none font-sans btn-tactile',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
        getVariantClasses(),
        getSizeClasses(),
        className
      )}
      {...(props as any)}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin text-current" />
      ) : (
        leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>
      )}
      <span>{children}</span>
      {!isLoading && rightIcon && <span className="inline-flex shrink-0">{rightIcon}</span>}
    </motion.button>
  )
}
