import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  HeartPulse,
  Stethoscope,
  Shield,
  Sparkles,
  ArrowRight,
  Eye,
  CheckCircle2,
  Lock,
  MessageSquareText,
  FileText,
  Clock,
  Radio,
  Package,
  Layers,
  ChevronRight,
  Check,
} from 'lucide-react'
import { AyuCard, AyuCardHeader, AyuCardContent } from '../../components/ui/AyuCard'
import { AyuButton } from '../../components/ui/AyuButton'
import { AyuBadge } from '../../components/ui/AyuBadge'
import { MedicalVisual3D } from '../../components/canvas/MedicalVisual3D'
import { useLanguage } from '../../contexts/LanguageContext'
import { useAuth } from '../../contexts/AuthContext'
import { useNotifications } from '../../contexts/NotificationContext'

export const LandingPage: React.FC = () => {
  const { t } = useLanguage()
  const { loginAsPatient, loginAsPhysician } = useAuth()
  const { notifySuccess } = useNotifications()
  const navigate = useNavigate()

  const handleQuickPatient = async () => {
    await loginAsPatient('demo-pt-1')
    notifySuccess('Welcome, Aarav Chen', 'Navigating to language selection.')
    navigate('/patient/language')
  }

  const handleQuickPhysician = async () => {
    await loginAsPhysician('demo-md-1')
    notifySuccess('Welcome, Dr. Vance', 'Clinical workstation active.')
    navigate('/physician/dashboard')
  }

  return (
    <div className="relative min-h-[calc(100vh-70px)] py-8 sm:py-16 px-4 sm:px-6 max-w-7xl mx-auto space-y-20 sm:space-y-28">
      {/* Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="lg:col-span-7 space-y-6"
        >
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs sm:text-sm font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Patient-Centered Clinical Intelligence</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-slate-100 tracking-tight leading-[1.12]">
            Your health record, <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 dark:from-emerald-400 dark:via-teal-300 dark:to-cyan-400 bg-clip-text text-transparent">
              understood as a whole.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
            A calm, patient-centered health intelligence platform that connects your lived health story, medical documents, chronological timeline, and clinical review into one coherent picture.
          </p>

          {/* Primary Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
            <AyuButton
              to="/patient/login"
              variant="primary"
              size="lg"
              leftIcon={<HeartPulse className="w-5 h-5" />}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Patient Portal
            </AyuButton>

            <AyuButton
              to="/physician/login"
              variant="secondary"
              size="lg"
              leftIcon={<Stethoscope className="w-5 h-5 text-teal-600 dark:text-teal-400" />}
            >
              Physician Workstation
            </AyuButton>
          </div>

          {/* 1-Click Interactive Demo Jumps */}
          <div className="pt-4 flex flex-wrap items-center gap-2.5">
            <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mr-1">
              Explore Demo:
            </span>
            <button
              type="button"
              onClick={handleQuickPatient}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-800 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
            >
              <HeartPulse className="w-3.5 h-3.5 text-emerald-500" />
              <span>Patient (Aarav Chen)</span>
            </button>
            <button
              type="button"
              onClick={handleQuickPhysician}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-800 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
            >
              <Stethoscope className="w-3.5 h-3.5 text-teal-500" />
              <span>Physician (Dr. Vance)</span>
            </button>
          </div>
        </motion.div>

        {/* 3D Visual Column - Supportive, Not Overpowering */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="lg:col-span-5"
        >
          <AyuCard variant="default" padding="sm" className="relative shadow-xl border border-slate-200/90 dark:border-slate-800">
            <div className="h-64 sm:h-72 w-full relative rounded-xl overflow-hidden bg-slate-950">
              <MedicalVisual3D />
              <div className="absolute bottom-3 left-3 right-3 p-2.5 rounded-xl bg-slate-900/90 backdrop-blur-md text-white border border-slate-700/70 text-xs flex items-center justify-between">
                <span className="flex items-center gap-2 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  3D Anatomical Biomesh
                </span>
                <span className="text-[11px] text-slate-400 font-mono">Real-time Simulation</span>
              </div>
            </div>

            <div className="p-4 grid grid-cols-2 gap-3 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200/60 dark:border-slate-800">
                <p className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-amber-500" /> Elder Mode
                </p>
                <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">
                  High contrast & voice assistance
                </p>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200/60 dark:border-slate-800">
                <p className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-emerald-500" /> Full Autonomy
                </p>
                <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">
                  Granular patient consent
                </p>
              </div>
            </div>
          </AyuCard>
        </motion.div>
      </div>

      {/* How AYUCASE Works Section */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <AyuBadge variant="teal" size="md">Workflow Architecture</AyuBadge>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            How AYUCASE Works
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
            A cohesive pipeline bridging patient recollection with empirical clinical documentation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Step 1 */}
          <AyuCard variant="default" padding="md" className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-700 dark:text-emerald-400 font-bold text-sm">
              01
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <MessageSquareText className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              Patient Voice & Story
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Patients describe symptoms in their own words via multilingual voice or guided interview questions, capturing real lived experiences.
            </p>
          </AyuCard>

          {/* Step 2 */}
          <AyuCard variant="default" padding="md" className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 flex items-center justify-center text-teal-700 dark:text-teal-400 font-bold text-sm">
              02
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <FileText className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              Document Ingestion
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Reports, laboratory panels, prescriptions, and radiology scans are ingested, structured, and cross-referenced with full source traceability.
            </p>
          </AyuCard>

          {/* Step 3 */}
          <AyuCard variant="default" padding="md" className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-50 dark:bg-cyan-950/60 border border-cyan-200 dark:border-cyan-800 flex items-center justify-center text-cyan-700 dark:text-cyan-400 font-bold text-sm">
              03
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              Chronological Timeline
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Disparate encounters are automatically merged into an interactive timeline that highlights missing history and clinical patterns.
            </p>
          </AyuCard>

          {/* Step 4 */}
          <AyuCard variant="default" padding="md" className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-indigo-700 dark:text-indigo-400 font-bold text-sm">
              04
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Radio className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              Clinical Synthesis
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Physicians access 3-panel clinical workstations with Contradiction Radars that detect differences between patient memories and lab metrics.
            </p>
          </AyuCard>
        </div>
      </section>

      {/* Flagship Features Grid */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <AyuBadge variant="emerald" size="md">Core Capabilities</AyuBadge>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Designed for Trust, Speed & Clarity
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <AyuCard variant="interactive" onClick={() => navigate('/patient/capsule')} className="p-6">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center mb-4">
              <Package className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">
              AyuCase Care Capsule
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Export and share a structured, verifiable health dossier containing stories, labs, verified timelines, and clinical notes for second opinions.
            </p>
          </AyuCard>

          <AyuCard variant="interactive" onClick={() => navigate('/physician/contradictions')} className="p-6">
            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 flex items-center justify-center mb-4">
              <Radio className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">
              Contradiction Radar
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Automated clinical gap detection surfaces variances between patient recollections and laboratory findings before misdiagnoses occur.
            </p>
          </AyuCard>

          <AyuCard variant="interactive" onClick={() => navigate('/patient/consent')} className="p-6">
            <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-950/60 text-teal-700 dark:text-teal-400 flex items-center justify-center mb-4">
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">
              Consent Control Center
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Granular patient permissions for voice recordings, laboratory records, health timelines, and physician sharing with full revocability.
            </p>
          </AyuCard>
        </div>
      </section>

      {/* Trust & Simulation Notice */}
      <section className="p-6 sm:p-8 rounded-2xl bg-slate-100/70 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-center max-w-4xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
          <Lock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Local Simulation & Data Privacy</span>
        </div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
          Privacy-Safe Interactive Healthcare Sandbox
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto">
          AYUCASE operates in an audit-ready demo environment. All patient profiles, diagnostic findings, and clinical cases are simulated and persist safely in browser storage without external transmission.
        </p>
      </section>

      {/* Footer */}
      <footer className="pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
        <div>© 2026 AYUCASE Clinical Technologies • Dual-Portal Architecture</div>
        <div className="flex items-center gap-4">
          <Link to="/patient/login" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
            Patient Portal
          </Link>
          <Link to="/physician/login" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
            Physician Workstation
          </Link>
          <Link to="/patient/consent" className="hover:text-slate-900 dark:hover:text-slate-200 transition-colors">
            Consent & Privacy
          </Link>
        </div>
      </footer>
    </div>
  )
}
