import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Dna, Sparkles, CheckCircle2, ShieldCheck, Layers, Info } from 'lucide-react'
import { CASE_DNA_METRICS, type CaseDNAMetric } from '../../types/intelligence'
import { GlassCard } from '../ui/GlassCard'
import { cn } from '../../utils/cn'

export interface CaseDNAFingerprintProps {
  className?: string
  metrics?: CaseDNAMetric[]
}

export const CaseDNAFingerprint: React.FC<CaseDNAFingerprintProps> = ({
  className,
  metrics = CASE_DNA_METRICS,
}) => {
  const [activeMetricId, setActiveMetricId] = useState<string>(metrics[0].id)
  const activeMetric = metrics.find((m) => m.id === activeMetricId) || metrics[0]

  const averageDensity = Math.round(
    metrics.reduce((acc, m) => acc + m.densityScore, 0) / metrics.length
  )

  return (
    <GlassCard variant="elevated" className={cn('p-5 sm:p-7 space-y-6', className)}>
      {/* Header with Mandatory Label: "Visual Case Profile" */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Dna className="w-5 h-5 text-emerald-500 animate-pulse" />
            <h3 className="font-black text-lg sm:text-xl text-slate-900 dark:text-slate-100 tracking-tight">
              Visual Case Profile
            </h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              Case DNA Fingerprint
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Multi-dimensional biometric data density fingerprint synthesizing subjective statements and objective telemetry.
          </p>
        </div>

        {/* Global Case DNA Density Score */}
        <div className="flex items-center gap-2 self-start sm:self-center">
          <div className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-right">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">
              Aggregate Case Density
            </span>
            <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">
              {averageDensity}% Signal Fidelity
            </span>
          </div>
        </div>
      </div>

      {/* DNA Barcode / Fingerprint Visual Track Matrix */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 dark:bg-slate-950 text-white border border-slate-800 space-y-4">
        <div className="flex items-center justify-between text-xs">
          <span className="font-mono text-[11px] text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Genomic / Phenotypic Case Barcode</span>
          </span>
          <span className="text-[10px] font-mono text-emerald-400">
            Sequence: AYU-DNA-2026-9042
          </span>
        </div>

        {/* High-Tech Barcode Strips */}
        <div className="grid grid-cols-6 gap-2 sm:gap-3 py-2">
          {metrics.map((metric) => {
            const isSelected = metric.id === activeMetricId

            return (
              <div
                key={metric.id}
                onClick={() => setActiveMetricId(metric.id)}
                className="space-y-1.5 cursor-pointer group"
              >
                {/* Visual Barcode Column */}
                <div
                  className={cn(
                    'h-24 sm:h-28 rounded-xl p-1.5 flex flex-col justify-end transition-all',
                    isSelected
                      ? 'bg-emerald-950/80 border-2 border-emerald-400 shadow-lg shadow-emerald-500/20'
                      : 'bg-slate-800/60 border border-slate-700/60 hover:border-slate-500'
                  )}
                >
                  {/* Internal DNA Banding pattern */}
                  <div className="space-y-1 w-full">
                    {Array.from({ length: Math.round((metric.densityScore / 100) * 8) }).map(
                      (_, i) => (
                        <div
                          key={i}
                          className={cn(
                            'h-1.5 rounded-sm transition-all',
                            isSelected
                              ? 'bg-gradient-to-r from-emerald-400 to-teal-300'
                              : 'bg-slate-400/60 group-hover:bg-slate-300'
                          )}
                        />
                      )
                    )}
                  </div>
                </div>

                <div className="text-center">
                  <span
                    className={cn(
                      'text-[11px] font-bold block truncate transition-colors',
                      isSelected ? 'text-emerald-400' : 'text-slate-400 group-hover:text-slate-200'
                    )}
                  >
                    {metric.label}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">
                    {metric.densityScore}%
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Active Metric Inspector Box */}
      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase text-emerald-600 dark:text-emerald-400">
              Dimension: {activeMetric.label}
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
              {activeMetric.status}
            </span>
          </div>
          <h4 className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
            {activeMetric.verifiedCount}
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {activeMetric.description}
          </p>
        </div>

        <div className="w-full sm:w-48 space-y-1.5 shrink-0">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-600 dark:text-slate-400">
            <span>Fidelity Score</span>
            <span>{activeMetric.densityScore}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${activeMetric.densityScore}%` }}
              transition={{ duration: 0.6 }}
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
            />
          </div>
        </div>
      </div>
    </GlassCard>
  )
}
