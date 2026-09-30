export type DocumentStatus = 'Uploading' | 'Processing' | 'Completed' | 'Failed'

export type DocumentType =
  | 'Imaging'
  | 'Lab Report'
  | 'Prescription'
  | 'Discharge Summary'

export type FileFormat = 'PDF' | 'JPG' | 'PNG'

export interface KeyFinding {
  id: string
  title: string
  value: string
  pageNumber: number
  category: string
  confidence: number
}

export interface ExtractedMedication {
  id: string
  name: string
  dosage: string
  frequency: string
  pageNumber: number
  prescribedBy: string
}

export interface ExtractedLabValue {
  id: string
  test: string
  result: string
  unit: string
  referenceRange: string
  flag: 'Normal' | 'High' | 'Low'
  pageNumber: number
}

export interface ExtractedDiagnosis {
  id: string
  code?: string
  description: string
  severity: 'Mild' | 'Moderate' | 'Severe' | 'Normal'
  pageNumber: number
}

export interface ExtractedDocumentMetadata {
  summary: string
  confidenceScore: number // 0-100 percentage
  keyFindings: KeyFinding[]
  medications: ExtractedMedication[]
  labValues: ExtractedLabValue[]
  diagnoses: ExtractedDiagnosis[]
  performedBy: string
  examinationDate: string
}

export interface MedicalDocument {
  id: string
  name: string
  date: string
  type: DocumentType
  fileFormat: FileFormat
  fileSize: string
  status: DocumentStatus
  source: string // e.g. "AyuCare Advanced Diagnostics", "Dr. Elena Vance Clinic"
  pageCount: number
  uploadProgress?: number // 0-100
  failureReason?: string
  extractedData?: ExtractedDocumentMetadata
}

export interface SourceTraceabilityItem {
  id: string
  itemType: 'Medication' | 'Finding' | 'Lab Result' | 'Diagnosis'
  title: string
  value: string
  documentId: string
  documentName: string
  pageNumber: number
  snippet: string
  date: string
}

export const INITIAL_DOCUMENTS: MedicalDocument[] = [
  {
    id: 'doc-mri',
    name: 'Brain MRI 3T Volumetric Protocol.pdf',
    date: '2026-07-04',
    type: 'Imaging',
    fileFormat: 'PDF',
    fileSize: '14.2 MB',
    status: 'Completed',
    source: 'AyuCare Advanced Diagnostics',
    pageCount: 3,
    extractedData: {
      summary: 'High-resolution neuroimaging showing normal intracranial parenchyma and intact cerebrovascular flow voids.',
      confidenceScore: 98.7,
      performedBy: 'Dr. Rajesh Nair, MD (Neuroradiology)',
      examinationDate: '2026-07-04',
      keyFindings: [
        {
          id: 'kf-1',
          title: 'Cerebrovascular Flow',
          value: 'Patent major intracranial arteries with symmetric circle of Willis.',
          pageNumber: 1,
          category: 'Vascular',
          confidence: 99,
        },
        {
          id: 'kf-2',
          title: 'White Matter Integrity',
          value: 'No demyelination, infarcts, or parenchymal mass effect observed.',
          pageNumber: 2,
          category: 'Structural',
          confidence: 98,
        },
        {
          id: 'kf-3',
          title: 'Sinonasal Passages',
          value: 'Minimal mucosal thickening in left maxillary sinus, non-obstructive.',
          pageNumber: 3,
          category: 'Incidental',
          confidence: 96,
        },
      ],
      medications: [],
      labValues: [],
      diagnoses: [
        {
          id: 'diag-1',
          code: 'G43.109',
          description: 'Absence of structural lesion; consistent with primary neurovascular cephalea',
          severity: 'Normal',
          pageNumber: 1,
        },
      ],
    },
  },
  {
    id: 'doc-autonomic',
    name: 'Comprehensive Autonomic Reflex Screen.pdf',
    date: '2026-07-18',
    type: 'Lab Report',
    fileFormat: 'PDF',
    fileSize: '2.8 MB',
    status: 'Completed',
    source: 'NeuroVascular Analytics Lab',
    pageCount: 2,
    extractedData: {
      summary: 'Autonomic battery demonstrating mild cardiovagal hypo-reactivity with post-orthostatic pulse variation.',
      confidenceScore: 97.4,
      performedBy: 'Prof. K. Sundar, DNB (Autonomic Neurology)',
      examinationDate: '2026-07-18',
      keyFindings: [
        {
          id: 'kf-4',
          title: 'Valsalva Ratio',
          value: 'Valsalva ratio 1.34 (Borderline adrenergic response to strain phase IV).',
          pageNumber: 1,
          category: 'Cardiovagal',
          confidence: 97,
        },
        {
          id: 'kf-5',
          title: 'Quantitative Sudomotor Axon Reflex (QSART)',
          value: 'Normal sweat output at forearm and proximal foot.',
          pageNumber: 2,
          category: 'Postganglionic Sympathetic',
          confidence: 98,
        },
      ],
      medications: [],
      labValues: [
        {
          id: 'lab-1',
          test: 'Supine Heart Rate',
          result: '72',
          unit: 'BPM',
          referenceRange: '60-100',
          flag: 'Normal',
          pageNumber: 1,
        },
        {
          id: 'lab-2',
          test: 'Tilt-Table 10-Min Pulse Delta',
          result: '+24',
          unit: 'BPM',
          referenceRange: '< 30',
          flag: 'Normal',
          pageNumber: 2,
        },
      ],
      diagnoses: [
        {
          id: 'diag-2',
          code: 'G90.9',
          description: 'Mild autonomic hemodynamic lability with vasomotor migraine correlation',
          severity: 'Mild',
          pageNumber: 1,
        },
      ],
    },
  },
  {
    id: 'doc-rx',
    name: 'Prescription.pdf',
    date: '2026-08-15',
    type: 'Prescription',
    fileFormat: 'PDF',
    fileSize: '480 KB',
    status: 'Completed',
    source: 'Dr. Elena Vance Clinic',
    pageCount: 2,
    extractedData: {
      summary: 'Quarterly titration plan for autonomic stabilization and acute migraine abortive therapy.',
      confidenceScore: 99.2,
      performedBy: 'Dr. Elena Vance, MD (Neurologist)',
      examinationDate: '2026-08-15',
      keyFindings: [
        {
          id: 'kf-6',
          title: 'Therapeutic Strategy',
          value: 'Prophylactic beta-adrenergic blockade combined with circadian hydration.',
          pageNumber: 1,
          category: 'Management Protocol',
          confidence: 99,
        },
      ],
      medications: [
        {
          id: 'med-1',
          name: 'Propranolol',
          dosage: '40 mg',
          frequency: 'Twice daily with meals',
          pageNumber: 1,
          prescribedBy: 'Dr. Elena Vance, MD',
        },
        {
          id: 'med-2',
          name: 'Rizatriptan',
          dosage: '10 mg',
          frequency: 'At first sign of visual aura (Max 20mg/24hr)',
          pageNumber: 2,
          prescribedBy: 'Dr. Elena Vance, MD',
        },
        {
          id: 'med-3',
          name: 'Magnesium Glycinate',
          dosage: '400 mg',
          frequency: 'Nightly before sleep',
          pageNumber: 2,
          prescribedBy: 'Dr. Elena Vance, MD',
        },
      ],
      labValues: [],
      diagnoses: [
        {
          id: 'diag-3',
          code: 'G43.009',
          description: 'Recurrent migraine with visual aura; vasospastic variant',
          severity: 'Moderate',
          pageNumber: 1,
        },
      ],
    },
  },
]
