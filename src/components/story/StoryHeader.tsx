import React from 'react'
import { Printer, Share2, Info, Volume2 } from 'lucide-react'
import { PageHeader } from '../ui/PageHeader'
import { AyuButton } from '../ui/AyuButton'
import { AyuCard } from '../ui/AyuCard'
import { useNotifications } from '../../contexts/NotificationContext'
import { useAccessibility } from '../../contexts/AccessibilityContext'

export interface StoryHeaderProps {
  onScrollToSection: (id: string) => void
}

export const StoryHeader: React.FC<StoryHeaderProps> = ({ onScrollToSection }) => {
  const { notifySuccess, notifyInfo } = useNotifications()
  const { speakText } = useAccessibility()

  const storySections = [
    { id: 'section-profile', label: '1. Profile' },
    { id: 'section-concern', label: '2. Concern' },
    { id: 'section-statements', label: '3. Statements' },
    { id: 'section-timeline', label: '4. Timeline' },
    { id: 'section-docs', label: '5. Documents' },
    { id: 'section-history', label: '6. History' },
    { id: 'section-family', label: '7. Family' },
    { id: 'section-meds', label: '8. Medications' },
    { id: 'section-unknown', label: '9. Unknown Zone' },
    { id: 'section-completeness', label: '10. Completeness' },
  ]

  return (
    <div className="space-y-5">
      <PageHeader
        title="My Health Story & Case Narrative"
        subtitle="A human-centered health chronicle synthesizing subjective lived experience with verified clinical records."
        breadcrumbs={[
          { label: 'Dashboard', href: '/patient/dashboard' },
          { label: 'Health Story' },
        ]}
        actions={
          <div className="flex items-center gap-2.5 flex-wrap">
            <AyuButton
              variant="secondary"
              size="sm"
              leftIcon={<Volume2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />}
              onClick={() =>
                speakText(
                  'Aarav Chen Health Story. Recurrent migraines since 2019, managed with lifestyle adjustments and Rizatriptan. Lived experiences, verified documents, and missing years are all synthesized here.'
                )
              }
            >
              Listen
            </AyuButton>
            <AyuButton
              variant="secondary"
              size="sm"
              leftIcon={<Printer className="w-4 h-4" />}
              onClick={() => {
                notifyInfo('Print Summary', 'Generating physician-ready PDF summary...')
                window.print()
              }}
            >
              Export
            </AyuButton>
            <AyuButton
              variant="primary"
              size="sm"
              leftIcon={<Share2 className="w-4 h-4" />}
              onClick={() => {
                notifySuccess('Case Shared', 'Secure encrypted link shared with Dr. Priya Sharma.')
              }}
            >
              Share with Doctor
            </AyuButton>
          </div>
        }
      />

      {/* Non-Diagnostic Clinical Synthesis Notice */}
      <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 text-amber-900 dark:text-amber-200 text-xs flex items-start gap-2.5">
        <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="font-semibold">Clinical Synthesis Protocol:</strong> AYUCASE organizes patient narrative statements and medical records for physician evaluation. AYUCASE{' '}
          <span className="font-semibold">does not provide medical diagnoses or treatment recommendations</span>. All clinical decisions remain solely with your licensed physician.
        </div>
      </div>

      {/* Section Quick Nav Bar */}
      <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 shrink-0 pl-2">
            Jump to:
          </span>
          <div className="flex items-center gap-1.5 flex-nowrap shrink-0">
            {storySections.map((sec) => (
              <button
                key={sec.id}
                type="button"
                onClick={() => onScrollToSection(sec.id)}
                className="px-2.5 py-1 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 transition-colors shrink-0 whitespace-nowrap cursor-pointer"
              >
                {sec.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
