import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FileText,
  Upload,
  Eye,
  CheckCircle2,
  Clock,
  Filter,
  Trash2,
  Edit3,
  ExternalLink,
  Plus,
  Sparkles,
  Info,
  Calendar,
  Building,
  AlertCircle,
  FileUp,
} from 'lucide-react'
import { PageHeader } from '../../components/ui/PageHeader'
import { GlassCard } from '../../components/ui/GlassCard'
import { AnimatedButton } from '../../components/ui/AnimatedButton'
import { EmptyState } from '../../components/ui/EmptyState'
import { LoadingState } from '../../components/ui/LoadingState'
import { DocumentDropzone } from '../../components/documents/DocumentDropzone'
import { DocumentStoryPipeline } from '../../components/documents/DocumentStoryPipeline'
import { DocumentViewerModal } from '../../components/documents/DocumentViewerModal'
import { SourceTraceabilityExplorer } from '../../components/documents/SourceTraceabilityExplorer'
import { usePatient } from '../../contexts/PatientContext'
import { useNotifications } from '../../contexts/NotificationContext'
import { useLanguage } from '../../contexts/LanguageContext'
import {
  INITIAL_DOCUMENTS,
  type MedicalDocument,
  type DocumentType,
} from '../../types/document'
import { cn } from '../../utils/cn'

const DOCUMENTS_STORAGE_KEY = 'ayucase_patient_documents_v6'

export const PatientDocumentsPage: React.FC = () => {
  const { notifySuccess, notifyInfo, notifyError } = useNotifications()
  const { t } = useLanguage()

  // Documents state with persistence
  const [documents, setDocuments] = useState<MedicalDocument[]>(() => {
    try {
      const stored = localStorage.getItem(DOCUMENTS_STORAGE_KEY)
      if (stored) {
        return JSON.parse(stored) as MedicalDocument[]
      }
    } catch (e) {
      console.warn('Failed to parse documents from localStorage', e)
    }
    return INITIAL_DOCUMENTS
  })

  // Filter state
  const [activeFilter, setActiveFilter] = useState<string>('All')

  // Viewer Modal state
  const [selectedDoc, setSelectedDoc] = useState<MedicalDocument | null>(null)
  const [viewerPage, setViewerPage] = useState<number>(1)
  const [isViewerOpen, setIsViewerOpen] = useState(false)

  // Rename Modal state
  const [renameDocId, setRenameDocId] = useState<string | null>(null)
  const [renameValue, setRenameValue] = useState<string>('')

  // Persist documents whenever changed
  useEffect(() => {
    try {
      localStorage.setItem(DOCUMENTS_STORAGE_KEY, JSON.stringify(documents))
    } catch (e) {
      console.warn('Failed to save documents to localStorage', e)
    }
  }, [documents])

  const categories = ['All', 'Imaging', 'Lab Report', 'Prescription', 'Discharge Summary']

  const filteredDocs =
    activeFilter === 'All'
      ? documents
      : documents.filter((d) => d.type === activeFilter)

  // Handle new document uploaded
  const handleDocumentUploaded = (newDoc: MedicalDocument) => {
    setDocuments((prev) => [newDoc, ...prev])
  }

  // Handle open document viewer at specific page (Source Traceability trigger)
  const handleOpenSource = (docId: string, pageNumber: number) => {
    const doc = documents.find((d) => d.id === docId)
    if (doc) {
      setSelectedDoc(doc)
      setViewerPage(pageNumber)
      setIsViewerOpen(true)
    }
  }

  // Handle Document Rename
  const handleRename = (docId: string, newName: string) => {
    setDocuments((prev) =>
      prev.map((d) => (d.id === docId ? { ...d, name: newName } : d))
    )
    if (selectedDoc && selectedDoc.id === docId) {
      setSelectedDoc((prev) => (prev ? { ...prev, name: newName } : null))
    }
    notifySuccess('Document Renamed', `Updated to "${newName}".`)
    setRenameDocId(null)
  }

  // Handle Document Remove
  const handleRemove = (docId: string) => {
    const doc = documents.find((d) => d.id === docId)
    setDocuments((prev) => prev.filter((d) => d.id !== docId))
    notifyInfo('Document Removed', `Removed ${doc?.name || 'document'} from case records.`)
  }

  return (
    <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto pb-16">
      {/* 1. PAGE HEADER */}
      <PageHeader
        title={t('nav.documents', 'Clinical Documents & Diagnostic Library')}
        subtitle="Manage diagnostic reports, neuroimaging, and prescriptions. Every extracted parameter maintains immutable source traceability to its originating page."
        breadcrumbs={[
          { label: t('nav.dashboard', 'Dashboard'), href: '/patient/dashboard' },
          { label: t('nav.documents', 'My Documents') },
        ]}
        badge={
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            {documents.length} Verified Records Active
          </span>
        }
        actions={
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                const dropzone = document.getElementById('upload-dropzone-section')
                if (dropzone) dropzone.scrollIntoView({ behavior: 'smooth' })
              }}
              className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md shadow-emerald-500/20 hover:scale-105 transition-all flex items-center gap-2"
            >
              <FileUp className="w-4 h-4" />
              <span>Upload Record</span>
            </button>
          </div>
        }
      />

      {/* 2. DOCUMENT -> STORY ANIMATED PIPELINE */}
      <section aria-labelledby="pipeline-heading">
        <h2 id="pipeline-heading" className="sr-only">
          Document to Story Pipeline
        </h2>
        <DocumentStoryPipeline documentCount={documents.length} activeStage="story" />
      </section>

      {/* 3. DRAG & DROP UPLOAD ZONE */}
      <section id="upload-dropzone-section" aria-labelledby="upload-heading">
        <h2 id="upload-heading" className="sr-only">
          Upload Documents
        </h2>
        <DocumentDropzone onDocumentUploaded={handleDocumentUploaded} />
      </section>

      {/* 4. DOCUMENT LIBRARY SECTION */}
      <section aria-labelledby="library-heading" className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3
              id="library-heading"
              className="text-lg font-black text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2"
            >
              <FileText className="w-5 h-5 text-emerald-500" />
              <span>Medical Document Library ({filteredDocs.length})</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Browse verified files, inspect multi-page OCR bounding boxes, and manage clinical attachments.
            </p>
          </div>

          {/* Filter Categories */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveFilter(cat)}
                className={cn(
                  'px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer',
                  activeFilter === cat
                    ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-sm'
                    : 'bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Documents Table / Card List */}
        <div className="space-y-3">
          {filteredDocs.length === 0 ? (
            <EmptyState
              icon={<FileText className="w-8 h-8 text-emerald-500" />}
              title="No Documents in Category"
              description={`No clinical documents or diagnostic scans found under "${activeFilter}".`}
              actionLabel="Show All Categories"
              onAction={() => setActiveFilter('All')}
              className="py-10"
            />
          ) : (
            filteredDocs.map((doc) => {
              const isCompleted = doc.status === 'Completed'
              const isProcessing = doc.status === 'Processing'
              const isUploading = doc.status === 'Uploading'
              const isFailed = doc.status === 'Failed'

              return (
                <GlassCard
                  key={doc.id}
                  variant="interactive"
                  className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 group"
                  onClick={() => {
                    setSelectedDoc(doc)
                    setViewerPage(1)
                    setIsViewerOpen(true)
                  }}
                >
                  {/* Left: Icon & File Meta */}
                  <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                    <div
                      className={cn(
                        'w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105',
                        doc.type === 'Imaging'
                          ? 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20'
                          : doc.type === 'Prescription'
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                          : 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20'
                      )}
                    >
                      <FileText className="w-5 h-5" />
                    </div>

                    <div className="min-w-0 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        {renameDocId !== doc.id ? (
                          <h4 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors truncate">
                            {doc.name}
                          </h4>
                        ) : (
                          <div
                            className="flex items-center gap-1.5"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <input
                              type="text"
                              value={renameValue}
                              onChange={(e) => setRenameValue(e.target.value)}
                              className="px-2 py-0.5 rounded-lg border border-emerald-500 text-xs text-slate-900 dark:text-slate-100"
                            />
                            <button
                              type="button"
                              onClick={() => handleRename(doc.id, renameValue)}
                              className="px-2 py-0.5 rounded-md bg-emerald-500 text-white text-xs font-bold"
                            >
                              Save
                            </button>
                            <button
                              type="button"
                              onClick={() => setRenameDocId(null)}
                              className="text-xs text-slate-400"
                            >
                              Cancel
                            </button>
                          </div>
                        )}

                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                          {doc.fileFormat} • {doc.fileSize}
                        </span>
                      </div>

                      {/* Required Meta: name, date, type, status, source */}
                      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 flex-wrap">
                        <span className="font-semibold text-slate-700 dark:text-slate-300">
                          {doc.type}
                        </span>
                        <span>•</span>
                        <span>{doc.date}</span>
                        <span>•</span>
                        <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                          Source: {doc.source}
                        </span>
                        <span>•</span>
                        <span>{doc.pageCount} Pages</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Status Badge & Actions */}
                  <div
                    className="flex items-center gap-2.5 shrink-0 self-end md:self-center"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* Status Chip */}
                    <span
                      className={cn(
                        'inline-flex items-center gap-1 text-[11px] font-extrabold px-2.5 py-1 rounded-full uppercase',
                        isCompleted
                          ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                          : isFailed
                          ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30'
                          : 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30 animate-pulse'
                      )}
                    >
                      {isCompleted && <CheckCircle2 className="w-3.5 h-3.5" />}
                      {isFailed && <AlertCircle className="w-3.5 h-3.5" />}
                      {isProcessing && <Sparkles className="w-3.5 h-3.5 animate-spin" />}
                      <span>{doc.status}</span>
                    </span>

                    {/* View Button */}
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedDoc(doc)
                        setViewerPage(1)
                        setIsViewerOpen(true)
                      }}
                      className="p-2 rounded-xl text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      title="View Multi-Page Canvas & OCR"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    {/* Rename Button */}
                    <button
                      type="button"
                      onClick={() => {
                        setRenameDocId(doc.id)
                        setRenameValue(doc.name)
                      }}
                      className="p-2 rounded-xl text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      title="Rename Document"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>

                    {/* Remove Button */}
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm(`Delete ${doc.name}?`)) {
                          handleRemove(doc.id)
                        }
                      }}
                      className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                      title="Remove Document"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </GlassCard>
              )
            })
          )}
        </div>
      </section>

      {/* 5. SOURCE TRACEABILITY EXPLORER */}
      <section aria-labelledby="traceability-heading">
        <h2 id="traceability-heading" className="sr-only">
          Clinical Source Traceability
        </h2>
        <SourceTraceabilityExplorer
          documents={documents}
          onOpenDocumentSource={handleOpenSource}
        />
      </section>

      {/* 6. DOCUMENT VIEWER MODAL */}
      <DocumentViewerModal
        document={selectedDoc}
        isOpen={isViewerOpen}
        onClose={() => setIsViewerOpen(false)}
        initialPage={viewerPage}
        onRename={handleRename}
        onRemove={handleRemove}
      />
    </div>
  )
}
