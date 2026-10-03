import React, { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Upload,
  FileUp,
  FileText,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Sparkles,
  Info,
  X,
} from 'lucide-react'
import type { MedicalDocument, DocumentStatus, DocumentType } from '../../types/document'
import { GlassCard } from '../ui/GlassCard'
import { AnimatedButton } from '../ui/AnimatedButton'
import { useNotifications } from '../../contexts/NotificationContext'
import { cn } from '../../utils/cn'

export interface DocumentDropzoneProps {
  onDocumentUploaded: (doc: MedicalDocument) => void
  className?: string
}

export const DocumentDropzone: React.FC<DocumentDropzoneProps> = ({
  onDocumentUploaded,
  className,
}) => {
  const { notifySuccess, notifyError, notifyInfo } = useNotifications()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [isDragOver, setIsDragOver] = useState(false)
  const [currentFile, setCurrentFile] = useState<File | null>(null)
  const [uploadStatus, setUploadStatus] = useState<DocumentStatus | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [simulatedFailure, setSimulatedFailure] = useState(false)
  const [failureMessage, setFailureMessage] = useState('')

  // Quick Demo Ingestion Presets
  const DEMO_PRESETS = [
    {
      name: 'Prescription_Titration.pdf',
      type: 'Prescription' as DocumentType,
      size: '520 KB',
      format: 'PDF' as const,
      provider: 'Dr. Elena Vance Clinic',
      summary: 'Propranolol 40mg BID & Rizatriptan 10mg PRN titration regimen.',
      medications: [
        {
          id: `med-${Date.now()}-1`,
          name: 'Propranolol',
          dosage: '40 mg',
          frequency: 'Twice daily',
          pageNumber: 1,
          prescribedBy: 'Dr. Elena Vance, MD',
        },
        {
          id: `med-${Date.now()}-2`,
          name: 'Rizatriptan',
          dosage: '10 mg',
          frequency: 'PRN for acute visual aura',
          pageNumber: 2,
          prescribedBy: 'Dr. Elena Vance, MD',
        },
      ],
      findings: [
        {
          id: `kf-${Date.now()}-1`,
          title: 'Prescription Schedule',
          value: 'Titrated neurovascular prophylaxis with evening magnesium supplement.',
          pageNumber: 1,
          category: 'Pharmacology',
          confidence: 99,
        },
      ],
    },
    {
      name: '48Hr_Holter_Cardiovagal_Log.png',
      type: 'Lab Report' as DocumentType,
      size: '2.4 MB',
      format: 'PNG' as const,
      provider: 'Metro Diagnostics',
      summary: 'Continuous 48-hr Holter ECG showing normal sinus rhythm with nocturnal bradycardia.',
      medications: [],
      findings: [
        {
          id: `kf-${Date.now()}-2`,
          title: 'Holter Rhythm',
          value: 'Average rate 74 BPM. Absence of ventricular tachyarrhythmias.',
          pageNumber: 1,
          category: 'Electrophysiology',
          confidence: 97,
        },
      ],
    },
    {
      name: 'Cervical_Spine_Radiograph.jpg',
      type: 'Imaging' as DocumentType,
      size: '4.8 MB',
      format: 'JPG' as const,
      provider: 'AyuCare Imaging',
      summary: 'Plain cervical spine radiographs showing preserved intervertebral disc spaces.',
      medications: [],
      findings: [
        {
          id: `kf-${Date.now()}-3`,
          title: 'Cervical Alignment',
          value: 'Normal lordosis with no foraminal narrowing.',
          pageNumber: 1,
          category: 'Orthopedic',
          confidence: 96,
        },
      ],
    },
  ]

  // Ingestion Simulation Engine (Uploading -> Processing -> Completed / Failed)
  const processFileIngestion = (
    fileName: string,
    fileSizeStr: string,
    fileFormat: 'PDF' | 'JPG' | 'PNG',
    presetData?: (typeof DEMO_PRESETS)[0]
  ) => {
    setUploadStatus('Uploading')
    setUploadProgress(15)

    // Stage 1: Uploading (0% -> 40%)
    setTimeout(() => {
      setUploadProgress(40)

      if (simulatedFailure) {
        // Trigger simulated failure state
        setTimeout(() => {
          setUploadStatus('Failed')
          setFailureMessage('Network stream timeout during simulated document packet verification.')
          notifyError('Upload Failed', 'Simulated failure state triggered. Click Retry to re-process.')
        }, 800)
        return
      }

      // Stage 2: Processing / Mock OCR (40% -> 85%)
      setUploadStatus('Processing')
      setUploadProgress(65)

      setTimeout(() => {
        setUploadProgress(90)

        // Stage 3: Completed (100% with extracted metadata)
        setTimeout(() => {
          setUploadProgress(100)
          setUploadStatus('Completed')

          const docCategory: DocumentType = presetData?.type || 'Lab Report'

          const newDoc: MedicalDocument = {
            id: `doc-${Date.now()}`,
            name: fileName,
            date: new Date().toISOString().split('T')[0],
            type: docCategory,
            fileFormat: fileFormat,
            fileSize: fileSizeStr,
            status: 'Completed',
            source: presetData?.provider || 'Self-Uploaded Diagnostic (AyuCare Portal)',
            pageCount: fileFormat === 'PDF' ? 2 : 1,
            extractedData: {
              summary:
                presetData?.summary ||
                'Simulated clinical extraction verified non-pathological parameters and intact baselines.',
              confidenceScore: 98.2,
              performedBy: presetData?.provider || 'AyuCare Clinical Ingestion Engine',
              examinationDate: new Date().toISOString().split('T')[0],
              keyFindings: presetData?.findings || [
                {
                  id: `kf-${Date.now()}`,
                  title: 'Primary Ingestion Marker',
                  value: 'Normalized clinical observations ingested into patient phenotype record.',
                  pageNumber: 1,
                  category: 'Diagnostics',
                  confidence: 98,
                },
              ],
              medications: presetData?.medications || [],
              labValues: [],
              diagnoses: [
                {
                  id: `diag-${Date.now()}`,
                  code: 'Z00.00',
                  description: 'Verified clinical documentation added to personal illness narrative',
                  severity: 'Normal',
                  pageNumber: 1,
                },
              ],
            },
          }

          onDocumentUploaded(newDoc)
          notifySuccess(
            'Document Structured Successfully',
            `Extracted clinical findings and linked to Health Story timeline.`
          )

          // Auto-reset upload card after 2 seconds
          setTimeout(() => {
            setUploadStatus(null)
            setCurrentFile(null)
            setUploadProgress(0)
          }, 2200)
        }, 600)
      }, 700)
    }, 600)
  }

  // Handle native file selection
  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return
    const file = files[0]
    setCurrentFile(file)

    const ext = file.name.split('.').pop()?.toUpperCase()
    if (ext !== 'PDF' && ext !== 'JPG' && ext !== 'JPEG' && ext !== 'PNG') {
      notifyError('Unsupported File Format', 'Please upload a PDF, JPG, or PNG document.')
      return
    }

    const format: 'PDF' | 'JPG' | 'PNG' =
      ext === 'PDF' ? 'PDF' : ext === 'PNG' ? 'PNG' : 'JPG'
    const sizeStr = `${(file.size / (1024 * 1024)).toFixed(1)} MB`

    processFileIngestion(file.name, sizeStr, format)
  }

  // Drag handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = () => {
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    handleFiles(e.dataTransfer.files)
  }

  const handleRetry = () => {
    setSimulatedFailure(false)
    if (currentFile) {
      handleFiles([currentFile] as any)
    } else {
      processFileIngestion('Brain_MRI_Volumetric_Repeat.pdf', '12.4 MB', 'PDF')
    }
  }

  return (
    <GlassCard variant="elevated" className={cn('p-5 sm:p-7 space-y-5', className)}>
      {/* Title & Instructions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <FileUp className="w-5 h-5 text-emerald-500" />
            <span>Upload Clinical Records & Diagnostics</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Supported formats: <strong className="text-slate-700 dark:text-slate-300">PDF, JPG, PNG</strong>. Automatic simulated OCR and entity structuring enabled.
          </p>
        </div>

        {/* Toggle to demo Failed State */}
        <div className="flex items-center gap-2 self-start sm:self-center">
          <label className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={simulatedFailure}
              onChange={(e) => setSimulatedFailure(e.target.checked)}
              className="rounded text-emerald-500 focus:ring-emerald-400"
            />
            <span className="text-[11px]">Test "Failed" State</span>
          </label>
        </div>
      </div>

      {/* Main Drag & Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          'relative p-6 sm:p-10 rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center text-center cursor-pointer select-none group',
          isDragOver
            ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30 scale-[1.01]'
            : 'border-slate-300 dark:border-slate-700 hover:border-emerald-500/60 bg-slate-50/40 dark:bg-slate-900/40'
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />

        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-emerald-500/10 to-teal-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform shadow-sm">
          <Upload className="w-7 h-7" />
        </div>

        <h4 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-slate-100">
          Drag & Drop medical records here, or{' '}
          <span className="text-emerald-600 dark:text-emerald-400 underline">Browse Files</span>
        </h4>

        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm">
          Upload prescriptions, lab reports, imaging scans, or discharge summaries (Up to 25 MB).
        </p>

        <div className="flex items-center gap-2 mt-4 text-[11px] text-slate-500 dark:text-slate-400 font-mono flex-wrap justify-center">
          <span className="px-2 py-0.5 rounded bg-slate-200/60 dark:bg-slate-800">PDF</span>
          <span className="px-2 py-0.5 rounded bg-slate-200/60 dark:bg-slate-800">PNG</span>
          <span className="px-2 py-0.5 rounded bg-slate-200/60 dark:bg-slate-800">CSV</span>
          <span className="px-2 py-0.5 rounded bg-slate-200/60 dark:bg-slate-800">DICOM</span>
        </div>
      </div>

      {/* Uploading / Processing / Completed / Failed Status Overlay */}
      <AnimatePresence>
        {uploadStatus && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={cn(
              'p-4 rounded-2xl border transition-all space-y-3 relative overflow-hidden',
              uploadStatus === 'Completed'
                ? 'bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-500/40 glow-emerald'
                : uploadStatus === 'Failed'
                ? 'bg-rose-50/70 dark:bg-rose-950/40 border-rose-500/40'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-md'
            )}
          >
            {/* Animated Laser Scanline during OCR Processing */}
            {uploadStatus === 'Processing' && (
              <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-scanline pointer-events-none shadow-[0_0_12px_#06b6d4]" />
            )}

            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-2.5">
                {uploadStatus === 'Uploading' && (
                  <Upload className="w-5 h-5 text-cyan-500 animate-bounce" />
                )}
                {uploadStatus === 'Processing' && (
                  <Sparkles className="w-5 h-5 text-indigo-500 animate-spin" />
                )}
                {uploadStatus === 'Completed' && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                )}
                {uploadStatus === 'Failed' && (
                  <AlertCircle className="w-5 h-5 text-rose-500" />
                )}

                <div>
                  <h4 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <span>
                      {uploadStatus === 'Uploading' && 'Uploading Document...'}
                      {uploadStatus === 'Processing' && 'Processing Clinical OCR & Tokens...'}
                      {uploadStatus === 'Completed' && 'Document Ingested & Verified!'}
                      {uploadStatus === 'Failed' && 'Document Upload Failed'}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      {uploadProgress}%
                    </span>
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {uploadStatus === 'Failed'
                      ? failureMessage
                      : currentFile?.name || 'Medical Record File'}
                  </p>
                </div>
              </div>

              {uploadStatus === 'Failed' && (
                <AnimatedButton
                  variant="danger"
                  size="sm"
                  leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
                  onClick={handleRetry}
                >
                  Retry Upload
                </AnimatedButton>
              )}
            </div>

            {/* Progress Bar with Gradient Glow */}
            <div className="w-full h-2.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden relative shadow-inner">
              <motion.div
                className={cn(
                  'h-full rounded-full transition-all duration-300 relative',
                  uploadStatus === 'Failed'
                    ? 'bg-rose-500'
                    : 'bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 shadow-[0_0_8px_rgba(20,184,166,0.5)]'
                )}
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick Demo Template Ingestion Chips */}
      <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800/60">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
          One-Click Demo Diagnostic Files (Simulate Instant Clinical Intake)
        </span>
        <div className="flex items-center gap-2 flex-wrap">
          {DEMO_PRESETS.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() =>
                processFileIngestion(preset.name, preset.size, preset.format, preset)
              }
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100/90 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:text-emerald-400 border border-slate-200/80 dark:border-slate-700/80 transition-all flex items-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5 text-emerald-500" />
              <span>{preset.name}</span>
              <span className="text-[10px] text-slate-400">({preset.size})</span>
            </button>
          ))}
        </div>
      </div>
    </GlassCard>
  )
}
