export interface GuidedVisitStep {
  stepNumber: number
  title: string
  subtitle: string
  audioPrompt: string
  patientQuestion?: string
  sampleOptions?: string[]
  completed: boolean
}

export interface ElderMedicationReminder {
  id: string
  timeOfDay: 'Morning' | 'Afternoon' | 'Night' | 'As Needed'
  timeLabel: string
  name: string
  dosage: string
  instructions: string
  pillAppearance: string
  pillColor: string
  isTakenToday: boolean
  takenAt?: string
}

export interface WellBeingCheckin {
  id: string
  timestamp: string
  status: 'good' | 'mild_discomfort' | 'unwell'
  label: string
  note?: string
}

export interface FamilyAssistMessage {
  id: string
  senderName: string
  relationship: string
  timestamp: string
  message: string
  hasRead: boolean
}

// SIMPLEVIEW: Jargon to Patient-Friendly Language Mappings
export const SIMPLE_VIEW_MAPPINGS: Record<string, string> = {
  'Neurovascular Hemicrania': 'Severe one-sided throbbing headache',
  'Scintillating Scotoma with Visual Aura': 'Flashing lights or zig-zag patterns in your sight',
  'Cardiovagal Dysautonomia': 'Changes in heart rate and blood pressure balance',
  'Prophylactic Beta-Blockade Titration': 'Daily medicine taken to stop headaches before they start',
  '5-HT1B/1D Receptor Agonist (Triptan)': 'Quick relief tablet to stop pain once it begins',
  'Valsalva Ratio 1.34': 'Breathing and pulse reflex test result',
  'Ambulatory Blood Pressure Telemetry': '24-hour continuous blood pressure check',
  'Overnight Sleep Polysomnography': 'Overnight hospital sleep check',
  'HPI (History of Present Illness)': 'How your illness started and changed over time',
  'Proband': 'You (the patient)',
  'Familial Channelopathy Predisposition': 'Family tendency toward migraine sensitivity',
  'ICD-11 & ICHD-3 Grounding': 'Doctor-approved clinical checklist',
  'Normative Parenchymal Architecture': 'Your brain tissue looks healthy and normal on the scan',
  'Subacute Progression': 'Gradual worsening over several weeks or months',
}

export const GUIDED_VISIT_STEPS: GuidedVisitStep[] = [
  {
    stepNumber: 1,
    title: 'Step 1: Welcome',
    subtitle: 'We are here to help you get ready for Dr. Priya Sharma.',
    audioPrompt:
      'Hello Aarav. Welcome to your guided visit. We will take care of everything step by step. You can speak to answer or tap the large buttons.',
    completed: true,
  },
  {
    stepNumber: 2,
    title: "Step 2: Tell us why you're here",
    subtitle: 'Describe how your head and body are feeling.',
    audioPrompt:
      'Please tell us what brings you in today. Are the headaches bothering you on the left side, or has anything new started?',
    patientQuestion: 'How have your headaches been feeling lately?',
    sampleOptions: [
      'Throbbing pain on the left side',
      'Flashing lights in my eyes',
      'Feeling better after my morning pills',
    ],
    completed: true,
  },
  {
    stepNumber: 3,
    title: 'Step 3: Previous reports',
    subtitle: 'We found 3 medical reports from your doctors.',
    audioPrompt:
      'We have your brain MRI scan from Apollo Hospital, your reflex test, and your prescription. All three reports are ready for your doctor.',
    completed: true,
  },
  {
    stepNumber: 4,
    title: 'Step 4: Current medicines',
    subtitle: 'Check the medicines you take every day.',
    audioPrompt:
      'You take Propranolol twice a day, in the morning and at night. Did you take your morning pill with breakfast today?',
    patientQuestion: 'Have you taken your morning medicines today?',
    sampleOptions: ['Yes, I took them with breakfast', 'No, not yet', 'I need help checking'],
    completed: false,
  },
  {
    stepNumber: 5,
    title: 'Step 5: Review information',
    subtitle: 'Look over everything in simple, clear words.',
    audioPrompt:
      'Here is what Dr. Priya Sharma will read. It is written in simple words, and your exact statements are kept safe.',
    completed: false,
  },
  {
    stepNumber: 6,
    title: 'Step 6: Ready for physician',
    subtitle: 'Your case summary is ready for your appointment.',
    audioPrompt:
      'You are all finished. Dr. Priya Sharma has your full story. We will send a quiet reminder 30 minutes before your appointment.',
    completed: false,
  },
]

export const ELDER_MEDICATIONS: ElderMedicationReminder[] = [
  {
    id: 'med-morning',
    timeOfDay: 'Morning',
    timeLabel: '8:00 AM (After Breakfast)',
    name: 'Propranolol (Daily Shield)',
    dosage: '40mg • 1 Round Pink Pill',
    instructions: 'Take 1 pill with a full glass of water after breakfast to prevent headaches.',
    pillAppearance: 'Round pink tablet',
    pillColor: 'rose',
    isTakenToday: true,
    takenAt: '8:25 AM',
  },
  {
    id: 'med-afternoon',
    timeOfDay: 'Afternoon',
    timeLabel: '2:00 PM (Hydration Reminder)',
    name: 'Water & Rest Check',
    dosage: '2 Full Glasses of Water',
    instructions: 'Drink plenty of water and rest your eyes away from bright computer screens.',
    pillAppearance: 'Tall glass of cool water',
    pillColor: 'cyan',
    isTakenToday: false,
  },
  {
    id: 'med-night',
    timeOfDay: 'Night',
    timeLabel: '9:00 PM (Before Sleep)',
    name: 'Propranolol & Magnesium',
    dosage: '40mg Tablet + 400mg White Capsule',
    instructions: 'Take with a little water before going to bed. Helps your sleep and brain calm down.',
    pillAppearance: '1 pink tablet + 1 white capsule',
    pillColor: 'indigo',
    isTakenToday: false,
  },
  {
    id: 'med-prn',
    timeOfDay: 'As Needed',
    timeLabel: 'Only When Severe Pain or Lights Start',
    name: 'Rizatriptan (Fast Pain Relief)',
    dosage: '10mg • Fast-Melt Tablet',
    instructions: 'Place 1 tablet under your tongue if you see flashing lights or feel throbbing pain.',
    pillAppearance: 'Small white melting tablet',
    pillColor: 'amber',
    isTakenToday: false,
  },
]
