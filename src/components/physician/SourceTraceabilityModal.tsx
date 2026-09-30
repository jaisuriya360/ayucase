import React from 'react'
import {
  FileText,
  ShieldCheck,
  ExternalLink,
  X,
  Sparkles,
  Calendar,
  CheckCircle2,
  FileCheck,
  Search,
} from 'lucide-react'
import { Modal } from '../ui/Modal'
import type { SourceCitation } from '../../types/clinicalCase'

interface SourceTraceabilityModalProps {
  citation: SourceCitation | null
  onClose: () => void
}

export const SourceTraceabilityModal: React.FC<SourceTraceabilityModalProps> = ({
  citation,
  onClose,
}) => {
  if (!citation) return null

  return (
    <Modal
      isOpen={Boolean(citation)}
      onClose={onClose}
      title="Source Document Traceability"
      size="lg"
    >
      <div className="space-y-5 text-xs sm:text-sm">
        {/* Top Header Card */}
        <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-cyan-700 dark:text-cyan-300">
              Verified Source Entity
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>{Math.round(citation.confidenceScore * 100)}% Extraction Match</span>
            </span>
          </div>
          <h4 className="font-extrabold text-base text-slate-900 dark:text-slate-100">
            {citation.title}
          </h4>
          <p className="font-mono text-xs text-slate-700 dark:text-slate-300 font-semibold">
            Extracted Value: "{citation.value}"
          </p>
        </div>

        {/* Source Document Metadata */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80">
            <span className="text-[10px] text-slate-400 block font-semibold">Document Title</span>
            <span className="font-bold text-slate-800 dark:text-slate-200 truncate block">
              {citation.documentName}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80">
            <span className="text-[10px] text-slate-400 block font-semibold">Page / Location</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">
              {citation.pageNumber ? `Page ${citation.pageNumber}` : 'Recorded Session'}
              {citation.lineOrSection ? ` • ${citation.lineOrSection}` : ''}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80">
            <span className="text-[10px] text-slate-400 block font-semibold">Ingestion Date</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">
              {citation.date}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80">
            <span className="text-[10px] text-slate-400 block font-semibold">Verification</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400">
              {citation.verificationStatus}
            </span>
          </div>
        </div>

        {/* Verbatim Excerpt Callout */}
        <div className="space-y-1.5">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block">
            Verbatim Document Text Excerpt (Original Artifact)
          </span>
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 font-mono text-xs text-slate-800 dark:text-slate-200 leading-relaxed space-y-2">
            <div className="flex items-center justify-between text-[10px] text-slate-400 border-b border-slate-200 dark:border-slate-800 pb-1.5">
              <span>{citation.documentName}</span>
              <span className="text-cyan-600 dark:text-cyan-400">SHA-256 Verified Extract</span>
            </div>
            <p className="bg-amber-500/10 dark:bg-amber-400/10 p-2.5 rounded-lg border-l-4 border-amber-500 text-slate-900 dark:text-slate-100 font-semibold">
              {citation.snippet}
            </p>
          </div>
        </div>

        {/* Non-Diagnostic Clinical Safety Notice */}
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 flex items-start gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
          <span>
            Traceability Protocol: This quotation reflects the exact verbatim source text from verified medical records or patient voice interview statements ingested into AyuCase.
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-xs font-bold"
          >
            Close Traceability Inspector
          </button>
        </div>
      </div>
    </Modal>
  )
}
