import React from 'react'
import { Link } from 'react-router-dom'
import { Clock, ExternalLink } from 'lucide-react'
import { AyuCard } from '../ui/AyuCard'

export const SymptomTimeline: React.FC = () => {
  const milestones = [
    {
      year: '2019',
      title: 'First Episodic Tension-Type Cephalea',
      desc: 'Bilateral mild pressure logged after consecutive 12-hour programming sprints.',
    },
    {
      year: '2021',
      title: 'Visual Aura Identification & Optometry Workup',
      desc: 'First scintillating scotoma noted. Comprehensive fundus examination ruled out retinal tears.',
    },
    {
      year: '2023',
      title: 'Severe Frequency Surge (4–6 Episodes / Month)',
      desc: 'Escalation to chronic migraine criteria; brief ED visit for abortive IV hydration.',
    },
    {
      year: '2024',
      title: 'Apollo Neurology Workup & 3T Neuroimaging',
      desc: 'Formal diagnosis of Neurovascular Migraine with aura; 3T MRI confirmed normal parenchymal structure.',
    },
    {
      year: '2025',
      title: 'Autonomic Reflex Testing & Propranolol Prophylaxis',
      desc: 'Cardiovagal hypo-reactivity detected; Propranolol 40mg BID initiated with good response.',
    },
    {
      year: '2026',
      title: 'AYUCASE Integrative Case Synthesis Active',
      desc: 'Onboarding with Dr. Priya Sharma; continuous biometric and narrative alignment.',
    },
  ]

  return (
    <section id="section-timeline" className="scroll-mt-24 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Section 4 • Medical Timeline & Milestones
          </h2>
        </div>
        <Link
          to="/patient/timeline"
          className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 flex items-center gap-1 transition-colors"
        >
          <span>Open Interactive Timeline</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>

      <AyuCard variant="default" padding="lg" className="space-y-4">
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          Longitudinal illness progression synthesized across 6 milestone eras from 2019 to 2026.
        </p>

        <div className="relative pl-6 border-l-2 border-emerald-500/30 space-y-6 pt-1">
          {milestones.map((node) => (
            <div key={node.year} className="relative group">
              <span className="absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full bg-emerald-600 border-2 border-white dark:border-slate-900 group-hover:scale-125 transition-transform" />
              <div>
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 font-mono">
                  {node.year}
                </span>
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                  {node.title}
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed">
                  {node.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </AyuCard>
    </section>
  )
}
