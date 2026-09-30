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
} from 'lucide-react'
import { GlassCard } from '../../components/ui/GlassCard'
import { AnimatedButton } from '../../components/ui/AnimatedButton'
import { MedicalVisual3D } from '../../components/canvas/MedicalVisual3D'
import { useLanguage } from '../../contexts/LanguageContext'
import { useAuth } from '../../contexts/AuthContext'
import { useNotifications } from '../../contexts/NotificationContext'

export const LandingPage: React.FC = () => {
  const { t, language } = useLanguage()
  const { loginAsPatient, loginAsPhysician } = useAuth()
  const { notifySuccess } = useNotifications()
  const navigate = useNavigate()

  const handleQuickPatient = async () => {
    await loginAsPatient('demo-pt-1')
    notifySuccess('Demo Patient Signed In', 'Navigating to language selection.')
    navigate('/patient/language')
  }

  const handleQuickPhysician = async () => {
    await loginAsPhysician('demo-md-1')
    notifySuccess('Demo Physician Signed In', 'Navigating to clinical workstation.')
    navigate('/physician/dashboard')
  }

  return (
    <div className="relative min-h-[calc(100vh-70px)] flex flex-col justify-between py-6 sm:py-12 px-4 sm:px-6 max-w-7xl mx-auto cinematic-backdrop">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-emerald-500/10 via-cyan-500/10 to-indigo-500/5 blur-3xl pointer-events-none rounded-full" />

      {/* Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center my-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-7 space-y-6"
        >
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/25 text-emerald-700 dark:text-emerald-300 text-xs sm:text-sm font-semibold shadow-sm backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
            <span>AI-Synthesized Patient Narrative Architecture</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-slate-100 tracking-tight leading-[1.12]">
            {t('landing.title')}
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
            {t('landing.subtitle')}
          </p>

          {/* Dual Portal Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3">
            {/* Patient Portal Card */}
            <GlassCard
              variant="interactive"
              glow="emerald"
              onClick={() => navigate('/patient/login')}
              className="p-5 flex flex-col justify-between group border border-slate-200/90 dark:border-slate-800"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-4 group-hover:scale-105 transition-transform shadow-sm">
                  <HeartPulse className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-1">
                  {t('landing.patientPortal')}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
                  {t('landing.patientDesc')}
                </p>
              </div>

              <div className="flex items-center justify-between text-xs font-bold text-emerald-600 dark:text-emerald-400 pt-2 border-t border-slate-200/60 dark:border-slate-800">
                <span>Enter as Patient</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </GlassCard>

            {/* Physician Portal Card */}
            <GlassCard
              variant="interactive"
              glow="cyan"
              onClick={() => navigate('/physician/login')}
              className="p-5 flex flex-col justify-between group border border-slate-200/90 dark:border-slate-800"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-teal-600 dark:text-cyan-400 mb-4 group-hover:scale-105 transition-transform shadow-sm">
                  <Stethoscope className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-1">
                  {t('landing.physicianPortal')}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
                  {t('landing.physicianDesc')}
                </p>
              </div>

              <div className="flex items-center justify-between text-xs font-bold text-teal-600 dark:text-cyan-400 pt-2 border-t border-slate-200/60 dark:border-slate-800">
                <span>Enter Workstation</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </GlassCard>
          </div>

          {/* Quick Demo Launchers */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              1-Click Demo Jump:
            </span>
            <AnimatedButton
              variant="secondary"
              size="sm"
              onClick={handleQuickPatient}
              leftIcon={<HeartPulse className="w-3.5 h-3.5 text-emerald-500" />}
            >
              Demo Patient (Aarav Chen)
            </AnimatedButton>
            <AnimatedButton
              variant="secondary"
              size="sm"
              onClick={handleQuickPhysician}
              leftIcon={<Stethoscope className="w-3.5 h-3.5 text-cyan-500" />}
            >
              Demo Physician (Dr. Vance)
            </AnimatedButton>
          </div>

          {/* Telemetry Micro-Pills */}
          <div className="pt-3 flex flex-wrap items-center gap-2 text-[11px] font-mono text-slate-500 dark:text-slate-400">
            <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              0ms Local Latency
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
              6 Indian Languages
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              Elder High-Contrast Mode
            </span>
          </div>
        </motion.div>

        {/* 3D Visual & Highlight Column */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="lg:col-span-5 relative"
        >
          <GlassCard variant="elevated" className="p-6 relative overflow-hidden border border-slate-200/90 dark:border-slate-700/80 shadow-2xl">
            {/* Ambient biological 3D canvas */}
            <div className="h-64 sm:h-72 w-full relative">
              <MedicalVisual3D />
              <div className="absolute bottom-2 left-2 right-2 p-3 rounded-xl bg-slate-900/85 backdrop-blur-md text-white border border-slate-700/70 text-xs flex items-center justify-between shadow-lg">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  Three.js 3D Helical Mesh Active
                </span>
                <span className="text-[10px] text-slate-300 font-mono">Interactive WebGL</span>
              </div>
            </div>

            {/* Feature highlights */}
            <div className="mt-5 space-y-3">
              <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                <Eye className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <span className="font-bold text-slate-900 dark:text-slate-100 block">
                    Elder Mode Architecture
                  </span>
                  <span className="text-slate-500 dark:text-slate-400">
                    High contrast, simplified touch zones, and read-aloud support for seniors.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                <Lock className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <span className="font-bold text-slate-900 dark:text-slate-100 block">
                    Zero-Knowledge Sandbox
                  </span>
                  <span className="text-slate-500 dark:text-slate-400">
                    Fictional demonstration data only. Real Aadhaar and ABHA credentials never requested.
                  </span>
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>

      {/* Bottom privacy footer notice */}
      <div className="pt-8 border-t border-slate-200/80 dark:border-slate-800/80 text-center text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-3 relative z-10">
        <span>© 2026 AYUCASE Clinical Technologies — Phase 0 & Phase 2 Foundation</span>
        <span className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
          <Shield className="w-3.5 h-3.5" />
          Fictional Demo Session Active (Browser LocalStorage)
        </span>
      </div>
    </div>
  )
}
