import React from 'react'
import { Clock, Calendar, ShieldCheck, Stethoscope } from 'lucide-react'
import { PageHeader } from '../../components/ui/PageHeader'
import { GlassCard } from '../../components/ui/GlassCard'
import { usePhysician } from '../../contexts/PhysicianContext'
import { usePatient } from '../../contexts/PatientContext'
import { formatDate } from '../../utils/formatters'

export const PhysicianTimelinePage: React.FC = () => {
  const { selectedCase } = usePhysician()
  const { patient } = usePatient()

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <PageHeader
        title="Diagnostic Trajectory Mapping"
        subtitle={`Chronological correlation of consultations, lab results, and patient symptom spikes for ${selectedCase?.patientName || patient.name}.`}
        breadcrumbs={[
          { label: 'Workstation', href: '/physician/dashboard' },
          { label: 'Diagnostic Timeline' },
        ]}
      />

      <div className="relative border-l-2 border-slate-200 dark:border-slate-800 ml-4 sm:ml-6 space-y-6 py-2">
        {patient.timeline.map((event) => (
          <div key={event.id} className="relative pl-6 sm:pl-8 group">
            <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-cyan-500 border-4 border-white dark:border-slate-900 group-hover:scale-125 transition-transform" />

            <GlassCard variant="default" className="p-5">
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 uppercase">
                  {event.category}
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  {formatDate(event.date)}
                </span>
              </div>

              <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
                {event.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
                {event.description}
              </p>

              {event.physicianNote && (
                <div className="mt-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700/80 text-xs">
                  <span className="font-bold text-slate-700 dark:text-slate-300 block mb-0.5">
                    Consultation Annotation:
                  </span>
                  <span className="text-slate-600 dark:text-slate-400 italic">
                    "{event.physicianNote}"
                  </span>
                </div>
              )}
            </GlassCard>
          </div>
        ))}
      </div>
    </div>
  )
}
