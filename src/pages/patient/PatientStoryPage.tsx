import React from 'react'
import { StoryHeader } from '../../components/story/StoryHeader'
import { StorySummary } from '../../components/story/StorySummary'
import { EpisodeAnalysis } from '../../components/story/EpisodeAnalysis'
import { PatientVoicePreservation } from '../../components/story/PatientVoicePreservation'
import { SymptomTimeline } from '../../components/story/SymptomTimeline'
import { DocumentsSummary } from '../../components/story/DocumentsSummary'
import { DailyImpact } from '../../components/story/DailyImpact'
import { FamilyHistorySection } from '../../components/story/FamilyHistorySection'
import { MedicationExperience } from '../../components/story/MedicationExperience'
import { UnknownZoneSection } from '../../components/story/UnknownZoneSection'
import { CaseCompletenessSection } from '../../components/story/CaseCompletenessSection'
import { usePatient } from '../../contexts/PatientContext'

export const PatientStoryPage: React.FC = () => {
  const { patient } = usePatient()

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16">
      {/* Story Header with Breadcrumbs, Export/Share actions, Clinical protocol notice, and Jump-to navigation */}
      <StoryHeader onScrollToSection={scrollToSection} />

      {/* Section 1: Patient Profile & Emotional Anchor Banner */}
      <StorySummary patient={patient} />

      {/* Section 2: Chief Concern & Episode Analysis */}
      <EpisodeAnalysis />

      {/* Section 3: Patient Statements & Voice Preservation */}
      <PatientVoicePreservation />

      {/* Section 4: Longitudinal Medical Timeline */}
      <SymptomTimeline />

      {/* Section 5: Diagnostic Documents & Records */}
      <DocumentsSummary />

      {/* Section 6: History of Present Illness (HPI) */}
      <DailyImpact />

      {/* Section 7: Family History & Pedigree Tree */}
      <FamilyHistorySection />

      {/* Section 8: Medication History & Adverse Reactions */}
      <MedicationExperience />

      {/* Section 9: Unknown Zone & Missing Information Gaps */}
      <UnknownZoneSection />

      {/* Section 10: Case Completeness, Case DNA & Gap Detector */}
      <CaseCompletenessSection />
    </div>
  )
}
