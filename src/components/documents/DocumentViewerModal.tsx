import React, { useState } from 'react'
import {
  FileText,
  CheckCircle2,
  Calendar,
  Building,
  Layers,
  Sparkles,
  Download,
  Info,
  ChevronLeft,
  ChevronRight,
  Edit3,
  Trash2,
  ShieldCheck,
  Stethoscope,
  Pill,
  Activity,
} from 'lucide-react'
import type { MedicalDocument } from '../../types/document'
import { Modal } from '../ui/Modal'
import { ConfirmModal } from '../ui/ConfirmModal'
import { AnimatedButton } from '../ui/AnimatedButton'
import { cn } from '../../utils/cn'

export interface DocumentViewerModalProps {
  document: MedicalDocument | null
  isOpen: boolean
  onClose: () => void
  onRename?: (docId: string, newName: string) => void
  onRemove?: (docId: string) => void
  initialPage?: number
}

export const DocumentViewerModal: React.FC<DocumentViewerModalProps> = ({
  document,
  isOpen,
  onClose,
  onRename,
  onRemove,
  initialPage = 1,
}) => {
  if (!document) return null

  const [activePage, setActivePage] = useState<number>(initialPage)
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [newTitle, setNewTitle] = useState(document.name)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)

  const metadata = document.extractedData
  const totalPages = document.pageCount || 2

  const handleSaveTitle = () => {
    if (newTitle.trim() && onRename) {
      onRename(document.id, newTitle.trim())
    }
    setIsEditingTitle(false)
  }

  // Filter items matching active page
  const pageFindings =
    metadata?.keyFindings.filter((kf) => kf.pageNumber === activePage) || []
  const pageMedications =
    metadata?.medications.filter((m) => m.pageNumber === activePage) || []
  const pageLabValues =
    metadata?.labValues.filter((lv) => lv.pageNumber === activePage) || []
  const pageDiagnoses =
    metadata?.diagnoses.filter((d) => d.pageNumber === activePage) || []

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={document.name}
      subtitle={`${document.type} • ${document.fileSize} • Source: ${document.source}`}
      size="xl"
    >
      <div className="space-y-6">
        {/* Document Action Controls Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 dark:border-slate-800 pb-3">
          {/* Title Editor */}
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {!isEditingTitle ? (
              <div className="flex items-center gap-2 min-w-0">
                <span className="font-extrabold text-sm text-slate-900 dark:text-slate-100 truncate">
                  {document.name}
                </span>
                <button
                  type="button"
                  onClick={() => setIsEditingTitle(true)}
                  className="p-1 rounded text-slate-400 hover:text-emerald-500"
                  title="Rename Document"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 flex-1 max-w-sm">
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-2.5 py-1 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
                <button
                  type="button"
                  onClick={handleSaveTitle}
                  className="px-2.5 py-1 text-xs font-bold rounded-lg bg-emerald-500 text-white"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditingTitle(false)}
                  className="px-2 text-xs text-slate-400"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          {/* Right: Confidence Score & Page Switcher */}
          <div className="flex items-center gap-3 shrink-0">
            {metadata && (
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                OCR Confidence: {metadata.confidenceScore}%
              </span>
            )}

            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={activePage <= 1}
                onClick={() => setActivePage((prev) => Math.max(1, prev - 1))}
                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 disabled:opacity-40"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <span className="text-xs font-bold px-2 text-slate-700 dark:text-slate-300">
                Page {activePage} of {totalPages}
              </span>
              <button
                type="button"
                disabled={activePage >= totalPages}
                onClick={() => setActivePage((prev) => Math.min(totalPages, prev + 1))}
                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 disabled:opacity-40"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* 2-Column Clinical Layout: Simulated Canvas & Extracted Metadata */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left: Simulated Medical Record Canvas (Page Layout) */}
          <div className="lg:col-span-7 p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-inner space-y-4 min-h-[380px]">
            {/* Header of Simulated Report */}
            <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-slate-800">
              <div>
                <h4 className="font-black text-xs uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  {document.source}
                </h4>
                <p className="text-[10px] text-slate-400">
                  Clinical Diagnostics & Reporting Division • Document ID: {document.id}
                </p>
              </div>
              <span className="text-[10px] font-mono text-slate-400">
                Date: {document.date}
              </span>
            </div>

            {/* Patient Demographic Banner inside Record */}
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 text-xs flex items-center justify-between text-slate-600 dark:text-slate-300">
              <div>
                <span className="font-bold text-slate-900 dark:text-slate-100">Aarav Chen</span> • 38 Yrs / Male
              </div>
              <div className="text-[10px] font-mono">
                Ref: PT-DEMO-9042
              </div>
            </div>

            {/* Simulated Clinical Content with Bounding Boxes */}
            <div className="space-y-3 pt-2 text-xs">
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-400">
                  Clinical Summary (Page {activePage}):
                </span>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed italic bg-emerald-500/5 p-2 rounded-lg border border-emerald-500/20">
                  "{metadata?.summary || 'Standard evaluation verified non-pathological baseline.'}"
                </p>
              </div>

              {/* Bounding box highlights on the canvas */}
              {pageFindings.length > 0 && (
                <div className="space-y-1.5 pt-2">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">
                    Observed Diagnostic Findings:
                  </span>
                  {pageFindings.map((kf) => (
                    <div
                      key={kf.id}
                      className="p-2.5 rounded-xl border border-cyan-500/40 bg-cyan-50/50 dark:bg-cyan-950/20 text-slate-800 dark:text-slate-200 relative group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-cyan-700 dark:text-cyan-300">
                          {kf.title}
                        </span>
                        {/* Source Traceability Badge */}
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 flex items-center gap-1">
                          <Info className="w-2.5 h-2.5" />
                          <span>Source: {document.name} • Page {kf.pageNumber}</span>
                        </span>
                      </div>
                      <p className="mt-1 text-[11px] text-slate-600 dark:text-slate-300">
                        {kf.value}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Bounding box highlights for Medications */}
              {pageMedications.length > 0 && (
                <div className="space-y-1.5 pt-2">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">
                    Extracted Medications on this Page:
                  </span>
                  {pageMedications.map((m) => (
                    <div
                      key={m.id}
                      className="p-2.5 rounded-xl border border-emerald-500/40 bg-emerald-50/50 dark:bg-emerald-950/20 text-slate-800 dark:text-slate-200"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-emerald-700 dark:text-emerald-300">
                          {m.name} {m.dosage}
                        </span>
                        {/* Source Traceability Badge */}
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 flex items-center gap-1">
                          <Info className="w-2.5 h-2.5" />
                          <span>Source: {document.name} • Page {m.pageNumber}</span>
                        </span>
                      </div>
                      <p className="mt-1 text-[11px] text-slate-600 dark:text-slate-300">
                        {m.frequency} • Prescribed by {m.prescribedBy}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right: Extracted Structured Metadata Sidebar */}
          <div className="lg:col-span-5 p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-500" />
              <h4 className="font-black text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Source Traceability & Extracted Entities
              </h4>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800">
                <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                  Performing Clinician / Lab
                </span>
                <span className="font-bold text-slate-900 dark:text-slate-100">
                  {metadata?.performedBy || document.source}
                </span>
              </div>

              {/* Source traceability cards */}
              {metadata?.medications.map((med) => (
                <div
                  key={med.id}
                  onClick={() => setActivePage(med.pageNumber)}
                  className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-emerald-500/30 hover:border-emerald-500 cursor-pointer transition-all space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                      <Pill className="w-3.5 h-3.5 text-emerald-500" />
                      <span>{med.name} {med.dosage}</span>
                    </span>
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                      Page {med.pageNumber}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">{med.frequency}</p>
                  <span className="text-[10px] font-mono text-cyan-600 dark:text-cyan-400 flex items-center gap-1 pt-1">
                    <Info className="w-3 h-3" />
                    <span>Source: {document.name} (Page: {med.pageNumber})</span>
                  </span>
                </div>
              ))}

              {metadata?.keyFindings.map((kf) => (
                <div
                  key={kf.id}
                  onClick={() => setActivePage(kf.pageNumber)}
                  className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-cyan-500 cursor-pointer transition-all space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 dark:text-slate-100">
                      {kf.title}
                    </span>
                    <span className="text-[10px] font-bold text-cyan-600 dark:text-cyan-400">
                      Page {kf.pageNumber}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 line-clamp-2">{kf.value}</p>
                  <span className="text-[10px] font-mono text-cyan-600 dark:text-cyan-400 flex items-center gap-1 pt-1">
                    <Info className="w-3 h-3" />
                    <span>Source: {document.name} (Page: {kf.pageNumber})</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions: Remove / Close */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-200/80 dark:border-slate-800">
          {onRemove && (
            <button
              type="button"
              onClick={() => setIsConfirmOpen(true)}
              className="px-3 py-1.5 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Remove Document</span>
            </button>
          )}

          <AnimatedButton variant="primary" size="sm" onClick={onClose}>
            Close Viewer
          </AnimatedButton>
        </div>
      </div>

      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={() => {
          setIsConfirmOpen(false)
          if (onRemove) {
            onRemove(document.id)
          }
          onClose()
        }}
        title="Delete document?"
        description={`"${document.name}" will be removed from this demo patient record.`}
        confirmText="Delete document"
        variant="danger"
      />
    </Modal>
  )
}
