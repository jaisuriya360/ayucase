import React, { useState } from 'react'
import {
  Users,
  Stethoscope,
  Volume2,
  FileText,
  Clock,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  Info,
  Layers,
  ChevronRight,
} from 'lucide-react'
import { GlassCard } from '../ui/GlassCard'
import type { ClinicalCase } from '../../types/clinicalCase'
import { useAccessibility } from '../../contexts/AccessibilityContext'
import { cn } from '../../utils/cn'

interface PatientPhysicianMirrorViewProps {
  currentCase: ClinicalCase
  onOpenSource?: (citationId: string) => void
}

export const PatientPhysicianMirrorView: React.FC<PatientPhysicianMirrorViewProps> = ({
  currentCase,
  onOpenSource,
}) => {
  const [activeTab, setActiveTab] = useState<'patient' | 'physician'>('patient')
  const { speakText } = useAccessibility()

  const handleReadPatientStory = () => {
    const speech = `Hello ${currentCase.patientName}. This is your health story. You visited us because of severe throbbing head pains around your left eye and temples. Our tests show your brain scans are completely normal and healthy. Your morning blood vessel calmer medicine is helping, and you have emergency relief tablets when flashing lights occur. We are working together on your care.`
    speakText(speech)
  }

  return (
    <GlassCard variant="default" className="p-6 space-y-6 border border-slate-200 dark:border-slate-800">
      {/* Top Bar with Tab Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100">
              Patient–Physician Case Mirror
            </h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 uppercase">
              Bilateral Perspective
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Same verified clinical dataset translated for two distinct communication paradigms
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
          <button
            type="button"
            onClick={() => setActiveTab('patient')}
            className={cn(
              'px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer',
              activeTab === 'patient'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            )}
          >
            <Users className="w-4 h-4 text-emerald-500" />
            <span>PATIENT VIEW</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('physician')}
            className={cn(
              'px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer',
              activeTab === 'physician'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            )}
          >
            <Stethoscope className="w-4 h-4 text-cyan-500" />
            <span>PHYSICIAN VIEW</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: PATIENT VIEW (Simple wording, large text, voice) */}
      {activeTab === 'patient' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Audio Bar */}
          <div className="p-4 rounded-2xl bg-emerald-500/10 border-2 border-emerald-500/30 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl">🧓</span>
              <div>
                <span className="font-extrabold text-sm text-emerald-900 dark:text-emerald-300 block">
                  Listen to Your Health Summary
                </span>
                <p className="text-xs text-emerald-700 dark:text-emerald-400">
                  Read aloud in clear, gentle, patient-friendly spoken language
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleReadPatientStory}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-md shadow-emerald-600/20 cursor-pointer"
            >
              <Volume2 className="w-4 h-4" />
              <span>Read Aloud</span>
            </button>
          </div>

          {/* Simple Wording Cards with Large Typography */}
          <div className="space-y-4">
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                What You Told Us (Your Concern)
              </span>
              <p className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 leading-relaxed">
                "You experience strong throbbing pain on one side of your head. Before the pain starts, you see flashing zig-zag lights and feel very tired."
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block">
                What Your Tests Showed (Reassuring News)
              </span>
              <p className="text-base sm:text-lg font-semibold text-slate-800 dark:text-slate-200 leading-relaxed">
                ✓ Your 3D brain scans were completely normal. There are no dangerous blood vessel blockages or structural problems inside your head.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400 block">
                Your Medicines (Daily & As-Needed)
              </span>
              <ul className="space-y-2 text-sm sm:text-base font-medium text-slate-700 dark:text-slate-300">
                <li className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-500" />
                  <span><strong>Morning & Evening:</strong> Blood vessel calming capsule (Propranolol) to prevent attacks.</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span><strong>As Needed:</strong> Rapid relief tablet (Sumatriptan) taken as soon as you see light flashes.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: PHYSICIAN VIEW (Structured info, timeline, source, documents) */}
      {activeTab === 'physician' && (
        <div className="space-y-6 animate-fadeIn text-xs">
          {/* Dense Structured Metadata */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                ICHD-3 Classification
              </span>
              <span className="font-mono font-bold text-slate-900 dark:text-slate-100">
                1.2.1.1 Episodic Migraine with Typical Aura
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Autonomic Manifestations
              </span>
              <span className="font-bold text-slate-900 dark:text-slate-100">
                Facial Flushing, Conjunctival Injection, Circadian Fatigue
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Chronobiology Correlation
              </span>
              <span className="font-bold text-indigo-600 dark:text-indigo-400">
                Non-Dipping Nocturnal BP Pattern (r=0.84)
              </span>
            </div>
          </div>

          {/* Timeline Milestones & Source Traceability */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-cyan-500" />
                <span>Longitudinal Chronology & Diagnostic Sources</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                Source Document Traceability Active
              </span>
            </div>

            <div className="space-y-3">
              {currentCase.timelineEvents.map((evt, i) => (
                <div
                  key={i}
                  className="p-3 rounded-xl bg-white/70 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-cyan-600 dark:text-cyan-400">
                        {evt.year}
                      </span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        {evt.title}
                      </span>
                      <span className="text-[10px] text-slate-400">• {evt.date}</span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 text-xs">
                      {evt.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {evt.type}
                    </span>
                    <button
                      type="button"
                      onClick={() => onOpenSource?.(currentCase.sourceCitations?.[0]?.id || 'cit-1')}
                      className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 flex items-center gap-1 cursor-pointer"
                    >
                      <Info className="w-3 h-3" />
                      <span>Source</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Extracted Document Attachments */}
          <div className="space-y-2">
            <span className="font-bold text-xs text-slate-500 dark:text-slate-400 block">
              Direct Document Attachments ({currentCase.documents.length})
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {currentCase.documents.map((doc) => (
                <div
                  key={doc.id}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between"
                >
                  <div className="min-w-0 pr-2">
                    <span className="font-bold text-slate-800 dark:text-slate-200 truncate block">
                      {doc.name}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {doc.pages} pages • {doc.date}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 shrink-0">
                    Verified ✓
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </GlassCard>
  )
}
