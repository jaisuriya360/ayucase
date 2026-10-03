import React from 'react'
import { AlertCircle } from 'lucide-react'
import { cn } from '../../utils/cn'

export interface AyuInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  helperText?: string
  error?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  containerClassName?: string
}

export const AyuInput = React.forwardRef<HTMLInputElement, AyuInputProps>(
  ({ label, helperText, error, leftIcon, rightIcon, id, className, containerClassName, disabled, required, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined)

    return (
      <div className={cn('w-full flex flex-col gap-1.5', containerClassName)}>
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center justify-between"
          >
            <span>
              {label}
              {required && <span className="text-rose-500 ml-1" aria-hidden="true">*</span>}
            </span>
          </label>
        )}

        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3.5 text-slate-400 dark:text-slate-500 pointer-events-none flex items-center justify-center">
              {leftIcon}
            </div>
          )}

          <input
            id={inputId}
            ref={ref}
            disabled={disabled}
            required={required}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-desc` : undefined}
            className={cn(
              'w-full h-10 px-3.5 text-sm text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-900/90',
              'border rounded-xl transition-colors duration-150 placeholder:text-slate-400 dark:placeholder:text-slate-500',
              'focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 dark:focus:border-teal-500',
              'disabled:bg-slate-50 disabled:dark:bg-slate-950 disabled:opacity-60 disabled:cursor-not-allowed',
              error
                ? 'border-rose-400 dark:border-rose-600 focus:border-rose-500 focus:ring-rose-500/20'
                : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700',
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              className
            )}
            {...props}
          />

          {rightIcon && (
            <div className="absolute right-3.5 text-slate-400 dark:text-slate-500 flex items-center justify-center">
              {rightIcon}
            </div>
          )}
        </div>

        {error && (
          <div id={`${inputId}-error`} className="flex items-center gap-1.5 text-xs text-rose-600 dark:text-rose-400 mt-0.5">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {!error && helperText && (
          <p id={`${inputId}-desc`} className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {helperText}
          </p>
        )}
      </div>
    )
  }
)
AyuInput.displayName = 'AyuInput'

export interface AyuTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  helperText?: string
  error?: string
  containerClassName?: string
}

export const AyuTextarea = React.forwardRef<HTMLTextAreaElement, AyuTextareaProps>(
  ({ label, helperText, error, id, className, containerClassName, disabled, required, ...props }, ref) => {
    const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined)

    return (
      <div className={cn('w-full flex flex-col gap-1.5', containerClassName)}>
        {label && (
          <label
            htmlFor={textareaId}
            className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center justify-between"
          >
            <span>
              {label}
              {required && <span className="text-rose-500 ml-1" aria-hidden="true">*</span>}
            </span>
          </label>
        )}

        <textarea
          id={textareaId}
          ref={ref}
          disabled={disabled}
          required={required}
          aria-invalid={!!error}
          aria-describedby={error ? `${textareaId}-error` : helperText ? `${textareaId}-desc` : undefined}
          className={cn(
            'w-full min-h-[90px] p-3 text-sm text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-900/90',
            'border rounded-xl transition-colors duration-150 placeholder:text-slate-400 dark:placeholder:text-slate-500',
            'focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 dark:focus:border-teal-500',
            'disabled:bg-slate-50 disabled:dark:bg-slate-950 disabled:opacity-60 disabled:cursor-not-allowed',
            error
              ? 'border-rose-400 dark:border-rose-600 focus:border-rose-500 focus:ring-rose-500/20'
              : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700',
            className
          )}
          {...props}
        />

        {error && (
          <div id={`${textareaId}-error`} className="flex items-center gap-1.5 text-xs text-rose-600 dark:text-rose-400 mt-0.5">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {!error && helperText && (
          <p id={`${textareaId}-desc`} className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {helperText}
          </p>
        )}
      </div>
    )
  }
)
AyuTextarea.displayName = 'AyuTextarea'

export interface AyuSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  helperText?: string
  error?: string
  options?: { value: string; label: string }[]
  containerClassName?: string
}

export const AyuSelect = React.forwardRef<HTMLSelectElement, AyuSelectProps>(
  ({ label, helperText, error, options, children, id, className, containerClassName, disabled, required, ...props }, ref) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined)

    return (
      <div className={cn('w-full flex flex-col gap-1.5', containerClassName)}>
        {label && (
          <label
            htmlFor={selectId}
            className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center justify-between"
          >
            <span>
              {label}
              {required && <span className="text-rose-500 ml-1" aria-hidden="true">*</span>}
            </span>
          </label>
        )}

        <select
          id={selectId}
          ref={ref}
          disabled={disabled}
          required={required}
          aria-invalid={!!error}
          aria-describedby={error ? `${selectId}-error` : helperText ? `${selectId}-desc` : undefined}
          className={cn(
            'w-full h-10 px-3 text-sm text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-900/90',
            'border rounded-xl transition-colors duration-150',
            'focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 dark:focus:border-teal-500',
            'disabled:bg-slate-50 disabled:dark:bg-slate-950 disabled:opacity-60 disabled:cursor-not-allowed',
            error
              ? 'border-rose-400 dark:border-rose-600'
              : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700',
            className
          )}
          {...props}
        >
          {options
            ? options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))
            : children}
        </select>

        {error && (
          <div id={`${selectId}-error`} className="flex items-center gap-1.5 text-xs text-rose-600 dark:text-rose-400 mt-0.5">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {!error && helperText && (
          <p id={`${selectId}-desc`} className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {helperText}
          </p>
        )}
      </div>
    )
  }
)
AyuSelect.displayName = 'AyuSelect'
