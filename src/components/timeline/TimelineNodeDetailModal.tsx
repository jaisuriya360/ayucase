import React from 'react'
import {
  Calendar,
  Building,
  User,
  Quote,
  FileText,
  Tag,
  Stethoscope,
  Activity,
  CheckCircle2,
  Sparkles,
  ExternalLink,
} from 'lucide-react'
import type { TimelineNodeEvent } from '../../types/timeline'
import { Modal } from '../ui/Modal'
import { AnimatedButton } from '../ui/AnimatedButton'

export interface TimelineNodeDetailModalProps {
  event: TimelineNodeEvent | null
  isOpen: boolean
  onClose: () => void
  onNavigateToDocument?: (docName: string) => void
}

export const TimelineNodeDetailModal: React.FC<TimelineNodeDetailModalProps> = ({
  event,
  isOpen,
  onClose,
  onNavigateToDocument,
}) => {
  if (!event) return null

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={event.title}
      subtitle={`${event.date} • ${event.institution} • Recorded Event`}
      size="lg"
    >
      <div className="space-y-5">
        {/* Clinician & Institution Header Strip */}
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between text-xs flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Stethoscope className="w-4 h-4 text-emerald-500" />
            <span className="font-bold text-slate-800 dark:text-slate-200">
              {event.physician}
            </span>
          </div>

          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
            <Building className="w-3.5 h-3.5" />
            <span>{event.institution}</span>
          </div>
        </div>

        {/* Detailed Clinical Impression */}
        <div className="space-y-1.5 text-xs sm:text-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Clinical Summary & Detailed Notes:
          </span>
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300 leading-relaxed">
            {event.detailedNote}
          </div>
        </div>

        {/* Verbatim Patient Statement if present */}
        {event.patientStatement && (
          <div className="space-y-1.5 text-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
              <Quote className="w-3 h-3" />
              <span>Verbatim Patient Experience at This Milestone:</span>
            </span>
            <div className="p-3.5 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-500/20 text-slate-800 dark:text-slate-200 italic">
              "{event.patientStatement}"
            </div>
          </div>
        )}

        {/* Linked Medical Documents */}
        {event.documents && event.documents.length > 0 && (
          <div className="space-y-1.5 text-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Associated Diagnostic Records:
            </span>
            <div className="space-y-1.5">
              {event.documents.map((doc, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-cyan-500" />
                    <span className="font-bold text-slate-900 dark:text-slate-100">
                      {doc.name}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      ({doc.type})
                    </span>
                  </div>
                  {onNavigateToDocument && (
                    <button
                      type="button"
                      onClick={() => {
                        onClose()
                        onNavigateToDocument(doc.name)
                      }}
                      className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
                    >
                      <span>View Record</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Clinical Tags */}
        {event.tags && event.tags.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap pt-1">
            {event.tags.map((tag) => (
              <span
                key={tag}
                className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200/60 dark:border-slate-700/60"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-end pt-3 border-t border-slate-200/80 dark:border-slate-800">
          <AnimatedButton variant="primary" size="sm" onClick={onClose}>
            Close
          </AnimatedButton>
        </div>
      </div>
    </Modal>
  )
}
