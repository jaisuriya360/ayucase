import React from 'react'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { cn } from '../../utils/cn'
import { useAccessibility } from '../../contexts/AccessibilityContext'

export interface AyuButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive' | 'danger' | 'elder'
  size?: 'sm' | 'md' | 'lg' | 'elder'
  isLoading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  children: React.ReactNode
  className?: string
  to?: string
}

export const AyuButton: React.FC<AyuButtonProps> = ({
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
    // Context fallback
  }

  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return cn(
          'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-medium',
          'shadow-sm shadow-emerald-700/15 border border-emerald-500/30',
          'dark:from-emerald-600 dark:to-teal-600 dark:hover:from-emerald-500 dark:hover:to-teal-500 dark:shadow-emerald-950/40 dark:border-emerald-500/20'
        )
      case 'secondary':
        return cn(
          'bg-white hover:bg-slate-50 text-slate-800 font-medium',
          'border border-slate-200 shadow-xs hover:border-slate-300',
          'dark:bg-slate-900 dark:hover:bg-slate-800/80 dark:text-slate-100 dark:border-slate-800 dark:hover:border-slate-700'
        )
      case 'ghost':
        return cn(
          'bg-transparent hover:bg-slate-100 text-slate-700 hover:text-slate-900 font-medium',
          'dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white'
        )
      case 'destructive':
      case 'danger':
        return cn(
          'bg-rose-600 hover:bg-rose-500 text-white font-medium',
          'shadow-sm shadow-rose-700/15 border border-rose-500/30',
          'dark:bg-rose-600 dark:hover:bg-rose-500'
        )
      case 'elder':
        return cn(
          'bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold',
          'border-2 border-slate-950 shadow-[0_4px_0_0_#0f172a] active:shadow-none active:translate-y-1'
        )
      default:
        return 'bg-emerald-600 hover:bg-emerald-500 text-white font-medium'
    }
  }

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'h-8 px-3 text-xs gap-1.5 rounded-lg'
      case 'lg':
        return 'h-11 px-5 text-base gap-2.5 rounded-xl'
      case 'elder':
        return 'min-h-[58px] px-8 text-xl font-bold gap-3 rounded-2xl tracking-wide'
      case 'md':
      default:
        return 'h-9.5 px-4 text-sm gap-2 rounded-xl'
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
      whileHover={disabled || isLoading || reduceMotion ? undefined : { scale: 1.01 }}
      whileTap={disabled || isLoading || reduceMotion ? undefined : { scale: 0.98 }}
      disabled={disabled || isLoading}
      onClick={handleClick}
      className={cn(
        'inline-flex items-center justify-center shrink-0 cursor-pointer select-none font-sans transition-all duration-150',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
        getVariantClasses(),
        getSizeClasses(),
        className
      )}
      {...(props as any)}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin text-current shrink-0" />
      ) : (
        leftIcon && <span className="inline-flex shrink-0 items-center">{leftIcon}</span>
      )}
      <span className="truncate">{children}</span>
      {!isLoading && rightIcon && <span className="inline-flex shrink-0 items-center">{rightIcon}</span>}
    </motion.button>
  )
}

// Compatibility export
export { AyuButton as AnimatedButton }
