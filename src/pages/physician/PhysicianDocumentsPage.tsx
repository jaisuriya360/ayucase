import React from 'react'
import { FileText, Download, CheckCircle2, ShieldCheck, Eye } from 'lucide-react'
import { PageHeader } from '../../components/ui/PageHeader'
import { GlassCard } from '../../components/ui/GlassCard'
import { AnimatedButton } from '../../components/ui/AnimatedButton'
import { usePatient } from '../../contexts/PatientContext'
import { useNotifications } from '../../contexts/NotificationContext'

export const PhysicianDocumentsPage: React.FC = () => {
  const { patient } = usePatient()
  const { notifySuccess } = useNotifications()

  return (
    <div className="space-y-6">
      <PageHeader
        title="Verified Clinical Diagnostic Records"
        subtitle={`Audit-ready clinical document repository for patient ${patient.name} (${patient.fictionalId}).`}
        breadcrumbs={[
          { label: 'Workstation', href: '/physician/dashboard' },
          { label: 'Documents' },
        ]}
      />

      <div className="space-y-3">
        {patient.documents.map((doc) => (
          <GlassCard
            key={doc.id}
            variant="default"
            className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-600 dark:text-cyan-400 shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 truncate">
                  {doc.title}
                </h4>
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5 flex-wrap">
                  <span className="font-medium">{doc.category}</span>
                  <span>•</span>
                  <span>{doc.date}</span>
                  <span>•</span>
                  <span>{doc.fileSize}</span>
                  <span>•</span>
                  <span className="text-slate-400">{doc.provider}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                <ShieldCheck className="w-3.5 h-3.5" />
                Verified
              </span>
              <AnimatedButton
                variant="ghost"
                size="sm"
                onClick={() => notifySuccess('Document Viewer', `Opened ${doc.title}`)}
                leftIcon={<Eye className="w-4 h-4" />}
              >
                Inspect
              </AnimatedButton>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  )
}
