import React from 'react'
import { motion } from 'framer-motion'
import {
  Info,
  Pill,
  Activity,
  FileText,
  Stethoscope,
  ExternalLink,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'
import type { MedicalDocument, SourceTraceabilityItem } from '../../types/document'
import { GlassCard } from '../ui/GlassCard'
import { cn } from '../../utils/cn'

export interface SourceTraceabilityExplorerProps {
  documents: MedicalDocument[]
  onOpenDocumentSource: (documentId: string, pageNumber: number) => void
  className?: string
}

export const SourceTraceabilityExplorer: React.FC<SourceTraceabilityExplorerProps> = ({
  documents,
  onOpenDocumentSource,
  className,
}) => {
  // Extract all traceable items from documents
  const traceableItems: SourceTraceabilityItem[] = []

  documents.forEach((doc) => {
    if (!doc.extractedData) return

    // Extract Medications
    doc.extractedData.medications.forEach((med) => {
      traceableItems.push({
        id: med.id,
        itemType: 'Medication',
        title: `${med.name} ${med.dosage}`,
        value: `${med.frequency} (Prescribed by ${med.prescribedBy})`,
        documentId: doc.id,
        documentName: doc.name,
        pageNumber: med.pageNumber,
        snippet: `Rx: ${med.name} ${med.dosage} - ${med.frequency}`,
        date: doc.date,
      })
    })

    // Extract Findings
    doc.extractedData.keyFindings.forEach((kf) => {
      traceableItems.push({
        id: kf.id,
        itemType: 'Finding',
        title: kf.title,
        value: kf.value,
        documentId: doc.id,
        documentName: doc.name,
        pageNumber: kf.pageNumber,
        snippet: kf.value,
        date: doc.date,
      })
    })

    // Extract Lab Values
    doc.extractedData.labValues.forEach((lv) => {
      traceableItems.push({
        id: lv.id,
        itemType: 'Lab Result',
        title: `${lv.test}: ${lv.result} ${lv.unit}`,
        value: `Ref: ${lv.referenceRange} (${lv.flag})`,
        documentId: doc.id,
        documentName: doc.name,
        pageNumber: lv.pageNumber,
        snippet: `${lv.test} = ${lv.result} ${lv.unit} (Ref: ${lv.referenceRange})`,
        date: doc.date,
      })
    })
  })

  const getItemIcon = (type: SourceTraceabilityItem['itemType']) => {
    switch (type) {
      case 'Medication':
        return <Pill className="w-4 h-4 text-emerald-500" />
      case 'Lab Result':
        return <Activity className="w-4 h-4 text-indigo-500" />
      case 'Finding':
      default:
        return <FileText className="w-4 h-4 text-cyan-500" />
    }
  }

  return (
    <GlassCard variant="default" className={cn('p-5 sm:p-7 space-y-5', className)}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <h3 className="font-black text-base sm:text-lg text-slate-900 dark:text-slate-100 tracking-tight">
              Clinical Source Traceability Explorer
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Every clinical parameter extracted by AyuCase references its original source document and page number.
          </p>
        </div>

        <span className="text-xs px-3 py-1 rounded-full font-bold bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border border-cyan-500/20 self-start sm:self-auto">
          {traceableItems.length} Verified Citations
        </span>
      </div>

      {/* Grid of Traceable Entity Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {traceableItems.map((item) => (
          <motion.div
            key={item.id}
            whileHover={{ scale: 1.02, y: -2 }}
            onClick={() => onOpenDocumentSource(item.documentId, item.pageNumber)}
            className="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 hover:border-emerald-500/50 hover:shadow-md hover:shadow-emerald-500/5 transition-all cursor-pointer flex flex-col justify-between group select-none"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center gap-1">
                  {getItemIcon(item.itemType)}
                  <span>{item.itemType}</span>
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {item.date}
                </span>
              </div>

              <h4 className="font-extrabold text-sm text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-1">
                {item.title}
              </h4>

              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                {item.value}
              </p>
            </div>

            {/* Mandated Source Badge */}
            <div className="mt-3.5 pt-2.5 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between">
              <div className="text-[11px] font-bold text-cyan-600 dark:text-cyan-400 flex items-center gap-1.5 truncate pr-2">
                <Info className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">
                  Source: {item.documentName} • Page: {item.pageNumber}
                </span>
              </div>
              <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-emerald-500 group-hover:translate-x-0.5 transition-all shrink-0" />
            </div>
          </motion.div>
        ))}
      </div>
    </GlassCard>
  )
}
