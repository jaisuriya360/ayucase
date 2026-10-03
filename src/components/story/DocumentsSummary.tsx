import React from 'react'
import { Link } from 'react-router-dom'
import { FileText, ExternalLink, CheckCircle2 } from 'lucide-react'
import { AyuCard } from '../ui/AyuCard'
import { AyuBadge } from '../ui/AyuBadge'

export const DocumentsSummary: React.FC = () => {
  const documents = [
    {
      name: 'Brain MRI 3T Volumetric Protocol.pdf',
      date: '24 May 2024',
      provider: 'Apollo Hospital',
      finding: 'Normal parenchyma, patent circle of Willis',
      status: 'Verified',
      badgeVariant: 'emerald' as const,
    },
    {
      name: 'Comprehensive Autonomic Reflex Screen.pdf',
      date: '18 Jan 2025',
      provider: 'CareLife Diagnostics',
      finding: 'Valsalva ratio 1.34, cardiovagal hypo-reactivity',
      status: 'Verified',
      badgeVariant: 'emerald' as const,
    },
    {
      name: 'Prescription Schedule.pdf',
      date: '12 Aug 2025',
      provider: 'Dr. Priya Sharma, MD',
      finding: 'Propranolol 40mg BID & Rizatriptan 10mg PRN',
      status: 'Active',
      badgeVariant: 'cyan' as const,
    },
  ]

  return (
    <section id="section-docs" className="scroll-mt-24 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Section 5 • Documents & Clinical Records
          </h2>
        </div>
        <Link
          to="/patient/documents"
          className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 flex items-center gap-1 transition-colors"
        >
          <span>Open Document Vault</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {documents.map((doc, idx) => (
          <AyuCard key={idx} variant="default" padding="md" className="flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-mono text-emerald-700 dark:text-emerald-400 font-semibold">
                  {doc.date}
                </span>
                <AyuBadge variant={doc.badgeVariant} size="sm">
                  {doc.status}
                </AyuBadge>
              </div>
              <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-slate-100 truncate">
                {doc.name}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Facility: {doc.provider}
              </p>
              <p className="text-xs text-slate-700 dark:text-slate-300 font-medium mt-2 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800">
                {doc.finding}
              </p>
            </div>

            <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-emerald-700 dark:text-emerald-400 font-semibold">
              <span>Structured Metadata Linked</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </div>
          </AyuCard>
        ))}
      </div>
    </section>
  )
}
