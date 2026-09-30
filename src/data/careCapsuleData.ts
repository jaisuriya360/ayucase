import type { PatientProfile } from '../types/patient'
import type { ConsentPermissionKey, PermissionState } from '../types/consent'
import type { CareCapsuleData } from '../types/careCapsule'

export const getCareCapsuleData = (
  patient: PatientProfile,
  permissions: Record<ConsentPermissionKey, PermissionState>,
  witnessHash: string
): CareCapsuleData => {
  return {
    capsuleId: `CAPSULE-${patient.fictionalId || 'DEMO-9042'}`,
    generatedAt: new Date().toISOString(),
    demoBadge: 'Demo / Prototype Data',
    privacyIndicator: 'Your information is shown in this prototype using fictional data.',
    interoperabilityDisclaimer:
      'Notice: AyuCase prototype does not claim interoperability with real medical systems (ABDM, ABHA, or EHR backends).',

    patientProfile: {
      id: patient.id,
      fictionalId: patient.fictionalId,
      name: patient.name,
      age: patient.age,
      gender: patient.gender,
      bloodGroup: patient.bloodGroup,
      contactMasked: patient.contactMasked,
      emergencyContact: patient.emergencyContact || 'Maya Chen (Spouse) +91 9840X-XXXX9',
      primaryCondition: patient.primaryCondition,
      allergies: patient.allergies || ['Penicillin', 'Sulfa Drugs'],
      currentMedications: patient.currentMedications || [
        'Propranolol 40mg (Twice daily)',
        'Magnesium Glycinate 400mg (Nightly)',
        'Rizatriptan 10mg (PRN for acute attacks)',
      ],
      attendingPhysician: 'Dr. Elena Vance, MD (Chief of Clinical Neurology)',
    },

    timeline: [
      {
        id: 'cap-tl-1',
        year: '2021',
        date: '14 Oct 2021',
        title: 'Emergency Care Evaluation for Acute Cephalea',
        category: 'Emergency Encounter',
        description: 'First documented onset of severe left-sided orbital throbbing headache accompanied by nausea and photophobia.',
        status: 'Completed',
      },
      {
        id: 'cap-tl-2',
        year: '2023',
        date: '08 Mar 2023',
        title: 'Outpatient Neurology Workup & Diagnostic Ingestion',
        category: 'Neurological Evaluation',
        description: 'Comprehensive neurological assessment. Diagnostic ingestion of prior discharge summaries and initiation of migraine prophylaxis.',
        status: 'Completed',
      },
      {
        id: 'cap-tl-3',
        year: '2025',
        date: '19 Nov 2025',
        title: 'Wearable Biosensor & Circadian Sleep Telemetry Sync',
        category: 'Telemetry Integration',
        description: 'Continuous smartwatch telemetry data ingested, showing nocturnal blood pressure non-dipping patterns correlating with next-day attacks.',
        status: 'Completed',
      },
      {
        id: 'cap-tl-4',
        year: '2026',
        date: '23 Sep 2026',
        title: 'Active AyuCase Clinical Synthesis & Confirmation',
        category: 'Case Intelligence',
        description: 'Multimodal intake synthesis linking voice interview narratives with 3T MRI imaging and verified prescription regimens.',
        status: 'Completed',
      },
    ],

    patientStatements: [
      {
        id: 'stmt-1',
        quote: 'I get this intense throbbing pain on the left side of my head, right behind my eye.',
        context: 'Chief Complaint — Phased Hemicrania',
        timestamp: '2026-09-23T09:12:00Z',
        modality: 'Voice Recording',
        verified: true,
      },
      {
        id: 'stmt-2',
        quote: 'Before the headache hits, I see zigzag lines and bright flashes for about 20 minutes.',
        context: 'Aura Description — Typical Visual Aura',
        timestamp: '2026-09-23T09:13:30Z',
        modality: 'Voice Recording',
        verified: true,
      },
      {
        id: 'stmt-3',
        quote: 'I usually notice the flare-ups after long work shifts or when I skip breakfast.',
        context: 'Precipitating Factors & Circadian Stressors',
        timestamp: '2026-09-23T09:14:15Z',
        modality: 'Voice Recording',
        verified: true,
      },
      {
        id: 'stmt-4',
        quote: 'Bright computer monitors make it completely unbearable; I have to lie down in a dark, quiet room.',
        context: 'Sensory Hypersensitivity — Photophobia',
        timestamp: '2026-09-23T09:15:00Z',
        modality: 'Typed Input',
        verified: true,
      },
    ],

    documents: [
      {
        id: 'doc-cap-1',
        title: 'Brain_MRI_3T_Neurovascular_Report.pdf',
        category: 'Diagnostic Imaging',
        date: '04 Jul 2026',
        pages: 3,
        status: 'Verified',
        extractionScore: 99,
      },
      {
        id: 'doc-cap-2',
        title: 'Comprehensive_Autonomic_Reflex_Screen.pdf',
        category: 'Diagnostic Laboratory',
        date: '18 Jul 2026',
        pages: 2,
        status: 'Verified',
        extractionScore: 97,
      },
      {
        id: 'doc-cap-3',
        title: 'Prescription_Neurology_Regimen_2026.pdf',
        category: 'Pharmacological Order',
        date: '15 Aug 2026',
        pages: 2,
        status: 'Verified',
        extractionScore: 98,
      },
      {
        id: 'doc-cap-4',
        title: 'Comprehensive_Metabolic_Panel_Jan2026.pdf',
        category: 'Biochemical Pathology',
        date: '14 Jan 2026',
        pages: 1,
        status: 'Verified',
        extractionScore: 96,
      },
    ],

    consentStatus: {
      permissions,
      witnessHash: witnessHash || '0x8F4B...99A1',
      lastUpdated: new Date().toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
    },

    missingInformation: [
      {
        id: 'miss-1',
        parameter: '48-Hour Ambulatory Blood Pressure Telemetry',
        category: 'Telemetry Tele-Check',
        impact: 'Needed to formally verify nocturnal circadian dipping vs autonomic dysregulation.',
        status: 'Pending Patient Sync',
      },
      {
        id: 'miss-2',
        parameter: 'Pediatric & Childhood Neurological History',
        category: 'Past Medical History',
        impact: 'Assists in ruling out familial hemiplegic migraine variants.',
        status: 'Unrecorded',
      },
      {
        id: 'miss-3',
        parameter: 'Serum Magnesium & Vitamin D3 Panels',
        category: 'Biochemical Markers',
        impact: 'Baseline micro-nutrient levels before escalating migraine prophylactic dosage.',
        status: 'Pending Patient Sync',
      },
    ],

    physicianReview: {
      reviewStatus: 'Formally Confirmed',
      attendingPhysician: 'Dr. Elena Vance, MD',
      specialty: 'Department of Clinical Neurology & Neurovascular Medicine',
      lastReviewedDate: '23 Sep 2026',
      electronicSignatureHash: '0x7b4a2e8810c9',
      clinicalImpressionSummary:
        'Clinical presentation is consistent with Episodic Migraine with Typical Aura (ICHD-3 1.2.1.1). Structural brain neuroimaging confirms normal parenchyma and vasculature. Patient-reported narrative is corroborated by uploaded clinical prescriptions.',
    },
  }
}
