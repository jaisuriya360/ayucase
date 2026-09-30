import React, { useState } from 'react'
import {
  Sparkles,
  PieChart,
  HelpCircle,
  AlertTriangle,
  Clock,
  FileText,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Eye,
  X,
  Send,
} from 'lucide-react'
import { GlassCard } from '../ui/GlassCard'
import { Modal } from '../ui/Modal'
import { useNotifications } from '../../contexts/NotificationContext'
import type {
  ClinicalCase,
  CaseDocumentItem,
  CaseTimelineEvent,
  CaseContradictionItem,
} from '../../types/clinicalCase'
import { formatDate } from '../../utils/formatters'
import { cn } from '../../utils/cn'

interface CaseDetailRightPanelProps {
  currentCase: ClinicalCase
  onSelectIntelligenceView?: (view: 'brief' | 'attention' | 'what_changed' | 'mirror') => void
  onOpenSourceCitation?: (citationId: string) => void
}

export const CaseDetailRightPanel: React.FC<CaseDetailRightPanelProps> = ({
  currentCase,
  onSelectIntelligenceView,
  onOpenSourceCitation,
}) => {
  const { notifySuccess, notifyInfo } = useNotifications()
  const [selectedDoc, setSelectedDoc] = useState<CaseDocumentItem | null>(null)
  const [selectedEvent, setSelectedEvent] = useState<CaseTimelineEvent | null>(null)
  const [requestSentItem, setRequestSentItem] = useState<string | null>(null)

  const handleRequestData = (title: string) => {
    setRequestSentItem(title)
    notifySuccess(
      'Information Request Sent',
      `Prompted patient portal for: "${title}". Notification queued.`
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 px-1">
        <Sparkles className="w-4 h-4 text-indigo-500" />
        <h3 className="font-extrabold text-sm text-slate-900 dark:text-slate-100 uppercase tracking-wider">
          Case Intelligence
        </h3>
      </div>

      {/* Quick Launch Intelligence Views */}
      {onSelectIntelligenceView && (
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => onSelectIntelligenceView('brief')}
            className="p-2.5 rounded-xl border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer text-left shadow-sm"
          >
            <span className="text-base">⚡</span>
            <div>
              <span className="block leading-tight font-extrabold">60-Sec Brief</span>
              <span className="text-[10px] text-amber-600/80 dark:text-amber-400/80 font-normal">Orientation</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onSelectIntelligenceView('attention')}
            className="p-2.5 rounded-xl border border-cyan-500/30 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer text-left shadow-sm"
          >
            <span className="text-base">🧭</span>
            <div>
              <span className="block leading-tight font-extrabold">Attention Map</span>
              <span className="text-[10px] text-cyan-600/80 dark:text-cyan-400/80 font-normal">Triage matrix</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onSelectIntelligenceView('what_changed')}
            className="p-2.5 rounded-xl border border-indigo-500/30 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer text-left shadow-sm"
          >
            <span className="text-base">🔄</span>
            <div>
              <span className="block leading-tight font-extrabold">What Changed?</span>
              <span className="text-[10px] text-indigo-600/80 dark:text-indigo-400/80 font-normal">Delta engine</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onSelectIntelligenceView('mirror')}
            className="p-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer text-left shadow-sm"
          >
            <span className="text-base">🪞</span>
            <div>
              <span className="block leading-tight font-extrabold">Case Mirror</span>
              <span className="text-[10px] text-emerald-600/80 dark:text-emerald-400/80 font-normal">Bilateral view</span>
            </div>
          </button>
        </div>
      )}

      {/* 1. Case Completeness Gauge */}
      <GlassCard variant="default" className="p-4 space-y-3 border border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Synthesis Completeness
          </span>
          <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">
            {currentCase.completeness}%
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
          <div
            className={cn(
              'h-full rounded-full transition-all duration-700',
              currentCase.completeness >= 90
                ? 'bg-emerald-500'
                : currentCase.completeness >= 70
                ? 'bg-cyan-500'
                : 'bg-amber-500'
            )}
            style={{ width: `${currentCase.completeness}%` }}
          />
        </div>

        {/* Category Breakdown */}
        <div className="grid grid-cols-2 gap-1.5 text-[11px] pt-1 border-t border-slate-200/80 dark:border-slate-800/80">
          <div className="flex items-center justify-between p-1.5 rounded-lg bg-slate-50 dark:bg-slate-900/60">
            <span className="text-slate-500">History:</span>
            <span className="font-bold text-slate-700 dark:text-slate-200">100%</span>
          </div>
          <div className="flex items-center justify-between p-1.5 rounded-lg bg-slate-50 dark:bg-slate-900/60">
            <span className="text-slate-500">Telemetry:</span>
            <span className="font-bold text-slate-700 dark:text-slate-200">
              {currentCase.completeness >= 80 ? '90%' : '50%'}
            </span>
          </div>
          <div className="flex items-center justify-between p-1.5 rounded-lg bg-slate-50 dark:bg-slate-900/60">
            <span className="text-slate-500">Documents:</span>
            <span className="font-bold text-slate-700 dark:text-slate-200">
              {currentCase.documents.length > 0 ? '85%' : '20%'}
            </span>
          </div>
          <div className="flex items-center justify-between p-1.5 rounded-lg bg-slate-50 dark:bg-slate-900/60">
            <span className="text-slate-500">Lab Panels:</span>
            <span className="font-bold text-slate-700 dark:text-slate-200">
              {currentCase.unknownItems.length === 0 ? '95%' : '65%'}
            </span>
          </div>
        </div>
      </GlassCard>

      {/* 2. Unknown Zone (Missing Parameters) */}
      <GlassCard variant="default" className="p-4 space-y-2.5 border border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <HelpCircle className="w-4 h-4 text-amber-500" />
            <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
              Unknown Zone ({currentCase.unknownItems.length})
            </h4>
          </div>
          <span className="text-[10px] text-slate-400">Uninvented gaps</span>
        </div>

        {currentCase.unknownItems.length === 0 ? (
          <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium py-1">
            ✓ Zero critical missing parameters. Case is comprehensively documented.
          </p>
        ) : (
          <div className="space-y-2">
            {currentCase.unknownItems.map((item, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/20 text-xs space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-slate-100">
                    {item.title}
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-700 dark:text-amber-300">
                    {item.category}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {item.impact}
                </p>
                <button
                  type="button"
                  onClick={() => handleRequestData(item.title)}
                  disabled={requestSentItem === item.title}
                  className="w-full mt-1 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 font-bold text-[11px] flex items-center justify-center gap-1 transition-colors"
                >
                  <Send className="w-3 h-3" />
                  <span>
                    {requestSentItem === item.title ? 'Request Dispatched ✓' : 'Request from Patient'}
                  </span>
                </button>
              </div>
            ))}
          </div>
        )}
      </GlassCard>

      {/* 3. Information Differences (Contradictions) */}
      <GlassCard variant="default" className="p-4 space-y-2.5 border border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-rose-500" />
            <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
              Information Differences ({currentCase.contradictions.length})
            </h4>
          </div>
          <span className="text-[10px] text-rose-500 font-bold">Radar Flag</span>
        </div>

        {currentCase.contradictions.length === 0 ? (
          <p className="text-xs text-slate-500 dark:text-slate-400 py-1">
            No conflicting statements identified across patient intake and documents.
          </p>
        ) : (
          <div className="space-y-2.5">
            {currentCase.contradictions.map((contra, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-rose-500/5 border border-rose-500/20 text-xs space-y-2"
              >
                <span className="font-extrabold text-rose-600 dark:text-rose-400 block">
                  {contra.title}
                </span>

                <div className="space-y-1">
                  <div className="p-2 rounded-lg bg-white/60 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/60">
                    <span className="text-[10px] font-bold text-slate-400 block">
                      Patient Voice Intake:
                    </span>
                    <p className="text-[11px] text-slate-700 dark:text-slate-300 font-medium">
                      {contra.statement}
                    </p>
                  </div>

                  <div className="p-2 rounded-lg bg-white/60 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/60">
                    <span className="text-[10px] font-bold text-cyan-600 dark:text-cyan-400 block">
                      Document Record:
                    </span>
                    <p className="text-[11px] text-slate-700 dark:text-slate-300 font-medium">
                      {contra.documentRecord}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                  <span>Status: <strong>{contra.status}</strong></span>
                  <span className="text-rose-500 font-bold">Requires Human Judgment</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </GlassCard>

      {/* 4. Timeline Events (Interactive Mini-Timeline) */}
      <GlassCard variant="default" className="p-4 space-y-2.5 border border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-cyan-500" />
            <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
              Interactive Timeline ({currentCase.timelineEvents.length})
            </h4>
          </div>
          <span className="text-[10px] text-slate-400">Click node</span>
        </div>

        <div className="relative pl-4 space-y-3 before:absolute before:left-1.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
          {currentCase.timelineEvents.map((evt, idx) => (
            <div
              key={idx}
              onClick={() => setSelectedEvent(evt)}
              className="relative text-xs cursor-pointer hover:opacity-80 transition-opacity"
            >
              <div className="absolute -left-[19px] top-1 w-2.5 h-2.5 rounded-full bg-cyan-500 ring-4 ring-white dark:ring-slate-900" />
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-cyan-600 dark:text-cyan-400">
                  {evt.year}
                </span>
                <span className="text-[10px] text-slate-400">• {evt.date}</span>
              </div>
              <h5 className="font-bold text-slate-800 dark:text-slate-200 truncate">
                {evt.title}
              </h5>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* 5. Extracted Documents */}
      <GlassCard variant="default" className="p-4 space-y-2.5 border border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-emerald-500" />
            <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
              Clinical Documents ({currentCase.documents.length})
            </h4>
          </div>
          <span className="text-[10px] text-emerald-500 font-bold">Verified</span>
        </div>

        {currentCase.documents.length === 0 ? (
          <p className="text-xs text-slate-400 py-1">No uploaded records for this case yet.</p>
        ) : (
          <div className="space-y-2">
            {currentCase.documents.map((doc) => (
              <div
                key={doc.id}
                onClick={() => setSelectedDoc(doc)}
                className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between text-xs hover:border-cyan-500/40 cursor-pointer transition-colors"
              >
                <div className="min-w-0 pr-2">
                  <span className="font-bold text-slate-900 dark:text-slate-100 truncate block">
                    {doc.name}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {doc.type} • {doc.pages} pages • {doc.date}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-cyan-600 dark:text-cyan-400 text-[11px] font-bold shrink-0">
                  <Eye className="w-3.5 h-3.5" />
                  <span>View</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </GlassCard>

      {/* Document Preview Modal */}
      {selectedDoc && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedDoc(null)}
          title={`Document: ${selectedDoc.name}`}
          size="lg"
        >
          <div className="space-y-4">
            <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-xs flex items-center justify-between">
              <div>
                <span className="font-bold text-cyan-800 dark:text-cyan-300">
                  Status: {selectedDoc.status}
                </span>
                <p className="text-slate-500 dark:text-slate-400">
                  Extracted {selectedDoc.date} • {selectedDoc.pages} pages indexed
                </p>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300">
                {selectedDoc.type}
              </span>
            </div>

            {/* Simulated Medical Document Viewer */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 font-mono text-xs space-y-3 min-h-[220px]">
              <div className="border-b border-slate-200 dark:border-slate-800 pb-2 flex justify-between">
                <span className="font-bold">HOSPITAL DIAGNOSTIC REPORT</span>
                <span className="text-slate-400">CONFIDENTIAL</span>
              </div>
              <p>PATIENT: {currentCase.patientName} (ID: {currentCase.patientId})</p>
              <p>ATTENDING: {currentCase.assignedPhysician}</p>
              <p className="text-slate-600 dark:text-slate-400">
                FINDINGS SUMMARY: Bilateral cerebral hemispheric parenchyma within normal anatomical limits. No acute infarction, hemorrhage, or mass effect. Ventricles and basal cisterns unremarkable.
              </p>
              <p className="text-emerald-600 dark:text-emerald-400 font-bold">
                CONCLUSION: Normal 3T Neurovascular MR protocol. No secondary intracranial etiologies for cephalalgia detected.
              </p>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedDoc(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-xs font-bold"
              >
                Close Preview
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Timeline Event Modal */}
      {selectedEvent && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedEvent(null)}
          title={`Milestone: ${selectedEvent.title}`}
          size="md"
        >
          <div className="space-y-3 text-xs sm:text-sm">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-cyan-600 dark:text-cyan-400 text-base">
                {selectedEvent.year}
              </span>
              <span className="text-slate-400">• {selectedEvent.date}</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 ml-auto">
                {selectedEvent.type}
              </span>
            </div>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
              {selectedEvent.description}
            </p>
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setSelectedEvent(null)}
                className="px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
