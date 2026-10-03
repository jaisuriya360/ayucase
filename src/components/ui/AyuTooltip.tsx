import React, { useState } from 'react'
import { cn } from '../../utils/cn'

export interface AyuTooltipProps {
  content: React.ReactNode
  children: React.ReactNode
  position?: 'top' | 'bottom' | 'left' | 'right'
  className?: string
}

export const AyuTooltip: React.FC<AyuTooltipProps> = ({
  content,
  children,
  position = 'top',
  className,
}) => {
  const [isVisible, setIsVisible] = useState(false)

  const getPositionStyles = () => {
    switch (position) {
      case 'bottom':
        return 'top-full left-1/2 -translate-x-1/2 mt-2'
      case 'left':
        return 'right-full top-1/2 -translate-y-1/2 mr-2'
      case 'right':
        return 'left-full top-1/2 -translate-y-1/2 ml-2'
      case 'top':
      default:
        return 'bottom-full left-1/2 -translate-x-1/2 mb-2'
    }
  }

  return (
    <div
      className="relative inline-flex items-center"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
    >
      {children}
      {isVisible && content && (
        <div
          role="tooltip"
          className={cn(
            'absolute z-50 px-2.5 py-1 text-xs font-medium text-white bg-slate-900 dark:bg-slate-800 rounded-md shadow-md pointer-events-none whitespace-nowrap transition-opacity',
            getPositionStyles(),
            className
          )}
        >
          {content}
        </div>
      )}
    </div>
  )
}
