export interface StructuredEntity {
  field: string
  value: string
  category: string
  confidence: number // percentage 0-100
  clinicalTags: string[]
}

export interface SampleVoiceResponse {
  label: string
  statement: string
  structured: StructuredEntity
}

export interface InterviewQuestion {
  id: string
  order: number
  prompt: string
  taPrompt: string
  category: string
  expectedField: string
  subtitle: string
  sampleResponses: SampleVoiceResponse[]
}

export interface InterviewAnswer {
  questionId: string
  patientStatement: string // Preserves original verbatim patient statement
  structuredData: StructuredEntity // Extracted structured information
  recordedAt: string
  isEdited: boolean
  inputMode: 'voice' | 'typed' | 'demo'
  audioDurationSeconds?: number
}

export interface InterviewState {
  activeQuestionIndex: number
  answers: Record<string, InterviewAnswer>
  isComplete: boolean
  lastUpdated: string
}

export const INTERVIEW_QUESTIONS: InterviewQuestion[] = [
  {
    id: 'q1',
    order: 1,
    prompt: 'What brings you here today?',
    taPrompt: 'இன்று நீங்கள் எதற்காக ஆலோசனை பெற வந்துள்ளீர்கள்?',
    category: 'Chief Complaint',
    expectedField: 'Chief Concern',
    subtitle: 'Describe the main discomfort, pain, or health episode you are experiencing.',
    sampleResponses: [
      {
        label: 'Severe Throbbing Migraine',
        statement: "I've been having intense throbbing pain on the left side of my head with flashing lights before it starts.",
        structured: {
          field: 'Chief Concern',
          value: 'Left-sided throbbing hemicrania with visual aura',
          category: 'Neurological / Cephalea',
          confidence: 97,
          clinicalTags: ['Hemicrania', 'Visual Aura', 'Photophobia'],
        },
      },
      {
        label: 'Bilateral Joint Stiffness',
        statement: 'My knees feel very stiff and swollen in the mornings, making it difficult to climb stairs.',
        structured: {
          field: 'Chief Concern',
          value: 'Bilateral knee joint stiffness and mobility restriction',
          category: 'Orthopedic / Rheumatology',
          confidence: 94,
          clinicalTags: ['Joint Stiffness', 'Weight-bearing Pain', 'Morning Immobility'],
        },
      },
    ],
  },
  {
    id: 'q2',
    order: 2,
    prompt: 'How long have you experienced this?',
    taPrompt: 'இந்த அறிகுறி உங்களுக்கு எவ்வளவு காலமாக உள்ளது?',
    category: 'Symptom Chronology',
    expectedField: 'Duration',
    subtitle: 'When did it first begin, and has the frequency changed over time?',
    sampleResponses: [
      {
        label: 'Around Two Months (Prompt Example)',
        statement: "I've had this for around two months, especially worsening during high workload weeks.",
        structured: {
          field: 'Duration',
          value: '2 months (Subacute progressive)',
          category: 'Chronology',
          confidence: 98,
          clinicalTags: ['Duration: 60 Days', 'Stress Correlated', 'Episodic Escalation'],
        },
      },
      {
        label: 'Three Weeks Post-Flu',
        statement: 'It started about three weeks ago right after a viral fever episode.',
        structured: {
          field: 'Duration',
          value: '3 weeks (Post-infectious onset)',
          category: 'Chronology',
          confidence: 95,
          clinicalTags: ['Duration: 21 Days', 'Post-viral', 'Recent Onset'],
        },
      },
    ],
  },
  {
    id: 'q3',
    order: 3,
    prompt: 'Have you visited a doctor previously?',
    taPrompt: 'இதற்கு முன் ஏதேனும் மருத்துவரை அணுகினீர்களா?',
    category: 'Prior Clinical Consultations',
    expectedField: 'Prior Consultation',
    subtitle: 'Mention any previous specialist visits, hospitals, or primary care opinions.',
    sampleResponses: [
      {
        label: 'Consulted Neurologist at Apollo',
        statement: 'I saw Dr. Kumar at Apollo Hospital in July, who ordered a brain MRI and advised stress reduction.',
        structured: {
          field: 'Prior Consultation',
          value: 'Dr. Kumar (Apollo Hospital, July 2026)',
          category: 'Clinical Workup',
          confidence: 96,
          clinicalTags: ['Neurology Specialist', 'Brain MRI Ordered', 'Outpatient Followup'],
        },
      },
      {
        label: 'General Practitioner Consultation',
        statement: 'I only visited my local clinic doctor last month who prescribed temporary analgesics.',
        structured: {
          field: 'Prior Consultation',
          value: 'Primary Care Physician (August 2026)',
          category: 'Primary Care',
          confidence: 92,
          clinicalTags: ['Primary Care', 'Short-term Analgesic', 'No Imaging Yet'],
        },
      },
    ],
  },
  {
    id: 'q4',
    order: 4,
    prompt: 'Are you currently taking any medicines?',
    taPrompt: 'தற்போது ஏதேனும் மருந்துகள் அல்லது மாத்திரைகள் உட்கொள்கிறீர்களா?',
    category: 'Active Pharmacotherapy',
    expectedField: 'Active Medications',
    subtitle: 'Include daily prescriptions, over-the-counter tablets, supplements, or SOS pain relievers.',
    sampleResponses: [
      {
        label: 'Propranolol & Rizatriptan',
        statement: 'I take Propranolol 40 milligrams twice daily and Rizatriptan 10 milligrams when an attack peaks.',
        structured: {
          field: 'Active Medications',
          value: 'Propranolol 40mg BID, Rizatriptan 10mg PRN',
          category: 'Pharmacology',
          confidence: 99,
          clinicalTags: ['Beta-blocker Prophylaxis', 'Triptan Abortive', 'Twice Daily'],
        },
      },
      {
        label: 'Telmisartan & Pain Reliever',
        statement: 'I take Telmisartan 40mg every morning for blood pressure, and Paracetamol as needed.',
        structured: {
          field: 'Active Medications',
          value: 'Telmisartan 40mg daily, Paracetamol 650mg PRN',
          category: 'Cardiovascular / Analgesia',
          confidence: 96,
          clinicalTags: ['ARB Antihypertensive', 'Acetaminophen PRN'],
        },
      },
    ],
  },
  {
    id: 'q5',
    order: 5,
    prompt: 'Do you have previous medical records?',
    taPrompt: 'உங்களிடம் முந்தைய மருத்துவ அறிக்கைகள் அல்லது பரிசோதனைத் தாள்கள் உள்ளனவா?',
    category: 'Diagnostic Records',
    expectedField: 'Document Availability',
    subtitle: 'Mention any lab tests, scans, discharge summaries, or physical copies you possess.',
    sampleResponses: [
      {
        label: 'Brain MRI & Autonomic Screen',
        statement: 'Yes, I have the full 3T Brain MRI report and an autonomic reflex screen from August in PDF format.',
        structured: {
          field: 'Document Availability',
          value: 'Brain MRI 3T Report & Autonomic Reflex Screen on file',
          category: 'Diagnostics',
          confidence: 97,
          clinicalTags: ['3T Neuroimaging', 'Autonomic Screen', 'Digital PDF Ready'],
        },
      },
      {
        label: 'Recent Blood Work & X-Rays',
        statement: 'I have my complete blood count lab results and knee standing radiographs.',
        structured: {
          field: 'Document Availability',
          value: 'Complete Blood Count & Weight-bearing X-Ray films',
          category: 'Diagnostics',
          confidence: 94,
          clinicalTags: ['Hematology Lab', 'Plain Radiography'],
        },
      },
    ],
  },
  {
    id: 'q6',
    order: 6,
    prompt: 'Is there anything else you would like your physician to know?',
    taPrompt: 'உங்கள் மருத்துவரிடம் தெரிவிக்க விரும்பும் வேறு ஏதேனும் கூடுதல் தகவல்கள் உள்ளதா?',
    category: 'Context & Lifestyle Modifiers',
    expectedField: 'Context / Triggers',
    subtitle: 'Share lifestyle triggers, dietary correlations, sleep changes, or personal wellness goals.',
    sampleResponses: [
      {
        label: 'After Meals & Screen Fatigue (Prompt Example)',
        statement: 'I usually notice it after eating heavy oily meals, and working long hours under fluorescent lights.',
        structured: {
          field: 'Context',
          value: 'After meals & extended fluorescent lighting exposure',
          category: 'Environmental / Dietary',
          confidence: 96,
          clinicalTags: ['Postprandial Trigger', 'Photostimulation', 'Occupational Strain'],
        },
      },
      {
        label: 'Sleep Disruption & Temple Walk Goal',
        statement: 'My sleep is frequently broken by night sweats, and my main goal is to walk comfortably without pain.',
        structured: {
          field: 'Context',
          value: 'Nocturnal sleep fragmentation; Primary goal is independent ambulation',
          category: 'Lifestyle & Quality of Life',
          confidence: 95,
          clinicalTags: ['Sleep Fragmentation', 'Functional Goal: Walking', 'Independent Mobility'],
        },
      },
    ],
  },
]
