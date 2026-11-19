import React, { useState } from 'react'
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
  Users,
  Mail,
  Phone,
  MapPin,
  Send,
  HeartHandshake,
  Target,
  ShieldCheck,
  Info,
} from 'lucide-react'
import { AyuCard, AyuCardHeader, AyuCardContent } from '../../components/ui/AyuCard'
import { AyuButton } from '../../components/ui/AyuButton'
import { AyuBadge } from '../../components/ui/AyuBadge'
import heroHudImg from '../../assets/clinical-hud-hero.jpg'
import { useLanguage } from '../../contexts/LanguageContext'
import { useAuth } from '../../contexts/AuthContext'
import { useNotifications } from '../../contexts/NotificationContext'

export const LandingPage: React.FC = () => {
  const { t } = useLanguage()
  const { loginAsPatient, loginAsPhysician } = useAuth()
  const { notifySuccess } = useNotifications()
  const navigate = useNavigate()

  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    role: 'Patient / Caregiver',
    subject: '',
    message: '',
  })
  const [isSubmittingContact, setIsSubmittingContact] = useState(false)
  const [contactSubmitted, setContactSubmitted] = useState(false)

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmittingContact(true)
    setTimeout(() => {
      setIsSubmittingContact(false)
      setContactSubmitted(true)
      notifySuccess(
        'Message Received',
        `Thank you ${contactForm.name || 'for reaching out'}. Our clinical informatics team will respond to ${contactForm.email} within 24 hours.`
      )
      setContactForm({
        name: '',
        email: '',
        role: 'Patient / Caregiver',
        subject: '',
        message: '',
      })
    }, 700)
  }

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
    <div className="relative min-h-[calc(100vh-70px)] py-6 sm:py-12 md:py-16 px-3.5 sm:px-6 max-w-7xl mx-auto space-y-16 sm:space-y-24">
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

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-slate-100 tracking-tight leading-[1.14] break-words">
            Your health record, <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 dark:from-emerald-400 dark:via-teal-300 dark:to-cyan-400 bg-clip-text text-transparent">
              understood as a whole.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
            A calm, patient-centered health intelligence platform that connects your lived health story, medical documents, chronological timeline, and clinical review into one coherent picture.
          </p>

          {/* Main Action Buttons: Patient & Physician Portal Logins */}
          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-3.5">
            <Link
              to="/patient/login"
              className="group relative flex items-center justify-between gap-3 sm:gap-4 px-4.5 sm:px-6 py-3.5 sm:py-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-600/20 hover:shadow-xl transition-all duration-200 cursor-pointer border border-emerald-400/30 overflow-hidden w-full sm:w-auto"
            >
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0">
                <HeartPulse className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
              </div>
              <div className="text-left min-w-0 flex-1">
                <div className="text-[11px] font-semibold text-emerald-100 uppercase tracking-wider truncate">For Patients & Families</div>
                <div className="text-base sm:text-lg font-extrabold tracking-tight truncate">Patient Portal Login</div>
              </div>
              <ArrowRight className="w-5 h-5 shrink-0 ml-2 text-emerald-100 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/physician/login"
              className="group relative flex items-center justify-between gap-3 sm:gap-4 px-4.5 sm:px-6 py-3.5 sm:py-4 rounded-2xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-100 shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer border border-slate-200/90 dark:border-slate-700/80 overflow-hidden w-full sm:w-auto"
            >
              <div className="w-10 h-10 rounded-xl bg-teal-500/10 dark:bg-teal-400/10 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
                <Stethoscope className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </div>
              <div className="text-left min-w-0 flex-1">
                <div className="text-[11px] font-semibold text-teal-600 dark:text-teal-400 uppercase tracking-wider truncate">For Doctors & Clinics</div>
                <div className="text-base sm:text-lg font-extrabold tracking-tight truncate">Physician Portal Login</div>
              </div>
              <ArrowRight className="w-5 h-5 shrink-0 ml-2 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* 1-Click Interactive Demo Jumps */}
          <div className="pt-2 flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mr-1 w-full sm:w-auto">
              Explore Demo:
            </span>
            <button
              type="button"
              onClick={handleQuickPatient}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-800 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
            >
              <HeartPulse className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>Patient (Aarav Chen)</span>
            </button>
            <button
              type="button"
              onClick={handleQuickPhysician}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-800 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
            >
              <Stethoscope className="w-3.5 h-3.5 text-teal-500 shrink-0" />
              <span>Physician (Dr. Vance)</span>
            </button>
          </div>
        </motion.div>

        {/* Clinical Workspace HUD Graphic - Static & Fully Responsive */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="lg:col-span-5 w-full"
        >
          <AyuCard variant="default" padding="sm" className="relative shadow-2xl border border-slate-200/90 dark:border-slate-800 overflow-hidden">
            <div className="relative w-full rounded-xl overflow-hidden bg-slate-950 aspect-[16/10] sm:aspect-[16/9] lg:aspect-[16/10]">
              <img
                src={heroHudImg}
                alt="AyuCase Patient Profile and Health Intelligence Tablet"
                className="w-full h-full object-cover object-center"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-slate-950/20 pointer-events-none" />
              
              <div className="absolute bottom-2.5 sm:bottom-3 left-2.5 sm:left-3 right-2.5 sm:right-3 p-2 sm:p-2.5 rounded-xl bg-slate-900/90 backdrop-blur-md text-white border border-slate-700/70 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-2 z-10 shadow-lg">
                <span className="flex items-center gap-2 font-medium truncate">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                  <span className="truncate">Clinical Workspace</span>
                </span>
                <span className="text-[10px] sm:text-[11px] text-emerald-400 font-mono font-medium shrink-0">
                  Aarav Chen • Live Dossier
                </span>
              </div>
            </div>

            <div className="p-3 sm:p-4 grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200/60 dark:border-slate-800">
                <p className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-amber-500 shrink-0" /> Elder Mode
                </p>
                <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">
                  High contrast & voice assistance
                </p>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200/60 dark:border-slate-800">
                <p className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> Full Autonomy
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
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

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
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

      {/* About Us Section */}
      <section id="about" className="space-y-10 pt-6 scroll-mt-24">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <AyuBadge variant="emerald" size="md">About AYUCASE</AyuBadge>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Bridging the Divide Between Lived Health Stories & Clinical Records
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
            Modern healthcare collects vast amounts of diagnostic data, yet patients often struggle to have their whole lived story heard. AyuCase brings peace of mind to patients and precision to clinicians by uniting subjective lived experiences, voice narratives, laboratory telemetry, and longitudinal timelines into one clear, cohesive clinical picture.
          </p>
        </div>

        {/* 3 Core Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          <AyuCard variant="default" padding="lg" className="space-y-4 border border-slate-200/80 dark:border-slate-800">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Patient-Led Health Preservation
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              We empower patients to share symptom progressions in their authentic voice, preserving vital nuances—such as daily functional impact and lifestyle triggers—that standard medical forms overlook.
            </p>
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> Multilingual Guided Voice & Text
            </div>
          </AyuCard>

          <AyuCard variant="default" padding="lg" className="space-y-4 border border-slate-200/80 dark:border-slate-800">
            <div className="w-12 h-12 rounded-2xl bg-teal-100 dark:bg-teal-950/70 text-teal-600 dark:text-teal-400 flex items-center justify-center">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Contradiction-Free Precision
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Our clinical informatics engine correlates self-reported symptoms with objective laboratory panels, Holter ECGs, and imaging findings, highlighting variances to prevent diagnostic delay and blind spots.
            </p>
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-xs font-semibold text-teal-600 dark:text-teal-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> 3-Panel Physician Diagnostic Radar
            </div>
          </AyuCard>

          <AyuCard variant="default" padding="lg" className="space-y-4 border border-slate-200/80 dark:border-slate-800">
            <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Universal Dignity & Sovereignty
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Equipped with high-contrast Elder Mode, tactile screen-reader acoustics, and revocable granular consent, AyuCase ensures health equity for every age, ability, and cultural background.
            </p>
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-xs font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> Zero-Knowledge Consent Controls
            </div>
          </AyuCard>
        </div>

        {/* Impact Numbers */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 rounded-2xl bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800">
          <div className="text-center space-y-1">
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">94%</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Faster Case Prep Time</div>
          </div>
          <div className="text-center space-y-1">
            <div className="text-2xl sm:text-3xl font-extrabold text-teal-600 dark:text-teal-400">100%</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Client-Side Data Privacy</div>
          </div>
          <div className="text-center space-y-1">
            <div className="text-2xl sm:text-3xl font-extrabold text-cyan-600 dark:text-cyan-400">6+</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Integrated Global Languages</div>
          </div>
          <div className="text-center space-y-1">
            <div className="text-2xl sm:text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">0 ms</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Third-Party Tracking Leaks</div>
          </div>
        </div>
      </section>

      {/* Contact Us Section */}
      <section id="contact" className="space-y-10 pt-6 scroll-mt-24">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <AyuBadge variant="teal" size="md">Direct Communication</AyuBadge>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Contact Our Clinical & Support Team
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
            Whether you have questions about using AyuCase, clinical deployment in your practice, or partnership opportunities, we are here to support you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Contact Information & Channels */}
          <div className="lg:col-span-5 space-y-4">
            <AyuCard variant="default" padding="lg" className="space-y-6 border border-slate-200/80 dark:border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Mail className="w-5 h-5 text-emerald-500" />
                  Get in Touch
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Our clinical informatics and technical staff typically respond within 24 business hours.
                </p>
              </div>

              <div className="space-y-4 text-xs sm:text-sm">
                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                  <Mail className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-slate-100">Electronic Mail</div>
                    <a href="mailto:support@ayucase.health" className="text-emerald-600 dark:text-emerald-400 hover:underline">
                      support@ayucase.health
                    </a>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Clinical Partnerships: <a href="mailto:clinical@ayucase.health" className="underline">clinical@ayucase.health</a>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                  <Phone className="w-5 h-5 text-teal-500 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-slate-100">Toll-Free Patient & Clinic Desk</div>
                    <div className="text-slate-700 dark:text-slate-300 font-mono">+1 (800) 555-AYUC (2982)</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Monday – Friday: 8:00 AM – 8:00 PM EST
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                  <MapPin className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-slate-100">Health Informatics Center</div>
                    <div className="text-slate-600 dark:text-slate-400 text-xs mt-0.5">
                      AyuCase Clinical Technologies Lab<br />
                      Biomedical Innovation Hub • Boston & San Francisco
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-800 dark:text-amber-300 space-y-1">
                <span className="font-bold flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-amber-500 shrink-0" />
                  Emergency Medical Notice:
                </span>
                <p className="text-[11px] leading-relaxed">
                  AyuCase provides clinical health intelligence and timeline synthesis. If you are experiencing a life-threatening medical emergency, please call 911 or visit the nearest emergency room immediately.
                </p>
              </div>
            </AyuCard>
          </div>

          {/* Interactive Form */}
          <div className="lg:col-span-7">
            <AyuCard variant="default" padding="lg" className="space-y-5 border border-slate-200/80 dark:border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  Send a Direct Message
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Fill out the form below and our team will get back to you with guidance or clinical sandbox access details.
                </p>
              </div>

              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Your Full Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      placeholder="e.g. Dr. Eleanor Vance or Aarav Chen"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Email Address <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      placeholder="you@domain.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      I Am Inquiring As
                    </label>
                    <select
                      value={contactForm.role}
                      onChange={(e) => setContactForm({ ...contactForm, role: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                    >
                      <option value="Patient / Caregiver">Patient / Family Caregiver</option>
                      <option value="Physician / Clinician">Physician / Clinician</option>
                      <option value="Hospital / Health System">Hospital / Health System</option>
                      <option value="Researcher / Academic">Research / Academic Partner</option>
                      <option value="Accessibility Inquirer">Accessibility Feedback</option>
                      <option value="Other">Other Inquiry</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Subject
                    </label>
                    <input
                      type="text"
                      value={contactForm.subject}
                      onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                      placeholder="e.g. Clinical Workstation Integration"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Your Message <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    placeholder="Tell us about your case, clinic workflow requirements, or questions..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 resize-y"
                  />
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                  <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Your contact details remain strictly confidential.</span>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmittingContact}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-md shadow-emerald-600/20 hover:shadow-lg transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isSubmittingContact ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Transmitting...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </AyuCard>
          </div>
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
          <a href="#about" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
            About Us
          </a>
          <a href="#contact" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
            Contact Us
          </a>
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
